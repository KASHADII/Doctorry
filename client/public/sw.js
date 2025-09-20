const CACHE_NAME = 'doctorry-v1';
const STATIC_CACHE_NAME = 'doctorry-static-v1';
const DYNAMIC_CACHE_NAME = 'doctorry-dynamic-v1';

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/src/main.jsx',
  '/src/App.jsx',
  '/src/index.css',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/offline.html'
];

// API routes to cache
const API_ROUTES = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/appointments',
  '/api/doctors',
  '/api/users'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .catch((error) => {
        console.error('Service Worker: Failed to cache static files', error);
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle different types of requests
  if (request.method === 'GET') {
    // Static files - cache first strategy
    if (STATIC_FILES.includes(url.pathname) || url.pathname.startsWith('/src/') || url.pathname.startsWith('/assets/')) {
      event.respondWith(cacheFirst(request, STATIC_CACHE_NAME));
    }
    // API requests - network first with cache fallback
    else if (url.pathname.startsWith('/api/')) {
      event.respondWith(networkFirst(request, DYNAMIC_CACHE_NAME));
    }
    // Images - cache first strategy
    else if (request.destination === 'image') {
      event.respondWith(cacheFirst(request, DYNAMIC_CACHE_NAME));
    }
    // Other requests - network first
    else {
      event.respondWith(networkFirst(request, DYNAMIC_CACHE_NAME));
    }
  }
});

// Cache first strategy
async function cacheFirst(request, cacheName) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('Cache first strategy failed:', error);
    // Return offline page for navigation requests
    if (request.destination === 'document') {
      return caches.match('/offline.html');
    }
    throw error;
  }
}

// Network first strategy
async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Network failed, trying cache:', error);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for navigation requests
    if (request.destination === 'document') {
      return caches.match('/offline.html');
    }
    
    throw error;
  }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync', event.tag);
  
  if (event.tag === 'appointment-sync') {
    event.waitUntil(syncAppointments());
  }
});

// Sync appointments when back online
async function syncAppointments() {
  try {
    // Get pending appointments from IndexedDB
    const pendingAppointments = await getPendingAppointments();
    
    for (const appointment of pendingAppointments) {
      try {
        const response = await fetch('/api/appointments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(appointment)
        });
        
        if (response.ok) {
          // Remove from pending appointments
          await removePendingAppointment(appointment.id);
        }
      } catch (error) {
        console.error('Failed to sync appointment:', error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push received');
  
  const options = {
    body: event.data ? event.data.text() : 'You have a new notification',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View',
        icon: '/icons/icon-192x192.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/icon-192x192.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Doctorry', options)
  );
});

// Notification click
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked');
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Helper functions for IndexedDB
async function getPendingAppointments() {
  try {
    const db = await openDB();
    const transaction = db.transaction(['pendingAppointments'], 'readonly');
    const store = transaction.objectStore('pendingAppointments');
    const request = store.getAll();
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error getting pending appointments:', error);
    return [];
  }
}

async function removePendingAppointment(id) {
  try {
    const db = await openDB();
    const transaction = db.transaction(['pendingAppointments'], 'readwrite');
    const store = transaction.objectStore('pendingAppointments');
    const request = store.delete(id);
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        console.log('Removed pending appointment:', id);
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error removing pending appointment:', error);
  }
}

// Open IndexedDB
async function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('DoctorryDB', 1);
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      if (!db.objectStoreNames.contains('pendingAppointments')) {
        db.createObjectStore('pendingAppointments', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}
