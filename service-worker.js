/**
 * Service Worker for My Village Website
 * Enables offline functionality and asset caching
 */

const CACHE_NAME = 'myvillage-v1';
const STATIC_ASSETS = [
  './',
  './index.html',
  './assets/css/main.css',
  './assets/js/main.js',
  './vendor/bootstrap/css/dist/css/bootstrap.min.css',
  './vendor/aos/aos.css',
  './vendor/aos/aos.js',
  './vendor/glightbox/css/glightbox.min.css',
  './vendor/glightbox/js/glightbox.min.js',
  './vendor/isotope-layout/isotope.pkgd.min.js'
];

/**
 * Install event - cache assets
 */
self.addEventListener('install', event => {
  console.log('[ServiceWorker] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[ServiceWorker] Caching assets');
      
      // Cache each file individually to skip missing ones
      return Promise.all(
        STATIC_ASSETS.map(url => {
          return cache.add(url).catch(err => {
            console.warn('[ServiceWorker] Failed to cache:', url);
          });
        })
      );
    })
  );
  
  self.skipWaiting();
});

/**
 * Activate event - clean old caches
 */
self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Activating...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[ServiceWorker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  self.clients.claim();
});

/**
 * Fetch event - serve from cache with network fallback
 */
self.addEventListener('fetch', event => {
  // Only handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Skip cross-origin requests
  if (!event.request.url.includes(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return from cache if available
        if (response) {
          console.log('[ServiceWorker] Serving from cache:', event.request.url);
          return response;
        }

        // Otherwise fetch from network
        return fetch(event.request)
          .then(networkResponse => {
            // Cache successful responses
            if (networkResponse && networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, responseClone);
              });
            }
            
            return networkResponse;
          })
          .catch(error => {
            console.warn('[ServiceWorker] Fetch failed:', event.request.url, error);
            
            // Return offline page
            return caches.match('./index.html')
              .then(response => response || 
                new Response('Offline - Please check your connection', {
                  status: 503,
                  statusText: 'Service Unavailable'
                })
              );
          });
      })
  );
});

/**
 * Handle messages from client
 */
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('[ServiceWorker] Service Worker script loaded');
