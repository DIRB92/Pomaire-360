/* ═══════════════════════════════════════════════════════════════
   cookie-consent.js — Cookie consent banner for Pomaire 360
   Shows a fixed bottom banner if user hasn't accepted yet.
   Stores consent in localStorage. Links to /privacidad/.
   ═══════════════════════════════════════════════════════════════ */
(function() {
  'use strict';

  var STORAGE_KEY = 'p360_cookie_consent';

  // Check if already consented
  try {
    if (localStorage.getItem(STORAGE_KEY) === '1') return;
  } catch(e) { return; }

  // Wait for DOM
  function init() {
    var banner = document.createElement('div');
    banner.id = 'cookieConsent';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Consentimiento de cookies');
    banner.style.cssText = [
      'position:fixed',
      'bottom:0',
      'left:0',
      'right:0',
      'z-index:9990',
      'background:#2D1A0A',
      'color:#f0e8dc',
      'padding:1rem 1.5rem',
      'display:flex',
      'flex-wrap:wrap',
      'align-items:center',
      'justify-content:center',
      'gap:.8rem 1.5rem',
      'font-family:Inter,sans-serif',
      'font-size:.88rem',
      'line-height:1.5',
      'box-shadow:0 -4px 20px rgba(0,0,0,.3)',
      'animation:cookieSlideUp .4s ease'
    ].join(';');

    var text = document.createElement('p');
    text.style.cssText = 'margin:0;max-width:640px;text-align:center;';
    text.innerHTML = 'Usamos cookies para mejorar tu experiencia. ' +
      '<a href="/privacidad/" style="color:#E6B246;font-weight:700;text-decoration:underline;">Política de privacidad</a>';

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = 'Acepto';
    btn.style.cssText = [
      'background:#E6B246',
      'color:#2D1A0A',
      'border:none',
      'border-radius:24px',
      'padding:.6rem 1.6rem',
      'font-size:.9rem',
      'font-weight:800',
      'cursor:pointer',
      'font-family:inherit',
      'transition:transform .15s,box-shadow .15s',
      'box-shadow:0 2px 10px rgba(230,178,70,.4)',
      'white-space:nowrap'
    ].join(';');
    btn.onmouseover = function() { btn.style.transform = 'translateY(-2px)'; };
    btn.onmouseout = function() { btn.style.transform = 'none'; };
    btn.onclick = function() {
      try { localStorage.setItem(STORAGE_KEY, '1'); } catch(e) {}
      banner.style.animation = 'cookieSlideDown .3s ease forwards';
      setTimeout(function() { banner.parentNode && banner.parentNode.removeChild(banner); }, 350);
    };

    banner.appendChild(text);
    banner.appendChild(btn);
    document.body.appendChild(banner);

    // Inject keyframes
    if (!document.getElementById('cookieConsentCSS')) {
      var style = document.createElement('style');
      style.id = 'cookieConsentCSS';
      style.textContent = '@keyframes cookieSlideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}' +
        '@keyframes cookieSlideDown{from{transform:translateY(0)}to{transform:translateY(100%)}}';
      document.head.appendChild(style);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
