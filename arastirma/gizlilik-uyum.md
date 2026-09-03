# Okuma Kâşifi — Gizlilik ve Mevzuat Uyum Planı

**Hazırlayan:** Veri Gizliliği Uzmanı (DPO) rolünde danışmanlık
**Tarih:** 3 Eylül 2026
**Kapsam:** 8 yaş altı Türk çocuklara okuma-yazma öğreten web/mobil uygulama
**Sürüm:** 1.0 (MVP öncesi)

> **Uyarı:** Bu belge operasyonel gizlilik uyum danışmanlığıdır; bağlayıcı hukuki görüş değildir. Yayına çıkmadan önce Türkiye'de KVKK, ABD'de COPPA ve AB'de GDPR konusunda uzman bir avukattan sözleşme metinleri ve nihai risk değerlendirmesi için onay alınmalıdır. Özellikle "reşit olmayanın rızası" ve "veli rızasının doğrulanması" konularında Türkiye'de kesin bir ikincil mevzuat/rehber boşluğu vardır; bu belgedeki yaklaşım savunulabilir en iyi uygulamayı esas alır.

---

## 0. Temel Tasarım İlkesi: "Veri Toplamadan Çalış"

En güçlü gizlilik kontrolü, hiç toplamadığın veridir. Bu uygulama için stratejik hedef:

**Hesapsız, cihaz-öncelikli (local-first), sıfır kişisel veri toplayan bir MVP.**

- Çocuktan veya veliden **isim, e-posta, telefon, doğum tarihi, konum, fotoğraf toplanmaz.**
- İlerleme (hangi harf öğrenildi, kaç yıldız kazanıldı) **yalnızca cihazda** saklanır.
- Ses işleme **cihazda** yapılır; bulut zorunlu değilse ses hiç sunucuya gitmez.
- Reklam yok, üçüncü taraf analiz SDK'sı yok, çocuk profili çıkarma yok.
- Bu tasarımla uygulama COPPA, GDPR madde 8, Play Families, App Store Kids şartlarının büyük kısmını **tasarımı gereği** karşılar ve VERBİS kaydı ile ağır veri sorumlusu yükümlülüklerinin çoğundan kaçınır.

Bu belgenin geri kalanı bu ilkeyi hayata geçiren kontrolleri ve toplama zorunlu olduğunda uygulanacak asgari güvenceleri tanımlar.

---

## 1. KVKK (6698 Sayılı Kanun) — Türkiye

### 1.1 Çocuk kişisel verisi işleme

KVKK'da "çocuk verisi" için ayrı bir rejim (GDPR madde 8 gibi yaş eşiği) **açıkça düzenlenmemiştir.** Ancak:

- Türk Medeni Kanunu'na göre 18 yaş altı **küçük**tür; ayırt etme gücüne sahip küçükler bile kişisel verileriyle ilgili hukuki işlemlerde **yasal temsilcisinin (veli/vasi) izni/onayı** gerekir. 8 yaş altı çocuğun rıza verme ehliyeti yoktur.
- Dolayısıyla çocuğun kişisel verisi işlenecekse **açık rıza velisinden alınır.**
- Kişisel Verileri Koruma Kurulu, çocuklara yönelik hizmetlerde **veri minimizasyonu ve üstün yarar** ilkesini vurgular. Kurul kararlarında ve rehberlerinde çocuk verisinin "özel önem gerektiren" veri gibi ele alınması beklenir.
- Pratik sonuç: 8 yaş altı için **profil çıkarma, davranışsal reklam, çocuğun sesinin/görüntüsünün pazarlama amaçlı kullanımı yapılmaz.**

### 1.2 Veli açık rızası

Açık rıza KVKK'da: **belirli bir konuya ilişkin, bilgilendirmeye dayanan ve özgür iradeyle açıklanan** onaydır.

- Rıza metni çocuğa değil, **veliye** yöneliktir ve sade Türkçe olmalıdır.
- Her işleme amacı için **ayrı ayrı** rıza (granüler): örn. (a) bulut senkronizasyonu, (b) ses kaydının geçici işlenmesi, (c) e-posta ile ilerleme raporu — hepsi ayrı kutucuk, hiçbiri önceden işaretli değil.
- Hizmetin kullanımı rızaya **bağlanamaz** (rıza özgür olmalı). Yani "rıza vermezsen uygulama çalışmaz" kurgusu, o veri hizmet için gerçekten zorunlu değilse hukuka aykırıdır. Çekirdek okuma-yazma işlevi rızasız çalışmalıdır.
- Rıza **geri alınabilir** olmalı; geri alındığında ilgili veri silinir. Bu yüzden mümkün olduğunca **rıza yerine başka hukuki sebep** (sözleşmenin ifası, meşru menfaat) değerlendirilmeli; ancak çocuk verisinde meşru menfaat dengesi çoğu zaman çocuk lehine bozulur, bu yüzden en temiz yol **hiç toplamamak.**

### 1.3 Veli rızasının doğrulanması

KVKK'da doğrulama yöntemi **belirtilmemiştir**; COPPA'daki "verifiable parental consent" standardına benzer bir çerçeve uygulanması önerilir. Risk seviyesine göre kademeli yaklaşım:

| İşleme riski | Önerilen doğrulama |
|---|---|
| Hiç kişisel veri yok (MVP hedefi) | Doğrulama gerekmez — sadece ebeveyn kapısı yeterli |
| Sadece cihazda, düşük riskli ayar değişikliği | Ebeveyn kapısı (matematik sorusu / basılı tut) + bilgilendirme |
| E-posta ile rapor gönderme | Veliye doğrulama e-postası (çift opt-in): linke tıklama + onay |
| Bulut senkron / ses bulutta işleme | Çift opt-in e-posta + rıza metninin ayrı onayı; istenirse küçük tutarlı kredi kartı doğrulaması yerine e-posta+SMS |
| Ödeme / abonelik | Zaten App Store / Play ödeme akışı ebeveyn cihazında; ayrıca doğrulama gerekmez |

MVP'de hedef: **ilk kademe** (doğrulama gerekmez, çünkü veri yok).

### 1.4 Aydınlatma yükümlülüğü (KVKK md. 10)

Veri işlenmese bile, eğer uygulama herhangi bir teknik veri (çökme kaydı, IP, cihaz tanımlayıcı) alıyorsa aydınlatma metni gerekir. Aydınlatma metninde bulunması zorunlu unsurlar:

1. Veri sorumlusunun kimliği (şirket unvanı, adres, varsa temsilci)
2. Kişisel verilerin hangi amaçla işleneceği
3. İşlenen verilerin kimlere ve hangi amaçla aktarılabileceği (yurt dışı dâhil)
4. Veri toplamanın yöntemi ve hukuki sebebi
5. KVKK md. 11'deki ilgili kişi hakları (bilgi talep etme, düzeltme, silme, itiraz, Kurul'a şikâyet)

Ayrı bir **"Çocuklara ve Velilere Yönelik Sadeleştirilmiş Bilgilendirme"** metni de hazırlanır (bkz. Bölüm 8).

### 1.5 Veri sorumlusunun yükümlülükleri

- **Veri güvenliği tedbirleri** (KVKK md. 12): şifreleme, erişim kontrolü, log tutma, sızma testi, personel gizlilik taahhüdü.
- **Saklama ve İmha Politikası** + kişisel veri işleme envanteri (VERBİS'e kayıt zorunluysa envanter de zorunlu).
- **İlgili kişi başvurularını** 30 gün içinde yanıtlama; başvuru kanalı (KEP, e-posta, sistem üzerinden form).
- **Veri ihlali bildirimi:** ihlali öğrenmesinden itibaren **en kısa sürede ve 72 saat içinde** Kurul'a; etkilenen ilgili kişilere de makul sürede. (KVKK'nın 72 saat kuralı Kurul'un 2019/10 kararına dayanır.)
- **Yurt dışı aktarım:** 2024 değişikliğiyle KVKK md. 9 artık **standart sözleşme, bağlayıcı şirket kuralları, taahhütname veya yeterlilik kararı** mekanizmalarını içeriyor. Bulut sağlayıcı yurt dışındaysa (AWS, GCP, Azure eu/us bölgeleri) uygun aktarım mekanizması + Kurul'a standart sözleşme bildirimi (imzadan itibaren 5 iş günü) gerekir.

### 1.6 VERBİS (Veri Sorumluları Sicili)

- Yıllık çalışan sayısı 50'den az **ve** yıllık mali bilanço toplamı 25 milyon TL'den az olan veri sorumluları, **ana faaliyeti özel nitelikli kişisel veri işleme olmadıkça** VERBİS'ten muaftır.
- Çocuk verisini "ana faaliyet olarak yoğun biçimde" işlemek, Kurul tarafından kayıt yükümlülüğü doğuran bir durum olarak değerlendirilebilir. **Kişisel veri hiç toplanmazsa VERBİS yükümlülüğü doğmaz.**
- Karar: MVP'de kişisel veri toplama → VERBİS kaydı gerekmez. İleride bulut senkron/e-posta özelliği eklenirse **kayıt yükümlülüğü yeniden değerlendirilir** ve muhtemelen kayıt yapılır.

### 1.7 Türkiye'de reşit olmayanın verisi — özet yaklaşım

- 8 yaş altı çocuk **hiçbir koşulda kendi başına rıza veremez.**
- Tüm rızalar veliden, granüler, geri alınabilir, hizmet şartı olmadan.
- Varsayılan: **veri toplama.** Toplama zorunlu hâle gelirse üstün yarar testi + DPIA benzeri değerlendirme (KVKK'da zorunlu değil ama önerilir) yapılır.
- Çocuğa davranışsal reklam, profilleme, otomatik karar **yapılmaz.**

---

## 2. Uluslararası Çerçeveler (Kısa)

### 2.1 COPPA (ABD) — ABD'den erişim olursa

- 13 yaş altı çocuklardan veri toplayan, ABD'deki çocuklara yönelik hizmetler kapsanır. Uygulama Türkiye merkezli olsa bile **ABD'den indiriliyorsa ve ABD'li çocuklara yönelikse** COPPA uygulanabilir.
- Gereklilikler: **doğrulanabilir ebeveyn rızası (VPC)** toplamadan önce; net gizlilik bildirimi; veri minimizasyonu; makul güvenlik; üçüncü taraflara ifşa kısıtı.
- 2025 güncellemesi (FTC COPPA Rule değişikliği): davranışsal reklam için ayrı opt-in ebeveyn rızası, veri saklama politikası yazılı olmalı, "sürekli saklama yasağı".
- **En basit COPPA uyumu = hiç kişisel veri toplamamak** (o zaman VPC gerekmez). Cihazda kalan, kişiyi tanımlamayan ilerleme verisi COPPA "personal information" tanımına girmez.
- Coğrafi olarak ABD trafiğini engellemek bir seçenek değil (App Store/Play global); bu yüzden tasarım COPPA-uyumlu olmalı.

### 2.2 GDPR + Madde 8 "çocuğun rızası" (AB/AEA)

- AB'den bir çocuk uygulamayı kullanırsa GDPR uygulanır (md. 3 — hedefleme/izleme).
- **Madde 8:** bilgi toplumu hizmetlerinde çocuğun rızası için yaş eşiği 16'dır; üye devletler 13'e kadar indirebilir. 8 yaş her hâlükârda eşiğin altında → **ebeveyn sorumluluğunu taşıyan kişinin rızası/izni gerekir** ve platform **makul çaba** ile bunu doğrulamalıdır.
- Hukuki dayanak olarak rıza kırılgandır; mümkünse **sözleşmenin ifası** veya hiç veri toplamama tercih edilir.
- Çocuğa yönelik bilgilendirme **çocuğun anlayacağı, açık ve sade dille** yapılmalı (md. 12).
- Yüksek riskli işleme (çocukların büyük ölçekli izlenmesi, profilleme) → **DPIA zorunlu** (md. 35).

### 2.3 İngiltere — Age Appropriate Design Code (Children's Code / ICO)

15 standardın en kritikleri bu uygulama için:

- **Çocuğun üstün yararı** tasarımın merkezinde.
- **Varsayılan ayarlar en yüksek gizlilik** (high privacy by default): konum kapalı, profilleme kapalı, veri paylaşımı kapalı.
- **Veri minimizasyonu:** yalnızca çocuğun kullandığı özellik için gereken veri.
- **Nudge (yönlendirici) teknik kullanma:** çocuğu daha fazla veri vermeye ya da gizliliği düşürmeye iten arayüz deseni yasak.
- **Profilleme varsayılan kapalı.**
- **Üçüncü taraflara satış/paylaşım yok.**
- **Yaşa uygun şeffaf bildirimler**, oyunlaştırılmış/görsel açıklamalar.
- Reklam varsa çocuğa davranışsal reklam **yapılmaz.**

Bu Code'a uymak, hem AB hem Türkiye açısından "en iyi uygulama" savunması sağlar.

---

## 3. Google Play — Çocuk Uygulaması Politikaları

### 3.1 Families / "Designed for Families" programı

- Uygulama Play Console'da **hedef kitle yaş grubu** seçiminde "yalnızca çocuklar" veya "çocuklar ve büyükler" seçilirse **Play Families Policy** devreye girer.
- Families programına dâhil uygulamalar ek gereklilikler: içerik derecelendirmesi, gizlilik politikası linki (hem Console'da hem uygulama içinde), COPPA/GDPR-K uyum beyanı.

### 3.2 Reklam ve SDK kısıtları

- Çocuklara yönelik uygulamalarda **yalnızca Google'ın "self-certified ads SDKs" listesindeki reklam ağları** kullanılabilir.
- **Kişiselleştirilmiş/davranışsal reklam yasak** — sadece bağlamsal (contextual) reklam.
- **Reklam formatı kısıtları:** yanıltıcı reklam, tüm ekranı kaplayan beklenmedik geçiş reklamı, oyun içi para karşılığı izlenen ödüllü reklamda uygunsuz içerik yasak.
- **AAID (reklam kimliği) toplanamaz** çocuklardan; çocuk kullanıcılar için persistent identifier reklam amaçlı kullanılamaz.
- **Öneri: MVP'de hiç reklam yok.** Gelir modeli tek seferlik satın alma veya ebeveyn kapısı arkasında abonelik.
- Kullanılan **her SDK** (analytics, crash reporting dâhil) Families politikasına uygun olmalı. Firebase Analytics çocuk modunda sınırlı kullanılabilir ama **veri güvenliği formunda beyan** gerekir. Tercih: Crashlytics dahil hiçbir üçüncü taraf SDK'sı yok, ya da sadece cihazda kalan/anonim çökme kaydı.

### 3.3 Veri Güvenliği Formu (Data Safety)

- Play Console'da zorunlu. Toplanan/paylaşılan tüm veri türleri, amaçları, şifreleme durumu, silme talebi mekanizması beyan edilir.
- **Yanlış beyan = uygulama kaldırma sebebi.** Form, uygulamanın gerçek davranışıyla (SDK'ların topladığı dâhil) birebir tutmalı.
- Hedef: formda "Bu uygulama veri toplamıyor / paylaşmıyor" diyebilmek. Bunun için ağ trafiği denetlenmeli (hangi SDK ne gönderiyor).
- Ayrıca **uygulama içinden erişilebilir veri silme yolu** (hesap yoksa: "cihazdaki tüm verileri sıfırla" butonu) gösterilmeli.

### 3.4 Diğer Play gereklilikleri

- Gizlilik politikası URL'si Console + uygulama içi.
- Uygulama içi ödeme yalnızca ebeveyn kapısı arkasında.
- Hassas izinler (mikrofon) için çalışma zamanı izni + net gerekçe. Mikrofon sadece kullanıldığı anda.

---

## 4. Apple App Store — Kids Category ve App Review

### 4.1 Kids Category kuralları

- Kids Category'ye girmek **opsiyoneldir** ama girilirse yaş bandı (5 ve altı / 6-8 / 9-11) seçilir. "5 ve altı" veya "6-8" bandı bu uygulamaya uygun.
- Kids Category uygulamaları **üçüncü taraf analiz ve üçüncü taraf reklam kullanamaz** (App Review Guideline 1.3 ve 5.1.4).
- Kids Category'de **harici link, satın alma, diğer uygulamalara yönlendirme** yalnızca ebeveyn kapısı arkasında.

### 4.2 Guideline 1.3 — Kids Category

> Çocuk uygulamaları davranışsal reklam içeremez; analitik ve reklam için üçüncü taraf hizmetleri yalnızca çocuk verisi toplamadığı doğrulanabiliyorsa kullanılabilir. Reklam çocuğa uygun olmalı.

- Uygulama dışına çıkan tüm davranışlar (link, sosyal ağ, ödeme) ebeveyn kapısı arkasında olmalı.

### 4.3 Guideline 5.1.4 — Kids (Data Collection and Storage)

- Çocuklardan **kişisel veri veya cihaz bilgisi kişiselleştirilmiş reklam amacıyla iletilemez.**
- **Yasal ebeveyn izni olmadan** çocuktan kişisel veri toplanamaz (COPPA, GDPR-K, ilgili yerel yasa referansı).
- Uygun bir gizlilik politikası şart.

### 4.4 Üçüncü taraf analiz/reklam yasağı

- Kids Category'de **hiç** üçüncü taraf reklam SDK'sı yok; üçüncü taraf analiz yalnızca "çocuk verisi toplamıyor" garantisi verilebiliyorsa (pratikte çoğu SDK bunu karşılamaz).
- **Öneri:** sıfır üçüncü taraf SDK. Gerekirse Apple'ın kendi (on-device) araçları.

### 4.5 "Parental Gate" (ebeveyn kapısı) zorunluluğu

Apple, Kids Category uygulamalarında şu eylemlerden önce ebeveyn kapısı ister:

- Uygulama dışı link açma
- Uygulama içi satın alma / satın alma sayfasına gitme
- Sosyal ağ paylaşımı
- Çocuğa yönelik olmayan içeriğe erişim
- Kişisel bilgi girme alanları

Kapı, **çocuğun kolayca geçemeyeceği** bir görev olmalı (bkz. Bölüm 7).

---

## 5. Ses Kaydı İşleme

Uygulama okuma-yazma öğrettiği için çocuğun sesli okumasını **telaffuz değerlendirmesi** amacıyla dinleyecek. Bu en hassas veri akışı.

### 5.1 Neden cihazda (on-device) işleme tercih edilir

- Çocuğun sesi **biyometrik/özel nitelikli veri riski** taşır; ses kaydı kişiyi tanımlayabilir ve duygusal/gelişimsel bilgi sızdırabilir.
- Cihazda işlenirse: ses **hiç sunucuya gitmez**, ihlal yüzeyi yok, yurt dışı aktarım sorunu yok, VERBİS/COPPA/GDPR açısından "toplanan veri" oluşmaz.
- App Store/Play açısından "veri toplamıyoruz" beyanı yapılabilir.
- Modern cihazlarda platform konuşma tanıma API'leri (iOS `Speech` / `SFSpeechRecognizer` on-device modu, Android `SpeechRecognizer` / on-device modeller) veya küçük gömülü modeller (Whisper tiny, Vosk) telaffuz kontrolü için yeterlidir.
- **iOS notu:** `SFSpeechRecognizer`'da `requiresOnDeviceRecognition = true` ayarlanmalı; aksi halde ses Apple sunucularına gider ve bu "üçüncü tarafa aktarım" sayılır. Kids Category'de sunucu tabanlı tanıma **kullanılmamalı.**
- **Android notu:** `RecognizerIntent`'e `EXTRA_PREFER_OFFLINE = true`; offline dil paketi indirilmeli.

### 5.2 Ses buluta gönderilmek zorundaysa ne yapılmalı

Eğer cihaz-üstü doğruluk yetersizse ve bulut ASR şartsa:

1. **Veliden ayrı, açık, granüler rıza** ("Çocuğumun sesli okuması, telaffuz değerlendirmesi için geçici olarak sunucularımızda işlensin"). Bu rıza olmadan özellik kapalı; çekirdek uygulama çalışmaya devam eder.
2. **Anında işle, anında sil:** ses parçası sunucuya gider → metne/skora çevrilir → **ham ses saniyeler içinde kalıcı olarak silinir.** Diskte kalıcı depolama yok, yalnızca RAM/geçici işleme.
3. **Saklama süresi = 0 kalıcı.** En fazla işleme süresince (birkaç saniye) tutulur. Loglara ham ses veya çözümlenmiş cümle yazılmaz.
4. **Aktarım ve durağan şifreleme:** TLS 1.2+ taşımada; işleme sırasında bellekte; hiçbir yerde diske yazılmaz. Yazılırsa AES-256 + kısa TTL.
5. **Kimliksizleştirme:** ses paketiyle birlikte isim, hesap, kalıcı cihaz kimliği gönderilmez; yalnızca geçici oturum jetonu.
6. **Alt yüklenici (ASR sağlayıcısı):** KVKK md. 9 uyumlu standart sözleşme + veri işleme sözleşmesi; sağlayıcının "modeli eğitmek için kullanmama" taahhüdü; tercihen AB veya Türkiye bölgesi.
7. **Model eğitimi için kullanım YASAK** (sözleşmeye yazılır).
8. **DPIA yapılır** (yüksek riskli işleme: çocuk + ses + bulut).
9. Veri güvenliği formu / App Privacy'de "Audio Data — collected, not linked to identity, not used for tracking, deleted immediately" doğru beyan edilir.

### 5.3 Karar

**MVP: %100 cihazda ses işleme. Bulut ASR yok.** Bu, hem en güvenli hem en hızlı uyum yolu. Bulut ancak v2'de, ayrı rıza + DPIA ile değerlendirilir.

---

## 6. Veri Minimizasyonu Mimarisi

### 6.1 Hesapsız / yerel-öncelikli tasarım

- **Kayıt yok, giriş yok, e-posta/telefon yok.** Uygulama açılır açılmaz çocuk oynamaya başlar.
- Çoklu çocuk profili gerekiyorsa: cihazda yerel "avatar" seçimi (isim yerine hayvan/renk), kişisel veri değil.
- Sunucuyla zorunlu iletişim yok. İçerik güncellemeleri statik CDN'den, kullanıcıya bağlı olmayan istekle.

### 6.2 E-posta/telefon toplamadan çalışma

- İlerleme raporu isteyen veli için **opsiyonel** özellik: veli e-postasını girer → çift opt-in → rapor gönderilir. Girmezse hiçbir şey değişmez.
- E-posta girilirse: yalnızca rapor gönderimi için kullanılır, pazarlama için değil (ayrı rıza olmadan), üçüncü tarafla paylaşılmaz, veli her an sildirebilir.
- Destek talebi: uygulama içi form yerine, velinin kendi e-posta istemcisinden yazmasına yönlendirme (mailto), böylece e-posta veritabanı oluşmaz.

### 6.3 İlerlemeyi cihazda tutma

- Tüm ilerleme: `localStorage` / IndexedDB (web), `UserDefaults` / Room / SQLite (mobil) — cihazda.
- İçerik anonim: "harf grubu 3 tamamlandı", tarih-saat damgası minimum.
- **Yedekleme:** cihaz yedeğine (iCloud/Google backup) dâhil olabilir ama bu Apple/Google'ın kullanıcı yedeği, uygulama sunucusu değil — beyanda "device backup" olarak geçer.
- Bulut senkron istenirse (iki cihaz arası): **ayrı rıza**, uçtan uca şifreleme, kişiyle ilişkilendirilmeyen rastgele senkron anahtarı, minimum veri.
- **"Tüm verileri sıfırla" butonu** ayarlarda, ebeveyn kapısı arkasında — tek dokunuşla cihazdaki her şeyi siler.

### 6.4 Teknik/telemetri verisi

- Çökme kaydı: mümkünse toplama; toplanacaksa cihazda kalan veya tam anonim (kullanıcı kimliği, IP maskeli).
- Analytics: **yok.** Ürün kararları için gerekirse yalnızca anonim, toplu (aggregate), cihazda hesaplanıp opsiyonel gönderilen sayaçlar (örn. "X ekranı görüldü") — kişisel veri değil, ayrı DPIA notu.
- IP adresi: sunucu loglarında kaçınılmazsa kısa süre (örn. 7 gün) sonra silme veya anonimleştirme; aydınlatma metninde belirt.

---

## 7. Ebeveyn Kapısı (Parental Gate) Tasarım Gereksinimleri

### 7.1 Ne zaman gösterilir

- Uygulama dışı bağlantı açmadan önce
- Satın alma / abonelik sayfasına girmeden önce
- Ayarlar / gizlilik ayarları ekranına girmeden önce
- Veli e-postası girme ekranından önce
- "Tüm verileri sıfırla" işleminden önce
- Sosyal paylaşım (varsa) öncesi
- Harici gizlilik politikası / şirket sitesi linkleri öncesi

### 7.2 Tasarım kuralları

- **Çocuğun rastgele geçemeyeceği** bir görev olmalı. Kabul edilenler:
  - İki basamaklı çarpma/toplama sorusu ("7 × 4 = ?") serbest metin girişiyle
  - "Aşağıdaki üç rakamı sırayla yaz: 5 - 2 - 9"
  - Belirli bir noktayı **belirli saniye basılı tutma** + aynı anda kaydırma
  - Yazı ile yazılmış sayıyı rakama çevirme ("kırk iki")
- **Kabul edilmeyen:** tek dokunuşla "Ben yetişkinim" butonu, basit "Evet/Hayır", tek rakam, şekil eşleştirme.
- Doğru cevap her seferinde **farklı** olmalı (sabit cevap ezberlenmez).
- Başarısız denemede kapı kapanır, tekrar dener; kilitlenme/ceza yok ama art arda deneme sınırlanır.
- Kapı ekranı **reklam veya üçüncü taraf içerik içermez.**
- Erişilebilirlik: ekran okuyucu ile çalışmalı; yalnız görsele bağlı olmamalı.
- Kapı geçildikten sonra **kısa süre** (örn. o oturumda ya da 1-2 dk) açık kalabilir; kalıcı "hatırlama" olmamalı.

---

## 8. Gerekli Yasal Belgeler Listesi

| # | Belge | Amaç | Dil / Kitle | Nerede yayınlanır |
|---|---|---|---|---|
| 1 | **Gizlilik Politikası (Privacy Policy)** | GDPR/COPPA/App Store/Play zorunlu; tüm veri işleme, saklama, silme, haklar, iletişim | Sade Türkçe + İngilizce | Web (herkese açık URL), Play Console, App Store Connect, uygulama içi Ayarlar |
| 2 | **KVKK Aydınlatma Metni** | KVKK md. 10 — veri sorumlusu kimliği, amaç, hukuki sebep, aktarım, haklar | Türkçe | Uygulama içi + web |
| 3 | **Açık Rıza Metni (Veli)** | Rıza gereken her işleme için granüler onay (bulut senkron, ses bulut işleme, e-posta rapor, varsa pazarlama) | Türkçe, veliye hitap | Uygulama içi, ilgili özelliği açarken |
| 4 | **Kullanım Şartları (Terms of Service / EULA)** | Sözleşmesel çerçeve, sorumluluk sınırı, kabul edilebilir kullanım, fikri mülkiyet, ödeme/iade | Türkçe + İngilizce | Web + uygulama içi + mağaza |
| 5 | **Çocuklara ve Velilere Yönelik Sadeleştirilmiş Bilgilendirme** | GDPR md. 12 / Children's Code — yaşa uygun, görsel, kısa "hangi bilgini kullanıyoruz" açıklaması | Çok sade Türkçe, ikonlu | Uygulama içi ilk açılış + Ayarlar |
| 6 | **Çerez Politikası** (web bileşeni varsa) | Web sitesi/uygulama web görünümü çerezleri; zorunlu olmayan çerez varsayılan kapalı | Türkçe + İngilizce | Web |
| 7 | **Veri Saklama ve İmha Politikası** (iç belge) | KVKK — hangi veri ne kadar tutulur, nasıl silinir; COPPA yazılı saklama politikası şartı | Türkçe (iç) | Şirket içi; özeti gizlilik politikasında |
| 8 | **Kişisel Veri İşleme Envanteri** (iç belge) | VERBİS ve hesap verebilirlik; işleme faaliyetleri kaydı | Türkçe (iç) | Şirket içi |
| 9 | **Veri İşleme Sözleşmeleri (DPA) + Standart Sözleşmeler** | Her alt yüklenici (hosting, ASR, e-posta gönderimi, çökme kaydı) ile KVKK md. 9 / GDPR md. 28 | TR/EN | Şirket içi, tedarikçi dosyası |
| 10 | **Veri İhlali Müdahale Prosedürü** (iç belge) | 72 saat Kurul bildirimi, veli bildirimi, kanıt saklama akışı | Türkçe (iç) | Şirket içi |
| 11 | **DPIA / Etki Değerlendirmesi** (bulut ses işleme veya senkron eklenirse) | Yüksek riskli işleme öncesi | Türkçe (iç) | Şirket içi |
| 12 | **Play Data Safety formu + Apple App Privacy "nutrition label"** | Mağaza beyanları | EN | Console / App Store Connect |

---

## 9. MVP İçin Uygulanabilir Kontrol Listesi (Sırayla)

### Aşama A — Mimari ve karar (kod yazmadan önce)
1. [ ] "Sıfır kişisel veri toplama" kararını yazılı ilke olarak sabitle; tüm ekip bilsin.
2. [ ] Özellik listesini gözden geçir: her özellik için "bu veriyi gerçekten toplamak zorunda mıyım?" sorusunu geç.
3. [ ] Ses işlemenin **%100 cihazda** yapılacağını teknik olarak doğrula (iOS on-device Speech, Android offline recognizer veya gömülü model POC'u).
4. [ ] Hedef yaş bandını belirle (App Store: "6-8" veya "5 ve altı"; Play: "yalnızca çocuklar").
5. [ ] Gelir modelini seç: tek seferlik satın alma veya ebeveyn kapısı arkası abonelik. **Reklam yok** kararını sabitle.
6. [ ] Üçüncü taraf SDK envanteri çıkar → analytics/reklam/attribution SDK'larını **sil**. Kalan her SDK için Families/Kids uyumunu doğrula.

### Aşama B — Geliştirme sırasında
7. [ ] İlerlemeyi yalnızca cihazda sakla (IndexedDB / UserDefaults / Room). Sunucuya kullanıcıya bağlı istek gönderme.
8. [ ] Ebeveyn kapısı bileşenini yap (dinamik cevaplı matematik sorusu + basılı-tut varyantı, erişilebilir).
9. [ ] Mikrofon iznini yalnızca ilk ses aktivitesinde, net gerekçe metniyle iste. İzin reddedilse de uygulama çalışsın (klavye/dokunma moduna düş).
10. [ ] "Tüm verileri sıfırla" butonunu Ayarlar'a ekle (ebeveyn kapısı arkasında).
11. [ ] Opsiyonel e-posta raporu özelliği: çift opt-in akışı, ayrı rıza kutusu, "istemezseniz boş bırakın" — çekirdek işlev bundan bağımsız.
12. [ ] Yönlendirici (nudge) desen denetimi: çocuğu daha fazla veri/izin vermeye iten UI yok; varsayılanlar en yüksek gizlilik.
13. [ ] Sunucu logları: IP toplanıyorsa maskeleme veya ≤7 gün silme job'u kur.
14. [ ] Ağ trafiği denetimi (Charles/mitmproxy): uygulamanın **hiçbir kişisel veri göndermediğini** kanıtla; ekran görüntüsü/kayıt sakla.

### Aşama C — Belgeler
15. [ ] Gizlilik Politikası yaz (TR + EN) — herkese açık URL'de yayınla.
16. [ ] KVKK Aydınlatma Metni yaz.
17. [ ] Kullanım Şartları / EULA yaz.
18. [ ] Çocuk/veli sadeleştirilmiş bilgilendirme ekranını tasarla (ikonlu, ilk açılışta).
19. [ ] Açık rıza metinleri (yalnızca opsiyonel özellikler için) yaz.
20. [ ] İç belgeler: Saklama-İmha Politikası, İşleme Envanteri, İhlal Müdahale Prosedürü.
21. [ ] Her tedarikçiyle (hosting, e-posta gönderimi) DPA + KVKK md. 9 standart sözleşmesi imzala; Kurul'a 5 iş günü içinde bildir.
22. [ ] **Avukat onayı:** tüm metinler + "veli rızası doğrulama" yaklaşımı + COPPA/GDPR-K risk notu için uzman gözden geçirmesi.

### Aşama D — Mağaza gönderimi
23. [ ] Play: hedef kitle & içerik bölümünü doldur, Data Safety formunu **"veri toplanmıyor / paylaşılmıyor"** olarak (trafik denetimiyle tutarlı) doldur, gizlilik politikası URL'si gir.
24. [ ] Play: Families politikası self-certification anketini doldur.
25. [ ] Apple: Kids Category başvurusu, yaş bandı seç, App Privacy "nutrition label" doldur (ideali: "Data Not Collected").
26. [ ] Apple: ebeveyn kapısının tüm dış link/satın alma noktalarında olduğunu doğrula (Review 1.3 / 5.1.4).
27. [ ] İçerik derecelendirme anketlerini doldur (IARC / Apple).

### Aşama E — Yayın sonrası / süreklilik
28. [ ] VERBİS: kişisel veri toplanmadığı için kayıt yapma; kararı ve gerekçesini dosyala. Yeni özellik eklendiğinde yeniden değerlendir.
29. [ ] Her yeni SDK / özellik / sürüm öncesi mini gizlilik gözden geçirmesi (checklist tekrar).
30. [ ] Yıllık: politikaları güncel mevzuata karşı gözden geçir (KVKK ikincil düzenlemeleri, COPPA Rule, Play/Apple politika değişiklikleri).
31. [ ] İhlal olursa: 72 saat içinde Kurul'a bildirim akışını çalıştır; etkilenen velilere sade dille bildir.
32. [ ] İlgili kişi (veli) başvuru kanalını (e-posta) izle; 30 gün içinde yanıtla.

---

## Özet Karar Tablosu

| Konu | MVP kararı |
|---|---|
| Hesap / giriş | Yok |
| İsim, e-posta, telefon, doğum tarihi, konum | Toplanmaz |
| İlerleme verisi | Yalnızca cihazda |
| Ses işleme | %100 cihazda; bulut yok |
| Reklam | Yok |
| Üçüncü taraf analytics / SDK | Yok |
| Ebeveyn kapısı | Zorunlu (dinamik matematik + basılı-tut) |
| Veli rızası | Yalnızca opsiyonel özelliklerde, granüler, çift opt-in |
| VERBİS | Kayıt gerekmiyor (veri yok) — dosyalanır |
| DPIA | MVP'de gerekmez; bulut ses/senkron eklenirse zorunlu |
| Yurt dışı aktarım | Uygulanmaz (veri gönderilmiyor); hosting için IP loglama minimize |
| Avukat onayı | Yayın öncesi zorunlu |
