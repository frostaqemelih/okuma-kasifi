/* Okuma Kâşifi — basit çevrimdışı önbellek (prototip) */
const CACHE = 'okuma-kasifi-v2';
const ASSETS = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  // E7.7: skipWaiting() burada ÇAĞRILMAZ — yeni sürüm hazır olunca sayfa bunu
  // fark edip nazik bir "güncelle" düğmesi gösterir, kullanıcı onaylayınca
  // (SKIP_WAITING mesajı) devreye girer. Böylece oyun ortasında sürüm değişip
  // çocuk bölünmez.
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
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
