# Okuma Kâşifi — Rakip Analizi ve Fırsat Raporu

**Konu:** Türkiye'de 4–7 yaş çocuklar için yapay zekâ ajanı temelli, Türkçe, ses (fonik / ses temelli okuma) yöntemine uygun okuma-yazma öğrenme uygulaması
**Hazırlayan:** Pazar / Trend Araştırmacısı
**Tarih:** 2026-09-03
**Not:** Fiyatlar ABD pazarı için USD listelenmiştir; store bölge fiyatlandırması ve kampanyalarla değişir. Türkiye rakamları TL ve tahminidir.

---

## 0. Yönetici Özeti

- Global pazarda erken okuma uygulamaları olgun ve kalabalık (Duolingo ABC, Khan Academy Kids, Lingokids, HOMER/Begin, ABCmouse, Reading Eggs, Starfall). Çoğu **İngilizce fonik** üzerine kurulu, **adaptif algoritma** kullanıyor ama **gerçek "AI ajanı / konuşan öğretmen"** değil.
- Gerçek AI okuma koçu kategorisi yeni ve dar: **Ello** (D2C, çocuğun sesli okumasını dinler, takıldığı kelimede yardım eder) ve **Amira Learning** (okul/B2B, "Science of Reading" temelli sesli okuma değerlendirmesi + birebir koçluk). İkisi de İngilizce/İspanyolca; Türkçe yok.
- LLM tabanlı çocuk okuma asistanı henüz **ürünleşmemiş**; çoğunlukla akademik araştırma aşamasında (KidSpeak, çeşitli 2025–2026 çalışmaları). Çocuk sesi tanıma (ASR) hâlâ zayıf halka.
- Türkiye pazarında ilk okuma-yazma uygulamaları **MEB müfredatına bağlı, ses/hece temelli, öğretmen yapımı** ama teknolojik olarak basit: alıştırma/oyun mantığı, **AI yok**, ölçme-değerlendirme ve kişiselleştirme zayıf. En güçlü oyuncu indirme adedinde "Okuma Yazma Öğreniyorum" (~4M indirme). Kurumsal tarafta Morpa Kampüs güçlü ama ilkokul 1. sınıf ilk okumaya özel değil ve pahalı algılanıyor.
- **Boşluk:** Türkçe'nin ses temelli (bitişik eğik yazı + ses/hece yöntemi) ilk okuma pedagojisine tam oturan, çocuğun **sesli okumasını dinleyip anında düzelten bir AI ajanı** + ebeveyne **ilerleme raporu** veren, MEB müfredatıyla hizalı, çevrimdışı çalışabilen, güvenli (kapalı içerik) bir ürün yok.

---

## 1. Karşılaştırma Tablosu

### 1A. Global — Erken Okuma / Genel Erken Öğrenme

| Ürün | Hedef yaş | Pedagojik yaklaşım | AI kullanımı | Gelir modeli & fiyat (ABD) | Platform | Güçlü yönler | Zayıf yönler | Ebeveyn deneyimi |
|---|---|---|---|---|---|---|---|---|
| **Duolingo ABC** | 3–6 (8'e kadar) | Fonik + sight words + harf izleme + interaktif hikâye; kısa "bite-size" dersler | Adaptif algoritma (zorlanılan sesi tekrar getirir); oyunlarda **konuşma tanıma** ile sesli okuma; gerçek diyalog ajanı yok | **Tamamen ücretsiz**, reklamsız, IAP yok (Duolingo ana ürünü çapraz besliyor) | iOS, Android | Bedava, marka güveni, güçlü oyunlaştırma, güçlü UX | İngilizce; müfredata/rapora zayıf; "koç" yok; içerik derinliği sınırlı | Çok düşük sürtünme; kurulum kolay; ilerleme bildirimleri basit |
| **Khan Academy Kids** | 2–8 | Bütünsel: okuma, dil, matematik, SEL; tematik, kütüphane + aktiviteler; karakter rehberli | Uyarlanabilir "kişiselleştirilmiş öğrenme yolu"; gerçek AI koç yok (Khanmigo ayrı, büyük yaş) | **Tamamen ücretsiz** (kâr amacı gütmeyen, bağış modeli) | iOS, Android, web | Bedava, reklamsız, geniş içerik, öğretmen modu | İngilizce; ölçme hafif; ebeveyn raporu yüzeysel; okuma "koçluğu" yok | Güven yüksek; "çok içerik, yönlendirme az" şikâyeti |
| **Lingokids** | 2–8 (en iyi <7) | "Playlearning": oyun/şarkı/video; akademik + sosyal-duygusal; İngilizce edinim | Kişiselleştirme pazarlama dilinde; belgelenmiş güçlü bir AI motoru yok | Freemium abonelik: **~15,99 USD/ay** veya **~74,99 USD/yıl** (liste 191,88), 7 gün deneme | iOS, Android | Prodüksiyon kalitesi yüksek; marka; geniş içerik | Ana dili İngilizce olmayanlar için "İngilizce öğrenme" konumu; ilk okuma-yazma öğretimi değil; pahalı | Deneme sonrası ücretlendirme şikâyetleri; iptal sürtünmesi |
| **HOMER (Begin)** | 2–8 | Kişiselleştirilmiş erken okuma yolculuğu; fonik, hikâye, yaratıcılık; ilgi alanına göre uyarlama | Giriş anketi + kural tabanlı kişiselleştirme; gerçek konuşan AI koç yok | Abonelik: **~9,99 USD/ay** / **~59–80 USD/yıl**; 30–60 gün deneme | iOS, Android, web | Güçlü pedagoji ekibi; kişiselleştirme; Begin ekosistemi (matematik, dünya bilgisi) | İngilizce; sesli okuma dinleme/koçluk zayıf; agresif deneme→ücret akışı | Deneme iptali ve otomatik yenileme şikâyetleri yaygın |
| **Endless Alphabet / Endless Reader** (Originator) | 3–7 | Kelime hazinesi + harf-ses eşleme; komik animasyonlu "puzzle"; örtük öğrenme, doğrudan öğretim yok | AI yok | **Tek seferlik satın alma** (~ürün başına 8,99 USD) veya "Endless Learning Academy" aboneliği | iOS, Android | Çok sevilen animasyon; reklamsız; çevrimdışı; tek ödeme seçeneği | Sistematik fonik/müfredat yok; ilerleme takibi yok; İngilizce | Çok düşük sürtünme; "bir kez al, bitti" memnuniyeti |
| **Starfall** | 3–9 (PreK–3) | Sistematik fonik ("learn to read"); şarkı, hikâye, oyun; sıralı üniteler | AI yok | Freemium: çok içerik bedava + **Home Membership ~35 USD/yıl** | Web, iOS, Android | Ucuz; köklü; sağlam fonik sıralaması; okullarda tanınır | Eski moda arayüz; kişiselleştirme/rapor yok; İngilizce | Çok uygun fiyat; "arayüz eski ama işe yarıyor" |
| **Reading Eggs** | 2–13 (çekirdek 3–7) | Sistematik fonik + seviyeli okuma; harita/ödül temelli ilerleme; yerleştirme testi | Yerleştirme + seviyelendirme algoritması; AI koç yok | Abonelik: **~69,99 USD/yıl** (Reading) / **~99,99 USD/yıl** (+Mathseeds); ücretsiz deneme | Web, iOS, Android | Güçlü müfredat yapısı; ilerleme raporu; ödül döngüsü | Pahalı; grafikler tarih kokuyor; İngilizce; ekran "iş" hissi | Rapor/ilerleme görünürlüğü iyi; fiyat direnci |
| **Hooked on Phonics** | 3–8 | Klasik sistematik fonik; kısa günlük dersler + fiziksel kitap seçeneği | AI yok | Abonelik **~7–14 USD/ay**; kutulu setler ayrı | iOS, Android, web | Marka bilinirliği; net yapı; kısa dersler | İçerik hacmi az; modernleşme yavaş; İngilizce | Basit, öngörülebilir; "az ama düzenli" |
| **ABCmouse** (Age of Learning) | 2–8 | Geniş müfredat (okuma, matematik, sanat, bilim); "Learning Path"; oyunlaştırma yoğun | Kural tabanlı öğrenme yolu; gerçek AI koç yok (Age of Learning'in ayrı adaptif ürünleri var) | Abonelik: **~45 USD/yıl ilk yıl, ~59,99 USD/yıl yenileme** (~12,99 USD/ay) | Web, iOS, Android, Kindle | Çok geniş içerik; kurumsal/okul dağıtımı; düşük giriş fiyatı | Dağınık, "çok şey" hissi; derin okuma koçluğu yok; İngilizce | İyi fiyat/değer algısı; bazı ebeveyn "ödül şekeri fazla" eleştirisi |
| **Speakaboos** | 3–7 | Hikâye tabanlı okuma motivasyonu; etkileşimli storybook | AI yok | Abonelik (tarihsel); ürün büyük ölçüde geri çekildi / Homer'a evrildi | iOS, Android (tarihsel) | Hikâye kütüphanesi; motivasyon | Ürün fiilen aktif değil; müfredat zayıftı | Artık geçerli referans değil |
| **Elmo Loves ABCs** (Sesame Street / Sesame Workshop) | 3–5 | Harf tanıma + kelime + video/oyun; marka karakter bağı | AI yok | **Tek seferlik ~4,99 USD** (eski uygulama) | iOS, Android | Elmo marka sevgisi; küçük yaşa uygun; tek ödeme | Çok eski; dar kapsam (sadece harfler); güncellenmiyor | Nostaljik, düşük beklenti |

### 1B. Yeni Nesil — AI Okuma Koçu

| Ürün | Hedef yaş | Pedagojik yaklaşım | AI kullanımı | Gelir modeli & fiyat | Platform | Güçlü yönler | Zayıf yönler | Ebeveyn deneyimi |
|---|---|---|---|---|---|---|---|---|
| **Read with Ello** | 4–9 | "Science of Reading"; çocuk **decodable (çözümlenebilir) kitapları sesli okur**, AI dinler, takılınca ipucu/telaffuz desteği verir; Adaptive Learn™ ile seviye ayarı | **Çekirdek AI**: çocuğun sesli okumasını gerçek zamanlı dinleyen konuşma tanıma + kelime düzeyinde yardım + adaptif kitap önerisi. Konuşan "okuma arkadaşı" karakteri | D2C abonelik: **14,99 USD/ay** veya **~139 USD/yıl**; 14 gün deneme; fiziksel kitap kutusu ek paket; düşük gelirli aileler için "Ello Access" indirimi | iOS, Android | En yakın "tüketiciye satılan AI okuma koçu"; Time 2024 "top inventions"; ebeveyne okuma dakikası/ilerleme raporu; motivasyon karakteri | Sadece İngilizce; kapalı kitap kütüphanesine bağımlı; pahalı; çevrimiçi gerekir; çocuk ASR hataları | "Çocuk gerçekten sesli okuyor" memnuniyeti yüksek; fiyat ve İngilizce-only sınırı |
| **Amira Learning** | ~5–11 (K–5) | "Science of Reading"; sesli okuma akıcılık değerlendirmesi (ORF), kod çözme/akıcılık/kelime/anlama; micro-müdahaleler; disleksi tarama sinyalleri | **Çekirdek AI**: çocuk sesli okurken dinler, hataları sınıflar, birebir koçluk yapar (EN + ES); öğretmen paneline analitik | **B2B / okul-bölge lisansı** (öğrenci başı yıllık); D2C "Amira at Home" sınırlı | Web, tablet | Bağımsız çalışmalarla kanıtlanmış okuma kazanımı (haftada 30 dk → yıllık ~7 hafta ek ilerleme); 5M+ öğrenci, 4000+ bölge; değerlendirme + öğretim birleşik | Okul odaklı, ebeveyn için hantal; İngilizce/İspanyolca; kurumsal satış döngüsü uzun; pahalı | Ebeveyn doğrudan müşteri değil; deneyim öğretmen aracılı |
| **LLM tabanlı çocuk okuma asistanları (genel)** | — | Üretken AI ile seviyeye/güvenliğe göre hikâye üretimi; sohbet tabanlı okuma pratiği; disleksi için yapılandırılmış tutor denemeleri | Araştırma aşaması: KidSpeak (çocuk sesi için çok amaçlı LLM), kontrollü zorluk/güvenlikte hikâye üreten kompakt LLM'ler, konuşma tabanlı ev okuryazarlığı çalışmaları | Henüz yaygın ticari ürün yok | — | Sınırsız kişiselleştirilmiş içerik; diyalog; ilgi alanına göre hikâye | Çocuk ASR olgun değil; halüsinasyon/güvenlik; ebeveyn güveni; maliyet; gizlilik/COPPA-KVKK | Erken; ebeveyn algısı temkinli ("çocuğum yapay zekâ ile mi konuşuyor?") |

### 1C. Türkiye Pazarı

| Ürün | Hedef yaş | Pedagojik yaklaşım | AI kullanımı | Gelir modeli & fiyat | Platform | Güçlü yönler | Zayıf yönler | Ebeveyn deneyimi |
|---|---|---|---|---|---|---|---|---|
| **Okuma Yazma Öğreniyorum** (NIAYS) | ~5–7 (1. sınıf + okuma bilmeyenler) | MEB müfredatına uygun, **ses temelli / bitişik eğik yazı**; sınıf öğretmenleri hazırlamış; ses→hece→kelime→cümle sıralı adımlar; Türkçe + temel matematik | **AI yok** (kural tabanlı alıştırma/oyun) | Freemium: ücretsiz + reklam / kilitli bölümler için tek seferlik veya küçük abonelik; genelde düşük ücret | Android (ağırlıklı), iOS | **~4M indirme**, Google "Öğretmen Onaylı"; müfredat uyumu; yerli; ucuz | Ölçme-değerlendirme ve kişiselleştirme yok; sesli okuma dinleme yok; ilerleme raporu zayıf; reklam deneyimi; grafik/UX sıradan | Erişilebilir, tanıdık; "ödevi destekliyor" algısı; derin takip beklentisi karşılanmıyor |
| **Okuyorum İlk Okuma Yazma** | ~5–7 | Harf→hece→kelime→cümle kademeli; öğretici + eğlenceli etkinlikler; MEB çizgisi | AI yok | Freemium / düşük ücret | Android, iOS | Net kademeli yapı; öğretmen kaynak siteleriyle (dersekranda vb.) birlikte anılıyor | Basit; kişiselleştirme/rapor yok; ses tanıma yok | Öğretmen tavsiyeli kullanım; sınıfa yardımcı |
| **Okumatik Okuma Yazma** | 1. sınıf + yetişkin okuryazarlığı | İlk okuma desteği; ses/hece | AI yok | Freemium / düşük ücret | Android | Yetişkin okuryazarlığına da hitap; sade | Dar kapsam; UX zayıf; takip yok | Düşük beklenti, düşük fiyat |
| **Alfabe/hece/kelime oyunları** (Alfabe Oyunu, ABC Yazma Okuma, Edudi, "3-5 yaş eğitici oyunlar" vb.) | 2–6 | Harf tanıma, izleme, eşleştirme, mini oyunlar; örtük öğrenme | Genelde AI yok | Freemium + reklam; bazıları tek seferlik | iOS, Android | Bol, ucuz/bedava; küçük yaşa uygun oyunlar; bazıları çevrimdışı | Sistematik ilk okuma müfredatı yok; parçalı; reklam yoğun; kalite değişken | "Oyalıyor + biraz öğretiyor"; kalite ayrımı zor |
| **TRT Çocuk uygulamaları** (Alfabe, Kelime Oyunu, Rakamlar, oyun portföyü) | 3–8 | Karakter/çizgi film bağlı eğitici oyunlar; alfabe, kelime; eğlence ağırlıklı | AI yok | **Ücretsiz, reklamsız** (kamu yayıncısı) | iOS, Android | Güçlü marka güveni; reklamsız; güvenli içerik algısı; yerli karakterler | Pedagojik derinlik ve ilerleme takibi sınırlı; "ders" değil "etkinlik" | Ebeveyn güveni yüksek; "güvenle bırakırım" |
| **Morpa Kampüs** | İlkokul–lise (1–12) | Geniş MEB müfredat kapsamı; konu anlatımı, video, soru bankası, testler; ilkokul modülü var | AI yok / sınırlı öneri | **Abonelik**: yıllık ~KDV dahil listelenen 4.800 TL; kampanyalı ~3.000–3.700 TL/yıl (2025) | Web, iOS, Android | Kapsam genişliği; okul/kurum anlaşmaları; marka | 1. sınıf ilk okuma-yazmaya özel değil; pahalı algısı ve fiyat artışı şikâyetleri (Şikayetvar); otomatik yenileme sorunları; ekran "ödev" hissi | Fiyat direnci belirgin; genelde sınav/okul başarısı için alınıyor |
| **EBA (MEB)** | Tüm kademeler | Resmî MEB içerikleri; ders videoları, etkinlik, e-içerik; 1. sınıf Türkçe ilk okuma materyalleri | AI yok (MEB'in ayrı AI/analitik girişimleri gündemde) | **Ücretsiz** (kamu) | Web, iOS, Android, EBA TV | Bedava, resmî, her yere ulaşır; öğretmen kullanımı; müfredatın kendisi | UX ve etkileşim zayıf; kişiselleştirme yok; ebeveyn için gündelik kullanım aracı değil; içerik dağınık | "Devletin sitesi" algısı; kriz dönemi (pandemi) dışında düşük gündelik kullanım |
| **e-Okul VBS** | Tüm kademeler | Öğrenme aracı değil; not/devamsızlık/bilgilendirme sistemi | Yok | Ücretsiz | Web, iOS, Android | 18M+ öğrenci, 36M+ veli; her velinin telefonunda | İçerik/öğretim yok | Referans: "veli dijital MEB ile zaten temasta" |
| **Vitamin (Sebit) / benzeri kurumsal edtech** | İlkokul–lise | Konu anlatımı + alıştırma; okul lisanslama | Sınırlı adaptif | Okul lisansı / abonelik | Web, mobil | Okul kanalı; içerik olgun | İlk okuma-yazmaya özel değil; tüketici tarafı zayıf | Okul aracılı |

> Not: "Vscool" adında yaygın bir Türkiye ürünü doğrulanamadı; kurumsal edtech tarafında Vitamin (Sebit), Morpa, Tonguç (üst yaş), Okulistik gibi oyuncular baskın. İlk okuma-yazma segmentinde kurumsal oyuncular zayıf.

---

## 2. Türkçe Pazarındaki Boşluklar — Ürün Nereye Oturur?

### Tespit edilen boşluklar

1. **AI okuma koçu boşluğu (en büyük):** Türkiye'de hiçbir yaygın ürün çocuğun **sesli okumasını dinleyip** anlık düzeltmiyor. Global'de bunu Ello/Amira yapıyor ama Türkçe yok. Türkçe fonetik olarak şeffaf bir dil (yazıldığı gibi okunur) — bu, İngilizce'ye göre **çocuk sesli okuma değerlendirmesini teknik olarak daha kolay ve daha güvenilir** kılar. Türkçe için okuma akıcılığı (dakikada doğru kelime) ölçümü yapan tüketici ürünü yok.
2. **Ses/hece yöntemi + bitişik eğik yazıya tam uyum:** MEB ilk okuma yöntemi "ses temelli cümle yöntemi" ve harf sırası bellidir (e, l, a, t… ). Global ürünler İngilizce harf sırası ve alfabe yöntemiyle çalışır; yerli ürünler yöntemi biliyor ama teknolojisi zayıf. **Doğru yöntem + güçlü teknoloji kesişimi boş.**
3. **Ebeveyn için anlamlı ilerleme paneli:** Yerli uygulamalar "yıldız/rozet" veriyor ama "çocuğunuz 18 sesten 12'sini tanıyor, hece birleştirmede zorlanıyor, akıcılık 24 kelime/dk" gibi **tanısal, eyleme dönük rapor** vermiyor. Ello/Amira'nın güçlü yanı tam bu.
4. **Okul öncesi → 1. sınıf köprüsü:** 4–5 yaş "okula hazırlık" (ses farkındalığı, ön-okuryazarlık) ile 6–7 yaş "ilk okuma" arasını **tek üründe** kapsayan yerli çözüm zayıf. Anaokulları bu köprü için içerik arıyor.
5. **Güvenli, kapalı-içerik, reklamsız yerli ürün:** Yerli ücretsiz uygulamalar reklam yüklü; ebeveynler reklamdan ve "yanlışlıkla tıklama"dan rahatsız. TRT Çocuk reklamsız ama ders değil. Reklamsız + pedagojik + yerli boşta.
6. **Çevrimdışı + düşük cihaz gereksinimi:** Türkiye'de geniş kitlede orta segment Android, sınırlı veri. Ello çevrimiçi-bağımlı. Cihaz-üstü (on-device) ses tanıma ile çevrimdışı çalışan AI koç güçlü farklılaştırıcı.
7. **Disleksi / özel öğrenme güçlüğü erken sinyali:** Türkiye'de erken tarama zayıf; okuma güçlüğü çoğu kez 2–3. sınıfta fark ediliyor. Sesli okuma verisinden risk sinyali veren yerli araç yok (Amira bunu yapıyor).

### Konumlandırma önerisi

> **"Okuma Kâşifi — çocuğunuzu dinleyen Türkçe okuma öğretmeni."**
> 4–7 yaş, MEB ses temelli yöntemine birebir hizalı, çocuğun mikrofonla sesli okumasını dinleyip anında geri bildirim veren, ebeveyne haftalık tanısal rapor sunan, reklamsız ve çevrimdışı çalışabilen bir **AI okuma ajanı**.

- **Birincil segment:** İlk okumaya geçen 5–7 yaş çocukların ebeveynleri (özellikle 1. sınıf ilk 6 ay) + anaokulu son yıl (ses farkındalığı).
- **İkincil:** Anaokulu / ilkokul kurumları (B2B2C), özel eğitim / rehberlik.
- **Farklılaşmanın çekirdeği:** "dinleyen ve düzelten AI ajanı" + "gerçek ilerleme raporu" + "doğru Türkçe yöntem" üçlüsü. Rakiplerin hiçbirinde üçü birden yok.
- **Fiyat konumu:** Morpa'nın altında, tek seferlik yerli uygulamaların üstünde; aylık düşük abonelik + yıllık indirimli + kalıcı bedava çekirdek.

---

## 3. Türkiye'de Ödeme İsteği / Gücü, Fiyatlandırma, Kurum Satışı

### Ödeme isteği ve gücü

- **Eğitime harcama önceliği yüksek, ama dijital abonelik direnci de yüksek.** Türk ailesi özel ders / etüt / dershana / kaynak kitaba görece rahat harcar; aylık yenilenen uygulama aboneliğine daha temkinli yaklaşır. Morpa Kampüs fiyat artışı ve otomatik yenileme şikâyetleri (Şikayetvar'da yoğun) bunun kanıtı.
- **Fiyat çıpaları (2026 tahmini):**
  - Ücretsiz yerli uygulama + reklam: baskın beklenti.
  - Tek seferlik "tam sürüm aç": ~150–500 TL kabul edilebilir.
  - Aylık abonelik: ~99–249 TL/ay psikolojik olarak "değer" bandı; 300 TL üzeri direnç.
  - Yıllık abonelik: ~800–2.000 TL kabul edilebilir (Morpa'nın ~3.000–4.800 TL'si "pahalı" algılanıyor).
  - Kaynak kitap seti referansı: 1. sınıf yardımcı kaynak ~300–800 TL — uygulama bunun altında/eşinde konumlanmalı.
- **Enflasyon etkisi:** Ailenin döviz bazlı fiyatlamaya (9,99 USD/ay ≈ Ello) tahammülü düşük. Global ürünler bu yüzden Türkiye'de organik satın alınmıyor; yerel TL fiyat + yerel ödeme (havale, mobil ödeme, market kartı) kritik.
- **Ödeme yöntemi:** Kart penetrasyonu iyi ama iptal korkusu var → "istediğin zaman iptal, hatırlatma bildirimi" şeffaflığı dönüşümü artırır. BKM Express / mobil operatör faturasına yansıtma / Google Play bakiye kartları (marketlerde satılan) alt-orta segmentte işe yarar.

### Önerilen model

- **Freemium:** İlk 8–10 ses / ilk ünite kalıcı bedava (reklamsız). Değeri kanıtla, sonra öde.
- **Abonelik ana model:** Aylık ~149–199 TL, yıllık ~999–1.499 TL (2 ay bedava çıpası). Aile planı (2–3 çocuk) küçük ek ücret.
- **Tek seferlik "sezon/ünite paketi"** seçeneği: abonelik istemeyen için ~299–399 TL "1. sınıf tam programı" — Türk tüketicisinin "bir kere al bitsin" refleksine cevap.
- **Okul lisansı (B2B):** Öğrenci başı yıllık ~200–400 TL, sınıf/okul toplu; veliye ücretsiz ev erişimi paket içinde (dağıtım kanalı + tavsiye motoru).

### Kurum / okul satışı fırsatı

- **Özel anaokulları ve ilkokullar:** En hızlı B2B kanal. Türkiye'de ~çok sayıda özel anaokulu "dijital/İngilizce/teknoloji" ile pazarlama yapıyor; "AI destekli Türkçe okuma programı" farklılaştırıcı satış argümanı. Karar verici: kurucu/müdür; satış döngüsü 1–3 ay.
- **Kreş zincirleri ve franchise'lar:** Tek sözleşmeyle çok şube.
- **Belediye / il milli eğitim projeleri:** "Okuma seferberliği", dezavantajlı bölge projeleri, halk eğitim (yetişkin okuryazarlığı da mümkün). Kamu ihale/protokol döngüsü uzun ama hacim büyük.
- **Rehberlik ve araştırma merkezleri (RAM) / özel eğitim:** Okuma güçlüğü tarama aracı olarak niş ama yüksek değerli.
- **Yayınevleri:** 1. sınıf kaynak kitap yayıncılarıyla "kitabın dijital AI eşlikçisi" ortaklığı (QR ile kitaptan uygulamaya).
- **Operatör / banka / market sadakat:** Turkcell (e-okul/eğitim paketleri geçmişi), evcil eğitim paketleri, bankaların çocuk hesabı kampanyaları paketleme fırsatı.

---

## 4. Farklılaşma Önerileri (öncelik sırasına yakın)

1. **Dinleyen AI ajanı, Türkçe'ye özel:** Çocuk sesli okurken dinleyen, hatalı sesi/heceyi anında yakalayıp model telaffuz + ipucu veren bir karakter ("kâşif" temalı rehber). Türkçe'nin şeffaf ortografisi bu işi İngilizce'den daha güvenilir yapar — bunu teknik ve pazarlama argümanı olarak öne çıkar.
2. **MEB ses temelli yöntemine %100 hizalı ilerleme:** Harf/ses sırası, bitişik eğik yazı, ses→hece→kelime→cümle→okuma akıcılığı hattı. "Öğretmenin sınıfta anlattığının evde birebir devamı" konumu; öğretmen tavsiyesini hedefle ("Öğretmen Onaylı" rozeti gibi).
3. **Ebeveyne tanısal haftalık rapor:** Rozet değil, veri: tanınan sesler, hece birleştirme, akıcılık (kelime/dk), en çok karıştırılan sesler (b/d, f/v), önerilen 10 dakikalık ev etkinliği. Ebeveyn "paramın karşılığı" hissi = düşük churn.
4. **Reklamsız + çevrimdışı + hafif cihaz:** On-device ses tanıma ile internetsiz çalışma; 3–4 yıllık orta segment Android'de akıcı. "Veri harcamaz, reklam göstermez" mesajı Türk ebeveynde güçlü.
5. **Ses farkındalığı → okuma köprüsü (4–5 yaş modülü):** Kafiye, ilk ses, ses birleştirme oyunları; anaokulu-1. sınıf geçişini tek üründe kapsa. Anaokulu B2B için içerik.
6. **Erken okuma güçlüğü sinyali:** Sesli okuma verisinden "akıcılık yaşıtların altında / belirli ses hataları ısrarlı" uyarısı + "bir uzmana danışın" yönlendirmesi (tanı koymadan). Türkiye'de bu boşluk büyük ve duygusal değeri yüksek.
7. **Güvenli AI vaadi (kapalı içerik):** LLM'i serbest sohbet için değil, sınırlı ve denetlenmiş senaryolar için kullan (kelime açıklama, seviyeye uygun kısa hikâye üretimi, cesaretlendirme). "Çocuğunuz internetle/yabancı yapay zekâ ile konuşmuyor" mesajı — KVKK/gizlilik güveni satış argümanı.
8. **Yerel kültür ve dil:** Türk isimleri, yerel bağlam (simit, nazar boncuğu, bayram), Türkçe tekerleme ve ninni; sesli seslendirme profesyonel ve şivesiz. Global ürünlerin "çevrilmiş" hissine karşı otantiklik.
9. **(Bonus) Aile-birlikte modu:** Ebeveyn okuma-yazma seviyesi düşük hanelerde çocukla birlikte kullanılan basit mod + yetişkin okuryazarlığı yan kullanımı (halk eğitim B2B kapısı).

---

## 5. Riskler

### 5.1 İçerik güvenliği ve ebeveyn algısı
- **"Yapay zekâ + çocuk" tedirginliği:** Türk ebeveynin bir kısmı üretken AI'yı çocukla temasında riskli görüyor. Mitigasyon: LLM'i serbest sohbette kullanma; "kapalı, denetimli, çevrimdışı olabilen" konumu; şeffaf açıklama; pedagog/akademisyen onayı ve isim.
- **Ses kaydı / gizlilik:** Çocuk sesi işleme KVKK ve (yurt dışı yayında) COPPA/GDPR-K açısından hassas. Mitigasyon: on-device işleme, kayıt tutmama/kısa saklama, açık ebeveyn rızası, veri yurt içi barındırma, KVKK VERBİS uyumu, bağımsız denetim/rozet.
- **Halüsinasyon / yanlış öğretim:** LLM yanlış hece/telaffuz üretirse pedagojik zarar + itibar kaybı. Mitigasyon: üretimi şablon + kural + insan-denetimli kütüphaneyle sınırla; fonetik motoru deterministik tut.
- **Ekran süresi karşıtlığı:** "Bu yaşta ekran" eleştirisi. Mitigasyon: oturumları 10–15 dk ile sınırla, ebeveyn zamanlayıcısı, "ekransuz eşlik etkinliği" önerileri, uzman görüşüyle destekle.

### 5.2 Mağaza politikaları
- **Apple / Google çocuk uygulaması kuralları:** Kids Category / "Teacher Approved" gereksinimleri; çocuklara reklam ve üçüncü taraf takip yasağı; harici link/ödeme kısıtları; AI içerik için yeni politika hükümleri (üretken içeriğin denetimi, kullanıcı bildirimi). Mitigasyon: baştan Kids Category uyumlu mimari, SDK hijyeni, moderasyon ve şikâyet akışı.
- **Abonelik şeffaflığı:** Otomatik yenileme ve deneme→ücret akışı store reddi ve tüketici şikâyeti kaynağı (Morpa örneği). Mitigasyon: net fiyat ekranı, yenileme öncesi bildirim, kolay iptal.
- **AI özelliğinin store incelemesinde gecikme riski:** Üretken AI içeren çocuk uygulamaları daha sıkı inceleniyor. Zaman planına tampon koy.
- **Yaş derecelendirme / IARC:** Yanlış beyan risk; mikrofon izni gerekçesini net yaz.

### 5.3 MEB rekabeti / iş birliği
- **MEB kendi AI'sını çıkarabilir:** MEB dijital dönüşüm ve yapay zekâ gündeminde; EBA'ya AI okuma modülü eklenirse ücretsiz rakip oluşur. Mitigasyon: MEB'in yapmayacağı derinlik (ebeveyn deneyimi, tanısal rapor, oyunlaştırma, destek), ve MEB ile **tamamlayıcı** konum — "EBA'yı eve taşıyan yardımcı".
- **Bağımlılık riski:** Ürünü "MEB müfredatına uygun" diye konumlarken müfredat değişirse (harf sırası, yöntem tartışması periyodik gündeme geliyor) içerik güncelleme yükü. Mitigasyon: yöntem-agnostik içerik mimarisi, hızlı güncellenebilir ses/ünite yapısı.
- **İş birliği fırsatı ama yavaş:** MEB/il MEM protokolü büyük hacim ama uzun döngü, siyasi/bütçe riski, fiyat baskısı (neredeyse bedava beklentisi). B2B2C özel okul kanalını birincil, kamuyu opsiyonel tut.
- **"Resmî olmayan" algısı:** Veliler MEB dışı içeriğe "acaba yanlış mı öğretir" şüphesiyle bakabilir. Mitigasyon: tanınmış eğitim fakültesi / sınıf öğretmenliği akademisyenleriyle danışma kurulu, şeffaf metodoloji sayfası, öğretmen elçi programı.

### 5.4 Diğer
- **Çocuk sesi tanıma (ASR) teknik riski:** Türkçe çocuk sesi veri seti kıt; yanlış "hata" bildirimi çocuğu demotive eder ve ebeveyn güvenini yıkar. Mitigasyon: toleranslı eşikler, "emin değilsem cezalandırmam" tasarımı, kendi veri toplama döngüsü (rızalı), pilotta yoğun ölçüm.
- **Dağıtım / CAC:** Türkiye'de çocuk eğitim uygulamasında organik büyüme yavaş; okul kanalı ve öğretmen tavsiyesi en verimli. Ücretli sosyal reklam maliyeti dövizli.
- **Kopyalanma:** Yerli oyuncular (4M indirmeli Okuma Yazma Öğreniyorum) AI özelliği ekleyebilir. Zaman avantajı + veri döngüsü + kurum sözleşmeleri savunma hattı.

---

## Ek: Öne Çıkan Kaynaklar

- Amira Learning — AI reading tutor: https://amiralearning.com/amira-tutor
- Read with Ello (App Store): https://apps.apple.com/app/id1536720182 ; fiyat: https://www.educationalappstore.com/app/read-with-ello ; https://www.ello.com/digital-product-page
- Best AI Reading Tutors for Kids: https://luca.ai/blog/best-ai-reading-tutors ; https://spellingjoy.com/best-apps/best-ai-reading-tutors-for-kids
- Duolingo ABC: https://apps.apple.com/us/app/learn-to-read-duolingo-abc/id1440502568 ; https://www.commonsense.org/education/reviews/duolingo-abc-learn-to-read
- Lingokids fiyat: https://research.com/software/reviews/lingokids-review ; https://help.lingokids.com/hc/en-us/articles/115005120505-Lingokids-Plus-Pricing-Currency
- HOMER (Begin) fiyat: https://myelearningworld.com/homer-pricing/ ; https://www.beginlearning.com/homer/pdp
- Reading Eggs & ABCmouse fiyat: https://myelearningworld.com/reading-eggs-pricing/ ; https://brighterly.com/blog/abcmouse-pricing/
- Morpa Kampüs abonelik: https://www.morpakampus.com/abonelik ; fiyat şikâyetleri: https://www.sikayetvar.com/morpa-kampus/uyelik-ucreti ; https://www.mebpersonel.org/genel/morpa-kampus-yillik-abonelik-ucretinde-fahis-fiyat-artisi-h257795.html
- Okuma Yazma Öğreniyorum (Google Play): https://play.google.com/store/apps/details?id=com.ny.okumayazmaogreniyorum ; https://stemegitimciler.org/haberler/turkiyenin-en-cok-indirmeye-sahip-okuma-yazma-ogrenme-uygulamasi-okuma-yazma-ogreniyorum
- Okuyorum İlk Okuma Yazma: https://play.google.com/store/apps/details?id=com.okuyorum
- Okumatik Okuma Yazma: https://play.google.com/store/apps/details?id=com.okumayazma
- e-Okul VBS (ölçek): https://bigm.meb.gov.tr/www/e-okul-vbs-egitimde-dijital-donusum/icerik/100144
- LLM/çocuk okuryazarlığı araştırma: KidSpeak https://arxiv.org/abs/2512.05994 ; Conversational AI in children's home literacy learning https://www.sciencedirect.com/science/article/pii/S2666920X2600010X ; kontrollü zorluk/güvenlikte hikâye üretimi https://arxiv.org/pdf/2605.13709
- Türkçe eğitici uygulama listeleri: https://www.oggusto.com/lifestyle/cocuk/cocuklar-icin-egitici-mobil-uygulamalar
- Okula Dönüş Ebeveyn Anketi 2024–2025: https://okuladonus.org/documents/od-ebeveyn-anketi-raporu-kasim-2024.pdf
