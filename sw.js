const CACHE_NAME = 'sky-odyssey-v1';
const ASSETS = [
  'index.html',
  'manifest.json',
  'https://aframe.io/releases/1.4.0/aframe.min.js',
  'https://cdn.jsdelivr.net/npm/astronomy-engine@2.1.19/astronomy.browser.min.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
