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
    check('TEXTS en az 2 metin içeriyor', TEXTS.length >= 2);
    const lettersOf = s => Array.from(new Set(s.toLowerCase().replace(/[^a-zçğıöşü]/g, '').split('')));
    const allValid = TEXTS.every(t => lettersOf(t.metin).every(c => t.gerekli.includes(c)));
    check('Her metin yalnız kendi gerekli seslerinden kurulu', allValid);
    check('pickText() dar pool için en basit metni seçiyor',
      pickText(['a', 'n', 'e', 't', 'i', 'l']).id === TEXTS[0].id);
    check('pickText() geniş pool için en ileri uygun metni seçiyor',
      pickText(['a', 'e', 'l', 'm', 'r', 'k', 't', 'n', 'u', 'o', 'ı', 'i']).id === TEXTS[TEXTS.length - 1].id);

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
