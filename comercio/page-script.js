/* ═══════════════════════════════════════════════════════════════════════════
   page-script.js — Pomaire 360 Directorio Unificado (2026 Modern)
   Handles: category filtering, search, dynamic card rendering from
   directory-data.json / Supabase, scroll-to-top, and URL hash navigation.
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  // ─── Config ─────────────────────────────────────────────────────────────
  var SUPABASE_URL = 'https://uuskvqtbsvtfsovcjazf.supabase.co';
  var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1c2t2cXRic3Z0ZnNvdmNqYXpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2ODU4NDIsImV4cCI6MjEwMDI2MTg0Mn0.BbHI3ctSNg5msUnL9eENTNpOujQROAh6vUAZpFVcbBI';
  var TABLE = 'negocios_directorio360';

  var CATEGORY_LABELS = {
    alfareria: 'Alfareria',
    talleres: 'Taller',
    restaurantes: 'Restaurante',
    alojamiento: 'Alojamiento',
    comercio: 'Comercio',
    servicios: 'Servicios',
    estacionamientos: 'Estacionar',
    salud: 'Salud',
    seguridad: 'Seguridad',
    banos: 'Banos',
    transporte: 'Transporte',
    turismo: 'Turismo'
  };

  // ─── State ──────────────────────────────────────────────────────────────
  var allCards = [];
  var currentCat = 'todos';
  var currentQuery = '';
  var dataLoaded = false;


  // ─── DOM References ─────────────────────────────────────────────────────
  var grid = document.getElementById('modGrid');
  var searchInput = document.getElementById('modSearchInput');
  var searchClear = document.getElementById('modSearchClear');
  var searchCount = document.getElementById('modSearchCount');
  var dirTitle = document.getElementById('modDirTitle');
  var dirCount = document.getElementById('modDirCount');
  var emptyState = document.getElementById('modEmpty');
  var scrollTopBtn = document.getElementById('modScrollTop');
  var catButtons = document.querySelectorAll('.mod-cat-btn');

  // ─── Helpers ────────────────────────────────────────────────────────────
  function norm(str) {
    return (str || '').toString().toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function slugify(str) {
    return norm(str).replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // ─── Category Emojis (placeholder when no image) ─────────────────────────
  var CATEGORY_EMOJIS = {
    alfareria: '🏺', talleres: '🔨', restaurantes: '🍽️',
    alojamiento: '🏡', comercio: '🛍️', servicios: '🔧',
    estacionamientos: '🅿️', salud: '🏥', seguridad: '🛡️',
    banos: '🚻', transporte: '🚌', turismo: '📍'
  };

  // ─── Star Rating Helper ──────────────────────────────────────────────────
  function renderStars(avg) {
    var html = '';
    var full = Math.floor(avg);
    var half = (avg - full) >= 0.5 ? 1 : 0;
    var empty = 5 - full - half;
    for (var i = 0; i < full; i++) html += '<span class="mod-star mod-star-full">★</span>';
    if (half) html += '<span class="mod-star mod-star-half">★</span>';
    for (var j = 0; j < empty; j++) html += '<span class="mod-star mod-star-empty">☆</span>';
    return html;
  }

  // ─── Plan Feature Levels ─────────────────────────────────────────────────
  // Determines what each plan can show:
  //   gratis    → básico: nombre, dirección, categoría, teléfono, tag
  //   destacado → intermedio: + descripción, horario, WhatsApp, rating, mapa, IG
  //   premium   → todo: + galería, verificado, Facebook, TikTok, Web
  var PLAN_LEVELS = { gratis: 0, destacado: 1, premium: 2 };

  function getPlanLevel(plan) {
    if (plan === 'premium') return 2;
    if (plan === 'destacado') return 1;
    return 0; // gratis or empty
  }

  // ─── Card Renderer ──────────────────────────────────────────────────────
  function renderCard(item) {
    var cat = item._categoria || item.cat || 'servicios';
    var name = item.n || item.nombre || '';
    var addr = item.a || item.direccion || '';
    var phone = item.p || item.telefono || '';
    var wsp = item.wsp || item.whatsapp || '';
    var ig = item.ig || item.instagram || '';
    var fb = item.fb || item.facebook || '';
    var web = item.web || item.sitio_web || '';
    var map = item.map || item.google_maps || '';
    var tag = item.tag || item.horario || '';
    var slug = item.slug || slugify(name);
    var plan = item.plan || '';
    var label = CATEGORY_LABELS[cat] || cat;
    var img = item.img || '';
    var lat = item.lat || null;
    var lng = item.lng || null;
    var desc = item.desc || item.descripcion || '';
    var ratingAvg = parseFloat(item.rating_avg) || 0;
    var ratingCount = parseInt(item.rating_count) || 0;
    var verificado = item.verificado || false;
    var tiktok = item.tiktok || '';
    var fotos = item.fotos || item.photos || [];
    var hours = item.hours || '';

    // Plan level: 0=gratis, 1=destacado, 2=premium
    var level = getPlanLevel(plan);

    var cardClass = 'mod-card';
    if (plan === 'destacado') cardClass += ' mod-featured';
    if (plan === 'premium') cardClass += ' mod-premium';

    var html = '<article class="' + cardClass + '" data-cat="' + escapeHTML(cat) + '" '
      + 'id="' + escapeHTML(slug) + '" '
      + 'style="--cat-color:var(--cat-' + escapeHTML(cat) + ')">';

    // ─── Image Header (todos los planes) ────────────────────────────────
    html += '<div class="mod-card-img-wrapper">';
    if (img) {
      html += '<img class="mod-card-img" src="' + escapeHTML(img) + '" alt="' + escapeHTML(name) + '" loading="lazy">';
    } else {
      html += '<div class="mod-card-img-placeholder"><span>' + (CATEGORY_EMOJIS[cat] || '🏪') + '</span></div>';
    }
    // Category badge over image (todos)
    html += '<span class="mod-card-img-badge">' + escapeHTML(label) + '</span>';
    // Plan badge (destacado/premium)
    if (plan === 'premium') {
      html += '<span class="mod-card-plan-badge mod-plan-premium">Premium</span>';
    } else if (plan === 'destacado') {
      html += '<span class="mod-card-plan-badge mod-plan-destacado">Destacado</span>';
    }
    // Verificado badge over image (solo premium)
    if (level >= 2 && verificado) {
      html += '<span class="mod-card-verified-badge" title="Negocio verificado">✓ Verificado</span>';
    }
    html += '</div>';

    // ─── Card Body ──────────────────────────────────────────────────────
    html += '<div class="mod-card-body">'
      + '<div class="mod-card-top">'
      + '<h3 class="mod-card-name">' + escapeHTML(name);
    // Verificado icon en nombre (solo premium)
    if (level >= 2 && verificado) {
      html += ' <span class="mod-verified-icon" title="Verificado">✓</span>';
    }
    html += '</h3>'
      + '</div>';

    // ─── Rating (destacado + premium) ───────────────────────────────────
    if (level >= 1 && ratingAvg > 0) {
      html += '<div class="mod-card-rating">'
        + '<span class="mod-card-stars">' + renderStars(ratingAvg) + '</span>'
        + '<span class="mod-card-rating-text">' + ratingAvg.toFixed(1);
      if (ratingCount > 0) {
        html += ' <span class="mod-card-rating-count">(' + ratingCount + (ratingCount === 1 ? ' reseña' : ' reseñas') + ')</span>';
      }
      html += '</span></div>';
    }

    // Dirección (todos)
    if (addr) {
      html += '<p class="mod-card-addr">📍 ' + escapeHTML(addr) + '</p>';
    }

    // ─── Descripción (destacado + premium) ──────────────────────────────
    if (level >= 1 && desc) {
      var maxLen = level >= 2 ? 200 : 120;
      var shortDesc = desc.length > maxLen ? desc.substring(0, maxLen) + '…' : desc;
      html += '<p class="mod-card-desc">' + escapeHTML(shortDesc) + '</p>';
    }

    // Tag (todos)
    if (tag) {
      html += '<span class="mod-card-tag">' + escapeHTML(tag) + '</span>';
    }

    // ─── Horario detallado (destacado + premium) ────────────────────────
    if (level >= 1 && hours && hours !== tag) {
      html += '<div class="mod-card-hours">'
        + '<span class="mod-card-hours-icon">🕐</span>'
        + '<span class="mod-card-hours-text">' + escapeHTML(hours) + '</span>'
        + '</div>';
    }

    // ─── Galería de fotos (solo premium) ────────────────────────────────
    if (level >= 2 && fotos && fotos.length > 0) {
      var maxPhotos = Math.min(fotos.length, 4);
      html += '<div class="mod-card-gallery">';
      for (var fi = 0; fi < maxPhotos; fi++) {
        if (fotos[fi]) {
          html += '<img class="mod-card-gallery-thumb" src="' + escapeHTML(fotos[fi]) + '" alt="Foto de ' + escapeHTML(name) + '" loading="lazy">';
        }
      }
      if (fotos.length > 4) {
        html += '<span class="mod-card-gallery-more">+' + (fotos.length - 4) + '</span>';
      }
      html += '</div>';
    }

    // ─── Map Buttons (todos los planes) ───────────────────────────────────
    var hasCoords = lat && lng;
    var hasMap = map || hasCoords;
    if (hasMap) {
      html += '<div class="mod-card-map-buttons">';
      if (hasCoords) {
        var mapaInteractivoUrl = '/mapa-turistico/#' + lat + ',' + lng;
        html += '<a class="mod-btn-mapa-interactivo" href="' + mapaInteractivoUrl + '" title="Ver en mapa interactivo de Pomaire 360">'
          + '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>'
          + ' Mapa Interactivo</a>';
      }
      if (hasCoords) {
        var googleMapsUrl = 'https://www.google.com/maps/dir/?api=1&destination=' + lat + ',' + lng;
        html += '<a class="mod-btn-google-maps" href="' + escapeHTML(googleMapsUrl) + '" target="_blank" rel="noopener" title="Como llegar en Google Maps">'
          + '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>'
          + ' Google Maps</a>';
      } else if (map) {
        html += '<a class="mod-btn-google-maps" href="' + escapeHTML(map) + '" target="_blank" rel="noopener" title="Ver en Google Maps">'
          + '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>'
          + ' Google Maps</a>';
      }
      html += '</div>';
    }

    // ─── Actions (diferenciado por plan) ────────────────────────────────
    html += '<div class="mod-card-actions">';

    // Teléfono: todos los planes
    if (phone) {
      html += '<a href="tel:' + escapeHTML(phone) + '">📞 Llamar</a>';
    }
    // WhatsApp: destacado + premium
    if (level >= 1 && wsp) {
      var wspNum = wsp.replace(/\D/g, '');
      html += '<a class="mod-action-wsp" href="https://wa.me/' + wspNum + '" target="_blank" rel="noopener">💬 WhatsApp</a>';
    }
    // Instagram: destacado + premium
    if (level >= 1 && ig) {
      var igHandle = ig.replace('@', '');
      html += '<a class="mod-action-ig" href="https://instagram.com/' + escapeHTML(igHandle) + '" target="_blank" rel="noopener">📷 IG</a>';
    }
    // Facebook: solo premium
    if (level >= 2 && fb) {
      html += '<a class="mod-action-fb" href="' + escapeHTML(fb) + '" target="_blank" rel="noopener">📘 Facebook</a>';
    }
    // TikTok: solo premium
    if (level >= 2 && tiktok) {
      var tiktokHandle = tiktok.replace('@', '');
      html += '<a class="mod-action-tiktok" href="https://tiktok.com/@' + escapeHTML(tiktokHandle) + '" target="_blank" rel="noopener">🎵 TikTok</a>';
    }
    // Web: solo premium
    if (level >= 2 && web) {
      html += '<a class="mod-action-web" href="' + escapeHTML(web) + '" target="_blank" rel="noopener">🌐 Web</a>';
    }
    html += '</div>';

    // ─── CTA "Mejora tu plan" (solo gratis) ─────────────────────────────
    if (level === 0) {
      html += '<div class="mod-card-upgrade">'
        + '<a href="/anunciate/" class="mod-upgrade-link" title="Muestra más info de tu negocio">'
        + '✨ Destaca tu negocio'
        + '</a></div>';
    }

    html += '</div></article>';

    return html;
  }


  // ─── Render All Cards ───────────────────────────────────────────────────
  function renderGrid(items) {
    if (!items || items.length === 0) {
      grid.innerHTML = '';
      emptyState.classList.remove('mod-hidden');
      dirCount.textContent = '0 negocios';
      return;
    }
    emptyState.classList.add('mod-hidden');
    grid.innerHTML = items.map(renderCard).join('');
    dirCount.textContent = items.length + (items.length === 1 ? ' negocio' : ' negocios');
  }

  // ─── Filter Logic ───────────────────────────────────────────────────────
  function applyFilters() {
    var q = norm(currentQuery);
    var filtered = allCards.filter(function (item) {
      // Category filter
      if (currentCat !== 'todos') {
        var cat = item._categoria || item.cat || 'servicios';
        if (cat !== currentCat) return false;
      }
      // Search filter
      if (q) {
        var name = norm(item.n || item.nombre || '');
        var addr = norm(item.a || item.direccion || '');
        var tag = norm(item.tag || item.horario || '');
        var cat2 = norm(item._categoria || item.cat || '');
        var desc = norm(item.desc || '');
        if (name.indexOf(q) === -1 && addr.indexOf(q) === -1
            && tag.indexOf(q) === -1 && cat2.indexOf(q) === -1
            && desc.indexOf(q) === -1) {
          return false;
        }
      }
      return true;
    });

    renderGrid(filtered);

    // Update search count
    if (q) {
      searchCount.textContent = filtered.length === 0
        ? 'Sin resultados para "' + currentQuery + '"'
        : filtered.length + (filtered.length === 1 ? ' resultado' : ' resultados');
    } else {
      searchCount.textContent = '';
    }

    // Update title
    if (currentCat === 'todos') {
      dirTitle.textContent = q ? 'Resultados de busqueda' : 'Todos los negocios';
    } else {
      var catLabel = CATEGORY_LABELS[currentCat] || currentCat;
      dirTitle.textContent = q ? catLabel + ' — resultados' : catLabel;
    }
  }


  // ─── Update Category Counts ─────────────────────────────────────────────
  function updateCounts() {
    var counts = { todos: allCards.length };
    allCards.forEach(function (item) {
      var cat = item._categoria || item.cat || 'servicios';
      counts[cat] = (counts[cat] || 0) + 1;
    });

    catButtons.forEach(function (btn) {
      var cat = btn.dataset.cat;
      var countEl = btn.querySelector('.mod-cat-count');
      if (countEl) {
        countEl.textContent = counts[cat] || 0;
      }
    });

    // Update hero stat
    var statTotal = document.getElementById('statTotal');
    if (statTotal) statTotal.textContent = allCards.length;
  }

  // ─── Category Click Handlers ────────────────────────────────────────────
  catButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      currentCat = btn.dataset.cat;
      catButtons.forEach(function (b) {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      applyFilters();
      // Smooth scroll to grid
      document.getElementById('directorio').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // ─── Search Handlers ────────────────────────────────────────────────────
  var searchTimeout;
  searchInput.addEventListener('input', function () {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(function () {
      currentQuery = searchInput.value.trim();
      searchClear.hidden = currentQuery.length === 0;
      applyFilters();
    }, 200);
  });

  searchClear.addEventListener('click', function () {
    searchInput.value = '';
    currentQuery = '';
    searchClear.hidden = true;
    searchInput.focus();
    applyFilters();
  });


  // ─── Data Loading ───────────────────────────────────────────────────────
  function processData(rows) {
    allCards = rows.map(function (row) {
      return {
        n: row.nombre || row.n || '',
        a: row.direccion || row.a || '',
        p: row.telefono || row.p || '',
        tag: row.horario || row.tag || '',
        map: row.google_maps || row.map || '',
        ig: row.instagram || row.ig || '',
        fb: row.facebook || row.fb || '',
        web: row.web || row.sitio_web || '',
        wsp: row.whatsapp || row.wsp || '',
        tiktok: row.tiktok || '',
        plan: row.plan || '',
        slug: row.slug || slugify(row.nombre || row.n || ''),
        _categoria: row.categoria || row._categoria || row.cat || 'servicios',
        img: row.imagen_principal || row.foto_portada || row.img || '',
        lat: row.latitud || row.lat || null,
        lng: row.longitud || row.lng || null,
        desc: row.descripcion || row.desc || '',
        rating_avg: parseFloat(row.rating_avg) || 0,
        rating_count: parseInt(row.rating_count) || 0,
        verificado: row.verificado || false,
        fotos: row.fotos || row.photos || [],
        hours: row.horario || row.hours || ''
      };
    });
    dataLoaded = true;
    updateCounts();
    applyFilters();
    handleHashNavigation();
    handleUrlCatParam();
  }

  // Try loading static JSON first, then Supabase as backup
  function loadStaticData() {
    return fetch('/directory-data.json')
      .then(function (res) {
        if (!res.ok) throw new Error('No static data');
        return res.json();
      })
      .then(function (data) {
        // directory-data.json is grouped by category
        var flat = [];
        Object.keys(data).forEach(function (key) {
          if (key === '_meta') return;
          var items = data[key];
          if (Array.isArray(items)) {
            items.forEach(function (item) {
              item._categoria = item._categoria || key;
              flat.push(item);
            });
          }
        });
        return flat;
      });
  }

  function loadSupabaseData() {
    var url = SUPABASE_URL + '/rest/v1/' + TABLE + '?select=*&order=updated_at.desc';
    return fetch(url, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
        'Accept': 'application/json'
      }
    }).then(function (res) {
      if (!res.ok) throw new Error('Supabase error');
      return res.json();
    });
  }

  // Load data: static first, then try live update
  loadStaticData()
    .then(function (data) {
      if (data && data.length > 0) processData(data);
      // Also try Supabase for fresher data
      return loadSupabaseData();
    })
    .then(function (rows) {
      if (rows && rows.length > 0) processData(rows);
    })
    .catch(function () {
      // If static failed, try Supabase directly
      if (!dataLoaded) {
        loadSupabaseData()
          .then(function (rows) {
            if (rows && rows.length > 0) processData(rows);
          })
          .catch(function () {
            // Keep static HTML cards as fallback
            initFromDOM();
          });
      }
    });


  // ─── Fallback: Init from existing DOM cards ─────────────────────────────
  function initFromDOM() {
    var cards = grid.querySelectorAll('.mod-card');
    allCards = Array.prototype.map.call(cards, function (card) {
      var nameEl = card.querySelector('.mod-card-name');
      var addrEl = card.querySelector('.mod-card-addr');
      var tagEl = card.querySelector('.mod-card-tag');
      return {
        n: nameEl ? nameEl.textContent : '',
        a: addrEl ? addrEl.textContent.replace('📍 ', '') : '',
        tag: tagEl ? tagEl.textContent : '',
        _categoria: card.dataset.cat || 'servicios',
        slug: card.id || slugify(nameEl ? nameEl.textContent : ''),
        map: '', p: '', ig: '', web: '', wsp: '', plan: ''
      };
    });
    dataLoaded = true;
    updateCounts();
  }

  // ─── Hash Navigation with Highlight ─────────────────────────────────────
  function handleHashNavigation() {
    var hash = window.location.hash.replace('#', '');
    if (!hash) return;

    // Remove previous highlight
    var prev = document.querySelector('.mod-card.mod-highlight');
    if (prev) prev.classList.remove('mod-highlight');

    // Wait for DOM to settle after data render
    setTimeout(function () {
      var target = document.getElementById(hash);
      if (!target) {
        // If exact slug not found, try partial match
        var allCards = grid.querySelectorAll('.mod-card');
        for (var i = 0; i < allCards.length; i++) {
          if (allCards[i].id && allCards[i].id.indexOf(hash) !== -1) {
            target = allCards[i];
            break;
          }
        }
      }
      if (target) {
        // Reset any active category filter to show all cards
        if (currentCat !== 'todos') {
          currentCat = 'todos';
          catButtons.forEach(function (b) {
            b.classList.remove('active');
            b.setAttribute('aria-selected', 'false');
            if (b.dataset.cat === 'todos') {
              b.classList.add('active');
              b.setAttribute('aria-selected', 'true');
            }
          });
          applyFilters();
        }

        // Scroll and highlight
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        target.classList.add('mod-highlight');

        // Remove highlight after animation completes
        setTimeout(function () {
          target.classList.remove('mod-highlight');
        }, 4000);
      }
    }, 400);
  }

  // ─── URL Parameter Navigation (?cat=X) ─────────────────────────────────
  function handleUrlCatParam() {
    var params = new URLSearchParams(window.location.search);
    var cat = params.get('cat');
    if (!cat) return;
    // Normalize: map common aliases
    var aliases = {
      'alfareria': 'alfareria', 'pottery': 'alfareria',
      'talleres': 'talleres', 'workshops': 'talleres',
      'restaurantes': 'restaurantes', 'food': 'restaurantes', 'gastronomia': 'restaurantes',
      'alojamiento': 'alojamiento', 'lodging': 'alojamiento', 'alojamientos': 'alojamiento',
      'comercio': 'comercio', 'shops': 'comercio',
      'servicios': 'servicios', 'services': 'servicios',
      'estacionamientos': 'estacionamientos', 'parking': 'estacionamientos',
      'salud': 'salud', 'health': 'salud',
      'seguridad': 'seguridad', 'security': 'seguridad',
      'banos': 'banos', 'bathrooms': 'banos',
      'transporte': 'transporte', 'transport': 'transporte',
      'turismo': 'turismo', 'tourism': 'turismo'
    };
    var resolved = aliases[cat.toLowerCase()] || cat.toLowerCase();
    // Check if it's a valid category
    if (!CATEGORY_LABELS[resolved] && resolved !== 'todos') return;
    // Apply filter
    currentCat = resolved;
    catButtons.forEach(function (btn) {
      var isActive = btn.dataset.cat === resolved;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
    applyFilters();
    // Scroll to directory section
    setTimeout(function () {
      var dir = document.getElementById('directorio');
      if (dir) dir.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 400);
  }

  window.addEventListener('hashchange', handleHashNavigation);

  // ─── Scroll to Top Button ───────────────────────────────────────────────
  function toggleScrollTop() {
    if (window.scrollY > 600) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', toggleScrollTop, { passive: true });
  scrollTopBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ─── Keyboard Navigation for Categories ─────────────────────────────────
  var catGrid = document.querySelector('.mod-cat-grid');
  if (catGrid) {
    catGrid.addEventListener('keydown', function (e) {
      var btns = Array.prototype.slice.call(catButtons);
      var idx = btns.indexOf(document.activeElement);
      if (idx === -1) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        var next = btns[(idx + 1) % btns.length];
        next.focus();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        var prev = btns[(idx - 1 + btns.length) % btns.length];
        prev.focus();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        document.activeElement.click();
      }
    });
  }

})();
