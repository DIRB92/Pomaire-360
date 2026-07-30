/* ═══════════════════════════════════════════════════════════════════════════
   directory-loader.js — Carga dinámica de negocios desde Supabase
   para pomaire360.cl con fallback a datos estáticos (SEO + resiliencia)

   Estrategia:
   1. Intenta cargar /directory-data.json (generado en build-time)
   2. Luego intenta actualizar desde Supabase en tiempo real
   3. Si ambos fallan, usa el DIRECTORY hardcoded como último respaldo

   Requiere: Supabase project URL y anon key configurados abajo.
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  // ─── Configuración Supabase ─────────────────────────────────────────────
  // IMPORTANTE: Reemplaza estos valores con los de tu proyecto Supabase
  var SUPABASE_URL = 'https://TU_PROYECTO.supabase.co';
  var SUPABASE_ANON_KEY = 'TU_ANON_KEY_PUBLICA';
  var TABLE = 'negocios_publicos'; // vista pública

  // ─── Mapeo de categorías Supabase → IDs de contenedores en el DOM ───────
  var CATEGORY_MAP = {
    gastronomia: { containerId: 'restaurantDir', countId: 'restCount' },
    talleres:    { containerId: 'tallerDir',     countId: 'tallerCount' },
    demos:       { containerId: 'demoDir',       countId: 'demoCount' },
    artesanos:   { containerId: 'artesanoDir',   countId: 'artesanoCount' },
    alojamientos:{ containerId: 'alojamientoDir', countId: null },
    interes:     { containerId: 'interesDir',    countId: null },
    jardin:      { containerId: 'jardinDir',     countId: 'jardinCount' },
    servicios:   { containerId: 'servicioDir',   countId: 'servicioCount' }
  };

  // ─── Estado ─────────────────────────────────────────────────────────────
  var supabaseData = null;
  var staticData = null;
  var rendered = false;

  // ─── Helpers ────────────────────────────────────────────────────────────

  /** Convierte un registro de Supabase al formato legacy del DIRECTORY */
  function mapToLegacy(row) {
    return {
      n: row.nombre,
      a: row.direccion,
      p: row.telefono || '',
      d: row.horario || '',
      tag: row.tag || '',
      map: row.google_maps || '',
      ig: row.instagram || '',
      fb: row.facebook || '',
      web: row.web || '',
      wsp: row.whatsapp || '',
      plan: (row.plan && row.plan !== 'gratis') ? row.plan : undefined,
      slug: row.slug || '',
      page: row.pagina_url || '',
      hours: row.horario || '',
      desc: row.descripcion || '',
      photos: row.fotos || [],
      foto_portada: row.foto_portada || '',
      rating_avg: row.rating_avg || 0,
      rating_count: row.rating_count || 0,
      verificado: row.verificado || false,
      tiktok: row.tiktok || '',
      updated_at: row.updated_at || '',
      lat: row.latitud,
      lng: row.longitud,
      _source: 'supabase'
    };
  }

  /** Agrupa un array de registros por categoría */
  function groupByCategory(rows) {
    var grouped = {};
    Object.keys(CATEGORY_MAP).forEach(function (cat) { grouped[cat] = []; });
    rows.forEach(function (row) {
      var cat = row.categoria || row._categoria;
      if (grouped[cat]) grouped[cat].push(row);
    });
    return grouped;
  }

  /** Hace merge: prioriza datos de Supabase, rellena con estáticos si faltan */
  function mergeData(supabase, fallback) {
    if (!supabase && !fallback) return null;
    if (!supabase) return fallback;
    if (!fallback) return supabase;

    var merged = {};
    Object.keys(CATEGORY_MAP).forEach(function (cat) {
      var supa = supabase[cat] || [];
      var stat = fallback[cat] || [];
      if (supa.length > 0) {
        merged[cat] = supa;
      } else {
        merged[cat] = stat;
      }
    });
    return merged;
  }

  // ─── Renderizado con nuevo diseño de tarjetas ───────────────────────────

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

    // Tag
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
    if (it.ig) links += '<a class="dir-link-ig" href="https://instagram.com/' + it.ig.replace(/^@/, '') + '" target="_blank" rel="noopener">📷 @' + it.ig.replace(/^@/, '') + '</a>';
    if (it.web) links += '<a href="' + it.web + '" target="_blank" rel="noopener" class="dir-link-web">🌐 Web</a>';
    if (it.fb) links += '<a href="' + it.fb + '" target="_blank" rel="noopener" class="dir-link-fb">📘 Facebook</a>';
    if (it.tiktok) links += '<a href="' + it.tiktok + '" target="_blank" rel="noopener" class="dir-link-tk">🎵 TikTok</a>';
    if (it.wsp) links += '<a href="https://wa.me/' + it.wsp.replace(/[^0-9]/g, '') + '" target="_blank" rel="noopener" class="dir-link-wsp">💬 WhatsApp</a>';
    // Enlace a reseñas en app
    links += '<a href="https://app.pomaire360.cl/negocios?q=' + encodeURIComponent(it.n) + '" target="_blank" rel="noopener" class="dir-link-app">⭐ Reseñas</a>';

    // Botón "Ver perfil"
    var moreBtn = '';
    if (it.page) {
      moreBtn = '<a class="dir-more" href="' + it.page + '">' + getProfileT('see') + '</a>';
    } else if (featured && it.slug) {
      moreBtn = '<button class="dir-more" onclick="openProfile(\'' + it.slug + '\')">' + getProfileT('see') + '</button>';
    }

    // Updated at (solo si viene de supabase)
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

    // Ordenar: premium > destacado > gratis
    var rank = function (it) {
      if (it.plan === 'premium') return 0;
      if (it.plan === 'destacado') return 1;
      return 2;
    };
    var ordered = items.slice().sort(function (a, b) { return rank(a) - rank(b); });

    el.innerHTML = ordered.map(dirItemHTMLEnriched).join('');

    if (config.countId) {
      var c = document.getElementById(config.countId);
      if (c) c.textContent = items.length;
    }
  }

  function renderAll(grouped) {
    if (!grouped) return;
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
        // No hay JSON estático, se usará fallback hardcoded
        return null;
      });
  }

  // ─── Carga desde Supabase (tiempo real) ─────────────────────────────────

  function loadFromSupabase() {
    var url = SUPABASE_URL + '/rest/v1/' + TABLE + '?select=*&order=updated_at.desc';
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
      // Mapear y agrupar
      var mapped = rows.map(function (row) {
        var legacy = mapToLegacy(row);
        legacy._categoria = row.categoria;
        return legacy;
      });
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
    // Mapear nombres legacy a categorías
    var map = {
      restaurants: 'gastronomia',
      talleres: 'talleres',
      demos: 'demos',
      artesanos: 'artesanos',
      alojamientos: 'alojamientos',
      interes: 'interes',
      servicios: 'servicios',
      jardin: 'jardin'
    };
    var grouped = {};
    Object.keys(CATEGORY_MAP).forEach(function (cat) { grouped[cat] = []; });
    Object.keys(map).forEach(function (legacyKey) {
      var cat = map[legacyKey];
      if (directory[legacyKey]) {
        grouped[cat] = directory[legacyKey].map(function (it) {
          it._source = 'legacy';
          it._categoria = cat;
          return it;
        });
      }
    });
    return grouped;
  }

  // ─── Inicialización principal ───────────────────────────────────────────

  function init() {
    // Paso 1: Renderizar con datos estáticos o legacy INMEDIATAMENTE
    var legacyGrouped = null;
    if (typeof window.DIRECTORY !== 'undefined') {
      legacyGrouped = legacyToGrouped(window.DIRECTORY);
    }

    // Intentar cargar static JSON (más fresco que legacy)
    loadStaticJSON().then(function (staticGrouped) {
      var initialData = staticGrouped || legacyGrouped;
      if (initialData && !rendered) {
        renderAll(initialData);
      }

      // Paso 2: Intentar Supabase para datos en tiempo real
      // Solo si las credenciales están configuradas
      if (SUPABASE_URL.indexOf('TU_PROYECTO') === -1) {
        loadFromSupabase().then(function (freshData) {
          if (freshData) {
            var merged = mergeData(freshData, initialData);
            renderAll(merged);
          }
        });
      } else {
        // Credenciales no configuradas: usar datos iniciales
        if (!rendered && initialData) {
          renderAll(initialData);
        } else if (!rendered && legacyGrouped) {
          renderAll(legacyGrouped);
        }
      }
    });
  }

  // ─── Exposer para re-render en cambio de idioma ─────────────────────────
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
