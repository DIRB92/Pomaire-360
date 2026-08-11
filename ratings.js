(function () {
var SUPABASE_URL = 'https://uuskvqtbsvtfsocvjazf.supabase.co';
var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1c2t2cXRic3Z0ZnNvdmNqYXpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2ODU4NDIsImV4cCI6MjEwMDI2MTg0Mn0.BbHI3ctSNg5msUnL9eENTNpOujQROAh6vUAZpFVcbBI';
var APP_URL = 'https://app.pomaire360.cl';
var ratingsCache = null;
var fetchPromise = null;
function fetchRatings() {
if (ratingsCache) return Promise.resolve(ratingsCache);
if (fetchPromise) return fetchPromise;
fetchPromise = fetch(SUPABASE_URL + '/rest/v1/negocios?select=nombre,rating_promedio,total_resenas,slug&activo=eq.true&total_resenas=gt.0', {
headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': 'Bearer ' + SUPABASE_ANON_KEY }
})
.then(function (res) { return res.json(); })
.then(function (data) {
ratingsCache = {};
if (Array.isArray(data)) {
data.forEach(function (n) {
ratingsCache[normalizeKey(n.nombre)] = { rating: n.rating_promedio || 0, total: n.total_resenas || 0, slug: n.slug || '' };
});
}
return ratingsCache;
})
.catch(function () { ratingsCache = {}; return ratingsCache; });
return fetchPromise;
}
function normalizeKey(str) {
if (!str) return '';
return str.toLowerCase().replace(/[áàä]/g,'a').replace(/[éèë]/g,'e').replace(/[íìï]/g,'i').replace(/[óòö]/g,'o').replace(/[úùü]/g,'u').replace(/ñ/g,'n').replace(/[^a-z0-9\s]/g,'').trim();
}
function renderStars(rating) {
var full = Math.round(rating), stars = '';
for (var i = 1; i <= 5; i++) stars += i <= full ? '★' : '☆';
return stars;
}
function injectRatings() {
fetchRatings().then(function (cache) {
if (!cache || Object.keys(cache).length === 0) return;
document.querySelectorAll('.dir-item').forEach(function (item) {
if (item.querySelector('.dir-rating')) return;
var nameEl = item.querySelector('.dir-name');
if (!nameEl) return;
var key = normalizeKey(nameEl.textContent || '');
var match = cache[key];
if (!match) {
var words = key.split(/\s+/).slice(0, 3).join(' ');
Object.keys(cache).forEach(function (k) { if (!match && k.indexOf(words) === 0) match = cache[k]; });
}
if (match && match.total > 0) {
var badge = document.createElement('a');
badge.className = 'dir-rating';
badge.href = APP_URL + '/negocios/' + (match.slug || '?q=' + encodeURIComponent(nameEl.textContent));
badge.target = '_blank';
badge.rel = 'noopener';
badge.innerHTML = '<span class="dir-rating-stars">' + renderStars(match.rating) + '</span> <span class="dir-rating-num">' + match.rating.toFixed(1) + '</span> <span class="dir-rating-count">(' + match.total + ')</span>';
nameEl.parentNode.insertBefore(badge, nameEl.nextSibling);
}
});
injectRatingsInPopups(cache);
});
}
function injectRatingsInPopups(cache) {
var mapEl = document.getElementById('leafletMap');
if (!mapEl) return;
new MutationObserver(function (mutations) {
mutations.forEach(function (m) {
m.addedNodes.forEach(function (node) {
if (node.nodeType !== 1) return;
var popup = node.querySelector ? node.querySelector('.map-popup') : null;
if (!popup) return;
if (popup.querySelector('.popup-rating-badge')) return;
var strong = popup.querySelector('strong');
if (!strong) return;
var rawName = (strong.textContent || '').replace(/^[^\w\sÀ-ÿ]+\s*/, '').trim();
var key = normalizeKey(rawName);
var match = cache[key];
if (!match) { var words = key.split(/\s+/).slice(0,3).join(' '); Object.keys(cache).forEach(function(k){ if(!match && k.indexOf(words)===0) match=cache[k]; }); }
if (match && match.total > 0) {
var badge = document.createElement('div');
badge.className = 'popup-rating-badge';
badge.innerHTML = '<span style="color:#c98a34;">' + renderStars(match.rating) + '</span> <strong>' + match.rating.toFixed(1) + '</strong> · ' + match.total + ' reseña' + (match.total !== 1 ? 's' : '');
strong.parentNode.insertBefore(badge, strong.nextSibling);
}
});
});
}).observe(mapEl, { childList: true, subtree: true });
}
if (document.readyState === 'loading') {
document.addEventListener('DOMContentLoaded', function () { setTimeout(injectRatings, 1500); });
} else {
setTimeout(injectRatings, 1500);
}
var origTranslate = window.translateContent;
window.translateContent = function (lang) { if (origTranslate) origTranslate(lang); setTimeout(injectRatings, 300); };
})();