/**
 * Cloudflare Pages Middleware — intercepta TODO bajo /negocio/
 *
 * Página "puente" DINÁMICA para compartir un negocio: genera, en el momento
 * de la petición, un HTML con Open Graph que incluye la FOTO del negocio
 * (que los robots de WhatsApp/Facebook/X sí leen, porque viene en el HTML y
 * no depende de JavaScript).
 *
 * - El preview al compartir muestra la foto del negocio.
 * - Una PERSONA es redirigida al instante (302) a la ficha dentro del
 *   directorio: /comercio/?cat=<categoria>#<slug> (scroll + resaltado, lógica
 *   ya existente en comercio/page-script.js).
 * - Un ROBOT recibe el HTML con las etiquetas Open Graph (la foto).
 *
 * Se usa _middleware.js (en vez de [[path]].js) porque intercepta de forma
 * fiable cualquier ruta bajo /negocio/ —con o sin slash final— sin depender
 * de la resolución de parámetros de ruta. El slug se deriva del pathname.
 *
 * Datos: mismo proyecto y anon key públicos que el directorio
 * (comercio/page-script.js). La anon key ya es pública por diseño.
 */

const SUPABASE_URL = 'https://uuskvqtbsvtfsovcjazf.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1c2t2cXRic3Z0ZnNvdmNqYXpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2ODU4NDIsImV4cCI6MjEwMDI2MTg0Mn0.BbHI3ctSNg5msUnL9eENTNpOujQROAh6vUAZpFVcbBI';
const TABLE = 'negocios_directorio360';
const SITE = 'https://www.pomaire360.cl';
const OG_FALLBACK = SITE + '/og-image.jpg';

function esc(v) {
  return String(v == null ? '' : v)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function slugify(str) {
  return String(str || '')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function imagenAbsoluta(img) {
  if (!img) return OG_FALLBACK;
  if (/^https?:\/\//i.test(img)) return img;
  return SITE + (img.charAt(0) === '/' ? '' : '/') + img;
}

function primeraFoto(row) {
  const portada = row.imagen_principal || row.foto_portada || row.img || '';
  if (portada) return portada;
  const fotos = row.fotos || row.photos || [];
  if (Array.isArray(fotos) && fotos.length > 0) return fotos[0];
  return '';
}

/** Busca el negocio por slug (columna slug exacta; si no, por slug derivado
 * del nombre). */
async function buscarNegocio(slug) {
  let url =
    SUPABASE_URL + '/rest/v1/' + TABLE +
    '?select=*&slug=eq.' + encodeURIComponent(slug) + '&limit=1';
  let res = await fetch(url, {
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: 'Bearer ' + SUPABASE_ANON_KEY },
  });
  if (res.ok) {
    const arr = await res.json();
    if (Array.isArray(arr) && arr.length > 0) return arr[0];
  }

  url = SUPABASE_URL + '/rest/v1/' + TABLE + '?select=*';
  res = await fetch(url, {
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: 'Bearer ' + SUPABASE_ANON_KEY },
  });
  if (res.ok) {
    const arr = await res.json();
    if (Array.isArray(arr)) {
      return arr.find(function (r) {
        return (r.slug || slugify(r.nombre || r.n)) === slug;
      }) || null;
    }
  }
  return null;
}

function paginaHTML(row, slug, destino) {
  const nombre = (row && (row.nombre || row.n)) || 'Negocio en Pomaire';
  const descRaw = (row && (row.descripcion || row.desc)) || '';
  const desc = descRaw
    ? (descRaw.length > 200 ? descRaw.slice(0, 197) + '…' : descRaw)
    : nombre + ' en Pomaire — directorio de negocios de Pomaire 360.';
  const ogImg = imagenAbsoluta(row ? primeraFoto(row) : '');
  const canonical = SITE + '/negocio/' + encodeURIComponent(slug) + '/';
  const titulo = nombre + ' — Pomaire 360';

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(titulo)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${esc(canonical)}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Pomaire 360">
<meta property="og:title" content="${esc(titulo)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:image" content="${esc(ogImg)}">
<meta property="og:image:alt" content="${esc(nombre)} — Pomaire 360">
<meta property="og:locale" content="es_CL">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(titulo)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${esc(ogImg)}">
<meta http-equiv="refresh" content="0; url=${esc(destino)}">
<link rel="icon" href="/favicon.ico" sizes="any">
<script>window.location.replace(${JSON.stringify(destino)});</script>
<style>
  body{font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;background:#FAFAF7;color:#2D1A0A;display:flex;min-height:100vh;align-items:center;justify-content:center;margin:0;text-align:center;padding:2rem}
  a{color:#B84A32;font-weight:700}
  img{max-width:280px;border-radius:16px;margin-bottom:1rem;box-shadow:0 8px 24px rgba(0,0,0,.12)}
</style>
</head>
<body>
  <div>
    ${ogImg ? `<img src="${esc(ogImg)}" alt="${esc(nombre)}">` : ''}
    <h1>${esc(nombre)}</h1>
    <p>Abriendo su ficha en Pomaire 360…</p>
    <p><a href="${esc(destino)}">Ver ${esc(nombre)} en el directorio →</a></p>
  </div>
</body>
</html>`;
}

export async function onRequest(context) {
  const url = new URL(context.request.url);

  // Slug = primer segmento tras /negocio/ (soporta slash final y mayúsculas).
  const partes = url.pathname.split('/').filter(Boolean); // ["negocio","<slug>"]
  const slug = slugify(decodeURIComponent(partes[1] || ''));

  // Si no hay slug, al directorio.
  if (!slug) {
    return Response.redirect(SITE + '/comercio/', 302);
  }

  let row = null;
  try {
    row = await buscarNegocio(slug);
  } catch (e) {
    row = null;
  }

  const categoria = (row && (row.categoria || row._categoria)) || '';
  const destino =
    SITE + '/comercio/' + (categoria ? '?cat=' + encodeURIComponent(categoria) : '') +
    '#' + encodeURIComponent(slug);

  // Robot de redes (preview) vs. persona.
  const ua = (context.request.headers.get('user-agent') || '').toLowerCase();
  const esBot = /bot|facebookexternalhit|facebot|whatsapp|twitterbot|telegrambot|slackbot|discordbot|linkedinbot|pinterest|embedly|redditbot|skypeuripreview|googlebot|bingbot|applebot|vkshare|w3c_validator|preview/.test(ua);

  if (!esBot) {
    // Persona: redirección inmediata a la ficha (no ve la URL puente).
    return new Response(null, {
      status: 302,
      headers: { location: destino, 'cache-control': 'no-store' },
    });
  }

  // Robot: HTML con Open Graph (foto del negocio).
  // CSP propia y laxa SOLO para esta página puente: permite el <script> y la
  // <img> inline del redirect/preview (la CSP global del sitio, pensada para
  // páginas con hashes, bloquearía el inline). La redirección real funciona
  // igual vía <meta refresh>, que CSP no bloquea.
  return new Response(paginaHTML(row, slug, destino), {
    status: 200,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'public, max-age=300, s-maxage=600',
      'content-security-policy':
        "default-src 'self'; script-src 'unsafe-inline'; img-src 'self' https: data:; style-src 'unsafe-inline'; base-uri 'self'",
    },
  });
}
