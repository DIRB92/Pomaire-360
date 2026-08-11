(function () {
'use strict';
var style = document.createElement('style');
style.id = 'a11yEnhancementsCSS';
style.textContent = [
'.skip-to-content {',
' position: absolute;',
' top: -100%;',
' left: 50%;',
' transform: translateX(-50%);',
' z-index: 99999;',
' background: #2D1A0A;',
' color: #E6B246;',
' padding: .8rem 1.5rem;',
' border-radius: 0 0 8px 8px;',
' font-weight: 700;',
' font-size: .95rem;',
' text-decoration: none;',
' box-shadow: 0 4px 12px rgba(0,0,0,.3);',
' transition: top .2s ease;',
'}',
'.skip-to-content:focus {',
' top: 0;',
' outline: 3px solid #E6B246;',
' outline-offset: 2px;',
'}',
'',
'',
'@media (prefers-reduced-motion: reduce) {',
' *, *::before, *::after {',
' animation-duration: 0.01ms !important;',
' animation-iteration-count: 1 !important;',
' transition-duration: 0.01ms !important;',
' scroll-behavior: auto !important;',
' }',
'}'
].join('\n');
document.head.appendChild(style);
var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
function trapFocus(container) {
var focusableEls = container.querySelectorAll(FOCUSABLE);
if (!focusableEls.length) return function () {};
var firstEl = focusableEls[0];
var lastEl = focusableEls[focusableEls.length - 1];
function handleKeydown(e) {
if (e.key !== 'Tab') return;
var currentFocusable = container.querySelectorAll(FOCUSABLE);
if (!currentFocusable.length) return;
var first = currentFocusable[0];
var last = currentFocusable[currentFocusable.length - 1];
if (e.shiftKey) {
if (document.activeElement === first) {
e.preventDefault();
last.focus();
}
} else {
if (document.activeElement === last) {
e.preventDefault();
first.focus();
}
}
}
container.addEventListener('keydown', handleKeydown);
firstEl.focus();
return function deactivate() {
container.removeEventListener('keydown', handleKeydown);
};
}
window.p360TrapFocus = trapFocus;
function observeCookieConsent() {
if (!window.MutationObserver) return;
var deactivate = null;
var observer = new MutationObserver(function (mutations) {
mutations.forEach(function (mutation) {
mutation.addedNodes.forEach(function (node) {
if (node.nodeType !== 1) return;
if (node.id === 'cookieConsent') {
deactivate = trapFocus(node);
}
});
mutation.removedNodes.forEach(function (node) {
if (node.nodeType !== 1) return;
if (node.id === 'cookieConsent' && deactivate) {
deactivate();
deactivate = null;
}
});
});
});
observer.observe(document.body, { childList: true, subtree: false });
}
function observeA11yPanel() {
var deactivate = null;
var checkPanel = function () {
var panel = document.getElementById('a11yPanel');
if (!panel) return;
var panelObserver = new MutationObserver(function () {
if (panel.classList.contains('open')) {
var menu = panel.querySelector('.a11y-menu');
if (menu && !deactivate) {
deactivate = trapFocus(menu);
}
} else {
if (deactivate) {
deactivate();
deactivate = null;
}
}
});
panelObserver.observe(panel, { attributes: true, attributeFilter: ['class'] });
};
var attempts = 0;
var interval = setInterval(function () {
if (document.getElementById('a11yPanel') || attempts > 20) {
clearInterval(interval);
checkPanel();
}
attempts++;
}, 200);
}
document.addEventListener('keydown', function (e) {
if (e.key !== 'Escape') return;
var a11yPanel = document.getElementById('a11yPanel');
if (a11yPanel && a11yPanel.classList.contains('open')) {
a11yPanel.classList.remove('open');
var toggle = document.getElementById('a11yToggle');
if (toggle) {
toggle.setAttribute('aria-expanded', 'false');
toggle.focus();
}
return;
}
var cookie = document.getElementById('cookieConsent');
if (cookie) {
try { localStorage.setItem('p360_cookie_consent', 'essential'); } catch (ex) {}
window['ga-disable-G-ZR4KWKER0B'] = true;
cookie.style.animation = 'cookieSlideDown .3s ease forwards';
setTimeout(function () { cookie.parentNode && cookie.parentNode.removeChild(cookie); }, 350);
}
});
function init() {
observeCookieConsent();
observeA11yPanel();
}
if (document.readyState === 'loading') {
document.addEventListener('DOMContentLoaded', init);
} else {
init();
}
})();