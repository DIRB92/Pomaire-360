#!/usr/bin/env node
/**
 * build-negocios-og.js — Genera una página "puente" por negocio para que, al
 * compartir el enlace en WhatsApp/redes, el preview muestre la FOTO del
 * negocio (Open Graph estático que los robots sí leen, porque viene en el
 * HTML y no depende de JavaScript).
 *
 * Cada página se crea en:  /negocio/<slug>/index.html
 * y:
 *   - Lleva og:image / og:title / og:description del negocio en el HTML.
 *   - Redirige automáticamente a la ficha dentro del directorio:
 *       /comercio/?cat=<categoria>#<slug>
 *     (meta refresh + redirección JS inmediata). Los robots de redes NO
 *     siguen la redirección: se quedan con las etiquetas OG. Las personas sí
 *     son llevadas a la ficha al instante.
 *
 * Se ejecuta en build-time, igual que build-directory.js:
 *   node build-negocios-og.js
 *
 * Variables de entorno requeridas:
 *   SUPABASE_URL         — URL del proyecto Supabase
 *   SUPABASE_SERVICE_KEY — Service role key
 */
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Faltan variables de entorno: SUPABASE_URL y SUPABASE_SERVICE_KEY');
  process.exit(1);
}

const TABLE = 'negocios_directorio360';
const SITE = 'https://www.pomaire360.cl';
const OUT_DIR = path.resolve(__dirname, 'negocio');
const OG_FALLBACK = SITE + '/og-image.jpg';

/** Escapa texto para insertarlo con seguridad en atributos/contenido HTML. */
function esc(v) {
  return String(v == null ? '' : v)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** slug a prueba de datos faltantes (igual criterio que el front). */
function slugify(str) {
  return String(str || '')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/** Asegura URL absoluta para og:image (los robots exigen URL completa). */
function imagenAbsoluta(img) {
  if (!img) return OG_FALLBACK;
  if (/^https?:\/\//i.test(img)) return img;
  return SITE + (img.charAt(0) === '/' ? '' : '/') + img;
}

/** Primera foto del negocio: portada, o la primera de la galería. */
function primeraFoto(row) {
  var portada = row.imagen_principal || row.foto_portada || row.img || '';
  if (portada) return portada;
  var fotos = row.fotos || row.photos || [];
  if (Array.isArray(fotos) && fotos.length > 0) return fotos[0];
  return '';
}

/** HTML de la página puente de un negocio. */
function paginaHTML(row) {
  const nombre = row.nombre || row.n || 'Negocio en Pomaire';
  const slug = row.slug || slugify(nombre);
  const categoria = row.categoria || row._categoria || '';
  const descRaw = row.descripcion || row.desc || '';
  const desc = descRaw
    ? (descRaw.length > 200 ? descRaw.slice(0, 197) + '…' : descRaw)
    : `${nombre} en Pomaire — directorio de negocios de Pomaire 360.`;
  const ogImg = imagenAbsoluta(primeraFoto(row));

  // Destino real dentro del directorio (misma ficha, con scroll + resaltado).
  const destino =
    '/comercio/' + (categoria ? '?cat=' + encodeURIComponent(categoria) : '') + '#' + encodeURIComponent(slug);
  const canonical = SITE + '/negocio/' + encodeURIComponent(slug) + '/';
  const titulo = `${nombre} — Pomaire 360`;

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(titulo)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${esc(canonical)}">

<!-- Open Graph: el preview al compartir muestra la foto del negocio -->
<meta property="og:type" content="article">
<meta property="og:site_name" content="Pomaire 360">
<meta property="og:title" content="${esc(titulo)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:image" content="${esc(ogImg)}">
<meta property="og:image:alt" content="${esc(nombre)} — Pomaire 360">
<meta property="og:locale" content="es_CL">

<!-- Twitter / X -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(titulo)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${esc(ogImg)}">

<!-- Las personas son llevadas de inmediato a la ficha en el directorio.
     Los robots de redes se quedan con las etiquetas OG de arriba. -->
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
</html>
`;
}

async function main() {
  console.log('🔄 Descargando negocios desde Supabase...');
  const url = `${SUPABASE_URL}/rest/v1/${TABLE}?select=*&order=updated_at.desc`;
  const res = await fetch(url, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    console.error(`❌ Error Supabase: ${res.status} ${res.statusText}`);
    console.error(await res.text());
    process.exit(1);
  }

  const rows = await res.json();
  console.log(`✅ ${rows.length} negocios descargados`);

  // Carpeta de salida limpia (evita páginas de negocios que ya no existen).
  if (fs.existsSync(OUT_DIR)) {
    fs.rmSync(OUT_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(OUT_DIR, { recursive: true });

  let generadas = 0;
  const vistos = new Set();
  for (const row of rows) {
    const slug = row.slug || slugify(row.nombre || row.n || '');
    if (!slug || vistos.has(slug)) continue;
    vistos.add(slug);

    const dir = path.join(OUT_DIR, slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), paginaHTML(row), 'utf-8');
    generadas++;
  }

  console.log(`\n📁 ${generadas} páginas generadas en /negocio/<slug>/index.html`);
  console.log('🚀 Listo para deploy');
}

main().catch((err) => {
  console.error('❌ Error fatal:', err);
  process.exit(1);
});
