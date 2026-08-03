/* ═══════════════════════════════════════════════════════════════════════════
   map-supabase.js — Carga negocios desde Supabase y los agrega al mapa
   interactivo de pomaire360.cl como marcadores dinámicos.

   Se ejecuta DESPUÉS de app.js (que inicializa el mapa con PLACES estáticos).
   Agrega negocios que tengan latitud/longitud definidos.
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var SUPABASE_URL = 'https://uuskvqtbsvtfsovcjazf.supabase.co';
  var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1c2t2cXRic3Z0ZnNvdmNqYXpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2ODU4NDIsImV4cCI6MjEwMDI2MTg0Mn0.BbHI3ctSNg5msUnL9eENTNpOujQROAh6vUAZpFVcbBI';
  var TABLE = 'negocios_directorio360';

  // Mapeo de categorías a iconos del mapa
  var CAT_ICONS = {
    gastronomia: '🍽️',
    artesanos:   '🏺',
    alojamientos:'🛏️',
    interes:     '✨',
    servicios:   '🔧',
    talleres:    '🎨',
    jardin:      '🌿'
  };

  // Mapeo de categorías a categorías del mapa (para el filtro)
  var CAT_MAP_FILTER = {
    gastronomia:  'food',
    artesanos:    'pottery',
    alojamientos: 'lodging',
    interes:      'highlight',
    servicios:    'services',
    talleres:     'pottery',
    jardin:       'highlight'
  };

  function escapeHTML(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function buildPopup(negocio) {
    var name = escapeHTML(negocio.nombre);
    var addr = escapeHTML(negocio.direccion);
    var desc = escapeHTML(negocio.descripcion);
    var phone = escapeHTML(negocio.telefono);
    var wsp = (negocio.whatsapp || '').replace(/[^0-9]/g, '');
    var ig = escapeHTML((negocio.instagram || '').replace(/^@/, ''));

    var html = '<div class="map-popup">';
    html += '<strong style="font-size:1.05em;">' + name + '</strong>';
    if (negocio.verificado) html += ' <span style="color:#27ae60;" title="Verificado">✓</span>';
    if (addr) html += '<br><span style="font-size:.88em;color:#5a4a3a;">📍 ' + addr + '</span>';
    if (desc) html += '<br><span style="font-size:.85em;color:#6B4226;">' + desc.substring(0, 80) + (desc.length > 80 ? '...' : '') + '</span>';

    html += '<div style="margin-top:.5em;display:flex;flex-wrap:wrap;gap:.3em;">';
    if (phone) html += '<a href="tel:' + phone + '" style="font-size:.8em;color:#B85C2C;">📞 ' + phone + '</a>';
    if (wsp) html += '<a href="https://wa.me/' + wsp + '" target="_blank" rel="noopener" style="font-size:.8em;color:#25d366;">💬 WhatsApp</a>';
    if (ig) html += '<a href="https://instagram.com/' + ig + '" target="_blank" rel="noopener" style="font-size:.8em;color:#E1306C;">📷 @' + ig + '</a>';
    if (negocio.web) html += '<a href="' + escapeHTML(negocio.web) + '" target="_blank" rel="noopener" style="font-size:.8em;color:#B85C2C;">🌐 Web</a>';
    html += '</div>';

    // Enlace a reseñas en la app
    html += '<div style="margin-top:.4em;"><a href="https://app.pomaire360.cl/negocios?q=' + encodeURIComponent(negocio.nombre) + '" target="_blank" rel="noopener" style="font-size:.8em;color:#4A7C59;font-weight:600;">⭐ Ver reseñas en la app</a></div>';
    html += '</div>';
    return html;
  }

  function addToMap(negocios) {
    // Esperar a que el mapa Leaflet esté inicializado
    if (typeof window.leafletMap === 'undefined' || !window.leafletMap) return;
    if (typeof L === 'undefined') return;

    var map = window.leafletMap;
    var existingMarkers = window.markers || {};

    negocios.forEach(function (neg) {
      if (!neg.latitud || !neg.longitud) return;

      // Evitar duplicados (si ya existe un marcador estático muy cerca)
      var isDuplicate = false;
      Object.values(existingMarkers).forEach(function (m) {
        if (!m || !m.getLatLng) return;
        var ll = m.getLatLng();
        var dist = Math.abs(ll.lat - neg.latitud) + Math.abs(ll.lng - neg.longitud);
        if (dist < 0.0003) isDuplicate = true; // ~30m de distancia
      });
      if (isDuplicate) return;

      var cat = neg.categoria || 'interes';
      var icon = CAT_ICONS[cat] || '📍';
      var featured = neg.plan === 'destacado' || neg.plan === 'premium';
      var bg = featured ? '#E6B246' : '#6B4226';
      var sz = featured ? 40 : 32;
      var shadow = featured
        ? 'box-shadow:0 0 0 3px rgba(230,178,70,.5),0 3px 10px rgba(0,0,0,.4);'
        : 'box-shadow:0 2px 8px rgba(0,0,0,.3);';

      var marker = L.marker([neg.latitud, neg.longitud], {
        zIndexOffset: featured ? 900 : 0,
        icon: L.divIcon({
          className: 'custom-marker supabase-marker' + (featured ? ' is-featured' : ''),
          html: '<div style="background:' + bg + ';border:2px solid #fff;border-radius:50%;width:' + sz + 'px;height:' + sz + 'px;display:flex;align-items:center;justify-content:center;font-size:' + (featured ? 17 : 14) + 'px;' + shadow + '">' + icon + '</div>',
          iconSize: [sz, sz],
          iconAnchor: [sz / 2, sz / 2]
        })
      });

      marker.bindPopup(buildPopup(neg));
      marker.addTo(map);

      // Registrar para filtrado
      marker.placeId = 'supa-' + neg.slug;
      marker._supabaseCat = CAT_MAP_FILTER[cat] || 'highlight';
      if (window.markers) window.markers['supa-' + neg.slug] = marker;
    });
  }

  function loadFromSupabase() {
    var url = SUPABASE_URL + '/rest/v1/' + TABLE + '?select=nombre,slug,direccion,telefono,whatsapp,instagram,web,descripcion,categoria,plan,latitud,longitud,verificado,foto_portada&latitud=not.is.null&longitud=not.is.null';

    return fetch(url, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
        'Accept': 'application/json'
      }
    })
    .then(function (res) {
      if (!res.ok) throw new Error('Supabase map error: ' + res.status);
      return res.json();
    })
    .then(function (rows) {
      if (rows && rows.length > 0) {
        addToMap(rows);
        console.log('[Pomaire360] Mapa: ' + rows.length + ' negocios de Supabase agregados');
      }
    })
    .catch(function (err) {
      console.warn('[Pomaire360] No se pudieron cargar negocios para el mapa:', err.message);
    });
  }

  // Esperar a que el mapa esté listo (app.js lo inicializa al hacer scroll al mapa)
  function waitForMap() {
    var attempts = 0;
    var maxAttempts = 30; // 30 × 500ms = 15s

    function check() {
      if (window.leafletMap) {
        loadFromSupabase();
        return;
      }
      attempts++;
      if (attempts < maxAttempts) {
        setTimeout(check, 500);
      }
    }

    // También escuchar si el mapa se inicializa después
    var originalInitMap = window.initMap;
    if (typeof originalInitMap === 'function') {
      window.initMap = function () {
        originalInitMap.apply(this, arguments);
        setTimeout(loadFromSupabase, 200);
      };
    }

    check();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForMap);
  } else {
    waitForMap();
  }
})();
