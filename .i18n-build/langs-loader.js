// Carga langs.js (datos puros, sin DOM) y lo evalúa en un sandbox mínimo
// para obtener el objeto window.LANGS y window.DIR_TAGS ya fusionados
// (incluye todos los Object.assign incrementales del archivo).
const fs = require('fs');
const path = require('path');

function loadLangs(repoRoot) {
  const src = fs.readFileSync(path.join(repoRoot, 'langs.js'), 'utf8');
  const sandbox = { LANGS: undefined, DIR_MAP_LABEL: undefined, DIR_TAGS: undefined };
  const fn = new Function('window', 'Object', src + '\nreturn window;');
  const result = fn(sandbox, Object);
  return { LANGS: result.LANGS, DIR_TAGS: result.DIR_TAGS, DIR_MAP_LABEL: result.DIR_MAP_LABEL };
}

// Extrae el objeto "var X = {...};" de los scripts inline de apoyar/,
// locomocion/ y sugerencias/ (patrón: fusionado en window.LANGS en runtime,
// sin tocar langs.js). Devuelve null si la página no tiene ese patrón.
function extractInlineOverride(html) {
  const marker = 'Claves de traducción exclusivas de esta página';
  if (!html.includes(marker)) return null;
  const startTag = html.indexOf('var X = {', html.indexOf(marker));
  if (startTag === -1) return null;
  // Encuentra el cierre "};" que termina la asignación de X, contando llaves.
  let i = html.indexOf('{', startTag);
  let depth = 0, end = -1;
  for (; i < html.length; i++) {
    if (html[i] === '{') depth++;
    else if (html[i] === '}') { depth--; if (depth === 0) { end = i; break; } }
  }
  if (end === -1) return null;
  const objLiteral = html.slice(html.indexOf('{', startTag), end + 1);
  const fn = new Function('return ' + objLiteral + ';');
  return fn();
}

// Combina el diccionario base con el override de una página específica,
// sin mutar el original. El override gana si define la misma clave.
function mergeForPage(baseLangs, override) {
  if (!override) return baseLangs;
  const merged = {};
  for (const lang of Object.keys(baseLangs)) {
    merged[lang] = Object.assign({}, baseLangs[lang], override[lang] || {});
  }
  return merged;
}

module.exports = { loadLangs, extractInlineOverride, mergeForPage };
