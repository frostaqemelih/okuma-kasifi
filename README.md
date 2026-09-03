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

## Bu sürümde ne var (Faz 0)

- **Onboarding:** yaş/mod seçimi — Keşif (4–5, okuma yok) / Çözümleme (6–7, ses→hece→kelime)
- **12 derslik Keşif Haritası:** MEB 2024 TYMM sırası (`a·n·e·t·i·l` → `o·k·u·r·ı·m`), ilerledikçe kilit açılır, rozetler
- **Ders akışı:** her ders 3–5 adımlık dizi (çiz → sesi eşleştir → harfi bul → hece), otomatik ilerleme, adım noktaları
- **6 mini oyun** (derste + serbest oyunda): Harfi Bul · Sesi Eşleştir · Hece Kur · **Kelime Kur** (harf taşlarını sırayla diz) · **Cümle Bahçesi** (kelime taşlarından cümle) · **Harf Çiz** (yeşil noktadan başla + animasyonlu yazım gösterimi + "👀 Göster" + kapsama/isabet puanlama)
- Türkçe seslendirme (tarayıcı `SpeechSynthesis`), yıldız + konfeti, açık/koyu tema
- İlerleme cihazda (`localStorage`), sunucuya veri gitmez
- Ebeveyn kapısı + panel (mod, tamamlanan ders, rozet, başarı oranı, süre)
- **Ses Karnesi** — her ses için doğru/yanlış sayılır; panelde "ustalaştı / gelişiyor / tekrar / yeni" olarak renk kodlu gösterilir + "tekrar önerilir" özeti (tanısal ebeveyn raporu, rakiplerden ayrışma noktası)
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
