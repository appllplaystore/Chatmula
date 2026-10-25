const CACHE_NAME = 'chatmula-v4'; // Bumped to v4 to clear old broken caches

// The core files required to boot the app
const APP_SHELL = [
  './',
  './index.html',
  './app-script.js',
  './manifest.json',
  './icon.jpg',
  './icon-192.png',
  './icon-512.png',
  // Bot images
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

// 1. Install Event: Cache the app shell
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Force the new SW to take over immediately
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.all(
        APP_SHELL.map((url) => {
          // Catch errors so if one image is missing, the whole install doesn't fail
          return cache.add(url).catch((err) => console.warn('Failed to cache:', url, err));
        })
      );
    })
  );
});

// 2. Activate Event: Clean up old caches
self.addEventListener('activate', (event) => {
  self.clients.claim(); // Take control of all open pages immediately
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

// 3. Fetch Event: Serve assets properly
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 🚨 CRITICAL: DO NOT CACHE SUPABASE API CALLS 🚨
  // We want wallet balances, messages, and withdrawals to ALWAYS be live and fresh.
  if (url.origin.includes('supabase.co')) {
    return; // Let the browser handle it normally (Network Only)
  }

  // For HTML navigation requests (page refreshes)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        // If offline, serve the cached index.html
        return caches.match('./index.html');
      })
    );
    return;
  }

  // For static assets (app-script.js, images, fonts)
  // Stale-While-Revalidate: Return cached instantly for native speed, update in background
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        // If the network request is successful, update the cache for next time
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => { 
        /* Ignore network errors if we have a cached version */ 
      });

      // Return the cached response immediately if we have it, otherwise wait for network
      return cachedResponse || fetchPromise;
    })
  );
});