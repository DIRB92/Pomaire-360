/*
 * mini-cheerio.js — Reemplazo mínimo, sin dependencias, de la parte de la API
 * de cheerio que usa el generador de páginas (generate.js, patch-es.js,
 * head-utils.js). Existe porque el sandbox de build no tiene acceso al
 * registro npm para instalar cheerio, pero el generador necesita parsear y
 * reescribir HTML.
 *
 * Cubre: cheerio.load(html) -> $, y sobre $:
 *   $(selector) / $(nodo)  -> colección
 *   .find(sel) .eq(i) .each(fn) .filter(fn) .get(i) .last() .length
 *   .attr(name) .attr(name,val) .text() .text(val) .html() .html(val)
 *   .contents() .replaceWith(html) .append(html) .after(html) .remove()
 *   .next(sel)
 *   $.html()  (serializa el documento completo)
 *
 * Selectores soportados (los que usa el generador):
 *   tag, .clase, #id, [attr], [attr="val"], tag.clase, y descendencia con
 *   espacios (p.ej. ".arc-header h1", ".tab .tab-label",
 *   'a[href]', 'meta[property="og:title"]', '.lang-option[data-lang="es"]').
 *
 * Nodos: objetos {type:'tag'|'text'|'comment'|'directive'|'script'|'style',
 * name, attribs, children, parent, data}. Compatible con el uso de
 * node.type/node.data del generador.
 */
'use strict';

// ── Tokens y parser ────────────────────────────────────────────────────────

// Elementos que no llevan cierre (void elements en HTML).
const VOID = new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);
// Elementos cuyo contenido es texto crudo (no se parsea como HTML interno).
const RAWTEXT = new Set(['script','style']);

function makeNode(type, extra) {
  return Object.assign({ type, name: null, attribs: {}, children: [], parent: null, data: null }, extra);
}

// Parser de HTML tolerante. Devuelve un nodo raíz (document) con children.
function parseHTML(html) {
  const root = makeNode('root', { name: 'root' });
  const stack = [root];
  let i = 0;
  const len = html.length;

  const top = () => stack[stack.length - 1];
  const pushChild = (node) => {
    node.parent = top();
    top().children.push(node);
  };

  while (i < len) {
    if (html[i] === '<') {
      // Comentario
      if (html.startsWith('<!--', i)) {
        const end = html.indexOf('-->', i + 4);
        const stop = end === -1 ? len : end + 3;
        const data = html.slice(i + 4, end === -1 ? len : end);
        pushChild(makeNode('comment', { data }));
        i = stop;
        continue;
      }
      // Doctype u otras directivas <!...>
      if (html[i + 1] === '!') {
        const end = html.indexOf('>', i);
        const stop = end === -1 ? len : end + 1;
        const data = html.slice(i + 1, end === -1 ? len : end);
        pushChild(makeNode('directive', { name: '!doctype', data }));
        i = stop;
        continue;
      }
      // Etiqueta de cierre </tag>
      if (html[i + 1] === '/') {
        const end = html.indexOf('>', i);
        const stop = end === -1 ? len : end + 1;
        const tagName = html.slice(i + 2, end === -1 ? len : end).trim().toLowerCase();
        // Cierra hasta encontrar el tag correspondiente (tolerante a mal anidado).
        for (let s = stack.length - 1; s >= 1; s--) {
          if (stack[s].name === tagName) {
            stack.length = s; // pop hasta ese nivel (exclusivo del match)
            break;
          }
        }
        i = stop;
        continue;
      }
      // Etiqueta de apertura
      const m = /^<([a-zA-Z][a-zA-Z0-9:-]*)/.exec(html.slice(i));
      if (m) {
        const tagName = m[1].toLowerCase();
        // Encuentra el fin de la etiqueta (respeta comillas en atributos).
        let j = i + m[0].length;
        let selfClose = false;
        let inQuote = null;
        for (; j < len; j++) {
          const c = html[j];
          if (inQuote) { if (c === inQuote) inQuote = null; continue; }
          if (c === '"' || c === "'") { inQuote = c; continue; }
          if (c === '>') break;
        }
        const rawAttrs = html.slice(i + m[0].length, j);
        if (rawAttrs.trimEnd().endsWith('/')) selfClose = true;
        const attribs = parseAttrs(rawAttrs);
        const nodeType = RAWTEXT.has(tagName) ? tagName : 'tag';
        const node = makeNode(nodeType === 'script' ? 'script' : nodeType === 'style' ? 'style' : 'tag',
          { name: tagName, attribs });
        pushChild(node);
        i = (j < len ? j + 1 : len);

        if (VOID.has(tagName) || selfClose) {
          // no push al stack
        } else if (RAWTEXT.has(tagName)) {
          // Consume texto crudo hasta el cierre correspondiente.
          const closeRe = new RegExp('</' + tagName + '\\s*>', 'i');
          const rest = html.slice(i);
          const cm = closeRe.exec(rest);
          const rawEnd = cm ? i + cm.index : len;
          const rawText = html.slice(i, rawEnd);
          if (rawText.length) {
            const tnode = makeNode('text', { data: rawText });
            tnode.parent = node;
            node.children.push(tnode);
          }
          i = cm ? rawEnd + cm[0].length : len;
        } else {
          stack.push(node);
        }
        continue;
      }
      // '<' suelto que no forma etiqueta: trátalo como texto.
      const tnode = makeNode('text', { data: '<' });
      pushChild(tnode);
      i++;
      continue;
    }
    // Texto hasta el próximo '<'
    const next = html.indexOf('<', i);
    const stop = next === -1 ? len : next;
    const text = html.slice(i, stop);
    pushChild(makeNode('text', { data: text }));
    i = stop;
  }
  return root;
}

function parseAttrs(raw) {
  const attribs = {};
  const re = /([^\s=/]+)(\s*=\s*("([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g;
  let m;
  while ((m = re.exec(raw))) {
    const name = m[1];
    if (!name || name === '/') continue;
    let val = '';
    if (m[2] !== undefined) {
      val = m[4] !== undefined ? m[4] : (m[5] !== undefined ? m[5] : (m[6] || ''));
    }
    attribs[name] = val;
  }
  return attribs;
}

// ── Serialización ───────────────────────────────────────────────────────────

// Reconoce un `&` que YA inicia una entidad válida (con nombre o numérica),
// para no re-escaparla y evitar doble codificación (& -> &).
const ENTITY_START = /^&(?:#\d+|#x[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]*);/;

// Escapa contenido de texto igual que cheerio (decodeEntities:false):
// codifica `<`, `>` y los `&` sueltos (que no forman ya una entidad).
function escapeText(str) {
  let out = '';
  for (let i = 0; i < str.length; i++) {
    const c = str[i];
    if (c === '&') {
      out += ENTITY_START.test(str.slice(i)) ? '&' : '&' + 'amp;';
    } else if (c === '<') out += '&' + 'lt;';
    else if (c === '>') out += '&' + 'gt;';
    else out += c;
  }
  return out;
}

// Escapa valores de atributo: `&` sueltos y comillas dobles.
function escapeAttr(str) {
  let out = '';
  for (let i = 0; i < str.length; i++) {
    const c = str[i];
    if (c === '&') {
      out += ENTITY_START.test(str.slice(i)) ? '&' : '&' + 'amp;';
    } else if (c === '"') out += '&' + 'quot;';
    else out += c;
  }
  return out;
}

function renderNode(node) {
  switch (node.type) {
    case 'root':
      return node.children.map(renderNode).join('');
    case 'text':
      // Los hijos de <script>/<style> son texto crudo: no se escapan.
      if (node.parent && (node.parent.type === 'script' || node.parent.type === 'style')) {
        return node.data;
      }
      return escapeText(node.data);
    case 'comment':
      return '<!--' + node.data + '-->';
    case 'directive':
      return '<' + node.data + '>';
    case 'script':
    case 'style':
    case 'tag': {
      const attrs = Object.keys(node.attribs).map(k => {
        const v = node.attribs[k];
        if (v === '' && attrIsBoolean(node.attribs, k)) return ' ' + k;
        return ' ' + k + '="' + escapeAttr(String(v)) + '"';
      }).join('');
      const open = '<' + node.name + attrs + '>';
      if (VOID.has(node.name)) return open;
      const inner = node.children.map(renderNode).join('');
      return open + inner + '</' + node.name + '>';
    }
    default:
      return '';
  }
}

// Los atributos sin valor (p.ej. "defer", "async") se mantienen booleanos.
function attrIsBoolean(attribs, k) {
  return attribs[k] === '';
}

// ── Selectores ───────────────────────────────────────────────────────────────

// Parsea un selector compuesto simple (sin combinadores complejos) en un
// predicado sobre un nodo: tag, .clase, #id, [attr], [attr="v"] combinados.
function compileSimple(sel) {
  const parts = [];
  const re = /([a-zA-Z][a-zA-Z0-9:-]*)|\.([-\w]+)|#([-\w]+)|\[([-\w:]+)(?:=(?:"([^"]*)"|'([^']*)'|([^\]]*)))?\]/g;
  let m;
  while ((m = re.exec(sel))) {
    if (m[1]) parts.push({ kind: 'tag', v: m[1].toLowerCase() });
    else if (m[2]) parts.push({ kind: 'class', v: m[2] });
    else if (m[3]) parts.push({ kind: 'id', v: m[3] });
    else if (m[4]) {
      const val = m[5] !== undefined ? m[5] : (m[6] !== undefined ? m[6] : m[7]);
      parts.push({ kind: 'attr', name: m[4], val: val });
    }
  }
  return function (node) {
    if (node.type !== 'tag' && node.type !== 'script' && node.type !== 'style') return false;
    for (const p of parts) {
      if (p.kind === 'tag') { if (node.name !== p.v) return false; }
      else if (p.kind === 'class') {
        const cls = (node.attribs.class || '').split(/\s+/);
        if (!cls.includes(p.v)) return false;
      } else if (p.kind === 'id') {
        if (node.attribs.id !== p.v) return false;
      } else if (p.kind === 'attr') {
        if (!(p.name in node.attribs)) return false;
        if (p.val !== undefined && node.attribs[p.name] !== p.val) return false;
      }
    }
    return true;
  };
}

// Compila un selector con descendencia (partes separadas por espacios).
// Devuelve una función que, dado un nodo raíz de búsqueda, retorna la lista
// de descendientes que casan con el último segmento y cuya cadena de
// ancestros satisface los segmentos previos (descendiente, no hijo directo).
function compileSelector(selector) {
  const segments = selector.trim().split(/\s+/).map(compileSimple);
  const last = segments[segments.length - 1];
  const ancestors = segments.slice(0, -1);
  return function (rootNode) {
    const out = [];
    walk(rootNode, (node) => {
      if (node === rootNode) return;
      if (!last(node)) return;
      // Verifica que existan ancestros que casen en orden.
      if (ancestors.length === 0) { out.push(node); return; }
      let idx = ancestors.length - 1;
      let p = node.parent;
      while (p && idx >= 0) {
        if (ancestors[idx](p)) idx--;
        p = p.parent;
      }
      if (idx < 0) out.push(node);
    });
    return out;
  };
}

function walk(node, fn) {
  fn(node);
  if (node.children) for (const c of node.children) walk(c, fn);
}

// ── API tipo cheerio ─────────────────────────────────────────────────────────

function collectText(node) {
  if (node.type === 'text') return node.data;
  if (node.children) return node.children.map(collectText).join('');
  return '';
}

function load(html) {
  const doc = parseHTML(html);

  function Cheerio(nodes) {
    this._nodes = nodes;
    this.length = nodes.length;
  }

  Cheerio.prototype.each = function (fn) {
    this._nodes.forEach((n, i) => fn(i, n));
    return this;
  };
  Cheerio.prototype.get = function (i) {
    return i === undefined ? this._nodes.slice() : this._nodes[i];
  };
  Cheerio.prototype.eq = function (i) {
    const n = this._nodes[i];
    return new Cheerio(n ? [n] : []);
  };
  Cheerio.prototype.last = function () {
    const n = this._nodes[this._nodes.length - 1];
    return new Cheerio(n ? [n] : []);
  };
  Cheerio.prototype.filter = function (fn) {
    const kept = this._nodes.filter((n, i) => fn(i, n));
    return new Cheerio(kept);
  };
  Cheerio.prototype.find = function (sel) {
    const compiled = compileSelector(sel);
    const found = [];
    for (const n of this._nodes) for (const r of compiled(n)) if (!found.includes(r)) found.push(r);
    return new Cheerio(found);
  };
  Cheerio.prototype.contents = function () {
    const out = [];
    for (const n of this._nodes) if (n.children) out.push(...n.children);
    return new Cheerio(out);
  };
  Cheerio.prototype.next = function (sel) {
    const out = [];
    for (const n of this._nodes) {
      if (!n.parent) continue;
      const sibs = n.parent.children;
      let k = sibs.indexOf(n) + 1;
      // salta nodos de texto/espacios para encontrar el próximo elemento
      while (k < sibs.length && sibs[k].type !== 'tag' && sibs[k].type !== 'script' && sibs[k].type !== 'style') k++;
      const cand = sibs[k];
      if (cand) {
        if (!sel || compileSimple(sel)(cand)) out.push(cand);
      }
    }
    return new Cheerio(out);
  };
  Cheerio.prototype.attr = function (name, val) {
    if (val === undefined) {
      const n = this._nodes[0];
      return n ? n.attribs[name] : undefined;
    }
    for (const n of this._nodes) n.attribs[name] = String(val);
    return this;
  };
  Cheerio.prototype.text = function (val) {
    if (val === undefined) {
      return this._nodes.map(collectText).join('');
    }
    for (const n of this._nodes) {
      n.children = [makeNode('text', { data: String(val), parent: n })];
    }
    return this;
  };
  Cheerio.prototype.html = function (val) {
    if (val === undefined) {
      const n = this._nodes[0];
      if (!n) return null;
      return n.children.map(renderNode).join('');
    }
    for (const n of this._nodes) {
      if (n.type === 'script' || n.type === 'style') {
        // contenido crudo: un único nodo de texto sin re-parsear
        n.children = [makeNode('text', { data: String(val), parent: n })];
      } else {
        const frag = parseHTML(String(val));
        frag.children.forEach(c => { c.parent = n; });
        n.children = frag.children;
      }
    }
    return this;
  };
  Cheerio.prototype.replaceWith = function (htmlStr) {
    for (const n of this._nodes) {
      if (!n.parent) continue;
      const frag = parseHTML(String(htmlStr));
      const newNodes = frag.children.map(c => { c.parent = n.parent; return c; });
      const sibs = n.parent.children;
      const idx = sibs.indexOf(n);
      if (idx !== -1) sibs.splice(idx, 1, ...newNodes);
    }
    return this;
  };
  Cheerio.prototype.after = function (htmlStr) {
    for (const n of this._nodes) {
      if (!n.parent) continue;
      const frag = parseHTML(String(htmlStr));
      const newNodes = frag.children.map(c => { c.parent = n.parent; return c; });
      const sibs = n.parent.children;
      const idx = sibs.indexOf(n);
      if (idx !== -1) sibs.splice(idx + 1, 0, ...newNodes);
    }
    return this;
  };
  Cheerio.prototype.append = function (htmlStr) {
    for (const n of this._nodes) {
      const frag = parseHTML(String(htmlStr));
      frag.children.forEach(c => { c.parent = n; n.children.push(c); });
    }
    return this;
  };
  Cheerio.prototype.remove = function () {
    for (const n of this._nodes) {
      if (!n.parent) continue;
      const sibs = n.parent.children;
      const idx = sibs.indexOf(n);
      if (idx !== -1) sibs.splice(idx, 1);
    }
    return this;
  };

  // La función $ principal.
  function $(arg) {
    if (arg == null) return new Cheerio([]);
    if (typeof arg === 'string') {
      const compiled = compileSelector(arg);
      return new Cheerio(compiled(doc));
    }
    if (arg instanceof Cheerio) return arg;
    // se asume un nodo
    return new Cheerio([arg]);
  }
  $.html = function () { return renderNode(doc); };
  $._doc = doc;
  return $;
}

module.exports = { load };
