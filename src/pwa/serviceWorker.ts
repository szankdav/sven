/* eslint-disable no-console */
/* eslint-disable no-restricted-globals */
const CACHE_NAME = 'sventrics';
const urlsToCache = [
  '/index.html',
  '/manifest.json',
];

export {};
declare const self: ServiceWorkerGlobalScope;

// Install the service worker and cache files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log('Deleting old cache:', key);
            return caches.delete(key);
          }
          return null;
        })
      ))
  );
});

// Serve cached content when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
