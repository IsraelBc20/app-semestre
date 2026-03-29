const CACHE_NAME = 'app-calendario-v5';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Instala el Service Worker y guarda los archivos básicos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Intercepta las peticiones de red para usar la memoria caché si estás offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Devuelve la versión guardada
        }
        return fetch(event.request); // Si no está guardado, lo busca en internet
      })
  );
});

// Elimina las cachés antiguas cuando se activa una nueva versión
self.addEventListener('activate', event => {
  const cacheAllowlist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheAllowlist.indexOf(cacheName) === -1) {
            // Si la caché no es la actual, la borra
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});