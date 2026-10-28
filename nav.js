(function () {
function closeAllGroups() {
document.querySelectorAll('.nav-group.open').forEach(function (g) {
g.classList.remove('open');
var b = g.querySelector('.nav-group-btn');
if (b) b.setAttribute('aria-expanded', 'false');
});
}
function toggleGroup(e, btn) {
e.stopPropagation();
var group = btn.parentElement;
var wasOpen = group.classList.contains('open');
closeAllGroups();
if (!wasOpen) {
group.classList.add('open');
btn.setAttribute('aria-expanded', 'true');
}
}
function toggleNav(e) {
e.stopPropagation();
var wrap = document.getElementById('navGroups');
var burger = document.getElementById('navBurger');
if (!wrap) return;
var open = wrap.classList.toggle('open');
if (burger) {
burger.setAttribute('aria-expanded', open);
burger.innerHTML = open ? '✕' : '☰';
}
if (!open) closeAllGroups();
document.body.classList.toggle('nav-open', open);
}
window.closeAllGroups = closeAllGroups;
window.toggleGroup = toggleGroup;
window.toggleNav = toggleNav;
document.addEventListener('click', function (e) {
if (!e.target.closest('.nav-group')) closeAllGroups();
if (!e.target.closest('.nav-search')) closeSearch();
});
document.addEventListener('keydown', function (e) {
if (e.key === 'Escape') {
closeAllGroups();
closeSearch();
var wrap = document.getElementById('navGroups');
var burger = document.getElementById('navBurger');
if (wrap && wrap.classList.contains('open')) {
wrap.classList.remove('open');
document.body.classList.remove('nav-open');
if (burger) {
burger.setAttribute('aria-expanded', 'false');
burger.innerHTML = '☰';
}
}
var sel = document.getElementById('langSelector');
if (sel && sel.classList.contains('open')) {
sel.classList.remove('open');
var btn = document.getElementById('langToggleBtn');
if (btn) btn.setAttribute('aria-expanded', 'false');
}
}
});
function closeSearch() {
var searchWrap = document.getElementById('navSearchWrap');
if (searchWrap) searchWrap.classList.remove('open');
}
function toggleSearch(e) {
e.stopPropagation();
var searchWrap = document.getElementById('navSearchWrap');
if (!searchWrap) return;
var isOpen = searchWrap.classList.toggle('open');
if (isOpen) {
var input = searchWrap.querySelector('.nav-search-input');
if (input) {
input.value = '';
input.focus();
filterSearchResults('');
}
}
}
function filterSearchResults(query) {
var results = document.getElementById('navSearchResults');
if (!results) return;
var items = results.querySelectorAll('.nav-search-item');
var q = query.toLowerCase().trim();
var visibleCount = 0;
items.forEach(function (item) {
var text = (item.getAttribute('data-keywords') || '') + ' ' + item.textContent;
var match = !q || text.toLowerCase().indexOf(q) !== -1;
item.style.display = match ? 'flex' : 'none';
if (match) visibleCount++;
});
var empty = results.querySelector('.nav-search-empty');
if (empty) empty.style.display = (q && visibleCount === 0) ? 'block' : 'none';
}
window.toggleSearch = toggleSearch;
window.filterSearchResults = filterSearchResults;
window.closeSearch = closeSearch;
function markActivePage() {
var path = window.location.pathname;
document.querySelectorAll('.nav-menu a').forEach(function (a) {
var href = a.getAttribute('href');
if (!href) return;
var isActive = (href === path) ||
(href === path + '/') ||
(path === href.replace(/\/$/, ''));
a.classList.toggle('nav-active', isActive);
});
}
function initBreadcrumbs() {
var container = document.getElementById('navBreadcrumb');
if (!container) return;
var path = window.location.pathname;
if (path === '/' || path === '/en/' || path === '/pt/') {
container.style.display = 'none';
return;
}
var langPrefix = '';
if (path.startsWith('/en/')) langPrefix = '/en';
else if (path.startsWith('/pt/')) langPrefix = '/pt';
var labels = {
'/estacionamientos/': { es: 'Estacionamientos', en: 'Parking', group: 'Esenciales' },
'/salud/': { es: 'Salud', en: 'Health', group: 'Esenciales' },
'/seguridad/': { es: 'Seguridad', en: 'Safety', group: 'Esenciales' },
'/servicios/': { es: 'Servicios', en: 'Services', group: 'Esenciales' },
'/gruas/': { es: 'Grúas', en: 'Towing', group: 'Esenciales' },
'/locomocion/': { es: 'Locomoción', en: 'Transport', group: 'Esenciales' },
'/alfareria/': { es: 'Alfarería', en: 'Pottery', group: 'Visitar' },
'/ruta-del-vino/': { es: 'Ruta del Vino', en: 'Wine Route', group: 'Visitar' },
'/que-ver/': { es: 'Qué ver', en: 'What to see', group: 'Visitar' },
'/plaza/': { es: 'Plaza', en: 'Town Square', group: 'Visitar' },
'/alrededores/': { es: 'Alrededores', en: 'Around', group: 'Visitar' },
'/comercio/': { es: 'Comercio', en: 'Shops', group: 'Visitar' },
'/gastronomia/': { es: 'Gastronomía', en: 'Food', group: 'Comer y dormir' },
'/alojamientos/': { es: 'Alojamientos', en: 'Lodging', group: 'Comer y dormir' },
'/juegos/': { es: 'Juegos', en: 'Games', group: 'Planifica' },
'/anunciate/': { es: 'Anúnciate', en: 'Advertise', group: 'Planifica' },
'/sugerencias/': { es: 'Sugerencias', en: 'Feedback', group: 'Planifica' },
'/apoyar/': { es: 'Apoyar', en: 'Support', group: '' },
'/admin/': { es: 'Comerciantes', en: 'Merchants', group: '' },
'/mapa-turistico/': { es: 'Mapa Turístico', en: 'Tourist Map', group: 'Planifica' },
'/links/': { es: 'Enlaces', en: 'Links', group: '' },
'/elchanchoalcanciamasgrandedelmundo/': { es: 'El Chancho Alcancía', en: 'Giant Piggy Bank', group: 'Visitar' }
};
var cleanPath = path.replace(langPrefix, '');
var info = labels[cleanPath];
if (!info) {
container.style.display = 'none';
return;
}
var lang = langPrefix === '/en' ? 'en' : 'es';
var homeLabel = lang === 'en' ? 'Home' : 'Inicio';
var homeHref = langPrefix ? langPrefix + '/' : '/';
var html = '<a href="' + homeHref + '">' + homeLabel + '</a>';
if (info.group) {
html += ' <span class="bc-sep">›</span> <span class="bc-group">' + info.group + '</span>';
}
html += ' <span class="bc-sep">›</span> <span class="bc-current">' + info[lang] + '</span>';
container.innerHTML = html;
container.style.display = 'flex';
}
function init() {
function closeMobileNav() {
closeAllGroups();
var wrap = document.getElementById('navGroups');
var burger = document.getElementById('navBurger');
if (wrap && wrap.classList.contains('open')) {
wrap.classList.remove('open');
document.body.classList.remove('nav-open');
if (burger) {
burger.setAttribute('aria-expanded', 'false');
burger.innerHTML = '☰';
}
}
}
document.querySelectorAll('.nav-menu a, .nav-cta, .nav-map-btn').forEach(function (a) {
a.addEventListener('click', closeMobileNav);
});
var lastY = window.scrollY;
window.addEventListener('scroll', function () {
var wrap = document.getElementById('navGroups');
if (wrap && wrap.classList.contains('open') && Math.abs(window.scrollY - lastY) > 10) {
closeMobileNav();
}
lastY = window.scrollY;
}, { passive: true });
markActivePage();
initBreadcrumbs();
var searchInput = document.querySelector('.nav-search-input');
if (searchInput) {
searchInput.addEventListener('input', function () {
filterSearchResults(this.value);
});
searchInput.addEventListener('keydown', function (e) {
if (e.key === 'Enter') {
e.preventDefault();
var q = searchInput.value.trim();
if (q.length >= 2) {
window.open('https://app.pomaire360.cl/negocios?q=' + encodeURIComponent(q), '_blank');
closeSearch();
return;
}
var results = document.getElementById('navSearchResults');
if (results) {
var first = results.querySelector('.nav-search-item[style="display: flex"], .nav-search-item:not([style*="none"])');
if (!first) first = results.querySelector('.nav-search-item');
if (first && first.style.display !== 'none') {
first.click();
}
}
}
});
}
}
if (document.readyState === 'loading') {
document.addEventListener('DOMContentLoaded', init);
} else {
init();
}
})();
(function () {
var STORE_KEY = 'p360_games_float';
var REVISIT_DAYS = 7;
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
var wrap = document.getElementById('gamesFloatWrap');
if (!wrap) return;
if (isDismissed()) { wrap.remove(); return; }
var closeBtn = wrap.querySelector('.games-float-close');
if (closeBtn) {
closeBtn.addEventListener('click', function (e) {
e.preventDefault();
e.stopPropagation();
try { localStorage.setItem(STORE_KEY, String(Date.now())); } catch (err) {}
if (wrap && wrap.parentNode) wrap.remove();
});
}
}
// Menú FAB agrupado (móvil): un botón "+" despliega/colapsa los accesos
// secundarios para no tapar el contenido en pantallas pequeñas.
function initFabToggle() {
var fab = document.getElementById('socialFab');
var toggle = document.getElementById('fabToggle');
if (!fab || !toggle) return;
toggle.addEventListener('click', function (e) {
e.preventDefault();
e.stopPropagation();
var open = fab.classList.toggle('fab-open');
toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
toggle.setAttribute('aria-label', open ? 'Ocultar accesos directos' : 'Mostrar accesos directos');
});
// Cerrar al tocar fuera del grupo de botones.
document.addEventListener('click', function (e) {
if (fab.classList.contains('fab-open') && !fab.contains(e.target)) {
fab.classList.remove('fab-open');
toggle.setAttribute('aria-expanded', 'false');
toggle.setAttribute('aria-label', 'Mostrar accesos directos');
}
});
}
function initAll() { init(); initFabToggle(); }
if (document.readyState === 'loading') {
document.addEventListener('DOMContentLoaded', initAll);
} else {
initAll();
}
})();
(function () {
function initHeroSlideshow() {
var slides = document.querySelectorAll('.hero-slideshow .hero-slide');
if (slides.length < 2) return;
var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduceMotion) return;
setTimeout(function() {
slides.forEach(function(slide) {
var bg = slide.getAttribute('data-bg');
if (bg && !slide.style.backgroundImage) {
slide.style.backgroundImage = 'url(' + bg + ')';
}
});
}, 1500);
var current = 0;
setInterval(function () {
slides[current].classList.remove('is-active');
current = (current + 1) % slides.length;
var bg = slides[current].getAttribute('data-bg');
if (bg && !slides[current].style.backgroundImage) {
slides[current].style.backgroundImage = 'url(' + bg + ')';
}
slides[current].classList.add('is-active');
}, 5000);
}
if (document.readyState === 'loading') {
document.addEventListener('DOMContentLoaded', initHeroSlideshow);
} else {
initHeroSlideshow();
}
})();
(function () {
// Etiqueta del acceso a comerciantes por idioma (7 idiomas del selector).
// Se actualiza también cuando el switcher dinámico (fr/ru/zh) cambia <html lang>.
var ADMIN_I18N = {
es: { t: 'Comerciantes', title: 'Acceso al panel de comerciantes' },
en: { t: 'Merchants', title: 'Merchant dashboard access' },
pt: { t: 'Comerciantes', title: 'Acesso ao painel de comerciantes' },
ja: { t: '事業者向け', title: '事業者向けパネルへのアクセス' },
fr: { t: 'Commerçants', title: 'Accès au tableau de bord des commerçants' },
ru: { t: 'Бизнесу', title: 'Панель для предпринимателей' },
zh: { t: '商家入口', title: '商家后台入口' }
};
function adminLabel() {
var l = (document.documentElement.lang || 'es').slice(0, 2).toLowerCase();
return ADMIN_I18N[l] || ADMIN_I18N.es;
}
function applyAdminLabel(link) {
var d = adminLabel();
var span = link.querySelector('span');
if (span) span.textContent = d.t;
link.title = d.title;
}
function injectAdminLink() {
var navWrap = document.getElementById('navGroups');
if (!navWrap) return;
if (navWrap.querySelector('.nav-admin-btn')) return;
if (window.location.pathname.indexOf('/admin') === 0) return;
var link = document.createElement('a');
link.className = 'nav-admin-btn';
link.href = '/admin/';
link.innerHTML = '\uD83D\uDD10 <span></span>';
applyAdminLabel(link);
var cta = navWrap.querySelector('.nav-cta');
if (cta && cta.nextSibling) {
navWrap.insertBefore(link, cta.nextSibling);
} else {
navWrap.appendChild(link);
}
new MutationObserver(function () { applyAdminLabel(link); })
.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
}
if (document.readyState === 'loading') {
document.addEventListener('DOMContentLoaded', injectAdminLink);
} else {
injectAdminLink();
}
})();

(function () {
// Descripciones del menú desplegable por idioma. La clave es el texto base en
// español (tal como está en el HTML). Se re-aplica si el switcher dinámico
// (fr/ru/zh) cambia <html lang>.
var MENU_DESC_I18N = {
"Dónde dejar tu auto": {
"en": "Where to park your car",
"pt": "Onde deixar o carro",
"ja": "車の停め場所",
"fr": "Où garer votre voiture",
"ru": "Где оставить машину",
"zh": "停车位置"
},
"CESFAM, farmacias y urgencias": {
"en": "CESFAM clinic, pharmacies and emergencies",
"pt": "CESFAM, farmácias e urgências",
"ja": "CESFAM（地域保健センター）・薬局・救急",
"fr": "CESFAM, pharmacies et urgences",
"ru": "CESFAM, аптеки и неотложная помощь",
"zh": "社区医疗中心、药店和急诊"
},
"Carabineros, Bomberos, emergencias": {
"en": "Police, firefighters, emergencies",
"pt": "Carabineros, bombeiros, emergências",
"ja": "警察（カラビネーロス）・消防・緊急時",
"fr": "Carabineros, pompiers, urgences",
"ru": "Карабинеры, пожарные, экстренные службы",
"zh": "警察、消防、紧急服务"
},
"Almacenes y servicios cotidianos": {
"en": "Grocery stores and everyday services",
"pt": "Mercearias e serviços do dia a dia",
"ja": "食料品店と日常のサービス",
"fr": "Épiceries et services du quotidien",
"ru": "Магазины и повседневные услуги",
"zh": "杂货店和日常服务"
},
"Grúas, buses, micros y colectivos": {
"en": "Tow trucks, buses and shared taxis",
"pt": "Guinchos, ônibus, micros e lotações",
"ja": "レッカー・バス・ミニバス・乗り合いタクシー",
"fr": "Dépanneuses, bus et taxis collectifs",
"ru": "Эвакуаторы, автобусы и маршрутки",
"zh": "拖车、巴士和合乘出租车"
},
"Talleres y tradición alfarera": {
"en": "Workshops and pottery tradition",
"pt": "Oficinas e tradição ceramista",
"ja": "陶工の工房と伝統",
"fr": "Ateliers et tradition potière",
"ru": "Мастерские и гончарная традиция",
"zh": "陶艺工坊与传统"
},
"Atractivos y puntos de interés": {
"en": "Attractions and points of interest",
"pt": "Atrações e pontos de interesse",
"ja": "見どころと観光スポット",
"fr": "Attractions et points d’intérêt",
"ru": "Достопримечательности",
"zh": "景点与兴趣点"
},
"Viñas y bodegas cercanas": {
"en": "Nearby vineyards and wineries",
"pt": "Vinícolas e adegas próximas",
"ja": "近郊のワイナリー",
"fr": "Vignobles et caves à proximité",
"ru": "Ближайшие виноградники и винодельни",
"zh": "附近的葡萄园和酒庄"
},
"Tiendas y souvenirs": {
"en": "Shops and souvenirs",
"pt": "Lojas e souvenirs",
"ja": "お店とお土産",
"fr": "Boutiques et souvenirs",
"ru": "Магазины и сувениры",
"zh": "商店与纪念品"
},
"Los Chiñihues y alrededores": {
"en": "Los Chiñihues and surroundings",
"pt": "Los Chiñihues e arredores",
"ja": "チニュエスと周辺",
"fr": "Los Chiñihues et alentours",
"ru": "Лос-Чиньигуэс и окрестности",
"zh": "Los Chiñihues 及周边"
},
"Corazón del pueblo": {
"en": "The heart of the village",
"pt": "Coração do povoado",
"ja": "村の中心",
"fr": "Le cœur du village",
"ru": "Сердце деревни",
"zh": "村庄的中心"
},
"Origen, arqueología y leyendas": {
"en": "Origins, archaeology and legends",
"pt": "Origem, arqueologia e lendas",
"ja": "起源・考古学・伝説",
"fr": "Origines, archéologie et légendes",
"ru": "Истоки, археология и легенды",
"zh": "起源、考古与传说"
},
"Historias de nuestros artesanos": {
"en": "Stories of our artisans",
"pt": "Histórias dos nossos artesãos",
"ja": "職人たちの物語",
"fr": "Histoires de nos artisans",
"ru": "Истории наших мастеров",
"zh": "工匠的故事"
},
"Restaurantes y cocina típica": {
"en": "Restaurants and traditional cuisine",
"pt": "Restaurantes e cozinha típica",
"ja": "レストランと郷土料理",
"fr": "Restaurants et cuisine typique",
"ru": "Рестораны и традиционная кухня",
"zh": "餐厅与特色美食"
},
"Hostales, cabañas y suites": {
"en": "Hostels, cabins and suites",
"pt": "Hostels, cabanas e suítes",
"ja": "ホステル・コテージ・スイート",
"fr": "Auberges, cabanes et suites",
"ru": "Хостелы, домики и сьюты",
"zh": "旅舍、木屋和套房"
},
"Baños públicos disponibles": {
"en": "Public restrooms available",
"pt": "Banheiros públicos disponíveis",
"ja": "利用できる公衆トイレ",
"fr": "Toilettes publiques disponibles",
"ru": "Доступные общественные туалеты",
"zh": "可用的公共卫生间"
},
"Ruta turística paso a paso": {
"en": "Tourist route step by step",
"pt": "Roteiro turístico passo a passo",
"ja": "ステップで巡る観光ルート",
"fr": "Itinéraire touristique pas à pas",
"ru": "Туристический маршрут шаг за шагом",
"zh": "分步旅游路线"
},
"Mapa interactivo del pueblo": {
"en": "Interactive map of the village",
"pt": "Mapa interativo do povoado",
"ja": "村のインタラクティブマップ",
"fr": "Carte interactive du village",
"ru": "Интерактивная карта деревни",
"zh": "村庄互动地图"
},
"Condiciones actuales": {
"en": "Current conditions",
"pt": "Condições atuais",
"ja": "現在の天気",
"fr": "Conditions actuelles",
"ru": "Текущие условия",
"zh": "当前天气"
},
"Fotos del pueblo": {
"en": "Photos of the village",
"pt": "Fotos do povoado",
"ja": "村の写真",
"fr": "Photos du village",
"ru": "Фотографии деревни",
"zh": "村庄照片"
},
"Fechas y festividades": {
"en": "Dates and festivities",
"pt": "Datas e festividades",
"ja": "開催日とお祭り",
"fr": "Dates et festivités",
"ru": "Даты и праздники",
"zh": "日期与节庆"
},
"Plano ilustrado del pueblo": {
"en": "Illustrated map of the village",
"pt": "Mapa ilustrado do povoado",
"ja": "村のイラストマップ",
"fr": "Plan illustré du village",
"ru": "Иллюстрированный план деревни",
"zh": "村庄插图地图"
}
};
function applyMenuDescs() {
var l = (document.documentElement.lang || 'es').slice(0, 2).toLowerCase();
var nodes = document.querySelectorAll('.nav-menu-desc');
for (var i = 0; i < nodes.length; i++) {
var el = nodes[i];
if (!el.hasAttribute('data-es')) el.setAttribute('data-es', el.textContent);
var es = el.getAttribute('data-es');
var t = (l !== 'es' && MENU_DESC_I18N[es] && MENU_DESC_I18N[es][l]) || es;
if (el.textContent !== t) el.textContent = t;
}
}
function initMenuDescs() {
applyMenuDescs();
new MutationObserver(applyMenuDescs).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
}
if (document.readyState === 'loading') {
document.addEventListener('DOMContentLoaded', initMenuDescs);
} else {
initMenuDescs();
}
})();
