const CACHE = 'chatmula-v103';

// Activate immediately without waiting for the user to close the app
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Take control of the page immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// Fetch strategy: Network-first for HTML, Cache-first for images
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Network-first for HTML navigation (ensures new code always loads)
  if (event.request.mode === 'navigate' || 
     (event.request.method === 'GET' && 
      event.request.headers.get('accept') && 
      event.request.headers.get('accept').includes('text/html'))) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache-first for images and static assets
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
    })
  );
});