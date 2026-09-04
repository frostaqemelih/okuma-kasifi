/* Okuma Kâşifi — çevrimdışı önbellek */
const CACHE = 'okuma-kasifi-v3';
const ASSETS = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];
// E7.6: Google Fonts CSS'i de baştan önbelleğe almayı dene (best-effort) — asıl .woff2 dosyaları
// bu CSS içinden ayrıca istendiğinde fetch dinleyicisi onları da fırsatçı biçimde önbelleğe alır,
// bu yüzden uçak modunda tam çalışma ilk açılışın ÇEVRİMİÇİ olmasını gerektirir (PWA'larda standart).
const FONT_CSS = 'https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Nunito:wght@400;600;700;800&display=swap';

self.addEventListener('install', e => {
  // E7.7: skipWaiting() burada ÇAĞRILMAZ — yeni sürüm hazır olunca sayfa bunu
  // fark edip nazik bir "güncelle" düğmesi gösterir, kullanıcı onaylayınca
  // (SKIP_WAITING mesajı) devreye girer. Böylece oyun ortasında sürüm değişip
  // çocuk bölünmez.
  // E7.6: c.addAll() TÜM istekler başarılı olmazsa hepsini birden reddeder — tek bir asset
  // (ör. yavaş/başarısız font isteği) yüzünden index.html/manifest/ikonların HİÇ önbelleğe
  // alınmaması riskini önlemek için her asset ayrı ayrı denenir, başarısız olan sessizce atlanır.
  e.waitUntil(
    caches.open(CACHE).then(c => Promise.all(
      [...ASSETS, FONT_CSS].map(a => c.add(a).catch(() => {}))
    ))
  );
});

self.addEventListener('message', e => {
  if (e.data === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
      return res;
    }).catch(() => caches.match('./index.html')))
  );
});
