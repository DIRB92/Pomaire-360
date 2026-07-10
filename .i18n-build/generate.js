#!/usr/bin/env node
/*
 * Generador de páginas estáticas EN/PT para Pomaire 360.
 *
 * Toma cada página fuente en español, la traduce a inglés y portugués
 * reemplazando el contenido de las etiquetas data-t/data-ph-t con las
 * cadenas de langs.js (más los overrides inline de apoyar/locomocion/
 * sugerencias), reescribe metadata SEO (title, description, OG, Twitter,
 * canonical, hreflang), actualiza JSON-LD y reescribe los enlaces internos
 * para que apunten a las rutas /en/ o /pt/ correspondientes.
 *
 * Uso: node generate.js
 */
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const pageMap = require('./page-map');
const { loadLangs, extractInlineOverride, mergeForPage } = require('./langs-loader');
const { applyMetadata, injectHreflang } = require('./head-utils');

const REPO_ROOT = path.resolve(__dirname, '..');
const metadataI18n = require('./metadata_i18n.json');
const staticI18n = require('./static_content_i18n.json');
const juegosI18n = require('./juegos_i18n.json');
const breadcrumbI18n = require('./breadcrumb_i18n.json');
const jsonldBusinessI18n = require('./jsonld_business_i18n.json');
const indexAltI18n = require('./index_alt_i18n.json');
const faqI18n = require('./faq_i18n.json');
const REGION_I18N = { en: 'Metropolitan Region', pt: 'Região Metropolitana' };

const { LANGS: baseLangs, DIR_TAGS } = loadLangs(REPO_ROOT);

const TARGET_LANGS = ['en', 'pt'];

// ---------------------------------------------------------------------------
// Utilidades de reescritura de enlaces internos
// ---------------------------------------------------------------------------

// Todas las rutas conocidas del sitio (para saber cuáles reescribir con
// prefijo /en//pt/ y cuáles dejar igual, como assets o anclas puras).
const KNOWN_SLUGS = Object.keys(pageMap).filter(k => typeof pageMap[k] === 'object' && !Array.isArray(pageMap[k]));
const KNOWN_PATHS = new Set(KNOWN_SLUGS.map(s => pageMap[s].esPath));

function rewriteInternalHref(href, lang, currentSlug) {
  if (!href) return href;
  // No tocar anclas puras, externos, mailto, tel, protocolo relativo, o assets.
  if (/^(https?:)?\/\//i.test(href)) return href;
  if (/^(mailto:|tel:|javascript:|#)/i.test(href)) return href;
  if (/\.(pdf|jpg|jpeg|png|webp|ico|xml|txt|webmanifest|css|js)(\?|#|$)/i.test(href)) return href;

  // Caso especial: home usa anclas relativas puras (#mapa) y subpáginas usan
  // anclas absolutas al home (/#mapa, /plaza/#banos).
  if (href === '/') {
    return lang === 'es' ? '/' : '/' + lang + '/';
  }
  if (href.startsWith('/#')) {
    return (lang === 'es' ? '/' : '/' + lang + '/') + href.slice(1);
  }
  if (href.startsWith('#')) {
    // Ancla dentro de la propia página (solo ocurre en index.html) — se deja igual.
    return href;
  }

  // Separar path de hash (p.ej. /plaza/#banos)
  const hashIdx = href.indexOf('#');
  const purePath = hashIdx === -1 ? href : href.slice(0, hashIdx);
  const hash = hashIdx === -1 ? '' : href.slice(hashIdx);

  if (KNOWN_PATHS.has(purePath)) {
    const slug = KNOWN_SLUGS.find(s => pageMap[s].esPath === purePath);
    const newPath = pageMap.langPath(slug, lang);
    return newPath + hash;
  }

  // Ruta no reconocida (no debería pasar, pero por seguridad se deja igual).
  return href;
}

function rewriteLinks($, lang, slug) {
  $('a[href]').each((_, el) => {
    const $el = $(el);
    const newHref = rewriteInternalHref($el.attr('href'), lang, slug);
    $el.attr('href', newHref);
  });
}

// ---------------------------------------------------------------------------
// Traducción de data-t / data-ph-t usando el diccionario ya fusionado
// ---------------------------------------------------------------------------

function applyDataT($, langDict, lang) {
  $('[data-t]').each((_, el) => {
    const key = $(el).attr('data-t');
    const val = langDict[key] !== undefined ? langDict[key] : langDict[key];
    if (val !== undefined) $(el).html(val);
  });
  $('[data-ph-t]').each((_, el) => {
    const key = $(el).attr('data-ph-t');
    const val = langDict[key];
    if (val !== undefined) $(el).attr('placeholder', val);
  });
  // Traduce las etiquetas .dir-tag (directorio de comercios) usando DIR_TAGS,
  // igual que hace subi18n.js en el navegador.
  $('.dir-tag').each((_, el) => {
    const original = $(el).attr('data-tag');
    if (!original) return;
    const entry = DIR_TAGS[original];
    $(el).text(entry && entry[lang] ? entry[lang] : original);
  });
  $('html').attr('lang', lang);
}

// ---------------------------------------------------------------------------
// Actualiza el selector de idioma: marca el idioma activo, y hace que las
// opciones es/en/pt sean enlaces de navegación real (no solo swap de texto),
// preservando fr/ru/ja/zh como el swap dinámico original (subi18n.js).
// ---------------------------------------------------------------------------

const NAV_BURGER_ARIA = { en: 'Open menu', pt: 'Abrir menu' };

function patchNavAria($, lang) {
  const label = NAV_BURGER_ARIA[lang];
  if (label) $('#navBurger').attr('aria-label', label);
}

function patchLangSelector($, lang, slug) {
  const dropdown = $('.lang-dropdown');
  if (!dropdown.length) return;

  const labelByLang = { es: ['🇨🇱', 'Español'], en: ['🇬🇧', 'English'], pt: ['🇧🇷', 'Português'] };
  ['es', 'en', 'pt'].forEach(l => {
    const btn = dropdown.find(`.lang-option[data-lang="${l}"]`);
    if (!btn.length) return;
    const targetUrl = pageMap.langPath(slug, l);
    const isActive = l === lang;
    // Convierte el <button onclick="selectLang(...)"> en un <a> de navegación
    // real hacia la página estática del idioma correspondiente.
    btn.replaceWith(
      `<a role="option" class="lang-option${isActive ? ' lang-active' : ''}" data-lang="${l}" href="${targetUrl}">` +
      `<span class="lang-flag">${labelByLang[l][0]}</span><span class="lang-name">${labelByLang[l][1]}</span><span class="lang-check">✓</span>` +
      `</a>`
    );
  });

  // Refleja el idioma actual en el botón visible del selector.
  const flagMap = { en: '🇬🇧', pt: '🇧🇷' };
  const nameMap = { en: 'English', pt: 'Português' };
  if (flagMap[lang]) {
    $('#langCurrentFlag').text(flagMap[lang]);
    $('#langCurrentName').text(nameMap[lang]);
  }
}

// ---------------------------------------------------------------------------
// Traduce el bloque JSON-LD (BreadcrumbList / TouristAttraction / etc.)
// ---------------------------------------------------------------------------

function patchJsonLd($, lang, slug) {
  $('script[type="application/ld+json"]').each((_, el) => {
    const raw = $(el).contents().text();
    let data;
    try { data = JSON.parse(raw); } catch (e) { return; }

    const walk = (node) => {
      if (Array.isArray(node)) { node.forEach(walk); return; }
      if (!node || typeof node !== 'object') return;
      if (node['@type'] === 'BreadcrumbList' && Array.isArray(node.itemListElement)) {
        node.itemListElement.forEach(item => {
          if (item.name === 'Pomaire 360') {
            item.item = 'https://www.pomaire360.cl' + pageMap.langPath('index', lang);
          } else if (breadcrumbI18n[slug] && breadcrumbI18n[slug][lang]) {
            item.name = breadcrumbI18n[slug][lang];
          }
          if (typeof item.item === 'string' && item.item.startsWith('https://www.pomaire360.cl')) {
            const p = item.item.replace('https://www.pomaire360.cl', '');
            const known = KNOWN_SLUGS.find(s => pageMap[s].esPath === p);
            if (known) item.item = 'https://www.pomaire360.cl' + pageMap.langPath(known, lang);
          }
        });
      }
      if (node.url && typeof node.url === 'string' && node.url.startsWith('https://www.pomaire360.cl')) {
        const p = node.url.replace('https://www.pomaire360.cl', '');
        if (KNOWN_PATHS.has(p)) node.url = 'https://www.pomaire360.cl' + pageMap.langPath(slug, lang);
      }
      // Traduce el nombre/descripción del negocio principal de la página
      // (TouristAttraction / LodgingBusiness / FoodEstablishment / etc.)
      // Se restringe a una lista explícita de tipos "de negocio" (en vez de
      // una lista de exclusión) para no pisar por accidente el "name" de
      // otros nodos con forma similar, como los ListItem del breadcrumb.
      const BUSINESS_TYPES = ['TouristAttraction', 'LodgingBusiness', 'FoodEstablishment', 'LocalBusiness', 'Restaurant'];
      if (node['@type'] && BUSINESS_TYPES.includes(node['@type']) &&
          jsonldBusinessI18n[slug] && jsonldBusinessI18n[slug][lang] &&
          typeof node.name === 'string') {
        node.name = jsonldBusinessI18n[slug][lang].name;
        if (typeof node.description === 'string') node.description = jsonldBusinessI18n[slug][lang].description;
      }
      if (node['@type'] === 'PostalAddress' && node.addressRegion && REGION_I18N[lang]) {
        node.addressRegion = REGION_I18N[lang];
      }
      // Traduce las preguntas/respuestas del FAQPage del home (venía con una
      // mezcla bilingüe ES/EN en el original; homogeneiza al idioma destino).
      if (node['@type'] === 'Question' && faqI18n[lang]) {
        const dict = faqI18n[lang];
        if (dict[node.name]) node.name = dict[node.name];
        if (node.acceptedAnswer && dict[node.acceptedAnswer.text]) {
          node.acceptedAnswer.text = dict[node.acceptedAnswer.text];
        }
      }
      Object.values(node).forEach(walk);
    };
    walk(data);
    $(el).text(JSON.stringify(data, null, 2));
  });
}

// ---------------------------------------------------------------------------
// Reemplazo de contenido estático hardcodeado (páginas sin data-t):
// anunciate/, links/, juegos/
// ---------------------------------------------------------------------------

function patchAnunciate($, lang) {
  const t = staticI18n.anunciate[lang];
  $('.sub-hero h1').text(t.hero_h1);
  $('.sub-hero p').text(t.hero_p);

  const cards = $('.plan-card');
  // Gratis
  const free = cards.eq(0);
  free.find('.plan-name').text(t.plan_free_name);
  free.find('.plan-price-year').text(t.plan_free_period);
  free.find('.plan-feats li').each((i, el) => { if (t.plan_free_feats[i]) $(el).text(t.plan_free_feats[i]); });
  free.find('.plan-btn').text(t.plan_free_btn).attr('href',
    'https://wa.me/56957517166?text=' + encodeURIComponent(t.plan_free_wa_text));

  // Destacado
  const dest = cards.eq(1);
  dest.find('.plan-name').text(t.plan_dest_name);
  dest.find('.plan-price').html(t.plan_dest_price);
  dest.find('.plan-price-year').text(t.plan_dest_period);
  dest.find('.plan-feats li').each((i, el) => { if (t.plan_dest_feats[i]) $(el).text(t.plan_dest_feats[i]); });
  dest.find('.plan-btn').text(t.plan_dest_btn).attr('href',
    'https://wa.me/56957517166?text=' + encodeURIComponent(t.plan_dest_wa_text));

  // Premium
  const prem = cards.eq(2);
  prem.find('.plan-ribbon').text(t.plan_prem_ribbon);
  prem.find('.plan-name').text(t.plan_prem_name);
  prem.find('.plan-price').html(t.plan_prem_price);
  prem.find('.plan-price-year').text(t.plan_prem_period);
  prem.find('.plan-feats li').each((i, el) => { if (t.plan_prem_feats[i]) $(el).text(t.plan_prem_feats[i]); });
  prem.find('.plan-btn').text(t.plan_prem_btn).attr('href',
    'https://wa.me/56957517166?text=' + encodeURIComponent(t.plan_prem_wa_text));

  $('.plans-wa-btn').text(t.bottom_cta_btn).attr('href',
    'https://wa.me/56957517166?text=' + encodeURIComponent(t.bottom_cta_wa_text));
  $('.plans-note').html(t.bottom_note_html);
}

function patchLinks($, lang) {
  const t = staticI18n.links[lang];
  $('html').attr('lang', t.html_lang);
  $('title').text(t.title);
  $('meta[name="description"]').attr('content', t.description);
  $('meta[property="og:title"]').attr('content', t.ogTitle);
  $('meta[property="og:description"]').attr('content', t.ogDescription);
  $('meta[property="og:image:alt"]').attr('content', t.ogImageAlt);
  $('meta[name="twitter:title"]').attr('content', t.twitterTitle);
  $('meta[name="twitter:description"]').attr('content', t.twitterDescription);

  $('.links-header .tagline').text(t.tagline);
  $('.cta-btn').contents().last().replaceWith(' ' + t.cta_add_business);
  // El CTA usa URL absoluta con dominio (www.pomaire360.cl/anunciate/) en vez
  // de ruta relativa, así que no la toca rewriteLinks(); se reescribe aquí.
  $('.cta-btn').attr('href', 'https://www.pomaire360.cl/' + lang + '/anunciate/');
  $('.section-title').eq(0).text(t.section_social);
  $('.section-title').eq(1).text(t.section_explore);

  const labelKeys = ['label_pottery', 'label_food', 'label_seewhat', 'label_wine', 'label_lodging',
    'label_plaza', 'label_parking', 'label_map', 'label_games', 'label_pig'];
  $('.link-btn .label').each((i, el) => {
    if (labelKeys[i]) $(el).text(t[labelKeys[i]]);
  });

  $('.links-footer p').eq(0).text(t.footer_made);
  $('.links-footer p').eq(1).find('a').text(t.footer_visit);
}

// Traduce atributos alt/aria-label hardcodeados en el home que no usan
// data-t (imágenes de la galería tipo bento, y aria-label de los <select>
// del recorrido turístico interactivo).
function patchIndexAltText($, lang) {
  const dict = indexAltI18n[lang];
  if (!dict) return;
  $('img[alt], [aria-label]').each((_, el) => {
    const $el = $(el);
    const alt = $el.attr('alt');
    if (alt && dict[alt]) $el.attr('alt', dict[alt]);
    const aria = $el.attr('aria-label');
    if (aria) {
      if (aria.startsWith('Ver imagen: ')) {
        const rest = aria.replace('Ver imagen: ', '');
        const restTranslated = dict[rest] || rest;
        const prefix = lang === 'en' ? 'View image: ' : 'Ver imagem: ';
        $el.attr('aria-label', prefix + restTranslated);
      } else if (aria === 'Destacado: El Chancho alcancía de greda más grande del mundo') {
        $el.attr('aria-label', lang === 'en'
          ? 'Featured: The world\'s largest clay piggy bank'
          : 'Destaque: O maior cofrinho de barro do mundo');
      } else if (aria === 'Taller de greda') {
        $el.attr('aria-label', lang === 'en' ? 'Pottery workshop' : 'Ateliê de barro');
      } else if (aria === 'Compras de greda') {
        $el.attr('aria-label', lang === 'en' ? 'Pottery shopping' : 'Compras de barro');
      }
    }
  });
}

// Reemplaza el nodo de texto suelto dentro de un .hud-pill (el texto
// "Puntos: " que está entre el <span class="ico"> y el <b> del contador),
// sin tocar los elementos hermanos (ícono y contador en vivo).
function setHudLabel($, $pill, label) {
  $pill.contents().each((_, node) => {
    if (node.type === 'text' && node.data.trim().length > 0) {
      node.data = label + ': ';
    }
  });
}

function patchJuegos($, lang) {
  const t = juegosI18n[lang];
  $('.arc-header h1').text(t.h1);
  $('.arc-header p').text(t.header_p);

  const tabs = $('.tab .tab-label');
  const tabKeys = ['tab_tetris', 'tab_memo', 'tab_click', 'tab_plat', 'tab_puzzle'];
  tabs.each((i, el) => { if (tabKeys[i]) $(el).text(t[tabKeys[i]]); });

  // Tetris
  $('#game-tetris h2').html(`<span>🧱</span> ${t.tetris_h2}`);
  $('#game-tetris .sub').text(t.tetris_sub);
  setHudLabel($, $('#game-tetris .hud-pill').eq(0), t.tetris_points);
  setHudLabel($, $('#game-tetris .hud-pill').eq(1), t.tetris_level);
  setHudLabel($, $('#game-tetris .hud-pill').eq(2), t.tetris_lines);
  $('.tp-label').text(t.tetris_next);
  $('#tetris-pause').text(t.tetris_pause);
  $('#tetris-restart').text(t.tetris_restart);
  $('#tetris-left').attr('aria-label', t.tetris_left_aria);
  $('#tetris-rotate').attr('aria-label', t.tetris_rotate_aria);
  $('#tetris-right').attr('aria-label', t.tetris_right_aria);
  $('#tetris-drop').text(t.tetris_drop);
  $('.tetris-overlay-note').text(t.tetris_overlay);

  // Memo
  $('#game-memo h2').html(`<span>🧠</span> ${t.memo_h2}`);
  $('#game-memo .sub').text(t.memo_sub);
  setHudLabel($, $('#game-memo .hud-pill').eq(0), t.memo_moves);
  // El segundo hud-pill de memo tiene un formato distinto: "Parejas: <b>0</b>/8"
  // (texto suelto antes Y después del <b>), así que se ajustan ambos nodos.
  const memoPairsPill = $('#game-memo .hud-pill').eq(1);
  const memoPairsTextNodes = memoPairsPill.contents().filter((_, n) => n.type === 'text');
  if (memoPairsTextNodes.length >= 1) memoPairsTextNodes.get(0).data = t.memo_pairs + ': ';
  $('#memo-win').html(t.memo_win);
  $('#memo-restart').text(t.memo_restart);

  // Click / Moldeado
  $('#game-click h2').html(`<span>🏺</span> ${t.click_h2}`);
  $('#game-click .sub').text(t.click_sub);
  setHudLabel($, $('#game-click .hud-pill').eq(0), t.click_clay);
  setHudLabel($, $('#game-click .hud-pill').eq(1), t.click_persec);
  $('#clay-lump').attr('aria-label', t.click_mold_aria);
  $('.clay-progress-label span').eq(0).text(t.click_next_upgrade);
  $('.shop-title').text(t.click_shop_title);

  // Plataformero
  $('#game-plat h2').html(`<span>🏃</span> ${t.plat_h2}`);
  $('#game-plat .sub').text(t.plat_sub);
  setHudLabel($, $('#game-plat .hud-pill').eq(0), t.plat_points);
  setHudLabel($, $('#game-plat .hud-pill').eq(1), t.plat_lives);
  $('#plat-left').attr('aria-label', t.plat_left_aria);
  $('#plat-jump').text(t.plat_jump);
  $('#plat-right').attr('aria-label', t.plat_right_aria);
  $('.plat-controls').next('p').text(t.plat_controls_note);

  // Puzzle
  $('#game-puzzle h2').html(`<span>🧩</span> ${t.puzzle_h2}`);
  $('#game-puzzle .sub').text(t.puzzle_sub);
  setHudLabel($, $('#game-puzzle .hud-pill').eq(0), t.puzzle_moves);
  $('#puzzle-status').text(t.puzzle_inprogress);
  $('#puzzle-preview-btn').text(t.puzzle_preview_show);
  $('#puzzle-shuffle').text(t.puzzle_shuffle);

  $('.arc-footer').text(t.footer);

  // Reemplazos de strings dentro del <script> inline (game logic).
  $('script').each((_, el) => {
    const $el = $(el);
    let code = $el.html();
    if (!code || !code.includes('memo-restart')) return; // solo el script grande de juegos
    const replacements = [
      ["'Carta oculta'", JSON.stringify(t.memo_card_hidden_aria)],
      ["'Pareja encontrada: '", JSON.stringify(t.memo_card_match_aria)],
      ["'Pieza del rompecabezas'", JSON.stringify(t.puzzle_tile_aria)],
      ["name:'Torno alfarero', desc:'+1 greda/seg'", `name:${JSON.stringify(t.click_item_torno_name)}, desc:${JSON.stringify(t.click_item_torno_desc)}`],
      ["name:'Horno de barro', desc:'+5 greda/seg'", `name:${JSON.stringify(t.click_item_horno_name)}, desc:${JSON.stringify(t.click_item_horno_desc)}`],
      ["name:'Ayudante artesano', desc:'+20 greda/seg'", `name:${JSON.stringify(t.click_item_ayudante_name)}, desc:${JSON.stringify(t.click_item_ayudante_desc)}`],
      ["Comprar · ", t.click_buy],
      ["'🏺 Fin del juego'", JSON.stringify('🏺 ' + t.plat_gameover_title.replace('🏺 ', ''))],
      ["'Puntos: '", JSON.stringify(t.plat_gameover_points)],
      ['Toca "Saltar" para reiniciar', t.plat_gameover_restart],
      ["'⏳ En progreso'", JSON.stringify(t.puzzle_inprogress_status)],
      ["'🏺 ¡Completado!'", JSON.stringify(t.puzzle_completed_status)],
      ["'🙈 Ocultar vasija'", JSON.stringify(t.puzzle_preview_hide)],
      ["'👁️ Espiar la vasija completa'", JSON.stringify(t.puzzle_preview_show)],
      ["'🏺 ¡Juego terminado! Puntos: '", JSON.stringify(t.tetris_gameover)],
      // Los reemplazos compuestos (que incluyen '⏸ Pausar' dentro de una
      // expresión más larga) deben ir ANTES del reemplazo simple de
      // '⏸ Pausar', o este último ya habrá modificado el string y el
      // patrón compuesto dejará de coincidir.
      ["'▶ Reanudar' : '⏸ Pausar'", JSON.stringify(t.tetris_resume) + " : " + JSON.stringify(t.tetris_pause)],
      ["'⏸ En pausa' : ''", JSON.stringify(t.tetris_paused_status) + " : ''"],
      ["'⏸ Pausar'", JSON.stringify(t.tetris_pause)]
    ];
    replacements.forEach(([find, repl]) => { code = code.split(find).join(repl); });
    $el.html(code);
  });
}

// ---------------------------------------------------------------------------
// Generación principal
// ---------------------------------------------------------------------------

function generatePage(slug, lang) {
  const entry = pageMap[slug];
  const srcPath = path.join(REPO_ROOT, entry.file);
  const html = fs.readFileSync(srcPath, 'utf8');
  const $ = cheerio.load(html, { decodeEntities: false });

  // 1) Diccionario efectivo para esta página (base + override inline si aplica)
  const override = extractInlineOverride(html);
  const merged = mergeForPage(baseLangs, override);
  const langDict = merged[lang] || merged.es;

  // 2) Traducción de contenido data-t / data-ph-t (no aplica a anunciate/links/juegos,
  //    que no usan data-t para su contenido principal, pero sí para el nav compartido)
  applyDataT($, langDict, lang);

  // 3) Metadata SEO (title/description/OG/Twitter) + canonical + hreflang + locale
  const meta = metadataI18n[slug] && metadataI18n[slug][lang];
  if (meta) applyMetadata($, meta, lang, slug);
  injectHreflang($, slug);

  // 4) JSON-LD (breadcrumbs, urls)
  patchJsonLd($, lang, slug);

  // 5) Enlaces internos -> rutas /en/ o /pt/
  rewriteLinks($, lang, slug);

  // 6) Selector de idioma -> navegación real para es/en/pt
  patchLangSelector($, lang, slug);
  patchNavAria($, lang);

  // 7) Contenido estático especial sin data-t
  if (slug === 'anunciate') patchAnunciate($, lang);
  if (slug === 'links') patchLinks($, lang);
  if (slug === 'juegos') patchJuegos($, lang);
  if (slug === 'index') patchIndexAltText($, lang);

  return $.html();
}

function outputPathFor(slug, lang) {
  const rel = pageMap.langPath(slug, lang); // e.g. /en/alfareria/
  const withoutLeadingSlash = rel.replace(/^\//, '');
  const withIndex = withoutLeadingSlash.endsWith('/') || withoutLeadingSlash === ''
    ? withoutLeadingSlash + 'index.html'
    : withoutLeadingSlash + '/index.html';
  return path.join(REPO_ROOT, withIndex);
}

function main() {
  const slugs = Object.keys(pageMap).filter(k => typeof pageMap[k] === 'object' && !Array.isArray(pageMap[k]));
  let count = 0;
  for (const slug of slugs) {
    for (const lang of TARGET_LANGS) {
      const html = generatePage(slug, lang);
      const outPath = outputPathFor(slug, lang);
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      fs.writeFileSync(outPath, html, 'utf8');
      console.log('Wrote', path.relative(REPO_ROOT, outPath));
      count++;
    }
  }
  console.log(`\nGenerated ${count} pages (${slugs.length} slugs x ${TARGET_LANGS.length} langs).`);
}

main();
