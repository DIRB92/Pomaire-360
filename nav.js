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
if (document.readyState === 'loading') {
document.addEventListener('DOMContentLoaded', init);
} else {
init();
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
function injectAdminLink() {
var navWrap = document.getElementById('navGroups');
if (!navWrap) return;
if (navWrap.querySelector('.nav-admin-btn')) return;
if (window.location.pathname.indexOf('/admin') === 0) return;
var link = document.createElement('a');
link.className = 'nav-admin-btn';
link.href = '/admin/';
link.innerHTML = '🔐 <span data-t="nav_admin">Comerciantes</span>';
link.title = 'Acceso al panel de comerciantes';
var cta = navWrap.querySelector('.nav-cta');
if (cta && cta.nextSibling) {
navWrap.insertBefore(link, cta.nextSibling);
} else {
navWrap.appendChild(link);
}
}
if (document.readyState === 'loading') {
document.addEventListener('DOMContentLoaded', injectAdminLink);
} else {
injectAdminLink();
}
})();