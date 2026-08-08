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


  /* ── DATOS ESTÁTICOS (fallback cuando Supabase no tiene suficientes datos con coordenadas) ── */
  var STATIC_PLACES = [
    // PARKING
    { nombre:'Estacionamiento Entrada Pomaire', slug:'estacionamiento-entrada-pomaire', categoria:'estacionamientos', latitud:-33.653240612009675, longitud:-71.1484175855184, direccion:'Rafael Morandé, Pomaire', descripcion:'Acceso principal', plan:'gratis', verificado:false },
    { nombre:'Futuros Estacionamiento y baños', slug:'futuros-estacionamiento', categoria:'estacionamientos', latitud:-33.65027186391058, longitud:-71.15430268749077, direccion:'Guillermo Barros con Diego de Almagro', descripcion:'', plan:'gratis', verificado:false },
    { nombre:'Zona 18 de Septiembre', slug:'zona-18-septiembre', categoria:'estacionamientos', latitud:-33.65078, longitud:-71.14907, direccion:'18 de Septiembre, Pomaire', descripcion:'Lateral al casco principal', plan:'gratis', verificado:false },
    // SALUD
    { nombre:'CESFAM Alfarera Rosa Reyes Vilches', slug:'cesfam-pomaire', categoria:'salud', latitud:-33.6497, longitud:-71.15053, direccion:'Julita Vera 354, Pomaire', descripcion:'Centro de salud familiar', telefono:'+56225688849', plan:'gratis', verificado:true },
    { nombre:'Farmacia Acua-Naser Pomaire', slug:'farmacia-acua-naser', categoria:'salud', latitud:-33.653491296625084, longitud:-71.15118860753486, direccion:'San Antonio 362, Pomaire', descripcion:'Farmacia', plan:'gratis', verificado:false },
    // SEGURIDAD
    { nombre:'Carabineros Policía', slug:'carabineros-pomaire', categoria:'seguridad', latitud:-33.650798492760984, longitud:-71.1512808846173, direccion:'San Antonio 361, Pomaire', descripcion:'Retén de Carabineros', plan:'gratis', verificado:true },
    { nombre:'Bomberos de Pomaire', slug:'bomberos-pomaire', categoria:'seguridad', latitud:-33.64977969139366, longitud:-71.15086677981947, direccion:'San Antonio 362, Pomaire', descripcion:'Compañía de Bomberos', plan:'gratis', verificado:true },
    // SERVICIOS
    { nombre:'Plaza de Pomaire · OIT', slug:'plaza-de-pomaire', categoria:'servicios', latitud:-33.65033, longitud:-71.15093, direccion:'Plaza de Pomaire, San Antonio 140', descripcion:'Oficina de Información Turística', plan:'gratis', verificado:true },
    { nombre:'Iglesia de Pomaire', slug:'iglesia-pomaire', categoria:'servicios', latitud:-33.646214708973325, longitud:-71.15097954893574, direccion:'Pomaire', descripcion:'Templo histórico del pueblo', plan:'gratis', verificado:false },
    { nombre:'Cajero Automático (ATM)', slug:'cajero-automatico-pomaire', categoria:'servicios', latitud:-33.65029994302147, longitud:-71.1496768882763, direccion:'Roberto Bravo 445, Pomaire', descripcion:'ATM', plan:'gratis', verificado:false },
    { nombre:'Colegio de Pomaire', slug:'colegio-pomaire', categoria:'servicios', latitud:-33.6500313951976, longitud:-71.15053295001364, direccion:'Pomaire', descripcion:'Colegio y Jardín', instagram:'colegiopomaire_', plan:'gratis', verificado:false },
    { nombre:'Vulcanización y Mantenimiento', slug:'vulcanizacion-pomaire', categoria:'servicios', latitud:-33.656554689337824, longitud:-71.15054911577195, direccion:'San Antonio 1, Pomaire', descripcion:'Vulcanización y neumáticos', whatsapp:'56985478591', plan:'gratis', verificado:false },
    { nombre:'Taller de costura J.E.M.E', slug:'taller-costura-jeme', categoria:'servicios', latitud:-33.64808726960897, longitud:-71.14915833045953, direccion:'Gral. Baquedano 241, Pomaire', descripcion:'Costura y arreglos de ropa', telefono:'+56955822650', whatsapp:'56955822650', plan:'gratis', verificado:false },
    // ALFARERÍA
    { nombre:'Granja Educativa Alfarera', slug:'granja-educativa-alfarera', categoria:'alfareria', latitud:-33.65119135971276, longitud:-71.15284938597316, direccion:'Bernardo O\'Higgins 260, Pomaire', descripcion:'Talleres de greda para toda la familia', plan:'gratis', verificado:false },
    { nombre:'Espacio Greda', slug:'espacio-greda', categoria:'alfareria', latitud:-33.65176286310916, longitud:-71.15033526947308, direccion:'Arturo Prat 352, Pomaire', descripcion:'Taller de greda', instagram:'espaciogreda.cl', plan:'gratis', verificado:false },
    { nombre:'Taller del Sol', slug:'taller-del-sol', categoria:'alfareria', latitud:-33.652051018925114, longitud:-71.14908723334928, direccion:'Arturo Prat 237 B, Pomaire', descripcion:'Taller de greda artesanal', plan:'gratis', verificado:false },
    { nombre:'Taller Barros', slug:'taller-barros', categoria:'alfareria', latitud:-33.65435030691243, longitud:-71.15447074355414, direccion:'Guillermo Barros 150, Pomaire', descripcion:'Taller de greda', plan:'gratis', verificado:false },
    { nombre:'Calle de los Alfareros', slug:'calle-alfareros', categoria:'alfareria', latitud:-33.6522, longitud:-71.15, direccion:'Roberto Bravo, Pomaire', descripcion:'Talleres y tiendas de alfarería', plan:'gratis', verificado:false },
    { nombre:'El Chancho Alcancía Más Grande del Mundo', slug:'el-chancho-alcancia-de-greda-mas-grande-del-mundo', categoria:'alfareria', latitud:-33.652552962128134, longitud:-71.1534523252861, direccion:'Los Paltos 323, Pomaire', descripcion:'Figura gigante de greda', plan:'premium', verificado:true },
    { nombre:'Fábrica Don Petro', slug:'fabrica-don-petro', categoria:'alfareria', latitud:-33.646642321720606, longitud:-71.15017194940056, direccion:'El Carmen, Pomaire', descripcion:'Maceteros y vasijas de greda', plan:'gratis', verificado:false },
    // RESTAURANTES
    { nombre:'Imperio Pomaire', slug:'imperio-pomaire', categoria:'restaurantes', latitud:-33.65460729825698, longitud:-71.15001597751701, direccion:'Roberto Bravo 78, Pomaire', descripcion:'Desayunos y cocina típica', plan:'gratis', verificado:false },
    { nombre:'Restaurant La Greda', slug:'restaurant-la-greda', categoria:'restaurantes', latitud:-33.65317799731006, longitud:-71.14994054878586, direccion:'Manuel Rodríguez 251, Pomaire', descripcion:'Cocina criolla · 30+ años', plan:'gratis', verificado:false },
    { nombre:'Restaurante Los Naranjos', slug:'restaurante-los-naranjos', categoria:'restaurantes', latitud:-33.655708576989326, longitud:-71.15010831317134, direccion:'Roberto Bravo 29, Pomaire', descripcion:'Restaurante tradicional', plan:'gratis', verificado:false },
    { nombre:'La Casa del Costillar', slug:'la-casa-del-costillar', categoria:'restaurantes', latitud:-33.6515220531864, longitud:-71.14978770847507, direccion:'Roberto Bravo 324, Pomaire', descripcion:'Parrilla y cocina chilena', plan:'gratis', verificado:false },
    { nombre:'El Boliche de Pomaire', slug:'el-boliche-de-pomaire', categoria:'restaurantes', latitud:-33.65600068412172, longitud:-71.15083197607485, direccion:'San Antonio 17, Pomaire', descripcion:'Restaurante', plan:'gratis', verificado:false },
    { nombre:'La Normita — Tenedor libre', slug:'la-normita', categoria:'restaurantes', latitud:-33.65314424375147, longitud:-71.15047939144097, direccion:'Manuel Rodríguez 325, Pomaire', descripcion:'Tenedor libre', plan:'gratis', verificado:false },
    { nombre:'Restaurant El Parrón', slug:'restaurant-el-parron', categoria:'restaurantes', latitud:-33.65178030571566, longitud:-71.14900454933903, direccion:'Arturo Prat 210, Pomaire', descripcion:'Parrilla', plan:'gratis', verificado:false },
    { nombre:'La Pica de la Mireya', slug:'la-pica-de-la-mireya', categoria:'restaurantes', latitud:-33.654255535020724, longitud:-71.1496627003142, direccion:'Roto Chileno 249, Pomaire', descripcion:'Restaurante', plan:'gratis', verificado:false },
    { nombre:'Restaurante La Cañada', slug:'restaurante-la-canada', categoria:'restaurantes', latitud:-33.65165080014213, longitud:-71.14996004940937, direccion:'Roberto Bravo 307, Pomaire', descripcion:'Restaurante', plan:'gratis', verificado:false },
    { nombre:'Dulcería Heladería Dulcepo', slug:'dulcepo', categoria:'restaurantes', latitud:-33.651957, longitud:-71.149992, direccion:'Pomaire', descripcion:'Dulces, postres y helados', instagram:'dulcepo.cl', whatsapp:'56933925873', plan:'gratis', verificado:false },
    { nombre:'Restaurante San Pedro', slug:'restaurante-san-pedro', categoria:'restaurantes', latitud:-33.65435582442494, longitud:-71.150266197532, direccion:'Roto Chileno 332, Pomaire', descripcion:'Restaurante', plan:'gratis', verificado:false },
    { nombre:'Pomaire Restaurant', slug:'pomaire-restaurant', categoria:'restaurantes', latitud:-33.65448789758149, longitud:-71.15011214056202, direccion:'Pomaire', descripcion:'Restaurante', instagram:'pomaire_restaurant', plan:'gratis', verificado:false },
    { nombre:'Restaurante Barro Vivo', slug:'restaurante-barro-vivo', categoria:'restaurantes', latitud:-33.65298, longitud:-71.15065, direccion:'Manuel Rodríguez 350, Pomaire', descripcion:'Restaurante y centro de eventos', telefono:'+56959335948', whatsapp:'56959335948', web:'https://barrosvivo.cl/', plan:'gratis', verificado:false },
    // ALOJAMIENTO
    { nombre:'Hostal Pomaire', slug:'hostal-pomaire', categoria:'alojamiento', latitud:-33.65198924949971, longitud:-71.15296875422749, direccion:'Bernardo O\'Higgins 219, Pomaire', descripcion:'Hostal', plan:'gratis', verificado:false },
    { nombre:'La Quinta de la Plaza', slug:'la-quinta-de-la-plaza', categoria:'alojamiento', latitud:-33.64978985059087, longitud:-71.15138707552667, direccion:'San Antonio 410, Pomaire', descripcion:'Alojamiento', whatsapp:'56999598919', web:'https://laquintadelaplaza-cl.webnode.cl/', plan:'gratis', verificado:false },
    { nombre:'Cabañas Glamen', slug:'cabanas-glamen', categoria:'alojamiento', latitud:-33.64827253156989, longitud:-71.15605889381351, direccion:'Roberto Bravo 284, Pomaire', descripcion:'Cabañas', web:'https://hostaldelcentro.cl/', plan:'gratis', verificado:false },
    { nombre:'Pomaire Lodge & Suites', slug:'pomaire-lodge-suites', categoria:'alojamiento', latitud:-33.65136884009364, longitud:-71.15274217075873, direccion:'Bernardo O\'Higgins 219, Pomaire', descripcion:'Suites y alojamiento', instagram:'pomairesuites', plan:'gratis', verificado:false },
    // COMERCIO (Destacados)
    { nombre:'Cervecería Pomaire', slug:'cerveceria-pomaire', categoria:'comercio', latitud:-33.65165740947676, longitud:-71.14995842541745, direccion:'Roberto Bravo 307, Pomaire', descripcion:'Cerveza artesanal', instagram:'cerveceriapomaire_', plan:'destacado', verificado:false },
    { nombre:'Tienda Calafate Austral', slug:'calafate-austral', categoria:'comercio', latitud:-33.65478707835062, longitud:-71.15025443200825, direccion:'Roberto Bravo 77B, Pomaire', descripcion:'Tienda con encanto', instagram:'calafateaustral.cl', plan:'destacado', verificado:false },
    { nombre:'Panadería y Heladería ALSA', slug:'panaderia-alsa', categoria:'comercio', latitud:-33.651768302417416, longitud:-71.14981400869864, direccion:'Roberto Bravo 1606, Pomaire', descripcion:'Panadería y helados', plan:'gratis', verificado:false },
    { nombre:'Los Ceramistas', slug:'los-ceramistas', categoria:'comercio', latitud:-33.6475116, longitud:-71.1503954, direccion:'General Baquedano 350, Pomaire', descripcion:'Tienda de cerámica', plan:'gratis', verificado:false },
    { nombre:'Vivero Luchín', slug:'vivero-luchin', categoria:'comercio', latitud:-33.653664329289256, longitud:-71.15135912053388, direccion:'San Antonio 191, Pomaire', descripcion:'Jardín y vivero', instagram:'viveroluchin', plan:'gratis', verificado:false },
    // TURISMO
    { nombre:'Los Chiñihues', slug:'los-chinihues', categoria:'turismo', latitud:-33.665, longitud:-71.17, direccion:'Los Chiñihues, Melipilla', descripcion:'Paisaje rural, viñedos y quebradas', plan:'gratis', verificado:false }
  ];


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
    if (activeRoute === routeId) { activeRoute = null; updateRouteUI(); return; }
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
    updateRouteUI();
  };

  // Aliases used by the HTML
  window.loadRoute = window.showRoute;
  window.clearRoute = function () {
    if (routeLine) { map.removeLayer(routeLine); routeLine = null; }
    activeRoute = null;
    updateRouteUI();
  };

  function updateRouteUI() {
    var btn = document.getElementById('routeClearBtn');
    if (btn) btn.style.display = activeRoute ? '' : 'none';
    document.querySelectorAll('.route-card').forEach(function (card) {
      card.classList.toggle('active', card.dataset.route === activeRoute);
    });
  }

  window.resetMapView = function () {
    window.clearRoute();
    map.setView([-33.6512, -71.1505], 16);
  };

  /* ── BÚSQUEDA ──────────────────────────────────────── */
  window.searchPlaces = function (query) {
    var input = document.getElementById('mapSearchInput');
    var q = (query || (input && input.value) || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (!q || q.length < 2) { window.filterCategory(currentFilter); return; }
    Object.values(markers).forEach(function (m) {
      var name = m._data.nombre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      var addr = (m._data.direccion || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (name.includes(q) || addr.includes(q)) { map.addLayer(m); } else { map.removeLayer(m); }
    });
  };

  window.clearSearch = function () {
    var input = document.getElementById('mapSearchInput');
    if (input) input.value = '';
    window.filterCategory('all');
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
    if (m && markers[m[1]]) { setTimeout(function () { window.focusPlace(m[1]); }, 300); return; }
    // Support coordinate deep-links: #lat,lng
    var coords = location.hash.match(/^#(-?\d+\.\d+),(-?\d+\.\d+)$/);
    if (coords && map) {
      var lat = parseFloat(coords[1]), lng = parseFloat(coords[2]);
      setTimeout(function () { map.setView([lat, lng], 17); L.popup().setLatLng([lat, lng]).setContent("📍 Ubicación").openOn(map); }, 400);
    }
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
        // Si Supabase devuelve menos de 5 lugares con coordenadas, usar fallback estático
        if (rows.length < 5) {
          console.warn('[Mapa] Supabase solo devolvió ' + rows.length + ' lugares, usando datos estáticos.');
          places = STATIC_PLACES.map(function (p) { return p; });
        } else {
          places = rows;
        }
        console.log('[Mapa] ' + places.length + ' negocios cargados');
        places.forEach(addMarker);
        updateLegendCounts();
        renderPlacesList();
        openFromHash();
        window.addEventListener('hashchange', openFromHash);
        if (loadingEl) loadingEl.style.display = 'none';
      })
      .catch(function (err) {
        console.error('[Mapa] Error al cargar datos desde Supabase, usando fallback estático:', err);
        places = STATIC_PLACES.map(function (p) { return p; });
        places.forEach(addMarker);
        updateLegendCounts();
        renderPlacesList();
        openFromHash();
        window.addEventListener('hashchange', openFromHash);
        if (loadingEl) loadingEl.style.display = 'none';
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
