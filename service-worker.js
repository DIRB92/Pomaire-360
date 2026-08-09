/* Pomaire 360 — Service Worker
   Permite usar la guía sin conexión (emergencias, mapa base, directorio, recorrido).
   Estrategia:
   - Navegaciones: network-first con respaldo en caché (offline).
   - Recursos estáticos: cache-first con actualización en segundo plano.
   - Tiles del mapa y API de clima: siempre red (no se interceptan). */

const CACHE = 'pomaire360-v15';

// Solo recursos del mismo origen (cross-origin como Leaflet se cachea en runtime).
// Incluye el home en los 3 idiomas con página estática (es/en/pt) para que el
// respaldo offline funcione en el idioma correcto, no solo en español.
const CORE = [
  '/',
  '/index.html',
  '/en/',
  '/pt/',
  '/apoyar/',
  '/sugerencias/',
  '/style-2026.css',
  '/components.css',
  '/dark-mode-overrides.css',
  '/app.js',
  '/dark-mode.js',
  '/site.webmanifest',
  '/favicon-32x32.png',
  '/favicon-96x96.png',
  '/android-chrome-192x192.png',
  '/android-chrome-512x512.png',
  '/apple-touch-icon.png',
  '/mapa-oficial-pomaire.webp'
];

// Home de respaldo por idioma: si una navegación falla y no hay copia en
// caché de la URL exacta, se ofrece el home cacheado del mismo idioma en
// vez de forzar siempre la versión en español.
function fallbackHomeFor(pathname) {
  if (pathname.indexOf('/en/') === 0) return '/en/';
  if (pathname.indexOf('/pt/') === 0) return '/pt/';
  return '/index.html';
}

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
  // Tampoco interceptar llamadas a Supabase (API en tiempo real) ni CDNs externos.
  if (url.hostname.indexOf('tile.openstreetmap') !== -1 ||
      url.hostname.indexOf('api.open-meteo') !== -1 ||
      url.hostname.indexOf('supabase.co') !== -1 ||
      url.hostname.indexOf('cdnjs.cloudflare.com') !== -1 ||
      url.hostname.indexOf('cloudflare.com') !== -1 ||
      url.hostname.indexOf('googleapis.com') !== -1 ||
      url.hostname.indexOf('googletagmanager.com') !== -1) {
    return;
  }

  // Navegaciones (abrir el sitio): red primero, respaldo en caché si no hay conexión.
  // Cada página se guarda bajo su propia URL (antes se guardaba siempre bajo
  // '/index.html', lo que hacía que el respaldo offline de /en/ o /pt/
  // mostrara por error el home en español).
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
          return res;
        })
        .catch(() =>
          caches.match(req).then((r) => r || caches.match(fallbackHomeFor(url.pathname)))
        )
    );
    return;
  }

  // Recursos estáticos: caché primero, actualizando en segundo plano.
  e.respondWith(
    caches.match(req).then(function(cached) {
      var network = fetch(req)
        .then(function(res) {
          if (res && res.status === 200 && res.type === 'basic') {
            var copy = res.clone();
            caches.open(CACHE).then(function(c) { c.put(req, copy); }).catch(function() {});
          }
          return res;
        })
        .catch(function() { return cached; });
      return cached || network;
    }).catch(function() {
      return fetch(req);
    })
  );
});
