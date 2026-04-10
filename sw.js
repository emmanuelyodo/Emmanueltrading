/**
 * EMMANUEL TRADING — Service Worker
 * Specialized for 3G/Offline usage in West Africa.
 */

const CACHE_NAME = 'et-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/css/main.css',
  '/css/components.css',
  '/css/screens.css',
  '/js/data.js',
  '/js/auth.js',
  '/js/market.js',
  '/js/app.js',
  '/js/screens/screen1-3.js',
  '/js/screens/screen4-5.js',
  '/js/screens/screen6-7.js',
  '/js/screens/screen8-9.js',
  '/js/screens/screen10-12.js',
  '/assets/logo.png',
  '/assets/onboarding1.png',
  '/assets/onboarding3.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching vital assets');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Stale-while-revalidate strategy
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
        });
        return networkResponse;
      }).catch(() => {
        // Fallback for failed network
        return cachedResponse;
      });
      return cachedResponse || fetchPromise;
    })
  );
});
