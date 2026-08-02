/* Mapa Leaflet propio de esta página: paraderos y terminales de locomoción */
(function () {
  var LOCO_POINTS = [
    { id:'p1', lat:-33.45890, lng:-70.67720, icon:'🚌', nameKey:'loc_p1', descKey:'loc_p1_d', gmap:'https://maps.google.com/?q=Terminal+San+Borja+Santiago' },
    { id:'p2', lat:-33.68633, lng:-71.21486, icon:'🚏', nameKey:'loc_p2', descKey:'loc_p2_d', gmap:'https://maps.google.com/?q=Terminal+de+Buses+de+Melipilla' },
    { id:'p3', lat:-33.65033, lng:-71.15093, icon:'🚐', nameKey:'loc_p3', descKey:'loc_p3_d', gmap:'https://maps.google.com/?q=Plaza+de+Pomaire' },
    { id:'p4', lat:-33.65324, lng:-71.14842, icon:'🚩', nameKey:'loc_p4', descKey:'loc_p4_d', gmap:'https://maps.app.goo.gl/q4opxzkj7DVq5Z8U6' }
  ];
  var ROUTE_LATLNGS = LOCO_POINTS.map(function (p) { return [p.lat, p.lng]; });

  function t(key) {
    try {
      var lang = document.documentElement.lang || 'es';
      var L = window.LANGS || {};
      if (L[lang] && L[lang][key] !== undefined) return L[lang][key];
      if (L.es && L.es[key] !== undefined) return L.es[key];
    } catch (e) {}
    return key;
  }

  function buildPopup(p) {
    return '<div class="map-popup"><strong>' + p.icon + ' ' + t(p.nameKey) + '</strong><p>' + t(p.descKey) + '</p>' +
      '<a href="' + p.gmap + '" target="_blank" rel="noopener">' + t('loc_open_map') + '</a></div>';
  }

  var map, markers = [], line;

  function init() {
    var el = document.getElementById('locoMap');
    if (!el || typeof L === 'undefined') return;
    map = L.map('locoMap', { zoomControl: true }).setView([-33.62, -70.95], 9);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 19
    }).addTo(map);

    line = L.polyline(ROUTE_LATLNGS, { color: '#B85C2C', weight: 3, opacity: 0.7, dashArray: '8,6' }).addTo(map);

    LOCO_POINTS.forEach(function (p) {
      var marker = L.marker([p.lat, p.lng], {
        icon: L.divIcon({
          className: 'custom-marker',
          html: '<div style="background:#B85C2C;border:2px solid #fff;border-radius:50%;width:34px;height:34px;display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 2px 8px rgba(0,0,0,.3);">' + p.icon + '</div>',
          iconSize: [34, 34],
          iconAnchor: [17, 17]
        })
      });
      marker.bindPopup(buildPopup(p));
      marker.addTo(map);
      marker.placeData = p;
      markers.push(marker);
    });

    map.fitBounds(line.getBounds(), { padding: [30, 30] });
  }

  // Re-renderizar los popups abiertos cuando cambia el idioma
  // subi18n.js expone window.selectLang (no applyLang), así que envolvemos esa función.
  function hookSelectLang() {
    if (window.__locoSelectLangHooked) return;
    var origSelectLang = window.selectLang;
    if (typeof origSelectLang !== 'function') return;
    window.__locoSelectLangHooked = true;
    window.selectLang = function (lang) {
      origSelectLang(lang);
      markers.forEach(function (m) { m.setPopupContent(buildPopup(m.placeData)); });
    };
  }
  var hookTries = 0;
  (function waitSelectLang() {
    if (typeof window.selectLang === 'function') { hookSelectLang(); return; }
    if (hookTries++ > 50) return;
    setTimeout(waitSelectLang, 100);
  })();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      // Esperar a que Leaflet (script defer) esté disponible
      var tries = 0;
      (function waitLeaflet() {
        if (typeof L !== 'undefined') { init(); return; }
        if (tries++ > 50) return;
        setTimeout(waitLeaflet, 100);
      })();
    });
  } else {
    var tries2 = 0;
    (function waitLeaflet2() {
      if (typeof L !== 'undefined') { init(); return; }
      if (tries2++ > 50) return;
      setTimeout(waitLeaflet2, 100);
    })();
  }
})();
