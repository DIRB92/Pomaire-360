// Carga langs.js (datos puros, sin DOM) y lo evalúa en un sandbox mínimo
// para obtener el objeto window.LANGS y window.DIR_TAGS ya fusionados
// (incluye todos los Object.assign incrementales del archivo).
const fs = require('fs');
const path = require('path');

// Evalúa un archivo fuente (langs.js / app.js) dentro de un `new Function` y
// captura variables declaradas a nivel de módulo (const/let) devolviéndolas
// explícitamente. Esas variables NO se adjuntan a ningún objeto global, así
// que se listan por nombre en el `return` final. `wanted` es la lista de
// identificadores a capturar; los que no estén declarados se devuelven como
// undefined mediante una guarda `typeof` segura.
function evalAndCapture(src, wanted, extraGlobals) {
  const fields = wanted
    .map(name => `${name}: (typeof ${name} !== 'undefined' ? ${name} : undefined)`)
    .join(', ');
  const globals = extraGlobals || {};
  const argNames = Object.keys(globals);
  const argVals = argNames.map(k => globals[k]);
  const fn = new Function(...argNames, src + `\n;return { ${fields} };`);
  return fn(...argVals);
}

function loadLangs(repoRoot) {
  const langsSrc = fs.readFileSync(path.join(repoRoot, 'langs.js'), 'utf8');
  // langs.js declara `const LANGS = {...}` a nivel de módulo (para cargarse en
  // el navegador con <script>). Lo capturamos por nombre.
  const langsOut = evalAndCapture(langsSrc, ['LANGS'], {});

  // DIR_TAGS y DIR_MAP_LABEL viven en app.js, no en langs.js. Extraemos solo
  // esas dos declaraciones (con sus dependencias mínimas) evaluando app.js en
  // un sandbox tolerante: app.js referencia `document`, `window`, etc. en su
  // código de runtime, pero DIR_TAGS/DIR_MAP_LABEL son literales estáticos
  // declarados temprano, así que evaluamos solo hasta capturarlos.
  let dirTags, dirMapLabel;
  try {
    const appSrc = fs.readFileSync(path.join(repoRoot, 'app.js'), 'utf8');
    const snippet = extractDeclarations(appSrc, ['DIR_MAP_LABEL', 'DIR_TAGS']);
    const out = evalAndCapture(snippet, ['DIR_TAGS', 'DIR_MAP_LABEL'], {});
    dirTags = out.DIR_TAGS;
    dirMapLabel = out.DIR_MAP_LABEL;
  } catch (e) {
    dirTags = {};
    dirMapLabel = {};
  }
  return { LANGS: langsOut.LANGS, DIR_TAGS: dirTags || {}, DIR_MAP_LABEL: dirMapLabel || {} };
}

// Extrae de un archivo fuente el fragmento que va desde la primera declaración
// buscada hasta el cierre de la última, contando llaves/corchetes para incluir
// el objeto literal completo. Devuelve solo ese fragmento aislado, evitando
// ejecutar el resto de app.js (que depende del DOM).
function extractDeclarations(src, names) {
  // Encuentra el índice de inicio (primer `const NAME`) y el índice de fin
  // (fin del objeto de la última declaración buscada).
  let startIdx = Infinity;
  let endIdx = -1;
  for (const name of names) {
    const re = new RegExp('const\\s+' + name + '\\s*=', 'm');
    const m = src.match(re);
    if (!m) continue;
    const s = m.index;
    if (s < startIdx) startIdx = s;
    // Avanza hasta el fin de la sentencia contando llaves/corchetes.
    let i = src.indexOf('=', s) + 1;
    while (i < src.length && /\s/.test(src[i])) i++;
    const opener = src[i];
    if (opener === '{' || opener === '[') {
      const close = opener === '{' ? '}' : ']';
      let depth = 0;
      for (; i < src.length; i++) {
        if (src[i] === opener) depth++;
        else if (src[i] === close) { depth--; if (depth === 0) { i++; break; } }
      }
      // incluir el `;` final si existe
      if (src[i] === ';') i++;
    } else {
      // literal simple hasta ;
      while (i < src.length && src[i] !== ';') i++;
      i++;
    }
    if (i > endIdx) endIdx = i;
  }
  if (startIdx === Infinity || endIdx === -1) throw new Error('declarations not found');
  return src.slice(startIdx, endIdx);
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
