# Okuma Kâşifi — Sürekli Geliştirme Planı

> Bu belge, projeyi otonom olarak geliştiren ajanın **tek kaynak talimatıdır**.
> Her çalışmada: en üstteki `[ ]` işaretli maddeyi al → uygula → test et → commit et → `[x]` yap → bu belgeyi güncelle.
> Hedef: 1–2 ay boyunca, her gün küçük ama sağlam bir ilerleme.

---

## 0. Ajan çalışma yönergesi (HER ÇALIŞMADA OKU)

**Rol:** Sen bu projenin baş geliştiricisisin. Aşağıdaki backlog'u sırayla işliyorsun.

**Bir çalışmanın adımları:**
1. `git pull` (varsa). Bu belgeyi ve `README.md`'yi oku.
2. **Backlog'dan sıradaki `[ ]` maddeyi seç** (bir epik içinde yukarıdan aşağıya; epikler arası: E1 → E2 → E3 → E4 → E5 → E6 döngüsel, ama "acil" etiketli maddeler öne alınır).
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

**Şu anki durum (v0):** onboarding + yaş modu (Keşif 4–5 / Çözümleme 6–7) · 12 derslik keşif
haritası (kilit + rozet) · 6 mini oyun (Harfi Bul, Sesi Eşleştir, Hece Kur, Kelime Kur, Cümle
Bahçesi, Harf Çiz) · Ses Karnesi (per-ses tanısal rapor) · serbest oyun · ebeveyn paneli ·
tarayıcı TTS · yerel ilerleme.

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
- [ ] **E1.11** Çocuğun adını onboarding'de sor (opsiyonel, cihazda), ebeveyn özetinde "Kâşif" yerine kullan.
- [ ] **E1.12** Ebeveyne "yazdır / PDF" (tarayıcı print CSS) haftalık rapor.

### E2 — Hata Kurtarma & Çeşitlilik  → uzman: pedagoji raporu (§ Hata protokolü, § Oyunlaştırma)

- [ ] **E2.1** Kademeli hata protokolü: 1. yanlış → nötr "tekrar dinle"; 2. yanlış → **hedefli ipucu** (yanlış şıkkı soluklaştır / doğru şıkkın ilk harfini vurgula); 3. yanlış → **modelle + birlikte** (doğruyu göster, "birlikte söyleyelim"), sonra doğruyla bitir, o maddeyi tekrar kuyruğuna al. `wrongCount` say.
- [ ] **E2.2** "Tekrar kuyruğu": bir turda takılınan ses/hece `state.reviewQueue`'ya eklenir; sonraki oturumların başında 2–3 kısa tekrar turu.
- [ ] **E2.3** Aralıklı tekrar (spaced repetition): her sesin `lastSeen` + `strength` (0–5). Ders başı "ısınma" turu, `strength` düşük + `lastSeen` eski sesleri seçer. Basit Leitner mantığı.
- [ ] **E2.4** Aynı hedef için çeşitli alıştırma tipleri — her mini oyunda en az 2 varyant:
  - Harfi Bul: (a) resim→harf, (b) ses duy→harf, (c) büyük/küçük eşle
  - Sesi Eşleştir: (a) ses→resim, (b) "hangisi farklı sesle başlıyor", (c) son ses
  - Hece Kur: (a) hece tanı, (b) hece→resim (heceyle başlayan), (c) eksik harfi bul
- [ ] **E2.5** Zorluk uyarlaması: son 5 turdaki doğruluk >%85 → seçenek sayısı/çeldirici artır; <%50 → azalt, ipucu süresini uzat.
- [ ] **E2.6** Oturum ritmi: pedagoji raporundaki süreye göre (Keşif 6–10 dk, Çözümleme 12–18 dk) nazik "mola" önerisi + "yarın devam" ekranı; süre limiti ebeveyn ayarından.
- [ ] **E2.7** Kâşif'in tepki çeşitliliği: övgü/ipucu cümlelerini 5→15+ varyanta çıkar, çabayı öv ("çok denedin!") sonucu değil.

### E3 — Pratik & Değerlendirme  → uzman: pedagoji raporu (§ Başarı ölçütü, § 12 ders)

- [ ] **E3.1** Ders sonu mini-değerlendirme: her dersin son adımı, o dersin `basariOlcutu`'na göre 3 hızlı soru; geçemezse ders "tamam" olur ama haritada "tekrar önerilir" işareti + Ses Karnesi'ne yansır.
- [ ] **E3.2** Grup sonu "Kâşif Gösterisi" (ders 6 ve 12): puansız, kümülatif, kutlama odaklı ara sınav — mevcut `gosteri` tipini genişlet.
- [ ] **E3.3** "Zayıf seslere otomatik dönüş": Ses Karnesi'nde <%50 olan ses varsa, harita en üstünde "Tekrar turu" düğmesi belirir → o seslerle 4–5 turluk hedefli çalışma.
- [ ] **E3.4** Okuma Kulübü oyunu (`roundOkuma`): `data/mufredat.json` ders 12'deki `metin` + `anlamaSorulari`. Kâşif metni sesli okur → çocuk metni görür (bilinen seslerle) → 2 anlama sorusu (resimli seçenek). Çözümleme modu.
- [ ] **E3.5** Kısa metin bankası genişlet: her ses grubu tamamlanınca 2–3 cümlelik, sadece bilinen seslerden kurulu resimli mini metin. `data/metinler.json` oluştur.
- [ ] **E3.6** "İlerleme rozeti" sistemi: ses ustalığı, gün serisi (streak), ilk kelime, ilk cümle, ilk metin — koleksiyon ekranı.

### E4 — İçerik Genişletme  → uzman: pedagoji + `data/mufredat.json`

- [ ] **E4.1** 2. ses grubu tam oyunlaştırma: `o,k,u,r,ı,m` için `WORDS` + `STROKES` + `WORDBANK` + `SENTENCES` zaten kısmen var — eksikleri tamamla, ders 7–11 içeriğini `mufredat.json` ile hizala.
- [ ] **E4.2** 3. grup `ü,s,ö,y,d,z`: `WORDS` (ör. ü→üzüm, s→su, ö→ördek, y→yıldız, d→davul, z→zil), `STROKES` yaz, ders 13–18 ekle.
- [ ] **E4.3** 4. grup `ç,b,g,c,ş`: benzer.
- [ ] **E4.4** 5. grup `p,h,v,ğ,f,j`: benzer. (ğ kelime başında olmaz — kural göster.)
- [ ] **E4.5** WORDBANK'i 12→40+ kelimeye çıkar (grup ilerledikçe açılan). Her kelimeye net emoji/görsel.
- [ ] **E4.6** Büyük harf / küçük harf farkındalığı modülü (cümle başı, özel ad).
- [ ] **E4.7** Rakam ve sayı sesleri mini-modülü (1–10) — okuma-yazmaya bitişik.

### E5 — Ses & Erişilebilirlik  → uzman: `arastirma/teknik-mimari.md` (§ TTS 3 katman), Accessibility Auditor

- [ ] **E5.1** Ses klip altyapısı: `AUDIO` haritası (ses/hece/kelime → dosya yolu veya dataURI) + `playClip(key, fallbackText)` — klip varsa `Audio` çal, yoksa `say()`. Boş harita + TTS fallback ile başla.
- [ ] **E5.2** Harf/hece için placeholder ses klipleri üretme betiği/talimatı (gerçek kayıt veya onaylı TTS toplu üretim — `arastirma/teknik-mimari.md`).
- [ ] **E5.3** Ses hız/tekrar kontrolü: yavaş/normal, "bir daha" her ekranda tutarlı.
- [ ] **E5.4** Erişilebilirlik geçişi: her interaktif öğede görünür `:focus-visible`, `role`/`aria-label`, klavye ile tam oynanabilirlik, `prefers-reduced-motion` tüm animasyonlarda.
- [ ] **E5.5** Disleksi-dostu görünüm toggle'ı (ebeveyn ayarı): geniş harf/satır aralığı, düşük kontrast yerine sıcak zemin, tüm metin sola hizalı, serif değil.
- [ ] **E5.6** Renk körlüğü kontrolü: doğru/yanlış yalnız renkle değil ikon+konumla da belli olsun (zaten kısmen var — tamamla).
- [ ] **E5.7** "Sessiz mod" (kütüphanede/uyku öncesi): TTS kapalı, tüm yönergeler görsel + yazılı.

### E6 — Harf Çiz Derinleştirme  → uzman: pedagoji raporu (§ Yazma, 5 kademe)

- [ ] **E6.1** Çok vuruşlu harflerde **vuruş vuruş kılavuz**: aktif vuruşu vurgula, biri bitince sonrakine geç, sıra dışı çizimde nazik uyar.
- [ ] **E6.2** 5 kademe: (1) kılavuzlu iz, (2) noktalı, (3) soluk, (4) sadece başlangıç noktası, (5) bellekten. `state.soundStats[s].cizLevel` ile ilerlet.
- [ ] **E6.3** Yön hatası tespiti: çizim yönü kılavuzun tersineyse "yukarıdan aşağı gidelim" gibi uyarı.
- [ ] **E6.4** "Havada çiz" ısınması (ders 0 zaten var) + parmak kası ısınma çizgi çalışmaları (dalga, zikzak, spiral).
- [ ] **E6.5** Büyük harf çizimi (ayrı `STROKES_UPPER`).

### E7 — Yayın Hazırlığı (sona doğru)

- [ ] **E7.1** PWA: gerçek `icon-192.png`/`icon-512.png` (canvas ile maskottan üret), `manifest.json` düzelt, service worker sürüm yönetimi, "ana ekrana ekle" ipucu.
- [ ] **E7.2** İlk açılış hızı: font `display=swap` + kritik CSS satır içi (zaten), gereksiz reflow yok.
- [ ] **E7.3** KVKK aydınlatma + gizlilik + kullanım şartları metinleri (`arastirma/gizlilik-uyum.md`'den) — ebeveyn bölümünde, sade dille.
- [ ] **E7.4** Hata sınırları: `try/catch` + kullanıcıya "bir şeyler ters gitti, Kâşif'i yeniden başlat" ekranı; `localStorage` bozuksa sıfırdan başlat.
- [ ] **E7.5** i18n iskeleti (metinleri `T('anahtar')` ile dışarı al) — ileride dil genişletme için.
- [ ] **E7.6** Basit landing/tanıtım sayfası (`site/index.html`) — ne olduğunu anlatan, demoya link.

---

## 3. Değişiklik günlüğü

- 2026-09-03 — Repo oluşturuldu, GELISTIRME-PLANI.md eklendi. v0 durumu: 6 oyun + harita + Ses Karnesi.
- 2026-09-03 — E1 (Ebeveyn İzleme Sayfası) tamamlandı: `s-parent` 5 sekme, 14 günlük grafik, ders logları, evde-etkinlik önerileri, ayarlar (disleksi/sessiz/hedef), JSON dışa/içe aktarma. `state` şeması genişledi (daily, lessonLog, settings) — hâlâ `v2` (geriye uyumlu merge).
- 2026-09-03 — E1.9 + E1.10: 14 günlük grafikte hedef çizgisinin görünürlüğü düzeltildi (üstte 6px pay + `max` hesaplamasına hedef dahil edildi), çubuklara gün etiketi + hover ile tarih/dakika `<title>` eklendi; `.ptabs` dar ekranda taşma yerine yatay kaydırılan şerit oldu (aktif sekmeye otomatik `scrollIntoView`, `prefers-reduced-motion`'a saygılı). İlk `node --check` + `npm i -D jsdom` ile `test/smoke.mjs` duman testi eklendi (16 kontrol: ekranlar, ebeveyn sekmeleri, grafik regresyonu, `award()` akışı) — `npm test` ile çalışır.

---

## 4. Fikir havuzu (henüz planlanmadı)

- Çoklu çocuk profili (tek cihaz, birden çok kardeş)
- Öğretmen/sınıf paneli (B2B — `arastirma/rakip-analizi.md`)
- Ebeveyne haftalık e-posta/WhatsApp özeti (çift opt-in)
- "Kâşif'in defteri": çocuğun çizdiği harflerin galerisi
- Sesli komutla değil ama dokunmayla "kendi hikâyeni kur" (bilinen kelimelerden)
- Ödül olarak maskota kıyafet/eşya (ekonomi değil, koleksiyon)
- Günlük "3 dakikalık Kâşif" hızlı görev
