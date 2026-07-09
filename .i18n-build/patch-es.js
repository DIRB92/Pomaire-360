#!/usr/bin/env node
/*
 * Aplica a las 20 páginas ES originales, mediante reemplazo de texto
 * quirúrgico (NO cheerio, para no reformatear el resto del archivo):
 *
 *   1) El bloque hreflang real es/en/pt + x-default, reemplazando cualquier
 *      bloque hreflang roto preexistente (p.ej. el ?lang= del home).
 *   2) og:locale:alternate para en_US/pt_BR si no existían ya.
 *   3) El selector de idioma: los botones es/en/pt pasan a ser <a> reales de
 *      navegación a la página ES actual / /en/slug/ / /pt/slug/. Los botones
 *      fr/ru/ja/zh quedan intactos (swap dinámico vía subi18n.js).
 *
 * No toca ninguna otra línea del archivo.
 *
 * Uso: node patch-es.js
 */
const fs = require('fs');
const path = require('path');

const pageMap = require('./page-map');
const { hreflangBlock } = require('./head-utils');

const REPO_ROOT = path.resolve(__dirname, '..');

const LABEL = { es: ['🇨🇱', 'Español'], en: ['🇬🇧', 'English'], pt: ['🇧🇷', 'Português'] };

function buildLangOptionHtml(lang, slug, indent) {
  const [flag, name] = LABEL[lang];
  const active = lang === 'es' ? ' lang-active' : '';
  const href = pageMap.langPath(slug, lang);
  return `${indent}<a role="option" class="lang-option${active}" data-lang="${lang}" href="${href}">\n` +
    `${indent}  <span class="lang-flag">${flag}</span><span class="lang-name">${name}</span><span class="lang-check">✓</span>\n` +
    `${indent}</a>`;
}

// Reemplaza el <button ... data-lang="LANG" onclick="selectLang('LANG')">...</button>
// (2 o 3 líneas) por el <a> de navegación real equivalente, preservando la
// indentación original del bloque.
function replaceLangButton(html, lang, slug) {
  const re = new RegExp(
    `([ \\t]*)<button type="button" role="option" class="lang-option( lang-active)?" data-lang="${lang}" onclick="selectLang\\('${lang}'\\)">\\n` +
    `[ \\t]*<span class="lang-flag">[^<]*</span><span class="lang-name">[^<]*</span><span class="lang-check">[^<]*</span>\\n` +
    `[ \\t]*</button>`,
    'm'
  );
  const match = html.match(re);
  if (!match) return { html, replaced: false };
  const indent = match[1];
  const replacement = buildLangOptionHtml(lang, slug, indent);
  return { html: html.slice(0, match.index) + replacement + html.slice(match.index + match[0].length), replaced: true };
}

function patchOne(slug) {
  const entry = pageMap[slug];
  const filePath = path.join(REPO_ROOT, entry.file);
  let html = fs.readFileSync(filePath, 'utf8');
  const notes = [];

  // 1) hreflang: elimina cualquier bloque previo de <link rel="alternate" hreflang=...>
  //    (puede haber 0, como en subpáginas, u 8 líneas rotas con ?lang=, como en el home)
  const hreflangLineRe = /^[ \t]*<link rel="alternate" hreflang="[^"]*"[^>]*>\n?/gm;
  const beforeLen = html.length;
  html = html.replace(hreflangLineRe, '');
  if (html.length !== beforeLen) notes.push('removed old hreflang block');

  const newBlock = hreflangBlock(slug) + '\n';
  const canonicalRe = /(<link rel="canonical" href="[^"]*">\n)/;
  if (canonicalRe.test(html)) {
    html = html.replace(canonicalRe, `$1${newBlock}`);
    notes.push('inserted hreflang after canonical');
  } else {
    html = html.replace('</head>', newBlock + '</head>');
    notes.push('inserted hreflang before </head> (no canonical found)');
  }

  // 2) og:locale:alternate para en_US / pt_BR, solo si faltan.
  const hasEn = /<meta property="og:locale:alternate" content="en_US">/.test(html);
  const hasPt = /<meta property="og:locale:alternate" content="pt_BR">/.test(html);
  if (!hasEn || !hasPt) {
    const localeRe = /(<meta property="og:locale" content="[^"]*">\n)/;
    if (localeRe.test(html)) {
      let insert = '';
      if (!hasEn) insert += '<meta property="og:locale:alternate" content="en_US">\n';
      if (!hasPt) insert += '<meta property="og:locale:alternate" content="pt_BR">\n';
      html = html.replace(localeRe, `$1${insert}`);
      notes.push('inserted og:locale:alternate en_US/pt_BR');
    }
  }

  // 3) Selector de idioma -> botones es/en/pt se convierten en <a> reales.
  let replacedCount = 0;
  for (const lang of ['es', 'en', 'pt']) {
    const result = replaceLangButton(html, lang, slug);
    html = result.html;
    if (result.replaced) replacedCount++;
  }
  notes.push(`replaced ${replacedCount}/3 lang buttons`);

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(entry.file, '->', notes.join('; '));
}

function main() {
  const slugs = Object.keys(pageMap).filter(k => typeof pageMap[k] === 'object' && !Array.isArray(pageMap[k]));
  slugs.forEach(patchOne);
  console.log(`\nPatched ${slugs.length} ES pages.`);
}

main();
