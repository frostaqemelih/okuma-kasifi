# Okuma Kâşifi — Sürekli Geliştirme Planı

> Bu belge, projeyi otonom olarak geliştiren ajanın **tek kaynak talimatıdır**.
> Her çalışmada: en üstteki `[ ]` işaretli maddeyi al → uygula → test et → commit et → `[x]` yap → bu belgeyi güncelle.
>
> **HEDEF: ~1 ay içinde halka sunulabilir bir sürüm** (önce PWA/web, sonra Capacitor ile mağaza).
> Ücretsiz çekirdek + premium (ücretli) katman olacak. Yol haritası: § 1.5.
> Rutin sık çalışır (birkaç saatte bir) — her çalışma görünür + test edilmiş bir ilerleme.

---

## 0. Ajan çalışma yönergesi (HER ÇALIŞMADA OKU)

**Rol:** Sen bu projenin baş geliştiricisisin. Aşağıdaki backlog'u sırayla işliyorsun.

**Bir çalışmanın adımları:**
1. `git pull` (varsa). Bu belgeyi ve `README.md`'yi oku.
2. **Backlog'dan sıradaki `[ ]` maddeyi seç.** Öncelik: (a) `acil` etiketli her şey, (b) o haftanın § 1.5 kilometre taşına ait maddeler, (c) epik sırası E1→E2→…→E9 içinde yukarıdan aşağıya. Bir epik bitince sıradakine geç; hepsi biterse E2/E3/E4'e yeni varyant/içerik ekle.
3. Gerekiyorsa ilgili uzman bakış açısını benimse (madde `→ uzman:` ile işaretli). Karmaşık maddelerde önce `arastirma/` klasöründeki ilgili raporu oku.
4. Değişikliği **yalnızca `index.html`** (ve gerekiyorsa `data/`, yeni asset) üzerinde yap. Tek dosya mimarisi korunur.
5. **Test — ZORUNLU, geçmeden commit yok:**
   - `test/` + `package.json` yoksa ilk çalışmada kur: `npm init -y`, `npm i -D jsdom`, `test/smoke.mjs`
     (index.html'i jsdom'a yükler; tüm `.screen` ekranları DOM'da mı, global veri yapıları — `LESSONS`,
     `WORDS`, `STROKES`, `SENTENCES` — tutarlı mı, `startGame`/`openLesson` hata veriyor mu, bir turda
     doğru cevapla `award()`'a ulaşılıyor mu). `npm test` bunu çalıştırsın.
   - Her çalışmada: `<script>` bloğunu geçici `.mjs`'e çıkar → `node --check` (sözdizimi) + `npm test`.
   - İkisi de yeşil değilse commit ETME, değişikliği geri al.
   - Commit gövdesine `TEST:` satırıyla ne doğrulandığını yaz.
6. **Commit:** açıklayıcı Türkçe mesaj + `Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>`. `git push`.
7. Bu belgede maddeyi `[x]` yap, altına 1 satır "ne yapıldı" notu ekle. `## Değişiklik günlüğü`'ne tarihli satır ekle.
8. Bir çalışmada **1–3 madde** bitir. Büyük maddeyi alt maddelere böl, hepsini birden yapma.

**Mimari kuralları (bozma):**
- Tek dosya: `index.html` (HTML+CSS+JS gömülü). Harici script yok. Google Fonts (Baloo 2 + Nunito) tek istisna.
- Çocuk-güvenli: LLM çocukla konuşmaz, serbest metin girişi yok, reklam/izleyici yok.
- Veri cihazda: `localStorage` anahtarı `okuma-kasifi-v2` (şema değişince `v3` yap + göç yaz).
- Açık/koyu tema token'larla; `prefers-reduced-motion`'a saygı.
- Türkçe içerik; MEB 2024 TYMM ses sırası (`data/mufredat.json` → `sesGruplari.tymm`).
- Erişim: büyük dokunma hedefleri (≥56px), görünür odak, ARIA.
- Artifact senkronu: `index.html`'den `<link rel="preconnect"` … `</body>` arası alınıp
  `scratchpad/okuma-kasifi-demo.html`'e yazılır (bu dosya .gitignore'da; sadece manuel republish için).

**Çıktı:** Her çalışma sonunda commit + bu belgede güncel durum. PR açma, doğrudan `main`'e push.

---

## 1. Ürün özeti (bağlam)

4–7 yaş Türk çocuklara okuma-yazmanın temellerini, yapay zekâ destekli "Kâşif" rehberi eşliğinde,
oyunlaştırılmış ve sese dayalı öğreten uygulama. Ayrıntı: `TASLAK.md`, `arastirma/`.

**Şu anki durum (v0):** onboarding + yaş modu (Keşif 4–5 / Çözümleme 6–7) · 25 derslik keşif
haritası (4 ses grubu, kilit + rozet) · 6 mini oyun (Harfi Bul, Sesi Eşleştir, Hece Kur, Kelime Kur,
Cümle Bahçesi, Harf Çiz) her biri 2–3 varyantlı · Ses Karnesi (per-ses tanısal rapor) + zayıf seslere
otomatik tekrar turu · aralıklı tekrar (Leitner) · Okuma Kulübü + metin bankası · serbest oyun ·
ebeveyn izleme sayfası (5 sekme) + yazdır/PDF rapor · tarayıcı TTS · yerel ilerleme ·
**freemium/premium katmanı** (entitlement + `v3` şema, paywall, stub satın alma, geri yükleme,
tanıtım kodu, nazik premium teşviki — 1. grup ücretsiz, 2.–5. grup premium).

---

## 1.5 — 1 Aylık Yol Haritası (halka sunum hedefi)

Haftalar yaklaşıktır; rutin her hafta o haftanın kilometre taşına ağırlık verir.

| Hafta | Kilometre taşı | Kapsam |
|---|---|---|
| **1** | **Öğrenme çekirdeği sağlam** | E2 (hata kurtarma + çeşitlilik + aralıklı tekrar), E3.1–E3.4 (değerlendirme, Okuma Kulübü), E6.1–E6.2 (Harf Çiz kılavuz + kademeler) |
| **2** | **İçerik derinliği** | E4.1–E4.3 (2.–4. ses grupları oynanır), E3.5 (metin bankası), E4.5 (40+ kelime), E5.1 (ses klip altyapısı) |
| **3** | **Premium & para kazanma** | E8 tamamı: ücretsiz/premium ayrımı, paywall ekranı, entitlement/lisans katmanı (stub ödeme), "premium'u aç" akışı, geri yükleme, aile planı, tanıtım kodu |
| **4** | **Yayın cilası + SES** | E5.4 (erişilebilirlik geçişi), **E5.2/E5.8 (yapay zekâ sesini değiştir — çocuk-dostu Türkçe ses, EN SON iş)**, E7 (PWA ikonları, hata sınırları, KVKK metinleri), E9 (landing sayfası, mağaza görselleri, Capacitor iskeleti, fiyat sayfası, beta) |

**"Halka sunulabilir" tanımı:** PWA olarak kurulabilir; ilk 3 ders grubu oynanır (ücretsiz 1. grup + premium
2.–3.); ebeveyn izleme + Ses Karnesi çalışır; paywall + entitlement katmanı hazır (gerçek ödeme sağlayıcı
anahtarları kullanıcıdan gelecek); erişilebilirlik temel seviye; KVKK/gizlilik metinleri var; landing sayfası var.

---

## 2. Backlog

### E1 — Ebeveyn İzleme Sayfası  → uzman: UX Researcher + Analytics Reporter

- [x] **E1.1** Ayrı "Ebeveyn" ekranı (`s-parent`), 5 sekme (Genel/Dersler/Ses Karnesi/Öneriler/Ayarlar). — 2026-09-03
- [x] **E1.2** "Genel": streak, bu hafta dk, tamamlanan ders, rozet, başarı oranı, dk/oturum kartları. — 2026-09-03
- [x] **E1.3** 14 günlük çalışma sütun grafiği (saf SVG) + `state.daily` yapısı. — 2026-09-03
- [x] **E1.4** "Dersler": 12 ders + durum + denenme + süre (`state.lessonLog`). — 2026-09-03
- [x] **E1.5** "Öneriler": zayıf seslere "Evde ne yapabilirsiniz" kartları. — 2026-09-03
- [x] **E1.6** "Bu hafta" özet paragrafı (şablon + slot). — 2026-09-03
- [x] **E1.7** Ayarlar: yaş modu, günlük hedef, disleksi-dostu, sessiz mod. — 2026-09-03
- [x] **E1.8** İlerleme JSON dışa/içe aktarma. — 2026-09-03
- [x] **E1.9** İYİLEŞTİRME: grafik hedef çizgisi max'tan büyükse görünmüyor — ölçeklemeyi düzelt; grafiğe gün etiketleri/hover. — 2026-09-03
- [x] **E1.10** İYİLEŞTİRME: `.ptabs` dar ekranda taşıyor — yatay kaydırılır şerit yap. — 2026-09-03
- [x] **E1.11** Çocuğun adını onboarding'de sor (opsiyonel, cihazda), ebeveyn özetinde "Kâşif" yerine kullan. — 2026-09-04
- [x] **E1.12** Ebeveyne "yazdır / PDF" (tarayıcı print CSS) haftalık rapor. — 2026-09-04

### E2 — Hata Kurtarma & Çeşitlilik  → uzman: pedagoji raporu (§ Hata protokolü, § Oyunlaştırma)

- [x] **E2.1** Kademeli hata protokolü: 1. yanlış → nötr "tekrar dinle"; 2. yanlış → **hedefli ipucu** (yanlış şık soluklaşır+kilitlenir, doğru şıkka `.hint` nabız vurgusu); 3. yanlış → **modelle + birlikte** (doğru gösterilir, "birlikte söyleyelim" + tur doğruyla biter), hedef ses `state.reviewQueue`'ya eklenir (E2.2 bunu tüketecek). Şimdilik Harfi Bul/Sesi Eşleştir/Hece Kur (`choose()`) kapsıyor; Kelime Kur/Cümle Bahçesi (`checkWord()`) ayrı madde olarak bırakıldı. — 2026-09-03
- [x] **E2.2** "Tekrar kuyruğu": `reviewSteps()` ders başında `state.reviewQueue`'daki en fazla 3 sesi kısa "ses" turu olarak normal adımların önüne ekler (`review:true`). İlk denemede yardımsız doğru cevaplanırsa `consumeReview()` ile kuyruktan çıkar; 3 yanlıştan sonra modellenen turlar (choose() "right" dalından geçmez) kuyrukta kalır. — 2026-09-03
- [x] **E2.3** Aralıklı tekrar (spaced repetition): `creditSounds()` artık her sesin `strength` (0–5, doğru +1/yanlış −1) ve `lastSeen` (gün) alanlarını güncelliyor. `warmupSounds()` öğrenilmiş sesler arasından `strength≤2` veya `lastSeen` ≥2 gün eskiyse en fazla 2 tanesini seçer; `warmupSteps()` bunları `openLesson()`'da ders adımlarının en başına (reviewSteps'ten de önce) kısa "ses" turu olarak ekler. Basit Leitner mantığı. — 2026-09-03
- [x] **E2.4** Aynı hedef için çeşitli alıştırma tipleri — her mini oyunda en az 2 varyant: — 2026-09-03
  - [x] Harfi Bul: (a) resim→harf, (b) ses duy→harf — `roundBul()` ikisi arasında rastgele seçiyor. — 2026-09-03
  - [x] Harfi Bul: (c) büyük/küçük eşle — `UPPER_MAP` + `roundBul()` 3 varyant arasında (1/3 olasılıkla) seçiyor. — 2026-09-03
  - [x] Sesi Eşleştir: (a) ses→resim, (b) "hangisi farklı sesle başlıyor", (c) son ses — `roundSes()` 3 varyant arasında rastgele seçiyor. — 2026-09-03
  - [x] Hece Kur: (a) hece tanı, (b) hece→resim (heceyle başlayan), (c) eksik harfi bul — `roundHece()` 3 varyant arasında rastgele seçiyor. **E2.4 tamamlandı.** — 2026-09-03
- [x] **E2.5** Zorluk uyarlaması: `recentRounds` (son 5 tur, ilk denemede doğru mu) + `difficultyLevel()` (`kolay`/`normal`/`zor`, eşik <%50 / >%85). `roundBul()`/`roundSes()`/`roundHece()` seçenek sayısını buna göre ayarlıyor (Harfi Bul 3/4/5, Sesi Eşleştir/Hece Kur 2/3/4). `choose()` her tur sonunda `recordRoundResult()` çağırıyor. "İpucu süresini uzat" kısmı uygulanmadı — mevcut tasarımda ipucu (2. yanlıştan sonraki `.hint` vurgusu) zaten süreli değil, çocuk hazır olana kadar ekranda kalıyor. — 2026-09-03
- [x] **E2.6** Oturum ritmi: `sessionMinutes` oturum boyunca birikir (`trackTime()`), yaş moduna göre eşik (Keşif 8 dk, Çözümleme 15 dk — aralığın orta noktası) aşılınca ders bitişinde (`finishLesson()`) nazik "mola ver" mesajı + düğmesi (`doneBreakMsg`/`doneBreakBtn`) bir kez gösterilir; `acceptBreak()` başlangıç ekranına döner ve sayacı sıfırlar. — 2026-09-03
- [x] **E2.7** Kâşif'in tepki çeşitliliği: merkezi `PRAISE` (15), `RETRY_MSGS` (6), `HINT_MSGS` (5) dizileri — `choose()`, `checkWord()`, `checkTrace()`, `award()` ödül ekranı artık bunlardan rastgele seçiyor; çabayı öven cümleler eklendi ("Çok iyi denedin!", "Emeğinin karşılığını aldın!"). — 2026-09-03

### E3 — Pratik & Değerlendirme  → uzman: pedagoji raporu (§ Başarı ölçütü, § 12 ders)

- [x] **E3.1** Ders sonu mini-değerlendirme: `buildSteps()` her dersin sonuna `assessSteps()` ile 3 hızlı soru ekler (Sesi Eşleştir/Harfi Bul dönüşümlü, dersin yeni ses(ler)i hedefli). `finishLesson()` 2/3+ doğruysa geçti sayar; değilse ders yine "tamam" olur ama `state.lessonLog[id].needsReview=true` ile haritada düğüme `🔁` işareti (`node.flag`) eklenir; sorular normal round mekanizmasını kullandığından Ses Karnesi zaten otomatik güncellenir. — 2026-09-03
- [x] **E3.2** Grup sonu "Kâşif Gösterisi" (ders 12, `tip:'gosteri'`): artık **puansız** — `buildSteps()` değerlendirme sorusu eklemiyor; bitişte özel kutlama ekranı ("Kâşif Gösterisi tamamlandı!" + 🏆) gösteriliyor, `needsReview` işareti hiç konmuyor. `openLesson()` artık her derste `assessResults`'ı sıfırlıyor (önceki dersten sızmasın diye — E3.1 kenar durumu düzeltmesi). Ders 6 ("Ses l") ayrı bir yeni-ses dersi olduğundan `gosteri` tipine çevrilmedi; grup1 kutlaması zaten mevcut rozet-bitiş ekranıyla (🏆 "Rozet kazandın!") karşılanıyor. — 2026-09-03
- [x] **E3.3** "Zayıf seslere otomatik dönüş": `soundBuckets().review` (<%50 doğruluk, n≥3) doluysa harita üstünde `#reviewBtn` ("🔁 Tekrar turu: ...") belirir; `startReviewRound()` o seslerle 4–5 turluk (`reviewRoundSteps()`, Harfi Bul/Sesi Eşleştir dönüşümlü) hedefli oturum başlatır; bitişte `finishReviewRound()` özel "Tekrar turu tamam!" ekranı gösterir, `state.done`/rozetlere dokunmaz. — 2026-09-03
- [x] **E3.4** Okuma Kulübü oyunu (`roundOkuma`): `data/mufredat.json` ders 12'deki `metin` + `anlamaSorulari` (`READING` sabiti). Kâşif metni sesli okur → çocuk metni görür → "sorulara geç" → 2 anlama sorusu (metin şıklı, Çözümleme modunda okur-yazar çocuk hedeflendiği için resim şart görülmedi). Serbest Oyun menüsüne "📖 Okuma Kulübü" kartı eklendi (`freeOkuma`, yalnız Çözümleme modunda görünür, Keşif'te gizli — mevcut `freeHece`/`freeKelime`/`freeCumle` desenine uygun). Not: mufredat.json'daki metin henüz öğretilmeyen 'd' sesini içeriyor; WORDS/WORDBANK'teki etiket kelimelerinde de zaten benzer örnekler var (top, ev, kedi vb.) — Kâşif TTS ile okuduğu için çocuğun sesi tek başına çözmesi gerekmiyor. — 2026-09-03
- [x] **E3.5** Kısa metin bankası genişlet: her ses grubu tamamlanınca 2–3 cümlelik, sadece bilinen seslerden kurulu resimli mini metin. `data/metinler.json` oluştur. — 2026-09-03
- [x] **E3.6** "İlerleme rozeti" sistemi: ses ustalığı, gün serisi (streak), ilk kelime, ilk cümle, ilk metin — koleksiyon ekranı. — 2026-09-04

### E4 — İçerik Genişletme  → uzman: pedagoji + `data/mufredat.json`

- [x] **E4.1** 2. ses grubu tam oyunlaştırma: `o,k,u,r,ı,m` için `WORDS` + `STROKES` + `WORDBANK` + `SENTENCES` zaten kısmen var — eksikleri tamamla, ders 7–11 içeriğini `mufredat.json` ile hizala. — 2026-09-03
- [x] **E4.2** 3. grup `ü,s,ö,y,d,z`: `WORDS` (ör. ü→üzüm, s→su, ö→ördek, y→yıldız, d→davul, z→zil), `STROKES` yaz, ders 13–19 ekle. **Tamamlandı.** — 2026-09-03
  - [x] (a) **ü** tam donanımlı eklendi: `mufredat.json` sesler+ders13, `WORDS.ü`, `STROKES.ü` (4 vuruş: nokta+nokta+gövde+kuyruk), `LESSONS` id13, `WORDBANK`'a kül/üzüm/üç (pool'a göre kademeli açılır). — 2026-09-03
  - [x] (b) **s** tam donanımlı eklendi: `mufredat.json` sesler.s+ders14, `WORDS.s` (su), `STROKES.s` (tek vuruşlu S eğrisi), `LESSONS` id14, `WORDBANK`'a su/kes. — 2026-09-03
  - [x] (c) **ö** tam donanımlı eklendi: `mufredat.json` sesler.ö+ders15, `WORDS.ö` (ördek), `STROKES.ö` (nokta+nokta+o gövdesi), `LESSONS` id15, `WORDBANK`'a körük. — 2026-09-03
  - [x] (d) **y** tam donanımlı eklendi: `mufredat.json` sesler.y+ders16, `WORDS.y` (yol), `STROKES.y` (iki eğik vuruş+kuyruk), `LESSONS` id16, `WORDBANK`'a yol/yumurta. — 2026-09-03
  - [x] (e) **d** tam donanımlı eklendi: `mufredat.json` sesler.d+ders17, `WORDS.d` (davul), `STROKES.d` (gövde+dik vuruş), `LESSONS` id17, `WORDBANK`'a domates/duman. — 2026-09-03
  - [x] (f) **z** tam donanımlı eklendi + 3. grup rozeti: `mufredat.json` sesler.z+ders18+ders19, `WORDS.z` (zil), `STROKES.z` (tek zikzak vuruş), `LESSONS` id18 ("Ses z") + id19 ("Kâşif Gösterisi 2", `tip:'gosteri'`, rozet "3. Grup Kâşifi 🏆"), `WORDBANK`'a zil/kazan (ve daha önce gated olan "üzüm" artık erişilebilir). **E4.2 tamamlandı.** — 2026-09-03
- [x] **E4.3** 4. grup `ç,b,g,c,ş`: tamamlandı. **E4.3 tamamlandı.** — 2026-09-04
  - [x] (a) **ç** tam donanımlı eklendi: `mufredat.json` sesler.ç+ders20, `WORDS.ç` (çay☕), `STROKES.ç` (2 vuruş: açık c-eğrisi gövde+kedilya çengeli), `LESSONS` id20, `WORDBANK`'a çay☕. — 2026-09-04
  - [x] (b) **b** tam donanımlı eklendi: `mufredat.json` sesler.b+ders21, `WORDS.b` (balon🎈), `STROKES.b` (2 vuruş: dik gövde+kabarcık ilmek), `LESSONS` id21, `WORDBANK`'a balon🎈/boya🎨. — 2026-09-04
  - [x] (c) **g** tam donanımlı eklendi: `mufredat.json` sesler.g+ders22, `WORDS.g` (gemi🚢), `STROKES.g` (2 vuruş: o gövdesi+alt kuyruk), `LESSONS` id22, `WORDBANK`'a gemi🚢/gül🌹. — 2026-09-04
  - [x] (d) **c** tam donanımlı eklendi: `mufredat.json` sesler.c+ders23, `WORDS.c` (ceket🧥), `STROKES.c` (1 vuruş: açık eğri, ç'nin çengelsiz hâli), `LESSONS` id23, `WORDBANK`'a ceket🧥/cam🪟. — 2026-09-04
  - [x] (e) **ş** tam donanımlı eklendi + 4. grup rozeti: `mufredat.json` sesler.ş+ders24+ders25, `WORDS.ş` (şeker🍬), `STROKES.ş` (2 vuruş: s eğrisi+çengel), `LESSONS` id24 + id25 ("Kâşif Gösterisi 3", `tip:'gosteri'`, rozet "4. Grup Kâşifi 🏆"), `WORDBANK`'a şeker🍬/şal🧣. **E4.3 tamamlandı.** — 2026-09-04
- [x] **E4.4** 5. grup `p,h,v,ğ,f,j`: tamamlandı — Türk alfabesinin tüm 29 sesi/harfi artık oynanabilir. — 2026-09-04
  - [x] (a)-(c) **p, h, v** tam donanımlı eklendi: `mufredat.json` sesler.p/h/v + ders26/27/28, `index.html`'e `WORDS.p` (para💵), `WORDS.h` (horoz🐓 — "hava" değil, çünkü henüz öğrenilmemiş 'v' sesini içeriyordu), `WORDS.v` (vazo🏺), `STROKES.p` (2 vuruş: dik gövde+üst ilmek), `STROKES.h` (2 vuruş: uzun gövde+kemer, n'nin deseniyle aynı), `STROKES.v` (1 vuruş: V şekli), `LESSONS` id26-28, `ALL_LETTERS`/`UPPER_MAP`'e h/v eklendi, `WORDBANK`'a para💵/horoz🐓/vazo🏺. — 2026-09-04
  - [x] (d) **ğ** (yumuşak g) özel kuralla eklendi: `mufredat.json` sesler.ğ + ders29 (`kural` alanı: "asla kelime başında olmaz"), `index.html`'e `WORDS.ğ` (dağ⛰️ — kasıtlı olarak ğ ile BAŞLAMIYOR), `STROKES.ğ` (3 vuruş: şapka/kemer + g'nin gövdesi+kuyruğu), `LESSONS` id29, `WORDBANK`'a dağ⛰️. Mühendislik düzeltmeleri: `syllablesFor()` artık ğ için yalnız ünlü+ğ (ağ, öğ) üretiyor, ğ+ünlü (ğa) ÜRETMİYOR; `roundBul()` hedef ğ olduğunda "hangi harfle başlar?" varyantını atlayıp (b)/(c)'ye yönlendiriyor; `roundSes()` "başlıyor" tabanlı Start/Odd varyantlarına ğ'siz bir havuz veriyor (Son-ses/End varyantı ğ ile sorunsuz çalışıyor, örn. "dağ"). — 2026-09-04
  - [x] (e)-(f) **f, j** tam donanımlı eklendi + 5. grup rozeti: `mufredat.json` sesler.f/j + ders30/31/32, `index.html`'e `WORDS.f` (fil🐘), `WORDS.j` (jeton🪙), `STROKES.f` (2 vuruş: kancalı gövde+çizgi), `STROKES.j` (2 vuruş: nokta+kancalı kuyruk), `LESSONS` id30-32 (id32 "Kâşif Gösterisi 4", `tip:'gosteri'`, rozet "5. Grup Kâşifi 🏆"), `ALL_LETTERS`/`UPPER_MAP`'e f/j eklendi, `WORDBANK`'a fil🐘/jeton🪙. **E4.4 tamamlandı — MEB 2024 TYMM'in tüm 29 sesi/harfi (5 grup, ders 0-32) artık oynanabilir.** — 2026-09-04
- [x] **E4.5** WORDBANK'i 12→40+ kelimeye çıkar (grup ilerledikçe açılan). Her kelimeye net emoji/görsel. — 2026-09-03
- [x] **E4.6** Büyük harf / küçük harf farkındalığı modülü (cümle başı, özel ad). — 2026-09-04
- [x] **E4.7** Rakam ve sayı sesleri mini-modülü (1–10) — okuma-yazmaya bitişik. — 2026-09-04

### E5 — Ses & Erişilebilirlik  → uzman: `arastirma/teknik-mimari.md` (§ TTS 3 katman), Accessibility Auditor

> **KULLANICI NOTU (2026-09-03):** Yapay zekâ SESİ (şu an tarayıcı `SpeechSynthesis`) değiştirilecek —
> daha doğal, çocuk-dostu Türkçe ses (Azure Neural / ElevenLabs / gömülü insan kaydı). Ama bu
> **EN SON aşama**: önce E2–E4 (öğrenme çekirdeği + içerik) ve E8 (premium) bitsin. E5.1 (altyapı)
> erken yapılabilir; E5.2/E5.8 (gerçek ses üretimi + entegrasyon) Hafta 4'e ertelendi.

- [x] **E5.1** Ses klip altyapısı: `AUDIO` haritası (ses/hece/kelime → dosya yolu veya dataURI) + `playClip(key, fallbackText)` — klip varsa `Audio` çal, yoksa `say()`. Boş harita + TTS fallback ile başla. (Bu erken yapılabilir — sadece iskele.) — 2026-09-03
- [ ] **E5.2** `[Hafta 4 / EN SON]` Harf/hece/cümle için gerçek ses klipleri: çocuk-dostu Türkçe ses seçimi (Azure Neural tr-TR / ElevenLabs / insan kaydı — `arastirma/teknik-mimari.md` § TTS), toplu üretim, `AUDIO` haritasını doldur.
- [ ] **E5.8** `[Hafta 4 / EN SON]` Tarayıcı TTS'i tamamen bırak: tüm sesletim `playClip` üzerinden gömülü/CDN klipler; `say()` yalnızca acil yedek. Ses tutarlılığı testi.
- [x] **E5.3** Ses hız/tekrar kontrolü: yavaş/normal, "bir daha" her ekranda tutarlı. — 2026-09-04
- [ ] **E5.4** Erişilebilirlik geçişi: her interaktif öğede görünür `:focus-visible`, `role`/`aria-label`, klavye ile tam oynanabilirlik, `prefers-reduced-motion` tüm animasyonlarda.
- [x] **E5.5** Disleksi-dostu görünüm toggle'ı (ebeveyn ayarı): geniş harf/satır aralığı, düşük kontrast yerine sıcak zemin, tüm metin sola hizalı, serif değil. — 2026-09-04
- [x] **E5.6** Renk körlüğü kontrolü: doğru/yanlış yalnız renkle değil ikon+konumla da belli olsun (zaten kısmen var — tamamla). — 2026-09-04
- [x] **E5.7** "Sessiz mod" (kütüphanede/uyku öncesi): TTS kapalı, tüm yönergeler görsel + yazılı. Mute (E1.7) zaten TTS'i kapatıyordu ve soru metinleri (`qtext`) her turda zaten görseldi; eksik olan övgü/ipucu/tekrar/model-mesajlarıydı (yalnız `say()` ile seslendiriliyordu). Yeni `#fbMsg` elementi (`aria-live="polite"`, `s-game` ekranında `qtext` altında) + `showFeedback(t)`/`hideFeedback()` — `choose()`'un 3 dalı (doğru/1. yanlış/2. yanlış-ipucu/3. yanlış-model) ve `checkWord()`'ün 2 dalı artık `say()` ile birlikte aynı metni yazılı da gösteriyor; `runStep()`/`nextFreeRound()` yeni turda temizliyor. `prefers-reduced-motion`'da giriş animasyonu kapanıyor. — 2026-09-04

### E6 — Harf Çiz Derinleştirme  → uzman: pedagoji raporu (§ Yazma, 5 kademe)

- [x] **E6.1** Çok vuruşlu harflerde **vuruş vuruş kılavuz**: aktif vuruşu vurgula, biri bitince sonrakine geç, sıra dışı çizimde nazik uyar. — 2026-09-03
- [x] **E6.2** 5 kademe: (1) kılavuzlu iz, (2) noktalı, (3) soluk, (4) sadece başlangıç noktası, (5) bellekten. `setupTrace(letter, level)` seviyeye göre kılavuzu çiziyor; `cizLevel(s)` = `state.soundStats[s].cizLevel` (varsayılan 1); `checkTrace()` başarılı çizimde kademeyi 1 artırıyor (üst sınır 5). — 2026-09-03
- [ ] **E6.3** Yön hatası tespiti: çizim yönü kılavuzun tersineyse "yukarıdan aşağı gidelim" gibi uyarı.
- [ ] **E6.4** "Havada çiz" ısınması (ders 0 zaten var) + parmak kası ısınma çizgi çalışmaları (dalga, zikzak, spiral).
- [ ] **E6.5** Büyük harf çizimi (ayrı `STROKES_UPPER`).

### E7 — Sağlamlık & PWA

- [ ] **E7.1** PWA: gerçek `icon-192.png`/`icon-512.png` (canvas ile maskottan data-URI üret veya repo'ya ekle), `manifest.json` düzelt (kategori, ekran görüntüsü alanları), service worker sürüm yönetimi (`CACHE` sürümü otomatik), "ana ekrana ekle" ipucu (iOS/Android ayrı).
- [ ] **E7.2** İlk açılış hızı: kritik CSS satır içi (zaten), font `display=swap`, gereksiz reflow yok, ilk boya < 1.5 sn (Lighthouse notu commit'e).
- [ ] **E7.3** KVKK aydınlatma + gizlilik politikası + kullanım şartları metinleri (`arastirma/gizlilik-uyum.md`'den, sade dille) — ebeveyn bölümünde ayrı bir "Yasal / Gizlilik" sekmesi.
- [ ] **E7.4** Hata sınırları: global `try/catch` + "bir şeyler ters gitti, Kâşif'i yeniden başlat" ekranı; `localStorage` bozuksa güvenli sıfırlama; `speechSynthesis` yoksa sessiz moda düş.
- [ ] **E7.5** i18n iskeleti: tüm kullanıcı metinlerini `T('anahtar')` ile bir `STR` sözlüğüne al (tek dil `tr`, ama yapı hazır).
- [ ] **E7.6** Çevrimdışı sağlamlık: service worker tüm asset'leri önbelleğe alır, uçak modunda tam çalışır, "çevrimdışısın" göstergesi yok (sessizce çalışsın).
- [ ] **E7.7** Otomatik güncelleme: yeni sürüm yayınlanınca nazik "yenile" bildirimi (çocuğu bölmeden).

### E8 — Freemium & Premium  → uzman: `arastirma/rakip-analizi.md` (§ fiyatlandırma), Pricing Analyst

**Model (rakip analizinden):** kalıcı ücretsiz çekirdek + aylık ~149–199 TL / yıllık ~999–1.499 TL +
tek seferlik ünite paketi ~299–399 TL. Yerel TL, yerel ödeme, şeffaf iptal (Morpa'nın Şikayetvar tuzağına düşme).

**Ücretsiz kapsam:** 1. ses grubu (a,n,e,t,i,l), ders 0–6, 6 oyun tipinin hepsi (kısıtsız), temel ebeveyn izleme, Ses Karnesi.
**Premium kapsam:** 2.–5. ses grupları + ders 7–40+, Okuma Kulübü & metin bankası, ayrıntılı ebeveyn raporu + PDF + haftalık özet, çoklu çocuk profili, çevrimdışı indirme, Kâşif koleksiyon ödülleri, "zayıf seslere odak turu", yazdırılabilir çalışma sayfaları.

**KURAL:** Ödeme sağlayıcısı entegrasyonu STUB ile yapılır. Gerçek anahtar/hesap (Stripe, RevenueCat, iyzico, App Store/Play faturalama) **repoya girmez** — kullanıcıdan gelir, `.env` / build-time. Ajan yalnızca arayüz + entitlement mantığı + stub sağlayıcı yazar, "premium'u aç" düğmesi test modunda entitlement'ı açar.

- [x] **E8.1** Entitlement katmanı: `state.entitlement = { plan:'free'|'premium', source, since, expires }` + `isPremium()` yardımcı + `requirePremium(feature)` (premium değilse paywall aç). `localStorage` şeması `v3` + göç. — 2026-09-04
- [x] **E8.2** Özellik bayrakları: `FEATURES` haritası (her premium özellik → `free`/`premium`). Kilitli içerik haritada/menüde 🔒 rozetiyle görünür ama tıklayınca paywall. — 2026-09-04
- [x] **E8.3** Paywall ekranı (`s-paywall`): ne kazanılıyor (3–4 madde, çocuk değil ebeveyn diliyle), 3 plan kartı (aylık/yıllık/tek seferlik), "yıllık = 2 ay bedava" vurgusu, küçük "belki sonra". Ebeveyn kapısının arkasında. — 2026-09-04
- [x] **E8.4** Stub satın alma akışı: "Satın Al" → ebeveyn kapısı → sahte sağlayıcı ekranı ("bu bir test sürümüdür") → başarı → `entitlement.plan='premium'`. Gerçek entegrasyon noktası `buy(planId)` fonksiyonu, `// TODO: gerçek sağlayıcı` ile işaretli. — 2026-09-04
- [x] **E8.5** "Satın alımları geri yükle" (aynı cihazda entitlement kaybolursa) + tanıtım/hediye kodu alanı (`PROMO` haritası, stub). — 2026-09-04
- [ ] **E8.6** Aile planı / çoklu çocuk profili: premium'da 3'e kadar çocuk profili (`state.profiles[]`, aktif profil seçimi), her profilin ayrı ilerlemesi. Onboarding'de "kimin için?" ekranı.
- [x] **E8.7** Ücretsiz kullanıcıya nazik premium teşviki: ders 6 bitince "2. grubu keşfet" kartı (baskı yok, kapatılabilir), ebeveyn panelinde "premium'da neler var" bölümü. Çocuğa ASLA satış göstermez. — 2026-09-04
- [x] **E8.8** Premium rozeti/teşekkür: satın alan ebeveyne "teşekkürler" + çocuğa özel Kâşif kıyafeti/eşya (koleksiyon). — 2026-09-04
- [x] **E8.9** Fiyatlandırma verisi: `data/plans.json` (plan id, ad, TL fiyat, periyot, özellik listesi) — hem paywall hem landing sayfası buradan okur. — 2026-09-04
- [ ] **E8.10** Deneme süresi: 7 gün premium deneme (ebeveyn başlatır, tek sefer), bitiminde nazik hatırlatma, otomatik ücret YOK (deneme = sadece kilit açık, süre bitince kilitlenir).

### E9 — Yayın & Dağıtım  → uzman: App Store Optimizer, Growth Hacker

- [ ] **E9.1** Landing / tanıtım sayfası (`site/index.html`, ayrı tek dosya): ne, kimin için, 3 ekran görüntüsü, "ücretsiz başla" + fiyat özeti, SSS, KVKK linki. Aynı tasarım dili (Baloo 2 + Nunito).
- [ ] **E9.2** Fiyat sayfası (`site/fiyatlar.html` veya landing içinde): 3 plan, karşılaştırma tablosu, "okul/kurum için" iletişim.
- [ ] **E9.3** Mağaza metaverisi taslağı (`site/store-listing.md`): uygulama adı, kısa/uzun açıklama, anahtar kelimeler, yaş derecesi, "Designed for Families" / Kids Category notları (`arastirma/gizlilik-uyum.md`).
- [ ] **E9.4** Capacitor iskeleti: `capacitor.config` + `README` talimatı (kod değişmeden `index.html`'i sarar). Gerçek build kullanıcıda.
- [ ] **E9.5** Beta geri bildirim kanalı: ebeveyn bölümünde "geri bildirim gönder" — `mailto:` veya form linki (dış servis yok, sadece link).
- [ ] **E9.6** Hafif kullanım ölçümü (gizlilik-dostu, opsiyonel, varsayılan KAPALI): sadece toplam/anonim sayaçlar cihazda; ebeveyn açarsa özet e-posta linki oluşturur. Üçüncü taraf analiz YOK.
- [ ] **E9.7** Sürüm notları ekranı ("Bu sürümde yeni neler var") — çocuk değil ebeveyn için.
- [ ] **E9.8** `CHANGELOG.md` (kullanıcı-yönlü) — her yayınlanabilir kilometre taşında güncelle.

---

## 3. Değişiklik günlüğü

- 2026-09-03 — Repo oluşturuldu, GELISTIRME-PLANI.md eklendi. v0 durumu: 6 oyun + harita + Ses Karnesi.
- 2026-09-03 — E1 (Ebeveyn İzleme Sayfası) tamamlandı: `s-parent` 5 sekme, 14 günlük grafik, ders logları, evde-etkinlik önerileri, ayarlar (disleksi/sessiz/hedef), JSON dışa/içe aktarma. `state` şeması genişledi (daily, lessonLog, settings) — hâlâ `v2` (geriye uyumlu merge).
- 2026-09-03 — E1.9 + E1.10 (rutin): 14 günlük grafikte hedef çizgisi görünürlüğü düzeltildi, çubuklara gün etiketi + hover, `.ptabs` yatay kaydırılan şerit oldu. İlk test altyapısı: `npm i -D jsdom` + `test/smoke.mjs` (16 kontrol), `npm test`.
- 2026-09-03 — Plan yeniden düzenlendi: **~1 ay halka sunum hedefi** + § 1.5 haftalık yol haritası + **E8 (Freemium & Premium)** + **E9 (Yayın & Dağıtım)** epikleri eklendi. Rutin sıklığı artırıldı (3 saatte bir).
- 2026-09-03 — E2.1 (rutin, Hafta 1 kilometre taşı): çoktan seçmeli turlarda (Harfi Bul/Sesi Eşleştir/Hece Kur) kademeli hata protokolü eklendi — 1. yanlışta nötr tekrar, 2.'de doğru şıkka görsel ipucu, 3.'te doğru modellenip tur biter ve ses `state.reviewQueue`'ya alınır. `okuma-kasifi-v2` şemasına `reviewQueue` alanı eklendi (geriye uyumlu). Smoke test'e 4 yeni kontrol.
- 2026-09-03 — E2.2 (rutin, Hafta 1 kilometre taşı): tekrar kuyruğu artık tüketiliyor — ders başında `reviewSteps()` kuyruktaki en fazla 3 sesi kısa tur olarak ekliyor, yardımsız doğru cevapta `consumeReview()` ile kuyruktan çıkarıyor. Smoke test'e 3 yeni kontrol.
- 2026-09-03 — E2.6 (rutin, Hafta 1 kilometre taşı): oturum ritmi — yaş moduna göre eşik dakika (Keşif 8, Çözümleme 15) aşılınca ders bitiş ekranında nazik "mola ver, yarın devam" önerisi bir kez gösteriliyor. Smoke test'e 4 yeni kontrol.
- 2026-09-03 — E2.7 (rutin, Hafta 1 kilometre taşı): Kâşif'in övgü/ipucu cümleleri merkezi `PRAISE`/`RETRY_MSGS`/`HINT_MSGS` dizilerine taşındı ve 5'ten 15/6/5'e çıkarıldı; çabayı öven cümleler eklendi. Smoke test'e 3 yeni kontrol.
- 2026-09-03 — E3.3 (rutin, Hafta 1 kilometre taşı): Ses Karnesi'nde <%50 doğrulukta ses varsa harita üstünde "🔁 Tekrar turu" düğmesi beliriyor; tıklanınca o seslerle 4–5 turluk hedefli oturum (`startReviewRound`) başlıyor, bitişte harita ilerlemesine dokunmayan ayrı bir bitiş ekranı gösteriliyor. Smoke test'e 6 yeni kontrol.
- 2026-09-03 — E3.1 (rutin, Hafta 1 kilometre taşı): her ders sonuna 3 soruluk hızlı değerlendirme eklendi (`assessSteps`); 2/3+ doğru geçti sayılır, değilse ders yine tamamlanır ama harita düğümünde `🔁 tekrar önerilir` işareti (`state.lessonLog[id].needsReview`) beliriyor. Smoke test'e 4 yeni kontrol.
- 2026-09-03 — E2.3 (rutin, Hafta 1 kilometre taşı): aralıklı tekrar (basit Leitner) — her ses için `strength` (0–5) ve `lastSeen` izleniyor, ders başında düşük/eski sesler için 1-2 turluk "ısınma" adımları ekleniyor (`warmupSteps`, `reviewSteps`'ten de önce). Smoke test'e 4 yeni kontrol.
- 2026-09-03 — E2.4 kısmi (rutin, Hafta 1 kilometre taşı): Harfi Bul'a ikinci varyant eklendi — (a) resim→harf (mevcut) ve (b) "duyduğun ses hangi harf?" arasında `roundBul()` rastgele seçiyor. Sesi Eşleştir/Hece Kur varyantları ve Harfi Bul (c) sonraki çalışmaya bırakıldı. Smoke test'e 3 yeni kontrol.
- 2026-09-03 — E6.2 (rutin, Hafta 1 kilometre taşı): Harf Çiz'e 5 kademeli kılavuz sistemi eklendi — `setupTrace(letter,level)` seviyeye göre tam/nokralı/soluk/yalnız-başlangıç-noktası/hiç kılavuz göstermiyor; her başarılı çizimde `state.soundStats[s].cizLevel` bir artıyor (üst sınır 5). Smoke test'e 4 yeni kontrol.
- 2026-09-03 — E3.2 (rutin, Hafta 1 kilometre taşı): "Kâşif Gösterisi" (ders 12) artık puansız/kutlama odaklı — değerlendirme soruları kaldırıldı, özel bitiş ekranı eklendi; `openLesson()` her derste `assessResults`'ı sıfırlayarak önceki dersten sonuç sızmasını önlüyor. Smoke test'e 4 yeni kontrol.
- 2026-09-03 — E2.5 (rutin, Hafta 1 kilometre taşı): zorluk uyarlaması — son 5 turun doğruluğuna göre (`difficultyLevel()`) Harfi Bul/Sesi Eşleştir/Hece Kur seçenek sayısı otomatik artıp azalıyor (`kolay`/`normal`/`zor`). Hafta 1 kilometre taşındaki E2 (hata kurtarma + çeşitlilik + aralıklı tekrar) böylece tamamlandı. Smoke test'e 7 yeni kontrol.
- 2026-09-03 — E2.4 (c) (rutin, Hafta 1 kilometre taşı): Harfi Bul'a üçüncü varyant eklendi — büyük/küçük harf eşleme (`UPPER_MAP` Türkçe büyük harf tablosu; i→İ, ı→I noktasız kuralı dahil). `roundBul()` artık 3 varyant arasında eşit olasılıkla seçiyor. Smoke test'e 2 yeni kontrol.
- 2026-09-03 — E2.4 Sesi Eşleştir (b)+(c) (rutin, Hafta 1 kilometre taşı): `roundSes()` artık 3 varyant arasında rastgele seçiyor — (a) ses→resim (mevcut, `roundSesStart`), (b) "hangisi farklı sesle başlıyor" (`roundSesOdd`, WORDBANK'ten çeşitli resimlerle), (c) "son ses" (`roundSesEnd`, kelimenin bitiş sesini bulma). Her ikisi de yeterli aday yoksa (a)'ya düşer. E2.4 artık Harfi Bul ve Sesi Eşleştir için tamamlandı; Hece Kur kaldı. Smoke test'e 4 yeni kontrol.
- 2026-09-03 — E2.4 Hece Kur (b)+(c) (rutin, Hafta 1 kilometre taşı): `roundHece()` artık 3 varyant arasında rastgele seçiyor — (a) hece tanı (mevcut, `roundHeceListen`), (b) "hece→resim" (`roundHecePic`, bu heceyle başlayan kelimenin resmini bul), (c) "eksik harfi bul" (`roundHeceMissing`, heceyi tamamlayan harfi seç). **E2.4 (tüm mini oyunlarda ≥2 varyant çeşitliliği) tamamlandı.** Smoke test'e 4 yeni kontrol.
- 2026-09-03 — E6.1 (rutin, Hafta 1 kilometre taşı): Harf Çiz'e vuruş vuruş kılavuz eklendi — çok vuruşlu harflerde (t,n,k,u,r,m,a,i) aktif vuruş kılavuzda turuncu/sarı çizgiyle vurgulanıyor (`drawActiveHighlight`), başlangıç noktası da o vuruşa göre kayıyor. Çocuk bir vuruşu bitirince (`end()`) çizim `strokeMatchRatio()` ile hedef vuruşa yakınlık oranına göre değerlendiriliyor: yeterince örtüşürse sıradaki vuruşa geçilip nazik teşvik mesajı gösteriliyor, örtüşmüyorsa çizim silinmeden nazik bir uyarı mesajı gösteriliyor (engellemiyor). Tek vuruşlu harflerde ve kademe 5'te (bellekten) devre dışı. Smoke test'e 7 yeni kontrol (saf fonksiyonlar `multiStrokeGuideOn`/`strokeMatchRatio` üzerinden, canvas'a ihtiyaç duymadan).
- 2026-09-03 — E3.4 (rutin, Hafta 1 kilometre taşı — **son madde, Hafta 1 tamamlandı**): "Okuma Kulübü" oyunu eklendi (`roundOkuma`) — `READING` sabiti (mufredat.json ders 12 metni + 2 anlama sorusu), Kâşif metni okur → "sorulara geç" → sıralı 2 soru (`askOkuma`/`answerOkuma`) → bitişte `award()`. Serbest Oyun menüsüne yalnız Çözümleme modunda görünen "📖 Okuma Kulübü" kartı eklendi. Böylece **Hafta 1 kilometre taşı (öğrenme çekirdeği: E2 hata kurtarma+çeşitlilik+aralıklı tekrar, E3.1–E3.4 değerlendirme+Okuma Kulübü, E6.1–E6.2 Harf Çiz kılavuz+kademeler) tamamlandı.** Sıradaki odak Hafta 2: E4.1–E4.3 (2.–4. ses grupları), E3.5 (metin bankası), E4.5 (40+ kelime), E5.1 (ses klip altyapısı iskeleti). Smoke test'e 7 yeni kontrol.
- 2026-09-03 — E4.5 (rutin, Hafta 2 kilometre taşı başlangıcı): `WORDBANK` 12'den 40 kelimeye çıkarıldı — hepsi yalnızca 1.+2. grup seslerinden (a,n,e,t,i,l,o,k,u,r,ı,m) kurulu, her biri net emoji ile (elma🍎, kartal🦅, roket🚀, market🏪, ırmak🌊, vb.). Kelimeler zaten `pool`'a göre filtrelendiğinden (Kelime Kur/Kelime Eşle) yeni sözcükler öğrenilen seslere göre otomatik açılıyor. Smoke test'e 3 yeni kontrol (kelime sayısı, ses kapsamı, emoji varlığı).
- 2026-09-03 — E5.1 (rutin, Hafta 2 kilometre taşı): ses klip altyapısı eklendi — boş `AUDIO` haritası + `playClip(key,fallbackText,cb)` (klip varsa `Audio` ile çalar, yoksa/hata olursa `say()` TTS'ine düşer). `sayPrompt`/`repeatPrompt` artık merkezi olarak `playClip` üzerinden geçiyor, böylece tüm oyun turu anlatımları (15+ çağrı noktası tek yerden) E5.2'de (Hafta 4) `AUDIO` doldurulduğunda otomatik gerçek klibe geçecek — hiçbir çağrı noktası değişmedi. Smoke test'e 3 yeni kontrol.
- 2026-09-03 — E3.5 (rutin, Hafta 2 kilometre taşı): Okuma Kulübü artık tek sabit metin yerine `TEXTS` metin bankasından besleniyor (`data/metinler.json` ile senkron) — `pickText(pool)` çocuğun açtığı seslere göre en ileri uygun metni seçer. İlk metin (`els-1`) yalnız 1. grup (a,n,e,t,i,l) seslerinden, ikincisi (`els-2`) 1.+2. grup kesişiminden kurulu; ayrıca eski metindeki henüz öğretilmeyen 'd'/'b' sesi hatası (aldı/baktı) düzeltildi — artık her metnin gövdesi gerçekten yalnız kendi `gerekli` seslerinden oluşuyor. `roundOkuma()` her çağrıda `READING=pickText(unlockedPool())` ile günceller. Smoke test'e 5 yeni kontrol.
- 2026-09-03 — E4.1 (rutin, Hafta 2 kilometre taşı): 2. ses grubu (o,k,u,r,ı,m) gözden geçirildi — `WORDS`/`STROKES` zaten 12 sesin tamamını (1.+2. grup) kapsıyordu, `WORDBANK` E4.5 ile zaten genişlemişti; eksik kalan tek nokta Cümle Bahçesi'ydi (mevcut cümleler r/u/m seslerini neredeyse hiç kullanmıyordu) — 3 yeni cümle eklendi ("Nine kutu al.", "Kral armut al.", "O roket al.") ve `SENT_WORDS` dağıtıcı havuzu genişletildi. Böylece 2. grup, Hece Kur/Sesi Eşleştir/Harfi Bul (zaten E2.4'te varyantlı)+Kelime Kur (WORDBANK)+Cümle Bahçesi'nin hepsinde tam oynanabilir hâle geldi. Smoke test'e 4 yeni kontrol.
- 2026-09-03 — E4.2 (a) (rutin, Hafta 2 kilometre taşı — 3. grup başlangıcı): "ü" sesi tam donanımlı eklendi — `mufredat.json`'a `sesler.ü` + ders 13 (kelimeler/heceler pool-güvenli); `index.html`'e `WORDS.ü` (üzüm🍇), `STROKES.ü` (4 vuruş: iki nokta + u gövdesi + kuyruk, `i`'deki nokta desenini tekrar kullanır), `LESSONS` id13 ("Ses ü"). `WORDBANK`'a kül🔥/üzüm🍇/üç3️⃣ eklendi — "kül" ü öğrenilince hemen erişilebilir, "üzüm"/"üç" kendi seslerini (z/ç) gerektirdiğinden pool filtresiyle otomatik gizli kalıp o sesler öğrenilince açılacak. Büyük madde (E4.2, 6 ses) alt adımlara bölündü; sıradaki alt adımlar s→ö→y→d→z. Smoke test'e 6 yeni kontrol. NOT: bu turda bir test mesajında kaçırılmış apostrof (`\'`) template-literal içinde string'i erken kapatıp sözdizimi hatasına yol açtı — iki mesaj apostrofsuz yeniden yazılarak düzeltildi (ders alınan nokta: test mesajlarında apostrof kullanılmayacak).
- 2026-09-03 — E4.2 (b) (rutin, Hafta 2 kilometre taşı): "s" sesi tam donanımlı eklendi — `mufredat.json`'a `sesler.s` (sürtünmeli ünsüz) + ders 14; `index.html`'e `WORDS.s` (su💧), `STROKES.s` (tek vuruşlu S eğrisi, `o` gibi kapalı değil açık uçlu), `LESSONS` id14 ("Ses s"). `WORDBANK`'a su💧/kes✂️ eklendi (ikisi de yalnız önceki+s seslerinden, hemen erişilebilir). Sıradaki alt adım: ö (ders 15). Smoke test'e 6 yeni kontrol.
- 2026-09-03 — E4.2 (c) (rutin, Hafta 2 kilometre taşı): "ö" sesi tam donanımlı eklendi — `mufredat.json`'a `sesler.ö` (o ile karışır) + ders 15; `index.html`'e `WORDS.ö` (ördek🦆), `STROKES.ö` (iki nokta + o gövdesi, `ü` deseninin aynısı ama u yerine o gövdesi), `LESSONS` id15 ("Ses ö"). `WORDBANK`'a körük🔥 eklendi (ö+önceki gruplardan, hemen erişilebilir). Sıradaki alt adım: y (ders 16). Smoke test'e 5 yeni kontrol.
- 2026-09-03 — E4.2 (d) (rutin, Hafta 2 kilometre taşı): "y" sesi tam donanımlı eklendi — `mufredat.json`'a `sesler.y` (sürekli ünsüz/yarı ünlü) + ders 16; `index.html`'e `WORDS.y` (yol🛣️), `STROKES.y` (iki eğik vuruş bir noktada birleşip ikincisi kuyruk olarak devam eder), `LESSONS` id16 ("Ses y"). `WORDBANK`'a yol🛣️/yumurta🥚 eklendi (ikisi de y+önceki gruplardan, hemen erişilebilir). Sıradaki alt adım: d (ders 17). Smoke test'e 6 yeni kontrol.
- 2026-09-03 — E4.2 (e) (rutin, Hafta 2 kilometre taşı): "d" sesi tam donanımlı eklendi — `mufredat.json`'a `sesler.d` (patlayıcı ünsüz) + ders 17; `index.html`'e `WORDS.d` (davul🥁), `STROKES.d` (kapalı ilmek gövde + sağdan yukarı çıkan dik vuruş), `LESSONS` id17 ("Ses d"). `WORDBANK`'a domates🍅/duman💨 eklendi (ikisi de d+önceki gruplardan, hemen erişilebilir). Son ses (z, ders 18) + 3. grup rozeti kaldı — E4.2 sıradaki çalışmada tamamlanacak. Smoke test'e 6 yeni kontrol.
- 2026-09-03 — E4.2 (f) (rutin, Hafta 2 kilometre taşı — **E4.2 tamamlandı**): "z" sesi tam donanımlı eklendi ve 3. grup kapandı — `mufredat.json`'a `sesler.z` (sürtünmeli ünsüz, s ile karışır) + ders 18 ("Ses z") + ders 19 ("Kâşif Gösterisi 2", kümülatif kutlama, rozet); `index.html`'e `WORDS.z` (zil🔔), `STROKES.z` (tek zikzak vuruş: üst yatay+çapraz+alt yatay), `LESSONS` id18 + id19 (`tip:'gosteri'`, `rozet:'3. Grup Kâşifi 🏆'` — mevcut jenerik `buildSteps`/`finishLesson` gösteri mantığı ders12 ile aynı şekilde ders19'u da otomatik kapsıyor, kod değişikliği gerekmedi). `WORDBANK`'a zil🔔/kazan🍲 eklendi; ayrıca E4.2(a)'da eklenen "üzüm" (z gerektirdiği için o zaman gated'ti) artık erişilebilir hale geldi. **3. ses grubu (ü,s,ö,y,d,z, 6 ses, ders 13–19) tamamen oynanabilir.** Sıradaki öncelik: E4.3 (4. grup ç,b,g,c,ş). Smoke test'e 8 yeni kontrol (138 test toplamda).

---

- 2026-09-04 — E4.3 (a) (rutin, Hafta 2 kilometre taşı — 4. grup başlangıcı): "ç" sesi tam donanımlı eklendi — `mufredat.json`'a `sesler.ç` (patlayıcı ünsüz, c ile karışır) + ders 20; `index.html`'e `WORDS.ç` (çay☕), `STROKES.ç` (2 vuruş: açık c-eğrisi gövde + altında küçük kedilya çengeli), `LESSONS` id20 ("Ses ç"), `ALL_LETTERS`'a ç/ş eklendi (Harfi Bul dağıtıcı havuzu için). `WORDBANK`'a çay☕ eklendi (ç+önceki gruplardan, hemen erişilebilir). Büyük madde (E4.3, 5 ses) alt adımlara bölündü; sıradaki alt adımlar b→g→c→ş. Smoke test'e 5 yeni kontrol.

- 2026-09-04 — E4.3 (b) (rutin, Hafta 2 kilometre taşı): "b" sesi tam donanımlı eklendi — `mufredat.json`'a `sesler.b` (patlayıcı ünsüz) + ders 21; `index.html`'e `WORDS.b` (balon🎈), `STROKES.b` (dik gövde + gövde ortasından sağa çıkan kabarcık ilmeği), `LESSONS` id21 ("Ses b"). `WORDBANK`'a balon🎈/boya🎨 eklendi (ikisi de b+önceki gruplardan, hemen erişilebilir). Sıradaki alt adım: g (ders 22). Smoke test'e 6 yeni kontrol.

- 2026-09-04 — E4.3 (c) (rutin, Hafta 2 kilometre taşı): "g" sesi tam donanımlı eklendi — `mufredat.json`'a `sesler.g` (patlayıcı ünsüz, k ile karışır) + ders 22; `index.html`'e `WORDS.g` (gemi🚢), `STROKES.g` (o'nun kapalı gövdesi + alt sağdan aşağı sarkan kuyruk deşentr), `LESSONS` id22 ("Ses g"). `WORDBANK`'a gemi🚢/gül🌹 eklendi (ikisi de g+önceki gruplardan, hemen erişilebilir). Sıradaki alt adım: c (ders 23). Smoke test'e 6 yeni kontrol.

- 2026-09-04 — E4.3 (d) (rutin, Hafta 2 kilometre taşı): "c" sesi tam donanımlı eklendi — `mufredat.json`'a `sesler.c` (patlayıcı ünsüz, ç ile karışır) + ders 23; `index.html`'e `WORDS.c` (ceket🧥), `STROKES.c` (tek vuruşlu açık eğri, ç'nin çengelsiz hâli), `LESSONS` id23 ("Ses c"). `WORDBANK`'a ceket🧥/cam🪟 eklendi (ikisi de c+önceki gruplardan, hemen erişilebilir). Son ses (ş, ders 24) + 4. grup rozeti kaldı. Smoke test'e 6 yeni kontrol.

- 2026-09-04 — E4.3 (e) (rutin, Hafta 2 kilometre taşı — **E4.3 tamamlandı**): "ş" sesi tam donanımlı eklendi ve 4. grup kapandı — `mufredat.json`'a `sesler.ş` (sürtünmeli ünsüz, s ile karışır) + ders 24 ("Ses ş") + ders 25 ("Kâşif Gösterisi 3", kümülatif kutlama, rozet); `index.html`'e `WORDS.ş` (şeker🍬), `STROKES.ş` (s'nin eğrisi + altına küçük kedilya çengeli), `LESSONS` id24 + id25 (`tip:'gosteri'`, `rozet:'4. Grup Kâşifi 🏆'`). `WORDBANK`'a şeker🍬/şal🧣 eklendi. **4. ses grubu (ç,b,g,c,ş, 5 ses, ders 20–25) tamamen oynanabilir — böylece Hafta 2 kilometre taşının içerik derinliği hedefi (E4.1–E4.3: 2.–4. ses grupları) tamamlandı.** Sıradaki öncelik: E4.4 (5. grup p,h,v,ğ,f,j) veya Hafta 2'nin kalan diğer maddeleri (E3.5/E4.5/E5.1 zaten tamam). Smoke test'e 9 yeni kontrol (168 test toplamda).

- 2026-09-04 — E1.11 (rutin, Hafta 2 kilometre taşı tamamlandıktan sonra, backlog sırası): "Yaş modu" (`s-mode`) ekranına opsiyonel "Adı" metin girişi eklendi (`#childNameInput`, `state.childName`, `setChildName()` — 20 karaktere kadar, boşluklar kırpılır, boşsa boş dizeye döner). `go()` ekran geçişinde girişi mevcut değerle dolduruyor. Ebeveyn "Genel" sekmesindeki haftalık özet cümlesi artık sabit "Kâşif" yerine `state.childName||'Kâşif'` kullanıyor. `okuma-kasifi-v2` şemasına `childName` alanı eklendi (geriye uyumlu — `fresh()` varsayılanı boş dize, mevcut kayıtlarda `Object.assign` ile otomatik dolduruluyor). Smoke test'e 6 yeni kontrol.

- 2026-09-04 — E1.12 (rutin, backlog sırası): Ebeveyn panelinde "🖨️ Yazdır / PDF olarak kaydet" düğmesi eklendi (`printReport()`) — mevcut Genel/Dersler/Ses Karnesi/Öneriler sekmelerinin HTML'lerini (`pGenel()`/`pDersler()`/`pKarne()`/`pOneri()`, kod tekrarı yok) çocuğun adı+tarih başlığıyla `#printReport` konteynerine yazıp `window.print()` çağırıyor; `@media print` kuralı yalnız bu konteyneri görünür bırakıp gerisini (uygulama arayüzü, düğmeler, sekmeler) gizliyor, tarayıcının "PDF olarak kaydet" seçeneği ayrı bir kurulum gerektirmiyor. Smoke test'e 5 yeni kontrol.
- 2026-09-04 — E8.1 (rutin, Hafta 3 kilometre taşı başlangıcı — Hafta 1+2 kilometre taşları zaten tamamlanmıştı): Freemium/premium temel katmanı — `state.entitlement={plan,source,since,expires}` (varsayılan `free`), `isPremium()` (süre kontrollü), `requirePremium(feature,onGranted)` (premiumsa direkt callback, değilse ebeveyn kapısı+paywall'a yönlendirir). `openGate(onSuccess)` artık parametreli (varsayılan yine `openParent`, mevcut "Ebeveyn köşesi" akışı değişmedi). `localStorage` anahtarı `okuma-kasifi-v2`→`okuma-kasifi-v3` (ilk açılışta otomatik göç, eski kayıt silinmiyor). `resetProgress()` artık satın alınmış entitlement'ı koruyor. Smoke test'e 6 yeni kontrol.
- 2026-09-04 — E8.9+E8.3+E8.4 (rutin, Hafta 3 kilometre taşı): `data/plans.json` (referans) + `PLANS` sabiti (aylık 179 TL/yıllık 1199 TL "2 ay bedava"/tek seferlik 349 TL kalıcı). Yeni `s-paywall` ekranı — ebeveyn dilinde fayda listesi + `PLANS`'tan render edilen 3 plan kartı + "belki sonra"; yalnızca `openPaywall()` ile açılır, çocuk akışında hiçbir doğrudan erişim yok. `buy(planId)` → "test ödeme ekranı" (`stubPay` overlay, açıkça "bu bir test sürümüdür", gerçek sağlayıcı yok) → `confirmStubPurchase()` `entitlement.plan='premium'` yapar (gerçek entegrasyon noktası `// TODO: gerçek sağlayıcı` ile işaretli), plana göre `expires` hesaplanır. Başarı ekranı sonrası `finishPurchaseFlow()` varsa bekleyen kilidi otomatik açar. Smoke test'e 14 yeni kontrol.
- 2026-09-04 — E8.2 (rutin, Hafta 3 kilometre taşı): `FEATURES` haritası + `lessonNeedsPremium(id)` (ders 7 ve sonrası = 2.–5. ses grupları premium, ders 0–6 ücretsiz). `renderMap()` sıradaki ders premium gerektiriyorsa 🔒 rozetiyle gösteriyor, tıklanınca `requirePremium()` ile kapı+paywall açılıyor; tamamlanmış dersler her zaman erişilebilir kalıyor. Smoke test'e 9 yeni kontrol.
- 2026-09-04 — E8.5 (rutin, Hafta 3 kilometre taşı — **E8 çekirdeği tamamlandı**): Paywall'a "tanıtım/hediye kodu" alanı (`redeemPromo()`, `PROMO` haritası — stub `KASIF30`=30 gün/`AILEDENE`=7 gün, cihaz başına tek kullanım `state.promoUsed`) ve "↺ Satın alımları geri yükle" düğmesi (`restorePurchases()` — gerçek mağaza sorgusu yok/`// TODO`, cihaz-içi `state.purchaseHistory`'den son geçerli satın almayı geri yükler) eklendi. Her satın alma/kod artık `purchaseHistory`'ye kaydediliyor. Smoke test'e 12 yeni kontrol.
- 2026-09-04 — E8.7 (rutin, Hafta 3 kilometre taşı): Ücretsiz kullanıcı 1. grubu (ders 0–6) bitirince ders-tamam ekranında baskısız/kapatılabilir "🔍 2. grubu keşfet" kartı+düğmesi (yalnız ders 6, premiumda hiç görünmüyor, düğme kapı→paywall açıyor — çocuğa asla doğrudan satış yok). Ebeveyn "Ayarlar" sekmesine `entitlementLabel()` ile durum kutusu eklendi: ücretsizken "Premium'da neler var?" özeti+"Premium'u keşfet" düğmesi, premiumken kalan gün/kalıcılık bilgisi. Smoke test'e 10 yeni kontrol (toplam 231 test). **Hafta 3 kilometre taşının çekirdeği (E8: entitlement, paywall, stub satın alma, geri yükleme/promo, nazik teşvik) tamamlandı** — kalan E8.6 (aile planı/çoklu profil), E8.8 (premium rozeti/teşekkür), E8.10 (7 gün deneme) sonraki çalışmalara bırakıldı. Sıradaki öncelik: bu üçü veya Hafta 4'ün E5.4 (erişilebilirlik) / E7 (PWA cilası) maddeleri.

- 2026-09-04 — E3.6 (rutin, backlog sırası — E1/E2/E3.1–E3.5 zaten tamamdı): İlerleme rozeti sistemi — `MILESTONE_BADGES` (ses ustalığı 1/10, gün serisi 3/7/14, ilk kelime/cümle/metin), `awardBadge()` (dedup ile `state.badges`'a ekler), `masteredSoundCount()`, `checkMilestoneBadges()` (`creditSounds()` ve `trackTime()` sonunda tetiklenir). `checkWord()` başarılı kelime/cümlede, `finishOkuma()` metin bitiminde ilgili rozeti veriyor. Yeni `s-collection` ekranı (haritadan "🏆 Koleksiyon" düğmesiyle) — `badgeCatalog()` (ders-grubu rozetleri + kilometre taşı rozetleri) `renderCollection()` ile ızgara halinde gösteriliyor; kazanılmamış rozetler emoji/ad gizlenip "???" ile, kazanılanlar açık gösteriliyor. Smoke test'e 15 yeni kontrol (247 test toplamda). Sıradaki öncelik: E4.4 (5. ses grubu p,h,v,ğ,f,j) veya Hafta 3'ün kalan E8.6/E8.8/E8.10 maddeleri.

- 2026-09-04 — E4.4 (a)-(c) (rutin, Hafta 2/3 backlog sırası — 5. grup başlangıcı): "p" (para💵), "h" (horoz🐓) ve "v" (vazo🏺) sesleri tam donanımlı eklendi — `mufredat.json` sesler.p/h/v + ders 26/27/28, `index.html`'e `WORDS`/`STROKES`/`LESSONS`/`WORDBANK` girişleri, `ALL_LETTERS`/`UPPER_MAP` genişletildi. "h" için ilk seçilen örnek kelime "hava" henüz öğrenilmemiş 'v' sesini içerdiğinden pedagojik hataydı — "horoz" ile değiştirildi (curriculum'un kendi örnek listesinde zaten vardı). Kalan 3 ses: **ğ** (Türkçe'de kelime başında/sonunda hiç bulunmaz — mevcut "hangi harfle başlar"/"hangi sesle başlıyor"/"hangi sesle bitiyor" oyunlarının hepsi konum varsayımına dayandığından ğ için ayrı mantık gerekiyor; ayrıca `syllablesFor()` şu an her ünsüz için hem C+V hem V+C hece üretiyor, ğ için sadece V+ğ geçerli — bu da düzeltilmeli), **f**, **j** sonraki çalışmalara bırakıldı. Smoke test'e 16 yeni kontrol (264 test toplamda).

- 2026-09-04 — E4.4 (d) (rutin, 5. grup devamı): "ğ" (yumuşak g) sesi, Türkçe'nin kelime başında hiç bulunmayan tek harfi olarak özel kuralla eklendi. İçerik: `mufredat.json` sesler.ğ + ders 29 (`kural` alanı), `WORDS.ğ`="dağ"⛰️ (kasıtlı olarak ğ ile başlamıyor), `STROKES.ğ` (3 vuruş: şapka + g'nin gövde/kuyruk deseni), `WORDBANK`'a dağ⛰️. Mühendislik: `syllablesFor()` artık ğ için yalnız geçerli ünlü+ğ hecelerini (ağ, öğ) üretiyor; `roundBul()` ğ hedefteyken "hangi harfle başlar?" varyantını otomatik atlıyor; `roundSes()`'in "başlıyor" tabanlı iki varyantı (Start/Odd) ğ'yi hiç hedef/dağıtıcı yapmıyor, "son ses" (End) varyantı ise ğ ile doğal çalışıyor (dağ örneği). Smoke test'e 10 yeni kontrol (274 test toplamda). Sıradaki öncelik: E4.4 (e)-(f) f/j sesleri + "Kâşif Gösterisi 4" (5. grup rozeti, ders 32) — E4.4'ü tamamlar.

- 2026-09-04 — E4.4 (e)-(f) (rutin, **5. grup ve E4.4 tamamlandı**): "f" (fil🐘) ve "j" (jeton🪙) sesleri eklendi, ders 32 "Kâşif Gösterisi 4" ile 5. grup rozeti ("5. Grup Kâşifi 🏆") kazanılıyor. `mufredat.json` sesler.f/j + ders30-32; `index.html`'e `WORDS`/`STROKES`/`LESSONS`/`WORDBANK` girişleri, `ALL_LETTERS`/`UPPER_MAP` genişletildi. **Böylece 5. ses grubu (p,h,v,ğ,f,j, ders 26-32) tamamen oynanabilir ve MEB 2024 TYMM'in tüm 29 sesi/harfi artık haritada mevcut** — E4 epiğinin ses-grubu genişletme kısmı (E4.1-E4.4) tamamlandı. Smoke test'e 14 yeni kontrol (288 test toplamda). Sıradaki öncelik: E4.6 (büyük/küçük harf farkındalığı), E4.7 (rakam sesleri), veya Hafta 3/4'ün kalan maddeleri (E8.6/E8.8/E8.10 aile planı/premium rozeti/deneme süresi, E5.3-E5.7 erişilebilirlik, E6.3-E6.5 Harf Çiz derinleştirme, E7 PWA cilası).

- 2026-09-04 — E8.8 (rutin, Hafta 3 kalan maddesi): premium satın alma "teşekkür" + koleksiyon ödülü — E3.6'da eklenen rozet koleksiyon sistemine yeni bir `MILESTONE_BADGES` girişi ("Kâşif'in Yıldız Pelerini 🦸") eklendi, `confirmStubPurchase()` başarılı (gerçek para karşılığı) satın almada bu rozeti veriyor ve satın alma başarı ekranına ("🎉 Premium açıldı!") bir teşekkür + rozet cümlesi (`#pwSuccessBadge`) ekleniyor. Tanıtım/hediye kodu (`redeemPromo()`, ücretsiz) bu rozeti KAZANDIRMIYOR — yalnız gerçek satın almaya özel, çocuğa asla satış gösterilmiyor (rozet sadece koleksiyon ekranında görünür). Smoke test'e 3 yeni kontrol (291 test toplamda). Sıradaki öncelik: E8.6 (aile planı/çoklu profil) veya E8.10 (7 gün deneme) ile Hafta 3'ü tamamen kapatmak, ya da Hafta 4'ün E5.4 (erişilebilirlik)/E7 (PWA cilası) maddeleri.

- 2026-09-04 — E5.6 (rutin, Hafta 4 erişilebilirlik öncelik sırası): doğru/yanlış artık yalnız kenarlık rengiyle değil, `.choice` köşesine sabit konumlu ikon rozetiyle de gösteriliyor — `.choice.right::after` yeşil ✓ dairesi, `.choice.wrong::after` kırmızı ✕ dairesi, `.choice.hint::after` 💡. Tüm çoktan seçmeli oyun türleri (Harfi Bul/Sesi Eşleştir/Hece Kur, checkTrace() geri bildirimi) aynı `.choice` sınıfını paylaştığından JS değişikliği gerekmedi, saf CSS. Smoke test'e 3 yeni kontrol (294 test toplamda). Sıradaki öncelik: E4.6/E4.7 (E4 epiği kalanı) veya E5.3 (ses hız kontrolü).

- 2026-09-04 — E4.7 (rutin, backlog sırası): "Sayılar" mini-modülü eklendi — `NUMBERS` sabiti (1-10, rakam+Türkçe okunuş+emoji), `roundRakam()` 2 varyantla (a) sesle söylenen sayıyı duy-bul, (b) resimdeki yıldızları say-bul; harf havuzundan (`pool`) bağımsız olduğundan Serbest Oyun menüsünde her zaman oynanabilir ("🔢 Sayılar" kartı). Mevcut `paint()`/`choose()`/zorluk uyarlaması (`difficultyLevel()`) altyapısı aynen kullanıldı, yeni JS mekanizması gerekmedi. Smoke test'e 14 yeni kontrol (305 test toplamda). E4 epiğinde tek kalan madde: E4.6 (büyük/küçük harf farkındalığı — cümle başı, özel ad). Sıradaki öncelik: E4.6 veya E5.3 (ses hız/tekrar kontrolü).

- 2026-09-04 — E4.6 (rutin, backlog sırası — **E4 epiği tamamlandı**): "Büyük mü Küçük mü?" mini-modülü eklendi — `PROPER_NAMES` (kişi adları, pool'a göre filtrelenir) + `capitalize()` yardımcısı (Türkçe ı→I, i→İ kuralına uygun, `UPPER_MAP` üzerinden), `roundBuyuk()` 2 varyantla: (a) cümle başı her zaman büyük harfle yazılır (bir SENTENCES cümlesinin ilk kelimesinin doğru/yanlış yazımından seç), (b) özel adlar (kişi isimleri) büyük harfle başlar (isim ile sıradan kelimeler arasından ismin doğru yazımını seç). Yalnız Çözümleme modunda görünür ("Büyük mü Küçük mü?" kartı, Okuma Kulübü ile aynı desen). Yetersiz pool'da güvenli şekilde `roundBul()`'a düşer. **Böylece E4 epiği (2.–5. ses grupları + kelime bankası + sayılar + büyük/küçük harf farkındalığı) tamamlandı.** Smoke test'e 17 yeni kontrol (322 test toplamda). NOT (mühendislik dersi): testDriver şablon dizesi (template literal) içinde yazılan regex literallerinde `\?` gibi tanınmayan kaçış dizileri JS tarafından sessizce ters eğik çizgisi düşürülerek yorumlanıyor (regex niyetlenen `\?$` aslında `ı?$` gibi bir quantifier'a dönüşüyor) — testDriver içine regex eklenirken ters eğik çizgi ÇİFT yazılmalı (`\\?`). Sıradaki öncelik: E5.3 (ses hız/tekrar kontrolü) veya E6.3-E6.5 (Harf Çiz derinleştirme).

- 2026-09-04 — E5.3 (rutin, Hafta 4 erişilebilirlik önceliği): ebeveyn Ayarlar sekmesine "Kâşif'in ses hızı" seçici eklendi (Normal/Yavaş, `state.settings.speechRate`) — `ttsRate()` yardımcısı `say()`'in `u.rate`'ini buna göre ayarlıyor (normal .86, yavaş .62), geri çağırma güvenlik zaman aşımı da yavaş modda orantılı uzatıldı. "Tekrar dinle" (`repeatPrompt`/🔊 düğmesi) zaten tüm oyun ekranlarında ortak `stageHTML()` şablonu üzerinden tutarlı bir şekilde sunuluyordu (E5.1'de merkezi hale getirilmişti) — ek değişiklik gerekmedi. Smoke test'e 7 yeni kontrol (329 test toplamda). Sıradaki öncelik: E6.3-E6.5 (Harf Çiz derinleştirme) veya E5.4/E5.5/E5.7 (erişilebilirlik kalanı).

- 2026-09-04 — E5.5 (rutin, Hafta 4 erişilebilirlik önceliği): disleksi-dostu görünüm ("Ayarlar" > toggle, E1.7'den beri vardı) artık tüm kriterleri karşılıyor — eksik olan tek parça "düşük kontrast yerine sıcak zemin" eklendi: `:root.dys` artık `--bg/--surface/--surface-2/--ink/--ink-soft` token'larını krem tonlu sıcak bir palete çeviriyor (parlak/beyaz yerine). Bu geçersiz kılma bilinçli olarak koyu temadan bağımsız (disleksi araştırmalarında önerilen krem zemin, koyu modun yüksek kontrastından daha rahat kabul edilir). Geniş harf/satır aralığı, sola hizalı ana metin ve serif olmayan yazı tipi zaten mevcuttu. Smoke test'e 3 yeni kontrol (332 test toplamda). Sıradaki öncelik: E5.4 (erişilebilirlik geçişi tam taraması) veya E6.3-E6.5 (Harf Çiz derinleştirme).

- 2026-09-04 — E5.7 (rutin, backlog sırası): "sessiz mod" tamamlandı. Mevcut `mute` ayarı (E1.7) zaten TTS'i kapatıyor ve soru metinleri (`qtext`) zaten her turda görseldi; eksik olan yalnızca sesli söylenen övgü/ipucu/tekrar/model mesajlarıydı. Yeni `#fbMsg` (`aria-live="polite"`) elementi + `showFeedback()`/`hideFeedback()` — `choose()`'un tüm dalları ve `checkWord()` artık `say()` ile aynı anda aynı metni yazılı da gösteriyor; her yeni turda (`runStep`/`nextFreeRound`) temizleniyor. `prefers-reduced-motion` giriş animasyonunu kapatıyor. Smoke test'e 6 yeni kontrol (338 test toplamda). Sıradaki öncelik: E5.4 (erişilebilirlik geçişi tam taraması) veya E6.3-E6.5 (Harf Çiz derinleştirme).

## 4. Fikir havuzu (henüz planlanmadı)

- Öğretmen/sınıf paneli (B2B — `arastirma/rakip-analizi.md`), okul lisansı (öğrenci başı ~200–400 TL/yıl)
- "Kâşif'in defteri": çocuğun çizdiği harflerin galerisi (premium)
- Dokunmayla "kendi hikâyeni kur" (bilinen kelimelerden cümle) — premium
- Günlük "3 dakikalık Kâşif" hızlı görev + gün serisi ödülü
- Ebeveyne haftalık WhatsApp özeti (çift opt-in, dış servis gerektirir — kullanıcı kararı)
- Sesli okuma değerlendirmesi (Faz 2, `arastirma/teknik-mimari.md` — Azure Pronunciation Assessment)
- Yıllık aboneye fiziksel "Kâşif rozet/çıkartma seti" (kargo — kullanıcı kararı)
