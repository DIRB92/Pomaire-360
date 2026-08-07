/* ══════════════════════════════════════════════════════════════════════════
   MAPA TURÍSTICO UNIFICADO DE POMAIRE — v2 (Supabase-driven)
   ════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── CONFIG SUPABASE ──────────────────────────────── */
  var SUPABASE_URL = 'https://uuskvqtbsvtfsovcjazf.supabase.co';
  var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
    'eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1c2t2cXRic3Z0ZnNvdmNqYXpmIiwi' +
    'cm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2ODU4NDIsImV4cCI6MjEwMDI2MTg0Mn0.' +
    'BbHI3ctSNg5msUnL9eENTNpOujQROAh6vUAZpFVcbBI';
  var TABLE = 'negocios_directorio360';

  /* ── CATEGORÍAS (12 estándar unificadas) ────────────── */
  var CATEGORIES = {
    alfareria:        { label:'Alfarería',        color:'#B85C2C', icon:'🏺', filter:'pottery' },
    talleres:         { label:'Talleres',         color:'#C96B3C', icon:'🎨', filter:'pottery' },
    restaurantes:     { label:'Restaurantes',     color:'#D4622A', icon:'🍽️', filter:'food' },
    alojamiento:      { label:'Alojamiento',      color:'#2F7A6B', icon:'🛏️', filter:'lodging' },
    comercio:         { label:'Comercio',         color:'#7A5C40', icon:'🛍️', filter:'highlight' },
    servicios:        { label:'Servicios',        color:'#5B6ABF', icon:'🔧', filter:'services' },
    estacionamientos: { label:'Estacionamientos', color:'#3B7DD8', icon:'🅿️', filter:'parking' },
    salud:            { label:'Salud',            color:'#E25555', icon:'🏥', filter:'health' },
    seguridad:        { label:'Seguridad',        color:'#5B6ABF', icon:'🚔', filter:'security' },
    banos:            { label:'Baños',            color:'#3B7DD8', icon:'🚻', filter:'services' },
    transporte:       { label:'Transporte',       color:'#3B7DD8', icon:'🚌', filter:'services' },
    turismo:          { label:'Turismo',          color:'#4A7C59', icon:'📍', filter:'highlight' }
  };

  /* ── FILTER GROUPS (para botones del UI) ────────────── */
  var FILTER_GROUPS = {
    all:       { label:'Todos',           icon:'✦' },
    pottery:   { label:'Alfarería',       icon:'🏺' },
    food:      { label:'Restaurantes',    icon:'🍽️' },
    lodging:   { label:'Alojamiento',     icon:'🛏️' },
    parking:   { label:'Estacionar',      icon:'🅿️' },
    health:    { label:'Salud',           icon:'🏥' },
    security:  { label:'Seguridad',       icon:'🚔' },
    services:  { label:'Servicios',       icon:'⛪' },
    highlight: { label:'Destacados',      icon:'⭐' }
  };


  /* ── RUTAS SUGERIDAS (se mantienen, referenciadas por slug de Supabase) ── */
  var ROUTES = {
    oficial:  { label:'Ruta Oficial',       slugs:['plaza-de-pomaire','imperio-pomaire','granja-educativa-alfarera','restaurant-la-greda','vivero-luchin'], color:'#8C3D16', icon:'🧳', meta:'5 paradas · día completo' },
    artisan:  { label:'Ruta del Artesano',  slugs:['espacio-greda','taller-del-sol','taller-barros','granja-educativa-alfarera'], color:'#B85C2C', icon:'🏺', meta:'4 paradas · ~1.5 hrs' },
    family:   { label:'Ruta Familiar',      slugs:['plaza-de-pomaire','el-chancho-alcancia-de-greda-mas-grande-del-mundo','granja-educativa-alfarera','restaurant-la-greda'], color:'#4A7C59', icon:'👨‍👩‍👧', meta:'4 paradas · ~2.5 hrs' },
    food:     { label:'Ruta Gastronómica',  slugs:['restaurante-los-naranjos','imperio-pomaire','la-casa-del-costillar','restaurant-la-greda'], color:'#D4622A', icon:'🍽️', meta:'4 paradas · ~1 hr' },
    nature:   { label:'Ruta Naturaleza',    slugs:['plaza-de-pomaire','vivero-luchin','paseo-jardin-de-los-almendros'], color:'#6B8E5A', icon:'🌄', meta:'3 paradas · ~3 hrs' }
  };

  /* ── VARIABLES GLOBALES ─────────────────────────────── */
  var map, markers = {}, places = [];
  var userMarker = null, userLatLng = null;
  var routeLine = null, activeRoute = null;
  var currentFilter = 'all';
  var tileLayers = {};

  /* ── UTILIDADES ─────────────────────────────────────── */
  function haversine(lat1, lon1, lat2, lon2) {
    var R = 6371;
    var dLat = (lat2 - lat1) * Math.PI / 180;
    var dLon = (lon2 - lon1) * Math.PI / 180;
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }
  function fmtDist(km) { return km < 1 ? Math.round(km * 1000) + ' m' : km.toFixed(1) + ' km'; }
  function fmtWalk(km) { var m = Math.round((km / 4.5) * 60); return m < 60 ? m + ' min' : Math.floor(m/60) + 'h ' + (m%60) + 'min'; }
  function escapeHTML(s) { return s ? String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;') : ''; }


  /* ── FETCH SUPABASE ──────────────────────────────────── */
  function fetchPlaces() {
    var url = SUPABASE_URL + '/rest/v1/' + TABLE +
      '?select=nombre,slug,direccion,telefono,whatsapp,instagram,web,descripcion,categoria,plan,latitud,longitud,verificado,foto_portada' +
      '&latitud=not.is.null&longitud=not.is.null';

    return fetch(url, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
        'Accept': 'application/json'
      }
    })
    .then(function (res) {
      if (!res.ok) throw new Error('Error ' + res.status);
      return res.json();
    });
  }

  /* ── POPUP ──────────────────────────────────────────── */
  function buildPopup(place, distKm) {
    var cat = CATEGORIES[place.categoria] || { label:'', color:'#888' };
    var isFeatured = place.plan === 'premium' || place.plan === 'destacado';
    var badge = isFeatured
      ? '<span class="popup-badge badge-' + place.plan + '">' + (place.plan === 'premium' ? '💎 Premium' : '⭐ Destacado') + '</span>'
      : '';
    var distHtml = distKm !== undefined
      ? '<div class="popup-dist">📍 ' + fmtDist(distKm) + ' · 🚶 ' + fmtWalk(distKm) + '</div>'
      : '';

    var contacts = [];
    if (place.telefono) contacts.push('<a href="tel:' + place.telefono.replace(/[^+\d]/g,'') + '">📞 ' + escapeHTML(place.telefono) + '</a>');
    if (place.whatsapp) contacts.push('<a href="https://wa.me/' + place.whatsapp.replace(/[^0-9]/g,'') + '" target="_blank" rel="noopener">💬 WhatsApp</a>');
    if (place.instagram) contacts.push('<a href="https://instagram.com/' + escapeHTML(place.instagram) + '" target="_blank" rel="noopener">📷 @' + escapeHTML(place.instagram) + '</a>');
    if (place.web) contacts.push('<a href="' + escapeHTML(place.web) + '" target="_blank" rel="noopener">🌐 Web</a>');

    var gmapUrl = 'https://maps.google.com/?q=' + place.latitud + ',' + place.longitud;

    return '<div class="popup-card">' +
      '<span class="popup-cat-badge" style="background:' + cat.color + ';">' + cat.label + '</span>' +
      badge +
      '<h4>' + (cat.icon || '📍') + ' ' + escapeHTML(place.nombre) + '</h4>' +
      (place.verificado ? '<span style="color:#27ae60;font-size:.8em;">✓ Verificado</span>' : '') +
      '<p>' + escapeHTML(place.descripcion || '') + '</p>' +
      '<p class="popup-addr">📌 ' + escapeHTML(place.direccion || '') + '</p>' +
      distHtml +
      (contacts.length ? '<div class="popup-contacts">' + contacts.join(' · ') + '</div>' : '') +
      '<div class="popup-links">' +
        '<a href="' + gmapUrl + '" target="_blank" rel="noopener">📍 Google Maps</a>' +
        '<a href="https://app.pomaire360.cl/negocios/' + escapeHTML(place.slug) + '" target="_blank" rel="noopener">⭐ Reseñas</a>' +
        '<a href="#lugar=' + escapeHTML(place.slug) + '" onclick="window._copyPlaceLink(event,\'' + escapeHTML(place.slug) + '\');return false;">🔗 Compartir</a>' +
      '</div></div>';
  }


  /* ── MARCADORES ──────────────────────────────────────── */
  function addMarker(place) {
    var cat = CATEGORIES[place.categoria] || { color:'#888', icon:'📍', filter:'services' };
    var isFeatured = place.plan === 'premium' || place.plan === 'destacado';
    var size = isFeatured ? 44 : 36;
    var bg = isFeatured ? '#E6B246' : cat.color;
    var shadow = isFeatured
      ? 'box-shadow:0 0 0 3px rgba(230,178,70,.5),0 3px 10px rgba(0,0,0,.4);'
      : 'box-shadow:0 2px 8px rgba(0,0,0,.3);';

    var icon = L.divIcon({
      className: 'marker-wrapper' + (isFeatured ? ' is-featured' : ''),
      html: '<div class="marker-icon" style="background:' + bg + ';width:' + size + 'px;height:' + size + 'px;font-size:' + (isFeatured ? '1.2rem' : '1rem') + ';' + shadow + '">' + cat.icon + '</div>',
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
      popupAnchor: [0, -(size / 2 + 4)]
    });

    var marker = L.marker([place.latitud, place.longitud], {
      icon: icon,
      zIndexOffset: isFeatured ? 1000 : 0
    });

    marker.bindPopup(buildPopup(place), { maxWidth: 300, closeButton: true });
    marker.addTo(map);
    marker._data = place;
    marker._filterCat = cat.filter;
    markers[place.slug] = marker;
  }

  /* ── FILTRADO ──────────────────────────────────────── */
  window.filterCategory = function (cat) {
    currentFilter = cat;
    // Update buttons
    document.querySelectorAll('.cat-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.category === cat);
    });
    // Show/hide markers
    Object.values(markers).forEach(function (m) {
      if (cat === 'all' || m._filterCat === cat) {
        map.addLayer(m);
      } else {
        map.removeLayer(m);
      }
    });
    updateLegendCounts();
    renderPlacesList();
  };

  /* ── LEYENDA ───────────────────────────────────────── */
  function updateLegendCounts() {
    var counts = {};
    Object.values(markers).forEach(function (m) {
      var f = m._filterCat;
      counts[f] = (counts[f] || 0) + 1;
    });
    Object.keys(FILTER_GROUPS).forEach(function (key) {
      var el = document.getElementById('count-' + key);
      if (el) el.textContent = counts[key] || 0;
    });
  }

  window.toggleLegend = function () {
    var body = document.getElementById('legendBody');
    var btn = document.getElementById('legendToggle');
    if (body && btn) {
      var hidden = body.style.display === 'none';
      body.style.display = hidden ? '' : 'none';
      btn.textContent = hidden ? '−' : '+';
    }
  };


  /* ── LISTA DE LUGARES ────────────────────────────────── */
  function renderPlacesList() {
    var container = document.getElementById('placesGrid');
    if (!container) return;

    var filtered = places.filter(function (p) {
      if (currentFilter === 'all') return true;
      var cat = CATEGORIES[p.categoria];
      return cat && cat.filter === currentFilter;
    });

    // Sort by distance if user located
    if (userLatLng) {
      filtered.sort(function (a, b) {
        var da = haversine(userLatLng.lat, userLatLng.lng, a.latitud, a.longitud);
        var db = haversine(userLatLng.lat, userLatLng.lng, b.latitud, b.longitud);
        return da - db;
      });
    }

    container.innerHTML = filtered.map(function (p) {
      var cat = CATEGORIES[p.categoria] || { icon:'📍', label:'' };
      var dist = userLatLng ? fmtDist(haversine(userLatLng.lat, userLatLng.lng, p.latitud, p.longitud)) : '';
      return '<div class="place-card" onclick="window.focusPlace(\'' + escapeHTML(p.slug) + '\')">' +
        '<span class="place-icon">' + cat.icon + '</span>' +
        '<div class="place-info"><strong>' + escapeHTML(p.nombre) + '</strong>' +
        '<span class="place-addr">' + escapeHTML(p.direccion || '') + '</span>' +
        (dist ? '<span class="place-dist">📍 ' + dist + '</span>' : '') +
        '</div></div>';
    }).join('');
  }

  /* ── FOCO EN UN LUGAR ──────────────────────────────── */
  window.focusPlace = function (slug) {
    var m = markers[slug];
    if (!m) return;
    map.setView(m.getLatLng(), 18);
    m.openPopup();
  };

  /* ── UBICACIÓN DEL USUARIO ─────────────────────────── */
  function setUserLocation(lat, lng, fromGPS) {
    userLatLng = { lat: lat, lng: lng };
    if (userMarker) map.removeLayer(userMarker);
    userMarker = L.marker([lat, lng], {
      icon: L.divIcon({
        className: 'user-marker',
        html: '<div style="background:#2563eb;border:3px solid #fff;border-radius:50%;width:20px;height:20px;box-shadow:0 0 0 6px rgba(37,99,235,.25);"></div>',
        iconSize: [20, 20], iconAnchor: [10, 10]
      })
    }).addTo(map);

    var hint = document.getElementById('mapHint');
    if (hint) hint.textContent = fromGPS ? '✅ Ubicación GPS activa' : '✅ Punto de partida fijado';

    // Update all popups with distance
    Object.values(markers).forEach(function (m) {
      var p = m._data;
      var d = haversine(lat, lng, p.latitud, p.longitud);
      m.setPopupContent(buildPopup(p, d));
    });

    renderPlacesList();
  }

  window.locateUser = function () {
    if (!navigator.geolocation) { alert('Tu navegador no soporta geolocalización.'); return; }
    navigator.geolocation.getCurrentPosition(
      function (pos) { setUserLocation(pos.coords.latitude, pos.coords.longitude, true); map.setView([pos.coords.latitude, pos.coords.longitude], 16); },
      function () { alert('No se pudo obtener tu ubicación. Haz clic en el mapa para fijar un punto.'); },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  /* ── RUTAS ─────────────────────────────────────────── */
  window.showRoute = function (routeId) {
    if (routeLine) { map.removeLayer(routeLine); routeLine = null; }
    if (activeRoute === routeId) { activeRoute = null; return; }
    activeRoute = routeId;
    var route = ROUTES[routeId];
    if (!route) return;
    var latlngs = route.slugs.map(function (slug) {
      var m = markers[slug];
      return m ? m.getLatLng() : null;
    }).filter(Boolean);
    if (latlngs.length < 2) return;
    routeLine = L.polyline(latlngs, { color: route.color, weight: 4, opacity: 0.8, dashArray: '8,6' }).addTo(map);
    map.fitBounds(routeLine.getBounds(), { padding: [40, 40] });
  };

  window.resetMapView = function () {
    if (routeLine) { map.removeLayer(routeLine); routeLine = null; activeRoute = null; }
    map.setView([-33.6512, -71.1505], 16);
  };

  /* ── BÚSQUEDA ──────────────────────────────────────── */
  window.searchPlaces = function (query) {
    if (!query || query.length < 2) { window.filterCategory('all'); return; }
    var q = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    Object.values(markers).forEach(function (m) {
      var name = m._data.nombre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (name.includes(q)) { map.addLayer(m); } else { map.removeLayer(m); }
    });
  };

  /* ── ESTILOS DE MAPA ───────────────────────────────── */
  window.changeMapStyle = function (style) {
    document.querySelectorAll('.style-btn').forEach(function (b) { b.classList.toggle('active', b.dataset.style === style); });
    if (style === 'satellite') { map.removeLayer(tileLayers.streets); tileLayers.satellite.addTo(map); }
    else { map.removeLayer(tileLayers.satellite); tileLayers.streets.addTo(map); }
  };

  /* ── DEEP-LINK / SHARE ─────────────────────────────── */
  function openFromHash() {
    var m = location.hash.match(/^#lugar=([\w-]+)/);
    if (m && markers[m[1]]) setTimeout(function () { window.focusPlace(m[1]); }, 300);
  }

  window._copyPlaceLink = function (ev, slug) {
    if (ev) ev.preventDefault();
    var url = location.origin + location.pathname + '#lugar=' + slug;
    history.replaceState(null, '', '#lugar=' + slug);
    if (navigator.clipboard) navigator.clipboard.writeText(url).then(function () {
      if (ev && ev.target) ev.target.textContent = '✅ Copiado';
    });
  };

  /* ── MAPA OFICIAL ILUSTRADO (lightbox) ─────────────── */
  window.openOfficialMap = function () {
    var lb = document.getElementById('officialMapLightbox');
    if (lb) { lb.classList.add('open'); document.body.style.overflow = 'hidden'; }
  };
  window.closeOfficialMap = function (e) {
    if (e && e.target.closest && e.target.closest('.map-lightbox-inner') && !e.target.closest('.map-lightbox-close')) return;
    var lb = document.getElementById('officialMapLightbox');
    if (lb) { lb.classList.remove('open'); document.body.style.overflow = ''; }
  };
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') window.closeOfficialMap(); });


  /* ── INICIALIZACIÓN ──────────────────────────────────── */
  function init() {
    // Crear mapa
    map = L.map('touristMap', {
      center: [-33.6512, -71.1505],
      zoom: 16,
      zoomControl: true
    });

    tileLayers.streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>',
      maxZoom: 19
    });
    tileLayers.satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: '&copy; Esri, Maxar',
      maxZoom: 19
    });
    tileLayers.streets.addTo(map);

    // Click en mapa = fijar ubicación
    map.on('click', function (e) {
      if (e.originalEvent.target.closest && e.originalEvent.target.closest('.leaflet-marker-icon')) return;
      setUserLocation(e.latlng.lat, e.latlng.lng, false);
    });

    // Cargar datos de Supabase
    var loadingEl = document.getElementById('mapLoading');
    if (loadingEl) loadingEl.style.display = 'flex';

    fetchPlaces()
      .then(function (rows) {
        places = rows;
        console.log('[Mapa] ' + rows.length + ' negocios cargados desde Supabase');
        rows.forEach(addMarker);
        updateLegendCounts();
        renderPlacesList();
        openFromHash();
        window.addEventListener('hashchange', openFromHash);
        if (loadingEl) loadingEl.style.display = 'none';
      })
      .catch(function (err) {
        console.error('[Mapa] Error al cargar datos:', err);
        if (loadingEl) {
          loadingEl.innerHTML = '<p style="color:#c00;">No se pudieron cargar los negocios. Recarga la página.</p>';
        }
      });

    // Render rutas en el sidebar
    renderRoutes();
  }

  function renderRoutes() {
    var container = document.getElementById('routesList');
    if (!container) return;
    container.innerHTML = Object.keys(ROUTES).map(function (key) {
      var r = ROUTES[key];
      return '<button class="route-btn" onclick="window.showRoute(\'' + key + '\')">' +
        '<span class="route-icon">' + r.icon + '</span>' +
        '<span class="route-label">' + r.label + '</span>' +
        '<span class="route-meta">' + r.meta + '</span>' +
        '</button>';
    }).join('');
  }

  /* ── ARRANQUE ──────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      var tries = 0;
      (function waitLeaflet() {
        if (typeof L !== 'undefined') { init(); return; }
        if (tries++ > 50) return;
        setTimeout(waitLeaflet, 100);
      })();
    });
  } else {
    var tries = 0;
    (function waitLeaflet() {
      if (typeof L !== 'undefined') { init(); return; }
      if (tries++ > 50) return;
      setTimeout(waitLeaflet, 100);
    })();
  }

})();
