/* ══════════════════════════════════════════════════════════════════════════
   MAPA TURÍSTICO UNIFICADO DE POMAIRE — JavaScript
   Mapa interactivo con marcadores por categoría, leyenda flotante,
   filtros, rutas sugeridas, cálculo de distancias, deep-links y popups
   enriquecidos con contacto completo.
   ════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── DATOS DE LUGARES (unificado con datos completos) ── */
  var PLACES = [
    // ── PARKING ──
    { id:'pk1', cat:'parking', icon:'🅿️', lat:-33.653240612009675, lng:-71.1484175855184, name:'Estacionamiento Entrada Pomaire', desc:'Rafael Morandé · acceso principal', addr:'Rafael Morandé, Pomaire', gmap:'https://maps.app.goo.gl/q4opxzkj7DVq5Z8U6' },
    { id:'pk2', cat:'parking', icon:'🚗', lat:-33.65027186391058, lng:-71.15430268749077, name:'Futuros Estacionamiento y baños', desc:'Guillermo Barros con Diego de Almagro', addr:'Guillermo Barros con Diego de Almagro, Pomaire' },
    { id:'pk3', cat:'parking', icon:'🚌', lat:-33.65078, lng:-71.14907, name:'Zona 18 de Septiembre', desc:'Lateral al casco principal', addr:'18 de Septiembre, Pomaire' },

    // ── HEALTH ──
    { id:'he1', cat:'health', icon:'🏥', lat:-33.6497, lng:-71.15053, name:'CESFAM Alfarera Rosa Reyes Vilches', desc:'Artesana Julita Vera 354', addr:'Julita Vera 354, Pomaire', phone:'+56225688849', hours:'8:00 a 17:00 hrs' },
    { id:'he2', cat:'health', icon:'💊', lat:-33.653491296625084, lng:-71.15118860753486, name:'Farmacia Acua-Naser Pomaire', desc:'San Antonio 362', addr:'San Antonio 362, Pomaire', gmap:'https://maps.app.goo.gl/c4QqqSLASBynLttk6' },
    // ── SECURITY ──
    { id:'se1', cat:'security', icon:'🚔', lat:-33.650798492760984, lng:-71.1512808846173, name:'Carabineros Policía', desc:'San Antonio 361', addr:'San Antonio 361, Pomaire', gmap:'https://maps.app.goo.gl/c555fkuX9t6jcMZs7' },
    { id:'se2', cat:'security', icon:'🚒', lat:-33.64977969139366, lng:-71.15086677981947, name:'Bomberos de Pomaire', desc:'San Antonio 362', addr:'San Antonio 362, Pomaire', gmap:'https://maps.app.goo.gl/MaJDFK4cwLwf9VZz5' },

    // ── SERVICES ──
    { id:'sv1', cat:'services', icon:'ℹ️', lat:-33.65033, lng:-71.15093, name:'Plaza de Pomaire · OIT', desc:'Oficina de Información Turística', addr:'Plaza de Pomaire, San Antonio 140' },
    { id:'sv2', cat:'services', icon:'⛪', lat:-33.646214708973325, lng:-71.15097954893574, name:'Iglesia de Pomaire', desc:'Templo histórico del pueblo', addr:'Iglesia de Pomaire' },
    { id:'sv3', cat:'services', icon:'🏧', lat:-33.65029994302147, lng:-71.1496768882763, name:'Cajero Automático (ATM)', desc:'Roberto Bravo 445', addr:'Roberto Bravo 445, Pomaire', gmap:'https://maps.app.goo.gl/HcGUyYo8DQq94NBj9' },
    { id:'sv4', cat:'services', icon:'🏫', lat:-33.6500313951976, lng:-71.15053295001364, name:'Colegio de Pomaire', desc:'Colegio y Jardín · Enseñanza Básica', addr:'Pomaire', gmap:'https://maps.app.goo.gl/3JLo3RHEu7yPhsMw6', ig:'colegiopomaire_' },
    { id:'sv5', cat:'services', icon:'✝️', lat:-33.6563274403623, lng:-71.15040862537278, name:'El Cristo', desc:'Roberto Bravo 1', addr:'Roberto Bravo 1, Pomaire', gmap:'https://maps.app.goo.gl/Y6MUWpDbiqaSCjUz9' },
    { id:'sv6', cat:'services', icon:'⚽', lat:-33.65447017901263, lng:-71.15242874012448, name:'Cancha de Pomaire', desc:'Cam. La Cruz, Pomaire', addr:'Cam. La Cruz, Pomaire, Melipilla' },
    { id:'sv7', cat:'services', icon:'🏛️', lat:-33.65266285604718, lng:-71.15463474076532, name:'Templo Salón del Reino', desc:'Salón del Reino de los Testigos de Jehová', addr:'Pomaire, Melipilla', gmap:'https://maps.app.goo.gl/q2WCFmKxVuEp5Ggn7' },
    { id:'sv8', cat:'services', icon:'🔧', lat:-33.656554689337824, lng:-71.15054911577195, name:'Vulcanización y Mantenimiento', desc:'Vulcanización y neumáticos', addr:'San Antonio 1, Pomaire', gmap:'https://maps.app.goo.gl/eTYRKr7PNGqomA277', wsp:'56985478591', hours:'Lun-Vie 09:00-18:00 · Sáb 10:00-13:00' },
    { id:'sv9', cat:'services', icon:'🧵', lat:-33.64808726960897, lng:-71.14915833045953, name:'Taller de costura J.E.M.E', desc:'Costura y arreglos de ropa', addr:'Gral. Baquedano 241, Pomaire', gmap:'https://maps.app.goo.gl/MeYgE8ftdphq19rt6', phone:'+56955822650', wsp:'56955822650' },

    // ── POTTERY ──
    { id:'po1', cat:'pottery', icon:'🏺', lat:-33.65119135971276, lng:-71.15284938597316, name:'Granja Educativa Alfarera', desc:'Talleres de greda · Bernardo O\'Higgins 260', addr:'Bernardo O\'Higgins 260, Pomaire', gmap:'https://maps.app.goo.gl/Vgm2CgChUHYWCSg47' },
    { id:'po2', cat:'pottery', icon:'🎨', lat:-33.65176286310916, lng:-71.15033526947308, name:'Espacio Greda', desc:'Taller de greda · Arturo Prat 352', addr:'Arturo Prat 352, Pomaire', gmap:'https://maps.app.goo.gl/KbNfbMZKQpyjkFwk8', ig:'espaciogreda.cl', fb:'https://www.facebook.com/EspacioGreda/' },
    { id:'po3', cat:'pottery', icon:'🎨', lat:-33.652051018925114, lng:-71.14908723334928, name:'Taller del Sol', desc:'Taller de greda · Arturo Prat 237 B', addr:'Arturo Prat 237, Pomaire', gmap:'https://maps.app.goo.gl/9sp8oEZ3oQpxwDwu7' },
    { id:'po4', cat:'pottery', icon:'🎨', lat:-33.65435030691243, lng:-71.15447074355414, name:'Taller Barros', desc:'Taller de greda · Guillermo Barros 150', addr:'Guillermo Barros 150, Pomaire', gmap:'https://maps.app.goo.gl/Mpo926U8kMj5Rvog6' },
    { id:'po5', cat:'pottery', icon:'🏺', lat:-33.6522, lng:-71.15, name:'Calle de los Alfareros', desc:'Roberto Bravo · talleres y tiendas', addr:'Roberto Bravo, Pomaire' },
    { id:'po6', cat:'pottery', icon:'🐷', lat:-33.652552962128134, lng:-71.1534523252861, name:'El Chancho alcancía más grande del mundo', desc:'Figura gigante de greda · Los Paltos 323', addr:'Los Paltos 323, Pomaire', gmap:'https://maps.app.goo.gl/rdCjzBBoP5XrtVuJ7', plan:'premium', page:'/elchanchoalcanciamasgrandedelmundo/', note:'❄️ Vacaciones de invierno: abierto de lunes a domingo' },
    { id:'po7', cat:'pottery', icon:'🪴', lat:-33.646642321720606, lng:-71.15017194940056, name:'Fábrica Don Petro', desc:'Maceteros y vasijas de greda', addr:'El Carmen, Pomaire', gmap:'https://maps.app.goo.gl/R2Zgnzcvm3sWY7H4A' },

    // ── FOOD ──
    { id:'fo1', cat:'food', icon:'☕', lat:-33.65460729825698, lng:-71.15001597751701, name:'Imperio Pomaire', desc:'Desayunos y cocina típica · Roberto Bravo 78', addr:'Roberto Bravo 78, Pomaire', gmap:'https://maps.app.goo.gl/muAoduKWg9frboTy7' },
    { id:'fo2', cat:'food', icon:'🥘', lat:-33.65317799731006, lng:-71.14994054878586, name:'Restaurant La Greda', desc:'Cocina criolla · 30+ años', addr:'Manuel Rodríguez 251, Pomaire', gmap:'https://maps.app.goo.gl/SsdjchMYiy3K6eZeA' },
    { id:'fo3', cat:'food', icon:'🍽️', lat:-33.655708576989326, lng:-71.15010831317134, name:'Restaurante Los Naranjos', desc:'Roberto Bravo 29', addr:'Roberto Bravo 29, Pomaire', gmap:'https://maps.app.goo.gl/r3L9McHKqche7NTV7' },
    { id:'fo4', cat:'food', icon:'🍖', lat:-33.6515220531864, lng:-71.14978770847507, name:'La Casa del Costillar', desc:'Roberto Bravo 324', addr:'Roberto Bravo 324, Pomaire', gmap:'https://maps.app.goo.gl/wK2GRAiMgSrh8XaM9' },
    { id:'fo5', cat:'food', icon:'🍽️', lat:-33.65600068412172, lng:-71.15083197607485, name:'El Boliche de Pomaire', desc:'San Antonio 17', addr:'San Antonio 17, Pomaire', gmap:'https://maps.app.goo.gl/BNSQEnYq7sKi7dQE7' },
    { id:'fo6', cat:'food', icon:'🍽️', lat:-33.65314424375147, lng:-71.15047939144097, name:'La Normita — Tenedor libre', desc:'Manuel Rodríguez 325', addr:'Manuel Rodríguez 325, Pomaire', gmap:'https://maps.app.goo.gl/7bK3t8Bw9wyV73qw6' },
    { id:'fo7', cat:'food', icon:'🍖', lat:-33.65178030571566, lng:-71.14900454933903, name:'Restaurant El Parrón', desc:'Parrilla · Arturo Prat 210', addr:'Arturo Prat 210, Pomaire', gmap:'https://maps.app.goo.gl/k5VjUyrJFg8koTB2A' },
    { id:'fo8', cat:'food', icon:'🍽️', lat:-33.654255535020724, lng:-71.1496627003142, name:'La Pica de la Mireya', desc:'Roto Chileno 249', addr:'Roto Chileno 249, Pomaire', gmap:'https://maps.app.goo.gl/NrvTa1aNHBCpd1cX8' },
    { id:'fo9', cat:'food', icon:'🍽️', lat:-33.65165080014213, lng:-71.14996004940937, name:'Restaurante La Cañada', desc:'Roberto Bravo 307', addr:'Roberto Bravo 307, Pomaire', gmap:'https://maps.app.goo.gl/FQvXzcwckKkUEpSt5' },
    { id:'fo10', cat:'food', icon:'🍬', lat:-33.651957, lng:-71.149992, name:'Dulcería Heladería Dulcepo', desc:'Dulces, postres y helados', addr:'Pomaire', gmap:'https://maps.app.goo.gl/JJJJmuB2tGdpF6tu7', ig:'dulcepo.cl', wsp:'56933925873' },
    { id:'fo11', cat:'food', icon:'🍽️', lat:-33.65435582442494, lng:-71.150266197532, name:'Restaurante San Pedro', desc:'Roto Chileno 332', addr:'Roto Chileno 332, Pomaire', gmap:'https://maps.app.goo.gl/UM7eCtd4QQAMXpwK7' },
    { id:'fo12', cat:'food', icon:'🍽️', lat:-33.667105, lng:-71.114189, name:'La Escondida', desc:'Restaurante · Pomaire', addr:'Pomaire, Melipilla', gmap:'https://maps.app.goo.gl/yUXuFcNrwCdLx2UU8' },
    { id:'fo13', cat:'food', icon:'🍽️', lat:-33.65448789758149, lng:-71.15011214056202, name:'Pomaire Restaurant', desc:'Restaurante · Pomaire', addr:'Pomaire', gmap:'https://maps.app.goo.gl/gcRuzNC98i3Nxpyv5', ig:'pomaire_restaurant' },

    // ── LODGING ──
    { id:'lo1', cat:'lodging', icon:'🛏️', lat:-33.65198924949971, lng:-71.15296875422749, name:'Hostal Pomaire', desc:'Bernardo O\'Higgins 219', addr:'Bernardo O\'Higgins 219, Pomaire', gmap:'https://maps.app.goo.gl/x98TVQ53oSQwUmNX6' },
    { id:'lo2', cat:'lodging', icon:'🏡', lat:-33.64978985059087, lng:-71.15138707552667, name:'La Quinta de la Plaza', desc:'San Antonio 410', addr:'San Antonio 410, Pomaire', gmap:'https://maps.app.goo.gl/YBcasr5ChiRt6etNA', wsp:'56999598919', web:'https://laquintadelaplaza-cl.webnode.cl/' },
    { id:'lo3', cat:'lodging', icon:'🏕️', lat:-33.64827253156989, lng:-71.15605889381351, name:'Cabañas Glamen 1', desc:'Roberto Bravo 284', addr:'Roberto Bravo 284, Pomaire', gmap:'https://maps.app.goo.gl/gAN7Hg36i716RHet9', web:'https://hostaldelcentro.cl/' },
    { id:'lo4', cat:'lodging', icon:'🏕️', lat:-33.647366520043605, lng:-71.15680309312565, name:'Cabañas Glamen 2', desc:'Cabañas · alojamiento', addr:'Pomaire', gmap:'https://maps.app.goo.gl/r3KcbQDNxX9DhY7E7', web:'https://hostaldelcentro.cl/' },
    { id:'lo5', cat:'lodging', icon:'🛏️', lat:-33.65136884009364, lng:-71.15274217075873, name:'Pomaire Lodge & Suites', desc:'Bernardo O\'Higgins 219', addr:'Bernardo O\'Higgins 219, Pomaire', gmap:'https://maps.app.goo.gl/56MaGEtivjNeZrDr8', ig:'pomairesuites' },
    // ── HIGHLIGHT ──
    { id:'hl1', cat:'highlight', icon:'🍺', lat:-33.65165740947676, lng:-71.14995842541745, name:'Cervecería Pomaire', desc:'Cerveza artesanal · Roberto Bravo 307', addr:'Roberto Bravo 307, Pomaire', gmap:'https://maps.app.goo.gl/EN1vfiMMvNPJrueU7', ig:'cerveceriapomaire_' },
    { id:'hl2', cat:'highlight', icon:'🛍️', lat:-33.65478707835062, lng:-71.15025443200825, name:'Tienda Calafate Austral', desc:'Tienda con encanto · Roberto Bravo 77B', addr:'Roberto Bravo 77, Pomaire', gmap:'https://maps.app.goo.gl/2rxHFCHtfKKTJ7wx6', ig:'calafateaustral.cl' },
    { id:'hl3', cat:'highlight', icon:'🧀', lat:-33.65192, lng:-71.1499, name:'Charcutería Don Mati', desc:'Arturo Prat 237', addr:'Arturo Prat 237, Pomaire' },
    { id:'hl4', cat:'highlight', icon:'🍦', lat:-33.651768302417416, lng:-71.14981400869864, name:'Panadería y Heladería ALSA', desc:'Roberto Bravo 1606', addr:'Roberto Bravo 1606, Pomaire', gmap:'https://maps.app.goo.gl/m6g2m7SAkA74wqGR9' },
    { id:'hl5', cat:'highlight', icon:'🏺', lat:-33.6475116, lng:-71.1503954, name:'Los Ceramistas', desc:'General Baquedano 350', addr:'General Baquedano 350, Pomaire', gmap:'https://maps.app.goo.gl/Hae5UCCkPmBnMSHPA' },
    { id:'hl6', cat:'highlight', icon:'🌿', lat:-33.653664329289256, lng:-71.15135912053388, name:'Vivero Luchín', desc:'Jardín y vivero · San Antonio 191', addr:'San Antonio 191, Pomaire', gmap:'https://maps.app.goo.gl/QXyw95D16H72fiTH9', ig:'viveroluchin' },
    // ── AROUND ──
    { id:'ar1', cat:'around', icon:'🌾', lat:-33.665, lng:-71.17, name:'Los Chiñihues', desc:'Paisaje rural, viñedos y quebradas', addr:'Los Chiñihues, Melipilla' }
  ];


  /* ── RUTAS SUGERIDAS ────────────────────────────────── */
  var ROUTES = {
    oficial: { label:'Ruta Oficial', ids:['sv1','fo1','po1','fo2','hl6'], color:'#8C3D16', icon:'🧳', meta:'5 paradas · día completo' },
    artisan: { label:'Ruta del Artesano', ids:['pk1','po5','po2','po3','po1'], color:'#B85C2C', icon:'🏺', meta:'5 paradas · ~1.5 hrs' },
    family:  { label:'Ruta Familiar', ids:['sv1','po6','po1','fo2'], color:'#4A7C59', icon:'👨‍👩‍👧', meta:'4 paradas · ~2.5 hrs' },
    food:    { label:'Ruta Gastronómica', ids:['fo3','fo1','fo4','fo2'], color:'#D4622A', icon:'🍽️', meta:'4 paradas · ~1 hr' },
    nature:  { label:'Ruta Naturaleza', ids:['sv1','hl6','ar1'], color:'#6B8E5A', icon:'🌄', meta:'3 paradas · ~3 hrs' }
  };

  /* ── CONFIGURACIÓN DE CATEGORÍAS ────────────────────── */
  var CATEGORIES = {
    pottery:   { label:'Alfarería',       color:'#B85C2C', icon:'🏺' },
    food:      { label:'Restaurantes',    color:'#D4622A', icon:'🍽️' },
    lodging:   { label:'Alojamiento',     color:'#2F7A6B', icon:'🛏️' },
    parking:   { label:'Estacionamientos',color:'#3B7DD8', icon:'🅿️' },
    health:    { label:'Salud',           color:'#E25555', icon:'🏥' },
    security:  { label:'Seguridad',       color:'#5B6ABF', icon:'🚔' },
    services:  { label:'Servicios',       color:'#7A5C40', icon:'⛪' },
    highlight: { label:'Destacados',      color:'#E6B246', icon:'⭐' },
    around:    { label:'Alrededores',     color:'#4A7C59', icon:'🌾' }
  };

  /* ── VARIABLES GLOBALES ─────────────────────────────── */
  var map, markers = {}, userMarker = null, userLatLng = null;
  var routeLine = null, activeRoute = null;
  var currentCategory = 'all';
  var currentStyle = 'streets';
  var tileLayers = { streets: null, satellite: null };


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
  function fmtDist(km) {
    if (km < 1) return Math.round(km * 1000) + ' m';
    return km.toFixed(1) + ' km';
  }
  function fmtWalkTime(km) {
    var mins = Math.round((km / 4.5) * 60);
    if (mins < 1) return '<1 min';
    if (mins < 60) return mins + ' min';
    return Math.floor(mins/60) + 'h ' + (mins%60) + 'min';
  }

  /* ── INICIALIZACIÓN ─────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    map = L.map('touristMap', {
      center: [-33.6512, -71.1505],
      zoom: 16,
      zoomControl: true,
      attributionControl: true
    });

    tileLayers.streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>',
      maxZoom: 19
    });
    tileLayers.satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: '&copy; Esri, Maxar, Earthstar',
      maxZoom: 19
    });
    tileLayers.streets.addTo(map);

    // Add markers
    PLACES.forEach(function (place) { addMarker(place); });

    // Update legend counts
    updateLegendCounts();
    // Render places list
    renderPlacesList();
    // Deep link
    openFromHash();
    window.addEventListener('hashchange', openFromHash);

    // Click on map to set user location
    map.on('click', function (e) {
      if (e.originalEvent.target.closest && e.originalEvent.target.closest('.leaflet-marker-icon')) return;
      setUserLocation(e.latlng.lat, e.latlng.lng, false);
    });
  }


  /* ── MARCADORES ─────────────────────────────────────── */
  function addMarker(place) {
    var cat = CATEGORIES[place.cat] || { color:'#888', icon:'📍' };
    var isFeatured = place.plan === 'premium' || place.plan === 'destacado';
    var size = isFeatured ? 44 : 36;
    var bg = isFeatured ? '#E6B246' : cat.color;
    var shadow = isFeatured
      ? 'box-shadow:0 0 0 3px rgba(230,178,70,.5),0 3px 10px rgba(0,0,0,.4);'
      : 'box-shadow:0 2px 8px rgba(0,0,0,.3);';

    var icon = L.divIcon({
      className: 'marker-wrapper' + (isFeatured ? ' is-featured' : ''),
      html: '<div class="marker-icon marker-' + place.cat + (isFeatured ? ' is-featured' : '') + '" style="background:' + bg + ';width:' + size + 'px;height:' + size + 'px;font-size:' + (isFeatured ? '1.2rem' : '1rem') + ';' + shadow + '">' + (place.icon || cat.icon) + '</div>',
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
      popupAnchor: [0, -(size / 2 + 4)]
    });

    var marker = L.marker([place.lat, place.lng], {
      icon: icon,
      zIndexOffset: isFeatured ? 1000 : 0
    });

    marker.bindPopup(buildPopup(place), { maxWidth: 300, closeButton: true });
    marker.addTo(map);
    marker._placeData = place;
    markers[place.id] = marker;
  }


  /* ── POPUP ENRIQUECIDO ──────────────────────────────── */
  function buildPopup(place, distKm) {
    var cat = CATEGORIES[place.cat] || { label:'', color:'#888' };
    var gmapUrl = place.gmap || 'https://maps.google.com/?q=' + place.lat + ',' + place.lng;
    var isFeatured = place.plan === 'premium' || place.plan === 'destacado';

    // Badge de plan
    var badge = isFeatured
      ? '<span class="popup-badge badge-' + place.plan + '">' + (place.plan === 'premium' ? '💎' : '⭐') + ' ' + (place.plan === 'premium' ? 'Premium' : 'Destacado') + '</span>'
      : '';

    // Distancia
    var distHtml = (distKm !== undefined)
      ? '<div class="popup-dist">📍 ' + fmtDist(distKm) + ' · 🚶 ' + fmtWalkTime(distKm) + '</div>'
      : '';

    // Horario
    var hoursHtml = place.hours ? '<p class="popup-hours">🕒 ' + place.hours + '</p>' : '';

    // Nota especial
    var noteHtml = place.note ? '<p class="popup-note">' + place.note + '</p>' : '';

    // Contactos
    var contacts = [];
    if (place.phone) contacts.push('<a href="tel:' + place.phone.replace(/[^+\d]/g,'') + '">📞 Llamar</a>');
    if (place.wsp) contacts.push('<a href="https://wa.me/' + place.wsp + '" target="_blank" rel="noopener">💬 WhatsApp</a>');
    if (place.ig) contacts.push('<a href="https://instagram.com/' + place.ig + '" target="_blank" rel="noopener">📷 Instagram</a>');
    if (place.web) contacts.push('<a href="' + place.web + '" target="_blank" rel="noopener">🌐 Web</a>');
    if (place.fb) contacts.push('<a href="' + place.fb + '" target="_blank" rel="noopener">📘 Facebook</a>');
    var contactHtml = contacts.length ? '<div class="popup-contacts">' + contacts.join(' · ') + '</div>' : '';

    return '<div class="popup-card">' +
      '<span class="popup-cat-badge" style="background:' + cat.color + ';">' + cat.label + '</span>' +
      badge +
      '<h4>' + (place.icon || cat.icon) + ' ' + place.name + '</h4>' +
      '<p>' + place.desc + '</p>' +
      '<p class="popup-addr">📌 ' + place.addr + '</p>' +
      hoursHtml + noteHtml + distHtml + contactHtml +
      '<div class="popup-links">' +
        '<a href="' + gmapUrl + '" target="_blank" rel="noopener">📍 Google Maps</a>' +
        (place.page ? '<a href="' + place.page + '">📄 Ver página</a>' : '') +
        '<a href="https://app.pomaire360.cl/negocios?q=' + encodeURIComponent(place.name) + '" target="_blank" rel="noopener">⭐ Reseñas</a>' +
        '<a href="#lugar=' + place.id + '" class="popup-share" onclick="copyPlaceLink(event,\'' + place.id + '\');return false;">🔗 Compartir</a>' +
      '</div>' +
      '</div>';
  }


  /* ── COPIAR ENLACE DE LUGAR ─────────────────────────── */
  window.copyPlaceLink = function (ev, id) {
    if (ev) ev.preventDefault();
    var url = location.origin + location.pathname + '#lugar=' + id;
    try { history.replaceState(null, '', '#lugar=' + id); } catch (e) {}
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(function () {
        if (ev && ev.target) ev.target.textContent = '✅ Enlace copiado';
      });
    }
  };

  /* ── UBICACIÓN DEL USUARIO ──────────────────────────── */
  function setUserLocation(lat, lng, fromGPS) {
    userLatLng = { lat: lat, lng: lng };
    if (userMarker) map.removeLayer(userMarker);
    userMarker = L.marker([lat, lng], {
      icon: L.divIcon({
        className: 'user-marker-wrap',
        html: '<div class="user-marker"></div>',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      }),
      zIndexOffset: 2000
    }).addTo(map);

    var hint = document.getElementById('mapHint');
    if (hint) {
      hint.textContent = fromGPS
        ? '✅ Usando tu ubicación GPS — distancias actualizadas'
        : '✅ Punto de partida fijado — distancias actualizadas';
    }
    updateDistances();
    renderPlacesList();
  }

  window.locateUser = function () {
    var btn = document.getElementById('locateBtn');
    if (!navigator.geolocation) {
      alert('Tu navegador no soporta geolocalización. Haz clic en el mapa para fijar un punto de partida.');
      return;
    }
    if (btn) btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="4"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg>';
    navigator.geolocation.getCurrentPosition(function (pos) {
      setUserLocation(pos.coords.latitude, pos.coords.longitude, true);
      map.setView([pos.coords.latitude, pos.coords.longitude], 16);
      if (btn) btn.title = 'Ubicación activa';
    }, function () {
      alert('No se pudo obtener tu ubicación. Haz clic en el mapa para fijar tu punto de partida.');
      if (btn) btn.title = 'Mi ubicación';
    }, { enableHighAccuracy: true, timeout: 8000 });
  };

  function updateDistances() {
    if (!userLatLng) return;
    PLACES.forEach(function (p) {
      var d = haversine(userLatLng.lat, userLatLng.lng, p.lat, p.lng);
      if (markers[p.id]) markers[p.id].setPopupContent(buildPopup(p, d));
    });
  }


  /* ── FILTROS DE CATEGORÍA ───────────────────────────── */
  window.filterCategory = function (cat) {
    currentCategory = cat;

    // Update buttons
    document.querySelectorAll('.cat-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-category') === cat);
    });

    // Show/hide markers
    Object.keys(markers).forEach(function (id) {
      var m = markers[id];
      var show = (cat === 'all') || (m._placeData.cat === cat);
      var el = m.getElement();
      if (el) el.style.display = show ? '' : 'none';
    });

    // Highlight legend
    document.querySelectorAll('.legend-item').forEach(function (item) {
      item.style.opacity = (cat === 'all' || item.getAttribute('data-category') === cat) ? '1' : '.4';
    });

    renderPlacesList();

    // Fit bounds
    if (cat !== 'all') {
      var visible = [];
      Object.keys(markers).forEach(function (id) {
        if (markers[id]._placeData.cat === cat) visible.push(markers[id]);
      });
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

  /* ── RUTAS SUGERIDAS ────────────────────────────────── */
  window.loadRoute = function (routeKey) {
    window.clearRoute(false);
    var route = ROUTES[routeKey];
    if (!route) return;

    document.querySelectorAll('.route-card').forEach(function (c) { c.classList.remove('active'); });
    var activeBtn = document.querySelector('[data-route="' + routeKey + '"]');
    if (activeBtn) activeBtn.classList.add('active');
    activeRoute = routeKey;

    var latlngs = route.ids.map(function (id) {
      var p = PLACES.find(function (x) { return x.id === id; });
      return p ? [p.lat, p.lng] : null;
    }).filter(Boolean);

    if (latlngs.length >= 2) {
      routeLine = L.polyline(latlngs, { color: route.color, weight: 4, opacity: 0.75, dashArray: '8,6' }).addTo(map);
    }

    // Highlight route markers, dim others
    Object.keys(markers).forEach(function (id) {
      var el = markers[id].getElement();
      if (el) el.style.opacity = route.ids.indexOf(id) >= 0 ? '1' : '0.25';
    });

    if (routeLine) map.fitBounds(routeLine.getBounds(), { padding: [40, 40] });
    var clearBtn = document.getElementById('routeClearBtn');
    if (clearBtn) clearBtn.style.display = 'inline-block';
  };

  window.clearRoute = function (resetUI) {
    if (resetUI === undefined) resetUI = true;
    if (routeLine) { map.removeLayer(routeLine); routeLine = null; }
    Object.keys(markers).forEach(function (id) {
      var el = markers[id].getElement();
      if (el) el.style.opacity = '1';
    });
    if (resetUI) {
      document.querySelectorAll('.route-card').forEach(function (c) { c.classList.remove('active'); });
      var clearBtn = document.getElementById('routeClearBtn');
      if (clearBtn) clearBtn.style.display = 'none';
      activeRoute = null;
    }
  };


  /* ── LISTA DE LUGARES ───────────────────────────────── */
  function renderPlacesList() {
    var grid = document.getElementById('placesGrid');
    var countEl = document.getElementById('placesCount');
    if (!grid) return;

    var filtered = currentCategory === 'all'
      ? PLACES
      : PLACES.filter(function (p) { return p.cat === currentCategory; });

    // Si hay ubicación, agregar distancia y ordenar
    var withDist = filtered.map(function (p) {
      var d = userLatLng ? haversine(userLatLng.lat, userLatLng.lng, p.lat, p.lng) : null;
      return { place: p, dist: d };
    });
    if (userLatLng) withDist.sort(function (a, b) { return a.dist - b.dist; });

    if (countEl) countEl.textContent = '(' + filtered.length + ' lugares)';

    grid.innerHTML = withDist.map(function (item) {
      var place = item.place;
      var cat = CATEGORIES[place.cat] || { color:'#888', icon:'📍' };
      var distHtml = item.dist !== null ? '<span class="place-card-dist">' + fmtDist(item.dist) + '</span>' : '';
      return '<div class="place-card" onclick="focusPlace(\'' + place.id + '\')">' +
        '<div class="place-card-icon" style="background:' + cat.color + ';">' + (place.icon || cat.icon) + '</div>' +
        '<div class="place-card-info"><h4>' + place.name + '</h4><p>' + place.desc + '</p></div>' +
        distHtml +
        '</div>';
    }).join('');
  }

  /* ── FOCUS EN UN LUGAR ──────────────────────────────── */
  window.focusPlace = function (id) {
    var marker = markers[id];
    if (!marker) return;
    // Ensure visible
    var el = marker.getElement();
    if (el) el.style.display = '';
    map.setView(marker.getLatLng(), 18, { animate: true });
    setTimeout(function () { marker.openPopup(); }, 300);
    // Scroll map into view
    var mapEl = document.getElementById('touristMap');
    if (mapEl) mapEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  /* ── DEEP LINKS ─────────────────────────────────────── */
  function openFromHash() {
    var match = location.hash.match(/^#lugar=([\w-]+)/);
    if (match) {
      setTimeout(function () { window.focusPlace(match[1]); }, 400);
    }
  }

  /* ── MAPA OFICIAL ILUSTRADO (lightbox) ──────────────── */
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

  /* ── BÚSQUEDA INSTANTÁNEA ───────────────────────────── */
  window.searchPlaces = function () {
    var input = document.getElementById('mapSearchInput');
    var resultsEl = document.getElementById('mapSearchResults');
    if (!input || !resultsEl) return;

    var query = input.value.trim().toLowerCase();
    if (query.length < 2) {
      resultsEl.innerHTML = '';
      resultsEl.classList.remove('open');
      return;
    }

    var results = PLACES.filter(function (p) {
      return p.name.toLowerCase().indexOf(query) >= 0 ||
             p.desc.toLowerCase().indexOf(query) >= 0 ||
             p.addr.toLowerCase().indexOf(query) >= 0 ||
             (CATEGORIES[p.cat] && CATEGORIES[p.cat].label.toLowerCase().indexOf(query) >= 0);
    }).slice(0, 8);

    if (results.length === 0) {
      resultsEl.innerHTML = '<div class="search-no-results">No se encontraron lugares</div>';
      resultsEl.classList.add('open');
      return;
    }

    resultsEl.innerHTML = results.map(function (p) {
      var cat = CATEGORIES[p.cat] || { color: '#888', icon: '📍' };
      var distHtml = '';
      if (userLatLng) {
        var d = haversine(userLatLng.lat, userLatLng.lng, p.lat, p.lng);
        distHtml = '<span class="search-dist">' + fmtDist(d) + '</span>';
      }
      return '<div class="search-result" onclick="window.focusPlace(\'' + p.id + '\');document.getElementById(\'mapSearchResults\').classList.remove(\'open\');">' +
        '<span class="search-icon" style="background:' + cat.color + ';">' + (p.icon || cat.icon) + '</span>' +
        '<div class="search-info"><strong>' + p.name + '</strong><span>' + p.desc + '</span></div>' +
        distHtml +
      '</div>';
    }).join('');
    resultsEl.classList.add('open');
  };

  // Cerrar resultados al hacer clic fuera
  document.addEventListener('click', function (e) {
    var searchWrap = document.getElementById('mapSearchWrap');
    var resultsEl = document.getElementById('mapSearchResults');
    if (searchWrap && resultsEl && !searchWrap.contains(e.target)) {
      resultsEl.classList.remove('open');
    }
  });

  // Limpiar búsqueda
  window.clearSearch = function () {
    var input = document.getElementById('mapSearchInput');
    var resultsEl = document.getElementById('mapSearchResults');
    if (input) input.value = '';
    if (resultsEl) { resultsEl.innerHTML = ''; resultsEl.classList.remove('open'); }
  };

  /* ── TOOLTIPS EN MARCADORES (hover) ─────────────────── */
  function addTooltips() {
    Object.keys(markers).forEach(function (id) {
      var m = markers[id];
      var p = m._placeData;
      m.bindTooltip(p.name, {
        direction: 'top',
        offset: [0, -20],
        opacity: 0.95,
        className: 'marker-tooltip'
      });
    });
  }

  /* ── STATS EN HERO ──────────────────────────────────── */
  function updateHeroStats() {
    var statsEl = document.getElementById('heroStats');
    if (!statsEl) return;
    var totalPlaces = PLACES.length;
    var totalCats = Object.keys(CATEGORIES).length;
    statsEl.innerHTML = '<span class="hero-stat">' + totalPlaces + ' lugares</span>' +
      '<span class="hero-stat-sep">·</span>' +
      '<span class="hero-stat">' + totalCats + ' categorías</span>' +
      '<span class="hero-stat-sep">·</span>' +
      '<span class="hero-stat">' + Object.keys(ROUTES).length + ' rutas</span>';
  }

  /* ── ANIMACIÓN DE ENTRADA DE MARCADORES ─────────────── */
  function animateMarkersIn() {
    var delay = 0;
    Object.keys(markers).forEach(function (id) {
      var el = markers[id].getElement();
      if (el) {
        el.style.opacity = '0';
        el.style.transform = 'scale(0.3)';
        el.style.transition = 'opacity .3s ease ' + delay + 'ms, transform .3s cubic-bezier(.34,1.56,.64,1) ' + delay + 'ms';
        setTimeout(function () {
          el.style.opacity = '1';
          el.style.transform = 'scale(1)';
        }, 50);
        delay += 15;
      }
    });
  }

  /* ── RESET ALL (reiniciar vista) ────────────────────── */
  window.resetMapView = function () {
    window.clearRoute(true);
    window.filterCategory('all');
    map.setView([-33.6512, -71.1505], 16, { animate: true });
    window.clearSearch();
  };

  /* ── OVERRIDE INIT PARA AGREGAR TOOLTIPS Y STATS ────── */
  var _origInit = init;
  init = function () {
    _origInit();
    addTooltips();
    updateHeroStats();
    setTimeout(animateMarkersIn, 200);
  };

})();
