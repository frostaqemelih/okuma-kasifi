# Okuma Kâşifi — Ürün Taslağı (v0.1)

> 4–7 yaş çocuklara okuma-yazmanın temellerini, yapay zekâ destekli bir "rehber arkadaş"
> eşliğinde; oyunlaştırılmış, sese dayalı ve her çocuğun hızına uyum sağlayan bir deneyimle öğreten uygulama.

Bu belge canlı taslaktır. Araştırma ajanlarının çıktıları geldikçe (`arastirma/` klasörü) ilgili bölümler güncellenecek.

---

## 1. Vizyon ve konumlanma

- **Tek cümle:** "Çocuğun cebinde, sonsuz sabırlı, Türkçe konuşan bir okuma öğretmeni."
- **Neden şimdi:** LLM + kaliteli Türkçe seslendirme artık bir çocuğa birebir, kişiye özel alıştırma üretip
  anında cesaretlendirici geri bildirim verecek kadar iyi ve ucuz.
- **Neyi değiştiriyoruz:** Klasik "okuma yazma" uygulamaları sabit içerik sunar (aynı 20 alıştırma).
  Bizim ajan her çocuğa göre uyarlanır: adını kullanır, sevdiği konulardan örnek verir,
  takıldığı sesi fark edip o sese döner, ilerledikçe zorlaştırır.

## 2. Hedef kitle

| Kitle | İhtiyaç | Uygulamadaki karşılığı |
|---|---|---|
| **Birincil: 4–7 yaş çocuk** | Okumayı eğlenceli, baskısız, başarabileceği adımlarla öğrenmek | Oyun ekranları, maskot, ses |
| İkincil: Ebeveyn | "Çocuğum ne öğrendi? Güvenli mi? Ekran süresi?" | Ebeveyn paneli (kapılı) |
| Üçüncül: Öğretmen / kurum | Sınıf takibi, ödev | Faz 4 |

Yaş içinde ikiye ayırıyoruz:
- **4–5 yaş (okul öncesi):** ses farkındalığı, harf tanıma, çizgi çalışmaları. Oturum 5–8 dk.
- **6–7 yaş (1. sınıf):** ses→hece→kelime→cümle, basit okuma. Oturum 10–15 dk.

## 3. Pedagojik temel

> Detay: `arastirma/pedagoji.md` (ajan çıktısı, 40+ kaynak)

- **Yöntem:** Türkiye MEB 1. sınıf **Ses Temelli Cümle Yöntemi**.
  Sesler → heceler → kelimeler → cümleler → kısa metinler.
- **Ses grubu sırası — DİKKAT, güncel müfredat farklı:**
  | Dönem | 1. grup | Not |
  |---|---|---|
  | Klasik STCY (2005) | `e, l, a, t` | En bilinen sıra, "elma/at" |
  | 2017–2023 | `e, l, a, k, i, n` (ELAKİN) | Dik temel yazı serbest |
  | **2024 TYMM (yürürlükte)** | hazırlık haftası + `a, n, e, t, i, l` | Ürünün **varsayılanı bu olmalı** |
  - **Karar:** Ürün varsayılan olarak **2024 TYMM** sırasını kullanır; ayarlarda "klasik `elat`"
    ve "ELAKİN" modları seçilebilir (öğretmen/veli müfredatına uysun). İçerik mimarisi ses grubunu
    veri olarak tutar, sıraya gömülü olmaz.
- **Fonolojik farkındalık sırası:** sözcük → hece → uyak → ilk ses → son ses → **birleştirme**
  (ayırmadan önce) → ayırma → ses değiştirme. Fonem düzeyi harfle eş zamanlı. Türkçe'nin saydam
  ortografisi büyük avantaj.
- **Yaş ayrımı (ürün iki mod):**
  - **Keşif modu (4–5):** okuma yok, ses farkındalığı + harf tanıma + çizgi. Oturum 6–10 dk.
  - **Çözümleme modu (6–7):** ses→hece→kelime→cümle→kısa metin. Oturum 12–18 dk.
  - Ekran süresi: WHO/AAP — 2–5 yaş günde ≤1 saat nitelikli içerik.
- **Yazma:** araştırmaya göre dik temel ↔ bitişik eğik arasında okuma hızı farkı yok; önemli olan
  "elle yazma" eylemi. **Karar:** dik temel yazı varsayılan + 5 kademeli parmakla çizme
  (kılavuzlu → noktalı → soluk → bellekten → serbest).
- **Hata protokolü:** nötr onay → hedefli ipucu → modelle + birlikte yap → doğruyla bitir →
  tekrar planına ekle. Puan kaybı / süre baskısı / çocuklar arası sıralama YOK.
- **İlke:** Çocuk asla "yanlış" duygusu yaşamaz.

## 4. Modüller (uzun vade)

1. **Sesler & Harfler** — sesi duy, harfi tanı, sesi çıkar.
2. **Hece Atölyesi** — iki sesi birleştir, oku.
3. **Kelime Avı** — heceleri birleştir, resimle eşleştir.
4. **Cümle Bahçesi** — kelimelerden cümle kur.
5. **Yazma** — parmakla çizgi/harf çalışması.
6. **Okuma Kulübü** — kısa metin, ajan sesli okur, çocuk tekrar okur, ajan basit soru sorar.
7. **Kâşif'le Sohbet YOK** — serbest sohbet bilinçli olarak kapsam dışı (güvenlik).

## 5. Yapay zekâ ajan mimarisi (çocuk-güvenli)

> Detay: `arastirma/teknik-mimari.md` (ajan çıktısı)

```
                 ┌───────────────────────────┐
                 │   ORKESTRATÖR (kural)     │  ders planı, ilerleme durumu,
                 │   "sırada hangi ses?"     │  hangi mini-oyun, zorluk seviyesi
                 └────────────┬──────────────┘
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌───────────────┐   ┌──────────────────┐   ┌──────────────────┐
│ İÇERİK ÜRETİCİ │   │  DEĞERLENDİRİCİ   │   │  KONUŞMA KATMANI  │
│ LLM + şablon   │   │ cevap doğru mu?   │   │ TTS (Türkçe ses)  │
│ + whitelist    │   │ nerede takıldı?   │   │ STT (çocuk sesi)  │
└───────┬────────┘   └────────┬─────────┘   └────────┬─────────┘
        └─────────────────────┼──────────────────────┘
                              ▼
                 ┌───────────────────────────┐
                 │   GÜVENLİK FİLTRESİ        │  girdi + çıktı taraması,
                 │   (her katmanın önünde)    │  sadece onaylı kelime havuzu
                 └───────────────────────────┘
```

**Katı kurallar (teknik ajan onaylı):**
- **LLM çocuğu hiç görmez.** Yalnızca 3 dar *sunucu* görevi:
  1. Toplu içerik taslağı üretimi (Claude Sonnet, **insan onayından** geçer)
  2. Çocuğun cevabını yapılandırılmış sınıflandırma (Claude Haiku)
  3. Şablon + slot doldurmalı **tek cümle** teşvik (Haiku)
- Serbest üretim yok → şablon havuzu + whitelist + çıktı doğrulayıcı (uzunluk, karakter kümesi,
  Türkçe blocklist, duygu, dil, şablon regex) → başarısızsa **statik yedek cümle**.
- Injection yüzeyi küçük (çocuk metin yazmıyor); tek risk ebeveynin girdiği isim → sanitize + delimiter.

**Seslendirme (TTS) — 3 katman:**
| Katman | Çözüm | Neden |
|---|---|---|
| Harf/hece sesleri | İnsan kaydı veya bir kez üretilip **tek tek onaylı** klipler, uygulamaya gömülü | Genel TTS fonemi ("/a/") harf adı gibi okur, ğ/ı/ç tutarsız |
| Hazır cümle/hikâye | Azure Neural `tr-TR` (~$10–16/1M), toplu üret → onayla → CDN | Kaliteli, kontrollü |
| Dinamik geri bildirim | Azure streaming + metin-hash önbellek (%95 isabet → ~$0,02/çocuk/ay) | Ucuz, hızlı |
| Çevrimdışı yedek | Cihaz-içi Piper WASM | Ağsız çalışsın |

**Konuşma tanıma (STT): MVP'de YOK.** Çocuk Türkçesinde tam STT güvenilmez (Whisper ~%25 WER).
4–7 yaş zaten klavye kullanmıyor; okuma-yazma dokunma/sürükleme/izleme + "kuşa oku" (enerji tespiti)
ile öğretilir. **Faz 2:** tam STT değil, **Azure Pronunciation Assessment** (telaffuz puanlama —
hedef metin bilindiği için sağlam).

**Model / maliyet:** runtime Haiku 4.5, batch Sonnet.
Agresif önbellek + ağırlıklı hazır içerikle: **~$0,17–0,23 / aktif çocuk / ay** (1k–10k ölçek).
Önbellek disiplini olmazsa $1,5–3'e fırlar.

**Gecikme altın kuralı:** Çekirdek döngü asla bulut beklemez. Her çocuk için önceden hazır
20–40'lık alıştırma kuyruğu; kural tabanlı anında doğru/yanlış; 1,5 sn zaman aşımında statik yedek.

## 6. Platform kararı — **KESİNLEŞTİ: PWA çekirdek → Capacitor sarmalı**

> Detay: `arastirma/teknik-mimari.md`

- **Faz 0–2:** **React + Vite PWA**. Tablet öncelikli, telefonda da çalışır, kurulabilir, çevrimdışı.
  Hızlı iterasyon + mağaza onayı beklemeden yayın.
- **Faz 4:** Aynı kod tabanı **Capacitor** ile iOS/Android'e sarılır (native ses, mikrofon, push
  eklentileri). React Native / Flutter **gereksiz** — ağır native hesaplama yok.
- **Abonelik web'de satılır** (mümkün olduğunca) → mağaza komisyonundan kaçınmak için.

**Önerilen yığın:**
| Katman | Seçim |
|---|---|
| Frontend | React + Vite PWA + Service Worker + IndexedDB |
| Backend | FastAPI (Python — ML tutkalı) |
| DB / Auth | Supabase (Postgres + RLS) |
| Ses bankası | Cloudflare R2 (egress ücretsiz — ses ağırlıklı üründe kritik) |
| API barındırma | Fly.io / Railway |

## 7. Gizlilik ve uyum

> Detay: `arastirma/gizlilik-uyum.md` (ajan çıktısı, 32 adımlık kontrol listesi)

**Stratejik karar:** MVP = *hesapsız, cihaz-öncelikli, sıfır kişisel veri*. Bu tek karar
COPPA / GDPR-K / Play Families / Apple Kids şartlarının büyük kısmını tasarımı gereği karşılar
ve **veri toplanmadığı için VERBİS kaydı gerekmez**.

- **KVKK:** 8 yaş altı çocuk kendi başına rıza veremez; tüm rızalar veliden, granüler, geri alınabilir.
  Veri toplanmıyorsa aydınlatma yükü minimal.
- **Google Play Families:** sıfır reklam SDK'sı, sıfır davranışsal reklam, AAID toplanmaz,
  Data Safety formu gerçek davranışla birebir.
- **Apple Kids:** yaş bandı, Guideline 1.3 / 5.1.4, üçüncü taraf analiz/reklam yasağı, parental gate zorunlu.
- **Ses:** %100 cihazda işleme (iOS `requiresOnDeviceRecognition`, Android `EXTRA_PREFER_OFFLINE`).
  Buluta göndermek zorunlu olursa: ayrı rıza + anında sil + saklama=0 + model eğitiminde kullanma yasağı.
- **Ebeveyn kapısı:** dinamik cevaplı matematik / basılı-tut. "Ben yetişkinim" tek dokunuş **kabul edilmez**.
- **Reklam yok. Üçüncü taraf izleyici yok.**
- ⚠️ **Yayın öncesi:** tüm yasal metinler (gizlilik politikası, KVKK aydınlatma, açık rıza,
  kullanım şartları, çocuk/veli sadeleştirilmiş bilgilendirme) ve rıza-doğrulama yaklaşımı için
  **uzman avukat onayı şart** (TR'de "veli rızası doğrulama" için kesin ikincil mevzuat yok).

## 8. MVP kapsamı (ilk yayınlanacak sürüm)

- **12 ders** (bkz. `arastirma/pedagoji.md` müfredatı): hazırlık + 2024 TYMM 1.–2. grup
  (`a, n, e, t, i, l` → `o, k, u, r, ı, m`). *Prototip şu an klasik `e,l,a,t` kullanıyor — güncellenecek.*
- **STT yok** — dokunma / sürükleme / izleme etkinlikleri.
- **3 mini oyun:**
  1. Harfi Bul (harf tanıma)
  2. Sesi Eşleştir (ses → resim: elma/e, limon/l, at/a, top/t)
  3. Hece Kur (iki sesi birleştir: `el, le, at, ta, al, la`...)
- **Maskot "Kâşif"** + Türkçe seslendirme (başlangıçta tarayıcı `SpeechSynthesis`, sonra bulut TTS)
- **Yıldız/rozet ödülü**, ilerleme cihazda
- **Basit ebeveyn paneli** (kapılı): hangi oyunlar oynandı, kaç yıldız, ekran süresi
- **PWA:** ana ekrana eklenebilir, çevrimdışı açılır

## 9. Yol haritası

| Faz | İçerik | Durum |
|---|---|---|
| **Faz 0 — Prototip** | Yaş modu + 12 derslik harita (kilit/rozet) + 5 mini oyun (Kelime Kur + yönlü Harf Çiz dahil) + ders akışı + ebeveyn panel. Tarayıcı TTS, yerel ilerleme. | ✅ çalışır (`index.html`) |
| Faz 1 — MVP | Yukarıdaki MVP kapsamı, PWA, ebeveyn paneli, 12 ders | ⬜ |
| Faz 2 — AI | Canlı kişiselleştirme, Azure Neural TTS, **telaffuz puanlama** (tam STT değil) | ⬜ |

Not: Tanısal veli raporu (Ses Karnesi) prototipe erken alındı — her ses için doğru/yanlış izlenip ebeveyn panelinde renk kodlu gösteriliyor.
| Faz 3 — Yazma | Parmakla çizim modülü, çoklu çocuk profili, tüm ses grupları | ⬜ |
| Faz 4 — Dağıtım | Capacitor, Play/App Store çocuk kategorisi, öğretmen paneli | ⬜ |

## 10. Pazar konumu ve iş modeli

> Detay: `arastirma/rakip-analizi.md`

- **Boşluk:** Global uygulamalar İngilizce fonik + adaptif; gerçek "dinleyen AI öğretmen" kategorisi
  dar (Ello, Amira) ve **Türkçe yok**. Türk yerli uygulamalar (Okuma Yazma Öğreniyorum ~4M indirme)
  MEB yöntemine uygun ama **AI yok, kişiselleştirme yok, reklam yüklü**.
- **Konum:** MEB ses temelli yöntemine %100 hizalı + çocuğu dinleyen AI koç + ebeveyne **tanısal
  haftalık rapor** (rozet değil) + reklamsız + çevrimdışı. Bu üçlü hiçbir rakipte bir arada yok.
- **Türkçe'nin saydam ortografisi**, çocuğun sesli okumasını dinleyen AI'yı İngilizce'den daha güvenilir kılıyor.
- **Fiyat (öneri):** kalıcı ücretsiz çekirdek + aylık ~149–199 TL / yıllık ~999–1.499 TL +
  "bir kere al bitsin" için tek seferlik ~299–399 TL ünite paketi. Yerel TL, yerel ödeme, şeffaf iptal.
  (Morpa'nın Şikayetvar'daki otomatik-yenileme şikâyetleri = kaçınılacak tuzak.)
- **B2B:** en hızlı kanal özel anaokulu / ilkokul / kreş zincirleri (öğrenci başı ~200–400 TL/yıl).
  Yayınevi (kitaptan QR), belediye/İl MEM okuma seferberlikleri, RAM/özel eğitim nişi.
- **MEB konumu:** rakip değil **tamamlayıcı** — "EBA'yı eve taşıyan yardımcı". Müfredat değişimine
  dayanıklı içerik mimarisi (ses grubu = veri).

## 11. Hâlâ karar bekleyen sorular

- [ ] İsim kesin mi ("Okuma Kâşifi")? Maskot: baykuş mu, kaşif çocuk mu, başka mı?
- [ ] İlk ses grubu: 2024 TYMM (`a,n,e,t,i,l`) varsayılan — prototipi de buna çevirelim mi?
- [ ] İlk pazar sadece TR (dil genişletme sonra) — onay?
- [ ] Bütçe / zaman: MVP'ye ne kadar ayrılıyor (TTS klip kaydı, avukat, barındırma sabit gider)?
- [ ] B2C mi B2B mi önce? (öneri: B2C ücretsiz çekirdekle başla, B2B pilot paralel)

## 12. Araştırma dosyaları

| Dosya | İçerik |
|---|---|
| [`arastirma/pedagoji.md`](arastirma/pedagoji.md) | Ses grupları (3 dönem), fonolojik farkındalık, yaş modları, yazma, oyunlaştırma, 12 ders |
| [`arastirma/rakip-analizi.md`](arastirma/rakip-analizi.md) | 20+ rakip, karşılaştırma tablosu, fiyat, B2B kanalları, riskler |
| [`arastirma/teknik-mimari.md`](arastirma/teknik-mimari.md) | TTS 3 katman, STT kararı, LLM güvenlik, maliyet, gecikme, yığın |
| [`arastirma/gizlilik-uyum.md`](arastirma/gizlilik-uyum.md) | KVKK/COPPA/Play/Apple, veri minimizasyonu, 32 adım kontrol listesi |
