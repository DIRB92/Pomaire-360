(function () {
'use strict';
// Fix: Only initialize GA4 if user has explicitly consented ('all').
// If no consent yet (first visit) or consent is 'essential', do NOT load GA.
var consent;
try {
consent = localStorage.getItem('p360_cookie_consent');
} catch (e) {
return; // localStorage unavailable, do nothing
}
// No consent stored yet (first visit) — wait for user decision
if (!consent) return;
// User explicitly rejected analytics
if (consent === 'essential') {
window['ga-disable-G-ZR4KWKER0B'] = true;
return;
}
// User accepted all cookies — proceed with GA4
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
window.gtag = gtag;
gtag('js', new Date());
gtag('config', 'G-ZR4KWKER0B', {
'anonymize_ip': true,
'allow_google_signals': false
});
var loaded = false;
function loadGA() {
if (loaded) return;
if (window['ga-disable-G-ZR4KWKER0B']) return;
loaded = true;
var s = document.createElement('script');
s.src = 'https://www.googletagmanager.com/gtag/js?id=G-ZR4KWKER0B';
s.async = true;
document.head.appendChild(s);
}
var events = ['scroll', 'click', 'touchstart', 'keydown'];
events.forEach(function (e) {
document.addEventListener(e, loadGA, { once: true, passive: true });
});
setTimeout(loadGA, 3000);
})();