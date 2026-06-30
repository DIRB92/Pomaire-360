/* Pomaire 360 — Service Worker
   Permite usar la guía sin conexión (emergencias, mapa base, directorio, recorrido).
   Estrategia:
   - Navegaciones: network-first con respaldo en caché (offline).
   - Recursos estáticos: cache-first con actualización en segundo plano.
   - Tiles del mapa y API de clima: siempre red (no se interceptan). */

const CACHE = 'pomaire360-v11';

// Solo recursos del mismo origen (cross-origin como Leaflet se cachea en runtime).
const CORE = [
  '/',
  '/index.html',
  '/apoyar/',
  '/sugerencias/',
  '/style.css',
  '/app.js',
  '/site.webmanifest',
  '/favicon-32x32.png',
  '/favicon-96x96.png',
  '/android-chrome-192x192.png',
  '/android-chrome-512x512.png',
  '/apple-touch-icon.png',
  '/mapa-oficial-pomaire.webp'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(CORE.map((u) => new Request(u, { cache: 'reload' }))))
      .catch(() => {})
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;

  let url;
  try { url = new URL(req.url); } catch (_) { return; }

  // No interceptar: tiles del mapa (OSM) ni API de clima (Open-Meteo) → siempre red.
  if (url.hostname.indexOf('tile.openstreetmap') !== -1 ||
      url.hostname.indexOf('api.open-meteo') !== -1) {
    return;
  }

  // Navegaciones (abrir el sitio): red primero, respaldo en caché si no hay conexión.
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put('/index.html', copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match(req).then((r) => r || caches.match('/index.html')))
    );
    return;
  }

  // Recursos estáticos: caché primero, actualizando en segundo plano.
  e.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          if (res && (res.ok || res.type === 'opaque')) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
