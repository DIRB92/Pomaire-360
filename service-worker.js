/* Pomaire 360 — Service Worker
   Permite usar la guía sin conexión (emergencias, mapa base, directorio, recorrido).
   Estrategia:
   - Navegaciones: network-first con respaldo en caché (offline).
   - Recursos estáticos: cache-first con actualización en segundo plano.
   - Tiles del mapa y API de clima: siempre red (no se interceptan). */

const CACHE = 'pomaire360-v18';

// Solo recursos del mismo origen. Las peticiones cross-origin (Leaflet, fuentes)
// NO se interceptan: las gestiona el navegador para evitar conflictos con
// respuestas "opaque" en peticiones en modo CORS.
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

  // No interceptar: tiles del mapa (OSM) ni API de clima (Open-Meteo) → siempre red.
  if (url.hostname.indexOf('tile.openstreetmap') !== -1 ||
      url.hostname.indexOf('api.open-meteo') !== -1) {
    return;
  }

  // No interceptar peticiones cross-origin (Leaflet CSS/JS de cdnjs, fuentes, etc.).
  // Si el SW devolvía una respuesta "opaque" cacheada para una petición en modo
  // CORS (como <link rel="stylesheet" crossorigin>), el navegador la rechazaba con
  // "an 'opaque' response was used for a request whose type is not 'no-cors'".
  // Dejamos que el navegador gestione estas peticiones directamente.
  if (url.origin !== self.location.origin) {
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
          caches.match(req)
            .then((r) => r || caches.match(fallbackHomeFor(url.pathname)))
            .then((r) => r || new Response(
              '<!doctype html><meta charset="utf-8"><title>Sin conexión</title>' +
              '<p style="font-family:sans-serif;padding:2rem">Sin conexión. Vuelve a intentarlo cuando tengas internet.</p>',
              { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
            ))
        )
    );
    return;
  }

  // Recursos estáticos: caché primero, actualizando en segundo plano.
  // IMPORTANTE: respondWith() debe resolver SIEMPRE con un Response válido. Si
  // devolvía undefined (no había copia en caché y la red fallaba) el navegador
  // lanzaba "Failed to convert value to 'Response'". Aquí garantizamos que
  // siempre se devuelve un Response, incluso un 504 sintético como último recurso.
  e.respondWith(
    caches.match(req).then((cached) => {
      if (cached) {
        // Refresca en segundo plano sin bloquear la respuesta.
        e.waitUntil(
          fetch(req)
            .then((res) => {
              if (res && (res.ok || res.type === 'opaque')) {
                const copy = res.clone();
                return caches.open(CACHE).then((c) => c.put(req, copy));
              }
            })
            .catch(() => {})
        );
        return cached;
      }

      // No hay copia en caché → ir a la red y cachear si procede.
      return fetch(req)
        .then((res) => {
          if (res && (res.ok || res.type === 'opaque')) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
          }
          return res;
        })
        .catch(() =>
          // Sin caché y sin red: devolver un Response válido en vez de undefined.
          new Response('', { status: 504, statusText: 'Offline' })
        );
    })
  );
});
