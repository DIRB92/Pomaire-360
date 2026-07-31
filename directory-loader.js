/* ═══════════════════════════════════════════════════════════════════════════
   directory-loader.js — Carga dinámica de negocios desde Supabase (pomaire-app)
   para pomaire360.cl con fallback a datos estáticos (SEO + resiliencia)

   Consume DIRECTAMENTE la tabla "negocios" de app.pomaire360.cl (Supabase)
   usando la anon key pública (protegida por RLS: solo lee activos).

   Estrategia:
   1. Intenta cargar /directory-data.json (generado en build-time, SEO)
   2. Luego actualiza desde Supabase REST API en tiempo real
   3. Si ambos fallan, usa el DIRECTORY hardcoded como último respaldo
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  // ─── Configuración Supabase (pomaire-app) ───────────────────────────────
  var SUPABASE_URL = 'https://uuskvqtbsvtfsovqjar7.supabase.co';
  var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1c2t2cXRic3Z0ZnNvdmNqYXpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2ODU4NDIsImV4cCI6MjEwMDI2MTg0Mn0.BbHI3ctSNg5msUnL9eENTNpOujQROAh6vUAZpFVcbBI';


  // Columnas a pedir (select de PostgREST)
  var SELECT_COLS = 'id,nombre,slug,categoria,descripcion,direccion,telefono,whatsapp,instagram,sitio_web,horarios,latitud,longitud,imagen_principal,imagenes,verificado,rating_promedio,total_resenas,plan,updated_at';

  // ─── Mapeo de categorías Supabase → IDs de contenedores en el DOM ───────
  // Las categorías en app.pomaire360.cl: artesania, gastronomia, hospedaje, turismo, comercio, servicios, otro
  // Los contenedores en pomaire360.cl: restaurantDir, tallerDir, artesanoDir, etc.
  var CATEGORY_MAP = {
    gastronomia: { containerId: 'restaurantDir', countId: 'restCount' },
    artesania:   { containerId: 'artesanoDir',   countId: 'artesanoCount' },
    hospedaje:   { containerId: 'alojamientoDir', countId: null },
    turismo:     { containerId: 'interesDir',    countId: null },
    comercio:    { containerId: 'servicioDir',   countId: 'servicioCount' },
    servicios:   { containerId: 'servicioDir',   countId: 'servicioCount' },
    otro:        { containerId: 'interesDir',    countId: null }
  };

  // Mapeo legacy (DIRECTORY keys) → categorías Supabase
  var LEGACY_TO_SUPABASE = {
    restaurants: 'gastronomia',
    talleres:    'artesania',
    demos:       'artesania',
    artesanos:   'artesania',
    alojamientos:'hospedaje',
    interes:     'turismo',
    servicios:   'servicios',
    jardin:      'comercio'
  };

  // ─── Estado ─────────────────────────────────────────────────────────────
  var supabaseData = null;
  var staticData = null;
  var rendered = false;


  // ─── Helpers ────────────────────────────────────────────────────────────

  function getLang() {
    return (typeof window.currentLang !== 'undefined') ? window.currentLang : 'es';
  }

  function dirTagTranslate(text) {
    if (typeof window.dirT === 'function') return window.dirT(text);
    return text;
  }

  function getMapLabel() {
    var labels = { es: 'Mapa', en: 'Map', pt: 'Mapa', fr: 'Carte', ru: 'Карта', ja: '地図', zh: '地图' };
    return labels[getLang()] || labels.es;
  }

  function getPlanLabel(plan) {
    if (typeof window.planLabel === 'function') return window.planLabel(plan);
    var labels = { destacado: 'Destacado', premium: 'Premium' };
    return labels[plan] || '';
  }

  function getProfileT(key) {
    if (typeof window.profileT === 'function') return window.profileT(key);
    var dict = { see: 'Ver perfil ▸', hours: 'Horario' };
    return dict[key] || key;
  }

  function telHref(p) {
    if (!p) return '';
    var first = p.split('/')[0];
    var digits = first.replace(/[^\d]/g, '');
    if (digits.length <= 4) return 'tel:' + digits;
    if (digits.indexOf('56') !== 0) digits = '56' + digits;
    return 'tel:+' + digits;
  }

  function timeAgo(dateStr) {
    if (!dateStr) return '';
    var now = new Date();
    var then = new Date(dateStr);
    var diff = Math.floor((now - then) / 1000);
    if (diff < 60) return 'hace un momento';
    if (diff < 3600) return 'hace ' + Math.floor(diff / 60) + ' min';
    if (diff < 86400) return 'hace ' + Math.floor(diff / 3600) + 'h';
    var days = Math.floor(diff / 86400);
    if (days === 1) return 'hace 1 día';
    if (days < 30) return 'hace ' + days + ' días';
    if (days < 365) return 'hace ' + Math.floor(days / 30) + ' meses';
    return 'hace ' + Math.floor(days / 365) + ' años';
  }

  function ratingStars(avg) {
    if (!avg || avg <= 0) return '';
    var full = Math.floor(avg);
    var half = (avg - full) >= 0.5 ? 1 : 0;
    var empty = 5 - full - half;
    var stars = '';
    for (var i = 0; i < full; i++) stars += '★';
    if (half) stars += '½';
    for (var j = 0; j < empty; j++) stars += '☆';
    return stars;
  }

  /** Formatea horarios JSONB a string legible */
  function formatHorarios(horarios) {
    if (!horarios || typeof horarios !== 'object') return '';
    var keys = Object.keys(horarios);
    if (keys.length === 0) return '';
    // Si es un string directo
    if (typeof horarios === 'string') return horarios;
    // Intentar resumir
    var parts = [];
    keys.forEach(function(dia) {
      if (horarios[dia]) parts.push(dia + ': ' + horarios[dia]);
    });
    return parts.join(' · ');
  }


  // ─── Mapeo de registro Supabase al formato de renderizado ───────────────

  /** Convierte un registro de la tabla negocios a formato interno */
  function mapSupabaseRow(row) {
    return {
      n: row.nombre,
      a: row.direccion || 'Pomaire',
      p: row.telefono || '',
      d: formatHorarios(row.horarios),
      tag: '',
      map: (row.latitud && row.longitud)
        ? 'https://maps.google.com/?q=' + row.latitud + ',' + row.longitud
        : '',
      ig: row.instagram || '',
      fb: '',
      web: row.sitio_web || '',
      wsp: row.whatsapp || '',
      plan: (row.plan && row.plan !== 'gratis') ? row.plan : undefined,
      slug: row.slug || '',
      page: '',
      hours: formatHorarios(row.horarios),
      desc: row.descripcion || '',
      photos: row.imagenes || [],
      foto_portada: row.imagen_principal || '',
      rating_avg: parseFloat(row.rating_promedio) || 0,
      rating_count: row.total_resenas || 0,
      verificado: row.verificado || false,
      tiktok: '',
      updated_at: row.updated_at || '',
      lat: row.latitud,
      lng: row.longitud,
      _source: 'supabase',
      _categoria: row.categoria
    };
  }

  /** Agrupa un array de registros mapeados por categoría */
  function groupByCategory(items) {
    var grouped = {};
    Object.keys(CATEGORY_MAP).forEach(function (cat) { grouped[cat] = []; });
    items.forEach(function (item) {
      var cat = item._categoria;
      if (grouped[cat]) {
        grouped[cat].push(item);
      } else if (grouped.otro) {
        grouped.otro.push(item);
      }
    });
    return grouped;
  }

  /** Merge: prioriza Supabase, rellena con estáticos si categoría vacía */
  function mergeData(supabase, fallback) {
    if (!supabase && !fallback) return null;
    if (!supabase) return fallback;
    if (!fallback) return supabase;
    var merged = {};
    Object.keys(CATEGORY_MAP).forEach(function (cat) {
      var supa = supabase[cat] || [];
      var stat = fallback[cat] || [];
      merged[cat] = supa.length > 0 ? supa : stat;
    });
    return merged;
  }


  // ─── NUEVO dirItemHTML enriquecido ──────────────────────────────────────

  function dirItemHTMLEnriched(it) {
    // Registrar en PROFILES si tiene plan
    if (it.plan && it.slug && typeof window.PROFILES !== 'undefined') {
      window.PROFILES[it.slug] = it;
    }

    var featured = (it.plan === 'destacado' || it.plan === 'premium');
    var mapsUrl = it.map ? it.map : 'https://maps.google.com/?q=' + encodeURIComponent(it.a + ', Pomaire, Chile');
    var mapLabel = getMapLabel();

    // Badge del plan
    var badge = '';
    if (it.plan && it.plan !== 'gratis') {
      var icon = it.plan === 'premium' ? '💎' : '⭐';
      badge = '<span class="dir-badge badge-' + it.plan + '">' + icon + ' ' + getPlanLabel(it.plan) + '</span>';
    }

    // Tag / horario
    var rawTag = it.tag || it.d || '';
    var tag = rawTag ? '<span class="dir-tag">' + dirTagTranslate(rawTag) + '</span>' : '';

    // Foto de portada (solo para destacados/premium o si tiene foto)
    var coverHTML = '';
    if (it.foto_portada && featured) {
      coverHTML = '<div class="dir-card-cover">' +
        '<img src="' + it.foto_portada + '" alt="' + it.n + '" loading="lazy">' +
        (badge ? '<div class="dir-card-badge-overlay">' + badge + '</div>' : '') +
        '</div>';
    }

    // Rating
    var ratingHTML = '';
    if (it.rating_avg && it.rating_avg > 0) {
      ratingHTML = '<div class="dir-rating">' +
        '<span class="dir-rating-stars">' + ratingStars(it.rating_avg) + '</span>' +
        '<span class="dir-rating-num">' + it.rating_avg.toFixed(1) + '</span>' +
        (it.rating_count ? '<span class="dir-rating-count">(' + it.rating_count + ')</span>' : '') +
        '</div>';
    }

    // Verificado
    var verifiedHTML = it.verificado ? '<span class="dir-verified" title="Verificado">✓</span>' : '';

    // Descripción breve (solo para destacados)
    var descHTML = '';
    if (it.desc && featured) {
      var shortDesc = it.desc.length > 120 ? it.desc.substring(0, 120) + '…' : it.desc;
      descHTML = '<p class="dir-desc">' + shortDesc + '</p>';
    }

    // Links
    var links = '<a href="' + mapsUrl + '" target="_blank" rel="noopener" class="dir-link-map">🗺️ ' + mapLabel + '</a>';
    if (it.p) links += '<a href="' + telHref(it.p) + '" class="dir-link-phone">📞 ' + it.p + '</a>';
    if (it.wsp) links += '<a href="https://wa.me/' + it.wsp.replace(/[^0-9]/g, '') + '" target="_blank" rel="noopener" class="dir-link-wsp">💬 WhatsApp</a>';
    if (it.ig) links += '<a class="dir-link-ig" href="https://instagram.com/' + it.ig.replace(/^@/, '') + '" target="_blank" rel="noopener">📷 @' + it.ig.replace(/^@/, '') + '</a>';
    if (it.web) links += '<a href="' + it.web + '" target="_blank" rel="noopener" class="dir-link-web">🌐 Web</a>';
    // Enlace a ficha completa en app.pomaire360.cl
    if (it.slug) {
      links += '<a href="https://app.pomaire360.cl/negocios/' + it.slug + '" target="_blank" rel="noopener" class="dir-link-app">⭐ Ver ficha completa</a>';
    }

    // Botón "Ver perfil"
    var moreBtn = '';
    if (it.slug && featured) {
      moreBtn = '<a class="dir-more" href="https://app.pomaire360.cl/negocios/' + it.slug + '" target="_blank" rel="noopener">' + getProfileT('see') + '</a>';
    } else if (it.page) {
      moreBtn = '<a class="dir-more" href="' + it.page + '">' + getProfileT('see') + '</a>';
    }

    // Updated at
    var updatedHTML = '';
    if (it._source === 'supabase' && it.updated_at) {
      updatedHTML = '<span class="dir-updated" title="Última actualización">' + timeAgo(it.updated_at) + '</span>';
    }

    // Clases del contenedor
    var classes = 'dir-item dir-card';
    if (featured) classes += ' dir-featured plan-' + it.plan;
    if (it._source === 'supabase') classes += ' dir-from-api';
    if (it.foto_portada && featured) classes += ' dir-has-cover';

    return '<div class="' + classes + '">' +
      coverHTML +
      '<div class="dir-card-body">' +
        '<div class="dir-card-header">' +
          '<span class="dir-name">' + it.n + verifiedHTML + '</span>' +
          (!coverHTML && badge ? badge : '') +
          tag +
        '</div>' +
        ratingHTML +
        '<span class="dir-addr">📍 ' + it.a + '</span>' +
        descHTML +
        '<div class="dir-links">' + links + '</div>' +
        '<div class="dir-card-footer">' +
          moreBtn +
          updatedHTML +
        '</div>' +
      '</div>' +
    '</div>';
  }


  // ─── Render por categoría ───────────────────────────────────────────────

  function renderCategory(catKey, items) {
    var config = CATEGORY_MAP[catKey];
    if (!config) return;
    var el = document.getElementById(config.containerId);
    if (!el) return;

    // Ordenar: premium > destacado > gratis, luego por rating
    var rank = function (it) {
      if (it.plan === 'premium') return 0;
      if (it.plan === 'destacado') return 1;
      return 2;
    };
    var ordered = items.slice().sort(function (a, b) {
      var r = rank(a) - rank(b);
      if (r !== 0) return r;
      return (b.rating_avg || 0) - (a.rating_avg || 0);
    });

    // Acumular en el contenedor (servicios y comercio comparten contenedor)
    var existingHTML = el.getAttribute('data-rendered-cats') || '';
    if (existingHTML.indexOf(catKey) === -1) {
      // Primera categoría para este contenedor
      el.innerHTML = ordered.map(dirItemHTMLEnriched).join('');
      el.setAttribute('data-rendered-cats', catKey);
    } else {
      // Ya se renderizó otra categoría aquí, agregar
      el.innerHTML += ordered.map(dirItemHTMLEnriched).join('');
    }

    if (config.countId) {
      var c = document.getElementById(config.countId);
      if (c) {
        var current = parseInt(c.textContent) || 0;
        c.textContent = current + items.length;
      }
    }
  }

  function renderAll(grouped) {
    if (!grouped) return;

    // Reset counters y containers antes de renderizar
    Object.keys(CATEGORY_MAP).forEach(function (cat) {
      var config = CATEGORY_MAP[cat];
      var el = document.getElementById(config.containerId);
      if (el) {
        el.innerHTML = '';
        el.removeAttribute('data-rendered-cats');
      }
      if (config.countId) {
        var c = document.getElementById(config.countId);
        if (c) c.textContent = '0';
      }
    });

    // Renderizar cada categoría
    Object.keys(CATEGORY_MAP).forEach(function (cat) {
      if (grouped[cat] && grouped[cat].length > 0) {
        renderCategory(cat, grouped[cat]);
      }
    });

    rendered = true;
  }


  // ─── Carga de datos estáticos (build-time JSON) ─────────────────────────

  function loadStaticJSON() {
    return fetch('/directory-data.json')
      .then(function (res) {
        if (!res.ok) throw new Error('No static data');
        return res.json();
      })
      .then(function (data) {
        staticData = data;
        return data;
      })
      .catch(function () {
        return null;
      });
  }

  // ─── Carga desde Supabase (tiempo real) ─────────────────────────────────

  function loadFromSupabase() {
    var url = SUPABASE_URL + '/rest/v1/negocios?select=' + SELECT_COLS +
              '&activo=eq.true&order=rating_promedio.desc';

    return fetch(url, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
        'Accept': 'application/json'
      }
    })
    .then(function (res) {
      if (!res.ok) throw new Error('Supabase error: ' + res.status);
      return res.json();
    })
    .then(function (rows) {
      var mapped = rows.map(mapSupabaseRow);
      supabaseData = groupByCategory(mapped);
      return supabaseData;
    })
    .catch(function (err) {
      console.warn('[Pomaire360] No se pudo conectar a Supabase:', err.message);
      return null;
    });
  }

  // ─── Convertir DIRECTORY legacy a formato agrupado ──────────────────────

  function legacyToGrouped(directory) {
    if (!directory) return null;
    var grouped = {};
    Object.keys(CATEGORY_MAP).forEach(function (cat) { grouped[cat] = []; });

    Object.keys(LEGACY_TO_SUPABASE).forEach(function (legacyKey) {
      var cat = LEGACY_TO_SUPABASE[legacyKey];
      if (directory[legacyKey] && grouped[cat]) {
        directory[legacyKey].forEach(function (it) {
          it._source = 'legacy';
          it._categoria = cat;
          grouped[cat].push(it);
        });
      }
    });
    return grouped;
  }

  // ─── Inicialización principal ───────────────────────────────────────────

  function init() {
    // Paso 1: Preparar datos legacy como fallback inmediato
    var legacyGrouped = null;
    if (typeof window.DIRECTORY !== 'undefined') {
      legacyGrouped = legacyToGrouped(window.DIRECTORY);
    }

    // Paso 2: Intentar cargar JSON estático (build-time, más fresco que legacy)
    loadStaticJSON().then(function (staticGrouped) {
      var initialData = staticGrouped || legacyGrouped;

      if (initialData && !rendered) {
        renderAll(initialData);
      }

      // Paso 3: Fetch desde Supabase para datos en tiempo real
      loadFromSupabase().then(function (freshData) {
        if (freshData) {
          var merged = mergeData(freshData, initialData);
          renderAll(merged);
        } else if (!rendered && initialData) {
          renderAll(initialData);
        }
      });
    });
  }

  // ─── Exponer refresh para cambio de idioma ──────────────────────────────
  window.directoryLoaderRefresh = function () {
    var data = supabaseData || staticData || legacyToGrouped(window.DIRECTORY);
    if (data) renderAll(data);
  };

  // ─── Ejecutar ───────────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
