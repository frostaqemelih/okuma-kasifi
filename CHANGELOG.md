# Sürüm Notları — Okuma Kâşifi

Bu belge **kullanıcı-yönlüdür** (ebeveynler için) — uygulamada neyin değiştiğini
sade dille anlatır. Geliştirme ayrıntıları için `GELISTIRME-PLANI.md`'ye bakın.

Uygulama henüz halka açık ilk sürümünü yapmadı; aşağıdaki liste geliştirme
sürecinde biriken özellikleri, halka açık ilk sürümde ("v1.0") neler
bulunacağını görmeniz için topluca gösterir. İlk yayından sonra bu belge her
yeni sürümde en üste eklenen tarihli bir bölümle güncellenecek.

## Yayınlanmamış — geliştirme aşamasında birikenler

### Öğrenme
- Türkiye'de kullanılan ses-temelli okuma-yazma sırasına (MEB 2024) göre
  **29 sesin/harfin tamamı** oynanabilir (5 ses grubu, 32 ders).
- 6 farklı mini oyun — Harfi Bul, Sesi Eşleştir, Hece Kur, Kelime Kur, Cümle
  Bahçesi, Harf Çiz — her biri birden çok varyantla, tekrar oynandıkça
  yorulmadan çeşitlilik sağlıyor.
- Harf Çiz'de vuruş vuruş kılavuz, 5 zorluk kademesi (tam kılavuzdan
  bellekten yazmaya), büyük harf modu, parmak kası ısınma çizgileri.
- Çocuk bir sesi zorlanıyorsa uygulama bunu fark edip nazikçe tekrar
  ettiriyor ve zamanla aralıklı tekrarla pekiştiriyor (Ses Karnesi'nde
  görünür).
- Ders sonu kısa değerlendirme, grup sonu "Kâşif Gösterisi" kutlaması,
  Okuma Kulübü (kısa metin + anlama soruları), Sayılar (1–10) ve
  Büyük/Küçük Harf farkındalığı mini modülleri.
- İlerleme rozetleri: ses ustalığı, gün serisi, ilk kelime/cümle/metin —
  ayrı bir koleksiyon ekranında toplanıyor.

### Ebeveynler için
- Ayrı bir **Ebeveyn Köşesi**: haftalık özet, 14 günlük çalışma grafiği,
  ders bazlı durum/süre, Ses Karnesi, evde yapılabilecek etkinlik önerileri.
- Yazdır / PDF olarak kaydet ile haftalık rapor.
- Yaş modu, günlük hedef, disleksi-dostu görünüm, sessiz mod, ses hızı gibi
  ayarlar.
- İlerlemeyi JSON olarak dışa/içe aktarma.
- Yeni bir **"Yenilikler" sekmesi**: her güncellemede uygulamada neyin
  değiştiğini kısaca burada görebilirsiniz (çocuğunuza gösterilmez).

### Erişilebilirlik
- Açık/koyu tema, disleksi-dostu sıcak zemin seçeneği.
- Doğru/yanlış geri bildirimi renk körlüğü dostu (ikon + konum, yalnız
  renk değil).
- Sessiz modda tüm sesli yönergeler yazılı olarak da gösteriliyor.
- Uygulamanın tamamı artık **klavye ile de** oynanabiliyor (dokunmatik
  ekranı olmayan cihazlarda da kullanılabilir); tüm etkileşimli öğelerde
  görünür odak halkası var.
- Beklenmedik bir hatada uygulama beyaz ekranda kalmıyor, nazik bir
  "yeniden başlat" ekranı gösteriyor — ilerleme cihazda güvende kalıyor.

### Premium (isteğe bağlı, ücretli katman)
- İlk ses grubu (ders 0–6) her zaman ücretsiz.
- Premium'da tüm ses grupları, Okuma Kulübü, ayrıntılı ebeveyn raporları ve
  daha fazlası — arayüz ve satın alma akışı hazır; gerçek ödeme sağlayıcısı
  (ör. iyzico) ilk halka açık sürümde bağlanacak.
- Satın alımları geri yükleme, tanıtım/hediye kodu desteği.

### Teknik
- Tamamı tek dosyada (`index.html`) çalışan, kurulum gerektirmeyen bir web
  uygulaması; PWA olarak "ana ekrana eklenebiliyor".
- Veriler yalnızca cihazda saklanıyor, sunucuya gönderilmiyor.
- Otomatik test paketi (`npm test`) her değişiklikte tüm ekranları ve oyun
  akışlarını doğruluyor.

---

_Bu belge her yayınlanabilir kilometre taşında güncellenir — bkz.
`GELISTIRME-PLANI.md` § 1.5 (1 aylık yol haritası)._
