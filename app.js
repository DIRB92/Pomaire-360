const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
entries.forEach(e => {
if (e.isIntersecting) {
e.target.classList.add('visible');
observer.unobserve(e.target);
}
});
}, { threshold: 0.1 });
reveals.forEach(el => observer.observe(el));
function escapeHTML(str) {
if (!str) return '';
if (typeof str !== 'string') return String(str);
return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
function sanitizeURL(url) {
if (!url) return '';
url = String(url).trim();
if (/^(https?:\/\/|tel:|mailto:)/i.test(url)) return url;
if (/^\/[^\/]/.test(url)) return url;
if (/^[a-z]+:/i.test(url)) return '';
return url;
}
const KEYS = {
'[data-t="nav_park"]': t => t.nav_park,
'[data-t="nav_health"]': t => t.nav_health,
'[data-t="nav_security"]': t => t.nav_security,
'[data-t="nav_commerce"]': t => t.nav_commerce,
'[data-t="nav_pottery"]': t => t.nav_pottery,
'[data-t="nav_food"]': t => t.nav_food,
'[data-t="nav_around"]': t => t.nav_around,
'[data-t="nav_plaza"]': t => t.nav_plaza,
'[data-t="nav_map"]': t => t.nav_map,
'[data-t="nav_donate"]': t => t.nav_donate,
'[data-t="nav_tagline"]': t => t.nav_tagline,
'[data-t="hero_tag"]': t => t.hero_tag,
'[data-t="hero_h1"]': t => t.hero_h1,
'[data-t="hero_sub"]': t => t.hero_sub,
'[data-t="emer_police"]': t => t.emer_police,
'[data-t="emer_samu"]': t => t.emer_samu,
'[data-t="emer_fire"]': t => t.emer_fire,
'[data-t="emer_peace"]': t => t.emer_peace,
'[data-t="s_park_title"]': t => t.s_park_title,
'[data-t="s_park_sub"]': t => t.s_park_sub,
'[data-t="s_health_title"]':t => t.s_health_title,
'[data-t="s_health_sub"]': t => t.s_health_sub,
'[data-t="s_sec_title"]': t => t.s_sec_title,
'[data-t="s_sec_sub"]': t => t.s_sec_sub,
'[data-t="s_com_title"]': t => t.s_com_title,
'[data-t="s_com_sub"]': t => t.s_com_sub,
'[data-t="s_pot_title"]': t => t.s_pot_title,
'[data-t="s_pot_sub"]': t => t.s_pot_sub,
'[data-t="s_gas_title"]': t => t.s_gas_title,
'[data-t="s_gas_sub"]': t => t.s_gas_sub,
'[data-t="s_aro_title"]': t => t.s_aro_title,
'[data-t="s_aro_sub"]': t => t.s_aro_sub,
'[data-t="s_pla_title"]': t => t.s_pla_title,
'[data-t="s_pla_sub"]': t => t.s_pla_sub,
'[data-t="s_map_title"]': t => t.s_map_title,
'[data-t="s_map_sub"]': t => t.s_map_sub,
'[data-t="s_don_title"]': t => t.s_don_title,
'[data-t="s_don_sub"]': t => t.s_don_sub,
'[data-t="donate_text"]': t => t.donate_text,
'[data-t="donate_btn"]': t => t.donate_btn,
'[data-t="donate_note"]': t => t.donate_note,
'[data-t="emer_numbers"]': t => t.emer_numbers,
'[data-t="footer_tagline"]':t => t.footer_tagline,
'[data-t="footer_emer"]': t => t.footer_emer,
'[data-t="footer_disc"]': t => t.footer_disc,
'[data-t="footer_date"]': t => t.footer_date,
'[data-t="nav_weather"]': t => t.nav_weather,
'[data-t="nav_tour"]': t => t.nav_tour,
'[data-t="nav_gallery"]': t => t.nav_gallery,
'[data-t="nav_events"]': t => t.nav_events,
'[data-t="s_weather_title"]': t => t.s_weather_title,
'[data-t="s_weather_sub"]': t => t.s_weather_sub,
'[data-t="weather_note"]': t => t.weather_note,
'[data-t="s_tour_title"]': t => t.s_tour_title,
'[data-t="s_tour_sub"]': t => t.s_tour_sub,
'[data-t="tour_1_title"]': t => t.tour_1_title, '[data-t="tour_1_desc"]': t => t.tour_1_desc,
'[data-t="tour_2_title"]': t => t.tour_2_title, '[data-t="tour_2_desc"]': t => t.tour_2_desc,
'[data-t="tour_3_title"]': t => t.tour_3_title, '[data-t="tour_3_desc"]': t => t.tour_3_desc,
'[data-t="tour_4_title"]': t => t.tour_4_title, '[data-t="tour_4_desc"]': t => t.tour_4_desc,
'[data-t="tour_5_title"]': t => t.tour_5_title, '[data-t="tour_5_desc"]': t => t.tour_5_desc,
'[data-t="tour_6_title"]': t => t.tour_6_title, '[data-t="tour_6_desc"]': t => t.tour_6_desc,
'[data-t="tour_7_title"]': t => t.tour_7_title, '[data-t="tour_7_desc"]': t => t.tour_7_desc,
'[data-t="s_gallery_title"]': t => t.s_gallery_title,
'[data-t="s_gallery_sub"]': t => t.s_gallery_sub,
'[data-t="gallery_note"]': t => t.gallery_note,
'[data-t="s_events_title"]': t => t.s_events_title,
'[data-t="s_events_sub"]': t => t.s_events_sub,
'[data-t="ev_1_title"]': t => t.ev_1_title, '[data-t="ev_1_desc"]': t => t.ev_1_desc,
'[data-t="ev_2_title"]': t => t.ev_2_title, '[data-t="ev_2_desc"]': t => t.ev_2_desc,
'[data-t="ev_3_title"]': t => t.ev_3_title, '[data-t="ev_3_desc"]': t => t.ev_3_desc,
'[data-t="ev_4_title"]': t => t.ev_4_title, '[data-t="ev_4_desc"]': t => t.ev_4_desc,
'[data-t="ev_tag_busy"]': t => t.ev_tag_busy, '[data-t="ev_tag_fest"]': t => t.ev_tag_fest,
'[data-t="ev_tag_nat"]': t => t.ev_tag_nat, '[data-t="ev_tag_xmas"]': t => t.ev_tag_xmas,
'[data-t="filter_all"]': t => t.filter_all,
'[data-t="filter_parking"]': t => t.filter_parking,
'[data-t="filter_health"]': t => t.filter_health,
'[data-t="filter_security"]': t => t.filter_security,
'[data-t="filter_pottery"]': t => t.filter_pottery,
'[data-t="filter_food"]': t => t.filter_food,
'[data-t="filter_services"]': t => t.filter_services,
'[data-t="filter_around"]': t => t.filter_around,
'[data-t="locate_btn"]': t => t.locate_btn,
'[data-t="map_hint"]': t => t.map_hint,
'[data-t="routes_title"]': t => t.routes_title,
'[data-t="route_artisan_name"]': t => t.route_artisan_name,
'[data-t="route_artisan_meta"]': t => t.route_artisan_meta,
'[data-t="route_family_name"]': t => t.route_family_name,
'[data-t="route_family_meta"]': t => t.route_family_meta,
'[data-t="route_food_name"]': t => t.route_food_name,
'[data-t="route_food_meta"]': t => t.route_food_meta,
'[data-t="route_nature_name"]': t => t.route_nature_name,
'[data-t="route_nature_meta"]': t => t.route_nature_meta,
'[data-t="route_clear"]': t => t.route_clear,
};
function applyLang(lang) {
const t = LANGS[lang];
if (!t) return;
currentLang = lang;
document.documentElement.lang = lang;
const base = LANGS.es;
const val = (k) => (t[k] !== undefined ? t[k] : base[k]);
document.querySelectorAll('[data-t]').forEach(el => {
const v = val(el.dataset.t);
if (v !== undefined) el.innerHTML = v;
});
document.querySelectorAll('[data-ph-t]').forEach(el => {
const v = val(el.dataset.phT);
if (v !== undefined) el.setAttribute('placeholder', v);
});
document.querySelectorAll('[data-caption-t]').forEach(el => {
const v = val(el.dataset.captionT);
const span = el.querySelector('span');
if (span && v !== undefined) span.textContent = v;
});
document.querySelectorAll('.lang-option').forEach(b => {
b.classList.toggle('lang-active', b.dataset.lang === lang);
});
const labels = {
es:['🇨🇱','Español'], en:['🇬🇧','English'], pt:['🇧🇷','Português'],
fr:['🇫🇷','Français'], ru:['🇷🇺','Русский'], ja:['🇯🇵','日本語'], zh:['🇨🇳','中文']
};
if (labels[lang]) {
document.getElementById('langCurrentFlag').textContent = labels[lang][0];
document.getElementById('langCurrentName').textContent = labels[lang][1];
}
if (typeof window.translateContent === 'function') window.translateContent(lang);
if (typeof window.localizeWeather === 'function') window.localizeWeather();
if (typeof window.refreshA11y === 'function') window.refreshA11y();
const wa = document.getElementById('waShare');
if (wa) {
const msg = val('wa_share');
if (msg) wa.href = 'https://wa.me/?text=' + encodeURIComponent(msg);
const waLabel = val('wa_aria');
if (waLabel) wa.setAttribute('aria-label', waLabel);
}
try { localStorage.setItem('p360lang', lang); } catch(e){}
}
document.addEventListener('DOMContentLoaded', () => {
const htmlLang = document.documentElement.lang;
if (htmlLang && htmlLang !== 'es' && LANGS[htmlLang]) {
applyLang(htmlLang);
return;
}
if (htmlLang && htmlLang !== 'es' && !LANGS[htmlLang] && typeof window._loadFullLangs === 'function') {
window._loadFullLangs().then(function() { applyLang(htmlLang); });
return;
}
const saved = (() => { try { return localStorage.getItem('p360lang'); } catch(e){ return null; } })();
const auto = (saved && ['es','en','pt','fr','ru','ja','zh'].includes(saved)) ? saved : 'es';
if (auto !== 'es' && !LANGS[auto] && typeof window._loadFullLangs === 'function') {
window._loadFullLangs().then(function() { applyLang(auto); });
} else {
applyLang(auto);
}
});
async function loadWeather() {
const box = document.getElementById('weather-widget');
try {
const r = await fetch('https://api.open-meteo.com/v1/forecast?latitude=-33.642&longitude=-71.145&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,apparent_temperature&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=America/Santiago&forecast_days=3');
const d = await r.json();
const c = d.current;
const icons = {0:'☀️',1:'🌤️',2:'⛅',3:'☁️',45:'🌫️',48:'🌫️',51:'🌦️',53:'🌦️',55:'🌧️',61:'🌧️',63:'🌧️',65:'🌧️',71:'❄️',73:'❄️',75:'❄️',80:'🌦️',81:'🌧️',82:'⛈️',95:'⛈️',96:'⛈️',99:'⛈️'};
const descs = {0:'Cielo despejado',1:'Mayormente despejado',2:'Parcialmente nublado',3:'Nublado',45:'Niebla',48:'Niebla',51:'Llovizna leve',53:'Llovizna',55:'Llovizna intensa',61:'Lluvia leve',63:'Lluvia moderada',65:'Lluvia intensa',71:'Nieve leve',73:'Nieve',75:'Nieve intensa',80:'Chubascos',81:'Chubascos',82:'Chubascos fuertes',95:'Tormenta',96:'Tormenta',99:'Tormenta'};
const icon = icons[c.weather_code] || '🌡️';
const desc = descs[c.weather_code] || 'Variable';
let forecast = '';
if (d.daily && d.daily.time) {
const dayNames = ['dom','lun','mar','mié','jue','vie','sáb'];
let cards = '';
for (let i = 0; i < Math.min(3, d.daily.time.length); i++) {
const dt = new Date(d.daily.time[i] + 'T12:00:00');
const label = i === 0 ? 'Hoy' : dayNames[dt.getDay()];
const ic = icons[d.daily.weather_code[i]] || '🌡️';
const mx = Math.round(d.daily.temperature_2m_max[i]);
const mn = Math.round(d.daily.temperature_2m_min[i]);
cards += `<div class="wf-day"><div class="wf-name">${label}</div><div class="wf-ico">${ic}</div><div class="wf-temp"><strong>${mx}°</strong> <span>${mn}°</span></div></div>`;
}
forecast = `<div class="weather-forecast">${cards}</div>`;
}
box.innerHTML = `
<div class="weather-main">
<span class="weather-icon">${icon}</span>
<div>
<div class="weather-temp">${Math.round(c.temperature_2m)}°C</div>
<div class="weather-desc">${desc} · Sensación ${Math.round(c.apparent_temperature)}°C</div>
</div>
</div>
<div class="weather-stat"><div class="ws-val">${c.relative_humidity_2m}%</div><div class="ws-lab">Humedad</div></div>
<div class="weather-stat"><div class="ws-val">${Math.round(c.wind_speed_10m)} km/h</div><div class="ws-lab">Viento</div></div>
<div class="weather-stat"><div class="ws-val">${Math.round(c.apparent_temperature)}°C</div><div class="ws-lab">Sensación</div></div>
${forecast}
`;
const bar = document.getElementById('weather-bar');
if (bar) {
bar.querySelector('.weather-bar-inner').innerHTML =
`<span class="wb-item wb-loc">📍 Pomaire</span>` +
`<span class="wb-sep"></span>` +
`<span class="wb-item wb-now">${icon} <strong>${Math.round(c.temperature_2m)}°C</strong> <span class="wb-desc">${desc}</span></span>` +
`<span class="wb-sep"></span>` +
`<span class="wb-item">💧 ${c.relative_humidity_2m}%</span>` +
`<span class="wb-sep"></span>` +
`<span class="wb-item">💨 ${Math.round(c.wind_speed_10m)} km/h</span>` +
`<span class="wb-sep"></span>` +
`<span class="wb-item">🌡️ ${Math.round(c.apparent_temperature)}°C</span>`;
}
} catch(e) {
if (box) box.innerHTML = '<div class="weather-loading">No se pudo cargar el clima. Verifica tu conexión.</div>';
const bar = document.getElementById('weather-bar');
if (bar) bar.querySelector('.weather-bar-inner').innerHTML = '<span class="wb-loading">📍 Pomaire · clima no disponible por ahora</span>';
}
}
loadWeather();
function toggleLangMenu(e) {
e.stopPropagation();
const sel = document.getElementById('langSelector');
const btn = document.getElementById('langToggleBtn');
const isOpen = sel.classList.toggle('open');
btn.setAttribute('aria-expanded', isOpen);
}
function selectLang(lang) {
if (lang !== 'es' && (!LANGS[lang]) && typeof window._loadFullLangs === 'function') {
window._loadFullLangs().then(function() { applyLang(lang); });
} else {
applyLang(lang);
}
document.getElementById('langSelector').classList.remove('open');
document.getElementById('langToggleBtn').setAttribute('aria-expanded', 'false');
}
document.querySelectorAll('.lang-option[href]').forEach((a) => {
a.addEventListener('click', () => {
const l = a.dataset.lang;
if (l) { try { localStorage.setItem('p360lang', l); } catch (e) {} }
});
});
document.addEventListener('click', () => {
const sel = document.getElementById('langSelector');
if (sel) {
sel.classList.remove('open');
document.getElementById('langToggleBtn').setAttribute('aria-expanded','false');
}
});
/* PLACES array removed — now loaded dynamically from Supabase via map-unified.js */
/* Legacy PLACES kept as empty fallback for compatibility */
if (typeof window.PLACES === 'undefined') window.PLACES = [];
const PLACES_REMOVED = true;
const DIRECTORY = {
restaurants: [
{ n:'Imperio Pomaire', a:'Roberto Bravo 78', p:'+56 9 73421189', d:'Lunes a domingo', map:'https://maps.app.goo.gl/muAoduKWg9frboTy7' },
{ n:'Restaurant La Greda', a:'Manuel Rodríguez 251', p:'', d:'30+ años · empanada más grande del mundo', map:'https://maps.app.goo.gl/SsdjchMYiy3K6eZeA' },
{ n:'Restaurante Los Naranjos', a:'Roberto Bravo 29', p:'+56 9 45606393', d:'Miércoles a domingo', map:'https://maps.app.goo.gl/r3L9McHKqche7NTV7' },
{ n:'La Cañada', a:'Roberto Bravo 307', p:'+56 9 76768309', d:'Sábado y domingo', map:'https://maps.app.goo.gl/FQvXzcwckKkUEpSt5' },
{ n:'La Pica del Artesano', a:'Roberto Bravo 114', p:'+56 9 92812141', d:'Lunes a domingo' },
{ n:'El Boliche de Pomaire', a:'San Antonio 17', p:'+56 9 32734479', d:'Lunes a domingo · 10:00 a 18:00 hrs', map:'https://maps.app.goo.gl/BNSQEnYq7sKi7dQE7' },
{ n:'La Normita (Tenedor libre)', a:'Manuel Rodríguez 325', p:'+56 9 46609599', d:'Lunes a domingo', map:'https://maps.app.goo.gl/7bK3t8Bw9wyV73qw6' },
{ n:'Emporio Doña Tránsito', a:'San Antonio 321', p:'+56 9 54461130', d:'Sábado y domingo' },
{ n:'San Sebastián', a:'Roberto Bravo 50', p:'+56 9 90440988', d:'Lunes a domingo' },
{ n:'La Pica de la Mireya', a:'Roto Chileno 249', p:'+56 9 53387756', d:'Lunes a domingo', map:'https://maps.app.goo.gl/NrvTa1aNHBCpd1cX8' },
{ n:'El Nico', a:'Roberto Bravo 397', p:'+56 9 61629311', d:'Sábado y domingo' },
{ n:'Las Delicias de Patricia', a:'Manuel Rodríguez 321', p:'+56 9 59296110', d:'Miércoles a domingo' },
{ n:'San Antonio', a:'San Antonio 298', p:'+56 9 65707019', d:'Lunes a domingo' },
{ n:'Restaurant Chilper', a:'Camino La Cruz 454', p:'+56 9 76256505', d:'Lunes a domingo' },
{ n:'La Casa del Costillar', a:'Roberto Bravo 324', p:'+56 9 54153360', d:'Lunes a domingo', map:'https://maps.app.goo.gl/wK2GRAiMgSrh8XaM9' },
{ n:'El Rincón de las Brujas', a:'Roberto Bravo 302', p:'+56 9 35410406', d:'Lunes a domingo' },
{ n:'Quinta Los Naranjos', a:'San Antonio 279', p:'+56 9 59579197', d:'Sábado y domingo' },
{ n:'Flor y tierra', a:'Guillermo Barros 225', p:'+56 9 88291191', d:'Sábado y domingo' },
{ n:'Restaurant El Cototudo', a:'Roto Chileno 340', p:'+56 9 42419789', d:'Lunes a domingo' },
{ n:'La Coyita', a:'San Antonio 615', p:'+56 9 49772557', d:'Sábado y domingo', map:'https://maps.app.goo.gl/gRsBv17WXAjhq5mHA' },
{ n:'La Fuente de mi Tierra', a:'Roberto Bravo 49', p:'+56 9 84753494', d:'Lunes a domingo' },
{ n:'Restaurante San Pedro - Pomaire', a:'Roto Chileno 332', p:'+56 9 85285787', d:'Lunes a domingo', map:'https://maps.app.goo.gl/UM7eCtd4QQAMXpwK7' },
{ n:'El Ranchito de Amalia', a:'Manuel Rodríguez 204', p:'+56 9 91843195', d:'Lunes a domingo' },
{ n:'Los Secretos de Anita', a:'San Antonio 213', p:'+56 9 74906024', d:'Viernes a domingo' },
{ n:'Restaurant El Parrón de Pomaire', a:'Arturo Prat 210', p:'+56 9 52433979', d:'Lunes a domingo', map:'https://maps.app.goo.gl/k5VjUyrJFg8koTB2A' },
{ n:'Las Tinajas de Pomaire', a:'San Antonio 402', p:'+56 9 90177467', d:'Sábado y domingo' },
{ n:'Glamen', a:'Roberto Bravo 289', p:'+56 9 54109214', tag:'Cabañas Alojamiento', web:'https://hostaldelcentro.cl/' },
],
talleres: [
{ n:'Granja Educativa Alfarera Greda', a:'Bernardo O\'Higgins 260', p:'+56 9 98793533', ig:'granjaalfarera', map:'https://maps.app.goo.gl/Vgm2CgChUHYWCSg47' },
{ n:'Espacio Greda', a:'Arturo Prat 352', p:'+56 9 20854538', ig:'espaciogreda.cl', fb:'https://www.facebook.com/EspacioGreda/', map:'https://maps.app.goo.gl/KbNfbMZKQpyjkFwk8' },
{ n:'Taller del Sol', a:'Arturo Prat 237 B', p:'+56 9 45203264', ig:'tallerdelsol_pomaire', map:'https://maps.app.goo.gl/9sp8oEZ3oQpxwDwu7' },
{ n:'Taller Barros', a:'Guillermo Barros 150', p:'+56 9 50432417', ig:'taller.barros.pomaire', map:'https://maps.app.goo.gl/Mpo926U8kMj5Rvog6' },
],
demos: [
{ n:'Juan Pablo Muñoz', a:'Roberto Bravo 164', p:'+56 9 50821246', ig:'pablo.artesanodepomaire' },
{ n:'Pascual Gómez', a:'Arturo Prat 352', p:'+56 9 89075630' },
{ n:'Jorge Garrido', a:'Bernardo O\'Higgins 260', p:'+56 9 84144279' },
{ n:'El Pericote Artesanía', a:'Guillermo Barros 150', p:'+56 9 40869289', ig:'el.rinconcito.alfarero' },
],
jardin: [
{ n:'Vivero Luchín', a:'San Antonio 191', p:'+56 9 54095760', ig:'viveroluchin', map:'https://maps.app.goo.gl/QXyw95D16H72fiTH9' },
{ n:'Jardín Monserrat', a:'El Carmen 389', p:'+56 9 91510810' },
],
alojamientos: [
{ n:'Hostal Pomaire', a:'Bernardo O\'Higgins 219', p:'+56 9 48172678', ig:'hostalpomaire', map:'https://maps.app.goo.gl/x98TVQ53oSQwUmNX6' },
{ n:'Pomaire Lodge & Suites', a:'Bernardo O\'Higgins 219', p:'+56 9 65707019', ig:'pomairesuites', map:'https://maps.app.goo.gl/56MaGEtivjNeZrDr8' },
{ n:'La Quinta de la Plaza', a:'San Antonio 410', p:'+56 9 99598919', web:'https://laquintadelaplaza-cl.webnode.cl/', map:'https://maps.app.goo.gl/YBcasr5ChiRt6etNA' },
{ n:'Cabañas Glamen 1', a:'Roberto Bravo 284', p:'+56 9 54109214', web:'https://hostaldelcentro.cl/', map:'https://maps.app.goo.gl/gAN7Hg36i716RHet9' },
{ n:'Cabañas Glamen 2', a:'Pomaire', p:'+56 9 54109214', web:'https://hostaldelcentro.cl/', map:'https://maps.app.goo.gl/r3KcbQDNxX9DhY7E7' },
],
interes: [
{ n:'El Chancho alcancia de greda más grande del mundo', a:'Los Paltos 323', p:'+56 9 33566057', tag:'Atractivo', map:'https://maps.app.goo.gl/rdCjzBBoP5XrtVuJ7', plan:'premium', slug:'chancho-greda', page:'/elchanchoalcanciamasgrandedelmundo/', hours:'Sáb 12:00–18:00 · Dom 12:00–19:30 · Lun a Vie cerrado', desc:'El chancho-alcancía de greda más grande del mundo: un atractivo imperdible de Pomaire. Un espacio con figuras gigantes de greda, ideal para fotografiarte y conocer la tradición alfarera del pueblo en gran formato.' },
{ n:'Cervecería Pomaire', a:'Roberto Bravo 307', p:'+56 9 93979689', ig:'cerveceriapomaire_', tag:'Cerveza artesanal', map:'https://maps.app.goo.gl/EN1vfiMMvNPJrueU7' },
{ n:'Tienda Calafate Austral', a:'Roberto Bravo 77B', p:'+56 9 36572068', ig:'calafateaustral.cl', tag:'Tienda', map:'https://maps.app.goo.gl/2rxHFCHtfKKTJ7wx6' },
{ n:'La Chakana', a:'Roberto Bravo 195', p:'+56 9 91162709', tag:'Tienda' },
{ n:'Charcutería Don Mati', a:'Arturo Prat 237', p:'+56 9 65852914', ig:'charcuteriadonmati', tag:'Charcutería' },
{ n:'Los Ceramistas', a:'General Baquedano 350', p:'+56 9 22579079', tag:'Cerámica' },
{ n:'Panadería y Heladería ALSA', a:'Roberto Bravo 1606', p:'', tag:'Panadería · Heladería', map:'https://maps.app.goo.gl/m6g2m7SAkA74wqGR9' },
{ n:'Cervecería / Chanchería Don Manuel', a:'Pasaje Juana Álvarez 107', p:'+56 9 42271014', tag:'Cecinas' },
{ n:'Artesanías Miriam (mimbre)', a:'San Antonio 180, local 3', p:'+56 9 94810090', tag:'Artesanía mimbre' },
{ n:'Tejidos de Punto', a:'San Antonio 180, local 4', p:'+56 9 96711139', tag:'Tejidos' },
{ n:'Vestuaristas Pomaire', a:'Galería La Loica, Roberto Bravo 324', p:'', ig:'vestuaristas', tag:'Vestuario' },
{ n:'El Místico (masajes, reiki)', a:'Roberto Bravo 27', p:'', tag:'Bienestar' },
{ n:'La Yerberita (farmacia natural)', a:'Roberto Bravo 1606', p:'', tag:'Bienestar' },
{ n:'Paseo Jardín de los Almendros', a:'Pomaire', p:'', tag:'Paseo' },
],
servicios: [
{ n:'Oficina de Información Turística (OIT)', a:'Plaza de Pomaire', p:'+56 9 41814611', tag:'Turismo' },
{ n:'Plaza de Pomaire (punto de encuentro)', a:'San Antonio 140', p:'', tag:'9:30 a 20:30 hrs' },
{ n:'CESFAM Pomaire', a:'Artesana Julita Vera 354', p:'+56 2 2568 8849', tag:'Salud' },
{ n:'Carabineros Policia', a:'San Antonio 361', p:'133', tag:'Seguridad', map:'https://maps.app.goo.gl/c555fkuX9t6jcMZs7' },
{ n:'Bomberos', a:'San Antonio 362', p:'+56 2 29224430', tag:'Emergencia', map:'https://maps.app.goo.gl/MaJDFK4cwLwf9VZz5' },
{ n:'Farmacia Acua-Naser Pomaire', a:'San Antonio 362', p:'+56 2 29224430', tag:'Salud', map:'https://maps.app.goo.gl/c4QqqSLASBynLttk6' },
{ n:'Cajero Automático (ATM)', a:'Roberto Bravo 445', p:'', tag:'Dinero', map:'https://maps.app.goo.gl/HcGUyYo8DQq94NBj9' },
{ n:'Iglesia de Pomaire', a:'El Carmen 420', p:'', tag:'Templo' },
{ n:'Colegio de Pomaire', a:'Colegio y Jardín · Enseñanza Básica', p:'', ig:'colegiopomaire_', tag:'Educación', map:'https://maps.app.goo.gl/3JLo3RHEu7yPhsMw6' },
{ n:'El Cristo', a:'Roberto Bravo 1', p:'', tag:'Mirador', map:'https://maps.app.goo.gl/Y6MUWpDbiqaSCjUz9' },
{ n:'Futuros Estacionamiento y baños públicos', a:'Guillermo Barros con Diego de Almagro', p:'', tag:'Servicios', map:'https://www.google.com/maps/search/?api=1&query=-33.65027186391058,-71.15430268749077' },
],
artesanos: [
{ n:'Camila y Diego', a:'Roberto Bravo 29', p:'+56 9 61277310' },
{ n:'Isolina Guzmán Araya', a:'Roberto Bravo 59', p:'+56 9 87667822' },
{ n:'Cerámicas Los Gemelos', a:'Roberto Bravo 455', p:'+56 9 62759986' },
{ n:'Juana García', a:'Manuel Rodríguez 347', p:'+56 9 92174717' },
{ n:'Familia Gatica Catalán', a:'Roberto Bravo 252, Galería Catalán Local 26', p:'+56 9 82814690' },
{ n:'Isabel R. & Eduardo G.', a:'Roberto Bravo esq. 18 de Septiembre', p:'+56 9 66055530' },
{ n:'Gredas Nene La Ruca', a:'Roberto Bravo 44B', p:'+56 9 88291191' },
{ n:'Cerámicas Valentina', a:'Roberto Bravo 88-A', p:'+56 9 73887858' },
{ n:'El Larita', a:'Roberto Bravo 465', p:'+56 9 97335365' },
{ n:'Pachamama Taller', a:'Arturo Prat 338 B', p:'+56 9 54042248' },
{ n:'Eduardo Pardo Z.', a:'Roberto Bravo 272', p:'+56 9 99498024' },
{ n:'Nano Santibáñez', a:'San Antonio 39', p:'+56 9 96212055' },
{ n:'Roberto Bravo', a:'Roberto Bravo 447', p:'+56 9 77750106' },
{ n:'Aracely', a:'General Baquedano esq. San Antonio', p:'+56 9 83342757' },
{ n:'Lámparas Irarrazaval Diseños', a:'Roberto Bravo 53 A', p:'+56 9 82851797' },
{ n:'Jesús Mi Alfarero', a:'Roberto Bravo 221', p:'+56 9 97568575' },
{ n:'Cerámica El Arbolito', a:'Roberto Bravo 510', p:'+56 9 93733512' },
{ n:'Taller Edi Art', a:'General Baquedano 316', p:'+56 9 79340584' },
{ n:'Miguel Salinas Baeza', a:'Roberto Bravo 13B', p:'+56 9 94560850' },
{ n:'La Raquelita', a:'Roberto Bravo 88', p:'+56 9 95169386' },
{ n:'Taller San José', a:'Roberto Bravo 460', p:'+56 9 82117144' },
{ n:'Cerámica y Decoración Inelia', a:'Arturo Prat 338', p:'+56 9 75182329' },
{ n:'San Marcos', a:'Roberto Bravo 267', p:'+56 9 53160316' },
{ n:'Segundo Enrique Trujillo S.', a:'San Antonio 10', p:'+56 9 85669982' },
{ n:'Rosa y Marcela', a:'Roberto Bravo 414', p:'+56 9 85039992' },
{ n:'Gredas Ximena', a:'San Antonio esq. Arturo Prat', p:'+56 9 96687585' },
{ n:'Cerámica Badi', a:'Roberto Bravo 49', p:'+56 9 87584538' },
{ n:'Cerámicas Fonola', a:'Roberto Bravo 185', p:'+56 9 92467532' },
{ n:'La Palmera', a:'Roberto Bravo 502', p:'+56 9 87854529' },
{ n:'Alfarería Edison', a:'General Baquedano 312', p:'+56 9 79340584' },
{ n:'Doña Laurita', a:'Roberto Bravo 407', p:'+56 9 61651455' },
{ n:'Gredas Flores', a:'San Antonio 335', p:'+56 9 51123005' },
{ n:'Cerámicas El Cheo', a:'Roberto Bravo 56 A', p:'+56 9 91661194' },
{ n:'Cerámicas Tania', a:'Roberto Bravo 454', p:'+56 9 62577048' },
{ n:'Enrique Garrido', a:'Manuel Rodríguez 345', p:'+56 9 73165446' },
{ n:'Artesanías Bernarda Hernández', a:'Roberto Bravo 248, Galería Serruchos', p:'+56 9 90225433' },
{ n:'Robertito', a:'Roberto Bravo esq. 18 de Septiembre', p:'+56 9 46497460' },
{ n:'Fresia Castillo Romero', a:'Roberto Bravo 13A', p:'+56 9 94511658' },
{ n:'Artesanía Tradicional El Gomero', a:'Roberto Bravo 80', p:'+56 9 91606574' },
{ n:'Rosa Mora', a:'Roberto Bravo 457', p:'+56 9 95580575' },
{ n:'Octavio Fernando Silva R.', a:'Manuel Rodríguez con San Antonio', p:'+56 9 31471192' },
{ n:'Mami Inés', a:'Roberto Bravo 252, Galería Catalán Local 1', p:'+56 9 83290566' },
{ n:'Artesanía Tradicional Loza de Greda', a:'Roberto Bravo con Morandé', p:'+56 9 98781143' },
{ n:'Gredas La Mamy', a:'Roberto Bravo 44C', p:'+56 9 97225185' },
{ n:'Cerámicas Miguel Ángel', a:'Roberto Bravo 97', p:'' },
{ n:'María Elisa Salinas Aguilera', a:'Roberto Bravo 469', p:'+56 9 92320964' },
{ n:'Donde Miguel', a:'Arturo Prat 380', p:'+56 9 92682046' },
{ n:'La Poza', a:'Roberto Bravo 311', p:'+56 9 93617561' },
{ n:'Artesanía Utilitaria El Cone', a:'San Antonio 215', p:'+56 9 84730313' },
{ n:'Mi Chanchita', a:'Roberto Bravo 453', p:'+56 9 96721752' },
{ n:'Cerámicas Rosa Ester', a:'Manuel Rodríguez 15', p:'+56 9 77751558' },
{ n:'Don Francisco', a:'Roberto Bravo 56 B', p:'+56 9 68089602' },
{ n:'Taller Tierra Arte', a:'Roberto Bravo 221', p:'+56 9 77877784' },
{ n:'María', a:'El Carmen 275', p:'+56 9 89909036' },
{ n:'Oscar Alejandro Durán', a:'El Carmen 690', p:'+56 9 83527207' },
{ n:'Marisol Quiróz Abarca', a:'Lautaro 752', p:'+56 9 99745542' },
{ n:'Fábrica Roca', a:'Roberto Bravo 114', p:'+56 9 99745542' },
{ n:'Cerámicas Dami', a:'El Carmen 479', p:'+56 9 68007192' },
{ n:'Cerámica Carolina', a:'El Limonal 722', p:'+56 9 71031885' },
{ n:'Amelia Rojas Quiróz', a:'Bernardo O\'Higgins 315', p:'+56 9 78316925' },
{ n:'Rosa Rojas', a:'General Baquedano 448', p:'+56 9 77877784' },
{ n:'Cerámicas Anaís', a:'El Carmen 329', p:'+56 9 67749664' },
{ n:'Elías Veliz', a:'Rafael Morandé 480 B', p:'+56 9 90325852' },
],
};
function telHref(p) {
if (!p) return '';
const first = p.split('/')[0];
let digits = first.replace(/[^\d]/g, '');
if (digits.length <= 4) return 'tel:' + digits;
if (!digits.startsWith('56')) digits = '56' + digits;
return 'tel:+' + digits;
}
const DIR_MAP_LABEL = { es:'Mapa', en:'Map', pt:'Mapa', fr:'Carte', ru:'Карта', ja:'地図', zh:'地图' };
const DIR_TAGS = {
'Lunes a domingo':{en:'Monday to Sunday',pt:'Segunda a domingo',fr:'Lundi au dimanche',ru:'Пн–Вс',ja:'月〜日',zh:'周一至周日'},
'Lunes a domingo · 10:00 a 18:00 hrs':{en:'Monday to Sunday · 10:00 to 18:00',pt:'Segunda a domingo · 10:00 às 18:00',fr:'Lundi au dimanche · 10h00 à 18h00',ru:'Пн–Вс · 10:00–18:00',ja:'月〜日 · 10:00〜18:00',zh:'周一至周日 · 10:00至18:00'},
'Miércoles a domingo':{en:'Wednesday to Sunday',pt:'Quarta a domingo',fr:'Mercredi au dimanche',ru:'Ср–Вс',ja:'水〜日',zh:'周三至周日'},
'Sábado y domingo':{en:'Saturday and Sunday',pt:'Sábado e domingo',fr:'Samedi et dimanche',ru:'Сб и Вс',ja:'土・日',zh:'周六与周日'},
'Viernes a domingo':{en:'Friday to Sunday',pt:'Sexta a domingo',fr:'Vendredi au dimanche',ru:'Пт–Вс',ja:'金〜日',zh:'周五至周日'},
'30+ años · empanada más grande del mundo':{en:"30+ years · world's largest empanada",pt:'30+ anos · maior empanada do mundo',fr:'30+ ans · plus grande empanada du monde',ru:'30+ лет · самая большая эмпанада в мире',ja:'30年以上 · 世界最大のエンパナーダ',zh:'30多年 · 世界最大的empanada'},
'Atractivo':{en:'Attraction',pt:'Atração',fr:'Attraction',ru:'Достопримечательность',ja:'名所',zh:'景点'},
'Cerveza artesanal':{en:'Craft beer',pt:'Cerveja artesanal',fr:'Bière artisanale',ru:'Крафтовое пиво',ja:'クラフトビール',zh:'精酿啤酒'},
'Tienda':{en:'Shop',pt:'Loja',fr:'Boutique',ru:'Магазин',ja:'店',zh:'商店'},
'Charcutería':{en:'Charcuterie',pt:'Charcutaria',fr:'Charcuterie',ru:'Деликатесы',ja:'シャルキュトリ',zh:'熟食'},
'Cerámica':{en:'Ceramics',pt:'Cerâmica',fr:'Céramique',ru:'Керамика',ja:'陶器',zh:'陶瓷'},
'Heladería':{en:'Ice cream shop',pt:'Sorveteria',fr:'Glacier',ru:'Мороженое',ja:'アイスクリーム店',zh:'冰淇淋店'},
'Panadería · Heladería':{en:'Bakery · Ice cream shop',pt:'Padaria · Sorveteria',fr:'Boulangerie · Glacier',ru:'Пекарня · Мороженое',ja:'パン屋・アイスクリーム店',zh:'面包店・冰淇淋店'},
'Cecinas':{en:'Cured meats',pt:'Embutidos',fr:'Charcuterie',ru:'Мясные деликатесы',ja:'加工肉',zh:'腌肉'},
'Artesanía mimbre':{en:'Wicker crafts',pt:'Artesanato de vime',fr:'Artisanat en osier',ru:'Изделия из лозы',ja:'籐工芸',zh:'藤编工艺'},
'Tejidos':{en:'Knitwear',pt:'Tecidos',fr:'Tricots',ru:'Вязаные изделия',ja:'編み物',zh:'针织品'},
'Vestuario':{en:'Clothing',pt:'Vestuário',fr:'Vêtements',ru:'Одежда',ja:'衣料品',zh:'服饰'},
'Bienestar':{en:'Wellness',pt:'Bem-estar',fr:'Bien-être',ru:'Велнес',ja:'ウェルネス',zh:'养生'},
'Paseo':{en:'Stroll',pt:'Passeio',fr:'Promenade',ru:'Прогулка',ja:'散策',zh:'漫步'},
'Turismo':{en:'Tourism',pt:'Turismo',fr:'Tourisme',ru:'Туризм',ja:'観光',zh:'旅游'},
'9:30 a 20:30 hrs':{en:'9:30 to 20:30',pt:'9:30 às 20:30',fr:'9h30 à 20h30',ru:'9:30–20:30',ja:'9:30〜20:30',zh:'9:30至20:30'},
'Salud':{en:'Health',pt:'Saúde',fr:'Santé',ru:'Здоровье',ja:'医療',zh:'医疗'},
'Seguridad':{en:'Security',pt:'Segurança',fr:'Sécurité',ru:'Безопасность',ja:'治安',zh:'治安'},
'Emergencia':{en:'Emergency',pt:'Emergência',fr:'Urgence',ru:'Экстренная служба',ja:'緊急',zh:'急救'},
'Dinero':{en:'Money',pt:'Dinheiro',fr:'Argent',ru:'Деньги',ja:'現金',zh:'现金'},
'Templo':{en:'Temple',pt:'Templo',fr:'Temple',ru:'Храм',ja:'寺院',zh:'教堂'},
'Educación':{en:'Education',pt:'Educação',fr:'Éducation',ru:'Образование',ja:'教育',zh:'教育'},
'Mirador':{en:'Viewpoint',pt:'Mirante',fr:'Belvédère',ru:'Смотровая площадка',ja:'展望台',zh:'观景点'},
'Servicios':{en:'Services',pt:'Serviços',fr:'Services',ru:'Услуги',ja:'サービス',zh:'服务'}
};
function dirT(text) {
if (!text) return text;
if (currentLang === 'es') return text;
const entry = DIR_TAGS[text];
return (entry && entry[currentLang]) ? entry[currentLang] : text;
}
const PROFILES = {};
const PLAN_LABEL = {
destacado: { es:'Destacado', en:'Featured', pt:'Destaque', fr:'En vedette', ru:'Рекомендуем', ja:'おすすめ', zh:'推荐' },
premium: { es:'Premium', en:'Premium', pt:'Premium', fr:'Premium', ru:'Премиум', ja:'プレミアム', zh:'高级' }
};
const PROFILE_T = {
see: { es:'Ver perfil ▸', en:'View profile ▸', pt:'Ver perfil ▸', fr:'Voir le profil ▸', ru:'Профиль ▸', ja:'プロフィール ▸', zh:'查看资料 ▸' },
hours: { es:'Horario', en:'Hours', pt:'Horário', fr:'Horaires', ru:'Часы', ja:'営業時間', zh:'营业时间' }
};
function planLabel(plan) { return (PLAN_LABEL[plan] && (PLAN_LABEL[plan][currentLang] || PLAN_LABEL[plan].es)) || ''; }
function profileT(k) { return (PROFILE_T[k] && (PROFILE_T[k][currentLang] || PROFILE_T[k].es)) || ''; }
function planBadge(plan) {
if (!plan || !PLAN_LABEL[plan]) return '';
const icon = plan === 'premium' ? '💎' : '⭐';
return `<span class="dir-badge badge-${plan}">${icon} ${planLabel(plan)}</span>`;
}
function dirItemHTML(it) {
if (it.plan && it.slug) PROFILES[it.slug] = it;
const safeName = escapeHTML(it.n);
const safeAddr = escapeHTML(it.a);
const safePhone = escapeHTML(it.p);
const safeIg = escapeHTML((it.ig || '').replace(/^@/,''));
const safeWeb = sanitizeURL(it.web);
const safeFb = sanitizeURL(it.fb);
const safePage = sanitizeURL(it.page);
const safeSlug = escapeHTML(it.slug);
const safeMap = sanitizeURL(it.map);
const mapsUrl = safeMap ? safeMap : 'https://maps.google.com/?q=' + encodeURIComponent(it.a + ', Pomaire, Chile');
const rawTag = it.tag || it.d;
const tag = rawTag ? `<span class="dir-tag">${escapeHTML(dirT(rawTag))}</span>` : '';
const mapLabel = DIR_MAP_LABEL[currentLang] || DIR_MAP_LABEL.es;
let links = `<a href="${mapsUrl}" target="_blank" rel="noopener">🗺️ ${mapLabel}</a>`;
if (safePhone) links += `<a href="${telHref(it.p)}">📞 ${safePhone}</a>`;
if (safeIg) links += `<a class="ig" href="https://instagram.com/${encodeURIComponent(safeIg)}" target="_blank" rel="noopener">📷 @${safeIg}</a>`;
if (safeWeb) links += `<a href="${safeWeb}" target="_blank" rel="noopener">🌐 Web</a>`;
if (safeFb) links += `<a href="${safeFb}" target="_blank" rel="noopener">📘 Facebook</a>`;
links += `<a href="https://app.pomaire360.cl/negocios?q=${encodeURIComponent(it.n)}" target="_blank" rel="noopener" class="dir-link-app">⭐ Reseñas</a>`;
const featured = it.plan === 'destacado' || it.plan === 'premium';
let moreBtn = '';
if (safePage) {
moreBtn = `<a class="dir-more" href="${safePage}">${escapeHTML(profileT('see'))}</a>`;
} else if (featured && safeSlug) {
moreBtn = `<button class="dir-more" onclick="openProfile('${safeSlug}')">${escapeHTML(profileT('see'))}</button>`;
}
return `<div class="dir-item${featured ? ' dir-featured plan-' + escapeHTML(it.plan) : ''}">
<span class="dir-name">${safeName}</span>
${planBadge(it.plan)}
${tag}
<span class="dir-addr">📍 ${safeAddr}</span>
<div class="dir-links">${links}</div>
${moreBtn}
</div>`;
}
function renderDir(containerId, list, countId) {
const el = document.getElementById(containerId);
const rank = (it) => it.plan === 'premium' ? 0 : (it.plan === 'destacado' ? 1 : 2);
const ordered = list.map((it, i) => ({ it, i }))
.sort((a, b) => (rank(a.it) - rank(b.it)) || (a.i - b.i))
.map((x) => x.it);
if (el) el.innerHTML = ordered.map(dirItemHTML).join('');
if (countId) { const c = document.getElementById(countId); if (c) c.textContent = list.length; }
}
function openProfile(slug) {
const it = PROFILES[slug];
const modal = document.getElementById('profileModal');
const body = document.getElementById('profileBody');
if (!it || !modal || !body) return;
const safeName = escapeHTML(it.n);
const safeAddr = escapeHTML(it.a);
const safeDesc = escapeHTML(it.desc);
const safeHours = escapeHTML(it.hours);
const safePhone = escapeHTML(it.p);
const safeIg = escapeHTML((it.ig || '').replace(/^@/,''));
const safeWeb = sanitizeURL(it.web);
const safeFb = sanitizeURL(it.fb);
const safeWsp = (it.wsp || '').replace(/[^0-9]/g, '');
const safeMap = sanitizeURL(it.map);
const mapsUrl = safeMap ? safeMap : 'https://maps.google.com/?q=' + encodeURIComponent(it.a + ', Pomaire, Chile');
const mapLabel = DIR_MAP_LABEL[currentLang] || DIR_MAP_LABEL.es;
let links = `<a class="pf-link" href="${mapsUrl}" target="_blank" rel="noopener">🗺️ ${mapLabel}</a>`;
if (safePhone) links += `<a class="pf-link" href="${telHref(it.p)}">📞 ${safePhone}</a>`;
if (safeWsp) links += `<a class="pf-link" href="https://wa.me/${safeWsp}" target="_blank" rel="noopener">💬 WhatsApp</a>`;
if (safeIg) links += `<a class="pf-link" href="https://instagram.com/${encodeURIComponent(safeIg)}" target="_blank" rel="noopener">📷 Instagram</a>`;
if (safeWeb) links += `<a class="pf-link" href="${safeWeb}" target="_blank" rel="noopener">🌐 Web</a>`;
if (safeFb) links += `<a class="pf-link" href="${safeFb}" target="_blank" rel="noopener">📘 Facebook</a>`;
let gallery = '';
if (it.photos && it.photos.length) {
gallery = '<div class="pf-gallery">' + it.photos.map((u) => `<img src="${sanitizeURL(u)}" alt="${safeName}" loading="lazy">`).join('') + '</div>';
}
body.innerHTML = `
${gallery}
<div class="pf-head">${planBadge(it.plan)}<h3>${safeName}</h3></div>
${safeDesc ? `<p class="pf-desc">${safeDesc}</p>` : ''}
<div class="pf-meta">
<div>📍 ${safeAddr}</div>
${safeHours ? `<div>🕒 <strong>${escapeHTML(profileT('hours'))}:</strong> ${safeHours}</div>` : ''}
</div>
<div class="pf-links">${links}</div>
`;
modal.classList.add('open');
document.body.style.overflow = 'hidden';
}
function closeProfile() {
const modal = document.getElementById('profileModal');
if (modal) modal.classList.remove('open');
document.body.style.overflow = '';
}
window.openProfile = openProfile;
window.closeProfile = closeProfile;
function selectPlan(plan) {
if (plan === 'gratis') {
window.open('https://app.pomaire360.cl/auth/login', '_blank', 'noopener');
} else {
window.open('https://app.pomaire360.cl/planes', '_blank', 'noopener');
}
}
window.selectPlan = selectPlan;
function renderAllDirs() {
if (typeof window.directoryLoaderRefresh === 'function') {
window.directoryLoaderRefresh();
return;
}
renderDir('restaurantDir', DIRECTORY.restaurants, 'restCount');
renderDir('tallerDir', DIRECTORY.talleres, 'tallerCount');
renderDir('demoDir', DIRECTORY.demos, 'demoCount');
renderDir('artesanoDir', DIRECTORY.artesanos, 'artesanoCount');
renderDir('alojamientoDir',DIRECTORY.alojamientos);
renderDir('interesDir', DIRECTORY.interes);
renderDir('jardinDir', DIRECTORY.jardin, 'jardinCount');
renderDir('servicioDir', DIRECTORY.servicios, 'servicioCount');
}
window.translateContent = function(lang) {
if (typeof window.directoryLoaderRefresh === 'function') {
window.directoryLoaderRefresh();
} else {
renderAllDirs();
}
if (typeof window.refreshTourPicks === 'function') window.refreshTourPicks(lang);
};
document.addEventListener('DOMContentLoaded', renderAllDirs);
const FONT_STEPS = [0.9, 1, 1.15, 1.3, 1.45, 1.6];
let fontIdx = 1;
function a11yT(k){
try {
var L = (typeof LANGS !== 'undefined') ? (LANGS[currentLang] || LANGS.es) : null;
if (L && L[k] !== undefined) return L[k];
if (typeof LANGS !== 'undefined' && LANGS.es && LANGS.es[k] !== undefined) return LANGS.es[k];
} catch(e){}
return k;
}
function applyFont() {
document.documentElement.style.setProperty('--fontScale', FONT_STEPS[fontIdx]);
const pct = Math.round(FONT_STEPS[fontIdx] * 100);
const lbl = document.getElementById('a11yScaleLabel');
if (lbl) lbl.textContent = (fontIdx === 1 ? a11yT('a11y_size_normal') : a11yT('a11y_size')) + ' (' + pct + '%)';
try { localStorage.setItem('p360font', fontIdx); } catch(e){}
}
function changeFont(dir) {
fontIdx = Math.max(0, Math.min(FONT_STEPS.length - 1, fontIdx + dir));
applyFont();
}
function resetFont() { fontIdx = 1; applyFont(); }
function toggleA11y(e) {
if (e) e.stopPropagation();
const p = document.getElementById('a11yPanel');
const open = p.classList.toggle('open');
document.getElementById('a11yToggle').setAttribute('aria-expanded', open);
}
document.addEventListener('click', (e) => {
const p = document.getElementById('a11yPanel');
if (p && p.classList.contains('open') && !e.target.closest('.a11y')) p.classList.remove('open');
});
const speechOK = ('speechSynthesis' in window);
let readingMode = false;
let lastSpoken = null;
function speechLang() {
const map = { es:'es-ES', en:'en-US', pt:'pt-BR', fr:'fr-FR', ru:'ru-RU', ja:'ja-JP', zh:'zh-CN' };
return map[document.documentElement.lang] || 'es-ES';
}
function speak(text) {
if (!speechOK || !text) return;
text = text.replace(/\s+/g, ' ').trim();
if (!text) return;
window.speechSynthesis.cancel();
const u = new SpeechSynthesisUtterance(text);
u.lang = speechLang();
u.rate = 0.95;
window.speechSynthesis.speak(u);
}
function stopSpeak() {
if (speechOK) window.speechSynthesis.cancel();
if (lastSpoken) { lastSpoken.classList.remove('reading-highlight'); lastSpoken = null; }
}
function toggleReadMode() {
if (!speechOK) { alert(a11yT('a11y_no_support')); return; }
readingMode = !readingMode;
const btn = document.getElementById('readToggleBtn');
const hint = document.getElementById('a11yHint');
document.body.classList.toggle('reading-mode', readingMode);
if (readingMode) {
btn.textContent = a11yT('a11y_stop');
btn.classList.add('active');
hint.textContent = a11yT('a11y_hint_active');
speak(a11yT('a11y_voice_on'));
} else {
btn.textContent = a11yT('a11y_activate');
btn.classList.remove('active');
hint.textContent = a11yT('a11y_hint');
stopSpeak();
}
}
document.addEventListener('click', (e) => {
if (!readingMode) return;
if (e.target.closest('.a11y')) return;
const el = e.target.closest('p, h1, h2, h3, h4, li, span, a, strong, .card, .dir-item, .or-txt, .tour-content, .event-info');
if (!el) return;
const txt = el.innerText || el.textContent;
if (!txt || !txt.trim()) return;
if (lastSpoken) lastSpoken.classList.remove('reading-highlight');
el.classList.add('reading-highlight');
lastSpoken = el;
speak(txt);
}, true);
function readWholePage() {
if (!speechOK) { alert(a11yT('a11y_no_support')); return; }
const parts = [];
document.querySelectorAll('h1, section h2, section h3, section p, .card h3, .card .card-detail').forEach(el => {
if (el.offsetParent === null) return;
const t = (el.innerText || '').trim();
if (t) parts.push(t);
});
const full = parts.join('. ');
window.speechSynthesis.cancel();
const chunks = full.match(/[\s\S]{1,200}(?:\.|$)/g) || [full];
chunks.forEach(c => {
const u = new SpeechSynthesisUtterance(c.trim());
u.lang = speechLang();
u.rate = 0.95;
window.speechSynthesis.speak(u);
});
}
document.addEventListener('DOMContentLoaded', () => {
try {
const saved = parseInt(localStorage.getItem('p360font'));
if (!isNaN(saved) && saved >= 0 && saved < FONT_STEPS.length) fontIdx = saved;
} catch(e){}
applyFont();
if (!speechOK) {
const b = document.getElementById('readToggleBtn');
if (b) { b.disabled = true; b.textContent = a11yT('a11y_unavailable'); }
}
});
window.addEventListener('beforeunload', stopSpeak);
window.refreshA11y = function() {
applyFont();
const tgl = document.getElementById('a11yToggle');
if (tgl) { tgl.setAttribute('aria-label', a11yT('a11y_aria_options')); tgl.setAttribute('title', a11yT('a11y_title').replace(/^[^\wÀ-ÿ]+\s*/, '')); }
const menu = document.querySelector('.a11y-menu');
if (menu) menu.setAttribute('aria-label', a11yT('a11y_aria_options'));
const closeBtn = document.querySelector('.a11y-close');
if (closeBtn) closeBtn.setAttribute('aria-label', a11yT('a11y_aria_close'));
const btn = document.getElementById('readToggleBtn');
const hint = document.getElementById('a11yHint');
if (btn && !btn.disabled) btn.textContent = readingMode ? a11yT('a11y_stop') : a11yT('a11y_activate');
if (hint) hint.textContent = readingMode ? a11yT('a11y_hint_active') : a11yT('a11y_hint');
};
if ('serviceWorker' in navigator) {
window.addEventListener('load', function () {
navigator.serviceWorker.register('/service-worker.js').catch(function () {});
});
}
(function () {
var STORE_KEY = 'p360_pig_float';
var REVISIT_DAYS = 3;
function isDismissed() {
try {
var v = localStorage.getItem(STORE_KEY);
if (!v) return false;
var ts = parseInt(v, 10);
if (isNaN(ts)) return true;
return (Date.now() - ts) < REVISIT_DAYS * 86400000;
} catch (e) { return false; }
}
function init() {
var el = document.getElementById('floatPig');
if (!el) return;
if (isDismissed()) { el.remove(); return; }
var closeBtn = el.querySelector('.float-pig-close');
try {
var lg = document.documentElement.lang || 'es';
if (typeof LANGS !== 'undefined' && LANGS[lg] && LANGS[lg].fpb_close && closeBtn) {
closeBtn.setAttribute('aria-label', LANGS[lg].fpb_close);
}
} catch (e) {}
function setHeightVar() {
document.documentElement.style.setProperty('--pig-h', el.offsetHeight + 'px');
}
function show() {
el.hidden = false;
requestAnimationFrame(function () {
setHeightVar();
el.classList.add('is-in');
document.body.classList.add('pig-open');
});
}
function hide() {
el.classList.remove('is-in');
el.classList.add('is-out');
document.body.classList.remove('pig-open');
try { localStorage.setItem(STORE_KEY, String(Date.now())); } catch (e) {}
setTimeout(function () { if (el && el.parentNode) el.remove(); }, 380);
}
if (closeBtn) {
closeBtn.addEventListener('click', function (e) {
e.preventDefault();
e.stopPropagation();
hide();
});
}
window.addEventListener('resize', function () { if (!el.hidden) setHeightVar(); });
setTimeout(show, 1600);
}
if (document.readyState === 'loading') {
document.addEventListener('DOMContentLoaded', init);
} else {
init();
}
})();