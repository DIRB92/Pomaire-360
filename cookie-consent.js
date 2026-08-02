/* ═══════════════════════════════════════════════════════════════════════════
   cookie-consent.js — Cookie consent banner for Pomaire 360
   Shows a fixed bottom banner if user hasn't responded yet.
   Two options: "Aceptar todas" (all cookies) / "Solo esenciales" (no GA).
   Stores consent in localStorage. Links to /privacidad/.
   Styles now in /components.css (no more inline style.cssText).
   ═══════════════════════════════════════════════════════════════════════════ */
(function() {
  'use strict';

  var STORAGE_KEY = 'p360_cookie_consent';

  // Check if already consented
  try {
    var consent = localStorage.getItem(STORAGE_KEY);
    if (consent === '1' || consent === 'all' || consent === 'essential') return;
  } catch(e) { return; }

  // Wait for DOM
  function init() {
    var banner = document.createElement('div');
    banner.id = 'cookieConsent';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Consentimiento de cookies');

    var text = document.createElement('p');
    text.className = 'cookie-text';
    text.innerHTML = 'Usamos cookies esenciales y de an\u00e1lisis para mejorar tu experiencia. ' +
      '<a href="/privacidad/">Pol\u00edtica de privacidad</a>';

    var btnWrap = document.createElement('div');
    btnWrap.className = 'cookie-buttons';

    // Reject button (essential only)
    var btnReject = document.createElement('button');
    btnReject.type = 'button';
    btnReject.className = 'cookie-btn-reject';
    btnReject.textContent = 'Solo esenciales';
    btnReject.onclick = function() {
      try { localStorage.setItem(STORAGE_KEY, 'essential'); } catch(e) {}
      // Disable Google Analytics
      window['ga-disable-G-ZR4KWKER0B'] = true;
      banner.style.animation = 'cookieSlideDown .3s ease forwards';
      setTimeout(function() { banner.parentNode && banner.parentNode.removeChild(banner); }, 350);
    };

    // Accept all button
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'cookie-btn-accept';
    btn.textContent = 'Aceptar todas';
    btn.onclick = function() {
      try { localStorage.setItem(STORAGE_KEY, 'all'); } catch(e) {}
      banner.style.animation = 'cookieSlideDown .3s ease forwards';
      setTimeout(function() { banner.parentNode && banner.parentNode.removeChild(banner); }, 350);
    };

    btnWrap.appendChild(btnReject);
    btnWrap.appendChild(btn);
    banner.appendChild(text);
    banner.appendChild(btnWrap);
    document.body.appendChild(banner);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
