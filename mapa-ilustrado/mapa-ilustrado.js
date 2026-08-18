/* ═══════════════════════════════════════════════════════════════════════════
   Mapa Ilustrado Interactivo de Pomaire
   Estilo parque temático (tipo Beto Carrero World)
   
   Features:
   - Imagen SVG ilustrada como base con pan/zoom
   - Marcadores posicionados por coordenadas relativas al mapa
   - Popups informativos detallados
   - Filtros por categoría
   - Responsive + touch gestures
   - Datos desde Supabase (con fallback)
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  // ─── Config ──────────────────────────────────────────────────────────────────
  var SUPABASE_URL = 'https://uuskvqtbsvtfsovcjazf.supabase.co';
  var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
    'eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1c2t2cXRic3Z0ZnNvdmNqYXpmIiwi' +
    'cm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2ODU4NDIsImV4cCI6MjEwMDI2MTg0Mn0.' +
    'BbHI3ctSNg5msUnL9eENTNpOujQROAh6vUAZpFVcbBI';
  var TABLE = 'negocios_directorio360';

  // Dimensiones del canvas del mapa (imagen original 5552x3403, cropped: left 900px, bottom 860px)
  var MAP_W = 4652;
  var MAP_H = 2543;

  // Coordenadas reales de Pomaire (para mapear lat/lng → posición en el mapa)
  // El mapa ilustrado del PDF cubre aproximadamente esta zona
  // Ajustado para que los marcadores caigan sobre la imagen recortada
  var GEO_BOUNDS = {
    minLat: -33.6580,
    maxLat: -33.6420,
    minLng: -71.1600,
    maxLng: -71.1380
  };

  // Offset por el crop de la imagen (900px desde la izquierda)
  var CROP_LEFT = 900;
  var IMG_FULL_W = 5552;
  var IMG_FULL_H = 3403;
  var CROP_BOTTOM = 860;

  // Categorías → colores e iconos
  var CATS = {
    alfareria:        { filter: 'alfareria',    color: '#B85C2C', icon: '🏺', label: 'Alfarería' },
    talleres:         { filter: 'talleres',     color: '#C96B3C', icon: '🎨', label: 'Talleres' },
    restaurantes:     { filter: 'restaurantes', color: '#D4622A', icon: '🍽️', label: 'Restaurantes' },
    alojamiento:      { filter: 'alojamiento',  color: '#2F7A6B', icon: '🛏️', label: 'Alojamiento' },
    comercio:         { filter: 'comercio',     color: '#7A5C40', icon: '🛍️', label: 'Comercio' },
    servicios:        { filter: 'servicios',    color: '#5B6ABF', icon: '🔧', label: 'Servicios' },
    estacionamientos: { filter: 'estacionamientos', color: '#3B7DD8', icon: '🅿️', label: 'Estacionamientos' },
    salud:            { filter: 'salud',        color: '#E25555', icon: '🏥', label: 'Salud' },
    seguridad:        { filter: 'seguridad',    color: '#4A5568', icon: '🚔', label: 'Seguridad' },
    banos:            { filter: 'banos',        color: '#3B7DD8', icon: '🚻', label: 'Baños' },
    transporte:       { filter: 'transporte',   color: '#6B46C1', icon: '🚌', label: 'Transporte' },
    turismo:          { filter: 'turismo',      color: '#4A7C59', icon: '📍', label: 'Turismo' }
  };

  // ─── State ───────────────────────────────────────────────────────────────────
  var viewport, canvas, markersLayer;
  var scale = 0.5;
  var minScale = 0.25;
  var maxScale = 2;
  var panX = 0, panY = 0;
  var isDragging = false;
  var lastX = 0, lastY = 0;
  var touchDist = 0;
  var allNegocios = [];
  var currentFilter = 'all';
  var markers = [];

  // ─── Init ────────────────────────────────────────────────────────────────────
  function init() {
    viewport = document.getElementById('mapaViewport');
    canvas = document.getElementById('mapaCanvas');
    markersLayer = document.getElementById('mapaMarkers');

    if (!viewport || !canvas) return;

    // Center the map initially
    centerMap();

    // Bind events
    bindMouseEvents();
    bindTouchEvents();
    bindWheelEvent();

    // Load data
    loadNegocios();

    // Bind filter buttons
    document.querySelectorAll('.mapa-filter-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var cat = btn.dataset.filter;
        setFilter(cat);
      });
    });

    // Close popup
    document.getElementById('popupOverlay').addEventListener('click', function (e) {
      if (e.target === this) closePopup();
    });
    document.getElementById('popupClose').addEventListener('click', closePopup);

    // Keyboard
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closePopup();
    });

    // Zoom controls
    document.getElementById('zoomIn').addEventListener('click', function () { zoom(1.3); });
    document.getElementById('zoomOut').addEventListener('click', function () { zoom(0.7); });
    document.getElementById('zoomReset').addEventListener('click', centerMap);

    // Window resize
    window.addEventListener('resize', updateMinimap);
  }

  // ─── Geo → Map position ──────────────────────────────────────────────────────
  function geoToMap(lat, lng) {
    // Map geo coordinates to full image pixels, then subtract crop offset
    var fullX = ((lng - GEO_BOUNDS.minLng) / (GEO_BOUNDS.maxLng - GEO_BOUNDS.minLng)) * IMG_FULL_W;
    var fullY = ((lat - GEO_BOUNDS.maxLat) / (GEO_BOUNDS.minLat - GEO_BOUNDS.maxLat)) * (IMG_FULL_H - CROP_BOTTOM);

    // Adjust for the left crop
    var x = fullX - CROP_LEFT;
    var y = fullY;

    // Clamp to visible area
    x = Math.max(20, Math.min(MAP_W - 20, x));
    y = Math.max(20, Math.min(MAP_H - 20, y));
    return { x: x, y: y };
  }

  // ─── Pan & Zoom ──────────────────────────────────────────────────────────────
  function applyTransform() {
    canvas.style.transform = 'translate(' + panX + 'px, ' + panY + 'px) scale(' + scale + ')';
    updateMinimap();
  }

  function centerMap() {
    var vw = viewport.clientWidth;
    var vh = viewport.clientHeight;
    scale = Math.min(vw / MAP_W, vh / MAP_H) * 0.9;
    scale = Math.max(minScale, Math.min(maxScale, scale));
    panX = (vw - MAP_W * scale) / 2;
    panY = (vh - MAP_H * scale) / 2;
    canvas.classList.add('smooth-transition');
    applyTransform();
    setTimeout(function () { canvas.classList.remove('smooth-transition'); }, 350);
  }

  function zoom(factor, cx, cy) {
    var vw = viewport.clientWidth;
    var vh = viewport.clientHeight;
    if (cx === undefined) cx = vw / 2;
    if (cy === undefined) cy = vh / 2;

    var oldScale = scale;
    scale = Math.max(minScale, Math.min(maxScale, scale * factor));
    var ratio = scale / oldScale;

    panX = cx - (cx - panX) * ratio;
    panY = cy - (cy - panY) * ratio;

    canvas.classList.add('smooth-transition');
    applyTransform();
    setTimeout(function () { canvas.classList.remove('smooth-transition'); }, 300);
  }

  function constrainPan() {
    var vw = viewport.clientWidth;
    var vh = viewport.clientHeight;
    var mapW = MAP_W * scale;
    var mapH = MAP_H * scale;

    if (mapW <= vw) {
      panX = (vw - mapW) / 2;
    } else {
      panX = Math.min(0, Math.max(vw - mapW, panX));
    }
    if (mapH <= vh) {
      panY = (vh - mapH) / 2;
    } else {
      panY = Math.min(0, Math.max(vh - mapH, panY));
    }
  }

  // ─── Mouse events ────────────────────────────────────────────────────────────
  function bindMouseEvents() {
    viewport.addEventListener('mousedown', function (e) {
      if (e.button !== 0) return;
      isDragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      viewport.classList.add('is-dragging');
      e.preventDefault();
    });

    document.addEventListener('mousemove', function (e) {
      if (!isDragging) return;
      var dx = e.clientX - lastX;
      var dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      panX += dx;
      panY += dy;
      constrainPan();
      applyTransform();
    });

    document.addEventListener('mouseup', function () {
      isDragging = false;
      viewport.classList.remove('is-dragging');
    });
  }

  // ─── Touch events ────────────────────────────────────────────────────────────
  function bindTouchEvents() {
    viewport.addEventListener('touchstart', function (e) {
      if (e.touches.length === 1) {
        isDragging = true;
        lastX = e.touches[0].clientX;
        lastY = e.touches[0].clientY;
        viewport.classList.add('is-dragging');
      } else if (e.touches.length === 2) {
        isDragging = false;
        touchDist = getTouchDist(e.touches);
      }
    }, { passive: false });

    viewport.addEventListener('touchmove', function (e) {
      e.preventDefault();
      if (e.touches.length === 1 && isDragging) {
        var dx = e.touches[0].clientX - lastX;
        var dy = e.touches[0].clientY - lastY;
        lastX = e.touches[0].clientX;
        lastY = e.touches[0].clientY;
        panX += dx;
        panY += dy;
        constrainPan();
        applyTransform();
      } else if (e.touches.length === 2) {
        var newDist = getTouchDist(e.touches);
        var factor = newDist / touchDist;
        touchDist = newDist;
        var midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        var midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        var rect = viewport.getBoundingClientRect();
        zoom(factor, midX - rect.left, midY - rect.top);
      }
    }, { passive: false });

    viewport.addEventListener('touchend', function (e) {
      if (e.touches.length === 0) {
        isDragging = false;
        viewport.classList.remove('is-dragging');
      }
    });
  }

  function getTouchDist(touches) {
    var dx = touches[0].clientX - touches[1].clientX;
    var dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // ─── Wheel zoom ──────────────────────────────────────────────────────────────
  function bindWheelEvent() {
    viewport.addEventListener('wheel', function (e) {
      e.preventDefault();
      var rect = viewport.getBoundingClientRect();
      var cx = e.clientX - rect.left;
      var cy = e.clientY - rect.top;
      var factor = e.deltaY < 0 ? 1.15 : 0.87;

      var oldScale = scale;
      scale = Math.max(minScale, Math.min(maxScale, scale * factor));
      var ratio = scale / oldScale;
      panX = cx - (cx - panX) * ratio;
      panY = cy - (cy - panY) * ratio;
      constrainPan();
      applyTransform();
    }, { passive: false });
  }

  // ─── Load negocios from Supabase ─────────────────────────────────────────────
  function loadNegocios() {
    var url = SUPABASE_URL + '/rest/v1/' + TABLE + '?select=*&order=nombre.asc';
    fetch(url, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
        'Accept': 'application/json'
      }
    })
    .then(function (res) { return res.json(); })
    .then(function (data) {
      allNegocios = data.filter(function (n) {
        return n.latitud && n.longitud;
      });
      renderMarkers();
      updateStats();
      document.getElementById('mapaLoading').style.display = 'none';
    })
    .catch(function (err) {
      console.warn('Error cargando negocios:', err);
      document.getElementById('mapaLoading').innerHTML = '<p>⚠️ Error cargando datos. <button onclick="location.reload()">Reintentar</button></p>';
    });
  }

  // ─── Render markers ──────────────────────────────────────────────────────────
  function renderMarkers() {
    markersLayer.innerHTML = '';
    markers = [];

    allNegocios.forEach(function (neg) {
      var cat = CATS[neg.categoria] || { filter: 'servicios', color: '#888', icon: '📍', label: 'Otro' };
      var pos = geoToMap(neg.latitud, neg.longitud);
      var featured = neg.plan === 'premium' || neg.plan === 'destacado';

      var marker = document.createElement('div');
      marker.className = 'mapa-marker' + (featured ? ' featured' : '');
      marker.style.left = pos.x + 'px';
      marker.style.top = pos.y + 'px';
      marker.dataset.filter = cat.filter;
      marker.dataset.slug = neg.slug || '';

      var dot = document.createElement('div');
      dot.className = 'marker-dot';
      dot.style.background = cat.color;
      dot.innerHTML = cat.icon;
      marker.appendChild(dot);

      var label = document.createElement('div');
      label.className = 'marker-label';
      label.textContent = neg.nombre;
      marker.appendChild(label);

      marker.addEventListener('click', function (e) {
        e.stopPropagation();
        openPopup(neg);
      });

      markersLayer.appendChild(marker);
      markers.push({ el: marker, neg: neg, cat: cat });
    });

    applyFilter();
  }

  // ─── Filter ──────────────────────────────────────────────────────────────────
  function setFilter(cat) {
    currentFilter = cat;
    document.querySelectorAll('.mapa-filter-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.filter === cat);
    });
    applyFilter();
  }

  function applyFilter() {
    var counts = {};
    markers.forEach(function (m) {
      var show = currentFilter === 'all' || m.cat.filter === currentFilter;
      m.el.classList.toggle('hidden', !show);
      // Count
      if (!counts[m.cat.filter]) counts[m.cat.filter] = 0;
      counts[m.cat.filter]++;
    });

    // Update filter counts
    document.querySelectorAll('.mapa-filter-btn .filter-count').forEach(function (el) {
      var f = el.closest('.mapa-filter-btn').dataset.filter;
      if (f === 'all') {
        el.textContent = markers.length;
      } else {
        el.textContent = counts[f] || 0;
      }
    });
  }

  // ─── Popup ───────────────────────────────────────────────────────────────────
  function openPopup(neg) {
    var cat = CATS[neg.categoria] || { icon: '📍', label: 'Otro', color: '#888' };
    var overlay = document.getElementById('popupOverlay');
    var popup = document.getElementById('popupContent');

    // Cover image
    var coverHTML = '';
    if (neg.foto_portada) {
      coverHTML = '<img class="popup-cover" src="' + escapeHTML(neg.foto_portada) + '" alt="' + escapeHTML(neg.nombre) + '" loading="lazy" onerror="this.style.display=\'none\'">';
    } else {
      coverHTML = '<div class="popup-no-cover"></div>';
    }

    // Badge
    var badgeHTML = '';
    if (neg.plan === 'premium') badgeHTML = '<span class="popup-badge premium">💎 Premium</span>';
    else if (neg.plan === 'destacado') badgeHTML = '<span class="popup-badge destacado">⭐ Destacado</span>';

    // Verified
    var verifiedHTML = neg.verificado ? ' <span class="popup-verified" title="Verificado">✓</span>' : '';

    // Hours
    var hoursHTML = neg.horario ? '<div class="popup-hours">🕐 ' + escapeHTML(neg.horario) + '</div>' : '';

    // Description
    var descHTML = neg.descripcion ? '<p class="popup-desc">' + escapeHTML(neg.descripcion).substring(0, 200) + (neg.descripcion.length > 200 ? '...' : '') + '</p>' : '';

    // Actions
    var actionsHTML = '<div class="popup-actions">';
    if (neg.telefono) {
      actionsHTML += '<a class="popup-action primary" href="tel:' + neg.telefono.replace(/[^+\d]/g, '') + '">📞 Llamar</a>';
    }
    if (neg.whatsapp) {
      actionsHTML += '<a class="popup-action whatsapp" href="https://wa.me/' + String(neg.whatsapp).replace(/[^0-9]/g, '') + '" target="_blank" rel="noopener">💬 WhatsApp</a>';
    }
    if (neg.google_maps) {
      actionsHTML += '<a class="popup-action" href="' + escapeHTML(neg.google_maps) + '" target="_blank" rel="noopener">🗺️ Cómo llegar</a>';
    }
    if (neg.instagram) {
      actionsHTML += '<a class="popup-action" href="https://instagram.com/' + escapeHTML(neg.instagram) + '" target="_blank" rel="noopener">📷 Instagram</a>';
    }
    if (neg.web) {
      actionsHTML += '<a class="popup-action" href="' + escapeHTML(neg.web) + '" target="_blank" rel="noopener">🌐 Web</a>';
    }
    if (neg.slug) {
      actionsHTML += '<a class="popup-action" href="https://app.pomaire360.cl/negocios/' + escapeHTML(neg.slug) + '" target="_blank" rel="noopener">⭐ Reseñas</a>';
    }
    actionsHTML += '</div>';

    popup.innerHTML = coverHTML +
      '<button class="popup-close" id="popupClose" onclick="document.getElementById(\'popupOverlay\').classList.remove(\'active\')">✕</button>' +
      '<div class="popup-body">' +
      '<div class="popup-category"><span>' + cat.icon + '</span> ' + escapeHTML(cat.label) + '</div>' +
      '<h3 class="popup-name">' + escapeHTML(neg.nombre) + verifiedHTML + badgeHTML + '</h3>' +
      '<p class="popup-address">📍 ' + escapeHTML(neg.direccion || '') + '</p>' +
      descHTML +
      hoursHTML +
      actionsHTML +
      '</div>';

    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closePopup() {
    document.getElementById('popupOverlay').classList.remove('active');
    document.body.style.overflow = '';
  }

  // ─── Stats ───────────────────────────────────────────────────────────────────
  function updateStats() {
    var el = document.getElementById('mapaStats');
    if (!el) return;

    var catCounts = {};
    allNegocios.forEach(function (n) {
      var cat = n.categoria;
      if (!catCounts[cat]) catCounts[cat] = 0;
      catCounts[cat]++;
    });

    var html = '<span class="mapa-stat"><strong>' + allNegocios.length + '</strong> lugares</span>';
    var topCats = ['alfareria', 'restaurantes', 'talleres', 'comercio'];
    topCats.forEach(function (c) {
      if (catCounts[c]) {
        var cat = CATS[c];
        html += '<span class="mapa-stat">' + cat.icon + ' <strong>' + catCounts[c] + '</strong> ' + cat.label + '</span>';
      }
    });

    el.innerHTML = html;
  }

  // ─── Minimap ─────────────────────────────────────────────────────────────────
  function updateMinimap() {
    var mini = document.getElementById('minimapView');
    if (!mini || !viewport) return;

    var vw = viewport.clientWidth;
    var vh = viewport.clientHeight;
    var miniW = 140;
    var miniH = 93;

    // Viewport rect in map coordinates
    var mapW = MAP_W * scale;
    var mapH = MAP_H * scale;

    var viewLeft = -panX / mapW;
    var viewTop = -panY / mapH;
    var viewW = vw / mapW;
    var viewH = vh / mapH;

    mini.style.left = (viewLeft * miniW) + 'px';
    mini.style.top = (viewTop * miniH) + 'px';
    mini.style.width = Math.min(miniW, viewW * miniW) + 'px';
    mini.style.height = Math.min(miniH, viewH * miniH) + 'px';
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────────
  function escapeHTML(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // ─── Start ───────────────────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
