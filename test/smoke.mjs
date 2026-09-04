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
const swJs = readFileSync(join(__dirname, '..', 'sw.js'), 'utf8');
const manifestJson = readFileSync(join(__dirname, '..', 'manifest.json'), 'utf8');
const siteHtml = readFileSync(join(__dirname, '..', 'site', 'index.html'), 'utf8');
const pricesHtml = readFileSync(join(__dirname, '..', 'site', 'fiyatlar.html'), 'utf8');

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
  ['s-start','s-mode','s-map','s-free','s-game','s-done','s-parent','s-collection','s-defter'].forEach(id=>{
    check("#" + id + " ekranı DOM'da", !!document.getElementById(id));
  });
  check('7 ebeveyn sekmesi (#ptabs .ptab) mevcut', document.querySelectorAll('#ptabs .ptab').length === 7);

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
    const saved = JSON.parse(localStorage.getItem(KEY));
    check('localStorage (' + KEY + ') güncellendi', !!saved && saved.stars === starsAfter);
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

  // --- 11) E2.3 Aralıklı tekrar: strength/lastSeen izleniyor mu, ısınma turu düşük/eski sesi seçiyor mu? ---
  try {
    state = fresh();
    curTargets = ['a'];
    creditSounds(true);
    check('creditSounds() strength ve lastSeen günceller', state.soundStats.a.strength === 3 && state.soundStats.a.lastSeen === today());

    state = fresh();
    state.done = [0, 1]; // pool = ['a']
    state.soundStats = { a: { c: 2, w: 5, strength: 1, lastSeen: '2020-01-01' } };
    check('warmupSounds() düşük strength/eski sesi seçiyor', warmupSounds().includes('a'));

    state.soundStats = { a: { c: 5, w: 1, strength: 5, lastSeen: today() } };
    check('warmupSounds() güçlü ve güncel sesi seçmiyor', !warmupSounds().includes('a'));

    state = fresh();
    state.done = [0, 1];
    state.soundStats = { a: { c: 1, w: 4, strength: 1, lastSeen: '2020-01-01' } };
    play = null;
    openLesson(2);
    check('warmupSteps() ders başına eklendi', play.steps[0].warmup === true && play.steps[0].sounds[0] === 'a');
  } catch (e) {
    check('Aralıklı tekrar (ısınma turu) hatasız çalıştı (hata: ' + e.message + ')', false);
  }

  // --- 12) E2.4 Harfi Bul çeşitliliği: (a) resim→harf, (b) ses duy→harf, (c) büyük/küçük eşle ---
  try {
    const origRandom = Math.random;
    state = fresh();
    Math.random = () => 0; // (a) resim→harf
    roundBul(['a', 'n', 'e', 't']);
    check('roundBul (a) resim→harf varyantı görseli gösteriyor', playArea.innerHTML.includes(WORDS[curTargets[0]].emoji));
    Math.random = () => 0.5; // (b) ses duy→harf
    roundBul(['a', 'n', 'e', 't']);
    check('roundBul (b) ses duy→harf varyantı soru metnini gösteriyor', qtext.textContent === 'Duyduğun ses hangi harf?');
    check('roundBul (b) varyantında doğru cevap seçenekler arasında', document.querySelector('#choices .choice[data-right="1"]') !== null);
    Math.random = () => 0.99; // (c) büyük/küçük eşle
    roundBul(['a', 'n', 'e', 't']);
    check('roundBul (c) büyük/küçük varyantı soru metninde BÜYÜK geçiyor', qtext.textContent.includes('BÜYÜK'));
    const upperTarget = UPPER_MAP[curTargets[0]];
    const rightChoice = document.querySelector('#choices .choice[data-right="1"]');
    check('roundBul (c) doğru şık hedefin büyük hâlini gösteriyor', rightChoice && rightChoice.textContent.includes(upperTarget));
    Math.random = origRandom;
  } catch (e) {
    check('Harfi Bul çeşitliliği hatasız çalıştı (hata: ' + e.message + ')', false);
  }

  // --- 13) E6.2 Harf Çiz 5 kademe: cizLevel varsayılan + başarılı çizimde ilerleme ---
  try {
    state = fresh();
    check('cizLevel() ses hiç çizilmemişken varsayılan 1', cizLevel('a') === 1);

    state.soundStats = { a: { c: 0, w: 0, cizLevel: 4 } };
    check('cizLevel() kayıtlı kademeyi döndürüyor', cizLevel('a') === 4);

    state = fresh();
    curTargets = ['a'];
    const pts = Array.from({ length: 15 }, (_, i) => [i, i]);
    trace = { letter: 'a', strokes: [pts], maskPts: [[1, 1], [5, 5], [10, 10]], size: 100 };
    checkTrace();
    check('checkTrace() başarılı çizimde cizLevel 1→2 ilerliyor', state.soundStats.a.cizLevel === 2);
    check('checkTrace() başarılı çizimde 5 kademeyi aşmıyor (üst sınır kontrolü)', state.soundStats.a.cizLevel <= 5);
  } catch (e) {
    check('Harf Çiz 5 kademe sistemi hatasız çalıştı (hata: ' + e.message + ')', false);
  }

  // --- 14) E3.2 Kâşif Gösterisi: puansız/kümülatif ara sınav, önceki değerlendirme sızmıyor ---
  try {
    state = fresh();
    const L12 = LESSONS.find(x => x.id === 12);
    const gSteps = buildSteps(L12);
    check('Kâşif Gösterisi (gosteri) adımlarında değerlendirme sorusu yok', gSteps.every(s => !s.assess));

    state.done = Array.from({ length: 12 }, (_, i) => i); // 0..11 tamam, ders 12 açık
    assessResults = [true, false, false]; // önceki dersten kalmış "başarısız" sonuç
    play = null;
    openLesson(12);
    check('openLesson() önceki assessResults sonucunu sıfırlıyor', assessResults.length === 0);

    play.i = play.steps.length;
    finishLesson();
    check('Kâşif Gösterisi bitişinde "tekrar önerilir" işareti YOK', !state.lessonLog[12].needsReview);
    check('Kâşif Gösterisi bitiş ekranı kutlama başlığı gösteriyor', document.getElementById('doneTitle').textContent === 'Kâşif Gösterisi tamamlandı!');
  } catch (e) {
    check('Kâşif Gösterisi (E3.2) hatasız çalıştı (hata: ' + e.message + ')', false);
  }

  // --- 15) E2.5 Zorluk uyarlaması: doğruluğa göre seçenek sayısı değişiyor mu? ---
  try {
    state = fresh();
    recentRounds = [];
    check('difficultyLevel() az veri varken normal döner', difficultyLevel() === 'normal');

    recentRounds = [true, true, true, true, true]; // %100 doğruluk -> zor
    check('difficultyLevel() yüksek doğrulukta "zor" döner', difficultyLevel() === 'zor');
    roundBul(['a', 'n', 'e', 't', 'i', 'l']);
    check('roundBul() "zor" seviyede 5 seçenek sunuyor', document.querySelectorAll('#choices .choice').length === 5);

    recentRounds = [false, false, false, true, false]; // %20 doğruluk -> kolay
    check('difficultyLevel() düşük doğrulukta "kolay" döner', difficultyLevel() === 'kolay');
    roundBul(['a', 'n', 'e', 't', 'i', 'l']);
    check('roundBul() "kolay" seviyede 3 seçenek sunuyor', document.querySelectorAll('#choices .choice').length === 3);

    recentRounds = [true, true, false, true, true]; // %80 -> normal
    {
      const origRandom = Math.random;
      Math.random = () => 0; // (a) ses→resim
      roundSes(['a', 'n', 'e', 't']);
      Math.random = origRandom;
    }
    check('roundSes() "normal" seviyede 3 seçenek sunuyor', document.querySelectorAll('#choices .choice').length === 3);

    recentRounds = [];
    curWrongCount = 0;
    const before = recentRounds.length;
    roundBul(['a', 'n', 'e', 't']);
    const rightBtn = document.querySelector('#choices .choice[data-right="1"]');
    choose(rightBtn, true);
    check('choose() doğru cevapta recentRounds dizisine sonuç ekliyor', recentRounds.length === before + 1 && recentRounds[recentRounds.length - 1] === true);
  } catch (e) {
    check('Zorluk uyarlaması (E2.5) hatasız çalıştı (hata: ' + e.message + ')', false);
  }

  // --- 16) E2.4 Sesi Eşleştir çeşitliliği: (b) farklı sesle başlayan, (c) son ses ---
  try {
    const origRandom = Math.random;
    const fullPool = ['a', 'n', 'e', 't', 'i', 'l', 'o', 'k', 'u', 'r', 'ı', 'm'];
    state = fresh();
    recentRounds = [];

    Math.random = () => 0.5; // (b) hangisi farklı sesle başlıyor
    roundSes(fullPool);
    check('roundSes (b) varyantı doğru soru metnini gösteriyor', qtext.textContent === 'Hangisi farklı sesle başlıyor?');
    check('roundSes (b) varyantında tam olarak 1 doğru şık var', document.querySelectorAll('#choices .choice[data-right="1"]').length === 1);

    Math.random = () => 0.99; // (c) son ses
    roundSes(fullPool);
    check('roundSes (c) varyantı "bitiyor" soru metnini gösteriyor', qtext.textContent.includes('bitiyor'));
    check('roundSes (c) varyantında tam olarak 1 doğru şık var', document.querySelectorAll('#choices .choice[data-right="1"]').length === 1);

    Math.random = origRandom;
  } catch (e) {
    check('Sesi Eşleştir çeşitliliği (E2.4 b/c) hatasız çalıştı (hata: ' + e.message + ')', false);
  }

  // --- 17) E2.4 Hece Kur çeşitliliği: (b) hece→resim, (c) eksik harfi bul ---
  try {
    const origRandom = Math.random;
    const fullPool = ['a', 'n', 'e', 't', 'i', 'l', 'o', 'k', 'u', 'r', 'ı', 'm'];
    state = fresh();
    recentRounds = [];

    Math.random = () => 0.5; // (b) hece→resim
    roundHece(fullPool);
    check('roundHece (b) varyantı doğru soru metnini gösteriyor', qtext.textContent.includes('hecesiyle başlayan'));
    check('roundHece (b) varyantında tam olarak 1 doğru şık var', document.querySelectorAll('#choices .choice[data-right="1"]').length === 1);

    Math.random = () => 0.99; // (c) eksik harfi bul
    roundHece(fullPool);
    check('roundHece (c) varyantı "eksik harf" soru metnini gösteriyor', qtext.textContent.includes('eksik harf'));
    check('roundHece (c) varyantında tam olarak 1 doğru şık var', document.querySelectorAll('#choices .choice[data-right="1"]').length === 1);

    Math.random = origRandom;
  } catch (e) {
    check('Hece Kur çeşitliliği (E2.4 b/c) hatasız çalıştı (hata: ' + e.message + ')', false);
  }

  // --- 18) E6.1 Çok vuruşlu harflerde vuruş vuruş kılavuz ---
  try {
    check('multiStrokeGuideOn() 2+ vuruşlu harfte (t, kademe 1) true döner', multiStrokeGuideOn('t', 1) === true);
    check('multiStrokeGuideOn() tek vuruşlu harfte (l, kademe 1) false döner', multiStrokeGuideOn('l', 1) === false);
    check('multiStrokeGuideOn() kademe 5 (bellekten) için false döner', multiStrokeGuideOn('t', 5) === false);
    check('multiStrokeGuideOn() bilinmeyen harf için false döner', multiStrokeGuideOn('x', 1) === false);

    // t'nin ilk vuruşu dikey bir çizgi: [[50,30],[50,68],[55,73]] (size=100 ölçeğinde)
    const strokePath = STROKES.t[0].map(([x, y]) => [x * 100, y * 100]);
    const goodPts = strokePath.map(p => [p[0] + 1, p[1] + 1]); // neredeyse tam üstünden
    const badPts = [[5, 5], [8, 8], [10, 10]]; // harfin uzağında
    check('strokeMatchRatio() vuruşun üstünden geçince yüksek oran döner', strokeMatchRatio(goodPts, strokePath, 100) > 0.7);
    check('strokeMatchRatio() alakasız noktalarda düşük oran döner', strokeMatchRatio(badPts, strokePath, 100) < 0.2);
    check('strokeMatchRatio() boş nokta dizisinde 0 döner', strokeMatchRatio([], strokePath, 100) === 0);
  } catch (e) {
    check('Vuruş vuruş kılavuz (E6.1) hatasız çalıştı (hata: ' + e.message + ')', false);
  }

  // --- 19) E6.3 Yön hatası tespiti ---
  try {
    // t'nin ilk vuruşu yukarıdan aşağı iner: [[50,30],[50,68],[55,73]] (size=100 ölçeğinde)
    const strokePath = STROKES.t[0].map(([x, y]) => [x * 100, y * 100]);
    // strokeDirectionOk en az 4 nokta bekler; kılavuzu 10 ara noktaya bölerek dinamik bir çizim taklit et
    const denseGuide = Array.from({ length: 10 }, (_, i) => {
      const tt = i / 9, [x0, y0] = strokePath[0], [x1, y1] = strokePath[strokePath.length - 1];
      return [x0 + (x1 - x0) * tt, y0 + (y1 - y0) * tt];
    });
    const forwardPts = denseGuide; // kılavuzla aynı yönde (yukarıdan aşağı)
    const reversedPts = [...denseGuide].reverse(); // ters yönde (aşağıdan yukarı)
    check('strokeDirectionOk() dogru yonde (yukaridan asagi) true doner', strokeDirectionOk(forwardPts, strokePath, 100) === true);
    check('strokeDirectionOk() ters yonde (asagidan yukari) false doner', strokeDirectionOk(reversedPts, strokePath, 100) === false);
    check('strokeDirectionOk() yetersiz nokta ile guvenli true doner', strokeDirectionOk([[1, 1]], strokePath, 100) === true);
    check('strokeDirectionOk() bos vurus yolunda guvenli true doner', strokeDirectionOk(forwardPts, [], 100) === true);
  } catch (e) {
    check('Yön hatası tespiti (E6.3) hatasız çalıştı (hata: ' + e.message + ')', false);
  }

  // --- 19) E3.4 Okuma Kulübü: metin + 2 anlama sorusu ---
  try {
    const origSay = say;
    say = (text, cb) => { if (cb) cb(); }; // narrasyonu senkron hâle getir (test ortamında TTS yok)
    state = fresh();
    play = null;
    const starsBefore = state.stars;
    roundOkuma();
    check('roundOkuma() metni playArea içinde gösteriyor', playArea.innerHTML.includes(READING.metin));
    check('roundOkuma() "sorulara geç" düğmesi mevcut', playArea.innerHTML.includes('sorulara geç'));

    startOkumaQuestions();
    check('startOkumaQuestions() ilk soruyu gösteriyor', qtext.textContent === READING.sorular[0].soru);
    check('İlk soruda tam olarak 1 doğru şık var', document.querySelectorAll('#choices .choice[data-right="1"]').length === 1);

    let rightBtn = document.querySelector('#choices .choice[data-right="1"]');
    answerOkuma(rightBtn, true);
    check('İlk soru doğru cevaplanınca ikinci soruya geçiyor', qtext.textContent === READING.sorular[1].soru);

    rightBtn = document.querySelector('#choices .choice[data-right="1"]');
    answerOkuma(rightBtn, true);
    check('Okuma Kulübü bitince yıldız kazandırıyor (award)', state.stars > starsBefore);
    check('Okuma Kulübü tüm sorular doğru cevaplandığında correct=2 sayıyor', okumaState.correct === 2);
    say = origSay;
  } catch (e) {
    check('Okuma Kulübü (E3.4) hatasız çalıştı (hata: ' + e.message + ')', false);
  }

  // --- 20) E4.5 WORDBANK genişletme: 40+ kelime, 1.+2. grup kelimeleri o havuzla filtrelenince görünür ---
  try {
    check('WORDBANK en az 40 kelime içeriyor', WORDBANK.length >= 40);
    const pool12 = 'anetilokurım'.split('');
    const group12Words = WORDBANK.filter(it => it.w.split('').every(c => pool12.includes(c)));
    check('WORDBANK icinde en az 40 kelime yalniz 1.+2. grup seslerinden kurulu', group12Words.length >= 40);
    check('WORDBANK her kelimede emoji taşıyor', WORDBANK.every(it => it.e && it.e.length));
  } catch (e) {
    check('WORDBANK (E4.5) hatasız kontrol edildi (hata: ' + e.message + ')', false);
  }

  // --- 21) E5.1 Ses klip altyapısı: boş AUDIO haritasında TTS'e düşüyor, klip varsa onu deniyor ---
  try {
    const origSay = say;
    let sayCalledWith = null;
    say = (text, cb) => { sayCalledWith = text; if (cb) cb(); };
    check('AUDIO haritası başlangıçta boş (iskele)', Object.keys(AUDIO).length === 0);
    let cbCalled = false;
    playClip('yok-boyle-bir-klip', 'yedek metin', () => { cbCalled = true; });
    check('playClip() klip yokken say() ile TTS yedeğine düşüyor', sayCalledWith === 'yedek metin');
    check('playClip() geri çağırımı (cb) tetikliyor', cbCalled === true);
    say = origSay;
  } catch (e) {
    check('playClip (E5.1) hatasız çalıştı (hata: ' + e.message + ')', false);
  }

  // --- 22) E3.5 Okuma Kulübü metin bankası: birden çok metin, pool'a göre seçim ---
  try {
    check('TEXTS en az 5 metin içeriyor (5 ses grubunun hepsi)', TEXTS.length >= 5);
    const lettersOf = s => Array.from(new Set(s.toLowerCase().replace(/[^a-zçğıöşü]/g, '').split('')));
    const allValid = TEXTS.every(t => lettersOf(t.metin).every(c => t.gerekli.includes(c)));
    check('Her metin yalnız kendi gerekli seslerinden kurulu', allValid);
    check('pickText() dar pool için en basit metni seçiyor',
      pickText(['a', 'n', 'e', 't', 'i', 'l']).id === 'els-1');
    check('pickText() 1.+2. grup pool için els-2 seçiyor (3. grup sesleri henüz yok)',
      pickText(['a', 'e', 'l', 'm', 'r', 'k', 't', 'n', 'u', 'o', 'ı', 'i']).id === 'els-2');
    check('pickText() 3. grup dahil pool için els-3 seçiyor',
      pickText(['a', 'e', 'l', 'm', 'r', 'k', 't', 'n', 'u', 'o', 'ı', 'i', 'ü', 's', 'ö', 'y', 'd', 'z']).id === 'els-3');
    check('pickText() 4. grup dahil pool için els-4 seçiyor',
      pickText(['a', 'e', 'l', 'm', 'r', 'k', 't', 'n', 'u', 'o', 'ı', 'i', 'ü', 's', 'ö', 'y', 'd', 'z', 'ç', 'b', 'g', 'c', 'ş']).id === 'els-4');
    check('pickText() tüm alfabe (5. grup) pool için els-5 seçiyor',
      pickText(['a', 'e', 'l', 'm', 'r', 'k', 't', 'n', 'u', 'o', 'ı', 'i', 'ü', 's', 'ö', 'y', 'd', 'z', 'ç', 'b', 'g', 'c', 'ş', 'p', 'h', 'v', 'ğ', 'f', 'j']).id === 'els-5');

    const origSay2 = say;
    say = (text, cb) => { if (cb) cb(); };
    state = fresh(); // taze durumda pool sadece 1. grup (a,n,e,t,i,l) -> els-1 seçilmeli
    play = null;
    roundOkuma();
    check('roundOkuma() taze durumda en basit metni (els-1) seçiyor', READING.id === 'els-1');
    say = origSay2;
  } catch (e) {
    check('Okuma Kulübü metin bankası (E3.5) hatasız çalıştı (hata: ' + e.message + ')', false);
  }

  // --- 23) E4.1 2. grup (o,k,u,r,ı,m) pekiştirmesi: yeni cümleler pool-güvenli ve r/u/m içeriyor ---
  try {
    check('SENTENCES en az 9 cümle içeriyor', SENTENCES.length >= 9);
    const pool12b = 'anetilokurım'.split('');
    const bad = SENTENCES.filter(s => !s.w.every(w => w.split('').every(c => pool12b.includes(c))));
    check('SENTENCES kelimeleri yalnız 1.+2. grup seslerinden kurulu', bad.length === 0);
    const usesGroup2 = SENTENCES.some(s => s.w.join('').split('').some(c => 'urm'.includes(c)));
    check('En az bir cümle r/u/m (2. grup) seslerini içeriyor', usesGroup2);
    check('SENT_WORDS pool-güvenli kelimelerden kurulu',
      SENT_WORDS.every(w => w.split('').every(c => pool12b.includes(c))));
  } catch (e) {
    check('Cümle Bahçesi genişlemesi (E4.1) hatasız çalıştı (hata: ' + e.message + ')', false);
  }

  // --- 24) E4.2 3. grup başlangıcı: ü sesi tam donanımlı eklendi (WORDS/STROKES/LESSONS/WORDBANK) ---
  try {
    check('WORDS.ü tanımlı ve ü ile başlıyor', !!WORDS['ü'] && WORDS['ü'].word[0] === 'ü');
    check('STROKES.ü tanımlı (çok vuruşlu: nokta+nokta+gövde+kuyruk)', Array.isArray(STROKES['ü']) && STROKES['ü'].length === 4);
    const L13 = LESSONS.find(x => x.id === 13);
    check('LESSONS içinde ders 13 "Ses ü" olarak tanımlı', !!L13 && L13.yeni.includes('ü'));
    const poolWithU = poolUpTo(13);
    check('poolUpTo(13) ü sesini içeriyor', poolWithU.includes('ü'));
    const reachable = WORDBANK.filter(it => it.w.split('').every(c => poolWithU.includes(c)));
    check('"kül" u ogrenilince WORDBANK icinde erisilebilir', reachable.some(it => it.w === 'kül'));
    check('"üzüm" z öğrenilmeden erişilebilir değil (gated)', !reachable.some(it => it.w === 'üzüm'));
  } catch (e) {
    check('3. grup ü sesi (E4.2) hatasız çalıştı (hata: ' + e.message + ')', false);
  }

  // --- 25) E4.2 (b) 3. grup: s sesi tam donanımlı eklendi (WORDS/STROKES/LESSONS/WORDBANK) ---
  try {
    check('WORDS.s tanımlı ve s ile başlıyor', !!WORDS.s && WORDS.s.word[0] === 's');
    check('STROKES.s tanımlı (tek vuruşlu S eğrisi)', Array.isArray(STROKES.s) && STROKES.s.length === 1 && STROKES.s[0].length > 5);
    const L14 = LESSONS.find(x => x.id === 14);
    check('LESSONS içinde ders 14 "Ses s" olarak tanımlı', !!L14 && L14.yeni.includes('s'));
    const poolWithS = poolUpTo(14);
    check('poolUpTo(14) hem ü hem s seslerini içeriyor', poolWithS.includes('ü') && poolWithS.includes('s'));
    const reachableS = WORDBANK.filter(it => it.w.split('').every(c => poolWithS.includes(c)));
    check('"su" s ogrenilince WORDBANK icinde erisilebilir', reachableS.some(it => it.w === 'su'));
    check('"kes" s ogrenilince WORDBANK icinde erisilebilir', reachableS.some(it => it.w === 'kes'));
  } catch (e) {
    check('3. grup s sesi (E4.2 b) hatasız çalıştı (hata: ' + e.message + ')', false);
  }

  // --- 26) E4.2 (c) 3. grup: ö sesi tam donanımlı eklendi (WORDS/STROKES/LESSONS/WORDBANK) ---
  try {
    check('WORDS.ö tanımlı ve ö ile başlıyor', !!WORDS['ö'] && WORDS['ö'].word[0] === 'ö');
    check('STROKES.ö tanımlı (çok vuruşlu: nokta+nokta+gövde)', Array.isArray(STROKES['ö']) && STROKES['ö'].length === 3);
    const L15 = LESSONS.find(x => x.id === 15);
    check('LESSONS içinde ders 15 "Ses ö" olarak tanımlı', !!L15 && L15.yeni.includes('ö'));
    const poolWithO2 = poolUpTo(15);
    check('poolUpTo(15) ü, s ve ö seslerinin hepsini içeriyor', ['ü', 's', 'ö'].every(c => poolWithO2.includes(c)));
    const reachableO2 = WORDBANK.filter(it => it.w.split('').every(c => poolWithO2.includes(c)));
    check('"körük" ö ogrenilince WORDBANK icinde erisilebilir', reachableO2.some(it => it.w === 'körük'));
  } catch (e) {
    check('3. grup ö sesi (E4.2 c) hatasız çalıştı (hata: ' + e.message + ')', false);
  }

  // --- 27) E4.2 (d) 3. grup: y sesi tam donanımlı eklendi (WORDS/STROKES/LESSONS/WORDBANK) ---
  try {
    check('WORDS.y tanımlı ve y ile başlıyor', !!WORDS.y && WORDS.y.word[0] === 'y');
    check('STROKES.y tanımlı (çok vuruşlu: iki eğik vuruş + kuyruk)', Array.isArray(STROKES.y) && STROKES.y.length === 2);
    const L16 = LESSONS.find(x => x.id === 16);
    check('LESSONS içinde ders 16 "Ses y" olarak tanımlı', !!L16 && L16.yeni.includes('y'));
    const poolWithY = poolUpTo(16);
    check('poolUpTo(16) ü, s, ö ve y seslerinin hepsini içeriyor', ['ü', 's', 'ö', 'y'].every(c => poolWithY.includes(c)));
    const reachableY = WORDBANK.filter(it => it.w.split('').every(c => poolWithY.includes(c)));
    check('"yol" y ogrenilince WORDBANK icinde erisilebilir', reachableY.some(it => it.w === 'yol'));
    check('"yumurta" y ogrenilince WORDBANK icinde erisilebilir', reachableY.some(it => it.w === 'yumurta'));
  } catch (e) {
    check('3. grup y sesi (E4.2 d) hatasız çalıştı (hata: ' + e.message + ')', false);
  }

  // --- 28) E4.2 (e) 3. grup: d sesi tam donanımlı eklendi (WORDS/STROKES/LESSONS/WORDBANK) ---
  try {
    check('WORDS.d tanımlı ve d ile başlıyor', !!WORDS.d && WORDS.d.word[0] === 'd');
    check('STROKES.d tanımlı (çok vuruşlu: gövde + dik vuruş)', Array.isArray(STROKES.d) && STROKES.d.length === 2);
    const L17 = LESSONS.find(x => x.id === 17);
    check('LESSONS içinde ders 17 "Ses d" olarak tanımlı', !!L17 && L17.yeni.includes('d'));
    const poolWithD = poolUpTo(17);
    check('poolUpTo(17) ü, s, ö, y ve d seslerinin hepsini içeriyor', ['ü', 's', 'ö', 'y', 'd'].every(c => poolWithD.includes(c)));
    const reachableD = WORDBANK.filter(it => it.w.split('').every(c => poolWithD.includes(c)));
    check('"domates" d ogrenilince WORDBANK icinde erisilebilir', reachableD.some(it => it.w === 'domates'));
    check('"duman" d ogrenilince WORDBANK icinde erisilebilir', reachableD.some(it => it.w === 'duman'));
  } catch (e) {
    check('3. grup d sesi (E4.2 e) hatasız çalıştı (hata: ' + e.message + ')', false);
  }

  // --- 29) E4.2 (f) 3. grup tamamlandı: z sesi + "Kâşif Gösterisi 2" rozet dersi ---
  try {
    check('WORDS.z tanımlı ve z ile başlıyor', !!WORDS.z && WORDS.z.word[0] === 'z');
    check('STROKES.z tanımlı (tek zikzak vuruş)', Array.isArray(STROKES.z) && STROKES.z.length === 1 && STROKES.z[0].length === 4);
    const L18 = LESSONS.find(x => x.id === 18);
    check('LESSONS içinde ders 18 "Ses z" olarak tanımlı', !!L18 && L18.yeni.includes('z'));
    const L19 = LESSONS.find(x => x.id === 19);
    check('LESSONS içinde ders 19 "Kâşif Gösterisi 2" gosteri tipinde ve rozetli', !!L19 && L19.tip === 'gosteri' && !!L19.rozet);
    const poolWithZ = poolUpTo(18);
    check('poolUpTo(18) 3. grubun tüm seslerini (ü,s,ö,y,d,z) içeriyor',
      ['ü', 's', 'ö', 'y', 'd', 'z'].every(c => poolWithZ.includes(c)));
    const reachableZ = WORDBANK.filter(it => it.w.split('').every(c => poolWithZ.includes(c)));
    check('"zil" z ogrenilince WORDBANK icinde erisilebilir', reachableZ.some(it => it.w === 'zil'));
    check('"kazan" z ogrenilince WORDBANK icinde erisilebilir', reachableZ.some(it => it.w === 'kazan'));
    check('"üzüm" artık z öğrenilince WORDBANK icinde erisilebilir (E4.2 a gated idi)', reachableZ.some(it => it.w === 'üzüm'));
  } catch (e) {
    check('3. grup z sesi + Kâşif Gösterisi 2 (E4.2 f) hatasız çalıştı (hata: ' + e.message + ')', false);
  }

  // --- 30) E4.3 (a) 4. grup başlangıcı: ç sesi tam donanımlı eklendi (WORDS/STROKES/LESSONS/WORDBANK) ---
  try {
    check('WORDS.ç tanımlı ve ç ile başlıyor', !!WORDS['ç'] && WORDS['ç'].word[0] === 'ç');
    check('STROKES.ç tanımlı (çok vuruşlu: gövde + çengel)', Array.isArray(STROKES['ç']) && STROKES['ç'].length === 2);
    const L20 = LESSONS.find(x => x.id === 20);
    check('LESSONS içinde ders 20 "Ses ç" olarak tanımlı', !!L20 && L20.yeni.includes('ç'));
    const poolWithC1 = poolUpTo(20);
    check('poolUpTo(20) ç sesini içeriyor', poolWithC1.includes('ç'));
    const reachableC1 = WORDBANK.filter(it => it.w.split('').every(c => poolWithC1.includes(c)));
    check('"çay" ç ogrenilince WORDBANK icinde erisilebilir', reachableC1.some(it => it.w === 'çay'));
  } catch (e) {
    check('4. grup ç sesi (E4.3 a) hatasız çalıştı (hata: ' + e.message + ')', false);
  }

  // --- 31) E4.3 (b) 4. grup: b sesi tam donanımlı eklendi (WORDS/STROKES/LESSONS/WORDBANK) ---
  try {
    check('WORDS.b tanımlı ve b ile başlıyor', !!WORDS.b && WORDS.b.word[0] === 'b');
    check('STROKES.b tanımlı (çok vuruşlu: gövde + kabarcık)', Array.isArray(STROKES.b) && STROKES.b.length === 2);
    const L21 = LESSONS.find(x => x.id === 21);
    check('LESSONS içinde ders 21 "Ses b" olarak tanımlı', !!L21 && L21.yeni.includes('b'));
    const poolWithB = poolUpTo(21);
    check('poolUpTo(21) ç ve b seslerinin ikisini de içeriyor', ['ç', 'b'].every(c => poolWithB.includes(c)));
    const reachableB = WORDBANK.filter(it => it.w.split('').every(c => poolWithB.includes(c)));
    check('"balon" b ogrenilince WORDBANK icinde erisilebilir', reachableB.some(it => it.w === 'balon'));
    check('"boya" b ogrenilince WORDBANK icinde erisilebilir', reachableB.some(it => it.w === 'boya'));
  } catch (e) {
    check('4. grup b sesi (E4.3 b) hatasız çalıştı (hata: ' + e.message + ')', false);
  }

  // --- 32) E4.3 (c) 4. grup: g sesi tam donanımlı eklendi (WORDS/STROKES/LESSONS/WORDBANK) ---
  try {
    check('WORDS.g tanımlı ve g ile başlıyor', !!WORDS.g && WORDS.g.word[0] === 'g');
    check('STROKES.g tanımlı (çok vuruşlu: gövde + kuyruk)', Array.isArray(STROKES.g) && STROKES.g.length === 2);
    const L22 = LESSONS.find(x => x.id === 22);
    check('LESSONS içinde ders 22 "Ses g" olarak tanımlı', !!L22 && L22.yeni.includes('g'));
    const poolWithG = poolUpTo(22);
    check('poolUpTo(22) ç, b ve g seslerinin hepsini içeriyor', ['ç', 'b', 'g'].every(c => poolWithG.includes(c)));
    const reachableG = WORDBANK.filter(it => it.w.split('').every(c => poolWithG.includes(c)));
    check('"gemi" g ogrenilince WORDBANK icinde erisilebilir', reachableG.some(it => it.w === 'gemi'));
    check('"gül" g ogrenilince WORDBANK icinde erisilebilir', reachableG.some(it => it.w === 'gül'));
  } catch (e) {
    check('4. grup g sesi (E4.3 c) hatasız çalıştı (hata: ' + e.message + ')', false);
  }

  // --- 33) E4.3 (d) 4. grup: c sesi tam donanımlı eklendi (WORDS/STROKES/LESSONS/WORDBANK) ---
  try {
    check('WORDS.c tanımlı ve c ile başlıyor', !!WORDS.c && WORDS.c.word[0] === 'c');
    check('STROKES.c tanımlı (tek vuruşlu açık eğri)', Array.isArray(STROKES.c) && STROKES.c.length === 1);
    const L23 = LESSONS.find(x => x.id === 23);
    check('LESSONS içinde ders 23 "Ses c" olarak tanımlı', !!L23 && L23.yeni.includes('c'));
    const poolWithC2 = poolUpTo(23);
    check('poolUpTo(23) ç, b, g ve c seslerinin hepsini içeriyor', ['ç', 'b', 'g', 'c'].every(ch => poolWithC2.includes(ch)));
    const reachableC2 = WORDBANK.filter(it => it.w.split('').every(ch => poolWithC2.includes(ch)));
    check('"ceket" c ogrenilince WORDBANK icinde erisilebilir', reachableC2.some(it => it.w === 'ceket'));
    check('"cam" c ogrenilince WORDBANK icinde erisilebilir', reachableC2.some(it => it.w === 'cam'));
  } catch (e) {
    check('4. grup c sesi (E4.3 d) hatasız çalıştı (hata: ' + e.message + ')', false);
  }

  // --- 34) E4.3 (e) 4. grup tamamlandı: ş sesi + "Kâşif Gösterisi 3" rozet dersi ---
  try {
    check('WORDS.ş tanımlı ve ş ile başlıyor', !!WORDS['ş'] && WORDS['ş'].word[0] === 'ş');
    check('STROKES.ş tanımlı (çok vuruşlu: s eğrisi + çengel)', Array.isArray(STROKES['ş']) && STROKES['ş'].length === 2);
    const L24 = LESSONS.find(x => x.id === 24);
    check('LESSONS içinde ders 24 "Ses ş" olarak tanımlı', !!L24 && L24.yeni.includes('ş'));
    const L25 = LESSONS.find(x => x.id === 25);
    check('LESSONS içinde ders 25 "Kâşif Gösterisi 3" gosteri tipinde ve rozetli', !!L25 && L25.tip === 'gosteri' && !!L25.rozet);
    const poolWithS2 = poolUpTo(24);
    check('poolUpTo(24) 4. grubun tüm seslerini (ç,b,g,c,ş) içeriyor',
      ['ç', 'b', 'g', 'c', 'ş'].every(ch => poolWithS2.includes(ch)));
    const reachableS2 = WORDBANK.filter(it => it.w.split('').every(ch => poolWithS2.includes(ch)));
    check('"şeker" ş ogrenilince WORDBANK icinde erisilebilir', reachableS2.some(it => it.w === 'şeker'));
    check('"şal" ş ogrenilince WORDBANK icinde erisilebilir', reachableS2.some(it => it.w === 'şal'));
  } catch (e) {
    check('4. grup ş sesi + Kâşif Gösterisi 3 (E4.3 e) hatasız çalıştı (hata: ' + e.message + ')', false);
  }

  // --- 35) E1.11 çocuğun adı: onboarding girişi + ebeveyn özetinde kullanımı ---
  try {
    check('state.childName varsayılan olarak tanımlı (boş dize)', typeof state.childName === 'string');
    check('#childNameInput alanı DOM icinde mevcut', !!document.getElementById('childNameInput'));
    state.daily[today()] = 600; // wDays>0 olsun diye bu haftaya çalışma verisi ekle
    setChildName('Ela');
    check('setChildName() state.childName degerini gunceller', state.childName === 'Ela');
    const pbody = pGenel();
    check('pGenel() ozetinde Kasif yerine cocugun adi geciyor', pbody.includes('Ela'));
    setChildName('  ');
    check('setChildName() bosluk-only girdiyi bosaltir', state.childName === '');
    const pbody2 = pGenel();
    check('Isim boskan pGenel() varsayilan olarak Kasif kullaniyor', pbody2.includes('Kâşif'));
  } catch (e) {
    check('Cocuk adi (E1.11) hatasiz calisti (hata: ' + e.message + ')', false);
  }

  // --- 36) E1.12 ebeveyn yazdır/PDF raporu: printReport() rapor icerigini olusturuyor ---
  try {
    check('#printReport konteynerı DOM icinde mevcut', !!document.getElementById('printReport'));
    printReport();
    const rep=document.getElementById('printReport').innerHTML;
    check('printReport() cocugun adini/varsayilan Kasif basligini iceriyor', rep.includes(state.childName||'Kâşif'));
    check('printReport() Dersler bolumunu iceriyor', rep.includes('Dersler') && rep.includes('<table'));
    check('printReport() Ses Karnesi bolumunu iceriyor', rep.includes('Ses Karnesi'));
    check('printReport() Oneriler bolumunu iceriyor', rep.includes('Öneriler'));
  } catch (e) {
    check('Ebeveyn yazdir/PDF raporu (E1.12) hatasiz calisti (hata: ' + e.message + ')', false);
  }

  // --- 37) E8.1 entitlement katmani: state.entitlement, isPremium(), requirePremium() ---
  try {
    check('KEY okuma-kasifi-v3 olarak tanimli', KEY === 'okuma-kasifi-v3');
    state = fresh();
    check('state.entitlement varsayilan plan free', state.entitlement.plan === 'free');
    check('isPremium() free planda false donuyor', isPremium() === false);
    state.entitlement = { plan: 'premium', source: 'test', since: Date.now(), expires: null };
    check('isPremium() suresiz premium planda true donuyor', isPremium() === true);
    state.entitlement.expires = Date.now() - 1000;
    check('isPremium() suresi gecmis planda false donuyor', isPremium() === false);
    state.entitlement.expires = Date.now() + 100000;
    check('isPremium() suresi gecmemis planda true donuyor', isPremium() === true);
    let granted = false;
    state.entitlement = { plan: 'premium', source: 'test', since: Date.now(), expires: null };
    const reqResult = requirePremium('test', () => { granted = true; });
    check('requirePremium() zaten premiumken dogrudan true donup callback calistiriyor', reqResult === true && granted === true);
    state = fresh();
  } catch (e) {
    check('E8.1 entitlement katmani hatasiz calisti (hata: ' + e.message + ')', false);
  }

  // --- 38) E8.9 + E8.3 + E8.4: PLANS verisi, paywall ekrani, stub satin alma akisi ---
  try {
    check('#s-paywall ekrani DOM da mevcut', !!document.getElementById('s-paywall'));
    check('PLANS 3 plan iceriyor', Array.isArray(PLANS) && PLANS.length === 3);
    check('Her PLANS ogesinde id/fiyat/periyot/kapsam var', PLANS.every(p => p.id && typeof p.fiyat === 'number' && p.periyot && Array.isArray(p.kapsam) && p.kapsam.length > 0));
    state = fresh();
    openPaywall('test-ozellik', 's-map');
    check('openPaywall() s-paywall ekranini aktif ediyor', document.getElementById('s-paywall').classList.contains('active'));
    const plansHtml = document.getElementById('paywallPlans').innerHTML;
    check('paywall plan kartlari render edildi', (plansHtml.match(/plan-card/g) || []).length === 3);
    check('paywall kapatilinca geri donulecek ekran kaydedildi', paywallReturn === 's-map');

    buy('yillik');
    check('buy() stub odeme ekranini aciyor', document.getElementById('stubPay').classList.contains('active'));
    check('stub odeme ekrani secilen plani gosteriyor', document.getElementById('stubPayPlan').textContent.includes('Yıllık'));

    const before = isPremium();
    confirmStubPurchase();
    check('satin alma oncesi premium degildi', before === false);
    check('confirmStubPurchase() sonrasi isPremium() true', isPremium() === true);
    check('entitlement.source stub: ile basliyor', (state.entitlement.source || '').startsWith('stub:'));
    check('yillik planda expires ileri bir tarih', state.entitlement.expires > Date.now());
    check('confirmStubPurchase() stub odeme ekranini kapatip basari ekranini aciyor', !document.getElementById('stubPay').classList.contains('active') && document.getElementById('pwSuccess').classList.contains('active'));
    check('confirmStubPurchase() satin alma tesekkur rozeti kazandiriyor (E8.8)', state.badges.includes("Kâşif'in Yıldız Pelerini 🦸"));
    check('basari ekraninda rozet tesekkur metni gosteriliyor (E8.8)', document.getElementById('pwSuccessBadge').textContent.includes('Yıldız Pelerini'));

    let grantCalled = false;
    pendingPaywallGrant = () => { grantCalled = true; };
    finishPurchaseFlow();
    check('finishPurchaseFlow() bekleyen kilidi acma islemini calistiriyor', grantCalled === true);
    check('finishPurchaseFlow() basari ekranini kapatiyor', !document.getElementById('pwSuccess').classList.contains('active'));

    state = fresh();
  } catch (e) {
    check('E8.9/E8.3/E8.4 paywall + stub satin alma hatasiz calisti (hata: ' + e.message + ')', false);
  }

  // --- 39) E8.2 FEATURES bayraklari: 2. gruptan itibaren premium kilidi haritada ---
  try {
    check('lessonNeedsPremium(6) false (1. grup ucretsiz)', lessonNeedsPremium(6) === false);
    check('lessonNeedsPremium(7) true (2. grup premium)', lessonNeedsPremium(7) === true);

    state = fresh();
    state.mode = 'cozumleme';
    state.done = [0, 1, 2, 3, 4, 5, 6];
    go('s-map');
    const node7 = document.querySelectorAll('#path .node')[7];
    check('ders 7 dugmesi premium-lock sinifinda', node7.classList.contains('premium-lock'));
    check('ders 7 dugmesinde kilit simgesi gosteriliyor', node7.textContent === '🔒');
    check('ders 7 dugmesi tiklana bilir (paywall acmak icin disabled degil)', node7.disabled === false);

    node7.onclick();
    check('kilitli derse tiklayinca ebeveyn kapisi aciliyor', document.getElementById('gate').classList.contains('active'));
    check('bekleyen kilit acma islemi (ders 7 acacak) kaydedildi', typeof pendingPaywallGrant === 'function');

    gateOnSuccess();
    check('kapi gecilince paywall aciliyor', document.getElementById('s-paywall').classList.contains('active'));
    check('paywall kapatilinca haritaya donecek sekilde ayarlandi', paywallReturn === 's-map');

    buy('aylik');
    confirmStubPurchase();
    check('satin alma sonrasi isPremium() true', isPremium() === true);
    pendingPaywallGrant = null; closeOverlay('pwSuccess'); // openLesson()'ı jsdom canvas'sız ortamda tetiklemeden testi tamamla

    go('s-map');
    const node7b = document.querySelectorAll('#path .node')[7];
    check('premium acildiktan sonra ders 7 artik kilitli gorunmuyor', !node7b.classList.contains('premium-lock'));

    state = fresh();
    play = null;
  } catch (e) {
    check('E8.2 FEATURES/harita premium kilidi hatasiz calisti (hata: ' + e.message + ')', false);
  }

  // --- 40) E8.5: satin alimlari geri yukle + tanitim kodu ---
  try {
    state = fresh();
    openPaywall('test', 's-map');

    restorePurchases();
    check('gecmis yokken restorePurchases() uygun mesaj veriyor', document.getElementById('restoreMsg').textContent.includes('bulunamadı'));
    check('gecmis yokken restorePurchases() entitlement acmiyor', isPremium() === false);

    buy('tekseferlik');
    confirmStubPurchase();
    check('stub satin alma purchaseHistory kaydi birakiyor', state.purchaseHistory.length === 1 && state.purchaseHistory[0].source === 'stub:tekseferlik');
    closeOverlay('pwSuccess');

    state.entitlement = { plan: 'free', source: null, since: null, expires: null };
    check('entitlement elle sifirlandiktan sonra premium degil', isPremium() === false);
    restorePurchases();
    check('restorePurchases() gecmisten son satin almayi geri yukluyor', isPremium() === true && state.entitlement.source === 'stub:tekseferlik');

    state = fresh();
    const promoInput = document.getElementById('promoInput');
    promoInput.value = 'GECERSIZKOD';
    redeemPromo();
    check('gecersiz kod uygun hata mesaji veriyor', document.getElementById('promoMsg').textContent.includes('geçersiz') || document.getElementById('promoMsg').textContent.includes('Geçersiz'));
    check('gecersiz kod entitlement acmiyor', isPremium() === false);

    promoInput.value = 'kasif30';
    redeemPromo();
    check('gecerli kod (kucuk harfle girilse bile) premium aciyor', isPremium() === true);
    check('gecerli kodun suresi ~30 gun', Math.round((state.entitlement.expires - Date.now()) / 86400000) === 30);
    check('kullanilan kod promoUsed listesine eklendi', state.promoUsed.includes('KASIF30'));
    check('tanitim kodu (ucretsiz hediye) satin alma tesekkur rozetini KAZANDIRMIYOR (E8.8)', !state.badges.includes("Kâşif'in Yıldız Pelerini 🦸"));

    state.entitlement = { plan: 'free', source: null, since: null, expires: null };
    promoInput.value = 'KASIF30';
    redeemPromo();
    check('ayni kod ikinci kez kullanilmaya calisilinca reddediliyor', isPremium() === false && document.getElementById('promoMsg').textContent.includes('daha önce'));

    state = fresh();
  } catch (e) {
    check('E8.5 geri yukle/tanitim kodu hatasiz calisti (hata: ' + e.message + ')', false);
  }

  // --- 41) E8.7: nazik premium tesviki - ders 6 sonu kesif karti + ebeveyn ayarlarinda bolum ---
  try {
    state = fresh();
    state.done = [0, 1, 2, 3, 4, 5];
    play = { lessonId: 6, steps: [], i: 0 };
    assessResults = [];
    finishLesson();
    check('ucretsiz kullanicida ders 6 sonunda kesif karti gorunuyor', document.getElementById('doneDiscover').hidden === false);
    check('kesif dugmesi de gorunur', document.getElementById('doneDiscoverBtn').hidden === false);

    state.entitlement = { plan: 'premium', source: 'test', since: Date.now(), expires: null };
    state.done = [0, 1, 2, 3, 4, 5];
    play = { lessonId: 6, steps: [], i: 0 };
    finishLesson();
    check('premium kullaniciya kesif karti gosterilmiyor', document.getElementById('doneDiscover').hidden === true);

    state.entitlement = { plan: 'free', source: null, since: null, expires: null };
    state.done = [0, 1, 2, 3, 4, 5, 6];
    play = { lessonId: 7, steps: [], i: 0 };
    finishLesson();
    check('baska derste kesif karti gorunmuyor (yalniz ders 6da)', document.getElementById('doneDiscover').hidden === true);

    check('entitlementLabel() ucretsizde dogru metin donuyor', entitlementLabel() === 'Ücretsiz');
    state.entitlement = { plan: 'premium', source: 'test', since: Date.now(), expires: null };
    check('entitlementLabel() kalici premiumda dogru metin donuyor', entitlementLabel() === 'Premium — kalıcı');

    state.entitlement = { plan: 'free', source: null, since: null, expires: null };
    const ayarHtmlFree = pAyar();
    check('pAyar() ucretsizken premium tesvik bolumunu iceriyor', ayarHtmlFree.includes("Premium'da neler var"));
    state.entitlement = { plan: 'premium', source: 'test', since: Date.now(), expires: null };
    const ayarHtmlPremium = pAyar();
    check('pAyar() premiumken tesvik yerine durum gosteriyor', ayarHtmlPremium.includes('Premium — kalıcı') && !ayarHtmlPremium.includes("Premium'da neler var"));

    state = fresh();
    play = null;
  } catch (e) {
    check('E8.7 premium tesvik hatasiz calisti (hata: ' + e.message + ')', false);
  }

  // --- 42) E3.6: ilerleme rozeti sistemi (ses ustaligi, gun serisi, ilk kelime/cumle/metin, koleksiyon ekrani) ---
  try {
    state = fresh();
    play = null;

    check('awardBadge() yeni rozeti state.badges e ekliyor', (() => {
      state.badges = [];
      awardBadge('Test Rozeti X');
      return state.badges.includes('Test Rozeti X');
    })());
    check('awardBadge() ayni rozeti tekrar eklemiyor (dedup)', (() => {
      awardBadge('Test Rozeti X');
      return state.badges.filter(b => b === 'Test Rozeti X').length === 1;
    })());

    state.soundStats = { a: { c: 5, w: 0, strength: 5 }, n: { c: 5, w: 0, strength: 3 } };
    check('masteredSoundCount() sadece strength>=5 olanlari sayiyor', masteredSoundCount() === 1);

    state.badges = [];
    checkMilestoneBadges();
    check('1 seste ustalik rozeti kazandiriyor', state.badges.includes('İlk Sesini Ustaca Söyledin 🎯'));
    check('henuz 10 seste ustalik rozeti yok', !state.badges.includes('10 Seste Usta Oldun 🎯✨'));

    const st10 = {};
    'anetilokurı'.split('').forEach(s => { st10[s] = { c: 5, w: 0, strength: 5 }; });
    state.soundStats = st10;
    state.badges = [];
    checkMilestoneBadges();
    check('10+ seste ustalik rozeti kazandiriyor', state.badges.includes('10 Seste Usta Oldun 🎯✨'));

    state.soundStats = {};
    state.daily = {};
    const d = new Date();
    for (let i = 0; i < 3; i++) { const k = new Date(d); k.setDate(d.getDate() - i); state.daily[k.toISOString().slice(0, 10)] = 90; }
    state.badges = [];
    checkMilestoneBadges();
    check('3 gun ust uste calisma rozeti kazandiriyor', state.badges.includes('3 Gün Üst Üste Kâşif 🔥'));
    check('henuz 7 gun rozeti yok', !state.badges.includes('7 Gün Üst Üste Kâşif 🔥🔥'));

    state = fresh();
    play = null;
    wordState = { kind: 'kelime', sep: '', target: ['a', 't'], tiles: [], filled: [{ l: 'a' }, { l: 't' }] };
    checkWord();
    check('ilk kelime kurulunca rozet kazandiriyor', state.badges.includes('İlk Kelimeni Kurdun 📝'));
    check('cumle rozeti henuz yok (kelime kuruldu)', !state.badges.includes('İlk Cümleni Kurdun 🌱'));

    wordState = { kind: 'cumle', sep: ' ', target: ['O', 'al'], tiles: [], filled: [{ l: 'O' }, { l: 'al' }] };
    checkWord();
    check('ilk cumle kurulunca rozet kazandiriyor', state.badges.includes('İlk Cümleni Kurdun 🌱'));

    const origSay2 = say;
    say = (text, cb) => { if (cb) cb(); };
    state = fresh();
    play = null;
    roundOkuma();
    startOkumaQuestions();
    let rb = document.querySelector('#choices .choice[data-right="1"]');
    answerOkuma(rb, true);
    rb = document.querySelector('#choices .choice[data-right="1"]');
    answerOkuma(rb, true);
    check('Okuma Kulubu tamamlaninca ilk metin rozeti kazandiriyor', state.badges.includes('İlk Metnini Okudun 📖'));
    say = origSay2;

    const cat = badgeCatalog();
    check('badgeCatalog() ders-grubu + kilometre tasi rozetlerini birlestiriyor', cat.length >= LESSONS.filter(L => L.rozet).length + MILESTONE_BADGES.length);
    state.badges = [cat[0].text];
    go('s-collection');
    check('renderCollection() kazanilan/toplam sayisini gosteriyor', document.getElementById('collectionCount').textContent.includes('1 / ' + cat.length));
    check('renderCollection() kazanilmamis rozeti gizli (???) gosteriyor', document.getElementById('collectionGrid').innerHTML.includes('???'));

    state = fresh();
    play = null;
  } catch (e) {
    check('E3.6 ilerleme rozeti sistemi hatasiz calisti (hata: ' + e.message + ')', false);
  }

  // --- Defter (harf ustalık galerisi, premium): FEATURES bayrağı + kilitli/ustalaşılmış görünüm ---
  try {
    check('FEATURES.harfDefteri premium olarak isaretli', FEATURES.harfDefteri === 'premium');
    state = fresh();
    state.entitlement = { plan: 'premium', source: 'test', since: Date.now(), expires: null };
    go('s-defter');
    check('Defter acilmamis harfi kilitli gosteriyor', document.getElementById('defterGrid').innerHTML.includes('🔒'));
    check('Defter sayaci 0 ile basliyor', document.getElementById('defterCount').textContent.includes('0 / ' + ALL_LETTERS.length));
    state.soundStats.a = state.soundStats.a || {};
    state.soundStats.a.cizLevel = 5;
    go('s-defter');
    check('Defter ustalasilan harfi yildizla gosteriyor', document.getElementById('defterGrid').innerHTML.includes('🌟'));
    check('Defter sayaci ustalasilan harfle guncelleniyor', document.getElementById('defterCount').textContent.includes('1 / ' + ALL_LETTERS.length));
    state = fresh();
  } catch (e) {
    check('Defter hatasiz calisti (hata: ' + e.message + ')', false);
  }

  // --- 43) E4.4 (a) 5. grup başlangıcı: p sesi tam donanımlı eklendi (WORDS/STROKES/LESSONS/WORDBANK) ---
  try {
    check('WORDS.p tanımlı ve p ile başlıyor', !!WORDS.p && WORDS.p.word[0] === 'p');
    check('STROKES.p tanımlı (çok vuruşlu: gövde + üst ilmek)', Array.isArray(STROKES.p) && STROKES.p.length === 2);
    const L26 = LESSONS.find(x => x.id === 26);
    check('LESSONS içinde ders 26 "Ses p" olarak tanımlı', !!L26 && L26.yeni.includes('p'));
    const poolWithP = poolUpTo(26);
    check('poolUpTo(26) p sesini içeriyor', poolWithP.includes('p'));
    const reachableP = WORDBANK.filter(it => it.w.split('').every(c => poolWithP.includes(c)));
    check('"para" p ogrenilince WORDBANK icinde erisilebilir', reachableP.some(it => it.w === 'para'));
  } catch (e) {
    check('5. grup p sesi (E4.4 a) hatasız çalıştı (hata: ' + e.message + ')', false);
  }

  // --- 44) E4.4 (b) 5. grup: h sesi tam donanımlı eklendi (WORDS/STROKES/LESSONS/WORDBANK) ---
  try {
    check('WORDS.h tanımlı ve h ile başlıyor', !!WORDS.h && WORDS.h.word[0] === 'h');
    check('STROKES.h tanımlı (çok vuruşlu: gövde + kemer)', Array.isArray(STROKES.h) && STROKES.h.length === 2);
    const L27 = LESSONS.find(x => x.id === 27);
    check('LESSONS içinde ders 27 "Ses h" olarak tanımlı', !!L27 && L27.yeni.includes('h'));
    const poolWithH = poolUpTo(27);
    check('poolUpTo(27) p ve h seslerinin ikisini de içeriyor', ['p', 'h'].every(c => poolWithH.includes(c)));
    const reachableH = WORDBANK.filter(it => it.w.split('').every(c => poolWithH.includes(c)));
    check('"horoz" h ogrenilince WORDBANK icinde erisilebilir', reachableH.some(it => it.w === 'horoz'));
    check('"horoz" kelimesi henuz ogrenilmemis v sesi icermiyor', !WORDS.h.word.includes('v'));
  } catch (e) {
    check('5. grup h sesi (E4.4 b) hatasız çalıştı (hata: ' + e.message + ')', false);
  }

  // --- 45) E4.4 (c) 5. grup: v sesi tam donanımlı eklendi (WORDS/STROKES/LESSONS/WORDBANK) ---
  try {
    check('WORDS.v tanımlı ve v ile başlıyor', !!WORDS.v && WORDS.v.word[0] === 'v');
    check('STROKES.v tanımlı (tek vuruş: V şekli)', Array.isArray(STROKES.v) && STROKES.v.length === 1);
    const L28 = LESSONS.find(x => x.id === 28);
    check('LESSONS içinde ders 28 "Ses v" olarak tanımlı', !!L28 && L28.yeni.includes('v'));
    const poolWithV = poolUpTo(28);
    check('poolUpTo(28) 5. grubun ilk 3 sesini (p,h,v) içeriyor', ['p', 'h', 'v'].every(c => poolWithV.includes(c)));
    const reachableV = WORDBANK.filter(it => it.w.split('').every(c => poolWithV.includes(c)));
    check('"vazo" v ogrenilince WORDBANK icinde erisilebilir', reachableV.some(it => it.w === 'vazo'));
    check('ALL_LETTERS h ve v harflerini iceriyor (dagitici havuzu)', ['h', 'v'].every(c => ALL_LETTERS.includes(c)));
  } catch (e) {
    check('5. grup v sesi (E4.4 c) hatasız çalıştı (hata: ' + e.message + ')', false);
  }

  // --- 46) E4.4 (d) 5. grup: 'ğ' ozel kurali - kelime basinda hic olmaz ---
  try {
    check('WORDS.ğ tanımlı ve kelimesi ğ ile BAŞLAMIYOR (ozel kural)', !!WORDS['ğ'] && WORDS['ğ'].word[0] !== 'ğ');
    check('WORDS.ğ kelimesi ğ harfini iceriyor (ortada/sonda)', WORDS['ğ'].word.includes('ğ'));
    check('STROKES.ğ tanımlı (3 vuruş: sapka+govde+kuyruk)', Array.isArray(STROKES['ğ']) && STROKES['ğ'].length === 3);
    const L29 = LESSONS.find(x => x.id === 29);
    check('LESSONS içinde ders 29 "Ses ğ" olarak tanımlı', !!L29 && L29.yeni.includes('ğ'));
    const poolWithG2 = poolUpTo(29);
    check('poolUpTo(29) ğ sesini içeriyor', poolWithG2.includes('ğ'));
    const reachableG2 = WORDBANK.filter(it => it.w.split('').every(c => poolWithG2.includes(c)));
    check('"dağ" ğ ogrenilince WORDBANK icinde erisilebilir', reachableG2.some(it => it.w === 'dağ'));

    check('syllablesFor() gecerli V+ğ hecesi (ağ) uretiyor', syllablesFor(['a', 'ğ']).includes('ağ'));
    check('syllablesFor() gecersiz ğ+V hecesi (ğa) URETMIYOR (ğ hece basinda olmaz)', !syllablesFor(['a', 'ğ']).includes('ğa'));

    const origSay3 = say;
    say = (text, cb) => { if (cb) cb(); };
    state = fresh();
    play = null;
    let sawStartsWithPrompt = false;
    for (let i = 0; i < 30; i++) {
      curTargets = [];
      roundBul(['ğ']);
      if (qtext.textContent.includes('hangi harfle başlar')) sawStartsWithPrompt = true;
    }
    check('roundBul() ğ hedefteyken hicbir zaman "hangi harfle basliyor" varyantini kullanmiyor', !sawStartsWithPrompt);

    let sawGAsSesStartTarget = false;
    for (let i = 0; i < 30; i++) {
      curTargets = [];
      roundSes(['ğ', 'a', 'd']);
      if (curTargets.includes('ğ') && qtext.textContent.includes('başlıyor')) sawGAsSesStartTarget = true;
    }
    check('roundSes() ğ hicbir zaman "hangisi ... sesiyle basliyor" hedefi olmuyor', !sawGAsSesStartTarget);
    say = origSay3;

    state = fresh();
    play = null;
  } catch (e) {
    check('5. grup ğ ozel kurali (E4.4 d) hatasız çalıştı (hata: ' + e.message + ')', false);
  }

  // --- 47) E4.4 (e) 5. grup: f sesi tam donanımlı eklendi (WORDS/STROKES/LESSONS/WORDBANK) ---
  try {
    check('WORDS.f tanımlı ve f ile başlıyor', !!WORDS.f && WORDS.f.word[0] === 'f');
    check('STROKES.f tanımlı (çok vuruşlu: kancali govde + cizgi)', Array.isArray(STROKES.f) && STROKES.f.length === 2);
    const L30 = LESSONS.find(x => x.id === 30);
    check('LESSONS içinde ders 30 "Ses f" olarak tanımlı', !!L30 && L30.yeni.includes('f'));
    const poolWithF = poolUpTo(30);
    check('poolUpTo(30) f sesini içeriyor', poolWithF.includes('f'));
    const reachableF = WORDBANK.filter(it => it.w.split('').every(c => poolWithF.includes(c)));
    check('"fil" f ogrenilince WORDBANK icinde erisilebilir', reachableF.some(it => it.w === 'fil'));
  } catch (e) {
    check('5. grup f sesi (E4.4 e) hatasız çalıştı (hata: ' + e.message + ')', false);
  }

  // --- 48) E4.4 (f) 5. grup tamamlandı: j sesi + "Kâşif Gösterisi 4" rozet dersi ---
  try {
    check('WORDS.j tanımlı ve j ile başlıyor', !!WORDS.j && WORDS.j.word[0] === 'j');
    check('STROKES.j tanımlı (çok vuruşlu: nokta + kancali kuyruk)', Array.isArray(STROKES.j) && STROKES.j.length === 2);
    const L31 = LESSONS.find(x => x.id === 31);
    check('LESSONS içinde ders 31 "Ses j" olarak tanımlı', !!L31 && L31.yeni.includes('j'));
    const L32 = LESSONS.find(x => x.id === 32);
    check('LESSONS içinde ders 32 "Kâşif Gösterisi 4" gosteri tipinde ve rozetli', !!L32 && L32.tip === 'gosteri' && !!L32.rozet);
    const poolWithJ = poolUpTo(31);
    check('poolUpTo(31) 5. grubun tüm seslerini (p,h,v,ğ,f,j) içeriyor',
      ['p', 'h', 'v', 'ğ', 'f', 'j'].every(ch => poolWithJ.includes(ch)));
    const reachableJ = WORDBANK.filter(it => it.w.split('').every(c => poolWithJ.includes(c)));
    check('"jeton" j ogrenilince WORDBANK icinde erisilebilir', reachableJ.some(it => it.w === 'jeton'));
    check('ALL_LETTERS f ve j harflerini iceriyor (dagitici havuzu)', ['f', 'j'].every(c => ALL_LETTERS.includes(c)));

    state = fresh();
    state.done = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
    play = { lessonId: 32, steps: [], i: 0 };
    assessResults = [];
    finishLesson();
    check('Ders 32 (Kâşif Gösterisi 4) bitince 5. grup rozeti kazandırıyor', state.badges.includes('5. Grup Kâşifi 🏆'));
    check('Kâşif Gösterisi 4 puansız (needsReview isareti yok)', !(state.lessonLog[32] && state.lessonLog[32].needsReview));
    state = fresh();
    play = null;
  } catch (e) {
    check('5. grup j sesi + Kâşif Gösterisi 4 (E4.4 f) hatasız çalıştı (hata: ' + e.message + ')', false);
  }

  // --- E4.7: Rakam ve sayı sesleri mini-modülü (1-10) ---
  try {
    check('NUMBERS 10 sayı içeriyor (1-10)', Array.isArray(NUMBERS) && NUMBERS.length === 10);
    check('NUMBERS sırayla 1den 10a kadar', NUMBERS.every((x, i) => x.n === i + 1));
    check('NUMBERS her girişte Türkçe okunuş (tr) var', NUMBERS.every(x => typeof x.tr === 'string' && x.tr.length > 0));

    state = fresh();
    recentRounds = [];
    play = null;

    const origRandom = Math.random;
    Math.random = () => 0.2; // (a) duy-bul varyantı
    roundRakam();
    Math.random = origRandom;
    check('roundRakam() (a) varyantı "Duyduğun sayı hangisi?" soruyor', qtext.textContent === 'Duyduğun sayı hangisi?');
    check('roundRakam() normal seviyede 3 seçenek sunuyor', document.querySelectorAll('#choices .choice').length === 3);
    check('roundRakam() tam olarak 1 doğru şık işaretliyor', document.querySelectorAll('#choices .choice[data-right="1"]').length === 1);

    Math.random = () => 0.8; // (b) say-bul varyantı
    roundRakam();
    Math.random = origRandom;
    check('roundRakam() (b) varyantı "Kaç tane? Say ve bul." soruyor', qtext.textContent === 'Kaç tane? Say ve bul.');
    check('roundRakam() (b) varyantı sesli anlatımda cevabı ele vermiyor', NUMBERS.every(x => !roundPrompt.includes(x.tr)));

    const rBtn = document.querySelector('#choices .choice[data-right="1"]');
    curWrongCount = 0;
    const correctBefore = state.correct;
    choose(rBtn, true);
    check('roundRakam() doğru cevapta dogru sayacini artirip butonu isaretliyor', state.correct === correctBefore + 1 && rBtn.classList.contains('right'));

    state = fresh();
    play = null;
    freeGame = 'rakam';
    startFree('rakam');
    check('startFree("rakam") s-game ekranına geçiyor ve tur render ediyor', document.getElementById('s-game').classList.contains('active') && document.querySelectorAll('#choices .choice').length > 0);
  } catch (e) {
    check('E4.7 rakam mini-modülü hatasız çalıştı (hata: ' + e.message + ')', false);
  }

  // --- E4.6: Büyük/küçük harf farkındalığı (cümle başı + özel ad) ---
  try {
    check('capitalize() normal harfi büyütüyor', capitalize('ali') === 'Ali');
    check('capitalize() Türkçe ı/I kuralını uyguluyor', capitalize('ışık') === 'Işık');
    check('capitalize() Türkçe i/İ kuralını uyguluyor', capitalize('iğne') === 'İğne');
    check('PROPER_NAMES en az 3 isim içeriyor', Array.isArray(PROPER_NAMES) && PROPER_NAMES.length >= 3);

    const fullPool2 = ['a', 'n', 'e', 't', 'i', 'l', 'o', 'k', 'u', 'r', 'ı', 'm'];
    state = fresh();
    recentRounds = [];
    play = null;
    const origRandom2 = Math.random;

    Math.random = () => 0.1; // (b) özel ad varyantı (wantName true, ilk aday seçilir)
    roundBuyuk(fullPool2);
    Math.random = origRandom2;
    check('roundBuyuk() (b) özel ad varyantı doğru soru metnini gösteriyor', qtext.textContent === 'Hangisi bir kişi adı? (Büyük harfle başlar)');
    check('roundBuyuk() (b) varyantında tam 1 doğru şık var', document.querySelectorAll('#choices .choice[data-right="1"]').length === 1);
    const rightGlyphB = document.querySelector('#choices .choice[data-right="1"] .glyph').textContent;
    check('roundBuyuk() (b) doğru şık ismin büyük harfle başlayan hali', rightGlyphB[0] === rightGlyphB[0].toUpperCase() && PROPER_NAMES.some(p => capitalize(p.name) === rightGlyphB));

    Math.random = () => 0.9; // (a) cümle başı varyantı
    roundBuyuk(fullPool2);
    Math.random = origRandom2;
    check('roundBuyuk() (a) cümle başı varyantı doğru soru metnini gösteriyor', /cümlesi hangisiyle başlamalı\\?$/.test(qtext.textContent));
    check('roundBuyuk() (a) varyantında 2 şık sunuluyor (c2)', document.querySelectorAll('#choices .choice').length === 2);
    check('roundBuyuk() (a) varyantında tam 1 doğru şık var', document.querySelectorAll('#choices .choice[data-right="1"]').length === 1);
    const rightGlyphA = document.querySelector('#choices .choice[data-right="1"] .glyph').textContent;
    const wrongGlyphA = document.querySelector('#choices .choice:not([data-right="1"]) .glyph').textContent;
    check('roundBuyuk() (a) doğru şık, yanlış şıkkın büyük harfli hali', capitalize(wrongGlyphA) === rightGlyphA);

    const rBtnBuyuk = document.querySelector('#choices .choice[data-right="1"]');
    curWrongCount = 0;
    const correctBefore2 = state.correct;
    choose(rBtnBuyuk, true);
    check('roundBuyuk() doğru cevapta doğru sayacını artırıyor', state.correct === correctBefore2 + 1);

    state = fresh();
    play = null;
    roundBuyuk(['a']); // yetersiz pool -> güvenli şekilde roundBul içine düşmeli
    check('roundBuyuk() yetersiz pool ile hatasız roundBul icine düşüyor', document.querySelectorAll('#choices .choice').length > 0);

    go('s-mode'); setMode('kesif');
    go('s-free');
    check('Keşif modunda "Büyük mü Küçük mü?" kartı gizli', document.getElementById('freeBuyuk').style.display === 'none');
    setMode('cozumleme');
    go('s-free');
    check('Çözümleme modunda "Büyük mü Küçük mü?" kartı görünür', document.getElementById('freeBuyuk').style.display !== 'none');

    state = fresh();
    play = null;
    freeGame = 'buyuk';
    startFree('buyuk');
    check('startFree("buyuk") s-game ekranına geçiyor ve tur render ediyor', document.getElementById('s-game').classList.contains('active') && document.querySelectorAll('#choices .choice').length > 0);
  } catch (e) {
    check('E4.6 büyük/küçük harf farkındalığı hatasız çalıştı (hata: ' + e.message + ')', false);
  }

  // --- E5.3: Ses hız/tekrar kontrolü (yavaş/normal) ---
  try {
    state = fresh();
    check('fresh() varsayılan speechRate normal', state.settings.speechRate === 'normal');
    check('ttsRate() normalde 0.86 dönüyor', ttsRate() === 0.86);
    state.settings.speechRate = 'yavas';
    check('ttsRate() yavasta daha dusuk bir deger donuyor', ttsRate() < 0.86 && ttsRate() > 0);

    state = fresh();
    parentTab('ayar');
    const rateSelect = document.getElementById('setRate');
    check('Ayarlar sekmesinde ses hızı seçici mevcut', !!rateSelect);
    check('Ses hızı seçicide normal secili varsayılan', rateSelect && rateSelect.value === 'normal');
    if (rateSelect) {
      rateSelect.value = 'yavas';
      rateSelect.dispatchEvent(new window.Event('change'));
    }
    check('Ses hızı degistirilince state.settings.speechRate guncelleniyor', state.settings.speechRate === 'yavas');
    const savedRate = JSON.parse(localStorage.getItem(KEY));
    check('Ses hızı tercihi localStorage a kaydediliyor', savedRate && savedRate.settings && savedRate.settings.speechRate === 'yavas');
  } catch (e) {
    check('E5.3 ses hızı kontrolü hatasız çalıştı (hata: ' + e.message + ')', false);
  }

  // --- E5.5: Disleksi-dostu görünüm (sıcak zemin + genişletilmiş aralık) ---
  try {
    state = fresh();
    state.settings.dyslexia = false;
    applySettings();
    check('applySettings() dyslexia kapaliyken dys sinifi yok', !document.documentElement.classList.contains('dys'));
    state.settings.dyslexia = true;
    applySettings();
    check('applySettings() dyslexia acikken dys sinifini ekliyor', document.documentElement.classList.contains('dys'));
    document.documentElement.classList.remove('dys');
  } catch (e) {
    check('E5.5 disleksi-dostu gorunum hatasiz calisti (hata: ' + e.message + ')', false);
  }

  // --- E5.7: Sessiz mod - TTS mesajlarinin yazili karsiligi da gosterilsin (fbMsg) ---
  try {
    state = fresh();
    play = null;
    roundBul(['a', 'n', 'e', 't']);
    const rightBtn = document.querySelector('#choices .choice[data-right="1"]');
    choose(rightBtn, true);
    let fb = document.getElementById('fbMsg');
    check('choose() dogru cevapta fbMsg gorunur ve metin iceriyor', fb.hidden === false && fb.textContent.length > 0);

    state = fresh();
    play = null;
    roundBul(['a', 'n', 'e', 't']);
    const wrongBtn2 = document.querySelector('#choices .choice:not([data-right="1"])');
    choose(wrongBtn2, false);
    fb = document.getElementById('fbMsg');
    check('choose() 1. yanlista fbMsg gorunur ve metin iceriyor', fb.hidden === false && fb.textContent.length > 0);

    hideFeedback();
    fb = document.getElementById('fbMsg');
    check('hideFeedback() fbMsg gizler ve temizler', fb.hidden === true && fb.textContent === '');

    state = fresh();
    play = null;
    wordState = { kind: 'kelime', sep: '', target: ['a', 't'], tiles: [], filled: [{ l: 'a' }, { l: 't' }] };
    checkWord();
    fb = document.getElementById('fbMsg');
    check('checkWord() dogru kelimede fbMsg gorunur ve metin iceriyor', fb.hidden === false && fb.textContent.length > 0);

    state = fresh();
    play = null; freeGame = null;
    showFeedback('eski mesaj');
    startFree('bul');
    check('nextFreeRound() yeni turda onceki fbMsg temizleniyor', document.getElementById('fbMsg').hidden === true);
  } catch (e) {
    check('E5.7 sessiz mod yazili geri bildirim hatasiz calisti (hata: ' + e.message + ')', false);
  }

  // --- E6.5: Büyük harf çizimi (STROKES_UPPER ayrı kılavuz + ayrı ilerleme) ---
  try {
    const lowerKeys = Object.keys(STROKES).sort();
    const upperKeys = Object.keys(STROKES_UPPER).sort();
    check('STROKES_UPPER, STROKES ile aynı 29 anahtara (küçük harf) sahip', lowerKeys.length === 29 && JSON.stringify(lowerKeys) === JSON.stringify(upperKeys));
    const allCoordsValid = Object.values(STROKES_UPPER).every(strokes =>
      strokes.length > 0 && strokes.every(s => s.length >= 2 && s.every(([x, y]) => x >= 0 && x <= 1 && y >= 0 && y <= 1)));
    check('STROKES_UPPER her vuruşta ≥2 nokta, tüm koordinatlar 0-1 arasında', allCoordsValid);

    check('cizLevelUpper() ses hiç çizilmemişken varsayılan 1', cizLevelUpper('a') === 1);
    state.soundStats = { a: { c: 0, w: 0, cizLevelUpper: 3 } };
    check('cizLevelUpper() kayıtlı kademeyi döndürüyor', cizLevelUpper('a') === 3);

    check('multiStrokeGuideOn() STROKES_UPPER ile çok vuruşlu BÜYÜK t için true döner', multiStrokeGuideOn('t', 1, STROKES_UPPER) === true);
    check('multiStrokeGuideOn() STROKES_UPPER ile tek vuruşlu BÜYÜK ı için false döner', multiStrokeGuideOn('ı', 1, STROKES_UPPER) === false);

    // checkTrace() büyük harf modunda (trace.upper) yalnız cizLevelUpper'ı ilerletir, cizLevel'a dokunmaz
    state = fresh();
    curTargets = ['a'];
    const pts = Array.from({ length: 15 }, (_, i) => [i, i]);
    trace = { letter: 'a', upper: true, strokes: [pts], maskPts: [[1, 1], [5, 5], [10, 10]], size: 100 };
    checkTrace();
    check('checkTrace() büyük harf modunda cizLevelUpper 1→2 ilerliyor', state.soundStats.a.cizLevelUpper === 2);
    check('checkTrace() büyük harf modunda cizLevel (küçük harf) etkilenmiyor', !state.soundStats.a.cizLevel);

    // Serbest oyun menüsü kartı + Çözümleme moduna özel görünürlük
    go('s-mode'); setMode('kesif');
    go('s-free');
    check('Keşif modunda "Büyük Harf Çiz" kartı gizli', document.getElementById('freeCizBuyuk').style.display === 'none');
    setMode('cozumleme');
    go('s-free');
    check('Çözümleme modunda "Büyük Harf Çiz" kartı görünür', document.getElementById('freeCizBuyuk').style.display !== 'none');
  } catch (e) {
    check('E6.5 büyük harf çizimi hatasız çalıştı (hata: ' + e.message + ')', false);
  }

  // --- E6.4: "Havada çiz" ısınması + parmak kası ısınma çizgileri (dalga, zikzak, sarmal) ---
  try {
    const L0 = LESSONS.find(x => x.id === 0);
    const steps0 = buildSteps(L0);
    check('buildSteps(ders 0) serbest çizim + 3 ısınma şekli içeriyor', steps0.length === 4 && steps0[0].game === 'hazirlik');
    check('buildSteps(ders 0) sırayla dalga/zikzak/sarmal ekliyor', ['dalga', 'zikzak', 'sarmal'].every((k, idx) => steps0[idx + 1].game === 'hazirlikSekil' && steps0[idx + 1].sekil === k));

    check('WARMUP_SHAPES 3 şekil içeriyor (dalga, zikzak, sarmal)', Object.keys(WARMUP_SHAPES).length === 3);
    check('WARMUP_SHAPES her şeklin path dizisi ≥4 nokta ve 0-1 aralığında', Object.values(WARMUP_SHAPES).every(sh => sh.path.length >= 4 && sh.path.every(([x, y]) => x >= 0 && x <= 1 && y >= 0 && y <= 1)));
    check('spiralPoints() istenen tur sayısına göre nokta üretiyor', spiralPoints(2).length > 10);

    state = fresh();
    play = { lessonId: 0, steps: steps0, i: 1 };
    curTargets = [];
    const shapePath = WARMUP_SHAPES.dalga.path.map(([x, y]) => [x * 100, y * 100]);
    const goodPts = shapePath.slice();
    trace = { shape: 'dalga', strokes: [goodPts], path: shapePath, size: 100, reset() {} };
    checkWarmupTrace();
    check('checkWarmupTrace() kılavuzun üstünden geçince kilitleniyor (basarili)', locked === true);

    state = fresh();
    play = { lessonId: 0, steps: steps0, i: 1 };
    locked = false;
    trace = { shape: 'dalga', strokes: [[[5, 5], [8, 8], [10, 10]]], path: shapePath, size: 100, reset() {} };
    checkWarmupTrace();
    check('checkWarmupTrace() alakasız çizimde kilitlenmiyor (basarisiz, tekrar denenebilir)', locked === false);
  } catch (e) {
    check('E6.4 parmak kası ısınma çizgileri hatasız çalıştı (hata: ' + e.message + ')', false);
  }

  // --- E7.4: Hata sınırı — beklenmeyen hatada nazik "yeniden başlat" ekranı ---
  try {
    go('s-map');
    check('showErrorScreen() öncesinde s-map aktif', document.getElementById('s-map').classList.contains('active'));
    showErrorScreen();
    check('showErrorScreen() #s-error ekranını aktif yapıyor', document.getElementById('s-error').classList.contains('active'));
    check('showErrorScreen() önceki ekranı (s-map) devre dışı bırakıyor', !document.getElementById('s-map').classList.contains('active'));

    go('s-map');
    window.dispatchEvent(new window.ErrorEvent('error', { message: 'test hatası' }));
    check('window "error" olayı otomatik olarak #s-error ekranına geçiyor', document.getElementById('s-error').classList.contains('active'));
  } catch (e) {
    check('E7.4 hata sınırı hatasız çalıştı (hata: ' + e.message + ')', false);
  }

  // --- E5.4: erişilebilirlik geçişi — .age-card kartları klavyeyle de tıklanabilir olmalı ---
  try {
    state = fresh(); state.mode = null; save();
    go('s-mode');
    const card = Array.from(document.querySelectorAll('.age-card')).find(el => el.getAttribute('onclick').includes('setMode') && el.getAttribute('onclick').includes('kesif'));
    check('age-card klavye odağı alabiliyor (tabindex=0)', card && card.getAttribute('tabindex') === '0');
    check('age-card role="button" taşıyor', card && card.getAttribute('role') === 'button');
    // jsdom (runScripts:'outside-only') satır-içi onclick niteliğini çalıştırmadığından,
    // gerçek tıklama (.click()) yerine bir 'click' dinleyicisiyle delegasyonun onu tetiklediğini doğruluyoruz.
    let clicked = false;
    card.addEventListener('click', () => { clicked = true; });
    card.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
    check('age-card üzerinde Enter tuşu click() eylemini tetikliyor', clicked === true);
    clicked = false;
    card.dispatchEvent(new window.KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true }));
    check('age-card üzerinde Boşluk tuşu click() eylemini tetikliyor', clicked === true);
  } catch (e) {
    check('E5.4 klavye erişilebilirliği hatasız çalıştı (hata: ' + e.message + ')', false);
  }

  // --- E7.7: otomatik güncelleme — nazik "güncelle" çubuğu (gerçek serviceWorker jsdom'da yok,
  // bu yüzden saf gösterme/uygulama fonksiyonlarını sahte bir "worker" nesnesiyle doğruluyoruz) ---
  try {
    check('updateBar başlangıçta gizli', document.getElementById('updateBar').hidden === true);
    let posted = null;
    const fakeWorker = { postMessage: (m) => { posted = m; } };
    showUpdateBar(fakeWorker);
    check('showUpdateBar() çubuğu gösteriyor', document.getElementById('updateBar').hidden === false);
    applyUpdate();
    check('applyUpdate() bekleyen worker SKIP_WAITING mesajı alıyor', posted === 'SKIP_WAITING');
    dismissUpdate();
    check('dismissUpdate() çubuğu tekrar gizliyor', document.getElementById('updateBar').hidden === true);
  } catch (e) {
    check('E7.7 güncelleme çubuğu hatasız çalıştı (hata: ' + e.message + ')', false);
  }

  // --- E8.10: 7 gün ücretsiz deneme (ebeveyn başlatır, cihaz başına tek sefer, otomatik ücret yok) ---
  try {
    state = fresh();
    check('yeni state trialUsed=false ile başlıyor', state.trialUsed === false);
    check('deneme başlamadan önce premium değil', isPremium() === false);

    openPaywall('test', 's-map');
    check('trialBox uygun (deneme hakkı varken) görünür', document.getElementById('trialBox').hidden === false);

    startTrial();
    check('startTrial() premium açıyor', isPremium() === true);
    check('startTrial() source=trial olarak işaretliyor', state.entitlement.source === 'trial');
    check('startTrial() süresi ~7 gün', Math.round((state.entitlement.expires - Date.now()) / 86400000) === 7);
    check('startTrial() trialUsed=true yapıyor', state.trialUsed === true);
    check('startTrial() purchaseHistory kaydı bırakıyor', state.purchaseHistory.some(h => h.source === 'trial'));
    closeOverlay('pwSuccess');

    renderPaywallPlans();
    check('deneme kullanıldıktan sonra trialBox gizleniyor', document.getElementById('trialBox').hidden === true);

    const entBefore = { ...state.entitlement };
    startTrial();
    check('deneme ikinci kez başlatılamıyor (entitlement değişmiyor)', state.entitlement.since === entBefore.since);

    // Deneme süresi bittiğinde (satın almadıysa) ebeveyn ayarlarında nazik hatırlatma gösterilsin.
    state.entitlement = { plan: 'free', source: 'trial', since: Date.now() - 8 * 86400000, expires: Date.now() - 86400000 };
    check('süresi dolmuş deneme artık premium değil', isPremium() === false);
    const ayarHtmlTrialEnded = pAyar();
    check('pAyar() deneme bitince nazik hatırlatma gösteriyor', ayarHtmlTrialEnded.includes('deneminiz sona erdi'));

    state = fresh();
  } catch (e) {
    check('E8.10 7 gün deneme hatasız çalıştı (hata: ' + e.message + ')', false);
  }

  // --- E7.3: KVKK/gizlilik "Yasal / Gizlilik" sekmesi ebeveyn panelinde ---
  try {
    parentTab('yasal');
    const pbody = document.getElementById('pbody').innerHTML;
    check('Yasal sekmesi KVKK aydınlatma metnini içeriyor', pbody.includes('KVKK aydınlatma'));
    check('Yasal sekmesi "veri toplamıyoruz" özetini içeriyor', pbody.includes('kişisel veri toplamıyoruz'));
    check('Yasal sekmesi "İlerlemeyi sıfırla" yönergesine değiniyor', pbody.includes('İlerlemeyi sıfırla'));
    check('Yasal sekmesi iletişim bilgisi içeriyor', pbody.includes('mailto:'));
  } catch (e) {
    check('E7.3 Yasal sekmesi hatasız render edildi (hata: ' + e.message + ')', false);
  }

  // --- E9.5: feedbackMailto() geçerli bir mailto: URL'i üretiyor ---
  try {
    const fb = feedbackMailto();
    check('feedbackMailto() mailto: ile başlıyor', fb.startsWith('mailto:destek@okumakasifi.app'));
    check('feedbackMailto() konu (subject) parametresi içeriyor', fb.includes('subject='));
    parentTab('ayar');
    const pbodyAyar = document.getElementById('pbody').innerHTML;
    check('Ayarlar sekmesi "Geri bildirim gönder" bağlantısını render ediyor', pbodyAyar.includes('Geri bildirim gönder') && pbodyAyar.includes('mailto:destek@okumakasifi.app'));
  } catch (e) {
    check('E9.5 feedbackMailto()/Ayarlar sekmesi hatasız çalıştı (hata: ' + e.message + ')', false);
  }

  // --- E9.6: hafif kullanım ölçümü — gizlilik-dostu, opsiyonel, varsayılan KAPALI ---
  try {
    state = fresh();
    check('settings.usageMetrics varsayılan olarak false', state.settings.usageMetrics === false);
    const ayarHtmlOff = pAyar();
    check('usageMetrics kapalıyken "özeti gönder" düğmesi gösterilmiyor', !ayarHtmlOff.includes('Kullanım özetini gönder'));

    state.settings.usageMetrics = true;
    state.correct = 8; state.wrong = 2; state.done = [1, 2]; state.badges = ['a', 'b']; state.childName = 'Ela';
    const summaryUrl = usageSummaryMailto();
    check('usageSummaryMailto() mailto: ile başlıyor', summaryUrl.startsWith('mailto:destek@okumakasifi.app'));
    check('usageSummaryMailto() body parametresi içeriyor (anonim özet)', summaryUrl.includes('body='));
    check('usageSummaryMailto() kisisel veri (childName) icermiyor', !decodeURIComponent(summaryUrl).includes('Ela'));
    const ayarHtmlOn = pAyar();
    check('usageMetrics açıkken "özeti gönder" düğmesi gösteriliyor', ayarHtmlOn.includes('Kullanım özetini gönder'));

    state = fresh();
  } catch (e) {
    check('E9.6 kullanım ölçümü hatasız çalıştı (hata: ' + e.message + ')', false);
  }

  // --- E8.6: Aile Planı — çoklu çocuk profili (yalnız yıllık plan) ---
  try {
    state = fresh();
    check('familyPlanEligible() ücretsizken false', familyPlanEligible() === false);
    const ayarHtmlFree = pAyar();
    check('pAyar() premium degilken Aile Plani teaser gosteriyor', ayarHtmlFree.includes('Aile Planı') && ayarHtmlFree.includes('Yıllık planı keşfet'));

    buy('yillik');
    confirmStubPurchase();
    check('yıllık satın alma sonrası familyPlanEligible() true', familyPlanEligible() === true);

    state.childName = 'Ela'; state.mode = 'kesif'; state.done = ['0'];
    ensureProfilesInit();
    check('ensureProfilesInit() mevcut ilerlemeyi 1. profil olarak kaydediyor', state.profiles.length === 1 && state.profiles[0].name === 'Ela' && state.activeProfileId === 'p1');
    check('ensureProfilesInit() kok alanlari profileData icine kopyaliyor', state.profileData['p1'].done.includes('0'));

    window.prompt = () => 'Kaan';
    addProfile();
    check('addProfile() yeni profil ekliyor (2/3)', state.profiles.length === 2 && state.profiles[1].name === 'Kaan');
    check('addProfile() otomatik yeni profile geçiyor (kök artık boş)', state.activeProfileId === state.profiles[1].id && state.mode === null && state.done.length === 0);

    const p1Id = state.profiles[0].id;
    switchProfile(p1Id);
    check('switchProfile() eski profilin ilerlemesini geri yüklüyor', state.mode === 'kesif' && state.done.includes('0') && state.childName === 'Ela');

    window.prompt = () => 'Elif';
    renameProfile(p1Id);
    check('renameProfile() aktif profilin adini ve state.childName degerini gunceller', state.profiles.find(p => p.id === p1Id).name === 'Elif' && state.childName === 'Elif');

    window.prompt = () => '';
    addProfile();
    check('addProfile() 3. profili boş isimle de "Çocuk N" adıyla ekliyor', state.profiles.length === 3);
    window.prompt = () => 'Fazla';
    addProfile();
    check('addProfile() 3 profil limitini aşmıyor', state.profiles.length === 3);

    const secondId = state.profiles[1].id;
    window.confirm = () => true;
    removeProfile(secondId);
    check('removeProfile() profili siliyor', state.profiles.length === 2 && !state.profiles.some(p => p.id === secondId));

    const familyHtml = familyBlock();
    check('familyBlock() premiumken profil satırlarını + "Yeni çocuk ekle" düğmesini gösteriyor', familyHtml.includes('Yeni çocuk ekle') && familyHtml.includes('Elif'));

    state = fresh();
  } catch (e) {
    check('E8.6 Aile Planı hatasız çalıştı (hata: ' + e.message + ')', false);
  }

  // --- E9.7: "Yenilikler" (sürüm notları) sekmesi ebeveyn panelinde ---
  try {
    check('RELEASE_NOTES dizisi tanımlı ve dolu', Array.isArray(RELEASE_NOTES) && RELEASE_NOTES.length >= 2);
    parentTab('surum');
    const pbodySurum = document.getElementById('pbody').innerHTML;
    check('Yenilikler sekmesi en yeni sürüm notunu render ediyor', pbodySurum.includes(RELEASE_NOTES[0].baslik));
    check('Yenilikler sekmesi çocuğa gösterilmediğini belirtiyor', pbodySurum.includes('çocuğunuza gösterilmez'));
  } catch (e) {
    check('E9.7 Yenilikler sekmesi hatasız render edildi (hata: ' + e.message + ')', false);
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

// --- E5.6: doğru/yanlış yalnız renkle değil ikon+konumla da belli olsun (renk körlüğü desteği). ---
function pushCheck(name, cond) { results.push({ name, pass: !!cond }); }
pushCheck('CSS: .choice.right icin koseye sabit konumlu ikon rozeti tanimli', /\.choice\.right::after\{[^}]*content:'✓'/.test(html));
pushCheck('CSS: .choice.wrong icin koseye sabit konumlu ikon rozeti tanimli', /\.choice\.wrong::after\{[^}]*content:'✕'/.test(html));
pushCheck('CSS: .choice ust eleman position:relative (ikon konumlandirmasi icin)', /\.choice\{position:relative;/.test(html));
// --- E4.7: Serbest oyun menüsünde "Sayılar" kartı mevcut ---
pushCheck('Serbest oyun menüsünde "Sayılar" kartı mevcut', html.includes("startFree('rakam')") && html.includes('>Sayılar<'));
// --- E4.6: Serbest oyun menüsünde "Büyük mü Küçük mü?" kartı mevcut ---
pushCheck('Serbest oyun menüsünde "Büyük mü Küçük mü?" kartı mevcut', html.includes("startFree('buyuk')") && html.includes('Büyük mü Küçük mü?'));
// --- E6.5: Serbest oyun menüsünde "Büyük Harf Çiz" kartı mevcut ---
pushCheck('Serbest oyun menüsünde "Büyük Harf Çiz" kartı mevcut', html.includes("startFree('cizBuyuk')") && html.includes('Büyük Harf Çiz'));
// --- E5.5: CSS'te disleksi-dostu sicak zemin (dusuk kontrastli beyaz yerine) tanimli ---
pushCheck('CSS: .dys sicak/kremsi zemin (bg/surface/ink) tanimliyor', /:root\.dys\{[^}]*--bg:#faf1de[^}]*--surface:#fffaf0/.test(html));
// --- E5.7: fbMsg elementi aria-live="polite" ile ekranda mevcut (sessiz modda yazili geri bildirim) ---
pushCheck('HTML: #fbMsg aria-live="polite" ile tanimli', /id="fbMsg" aria-live="polite"/.test(html));
// --- E7.4: hata sınırı ekranı ve "yeniden başlat" düğmesi HTML'de mevcut ---
pushCheck('HTML: #s-error ekranı "yeniden başlat" düğmesiyle tanımlı', /id="s-error"/.test(html) && /location\.reload\(\)/.test(html));
// --- E5.4: erişilebilirlik geçişi ---
pushCheck('CSS: genel :focus-visible odak halkası tanımlı', /(^|\s):focus-visible\{outline:3px/.test(html));
pushCheck('Tüm .age-card kartları tabindex+role="button" taşıyor (12 kart)', (html.match(/class="age-card" tabindex="0" role="button"/g) || []).length === 12);
pushCheck('Eski (klavyesiz) .age-card kalıbı kalmamış', !/class="age-card" onclick=/.test(html) && !/class="age-card" id="/.test(html));
pushCheck('Harf Çiz canvas\'ı role="img" + aria-label taşıyor', /id="traceCanvas" role="img" aria-label="/.test(html));
pushCheck('Global keydown dinleyicisi role="button" öğeleri için Enter/Boşluk\'u işliyor', /role'\)==='button'/.test(html));
// --- E7.7: sw.js install sırasında otomatik skipWaiting() ÇAĞIRMIYOR (güncelleme kullanıcı onayına bağlı) ---
pushCheck('sw.js: install olayı skipWaiting() cagirmiyor (guncelleme onaya bagli)', !/addAll\(ASSETS\)\)\.then\(\(\) => self\.skipWaiting\(\)\)/.test(swJs));
pushCheck('sw.js: SKIP_WAITING mesajinda skipWaiting() cagriliyor', /addEventListener\('message'/.test(swJs) && /SKIP_WAITING.*self\.skipWaiting\(\)/.test(swJs));
pushCheck('HTML: #updateBar guncelleme cubugu tanimli', /id="updateBar"/.test(html) && /applyUpdate\(\)/.test(html));

// --- E7.1: gerçek PWA ikonları (icon-192.png / icon-512.png) + manifest.json + sw.js önbelleği ---
function pngDims(path) {
  const buf = readFileSync(path);
  if (buf.length < 24 || buf.readUInt32BE(0) !== 0x89504e47) throw new Error('gecerli PNG degil');
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}
pushCheck('icon-192.png dosyası gerçek 192x192 PNG', (() => {
  try { const d = pngDims(join(__dirname, '..', 'icon-192.png')); return d.width === 192 && d.height === 192; }
  catch { return false; }
})());
pushCheck('icon-512.png dosyası gerçek 512x512 PNG', (() => {
  try { const d = pngDims(join(__dirname, '..', 'icon-512.png')); return d.width === 512 && d.height === 512; }
  catch { return false; }
})());
pushCheck('manifest.json: icon-192/512 hem "any" hem "maskable" purpose ile tanımlı', (() => {
  try {
    const m = JSON.parse(manifestJson);
    const has = (size, purpose) => m.icons.some(i => i.sizes === `${size}x${size}` && i.purpose === purpose);
    return has(192, 'any') && has(192, 'maskable') && has(512, 'any') && has(512, 'maskable');
  } catch { return false; }
})());
pushCheck('HTML: apple-touch-icon ve favicon linkleri tanımlı', /rel="apple-touch-icon" href="icon-192.png"/.test(html) && /rel="icon" href="icon-192.png"/.test(html));
pushCheck('sw.js: CACHE surumu ikon eklenmesiyle guncellendi (en az v2)', /const CACHE = 'okuma-kasifi-v(2|3)'/.test(swJs));
pushCheck('sw.js: ASSETS onbellek listesi ikon dosyalarini iceriyor', /icon-192\.png/.test(swJs) && /icon-512\.png/.test(swJs));
pushCheck('HTML: #a2hsBar "ana ekrana ekle" ipucu cubugu tanımlı', /id="a2hsBar" class="a2hs-bar" hidden/.test(html) && /id="a2hsInstallBtn"/.test(html));
pushCheck('JS: showA2HSBar/dismissA2HS/promptA2HS fonksiyonları tanımlı', /function showA2HSBar\(\)/.test(html) && /function dismissA2HS\(\)/.test(html) && /function promptA2HS\(\)/.test(html));
pushCheck('JS: beforeinstallprompt dinleyicisi kayıtlı (Android/Chrome kurulum istemi)', /addEventListener\('beforeinstallprompt'/.test(html));
pushCheck('settings.a2hsDismissed varsayılan false ile şemada tanımlı', /a2hsDismissed:false/.test(html));

// --- E7.6: çevrimdışı sağlamlık — install sırasında tek bir asset başarısız olsa bile hepsi denenir ---
pushCheck('sw.js: install her asset icin ayrı deneniyor (c.addAll yerine, tek hata hepsini iptal etmesin)', !/c\.addAll\(ASSETS\)/.test(swJs) && /\.map\(a => c\.add\(a\)\.catch\(/.test(swJs));
pushCheck('sw.js: Google Fonts CSS de best-effort onbelleklemeye deneniyor', /FONT_CSS/.test(swJs) && /fonts\.googleapis\.com\/css2/.test(swJs));
pushCheck('sw.js: CACHE surumu v3 (onbellekleme mantigi degistiginden)', /const CACHE = 'okuma-kasifi-v3'/.test(swJs));
pushCheck('HTML: "çevrimdışısın" gibi engelleyici bir gösterge YOK (sessizce calisir)', !/çevrimdışısın/i.test(html) && !/offline-indicator/i.test(html));

// --- Hata düzeltmesi: `hidden` özniteliği taşıyan öğeler `display:flex` gibi bir sınıf kuralı
// yüzünden görünür kalabiliyordu (author CSS her zaman UA varsayılanını geçersiz kılar) — gerçek
// tarayıcıda çekilen ekran görüntüsüyle keşfedildi (#updateBar/#trialBox/#a2hsBar hep görünüyordu).
pushCheck('CSS: global [hidden] kuralı display:none!important ile korunuyor (hidden ATTR override edilemiyor)', /\[hidden\]\{display:none!important\}/.test(html));

// --- E9.1: landing / tanıtım sayfası (site/index.html, ayrı tek dosya) ---
pushCheck('site/index.html: "Ücretsiz Başla" CTA uygulamaya (../index.html) bağlanıyor', /href="\.\.\/index\.html"/.test(siteHtml) && /Ücretsiz Başla/.test(siteHtml));
pushCheck('site/index.html: 3 ekran görüntüsü referanslanıyor', (siteHtml.match(/screenshots\/[\w-]+\.png/g) || []).length >= 3);
pushCheck('site/index.html: referans verilen 3 ekran görüntüsü dosyası gerçekten var', ['karsilama', 'kesif-haritasi', 'harf-ciz'].every(n => {
  try { pngDims(join(__dirname, '..', 'site', 'screenshots', n + '.png')); return true; } catch { return false; }
}));
pushCheck('site/index.html: fiyatlandırma özeti PLANS ile aynı (179/1199/349 TL)', /179 TL/.test(siteHtml) && /1199 TL/.test(siteHtml) && /349 TL/.test(siteHtml));
pushCheck('site/index.html: SSS bölümü var', /Sıkça sorulanlar|sıkça sorulanlar/.test(siteHtml) && /<details>/.test(siteHtml));
pushCheck('site/index.html: KVKK/gizlilik bilgisine değiniyor', /KVKK/.test(siteHtml));
pushCheck('site/index.html: çocuk güvenliği mesajı var (reklam yok, sohbet robotu değil)', /[Rr]eklam/.test(siteHtml) && /sohbet robotuyla konuşmaz/.test(siteHtml));
pushCheck('site/index.html: harici <script> yok, tek istisna Google Fonts (mimari kuralı)', !/<script/.test(siteHtml) && (siteHtml.match(/(?:href|src)="(https?:\/\/[^"]+)"/g) || []).every(m => /fonts\.(googleapis|gstatic)\.com/.test(m)));
pushCheck('site/index.html: aynı marka renk token\'larını kullanıyor (--primary:#f2795b)', /--primary:#f2795b/.test(siteHtml));
pushCheck('site/index.html: koyu tema desteği var (prefers-color-scheme:dark)', /prefers-color-scheme:dark/.test(siteHtml));

// --- E9.5: beta geri bildirim kanalı — ebeveyn Ayarlar sekmesinde mailto: düğmesi (dış servis yok) ---
pushCheck('JS: feedbackMailto() dış servis olmadan mailto: linki üretiyor', /function feedbackMailto\(\)\{/.test(html) && /return `mailto:/.test(html));
pushCheck('HTML: Ayarlar sekmesinde "Geri bildirim gönder" düğmesi feedbackMailto()\'ya bağlı', /href="\$\{feedbackMailto\(\)\}"/.test(html) && /Geri bildirim gönder/.test(html));

// --- E9.7: sürüm notları ekranı — ebeveyn panelinde "Yenilikler" sekmesi ---
pushCheck('HTML: "Yenilikler" ptab düğmesi tanımlı', /data-tab="surum" onclick="parentTab\('surum'\)">Yenilikler</.test(html));

// --- E9.2: fiyat sayfası (site/fiyatlar.html) ---
pushCheck('site/fiyatlar.html: harici <script> yok, tek istisna Google Fonts (mimari kuralı)', !/<script/.test(pricesHtml) && (pricesHtml.match(/(?:href|src)="(https?:\/\/[^"]+)"/g) || []).every(m => /fonts\.(googleapis|gstatic)\.com/.test(m)));
pushCheck('site/fiyatlar.html: 3 plan kartı PLANS ile aynı fiyatları içeriyor (179/1199/349 TL)', /179 TL/.test(pricesHtml) && /1199 TL/.test(pricesHtml) && /349 TL/.test(pricesHtml));
pushCheck('site/fiyatlar.html: ücretsiz/premium karşılaştırma tablosu var', /<table class="cmp">/.test(pricesHtml) && (pricesHtml.match(/<tr>/g) || []).length >= 8);
pushCheck('site/fiyatlar.html: okul/kurum için iletişim bölümü var', /okul[- ]kurum|Kurum lisansı/i.test(pricesHtml) && /mailto:destek@okumakasifi\.app/.test(pricesHtml));
pushCheck('site/fiyatlar.html: KVKK/gizlilik bilgisine değiniyor', /KVKK/.test(pricesHtml));
pushCheck('site/fiyatlar.html: aynı marka renk token\'larını kullanıyor (--primary:#f2795b)', /--primary:#f2795b/.test(pricesHtml));
pushCheck('site/fiyatlar.html: koyu tema desteği var (prefers-color-scheme:dark)', /prefers-color-scheme:dark/.test(pricesHtml));
pushCheck('site/index.html: "Fiyatları gör" artık ayrıntılı fiyat sayfasına bağlanıyor', /href="fiyatlar\.html"/.test(siteHtml));

// --- E7.2: ilk açılış hızı — Google Fonts CSS'i ilk boyayı bloklamasın diye preload+swap ile yükleniyor ---
pushCheck('index.html: Google Fonts CSS render-blocking değil (preload+onload swap deseni)', /<link rel="preload" as="style" href="https:\/\/fonts\.googleapis\.com\/css2\?[^"]+" onload="this\.onload=null;this\.rel='stylesheet'">/.test(html) && /<noscript><link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com\/css2\?/.test(html));
pushCheck('site/index.html: Google Fonts CSS render-blocking değil (preload+onload swap deseni)', /<link rel="preload" as="style" href="https:\/\/fonts\.googleapis\.com\/css2\?[^"]+" onload="this\.onload=null;this\.rel='stylesheet'">/.test(siteHtml) && /<noscript><link rel="stylesheet"/.test(siteHtml));
pushCheck('site/fiyatlar.html: Google Fonts CSS render-blocking değil (preload+onload swap deseni)', /<link rel="preload" as="style" href="https:\/\/fonts\.googleapis\.com\/css2\?[^"]+" onload="this\.onload=null;this\.rel='stylesheet'">/.test(pricesHtml) && /<noscript><link rel="stylesheet"/.test(pricesHtml));

let failed = 0;
for (const { name, pass } of results) {
  console.log(`  ${pass ? '✓' : '✗'} ${name}`);
  if (!pass) failed++;
}

console.log(`\n${failed === 0 ? 'TÜM TESTLER GEÇTİ' : failed + ' TEST BAŞARISIZ'} (${results.length} test)`);
process.exit(failed === 0 ? 0 : 1);
