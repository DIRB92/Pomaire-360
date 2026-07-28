/* ══════════════════════════════════════════════════════════════════════════
   MAPA TURÍSTICO DE POMAIRE — JavaScript
   Mapa interactivo con marcadores estilizados por categoría, leyenda
   flotante, filtros, cambio de estilo de mapa, y lista de lugares.
   ════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── DATOS DE LUGARES ──────────────────────────────── */
  var PLACES = [
    // ── PARKING ──
    { id:'pk1', cat:'parking', lat:-33.653240612009675, lng:-71.1484175855184, name:'Estacionamiento Entrada Pomaire', desc:'Rafael Morandé · acceso principal', addr:'Rafael Morandé, Pomaire', gmap:'https://maps.app.goo.gl/q4opxzkj7DVq5Z8U6' },
    { id:'pk2', cat:'parking', lat:-33.65027186391058, lng:-71.15430268749077, name:'Futuros Estacionamiento y baños', desc:'Guillermo Barros con Diego de Almagro', addr:'Guillermo Barros con Diego de Almagro, Pomaire' },
    { id:'pk3', cat:'parking', lat:-33.65078, lng:-71.14907, name:'Zona 18 de Septiembre', desc:'Lateral al casco principal', addr:'18 de Septiembre, Pomaire' },
    // ── HEALTH ──
    { id:'he1', cat:'health', lat:-33.6497, lng:-71.15053, name:'CESFAM Alfarera Rosa Reyes', desc:'Artesana Julita Vera 354', addr:'Julita Vera 354, Pomaire', phone:'+56225688849' },
    { id:'he2', cat:'health', lat:-33.653491296625084, lng:-71.15118860753486, name:'Farmacia Acua-Naser Pomaire', desc:'San Antonio 362', addr:'San Antonio 362, Pomaire', gmap:'https://maps.app.goo.gl/c4QqqSLASBynLttk6' },
    // ── SECURITY ──
    { id:'se1', cat:'security', lat:-33.650798492760984, lng:-71.1512808846173, name:'Carabineros Policía', desc:'San Antonio 361', addr:'San Antonio 361, Pomaire', gmap:'https://maps.app.goo.gl/c555fkuX9t6jcMZs7' },
    { id:'se2', cat:'security', lat:-33.64977969139366, lng:-71.15086677981947, name:'Bomberos de Pomaire', desc:'San Antonio 362', addr:'San Antonio 362, Pomaire', gmap:'https://maps.app.goo.gl/MaJDFK4cwLwf9VZz5' },
    // ── SERVICES ──
    { id:'sv1', cat:'services', lat:-33.65033, lng:-71.15093, name:'Plaza de Pomaire · OIT', desc:'Oficina de Información Turística', addr:'Plaza de Pomaire, San Antonio 140' },
    { id:'sv2', cat:'services', lat:-33.646214708973325, lng:-71.15097954893574, name:'Iglesia de Pomaire', desc:'Templo histórico del pueblo', addr:'Iglesia de Pomaire' },
    { id:'sv3', cat:'services', lat:-33.65029994302147, lng:-71.1496768882763, name:'Cajero Automático (ATM)', desc:'Roberto Bravo 445', addr:'Roberto Bravo 445, Pomaire', gmap:'https://maps.app.goo.gl/HcGUyYo8DQq94NBj9' },
    { id:'sv4', cat:'services', lat:-33.6500313951976, lng:-71.15053295001364, name:'Colegio de Pomaire', desc:'Colegio y Jardín · Enseñanza Básica', addr:'Pomaire', gmap:'https://maps.app.goo.gl/3JLo3RHEu7yPhsMw6' },
    { id:'sv5', cat:'services', lat:-33.6563274403623, lng:-71.15040862537278, name:'El Cristo', desc:'Roberto Bravo 1', addr:'Roberto Bravo 1, Pomaire', gmap:'https://maps.app.goo.gl/Y6MUWpDbiqaSCjUz9' },
    { id:'sv6', cat:'services', lat:-33.65447017901263, lng:-71.15242874012448, name:'Cancha de Pomaire', desc:'Cam. La Cruz, Pomaire', addr:'Cam. La Cruz, Pomaire, Melipilla' },
    { id:'sv8', cat:'services', lat:-33.656554689337824, lng:-71.15054911577195, name:'Vulcanización y Mantenimiento', desc:'Vulcanización y neumáticos', addr:'San Antonio 1, Pomaire' },
    { id:'sv9', cat:'services', lat:-33.64808726960897, lng:-71.14915833045953, name:'Taller de costura J.E.M.E', desc:'Costura y arreglos de ropa', addr:'Gral. Baquedano 241, Pomaire' },
    // ── POTTERY ──
    { id:'po1', cat:'pottery', lat:-33.65119135971276, lng:-71.15284938597316, name:'Granja Educativa Alfarera', desc:'Talleres de greda · Bernardo O\'Higgins 260', addr:'Bernardo O\'Higgins 260, Pomaire', gmap:'https://maps.app.goo.gl/Vgm2CgChUHYWCSg47' },
    { id:'po2', cat:'pottery', lat:-33.65176286310916, lng:-71.15033526947308, name:'Espacio Greda', desc:'Taller de greda · Arturo Prat 352', addr:'Arturo Prat 352, Pomaire', gmap:'https://maps.app.goo.gl/KbNfbMZKQpyjkFwk8', ig:'espaciogreda.cl' },
    { id:'po3', cat:'pottery', lat:-33.652051018925114, lng:-71.14908723334928, name:'Taller del Sol', desc:'Taller de greda · Arturo Prat 237 B', addr:'Arturo Prat 237, Pomaire', gmap:'https://maps.app.goo.gl/9sp8oEZ3oQpxwDwu7' },
    { id:'po4', cat:'pottery', lat:-33.65435030691243, lng:-71.15447074355414, name:'Taller Barros', desc:'Taller de greda · Guillermo Barros 150', addr:'Guillermo Barros 150, Pomaire', gmap:'https://maps.app.goo.gl/Mpo926U8kMj5Rvog6' },
    { id:'po5', cat:'pottery', lat:-33.6522, lng:-71.15, name:'Calle de los Alfareros', desc:'Roberto Bravo · talleres y tiendas', addr:'Roberto Bravo, Pomaire' },
    { id:'po6', cat:'pottery', lat:-33.652552962128134, lng:-71.1534523252861, name:'El Chancho alcancía más grande', desc:'Figura gigante de greda · Los Paltos 323', addr:'Los Paltos 323, Pomaire', gmap:'https://maps.app.goo.gl/rdCjzBBoP5XrtVuJ7', plan:'premium', page:'/elchanchoalcanciamasgrandedelmundo/' },
    { id:'po7', cat:'pottery', lat:-33.646642321720606, lng:-71.15017194940056, name:'Fábrica Don Petro', desc:'Maceteros y vasijas de greda', addr:'El Carmen, Pomaire', gmap:'https://maps.app.goo.gl/R2Zgnzcvm3sWY7H4A' },
    // ── FOOD ──
    { id:'fo1', cat:'food', lat:-33.65460729825698, lng:-71.15001597751701, name:'Imperio Pomaire', desc:'Desayunos y cocina típica · Roberto Bravo 78', addr:'Roberto Bravo 78, Pomaire', gmap:'https://maps.app.goo.gl/muAoduKWg9frboTy7' },
    { id:'fo2', cat:'food', lat:-33.65317799731006, lng:-71.14994054878586, name:'Restaurant La Greda', desc:'Cocina criolla · 30+ años', addr:'Manuel Rodríguez 251, Pomaire', gmap:'https://maps.app.goo.gl/SsdjchMYiy3K6eZeA' },
    { id:'fo3', cat:'food', lat:-33.655708576989326, lng:-71.15010831317134, name:'Restaurante Los Naranjos', desc:'Roberto Bravo 29', addr:'Roberto Bravo 29, Pomaire', gmap:'https://maps.app.goo.gl/r3L9McHKqche7NTV7' },
    { id:'fo4', cat:'food', lat:-33.6515220531864, lng:-71.14978770847507, name:'La Casa del Costillar', desc:'Roberto Bravo 324', addr:'Roberto Bravo 324, Pomaire', gmap:'https://maps.app.goo.gl/wK2GRAiMgSrh8XaM9' },
    { id:'fo5', cat:'food', lat:-33.65600068412172, lng:-71.15083197607485, name:'El Boliche de Pomaire', desc:'San Antonio 17', addr:'San Antonio 17, Pomaire', gmap:'https://maps.app.goo.gl/BNSQEnYq7sKi7dQE7' },
    { id:'fo6', cat:'food', lat:-33.65314424375147, lng:-71.15047939144097, name:'La Normita — Tenedor libre', desc:'Manuel Rodríguez 325', addr:'Manuel Rodríguez 325, Pomaire', gmap:'https://maps.app.goo.gl/7bK3t8Bw9wyV73qw6' },
    { id:'fo7', cat:'food', lat:-33.65178030571566, lng:-71.14900454933903, name:'Restaurant El Parrón', desc:'Parrilla · Arturo Prat 210', addr:'Arturo Prat 210, Pomaire', gmap:'https://maps.app.goo.gl/k5VjUyrJFg8koTB2A' },
    { id:'fo8', cat:'food', lat:-33.654255535020724, lng:-71.1496627003142, name:'La Pica de la Mireya', desc:'Roto Chileno 249', addr:'Roto Chileno 249, Pomaire', gmap:'https://maps.app.goo.gl/NrvTa1aNHBCpd1cX8' },
    { id:'fo9', cat:'food', lat:-33.65165080014213, lng:-71.14996004940937, name:'Restaurante La Cañada', desc:'Roberto Bravo 307', addr:'Roberto Bravo 307, Pomaire', gmap:'https://maps.app.goo.gl/FQvXzcwckKkUEpSt5' },
    { id:'fo10', cat:'food', lat:-33.651957, lng:-71.149992, name:'Dulcería Heladería Dulcepo', desc:'Dulces, postres y helados', addr:'Pomaire', ig:'dulcepo.cl' },
    { id:'fo11', cat:'food', lat:-33.65435582442494, lng:-71.150266197532, name:'Restaurante San Pedro', desc:'Roto Chileno 332', addr:'Roto Chileno 332, Pomaire', gmap:'https://maps.app.goo.gl/UM7eCtd4QQAMXpwK7' },
    { id:'fo12', cat:'food', lat:-33.667105, lng:-71.114189, name:'La Escondida', desc:'Restaurante · Pomaire', addr:'Pomaire, Melipilla', gmap:'https://maps.app.goo.gl/yUXuFcNrwCdLx2UU8' },
    { id:'fo13', cat:'food', lat:-33.65448789758149, lng:-71.15011214056202, name:'Pomaire Restaurant', desc:'Restaurante · Pomaire', addr:'Pomaire', ig:'pomaire_restaurant' },
    // ── LODGING ──
    { id:'lo1', cat:'lodging', lat:-33.65198924949971, lng:-71.15296875422749, name:'Hostal Pomaire', desc:'Bernardo O\'Higgins 219', addr:'Bernardo O\'Higgins 219, Pomaire', gmap:'https://maps.app.goo.gl/x98TVQ53oSQwUmNX6' },
    { id:'lo2', cat:'lodging', lat:-33.64978985059087, lng:-71.15138707552667, name:'La Quinta de la Plaza', desc:'San Antonio 410', addr:'San Antonio 410, Pomaire', gmap:'https://maps.app.goo.gl/YBcasr5ChiRt6etNA' },
    { id:'lo3', cat:'lodging', lat:-33.64827253156989, lng:-71.15605889381351, name:'Cabañas Glamen 1', desc:'Roberto Bravo 284', addr:'Roberto Bravo 284, Pomaire', gmap:'https://maps.app.goo.gl/gAN7Hg36i716RHet9' },
    { id:'lo4', cat:'lodging', lat:-33.647366520043605, lng:-71.15680309312565, name:'Cabañas Glamen 2', desc:'Cabañas · alojamiento', addr:'Pomaire', gmap:'https://maps.app.goo.gl/r3KcbQDNxX9DhY7E7' },
    { id:'lo5', cat:'lodging', lat:-33.65136884009364, lng:-71.15274217075873, name:'Pomaire Lodge & Suites', desc:'Bernardo O\'Higgins 219', addr:'Bernardo O\'Higgins 219, Pomaire', gmap:'https://maps.app.goo.gl/56MaGEtivjNeZrDr8', ig:'pomairesuites' },
    // ── HIGHLIGHT ──
    { id:'hl1', cat:'highlight', lat:-33.65165740947676, lng:-71.14995842541745, name:'Cervecería Pomaire', desc:'Cerveza artesanal · Roberto Bravo 307', addr:'Roberto Bravo 307, Pomaire', gmap:'https://maps.app.goo.gl/EN1vfiMMvNPJrueU7', ig:'cerveceriapomaire_' },
    { id:'hl2', cat:'highlight', lat:-33.65478707835062, lng:-71.15025443200825, name:'Tienda Calafate Austral', desc:'Tienda con encanto · Roberto Bravo 77B', addr:'Roberto Bravo 77, Pomaire', ig:'calafateaustral.cl' },
    { id:'hl3', cat:'highlight', lat:-33.65192, lng:-71.1499, name:'Charcutería Don Mati', desc:'Arturo Prat 237', addr:'Arturo Prat 237, Pomaire' },
    { id:'hl4', cat:'highlight', lat:-33.651768302417416, lng:-71.14981400869864, name:'Panadería y Heladería ALSA', desc:'Roberto Bravo 1606', addr:'Roberto Bravo 1606, Pomaire', gmap:'https://maps.app.goo.gl/m6g2m7SAkA74wqGR9' },
    { id:'hl5', cat:'highlight', lat:-33.6475116, lng:-71.1503954, name:'Los Ceramistas', desc:'General Baquedano 350', addr:'General Baquedano 350, Pomaire', gmap:'https://maps.app.goo.gl/Hae5UCCkPmBnMSHPA' },
    { id:'hl6', cat:'highlight', lat:-33.653664329289256, lng:-71.15135912053388, name:'Vivero Luchín', desc:'Jardín y vivero · San Antonio 191', addr:'San Antonio 191, Pomaire', ig:'viveroluchin' },
    // ── AROUND ──
    { id:'ar1', cat:'around', lat:-33.665, lng:-71.17, name:'Los Chiñihues', desc:'Paisaje rural, viñedos y quebradas', addr:'Los Chiñihues, Melipilla' }
  ];

  /* ── CONFIGURACIÓN DE CATEGORÍAS ────────────────────── */
  var CATEGORIES = {
    pottery:   { label: 'Alfarería',        color: '#B85C2C', icon: '🏺' },
    food:      { label: 'Restaurantes',      color: '#D4622A', icon: '🍽️' },
    lodging:   { label: 'Alojamiento',       color: '#2F7A6B', icon: '🛏️' },
    parking:   { label: 'Estacionamientos',  color: '#3B7DD8', icon: '🅿️' },
    health:    { label: 'Salud',             color: '#E25555', icon: '🏥' },
    security:  { label: 'Seguridad',         color: '#5B6ABF', icon: '🚔' },
    services:  { label: 'Servicios',         color: '#7A5C40', icon: '⛪' },
    highlight: { label: 'Destacados',        color: '#E6B246', icon: '⭐' },
    around:    { label: 'Alrededores',       color: '#4A7C59', icon: '🌾' }
  };

  /* ── VARIABLES GLOBALES ─────────────────────────────── */
  var map, markers = [], userMarker = null;
  var currentCategory = 'all';
  var currentStyle = 'streets';

  var tileLayers = {
    streets: null,
    satellite: null
  };

  /* ── INICIALIZACIÓN ─────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    // Create map
    map = L.map('touristMap', {
      center: [-33.6512, -71.1505],
      zoom: 16,
      zoomControl: true,
      attributionControl: true
    });

    // Tile layers
    tileLayers.streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a>',
      maxZoom: 19
    });

    tileLayers.satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: '© Esri, Maxar, Earthstar',
      maxZoom: 19
    });

    tileLayers.streets.addTo(map);

    // Add markers
    PLACES.forEach(function (place) {
      addMarker(place);
    });

    // Update counts
    updateLegendCounts();

    // Render places list
    renderPlacesList();

    // Handle hash deep links
    openFromHash();
    window.addEventListener('hashchange', openFromHash);
  }

  /* ── MARCADORES ─────────────────────────────────────── */
  function addMarker(place) {
    var cat = CATEGORIES[place.cat] || { color: '#888', icon: '📍' };
    var isFeatured = place.plan === 'premium' || place.plan === 'destacado';
    var size = isFeatured ? 44 : 36;

    var icon = L.divIcon({
      className: 'marker-wrapper',
      html: '<div class="marker-icon marker-' + place.cat + (isFeatured ? ' is-featured' : '') + '" style="width:' + size + 'px;height:' + size + 'px;font-size:' + (isFeatured ? '1.2rem' : '1rem') + ';">' + cat.icon + '</div>',
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
      popupAnchor: [0, -(size / 2 + 4)]
    });

    var marker = L.marker([place.lat, place.lng], {
      icon: icon,
      zIndexOffset: isFeatured ? 1000 : 0
    });

    marker.bindPopup(buildPopup(place), { maxWidth: 280, closeButton: true });
    marker.addTo(map);
    marker._placeData = place;
    markers.push(marker);
  }

  /* ── POPUP ──────────────────────────────────────────── */
  function buildPopup(place) {
    var cat = CATEGORIES[place.cat] || { label: '', color: '#888' };
    var gmapUrl = place.gmap || 'https://maps.google.com/?q=' + place.lat + ',' + place.lng;

    var links = '<a href="' + gmapUrl + '" target="_blank" rel="noopener">📍 Google Maps</a>';
    if (place.ig) links += '<a href="https://instagram.com/' + place.ig + '" target="_blank" rel="noopener">📷 Instagram</a>';
    if (place.phone) links += '<a href="tel:' + place.phone + '">📞 Llamar</a>';
    if (place.page) links += '<a href="' + place.page + '">📄 Ver página</a>';

    return '<div class="popup-card">' +
      '<span class="popup-cat-badge" style="background:' + cat.color + ';">' + cat.label + '</span>' +
      '<h4>' + (place.plan === 'premium' ? '💎 ' : '') + place.name + '</h4>' +
      '<p>' + place.desc + '</p>' +
      '<p class="popup-addr">📌 ' + place.addr + '</p>' +
      '<div class="popup-links">' + links + '</div>' +
      '</div>';
  }

  /* ── FILTROS DE CATEGORÍA ───────────────────────────── */
  window.filterCategory = function (cat) {
    currentCategory = cat;

    // Update UI buttons
    document.querySelectorAll('.cat-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-category') === cat);
    });

    // Show/hide markers
    markers.forEach(function (m) {
      var show = (cat === 'all') || (m._placeData.cat === cat);
      if (show) {
        if (!map.hasLayer(m)) m.addTo(map);
      } else {
        if (map.hasLayer(m)) map.removeLayer(m);
      }
    });

    // Highlight legend item
    document.querySelectorAll('.legend-item').forEach(function (item) {
      item.style.opacity = (cat === 'all' || item.getAttribute('data-category') === cat) ? '1' : '.4';
    });

    // Update places list
    renderPlacesList();

    // Fit bounds to visible markers
    if (cat !== 'all') {
      var visible = markers.filter(function (m) { return m._placeData.cat === cat; });
      if (visible.length > 0) {
        var group = L.featureGroup(visible);
        map.fitBounds(group.getBounds().pad(0.15));
      }
    }
  };

  /* ── LEYENDA ────────────────────────────────────────── */
  window.toggleLegend = function () {
    var legend = document.getElementById('mapLegend');
    var btn = document.getElementById('legendToggle');
    legend.classList.toggle('collapsed');
    btn.textContent = legend.classList.contains('collapsed') ? '+' : '−';
  };

  function updateLegendCounts() {
    Object.keys(CATEGORIES).forEach(function (cat) {
      var count = PLACES.filter(function (p) { return p.cat === cat; }).length;
      var el = document.getElementById('count-' + cat);
      if (el) el.textContent = count;
    });
  }

  /* ── CAMBIO DE ESTILO DE MAPA ───────────────────────── */
  window.changeMapStyle = function (style) {
    if (style === currentStyle) return;

    map.removeLayer(tileLayers[currentStyle]);
    tileLayers[style].addTo(map);
    currentStyle = style;

    document.querySelectorAll('.style-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-style') === style);
    });
  };

  /* ── UBICACIÓN DEL USUARIO ──────────────────────────── */
  window.locateUser = function () {
    if (!navigator.geolocation) {
      alert('Tu navegador no soporta geolocalización');
      return;
    }

    navigator.geolocation.getCurrentPosition(function (pos) {
      var lat = pos.coords.latitude;
      var lng = pos.coords.longitude;

      if (userMarker) {
        userMarker.setLatLng([lat, lng]);
      } else {
        userMarker = L.marker([lat, lng], {
          icon: L.divIcon({
            className: 'user-marker-wrap',
            html: '<div class="user-marker"></div>',
            iconSize: [18, 18],
            iconAnchor: [9, 9]
          }),
          zIndexOffset: 2000
        }).addTo(map);
      }

      map.setView([lat, lng], 17);
    }, function () {
      alert('No se pudo obtener tu ubicación. Verifica los permisos.');
    }, { enableHighAccuracy: true, timeout: 8000 });
  };

  /* ── LISTA DE LUGARES ───────────────────────────────── */
  function renderPlacesList() {
    var grid = document.getElementById('placesGrid');
    var countEl = document.getElementById('placesCount');
    if (!grid) return;

    var filtered = currentCategory === 'all'
      ? PLACES
      : PLACES.filter(function (p) { return p.cat === currentCategory; });

    countEl.textContent = '(' + filtered.length + ' lugares)';

    grid.innerHTML = filtered.map(function (place) {
      var cat = CATEGORIES[place.cat] || { color: '#888', icon: '📍' };
      return '<div class="place-card" onclick="focusPlace(\'' + place.id + '\')">' +
        '<div class="place-card-icon" style="background:' + cat.color + ';">' + cat.icon + '</div>' +
        '<div class="place-card-info"><h4>' + place.name + '</h4><p>' + place.desc + '</p></div>' +
        '</div>';
    }).join('');
  }

  /* ── FOCUS EN UN LUGAR ──────────────────────────────── */
  window.focusPlace = function (id) {
    var marker = markers.find(function (m) { return m._placeData.id === id; });
    if (!marker) return;

    // Make sure it's visible
    if (!map.hasLayer(marker)) marker.addTo(map);

    map.setView(marker.getLatLng(), 18, { animate: true });
    setTimeout(function () { marker.openPopup(); }, 300);
  };

  /* ── DEEP LINKS ─────────────────────────────────────── */
  function openFromHash() {
    var match = location.hash.match(/^#lugar=([\w-]+)/);
    if (match) {
      setTimeout(function () { window.focusPlace(match[1]); }, 400);
    }
  }

})();
