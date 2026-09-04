# Mağaza Metaveri Taslağı — Okuma Kâşifi

> Bu dosya App Store / Google Play başvurusu için taslak metaveridir. Yayın öncesi son hâliyle
> Console/App Store Connect'e elle girilir. Kaynak: `arastirma/gizlilik-uyum.md` (§ 3 Play Families,
> § 4 Apple Kids Category), `data/plans.json`, `GELISTIRME-PLANI.md`.

## Uygulama adı

- **Görünen ad:** Okuma Kâşifi
- **Alt başlık / subtitle** (App Store, 30 karakter): `4-7 Yaş Okuma-Yazma Oyunu`
- **Kısa açıklama (Play, 80 karakter):** `Kâşif ile 4-7 yaş çocuklara oyunlu, sesli okuma-yazma öğrenimi`

## Kısa açıklama (SSS/liste görünümü, ~170 karakter)

Sevimli baykuş rehber Kâşif eşliğinde, 4-7 yaş çocuklara Türkçe okuma-yazmanın temellerini
oyunlaştırılmış ve sese dayalı öğreten uygulama. Reklamsız, sohbet robotu değil, veriler cihazda kalır.

## Uzun açıklama

```
Okuma Kâşifi, 4-7 yaş çocuklara okuma-yazmanın temellerini sevimli bir baykuş rehber
"Kâşif" eşliğinde, oyunlaştırılmış ve sese dayalı bir şekilde öğreten bir uygulamadır.

🐣 4-5 yaş "Keşif" modu: sesleri tanıma, harf çizme, parmak kası ısınma çalışmaları.
   Okuma beklentisi yok, baskı yok.

🚀 6-7 yaş "Çözümleme" modu: ses → hece → kelime → cümle. Okuma Kulübü'nde kısa
   metinler okur, anlama sorularını yanıtlar.

Müfredat MEB 2024 Türkçe Yazı ve Metin Modeli (TYMM) ses sırasını izler — 5 ses grubu,
29 harfin tamamı, 6 farklı mini oyun (Harfi Bul, Sesi Eşleştir, Hece Kur, Kelime Kur,
Cümle Bahçesi, Harf Çiz).

Ebeveynler için:
• Ayrıntılı ilerleme raporu ve "Ses Karnesi" (hangi ses zorlanıyor, ne yapılabilir)
• 14 günlük çalışma grafiği, yazdır/PDF haftalık özet
• Açık/koyu tema, disleksi-dostu görünüm, sessiz mod, klavye ile tam erişilebilirlik

Çocuk güvenliği tasarım ilkesi:
✔ Yapay zekâ Kâşif önceden hazırlanmış sabit içerik üzerinden konuşur — serbest sohbet YOKTUR
✔ Reklam, üçüncü taraf izleyici/analiz YOKTUR
✔ Satın alma ekranları yalnızca ebeveyn kapısının ARKASINDADIR, çocuğa asla gösterilmez
✔ İlerleme yalnızca cihazda saklanır, hesap gerekmez

İlk ses grubu (6 ders, 6 oyun tipinin tamamı) kalıcı olarak ücretsizdir. 2.-5. ses
grupları ve ek özellikler (Okuma Kulübü, ayrıntılı rapor, aile planı) premium
plandadır — aylık, yıllık veya tek seferlik kalıcı seçenekle. 7 gün ücretsiz deneme
mevcuttur, otomatik ücretlendirme yoktur.
```

## Anahtar kelimeler (Play/App Store aramaları için)

okuma yazma, harf öğrenme, alfabe, çocuk eğitim, okul öncesi, MEB müfredat, sesli
harfler, hece, kelime, Türkçe okuma, 4 yaş, 5 yaş, 6 yaş, 7 yaş, anaokulu, ilkokul
hazırlık, disleksi dostu, ebeveyn takip, harf çizme, fonetik

## Kategori

- **Play Store:** Eğitim → Ön Okul Öncesi / Okul Öncesi
- **App Store:** Education (birincil), Kids (ikincil, uygunsa)

## Yaş derecesi / hedef kitle

- **Hedef yaş aralığı:** 4-7 yaş
- **App Store Kids Category yaş bandı:** "5 ve altı" veya "6-8" (`arastirma/gizlilik-uyum.md` § 4.1) —
  başvuru sırasında ikisinden biri seçilir; içerik her iki bandı da kapsadığından "6-8" daha güvenli
  varsayılan (üst yaş sınırını aşmaz, alt yaş için de uygun).
- **Play Families:** "Yalnızca çocuklar" hedef kitle seçeneği yerine "Çocuklar dahil karma yaş"
  önerilir çünkü uygulama içi satın alma (premium) içeriyor ve ebeveyn kapısı gerektiriyor —
  `arastirma/gizlilik-uyum.md` § 3.1'deki karara bakınız.

## "Designed for Families" / Kids Category uygunluk notları

Kaynak: `arastirma/gizlilik-uyum.md` § 3 (Play Families) ve § 4 (Apple Kids Category).

- ✅ Üçüncü taraf reklam SDK'sı yok (Kids Category zorunlu şartı — Guideline 1.3/5.1.4)
- ✅ Üçüncü taraf analiz/izleyici yok
- ✅ Harici link, satın alma, uygulama-dışı yönlendirme yalnızca ebeveyn kapısının arkasında
- ✅ Yapay zekâ (Kâşif) serbest sohbet etmiyor, sabit/önceden yazılmış içerik okuyor
- ⚠️ Tarayıcı `SpeechSynthesis` (TTS) cihaz-üzerinde çalışır; gerçek sağlayıcıya geçilirse
  (`E5.2`, Hafta 4 sonu) sunucu tabanlı sese dönülmemeli veya "üçüncü tarafa aktarım" olarak
  beyan edilmelidir (§ 4.2 iOS notu — `requiresOnDeviceRecognition` benzeri kısıt)
- ⚠️ Yayın öncesi: Gizlilik Politikası herkese açık bir web URL'sinde de yayınlanmalı (mağaza
  başvuru formları bunu ister — şu an yalnızca uygulama içi "Yasal/Gizlilik" sekmesinde var)
- ⚠️ Play Data Safety formu + Apple App Privacy "nutrition label": hedef beyan "Data Not
  Collected" (veri toplanmıyor) — uygulamanın cihaz-öncelikli, hesapsız tasarımıyla tutarlı

## Ekran görüntüleri

`site/screenshots/` klasöründeki 3 görüntü (karşılama, Keşif Haritası, Harf Çiz) başlangıç
noktasıdır. Mağaza gönderimi için gerçek cihaz/store boyut şablonlarında (ör. iPhone 6.7",
Play telefon/tablet) yeniden alınmalı — bu görüntüler `E9.1` landing sayfası için üretildi,
mağaza boyut şartlarını karşılamayabilir.

## Destek / iletişim

- **Destek e-postası:** destek@okumakasifi.app
- **Gizlilik politikası URL'i:** _(yayın öncesi belirlenecek — bkz. yukarıdaki ⚠️ notu)_

## Yayın öncesi kontrol listesi (bu dosyaya özel)

- [ ] Gerçek ödeme sağlayıcısı bağlanıp fiyatlar Console/App Store Connect'e girilince bu
      dosyadaki `data/plans.json` referansı ile karşılaştırılıp güncellensin.
- [ ] Gizlilik Politikası herkese açık bir URL'de yayınlansın (mağaza formu zorunlu kılıyor).
- [ ] Mağaza boyut şablonlarında gerçek ekran görüntüleri yeniden alınsın.
- [ ] Bir avukat KVKK/COPPA metinlerini gözden geçirsin (`arastirma/gizlilik-uyum.md`'deki
      mevcut iç not ile tutarlı).
