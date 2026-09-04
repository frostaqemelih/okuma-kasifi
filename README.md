# Okuma Kâşifi 🦉

4–7 yaş çocuklara okuma-yazmanın temellerini yapay zekâ destekli bir rehber
("Kâşif") eşliğinde, oyunlaştırılmış ve sese dayalı bir şekilde öğreten uygulama.

- **Ürün taslağı:** [`TASLAK.md`](TASLAK.md)
- **Araştırma raporları:** [`arastirma/`](arastirma/) — pedagoji, rakip analizi, teknik mimari, gizlilik/uyum
- **Prototip:** [`index.html`](index.html) — tek dosya, kurulum gerektirmez

## Prototipi çalıştırma

Tarayıcıda `index.html` dosyasını aç. Sesin çalışması için önce **"Başla"** düğmesine dokun
(tarayıcılar sesi ilk kullanıcı hareketinden sonra açar).

Yerel sunucu ile (service worker + PWA için):

```bash
cd okuma-kasifi
python -m http.server 8000
```

Sonra `http://localhost:8000` adresini aç.

## Mobil mağaza sarmalı (Capacitor)

Uygulama hâlâ tek dosya (`index.html`) mimarisiyle geliştiriliyor; [Capacitor](https://capacitorjs.com)
bu kodu **değiştirmeden** iOS/Android native proje olarak sarar (App Store/Play Store'a gönderilebilir
`.ipa`/`.aab`). `capacitor.config.json` zaten repoda hazır. Gerçek native build (Apple Developer /
Google Play hesabı, imzalama sertifikaları) kullanıcıda yapılır — ajan bunları repoya eklemez.

```bash
npm i -D @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android
npm run cap:prepare        # index.html + data/ + manifest/sw/ikonları www/ klasörüne kopyalar
npx cap add ios            # ve/veya: npx cap add android
npx cap sync
npx cap open ios           # Xcode'da açar — imzalama + build orada
npx cap open android       # Android Studio'da açar
```

`www/`, `ios/`, `android/` klasörleri üretilmiş dosyalardır, `.gitignore`'da — kaynak her zaman
`index.html` kalır. Kod değiştikçe tekrar build almadan önce `npm run cap:prepare && npx cap sync`.

## Bu sürümde ne var (Faz 0)

- **Onboarding:** yaş/mod seçimi — Keşif (4–5, okuma yok) / Çözümleme (6–7, ses→hece→kelime)
- **12 derslik Keşif Haritası:** MEB 2024 TYMM sırası (`a·n·e·t·i·l` → `o·k·u·r·ı·m`), ilerledikçe kilit açılır, rozetler
- **Ders akışı:** her ders 3–5 adımlık dizi (çiz → sesi eşleştir → harfi bul → hece), otomatik ilerleme, adım noktaları
- **6 mini oyun** (derste + serbest oyunda): Harfi Bul · Sesi Eşleştir · Hece Kur · **Kelime Kur** (harf taşlarını sırayla diz) · **Cümle Bahçesi** (kelime taşlarından cümle) · **Harf Çiz** (yeşil noktadan başla + animasyonlu yazım gösterimi + "👀 Göster" + kapsama/isabet puanlama)
- Türkçe seslendirme (tarayıcı `SpeechSynthesis`), yıldız + konfeti, açık/koyu tema
- İlerleme cihazda (`localStorage`), sunucuya veri gitmez
- **Ebeveyn İzleme Sayfası** (`s-parent`, 5 sekme): Genel (streak, 14 günlük SVG grafik, kartlar) · Dersler (12 ders + süre/deneme) · Ses Karnesi (per-ses tanısal renk kodu) · Öneriler (zayıf seslere "evde ne yapabilirsiniz" kartları) · Ayarlar (yaş modu, günlük hedef, disleksi-dostu görünüm, sessiz mod, JSON dışa/içe aktarma)
- **Ses Karnesi** — her ses için doğru/yanlış; "ustalaştı / gelişiyor / tekrar / yeni" renk kodu + özet (rakiplerden ayrışma noktası)
- Müfredat: kod içi `LESSONS` + kaynak `data/mufredat.json`

## Yapılacaklar (kısa)

- [ ] Harf Çiz: çoklu vuruşta vuruş vuruş kılavuz (şu an tüm harf tek maske), 5 kademe (soluk→bellekten)
- [x] Tanısal ebeveyn raporu (Ses Karnesi) — panelde
- [ ] Okuma Kulübü: kısa metin + Kâşif sesli okur + 2 anlama sorusu (ders 12, mufredat.json'da hazır)
- [ ] Ses klipleri (gömülü harf/hece), bulut TTS
- [ ] Harf Çiz: çok vuruşlu kılavuz + 5 kademe (soluk→bellekten)
- [ ] Erişilebilirlik geçişi (odak, ARIA, disleksi ayarı)
- [ ] 3.–5. ses gruplarını oyunlaştır
- [ ] Gömülü harf/hece ses klipleri + bulut TTS (cümle/hikâye)
- [ ] `icon-192/512.png` maskot + isim/maskot kararı
- [ ] KVKK aydınlatma + gizlilik metinleri (avukat onayı)
