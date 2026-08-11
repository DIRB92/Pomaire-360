(function(){
var WINTER_RANGES = [
{ start: '2026-07-06', end: '2026-07-19' }
];
window.POMAIRE_WINTER_RANGES = WINTER_RANGES;
function ymd(d){
return d.getFullYear() + '-' +
String(d.getMonth() + 1).padStart(2, '0') + '-' +
String(d.getDate()).padStart(2, '0');
}
function inRanges(ranges, date){
var today = ymd(date || new Date());
return ranges.some(function(r){ return today >= r.start && today <= r.end; });
}
window.isPomaireWinter = function(date){ return inRanges(WINTER_RANGES, date); };
function applyWinterBanners(){
var w = window.isPomaireWinter();
document.querySelectorAll('[data-winter]').forEach(function(el){
el.style.display = w ? '' : 'none';
});
var p = window.isPomaireWinter();
document.querySelectorAll('[data-winter-promo]').forEach(function(el){
el.style.display = p ? '' : 'none';
});
}
window.applyWinterBanners = applyWinterBanners;
if (document.readyState === 'loading') {
document.addEventListener('DOMContentLoaded', applyWinterBanners);
} else {
applyWinterBanners();
}
})();