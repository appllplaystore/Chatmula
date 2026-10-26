const CACHE = 'chatmula-v100-final';
self.addEventListener('install', (e) => { self.skipWaiting(); });
self.addEventListener('activate', (e) => { e.waitUntil(clients.claim()); });

self.addEventListener('fetch', (event) => {
  // Always fetch fresh HTML files from the network. Never serve cached HTML.
  if (event.request.mode === 'navigate' || (event.request.method === 'GET' && event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html'))) {
    event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
    return;
  }
  // For images/icons, use cache
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
});