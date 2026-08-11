(function() {
'use strict';
var STORAGE_KEY = 'p360_dark_mode';
var icon_sun = '\u2600\uFE0F';
var icon_moon = '\uD83C\uDF19';
var THEME_LIGHT = '#D4654A';
var THEME_DARK = '#1A1614';
var transitionTimeout = null;
function isDark() {
var stored = null;
try { stored = localStorage.getItem(STORAGE_KEY); } catch(e) {}
if (stored === 'dark') return true;
if (stored === 'light') return false;
return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}
function updateMetaThemeColor(dark) {
var meta = document.querySelector('meta[name="theme-color"]');
if (meta) {
meta.setAttribute('content', dark ? THEME_DARK : THEME_LIGHT);
}
}
function enableTransitions() {
document.documentElement.classList.add('dark-mode-transition');
if (transitionTimeout) clearTimeout(transitionTimeout);
transitionTimeout = setTimeout(function() {
document.documentElement.classList.remove('dark-mode-transition');
}, 400);
}
function applyTheme(dark, animate) {
if (animate) enableTransitions();
document.documentElement.classList.toggle('dark-mode', dark);
try { localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light'); } catch(e) {}
updateMetaThemeColor(dark);
var btn = document.getElementById('darkModeBtn');
if (btn) {
btn.textContent = dark ? icon_sun : icon_moon;
btn.setAttribute('aria-label', dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
btn.setAttribute('title', dark ? 'Modo claro' : 'Modo oscuro');
}
}
function init() {
var dark = isDark();
document.documentElement.classList.toggle('dark-mode', dark);
updateMetaThemeColor(dark);
var btn = document.createElement('button');
btn.id = 'darkModeBtn';
btn.type = 'button';
btn.textContent = dark ? icon_sun : icon_moon;
btn.setAttribute('aria-label', dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
btn.setAttribute('title', dark ? 'Modo claro' : 'Modo oscuro');
btn.addEventListener('click', function(e) {
e.stopPropagation();
var nowDark = !document.documentElement.classList.contains('dark-mode');
applyTheme(nowDark, true);
});
document.body.appendChild(btn);
if (window.matchMedia) {
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
var stored = null;
try { stored = localStorage.getItem(STORAGE_KEY); } catch(err) {}
if (!stored) {
applyTheme(e.matches, true);
}
});
}
}
if (isDark()) {
document.documentElement.classList.add('dark-mode');
} else {
document.documentElement.classList.remove('dark-mode');
}
if (document.readyState === 'loading') {
document.addEventListener('DOMContentLoaded', init);
} else {
init();
}
})();