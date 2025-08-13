// Service Worker for StreamList Pro PWA
const CACHE_NAME = 'streamlist-pro-v1.0.0';
const OFFLINE_URL = '/offline.html';

// Resources to cache on install
const STATIC_CACHE_URLS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  OFFLINE_URL,
  // Add your app's static assets
  '/favicon.ico'
];

// Dynamic cache patterns
const RUNTIME_CACHE = 'streamlist-runtime-v1';
const MOVIE_API_CACHE = 'streamlist-movie-api-v1';
const IMAGE_CACHE = 'streamlist-images-v1';

// Install event - cache static resources
self.addEventListener('install', event => {
  console.log('[SW] Install Event');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching static resources');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
        console.log('[SW] Static resources cached');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('[SW] Install failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[SW] Activate Event');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME && 
                cacheName !== RUNTIME_CACHE && 
                cacheName !== MOVIE_API_CACHE && 
                cacheName !== IMAGE_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Cache cleanup complete');
        return self.clients.claim();
      })
  );
});

// Fetch event - handle network requests with caching strategies
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle different types of requests with appropriate strategies
  if (url.origin === location.origin) {
    // Same-origin requests - app shell and static resources
    event.respondWith(handleAppShellRequest(request));
  } else if (url.hostname.includes('api.themoviedb.org')) {
    // TMDB API requests - network first with cache fallback
    event.respondWith(handleAPIRequest(request));
  } else if (url.hostname.includes('image.tmdb.org')) {
    // Movie images - cache first
    event.respondWith(handleImageRequest(request));
  } else {
    // Other external requests - network only
    event.respondWith(fetch(request));
  }
});

// App shell strategy - cache first with network fallback
async function handleAppShellRequest(request) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      console.log('[SW] Serving from cache:', request.url);
      return cachedResponse;
    }

    console.log('[SW] Fetching from network:', request.url);
    const networkResponse = await fetch(request);
    
    if (networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[SW] App shell request failed:', error);
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match(OFFLINE_URL);
    }
    
    throw error;
  }
}

// API requests - network first with cache fallback
async function handleAPIRequest(request) {
  try {
    console.log('[SW] API request - network first:', request.url);
    const networkResponse = await fetch(request);
    
    if (networkResponse.status === 200) {
      const cache = await caches.open(MOVIE_API_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, checking cache for:', request.url);
    const cache = await caches.open(MOVIE_API_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      console.log('[SW] Serving API request from cache');
      return cachedResponse;
    }
    
    throw error;
  }
}

// Image requests - cache first with network fallback
async function handleImageRequest(request) {
  try {
    const cache = await caches.open(IMAGE_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      console.log('[SW] Serving image from cache:', request.url);
      return cachedResponse;
    }

    console.log('[SW] Fetching image from network:', request.url);
    const networkResponse = await fetch(request);
    
    if (networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[SW] Image request failed:', error);
    
    // Return placeholder image for failed image requests
    return new Response(
      '<svg width="300" height="400" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f0f0f0"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#999">Image not available offline</text></svg>',
      {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'no-cache'
        }
      }
    );
  }
}

// Background sync for cart operations
self.addEventListener('sync', event => {
  console.log('[SW] Background sync event:', event.tag);
  
  if (event.tag === 'sync-cart-data') {
    event.waitUntil(syncCartData());
  }
});

// Sync cart data when back online
async function syncCartData() {
  try {
    console.log('[SW] Syncing cart data...');
    
    // Get pending cart operations from IndexedDB or localStorage
    const pendingOperations = await getPendingCartOperations();
    
    for (const operation of pendingOperations) {
      try {
        await processCartOperation(operation);
      } catch (error) {
        console.error('[SW] Failed to sync cart operation:', error);
      }
    }
    
    console.log('[SW] Cart sync completed');
  } catch (error) {
    console.error('[SW] Cart sync failed:', error);
  }
}

// Helper functions for cart sync
async function getPendingCartOperations() {
  // In a real implementation, this would read from IndexedDB
  // For now, return empty array
  return [];
}

async function processCartOperation(operation) {
  // Process individual cart operations
  console.log('[SW] Processing cart operation:', operation);
}

// Push notification handling
self.addEventListener('push', event => {
  console.log('[SW] Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New content available in StreamList Pro!',
    icon: '/images/icon-192x192.png',
    badge: '/images/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View StreamList',
        icon: '/images/checkmark.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/images/close.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('StreamList Pro', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', event => {
  console.log('[SW] Notification click received');
  
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message handling for communication with main app
self.addEventListener('message', event => {
  console.log('[SW] Message received:', event.data);

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      cacheUrls(event.data.urls)
    );
  }
});

// Cache additional URLs on demand
async function cacheUrls(urls) {
  const cache = await caches.open(RUNTIME_CACHE);
  await cache.addAll(urls);
  console.log('[SW] Additional URLs cached');
}