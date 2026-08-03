/* ══════════════════════════════════════════════════════════════════════════
   dir-search.js — Búsqueda instantánea del directorio de Pomaire 360
   Busca en TODOS los negocios: DIRECTORY (legacy) + Supabase + JSON estático.
   Campos de búsqueda: nombre, dirección, categoría, tag, descripción, Instagram.
   ══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var input = document.getElementById('dirSearchInput');
  var results = document.getElementById('dirSearchResults');
  if (!input || !results) return;

  // ─── Configuración ──────────────────────────────────────────────────────
  var MAX_RESULTS = 12;
  var MIN_QUERY_LEN = 2;
  var DEBOUNCE_MS = 120;

  // ─── Mapeo de categoría → página (fallback si no viene de directoryGetAllItems) ─
  var CAT_PAGES = {
    'Restaurante': '/gastronomia/',
    'Taller': '/alfareria/',
    'Demostración': '/alfareria/',
    'Artesano': '/alfareria/',
    'Alojamiento': '/alojamientos/',
    'Punto de interés': '/que-ver/',
    'Jardín': '/comercio/',
    'Servicio': '/que-ver/'
  };

  var CAT_ICONS = {
    restaurants: '🍽️', talleres: '🎨', demos: '🌀', artesanos: '🏺',
    alojamientos: '🛏️', interes: '✨', jardin: '🌱', servicios: '📌'
  };

  var CAT_LABELS = {
    restaurants: 'Restaurante', talleres: 'Taller', demos: 'Demostración',
    artesanos: 'Artesano', alojamientos: 'Alojamiento', interes: 'Punto de interés',
    jardin: 'Jardín', servicios: 'Servicio'
  };

  // ─── Helpers ────────────────────────────────────────────────────────────

  function escHtml(s) {
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  function slugify(str) {
    return str.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  /** Normaliza texto para búsqueda (lowercase, sin acentos) */
  function normalize(str) {
    if (!str) return '';
    return str.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  /** Resalta la porción del texto que coincide con el query */
  function highlight(text, query) {
    if (!text || !query) return escHtml(text);
    var safe = escHtml(text);
    var normText = normalize(text);
    var normQuery = normalize(query);
    var idx = normText.indexOf(normQuery);
    if (idx === -1) return safe;
    // Resaltar la misma posición en el texto original escapado
    var before = escHtml(text.substring(0, idx));
    var match = escHtml(text.substring(idx, idx + query.length));
    var after = escHtml(text.substring(idx + query.length));
    return before + '<mark>' + match + '</mark>' + after;
  }

  // ─── Obtener TODOS los negocios (fusión de todas las fuentes) ───────────

  var cachedItems = null;
  var cacheTimestamp = 0;

  function getAllItems() {
    // Si directory-loader.js expone la función con datos de Supabase, usarla
    if (typeof window.directoryGetAllItems === 'function') {
      var items = window.directoryGetAllItems();
      if (items && items.length > 0) {
        cachedItems = items;
        cacheTimestamp = Date.now();
        return items;
      }
    }

    // Fallback: leer directamente de window.DIRECTORY (legacy)
    if (typeof DIRECTORY === 'undefined') return cachedItems || [];

    var items = [];
    var cats = { restaurants: 'gastronomia', talleres: 'talleres', demos: 'demos', artesanos: 'artesanos', alojamientos: 'alojamientos', interes: 'interes', jardin: 'jardin', servicios: 'servicios' };

    Object.keys(cats).forEach(function (key) {
      if (!DIRECTORY[key]) return;
      var catKey = cats[key];
      DIRECTORY[key].forEach(function (it) {
        items.push({
          name: it.n || '',
          addr: it.a || '',
          phone: it.p || '',
          tag: it.tag || it.d || '',
          desc: it.desc || '',
          ig: it.ig || '',
          web: it.web || '',
          map: it.map || '',
          wsp: it.wsp || '',
          slug: it.slug || '',
          page: it.page || '',
          plan: it.plan || '',
          foto_portada: it.foto_portada || '',
          rating_avg: it.rating_avg || 0,
          verificado: it.verificado || false,
          _source: it._source || 'legacy',
          icon: CAT_ICONS[key] || '📍',
          cat: CAT_LABELS[key] || '',
          catPage: CAT_PAGES[CAT_LABELS[key]] || '/',
          catKey: catKey
        });
      });
    });

    cachedItems = items;
    cacheTimestamp = Date.now();
    return items;
  }

  // ─── Búsqueda con scoring ───────────────────────────────────────────────

  function scoreItem(item, query) {
    var normQuery = normalize(query);
    var score = 0;

    // Nombre (peso alto: 10)
    var normName = normalize(item.name);
    if (normName.indexOf(normQuery) !== -1) {
      score += 10;
      // Bonus si empieza por el query
      if (normName.indexOf(normQuery) === 0) score += 5;
      // Bonus si es match exacto
      if (normName === normQuery) score += 10;
    }

    // Dirección (peso medio: 4)
    if (normalize(item.addr).indexOf(normQuery) !== -1) score += 4;

    // Categoría (peso medio: 4)
    if (normalize(item.cat).indexOf(normQuery) !== -1) score += 4;

    // Tag / descriptor (peso medio: 5)
    if (normalize(item.tag).indexOf(normQuery) !== -1) score += 5;

    // Descripción (peso bajo: 2)
    if (normalize(item.desc).indexOf(normQuery) !== -1) score += 2;

    // Instagram (peso medio: 3)
    if (normalize(item.ig).indexOf(normQuery) !== -1) score += 3;

    // Bonus por plan destacado/premium (visibilidad)
    if (score > 0 && item.plan === 'premium') score += 3;
    if (score > 0 && item.plan === 'destacado') score += 2;

    // Bonus por verificado
    if (score > 0 && item.verificado) score += 1;

    return score;
  }

  function search(query) {
    var all = getAllItems();
    var scored = [];

    all.forEach(function (item) {
      var s = scoreItem(item, query);
      if (s > 0) scored.push({ item: item, score: s });
    });

    // Ordenar por score descendente
    scored.sort(function (a, b) { return b.score - a.score; });

    return scored.slice(0, MAX_RESULTS).map(function (s) { return s.item; });
  }

  // ─── Renderizado de resultados ──────────────────────────────────────────

  function renderResults(matches, query) {
    if (!matches.length) {
      results.innerHTML = '<div class="dir-search-empty">' +
        '<span class="dse-icon">🔍</span>' +
        '<span class="dse-text">No se encontraron negocios para "<strong>' + escHtml(query) + '</strong>"</span>' +
        '<a class="dse-link" href="https://app.pomaire360.cl/auth/login" target="_blank" rel="noopener">¿Es tu negocio? Regístrate gratis</a>' +
        '</div>';
      results.classList.add('open');
      return;
    }

    results.innerHTML = matches.map(function (it) {
      var cardId = it.slug || slugify(it.name);
      var basePage = it.page ? it.page : (it.catPage || CAT_PAGES[it.cat] || '/');
      var href = basePage + '#' + cardId;

      // Badge de plan
      var badge = '';
      if (it.plan === 'premium') badge = '<span class="dsi-badge dsi-premium">💎</span>';
      else if (it.plan === 'destacado') badge = '<span class="dsi-badge dsi-destacado">⭐</span>';

      // Verificado
      var verified = it.verificado ? '<span class="dsi-verified" title="Verificado">✓</span>' : '';

      // Tag / subtítulo
      var subtitle = it.tag || it.cat;
      var subtitleHTML = '<span class="dsi-cat">' + escHtml(subtitle) + '</span>';
      if (it.addr) subtitleHTML += '<span class="dsi-addr"> · ' + escHtml(it.addr) + '</span>';

      // Instagram
      var igHTML = '';
      if (it.ig) igHTML = '<span class="dsi-ig">📷 @' + escHtml(it.ig.replace(/^@/, '')) + '</span>';

      // Source indicator
      var sourceHTML = '';
      if (it._source === 'supabase') sourceHTML = '<span class="dsi-live" title="Datos en tiempo real">●</span>';

      return '<a class="dir-search-item" href="' + escHtml(href) + '">' +
        '<span class="dsi-icon">' + it.icon + '</span>' +
        '<div class="dsi-content">' +
          '<div class="dsi-name">' + highlight(it.name, query) + verified + badge + sourceHTML + '</div>' +
          '<div class="dsi-meta">' + subtitleHTML + igHTML + '</div>' +
        '</div>' +
      '</a>';
    }).join('');

    // Footer con total de resultados
    var all = getAllItems();
    if (all.length > 0) {
      results.innerHTML += '<div class="dir-search-footer">' +
        '<span>' + all.length + ' negocios en el directorio</span>' +
        '</div>';
    }

    results.classList.add('open');
  }

  // ─── Event handling ─────────────────────────────────────────────────────

  var debounce = null;

  function doSearch() {
    var q = input.value.trim();
    if (q.length < MIN_QUERY_LEN) {
      results.classList.remove('open');
      results.innerHTML = '';
      return;
    }
    var matches = search(q);
    renderResults(matches, q);
  }

  input.addEventListener('input', function () {
    clearTimeout(debounce);
    debounce = setTimeout(doSearch, DEBOUNCE_MS);
  });

  input.addEventListener('focus', function () {
    if (input.value.trim().length >= MIN_QUERY_LEN) doSearch();
  });

  // Cerrar al hacer clic fuera
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.dir-search-wrap')) {
      results.classList.remove('open');
    }
  });

  // Navegación con teclado
  input.addEventListener('keydown', function (e) {
    var items = results.querySelectorAll('.dir-search-item');
    if (!items.length) return;

    var active = results.querySelector('.dir-search-item.active');
    var idx = -1;
    if (active) {
      items.forEach(function (el, i) { if (el === active) idx = i; });
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (active) active.classList.remove('active');
      idx = (idx + 1) % items.length;
      items[idx].classList.add('active');
      items[idx].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (active) active.classList.remove('active');
      idx = idx <= 0 ? items.length - 1 : idx - 1;
      items[idx].classList.add('active');
      items[idx].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter') {
      if (active) {
        e.preventDefault();
        active.click();
      }
    } else if (e.key === 'Escape') {
      results.classList.remove('open');
      input.blur();
    }
  });

  // ─── Auto-refresh cuando Supabase carga datos nuevos ────────────────────
  // Observar cambios en el DOM que indican que directory-loader terminó
  // (los contenedores del directorio se llenan)
  if (window.MutationObserver) {
    var refreshTimer = null;
    var observer = new MutationObserver(function () {
      // Invalidar cache cuando el directorio se actualiza
      clearTimeout(refreshTimer);
      refreshTimer = setTimeout(function () {
        cachedItems = null;
        // Si hay una búsqueda activa, re-ejecutar
        if (input.value.trim().length >= MIN_QUERY_LEN && results.classList.contains('open')) {
          doSearch();
        }
      }, 500);
    });

    // Observar los contenedores del directorio
    var dirContainer = document.getElementById('restaurantDir') || document.getElementById('artesanoDir');
    if (dirContainer) {
      observer.observe(dirContainer.parentElement, { childList: true, subtree: true });
    }
  }

})();
