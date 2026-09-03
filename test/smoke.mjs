// Basit duman testi: index.html'i jsdom'a yükler, ekranların DOM'da olduğunu ve
// bir oyun turunun award()'a ulaşıp state/localStorage güncellediğini doğrular.
// Çalıştır: node test/smoke.mjs
//
// Not: jsdom'da her ayrı window.eval() çağrısı kendi izole `let`/`const`
// kapsamını alır (önceki çağrılardaki lexical bağlamlar görünmez olur), bu yüzden
// betiği yükleme ve test adımlarının TAMAMI TEK bir eval çağrısında birleştirilir.
import { JSDOM } from 'jsdom';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(join(__dirname, '..', 'index.html'), 'utf8');

const dom = new JSDOM(html, { url: 'http://localhost/', runScripts: 'outside-only' });
const { window } = dom;

// jsdom'da bulunmayan/eksik tarayıcı API'lerini gerçekçi kök nesnelerle taklit et.
window.matchMedia = window.matchMedia || (() => ({
  matches: false, addListener() {}, removeListener() {},
  addEventListener() {}, removeEventListener() {},
}));
delete window.speechSynthesis; // 'speechSynthesis' in window => false, kod TTS'i atlar
window.scrollTo = () => {};
window.HTMLElement.prototype.scrollIntoView = window.HTMLElement.prototype.scrollIntoView || (() => {});

const scriptMatch = html.match(/<script>([\s\S]*)<\/script>/);
if (!scriptMatch) {
  console.error('  ✗ index.html içinde <script> bloğu bulunamadı');
  process.exit(1);
}

const testDriver = `
(function(){
  const results = [];
  function check(name, cond){ results.push({name, pass: !!cond}); }

  // --- 1) Temel ekranlar DOM'da mevcut mu? ---
  ['s-start','s-mode','s-map','s-free','s-game','s-done','s-parent'].forEach(id=>{
    check("#" + id + " ekranı DOM'da", !!document.getElementById(id));
  });
  check('5 ebeveyn sekmesi (#ptabs .ptab) mevcut', document.querySelectorAll('#ptabs .ptab').length === 5);

  // --- 2) Ebeveyn sekmeleri çalışıyor ve 14 günlük grafik render ediliyor mu? ---
  try {
    parentTab('genel');
    const pbody = document.getElementById('pbody').innerHTML;
    check("Genel sekmesi grafik SVG'si içeriyor", pbody.includes('<svg'));
    check('Grafik erişilebilir aria-label taşıyor', pbody.includes('aria-label="Son 14'));
  } catch (e) {
    check('Ebeveyn sekmesi hatasız render edildi (hata: ' + e.message + ')', false);
  }

  // --- 3) dailyChartHTML() hedef çizgisi görünür aralıkta mı (E1.9 regresyon testi)? ---
  // Hiç çalışma verisi yokken (tüm günler 0 dk) hedef, varsayılan tabandan (10 dk) büyük
  // olduğu için önceki kodda çizgi tam üst kenara (y=0) denk gelip görünmez oluyordu.
  try {
    const svg = dailyChartHTML();
    const m = svg.match(/<line[^>]*y1="([\\d.]+)"/);
    check('hedef çizgisi bulundu', !!m);
    const gy = m ? parseFloat(m[1]) : NaN;
    check('hedef çizgisi üst kenardan yeterince uzak (y=' + gy + ' >= 2)', gy >= 2);
  } catch (e) {
    check('dailyChartHTML() hatasız çalıştı (hata: ' + e.message + ')', false);
  }

  // --- 4) Bir oyun turu award()'a ulaşıp ilerlemeyi kaydediyor mu? ---
  try {
    state = fresh();
    sessionStart = Date.now() - 5000;
    play = null;
    const starsBefore = state.stars;
    award();
    const starsAfter = state.stars;
    check('award() sonrası yıldız sayısı arttı', starsAfter > starsBefore);
    const dailySeconds = state.daily[today()] || 0;
    check("award() günün süresini state.daily'ye işledi", dailySeconds > 0);
    check("ödül ekranı (overlay) DOM'da mevcut", !!document.getElementById('reward'));
    const saved = JSON.parse(localStorage.getItem('okuma-kasifi-v2'));
    check('localStorage (okuma-kasifi-v2) güncellendi', !!saved && saved.stars === starsAfter);
  } catch (e) {
    check("award() akışı hatasız çalıştı (hata: " + e.message + ")", false);
  }

  // --- 5) E2.1 Kademeli hata protokolü: 3. yanlışta doğru gösterilip tekrar kuyruğuna alınıyor mu? ---
  try {
    state = fresh();
    play = null;
    roundBul(['a','n','e','t']);
    const wrongBtn = document.querySelector('#choices .choice:not([data-right="1"])');
    const correctBtn = document.querySelector('#choices .choice[data-right="1"]');
    choose(wrongBtn, false);
    check('1. yanlışta tur kilitlenmiyor', locked === false);
    choose(wrongBtn, false);
    check('2. yanlışta doğru şıkka ipucu vurgusu eklendi', correctBtn.classList.contains('hint'));
    choose(wrongBtn, false);
    check('3. yanlışta tur kilitlendi (modelle+birlikte)', locked === true);
    check('3. yanlışta hedef ses tekrar kuyruğuna eklendi', state.reviewQueue.includes(curTargets[0]));
  } catch (e) {
    check('Kademeli hata protokolü hatasız çalıştı (hata: ' + e.message + ')', false);
  }

  // --- 6) E2.2 Tekrar kuyruğu: ders başında reviewQueue'daki sesler ilk turlara ekleniyor mu? ---
  try {
    state = fresh();
    state.done = [0];
    state.reviewQueue = ['a', 'n'];
    play = null;
    openLesson(1);
    check('reviewSteps ders adımlarının başına eklendi', play.steps[0].review === true && play.steps[0].sounds[0] === 'a');
    check('normal ders adımları reviewSteps sonrasında duruyor', play.steps.some(s => !s.review));
    curTargets = ['a'];
    consumeReview();
    check("doğru cevaplanan ses tekrar kuyruğundan çıktı", !state.reviewQueue.includes('a') && state.reviewQueue.includes('n'));
  } catch (e) {
    check('Tekrar kuyruğu akışı hatasız çalıştı (hata: ' + e.message + ')', false);
  }

  // --- 7) E2.6 Oturum ritmi: eşik dakika sonrası nazik mola önerisi bir kez gösteriliyor mu? ---
  try {
    state = fresh();
    state.mode = 'kesif';
    sessionMinutes = 8; breakShown = false;
    check('mola eşiği (Keşif, 8 dk) aşılınca öneri tetikleniyor', maybeSuggestBreak() === true);
    check('mola önerisi aynı oturumda tekrar tetiklenmiyor', maybeSuggestBreak() === false);
    acceptBreak();
    check('acceptBreak() sayaç ve bayrağı sıfırlıyor', sessionMinutes === 0 && breakShown === false);
    check('acceptBreak() başlangıç ekranına dönüyor', document.getElementById('s-start').classList.contains('active'));
  } catch (e) {
    check('Oturum ritmi (mola önerisi) hatasız çalıştı (hata: ' + e.message + ')', false);
  }

  // --- 8) E2.7 Kâşif'in tepki çeşitliliği: övgü/ipucu cümleleri yeterince çeşitli mi? ---
  try {
    check('PRAISE en az 15 varyant içeriyor', Array.isArray(PRAISE) && PRAISE.length >= 15);
    check('RETRY_MSGS en az 5 varyant içeriyor', Array.isArray(RETRY_MSGS) && RETRY_MSGS.length >= 5);
    check('HINT_MSGS en az 5 varyant içeriyor', Array.isArray(HINT_MSGS) && HINT_MSGS.length >= 5);
  } catch (e) {
    check('Tepki çeşitliliği listeleri hatasız çalıştı (hata: ' + e.message + ')', false);
  }

  // --- 9) E3.3 Zayıf seslere otomatik dönüş: haritada "Tekrar turu" düğmesi ve hedefli tur ---
  try {
    state = fresh();
    state.mode = 'kesif';
    state.soundStats = { a: { c: 1, w: 3 } }; // %25 doğruluk, n=4 >= 3 -> "review" kovası
    play = null;
    renderMap();
    const rb = document.getElementById('reviewBtn');
    check('zayıf ses varken Tekrar turu düğmesi görünür', rb.hidden === false && rb.textContent.includes('a'));
    startReviewRound();
    check('Tekrar turu 4-5 adımdan oluşuyor', play && play.steps.length >= 4 && play.steps.length <= 5);
    check('Tekrar turu adımları zayıf sesi hedefliyor', play.steps.every(s => s.sounds.includes('a')));
    play.i = play.steps.length; // turu bitmiş varsay
    finishLesson();
    check('Tekrar turu bitince ders haritasına dokunulmadı', state.done.length === 0);
    check('Tekrar turu bitiş ekranı doğru başlık gösteriyor', document.getElementById('doneTitle').textContent === 'Tekrar turu tamam!');
    state.soundStats = {};
    renderMap();
    check('zayıf ses yokken Tekrar turu düğmesi gizli', document.getElementById('reviewBtn').hidden === true);
  } catch (e) {
    check('Zayıf seslere otomatik dönüş akışı hatasız çalıştı (hata: ' + e.message + ')', false);
  }

  // --- 10) E3.1 Ders sonu mini-değerlendirme: 3 hızlı soru, geçemezse haritada işaret ---
  try {
    state = fresh();
    state.done = [0];
    const L1 = LESSONS.find(x => x.id === 1);
    const steps = buildSteps(L1);
    check('buildSteps ders sonuna 3 değerlendirme adımı ekliyor', steps.length >= 3 && steps.slice(-3).every(s => s.assess === true));

    play = { lessonId: 1, steps, i: steps.length };
    assessResults = [true, false, false]; // 1/3 doğru -> geçemedi
    finishLesson();
    check('1/3 doğru değerlendirme "tekrar önerilir" bırakıyor', state.lessonLog[1].needsReview === true);
    renderMap();
    const node1 = document.querySelectorAll('#path .node')[1];
    check('harita düğümü tekrar önerilir işareti (flag) taşıyor', node1 && node1.classList.contains('flag'));

    state.done = [0];
    play = { lessonId: 1, steps, i: steps.length };
    assessResults = [true, true, false]; // 2/3 doğru -> geçti
    finishLesson();
    check('2/3 doğru değerlendirme "tekrar önerilir" işaretini kaldırıyor', state.lessonLog[1].needsReview === false);
  } catch (e) {
    check('Ders sonu mini-değerlendirme hatasız çalıştı (hata: ' + e.message + ')', false);
  }

  return results;
})()
`;

let results;
try {
  results = window.eval(scriptMatch[1] + '\n;' + testDriver);
} catch (e) {
  console.error('✗ Uygulama betiği yüklenirken hata:', e.stack);
  process.exit(1);
}

let failed = 0;
for (const { name, pass } of results) {
  console.log(`  ${pass ? '✓' : '✗'} ${name}`);
  if (!pass) failed++;
}

console.log(`\n${failed === 0 ? 'TÜM TESTLER GEÇTİ' : failed + ' TEST BAŞARISIZ'} (${results.length} test)`);
process.exit(failed === 0 ? 0 : 1);
