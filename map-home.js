/* ═══════════════════════════════════════════════════════════════════════════
   map-home.js — Mapa compacto del homepage alimentado por Supabase
   Sin datos hardcodeados — todo viene de negocios_directorio360.
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var SUPABASE_URL = 'https://uuskvqtbsvtfsovcjazf.supabase.co';
  var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
    'eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1c2t2cXRic3Z0ZnNvdmNqYXpmIiwi' +
    'cm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2ODU4NDIsImV4cCI6MjEwMDI2MTg0Mn0.' +
    'BbHI3ctSNg5msUnL9eENTNpOujQROAh6vUAZpFVcbBI';
  var TABLE = 'negocios_directorio360';

  // Mapeo categoría → filtro + estilo
  var CATS = {
    alfareria:        { filter:'pottery',   color:'#B85C2C', icon:'🏺' },
    talleres:         { filter:'pottery',   color:'#C96B3C', icon:'🎨' },
    restaurantes:     { filter:'food',      color:'#D4622A', icon:'🍽️' },
    alojamiento:      { filter:'lodging',   color:'#2F7A6B', icon:'🛏️' },
    comercio:         { filter:'highlight', color:'#7A5C40', icon:'🛍️' },
    servicios:        { filter:'services',  color:'#5B6ABF', icon:'🔧' },
    estacionamientos: { filter:'parking',   color:'#3B7DD8', icon:'🅿️' },
    salud:            { filter:'health',    color:'#E25555', icon:'🏥' },
    seguridad:        { filter:'security',  color:'#5B6ABF', icon:'🚔' },
    banos:            { filter:'services',  color:'#3B7DD8', icon:'🚻' },
    transporte:       { filter:'services',  color:'#3B7DD8', icon:'🚌' },
    turismo:          { filter:'highlight', color:'#4A7C59', icon:'📍' }
  };

  var map, markers = [], userMarker, currentFilter = 'all';

  function escapeHTML(s) { return s ? String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') : ''; }

  function buildPopup(neg) {
    var html = '<div class="map-popup"><strong>' + escapeHTML(neg.nombre) + '</strong>';
    if (neg.verificado) html += ' <span style="color:#27ae60;">✓</span>';
    if (neg.direccion) html += '<br><span style="font-size:.85em;color:#5a4a3a;">📍 ' + escapeHTML(neg.direccion) + '</span>';
    if (neg.descripcion) html += '<br><span style="font-size:.82em;color:#6B4226;">' + escapeHTML(neg.descripcion).substring(0, 80) + '</span>';
    html += '<div style="margin-top:.4em;">';
    if (neg.telefono) html += '<a href="tel:' + neg.telefono + '" style="font-size:.8em;color:#B85C2C;">📞 ' + escapeHTML(neg.telefono) + '</a> ';
    if (neg.whatsapp) html += '<a href="https://wa.me/' + neg.whatsapp.replace(/[^0-9]/g,'') + '" target="_blank" style="font-size:.8em;color:#25d366;">💬 WhatsApp</a> ';
    html += '</div>';
    html += '<a href="https://app.pomaire360.cl/negocios/' + escapeHTML(neg.slug) + '" target="_blank" style="font-size:.8em;color:#4A7C59;font-weight:600;">⭐ Ver reseñas</a>';
    html += '</div>';
    return html;
  }

  function addMarker(neg) {
    var cat = CATS[neg.categoria] || { filter:'services', color:'#888', icon:'📍' };
    var featured = neg.plan === 'premium' || neg.plan === 'destacado';
    var sz = featured ? 38 : 30;
    var bg = featured ? '#E6B246' : cat.color;
    var shadow = featured ? 'box-shadow:0 0 0 3px rgba(230,178,70,.5),0 2px 8px rgba(0,0,0,.35);' : 'box-shadow:0 2px 6px rgba(0,0,0,.3);';

    var marker = L.marker([neg.latitud, neg.longitud], {
      zIndexOffset: featured ? 900 : 0,
      icon: L.divIcon({
        className: 'custom-marker' + (featured ? ' is-featured' : ''),
        html: '<div style="background:' + bg + ';border:2px solid #fff;border-radius:50%;width:' + sz + 'px;height:' + sz + 'px;display:flex;align-items:center;justify-content:center;font-size:' + (featured ? 15 : 13) + 'px;' + shadow + '">' + cat.icon + '</div>',
        iconSize: [sz, sz],
        iconAnchor: [sz / 2, sz / 2]
      })
    });
    marker.bindPopup(buildPopup(neg));
    marker.addTo(map);
    marker._filterCat = cat.filter;
    markers.push(marker);
  }

  function applyFilter(cat) {
    currentFilter = cat;
    markers.forEach(function (m) {
      if (cat === 'all' || m._filterCat === cat) { map.addLayer(m); }
      else { map.removeLayer(m); }
    });
    // Update button states
    document.querySelectorAll('#mapFilters .map-filter').forEach(function (btn) {
      var active = btn.dataset.cat === cat;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  function initMap() {
    var el = document.getElementById('leafletMap');
    if (!el || typeof L === 'undefined') return;

    map = L.map('leafletMap', { zoomControl: true }).setView([-33.6512, -71.1505], 16);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap', maxZoom: 19
    }).addTo(map);

    // Click on map = set user location
    map.on('click', function (e) {
      if (e.originalEvent.target.closest && e.originalEvent.target.closest('.leaflet-marker-icon')) return;
      setUserLoc(e.latlng.lat, e.latlng.lng);
    });

    // Expose for app.js compatibility
    window.leafletMap = map;

    // Filter buttons
    document.querySelectorAll('#mapFilters .map-filter').forEach(function (btn) {
      btn.addEventListener('click', function () { applyFilter(btn.dataset.cat); });
    });

    // Load from Supabase
    fetchNegocios();
  }

  function fetchNegocios() {
    var url = SUPABASE_URL + '/rest/v1/' + TABLE +
      '?select=nombre,slug,direccion,telefono,whatsapp,instagram,web,descripcion,categoria,plan,latitud,longitud,verificado' +
      '&latitud=not.is.null&longitud=not.is.null';

    fetch(url, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
        'Accept': 'application/json'
      }
    })
    .then(function (res) { return res.json(); })
    .then(function (rows) {
      rows.forEach(addMarker);
      console.log('[Home Map] ' + rows.length + ' negocios cargados desde Supabase');
    })
    .catch(function (err) {
      console.warn('[Home Map] Error:', err.message);
    });
  }

  function setUserLoc(lat, lng) {
    if (userMarker) map.removeLayer(userMarker);
    userMarker = L.marker([lat, lng], {
      icon: L.divIcon({
        className: 'user-marker',
        html: '<div style="background:#2563eb;border:3px solid #fff;border-radius:50%;width:18px;height:18px;box-shadow:0 0 0 5px rgba(37,99,235,.25);"></div>',
        iconSize: [18, 18], iconAnchor: [9, 9]
      })
    }).addTo(map);
    var hint = document.getElementById('mapHint');
    if (hint) hint.textContent = '✅ Punto fijado — distancias disponibles en el Mapa Turístico completo';
  }

  // Geolocation
  window._homeLocate = function () {
    if (!navigator.geolocation) { alert('Tu navegador no soporta geolocalización.'); return; }
    navigator.geolocation.getCurrentPosition(
      function (pos) { setUserLoc(pos.coords.latitude, pos.coords.longitude); map.setView([pos.coords.latitude, pos.coords.longitude], 16); },
      function () { alert('No se pudo obtener tu ubicación. Haz clic en el mapa.'); },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Ruta Turística Oficial — dibuja polyline entre las paradas
  var routeLine = null;
  var RUTA_OFICIAL_SLUGS = ['plaza-de-pomaire', 'imperio-pomaire', 'granja-educativa-alfarera', 'restaurant-la-greda', 'vivero-luchin'];

  window._homeShowRoute = function () {
    if (!map) return;
    // Scroll al mapa
    var el = document.getElementById('leafletMap');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Esperar a que markers estén cargados
    setTimeout(function () {
      if (routeLine) { map.removeLayer(routeLine); routeLine = null; }

      // Buscar markers por slug parcial en nombre
      var latlngs = [];
      RUTA_OFICIAL_SLUGS.forEach(function (slug) {
        for (var i = 0; i < markers.length; i++) {
          var m = markers[i];
          var popup = m.getPopup();
          if (popup) {
            var content = popup.getContent() || '';
            if (content.includes('/' + slug) || content.includes(slug)) {
              latlngs.push(m.getLatLng());
              m.openPopup();
              break;
            }
          }
        }
      });

      // Fallback: usar coordenadas conocidas si no se encuentran markers
      if (latlngs.length < 3) {
        latlngs = [
          L.latLng(-33.65033, -71.15093),   // Plaza/OIT
          L.latLng(-33.65461, -71.15002),   // Imperio Pomaire
          L.latLng(-33.65119, -71.15285),   // Granja Alfarera
          L.latLng(-33.65318, -71.14994),   // La Greda
          L.latLng(-33.65366, -71.15136)    // Vivero Luchín
        ];
      }

      routeLine = L.polyline(latlngs, {
        color: '#8C3D16',
        weight: 4,
        opacity: 0.85,
        dashArray: '10,6'
      }).addTo(map);

      map.fitBounds(routeLine.getBounds(), { padding: [40, 40] });
    }, 500);
  };

  // Init when ready
  function boot() {
    var tries = 0;
    (function wait() {
      if (typeof L !== 'undefined' && document.getElementById('leafletMap')) { initMap(); return; }
      if (tries++ > 60) return;
      setTimeout(wait, 200);
    })();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
