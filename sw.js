const CACHE_NAME = 'chatmula-v6'; // Bumped to v5 to clear old broken caches

const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icon.jpg',
  './icon-192.png',
  './icon-512.png',
  './bot_alex_carter.jpg',
  './bot_jordan_brooks.jpg',
  './bot_morgan_bennett.jpg',
  './bot_sam_reid.jpg',
  './bot_charlie_mitchell.jpg',
  './bot_ethan_walsh.jpg',
  './bot_liam_foster.jpg',
  './bot_noah_sinclair.jpg',
  './bot_caleb_rhodes.jpg',
  './bot_mason_clarke.jpg',
  './bot_taylor_parker.jpg',
  './bot_riley_price.jpg',
  './bot_casey_collins.jpg',
  './bot_jamie_grant.jpg',
  './bot_avery_hayes.jpg',
  './bot_olivia_stone.jpg',
  './bot_emma_hart.jpg',
  './bot_sophie_lane.jpg',
  './bot_chloe_vance.jpg',
  './bot_mia_winters.jpg'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.all(
        APP_SHELL.map((url) => {
          return cache.add(url).catch((err) => console.warn('Failed to cache:', url, err));
        })
      );
    })
  );
});

self.addEventListener('activate', (event) => {
  self.clients.claim();
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (url.origin.includes('supabase.co')) {
    return; 
  }

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('./index.html');
      })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => { });

      return cachedResponse || fetchPromise;
    })
  );
});