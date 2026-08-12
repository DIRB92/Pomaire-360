/* ═══════════════════════════════════════════════════════════════════════════
   map-unified.js — Mapa unificado de pomaire360.cl
   Fuente UNICA: Supabase (negocios_directorio360)
   
   Reemplaza: map-home.js + map-supabase.js + sección mapa de app.js
   
   Funcionalidades:
   - Mapa interactivo con marcadores desde Supabase
   - Filtros por categoría
   - Geolocalización del usuario
   - Rutas: oficial, libre, y custom (tour-interactive)
   - Expone window.PLACES para tour-interactive.js
   - showCustomRoute / clearRoute / focusPlace
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  // ─── Supabase config ───────────────────────────────────────────────────────
  var SUPABASE_URL = 'https://uuskvqtbsvtfsovcjazf.supabase.co';
  var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
    'eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1c2t2cXRic3Z0ZnNvdmNqYXpmIiwi' +
    'cm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2ODU4NDIsImV4cCI6MjEwMDI2MTg0Mn0.' +
    'BbHI3ctSNg5msUnL9eENTNpOujQROAh6vUAZpFVcbBI';
  var TABLE = 'negocios_directorio360';

  // ─── Categorías → filtro del mapa ──────────────────────────────────────────
  var CATS = {
    alfareria:        { filter: 'pottery',   color: '#B85C2C', icon: '\uD83C\uDFFA' },
    talleres:         { filter: 'pottery',   color: '#C96B3C', icon: '\uD83C\uDFA8' },
    restaurantes:     { filter: 'food',      color: '#D4622A', icon: '\uD83C\uDF7D\uFE0F' },
    alojamiento:      { filter: 'lodging',   color: '#2F7A6B', icon: '\uD83D\uDECF\uFE0F' },
    comercio:         { filter: 'highlight', color: '#7A5C40', icon: '\uD83D\uDECD\uFE0F' },
    servicios:        { filter: 'services',  color: '#5B6ABF', icon: '\uD83D\uDD27' },
    estacionamientos: { filter: 'parking',   color: '#3B7DD8', icon: '\uD83C\uDD7F\uFE0F' },
    salud:            { filter: 'health',    color: '#E25555', icon: '\uD83C\uDFE5' },
    seguridad:        { filter: 'security',  color: '#5B6ABF', icon: '\uD83D\uDE94' },
    banos:            { filter: 'services',  color: '#3B7DD8', icon: '\uD83D\uDEBB' },
    transporte:       { filter: 'services',  color: '#3B7DD8', icon: '\uD83D\uDE8C' },
    turismo:          { filter: 'highlight', color: '#4A7C59', icon: '\uD83D\uDCCD' }
  };

  // ─── Rutas predefinidas (por slug) ─────────────────────────────────────────
  var RUTA_OFICIAL_SLUGS = ['plaza-de-pomaire', 'imperio-pomaire', 'granja-educativa-alfarera', 'restaurant-la-greda', 'vivero-luchin'];
  var RUTAS_PREDEFINIDAS = {
    oficial:  { slugs: RUTA_OFICIAL_SLUGS, color: '#8C3D16', label: 'Ruta Oficial' },
    artesano: { slugs: ['granja-educativa-alfarera', 'espacio-greda', 'taller-del-sol', 'taller-barros'], color: '#B85C2C', label: 'Ruta Artesanal' },
    familiar: { slugs: ['plaza-de-pomaire', 'chancho-greda', 'granja-educativa-alfarera', 'restaurant-la-greda'], color: '#4A7C59', label: 'Ruta Familiar' },
    gastro:   { slugs: ['imperio-pomaire', 'restaurant-la-greda', 'restaurante-los-naranjos', 'la-casa-del-costillar'], color: '#D4622A', label: 'Ruta Gastronómica' }
  };

  // ─── State ─────────────────────────────────────────────────────────────────
  var map = null;
  var markers = {};          // id → marker
  var allNegocios = [];      // raw data from Supabase
  var userMarker = null;
  var userLatLng = null;
  var routeLine = null;
  var currentFilter = 'all';
  var activeRoute = null;

  // ─── Utilities ─────────────────────────────────────────────────────────────
  function escapeHTML(s) {
    if (!s) return '';
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function haversine(lat1, lon1, lat2, lon2) {
    var R = 6371;
    var dLat = (lat2 - lat1) * Math.PI / 180;
    var dLon = (lon2 - lon1) * Math.PI / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  function fmtDist(km) {
    if (km < 1) return Math.round(km * 1000) + ' m';
    return km.toFixed(1) + ' km';
  }

  function fmtWalkTime(km) {
    var mins = Math.round((km / 4.5) * 60);
    if (mins < 1) return '<1 min';
    if (mins < 60) return mins + ' min';
    return Math.floor(mins / 60) + 'h ' + (mins % 60) + 'min';
  }

  // ─── Popup builder ─────────────────────────────────────────────────────────
  function buildPopup(neg, distKm) {
    var cat = CATS[neg.categoria] || { icon: '\uD83D\uDCCD' };
    var distHtml = '';
    if (distKm !== undefined) {
      distHtml = '<div style="margin:.3em 0;padding:.3em .5em;background:#f0ebe4;border-radius:.4em;font-size:.82em;">' +
        '\uD83D\uDCCD ' + fmtDist(distKm) + ' \u00B7 \uD83D\uDEB6 ' + fmtWalkTime(distKm) + '</div>';
    }

    var badge = '';
    if (neg.plan === 'premium') badge = '<span style="display:inline-block;padding:.15em .5em;background:#E6B246;color:#fff;border-radius:.3em;font-size:.7em;font-weight:700;margin-left:.3em;">\uD83D\uDC8E Premium</span>';
    else if (neg.plan === 'destacado') badge = '<span style="display:inline-block;padding:.15em .5em;background:#B85C2C;color:#fff;border-radius:.3em;font-size:.7em;font-weight:700;margin-left:.3em;">\u2B50 Destacado</span>';

    var html = '<div class="map-popup">';
    html += '<strong>' + escapeHTML(neg.nombre) + '</strong>';
    if (neg.verificado) html += ' <span style="color:#27ae60;" title="Verificado">\u2713</span>';
    html += badge;

    if (neg.direccion) html += '<br><span style="font-size:.85em;color:#5a4a3a;">\uD83D\uDCCD ' + escapeHTML(neg.direccion) + '</span>';
    if (neg.descripcion) html += '<br><span style="font-size:.82em;color:#6B4226;">' + escapeHTML(neg.descripcion).substring(0, 100) + (neg.descripcion.length > 100 ? '...' : '') + '</span>';
    if (neg.horario) html += '<br><span style="font-size:.8em;color:#666;">\uD83D\uDD52 ' + escapeHTML(neg.horario).substring(0, 60) + '</span>';

    html += distHtml;

    html += '<div style="margin-top:.4em;display:flex;flex-wrap:wrap;gap:.3em .6em;">';
    if (neg.telefono) html += '<a href="tel:' + neg.telefono.replace(/[^+\d]/g, '') + '" style="font-size:.8em;color:#B85C2C;">\uD83D\uDCDE ' + escapeHTML(neg.telefono) + '</a>';
    if (neg.whatsapp) html += '<a href="https://wa.me/' + String(neg.whatsapp).replace(/[^0-9]/g, '') + '" target="_blank" rel="noopener" style="font-size:.8em;color:#25d366;">\uD83D\uDCAC WhatsApp</a>';
    if (neg.instagram) html += '<a href="https://instagram.com/' + escapeHTML(neg.instagram) + '" target="_blank" rel="noopener" style="font-size:.8em;color:#E1306C;">\uD83D\uDCF7 @' + escapeHTML(neg.instagram) + '</a>';
    if (neg.web) html += '<a href="' + escapeHTML(neg.web) + '" target="_blank" rel="noopener" style="font-size:.8em;color:#B85C2C;">\uD83C\uDF10 Web</a>';
    html += '</div>';

    html += '<div style="margin-top:.4em;display:flex;gap:.5em;flex-wrap:wrap;">';
    html += '<a href="https://app.pomaire360.cl/negocios/' + escapeHTML(neg.slug) + '" target="_blank" rel="noopener" style="font-size:.8em;color:#4A7C59;font-weight:600;">\u2B50 Ver ficha y rese\u00F1as</a>';
    html += '<a href="#lugar=' + escapeHTML(neg.slug) + '" onclick="window._copyPlaceLink(event,\'' + escapeHTML(neg.slug) + '\');return false;" style="font-size:.8em;color:#888;">\uD83D\uDD17 Copiar enlace</a>';
    html += '</div>';
    html += '</div>';
    return html;
  }

  // ─── Copy place link ───────────────────────────────────────────────────────
  window._copyPlaceLink = function (ev, slug) {
    if (ev) ev.preventDefault();
    var url = location.origin + location.pathname + '#lugar=' + slug;
    try { history.replaceState(null, '', '#lugar=' + slug); } catch (_) { }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(function () {
        if (ev && ev.target) { ev.target.textContent = '\u2705 Copiado'; setTimeout(function () { ev.target.textContent = '\uD83D\uDD17 Copiar enlace'; }, 2000); }
      }).catch(function () { });
    }
  };

  // ─── Add marker ────────────────────────────────────────────────────────────
  function addMarker(neg) {
    if (!neg.latitud || !neg.longitud) return;
    var cat = CATS[neg.categoria] || { filter: 'services', color: '#888', icon: '\uD83D\uDCCD' };
    var featured = neg.plan === 'premium' || neg.plan === 'destacado';
    var sz = featured ? 40 : 32;
    var bg = featured ? '#E6B246' : cat.color;
    var shadow = featured
      ? 'box-shadow:0 0 0 3px rgba(230,178,70,.5),0 3px 10px rgba(0,0,0,.4);'
      : 'box-shadow:0 2px 8px rgba(0,0,0,.3);';

    var marker = L.marker([neg.latitud, neg.longitud], {
      zIndexOffset: featured ? 900 : 0,
      icon: L.divIcon({
        className: 'custom-marker' + (featured ? ' is-featured' : ''),
        html: '<div style="background:' + bg + ';border:2px solid #fff;border-radius:50%;width:' + sz + 'px;height:' + sz + 'px;display:flex;align-items:center;justify-content:center;font-size:' + (featured ? 16 : 13) + 'px;' + shadow + '">' + cat.icon + '</div>',
        iconSize: [sz, sz],
        iconAnchor: [sz / 2, sz / 2]
      })
    });

    marker.bindPopup(buildPopup(neg));
    marker.addTo(map);
    marker._filterCat = cat.filter;
    marker._slug = neg.slug;
    marker._negocio = neg;
    markers[neg.slug] = marker;
  }

  // ─── Filter ────────────────────────────────────────────────────────────────
  function applyFilter(cat) {
    currentFilter = cat;
    Object.values(markers).forEach(function (m) {
      if (cat === 'all' || m._filterCat === cat) {
        map.addLayer(m);
      } else {
        map.removeLayer(m);
      }
    });
    document.querySelectorAll('#mapFilters .map-filter').forEach(function (btn) {
      var active = btn.dataset.cat === cat;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  // ─── User location ─────────────────────────────────────────────────────────
  function setUserLoc(lat, lng, fromGPS) {
    userLatLng = { lat: lat, lng: lng };
    if (userMarker) map.removeLayer(userMarker);
    userMarker = L.marker([lat, lng], {
      icon: L.divIcon({
        className: 'user-marker',
        html: '<div style="background:#2563eb;border:3px solid #fff;border-radius:50%;width:20px;height:20px;box-shadow:0 0 0 6px rgba(37,99,235,.25);"></div>',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      })
    }).addTo(map);

    var hint = document.getElementById('mapHint');
    if (hint) {
      hint.textContent = fromGPS
        ? '\u2705 Usando tu ubicaci\u00F3n GPS \u2014 distancias actualizadas'
        : '\u2705 Punto fijado \u2014 distancias actualizadas';
    }
    updateDistances();
    renderPlacesList();
  }

  function updateDistances() {
    if (!userLatLng) return;
    Object.values(markers).forEach(function (m) {
      var neg = m._negocio;
      if (!neg) return;
      var d = haversine(userLatLng.lat, userLatLng.lng, neg.latitud, neg.longitud);
      m.setPopupContent(buildPopup(neg, d));
    });
  }

  window._homeLocate = function () {
    if (!navigator.geolocation) { alert('Tu navegador no soporta geolocalizaci\u00F3n. Haz clic en el mapa.'); return; }
    var btn = document.getElementById('locateBtn');
    if (btn) btn.innerHTML = '\uD83D\uDCE1 Buscando...';
    navigator.geolocation.getCurrentPosition(
      function (pos) {
        setUserLoc(pos.coords.latitude, pos.coords.longitude, true);
        map.setView([pos.coords.latitude, pos.coords.longitude], 16);
        if (btn) { btn.innerHTML = '\u2705 <span data-t="locate_btn">Ubicaci\u00F3n activa</span>'; btn.classList.add('active'); }
      },
      function () {
        if (btn) btn.innerHTML = '\uD83D\uDCCD <span data-t="locate_btn">Usar mi ubicaci\u00F3n</span>';
        alert('No se pudo obtener tu ubicaci\u00F3n. Haz clic en cualquier punto del mapa.');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // ─── Routes ────────────────────────────────────────────────────────────────
  function clearRoute(resetUI) {
    if (routeLine) { map.removeLayer(routeLine); routeLine = null; }
    Object.values(markers).forEach(function (m) {
      var el = m.getElement ? m.getElement() : null;
      if (el) el.style.opacity = '1';
    });
    if (resetUI !== false) {
      document.querySelectorAll('.route-card').forEach(function (c) { c.classList.remove('active'); });
      var btn = document.getElementById('routeClearBtn');
      if (btn) btn.style.display = 'none';
      activeRoute = null;
    }
  }

  function showRouteBySlug(slugs, color) {
    clearRoute(true);
    var latlngs = [];
    slugs.forEach(function (slug) {
      var m = markers[slug];
      if (m) latlngs.push(m.getLatLng());
    });

    if (latlngs.length < 2) return;

    routeLine = L.polyline(latlngs, {
      color: color || '#8C3D16',
      weight: 4,
      opacity: 0.85,
      dashArray: '10,6'
    }).addTo(map);

    // Dim non-route markers
    Object.values(markers).forEach(function (m) {
      var el = m.getElement ? m.getElement() : null;
      if (!el) return;
      el.style.opacity = slugs.indexOf(m._slug) !== -1 ? '1' : '0.25';
    });

    map.fitBounds(routeLine.getBounds(), { padding: [40, 40] });
    var btn = document.getElementById('routeClearBtn');
    if (btn) btn.style.display = 'inline-block';
  }

  // Función para tour-interactive.js
  function showCustomRoute(ids, color) {
    if (!map || !Array.isArray(ids)) return;
    clearRoute(true);
    var pts = [];
    ids.forEach(function (id) {
      // ids can be slug or legacy id — try both
      var m = markers[id];
      if (!m) {
        // Search by legacy placeId mapping
        var neg = allNegocios.find(function (n) { return n._legacyId === id; });
        if (neg) m = markers[neg.slug];
      }
      if (m) pts.push(m.getLatLng());
    });

    if (pts.length === 0) return;
    if (pts.length >= 2) {
      routeLine = L.polyline(pts, { color: color || '#8C3D16', weight: 4, opacity: 0.8, dashArray: '8,6' }).addTo(map);
    }

    Object.values(markers).forEach(function (m) {
      var el = m.getElement ? m.getElement() : null;
      if (!el) return;
      var isInRoute = ids.indexOf(m._slug) !== -1 || ids.indexOf(m._negocio && m._negocio._legacyId) !== -1;
      el.style.opacity = isInRoute ? '1' : '0.25';
    });

    if (routeLine) map.fitBounds(routeLine.getBounds(), { padding: [40, 40] });
    else if (pts.length === 1) map.setView(pts[0], 17);
    var btn = document.getElementById('routeClearBtn');
    if (btn) btn.style.display = 'inline-block';
  }

  function focusPlace(id) {
    var m = markers[id];
    if (!m) {
      // Try legacy ID
      var neg = allNegocios.find(function (n) { return n._legacyId === id; });
      if (neg) m = markers[neg.slug];
    }
    if (!m) return;
    map.setView(m.getLatLng(), 17);
    m.openPopup();
    document.getElementById('leafletMap').scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // Ruta oficial — llamada desde el botón "Ver en el mapa" del recorrido
  window._homeShowRoute = function () {
    if (!map) return;
    var el = document.getElementById('leafletMap');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(function () {
      showRouteBySlug(RUTA_OFICIAL_SLUGS, '#8C3D16');
      // Open popup of first stop
      RUTA_OFICIAL_SLUGS.forEach(function (slug) {
        if (markers[slug]) markers[slug].openPopup();
      });
    }, 400);
  };

  // ─── Places list (sidebar) ─────────────────────────────────────────────────
  function renderPlacesList() {
    var list = document.getElementById('placesList');
    if (!list) return;

    var filtered = allNegocios;
    if (currentFilter !== 'all') {
      filtered = allNegocios.filter(function (n) {
        var cat = CATS[n.categoria];
        return cat && cat.filter === currentFilter;
      });
    }

    var withDist = filtered.map(function (n) {
      var d = userLatLng ? haversine(userLatLng.lat, userLatLng.lng, n.latitud, n.longitud) : null;
      return { neg: n, dist: d };
    });

    if (userLatLng) withDist.sort(function (a, b) { return a.dist - b.dist; });

    // Limit to 20 for performance
    var shown = withDist.slice(0, 20);

    list.innerHTML = shown.map(function (item) {
      var n = item.neg;
      var cat = CATS[n.categoria] || { icon: '\uD83D\uDCCD' };
      return '<div class="place-row" onclick="window.focusPlace(\'' + escapeHTML(n.slug) + '\')">' +
        '<span class="place-icon">' + cat.icon + '</span>' +
        '<div class="place-info"><div class="place-name">' + escapeHTML(n.nombre) + '</div>' +
        '<div class="place-cat">' + escapeHTML(n.direccion || n.categoria) + '</div></div>' +
        (item.dist !== null ? '<span class="place-dist">' + fmtDist(item.dist) + '</span>' : '') +
        '</div>';
    }).join('');
  }

  // ─── Build PLACES for tour-interactive.js ──────────────────────────────────
  function buildPlacesArray(negocios) {
    // Map Supabase categories → legacy cat values used by tour-interactive
    var catMap = {
      alfareria: 'pottery', talleres: 'pottery',
      restaurantes: 'food', alojamiento: 'lodging',
      comercio: 'highlight', servicios: 'services',
      estacionamientos: 'parking', salud: 'health',
      seguridad: 'security', banos: 'services',
      transporte: 'services', turismo: 'highlight'
    };

    return negocios.map(function (n) {
      var legacyId = n.slug; // use slug as id
      n._legacyId = legacyId;
      return {
        id: legacyId,
        cat: catMap[n.categoria] || 'services',
        icon: (CATS[n.categoria] || {}).icon || '\uD83D\uDCCD',
        lat: n.latitud,
        lng: n.longitud,
        name: n.nombre,
        desc: n.descripcion || n.direccion || '',
        addr: n.direccion || '',
        slug: n.slug,
        plan: n.plan || 'gratis',
        phone: n.telefono || '',
        wsp: n.whatsapp || '',
        ig: n.instagram || '',
        web: n.web || ''
      };
    });
  }

  // ─── Open place from hash ──────────────────────────────────────────────────
  function openPlaceFromHash() {
    var m = location.hash.match(/^#lugar=([\w-]+)/);
    if (m && markers[m[1]]) {
      setTimeout(function () { focusPlace(m[1]); }, 350);
    }
  }

  // ─── Init Map ──────────────────────────────────────────────────────────────
  function initMap() {
    var el = document.getElementById('leafletMap');
    if (!el || typeof L === 'undefined') return;
    if (map) return; // already initialized

    map = L.map('leafletMap', { zoomControl: true }).setView([-33.6512, -71.1505], 16);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '\u00A9 OpenStreetMap',
      maxZoom: 19
    }).addTo(map);

    // Click on map to set user location
    map.on('click', function (e) {
      if (e.originalEvent.target.closest && e.originalEvent.target.closest('.leaflet-marker-icon')) return;
      setUserLoc(e.latlng.lat, e.latlng.lng, false);
    });

    // Hash-based popup
    map.on('popupopen', function (e) {
      var src = e.popup && e.popup._source;
      if (src && src._slug) {
        try { history.replaceState(null, '', '#lugar=' + src._slug); } catch (_) { }
      }
    });
    map.on('popupclose', function () {
      if (location.hash.indexOf('#lugar=') === 0) {
        try { history.replaceState(null, '', location.pathname + location.search); } catch (_) { }
      }
    });

    // Filter buttons
    document.querySelectorAll('#mapFilters .map-filter').forEach(function (btn) {
      btn.addEventListener('click', function () { applyFilter(btn.dataset.cat); });
    });

    // Route clear button
    var clearBtn = document.getElementById('routeClearBtn');
    if (clearBtn) clearBtn.addEventListener('click', function () { clearRoute(true); });

    // Expose globals
    window.leafletMap = map;
    window.markers = markers;

    // Load data
    fetchNegocios();
  }

  // ─── Fetch from Supabase ───────────────────────────────────────────────────
  function fetchNegocios() {
    var url = SUPABASE_URL + '/rest/v1/' + TABLE +
      '?select=nombre,slug,direccion,telefono,whatsapp,instagram,web,descripcion,categoria,plan,latitud,longitud,verificado,horario,tag,foto_portada,rating_avg,rating_count' +
      '&latitud=not.is.null&longitud=not.is.null';

    fetch(url, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
        'Accept': 'application/json'
      }
    })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (rows) {
        allNegocios = rows;
        console.log('[Mapa Unificado] ' + rows.length + ' negocios cargados desde Supabase');

        // Add markers
        rows.forEach(addMarker);

        // Build global PLACES for tour-interactive.js
        window.PLACES = buildPlacesArray(rows);

        // Render places list
        renderPlacesList();

        // Open from hash if needed
        openPlaceFromHash();

        // Refresh tour picks if already loaded
        if (typeof window.refreshTourPicks === 'function') {
          window.refreshTourPicks();
        }

        // Emit event for other scripts
        document.dispatchEvent(new CustomEvent('mapDataReady', { detail: { count: rows.length } }));
      })
      .catch(function (err) {
        console.warn('[Mapa Unificado] Error cargando negocios:', err.message);
        // Show friendly message
        var hint = document.getElementById('mapHint');
        if (hint) hint.textContent = '\u26A0\uFE0F No se pudieron cargar los negocios. Verifica tu conexi\u00F3n.';
      });
  }

  // ─── Expose globals ────────────────────────────────────────────────────────
  window.showCustomRoute = showCustomRoute;
  window.clearRoute = clearRoute;
  window.focusPlace = focusPlace;

  // ─── Hash change listener ──────────────────────────────────────────────────
  window.addEventListener('hashchange', openPlaceFromHash);

  // ─── Boot with IntersectionObserver (lazy load) ────────────────────────────
  function boot() {
    var mapSection = document.getElementById('mapa');
    if (!mapSection) return;

    if (!('IntersectionObserver' in window)) {
      // Fallback: init immediately when DOM ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
          waitForLeaflet(initMap);
        });
      } else {
        waitForLeaflet(initMap);
      }
      return;
    }

    var loaded = false;
    var observer = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting && !loaded) {
        loaded = true;
        waitForLeaflet(initMap);
        observer.disconnect();
      }
    }, { rootMargin: '300px' });

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () { observer.observe(mapSection); });
    } else {
      observer.observe(mapSection);
    }
  }

  function waitForLeaflet(cb) {
    var tries = 0;
    (function check() {
      if (typeof L !== 'undefined' && document.getElementById('leafletMap')) { cb(); return; }
      if (tries++ > 80) { console.warn('[Mapa] Leaflet no disponible'); return; }
      setTimeout(check, 150);
    })();
  }

  boot();

})();
