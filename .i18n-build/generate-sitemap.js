#!/usr/bin/env node
/*
 * Regenera sitemap.xml con las 60 URLs del sitio (20 páginas x 3 idiomas
 * estáticos: es/en/pt), cada una con su bloque xhtml:link hreflang
 * apuntando a los otros dos idiomas + x-default (apuntando siempre a la
 * versión en español, el idioma principal del sitio).
 *
 * Conserva lastmod/changefreq/priority definidos por página en SITEMAP_META
 * (tomados del sitemap.xml original) para las 3 variantes de idioma de
 * cada página.
 *
 * Uso: node generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const pageMap = require('./page-map');

const REPO_ROOT = path.resolve(__dirname, '..');
const SITE = 'https://www.pomaire360.cl';

// Metadata original por slug, tomada del sitemap.xml previo a este cambio.
// NOTA: Se excluyen slugs con 301 redirect activo en _redirects para evitar
// señales mixtas a Google (gastronomia, alojamientos, alrededores, que-ver,
// locomocion, gruas redirigen a URLs nuevas).
const SITEMAP_META = {
  index: { lastmod: '2026-08-08', changefreq: 'weekly', priority: '1.0' },
  elchanchoalcanciamasgrandedelmundo: { lastmod: '2026-08-01', changefreq: 'monthly', priority: '0.8' },
  estacionamientos: { lastmod: '2026-07-15', changefreq: 'monthly', priority: '0.7' },
  salud: { lastmod: '2026-07-15', changefreq: 'monthly', priority: '0.7' },
  seguridad: { lastmod: '2026-07-15', changefreq: 'monthly', priority: '0.7' },
  comercio: { lastmod: '2026-07-15', changefreq: 'monthly', priority: '0.7' },
  alfareria: { lastmod: '2026-08-01', changefreq: 'weekly', priority: '0.9' },
  'ruta-del-vino': { lastmod: '2026-07-20', changefreq: 'monthly', priority: '0.8' },
  'guia-turistica': { lastmod: '2026-08-08', changefreq: 'weekly', priority: '0.9' },
  plaza: { lastmod: '2026-07-15', changefreq: 'monthly', priority: '0.7' },
  anunciate: { lastmod: '2026-07-01', changefreq: 'monthly', priority: '0.5' },
  apoyar: { lastmod: '2026-07-01', changefreq: 'monthly', priority: '0.5' },
  sugerencias: { lastmod: '2026-07-01', changefreq: 'monthly', priority: '0.5' },
  juegos: { lastmod: '2026-07-04', changefreq: 'monthly', priority: '0.4' },
  links: { lastmod: '2026-07-18', changefreq: 'monthly', priority: '0.4' }
};

// Orden de aparición — excluye slugs con 301 redirect activo.
const SLUG_ORDER = [
  'index', 'guia-turistica', 'elchanchoalcanciamasgrandedelmundo', 'estacionamientos', 'salud',
  'seguridad', 'comercio', 'alfareria', 'ruta-del-vino',
  'plaza', 'anunciate', 'apoyar',
  'sugerencias', 'juegos', 'links'
];

const LANG_HREFLANG = { es: 'es', en: 'en', pt: 'pt' };

function urlBlock(slug, lang) {
  const meta = SITEMAP_META[slug];
  const loc = SITE + pageMap.langPath(slug, lang);
  const xdefault = SITE + pageMap.langPath(slug, 'es');
  const alternates = ['es', 'en', 'pt'].map(l =>
    `    <xhtml:link rel="alternate" hreflang="${LANG_HREFLANG[l]}" href="${SITE + pageMap.langPath(slug, l)}"/>`
  ).join('\n');
  return [
    '  <url>',
    `    <loc>${loc}</loc>`,
    `    <lastmod>${meta.lastmod}</lastmod>`,
    `    <changefreq>${meta.changefreq}</changefreq>`,
    `    <priority>${meta.priority}</priority>`,
    alternates,
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${xdefault}"/>`,
    '  </url>'
  ].join('\n');
}

function main() {
  const blocks = [];
  for (const slug of SLUG_ORDER) {
    for (const lang of ['es', 'en', 'pt']) {
      blocks.push(urlBlock(slug, lang));
    }
  }
  const xml = '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n' +
    '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' +
    blocks.join('\n') + '\n' +
    '</urlset>\n';
  fs.writeFileSync(path.join(REPO_ROOT, 'sitemap.xml'), xml, 'utf8');
  console.log(`Wrote sitemap.xml with ${blocks.length} URLs (${SLUG_ORDER.length} slugs x 3 langs).`);
}

main();
