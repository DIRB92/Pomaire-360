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
/**
 * Sanitiza HTML de traducciones: solo permite tags seguros (span, strong, em, br, a con href https/mailto).
 * Elimina cualquier tag peligroso (script, iframe, object, embed, svg, etc.) y atributos de eventos (on*).
 */
function sanitizeTranslationHTML(html) {
if (!html || typeof html !== 'string') return '';
// Eliminar tags peligrosos y su contenido
html = html.replace(/<\s*(script|iframe|object|embed|svg|link|style|form|input|textarea|button|meta|base)[^>]*>[\s\S]*?<\/\s*\1\s*>/gi, '');
html = html.replace(/<\s*(script|iframe|object|embed|svg|link|style|form|input|textarea|button|meta|base)[^>]*\/?>/gi, '');
// Eliminar atributos de eventos (onclick, onerror, onload, etc.)
html = html.replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '');
// Eliminar javascript: y data: en atributos href/src
html = html.replace(/(href|src|action)\s*=\s*(?:"(?:javascript|data|vbscript):[^"]*"|'(?:javascript|data|vbscript):[^']*')/gi, '');
return html;
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
if (v !== undefined) el.innerHTML = sanitizeTranslationHTML(v);
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
/* ═══════════════════════════════════════════════════════════════════════════
 * DIRECTORY legacy eliminado por seguridad (PII: teléfonos personales).
 * Los datos se cargan dinámicamente desde Supabase vía directory-loader.js.
 * Este objeto vacío se mantiene como fallback de compatibilidad para evitar
 * errores en funciones que aún referencian DIRECTORY.categories.
 * ═══════════════════════════════════════════════════════════════════════════ */
const DIRECTORY = {
restaurants: [],
talleres: [],
demos: [],
jardin: [],
alojamientos: [],
interes: [],
servicios: [],
artesanos: [],
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