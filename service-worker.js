/* Pomaire 360 — Service Worker
   Permite usar la guía sin conexión (emergencias, mapa base, directorio, recorrido).
   Estrategia:
   - Navegaciones: network-first con respaldo en caché (offline).
   - Recursos estáticos propios: cache-first con actualización en segundo plano.
   - CDN externos (Leaflet, etc.): network-first, cache solo si response.ok.
   - Tiles del mapa y API de clima: siempre red (no se interceptan).
   - Supabase API: siempre red (no se interceptan). */

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

  // ─── No interceptar: tiles del mapa, API clima, Supabase → siempre red ───
  if (url.hostname.indexOf('tile.openstreetmap') !== -1 ||
      url.hostname.indexOf('api.open-meteo') !== -1 ||
      url.hostname.indexOf('supabase.co') !== -1) {
    return;
  }

  // ─── Navegaciones: network-first con respaldo en caché ───
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
          }
          return res;
        })
        .catch(() =>
          caches.match(req).then((r) => r || caches.match(fallbackHomeFor(url.pathname)))
        )
    );
    return;
  }

  // ─── CDN externos (cross-origin): network-first, cache solo si ok ───
  // No cachear respuestas opaque (status 0) porque no podemos verificar
  // si son válidas y causan TypeError al intentar usarlas después.
  if (url.origin !== self.location.origin) {
    e.respondWith(
      fetch(req)
        .then((res) => {
          // Solo cachear respuestas exitosas y no-opaque de CDNs de confianza
          if (res && res.ok && res.type !== 'opaque') {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
          }
          return res;
        })
        .catch(() =>
          caches.match(req).then((r) => r || new Response('', { status: 503, statusText: 'Offline' }))
        )
    );
    return;
  }

  // ─── Recursos estáticos propios (same-origin): cache-first ───
  e.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
          }
          return res;
        })
        .catch(() => cached);

      // Si hay cache, devolver inmediatamente (y actualizar en background)
      // Si no hay cache, esperar la red; si la red también falla, devolver 503
      return cached || network.then((r) => r || new Response('', { status: 503, statusText: 'Offline' }));
    })
  );
});
