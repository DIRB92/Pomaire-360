const pageMap = require('./page-map');

const SITE = 'https://www.pomaire360.cl';
const LOCALE_MAP = { es: 'es_CL', en: 'en_US', pt: 'pt_BR' };

// Construye el bloque <link rel="alternate" hreflang="..."> para el clúster
// es/en/pt de una página, más x-default apuntando a la versión en español.
function hreflangBlock(slug) {
  const es = SITE + pageMap.langPath(slug, 'es');
  const en = SITE + pageMap.langPath(slug, 'en');
  const pt = SITE + pageMap.langPath(slug, 'pt');
  return [
    `<link rel="alternate" hreflang="es" href="${es}">`,
    `<link rel="alternate" hreflang="en" href="${en}">`,
    `<link rel="alternate" hreflang="pt" href="${pt}">`,
    `<link rel="alternate" hreflang="x-default" href="${es}">`
  ].join('\n');
}

// Aplica metadata (title, description, OG, Twitter) traducida sobre un $ (cheerio)
// ya cargado. `meta` es el objeto {title, description, ogTitle, ogDescription,
// ogImageAlt, twitterTitle, twitterDescription} para el idioma destino.
function applyMetadata($, meta, lang, slug) {
  const url = SITE + pageMap.langPath(slug, lang);
  if (meta.title) $('title').text(meta.title);
  if (meta.description) $('meta[name="description"]').attr('content', meta.description);
  if (meta.ogTitle) $('meta[property="og:title"]').attr('content', meta.ogTitle);
  if (meta.ogDescription) $('meta[property="og:description"]').attr('content', meta.ogDescription);
  if (meta.ogImageAlt) $('meta[property="og:image:alt"]').attr('content', meta.ogImageAlt);
  if (meta.twitterTitle) $('meta[name="twitter:title"]').attr('content', meta.twitterTitle);
  if (meta.twitterDescription) $('meta[name="twitter:description"]').attr('content', meta.twitterDescription);
  $('meta[property="og:url"]').attr('content', url);
  $('link[rel="canonical"]').attr('href', url);
  $('meta[property="og:locale"]').attr('content', LOCALE_MAP[lang] || 'es_CL');
  $('html').attr('lang', lang === 'es' ? 'es' : lang);
}

// Inserta (o reemplaza) el bloque hreflang dentro del <head>.
// Elimina cualquier bloque hreflang previo (p. ej. el ?lang= roto del home)
// antes de insertar el nuevo, para no duplicar ni dejar enlaces incorrectos.
function injectHreflang($, slug) {
  $('link[rel="alternate"][hreflang]').remove();
  const block = hreflangBlock(slug);
  const canonical = $('link[rel="canonical"]');
  if (canonical.length) {
    canonical.after('\n' + block);
  } else {
    $('head').append('\n' + block + '\n');
  }
}

module.exports = { SITE, LOCALE_MAP, hreflangBlock, applyMetadata, injectHreflang };
