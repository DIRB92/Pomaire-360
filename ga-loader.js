/* ═══════════════════════════════════════════════════════════════════════════
   ga-loader.js — Google Analytics deferred loader for Pomaire 360
   Respects user cookie consent. Only loads GA after interaction or 3s timeout.
   Extraído de index.html para eliminar 'unsafe-inline' del CSP.
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  // Respetar la elección de cookies del usuario
  try {
    if (localStorage.getItem('p360_cookie_consent') === 'essential') {
      window['ga-disable-G-ZR4KWKER0B'] = true;
    }
  } catch (e) {}

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
    // No cargar GA si el usuario rechazó cookies de análisis
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
