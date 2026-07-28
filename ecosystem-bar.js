/* ═══════════════════════════════════════════════════════════════
   ecosystem-bar.js — Cross-navigation banner for the Pomaire 360 ecosystem
   Injects a thin top bar with links to related sites.
   Dismissible (remembers in sessionStorage).
   Styled to match the site's clay/gold palette.
   ═══════════════════════════════════════════════════════════════ */
(function() {
  'use strict';

  var STORAGE_KEY = 'p360_eco_bar_dismissed';

  // Check if dismissed this session
  try {
    if (sessionStorage.getItem(STORAGE_KEY) === '1') return;
  } catch(e) { return; }

  function init() {
    var bar = document.createElement('div');
    bar.id = 'ecosystemBar';
    bar.setAttribute('role', 'banner');
    bar.style.cssText = [
      'position:relative',
      'z-index:950',
      'background:linear-gradient(135deg,#2D1A0A 0%,#6B4226 100%)',
      'color:#f0e8dc',
      'padding:.45rem 1rem',
      'display:flex',
      'flex-wrap:wrap',
      'align-items:center',
      'justify-content:center',
      'gap:.4rem .9rem',
      'font-family:Inter,sans-serif',
      'font-size:.78rem',
      'font-weight:600',
      'line-height:1.3',
      'border-bottom:2px solid #E6B246'
    ].join(';');

    var label = document.createElement('span');
    label.textContent = '🏺 Ecosistema Pomaire 360:';
    label.style.cssText = 'opacity:.85;white-space:nowrap;';

    var linkApp = document.createElement('a');
    linkApp.href = 'https://app.pomaire360.cl';
    linkApp.target = '_blank';
    linkApp.rel = 'noopener';
    linkApp.textContent = '📱 App';
    linkApp.style.cssText = 'color:#E6B246;text-decoration:none;font-weight:800;white-space:nowrap;transition:opacity .15s;';
    linkApp.onmouseover = function() { linkApp.style.opacity = '.8'; };
    linkApp.onmouseout = function() { linkApp.style.opacity = '1'; };

    var linkShop = document.createElement('a');
    linkShop.href = 'https://comprayvende.pomaire360.cl';
    linkShop.target = '_blank';
    linkShop.rel = 'noopener';
    linkShop.textContent = '🛒 Compra y Vende';
    linkShop.style.cssText = 'color:#E6B246;text-decoration:none;font-weight:800;white-space:nowrap;transition:opacity .15s;';
    linkShop.onmouseover = function() { linkShop.style.opacity = '.8'; };
    linkShop.onmouseout = function() { linkShop.style.opacity = '1'; };

    var closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', 'Cerrar barra');
    closeBtn.textContent = '✕';
    closeBtn.style.cssText = [
      'position:absolute',
      'right:.7rem',
      'top:50%',
      'transform:translateY(-50%)',
      'background:rgba(255,255,255,.12)',
      'border:none',
      'color:#f0e8dc',
      'width:24px',
      'height:24px',
      'border-radius:50%',
      'font-size:.72rem',
      'cursor:pointer',
      'display:flex',
      'align-items:center',
      'justify-content:center',
      'transition:background .15s'
    ].join(';');
    closeBtn.onmouseover = function() { closeBtn.style.background = 'rgba(255,255,255,.25)'; };
    closeBtn.onmouseout = function() { closeBtn.style.background = 'rgba(255,255,255,.12)'; };
    closeBtn.onclick = function() {
      try { sessionStorage.setItem(STORAGE_KEY, '1'); } catch(e) {}
      bar.style.display = 'none';
    };

    bar.appendChild(label);
    bar.appendChild(linkApp);
    bar.appendChild(linkShop);
    bar.appendChild(closeBtn);

    // Insert before nav or at start of body
    var nav = document.querySelector('nav');
    if (nav && nav.parentNode) {
      nav.parentNode.insertBefore(bar, nav);
    } else {
      document.body.insertBefore(bar, document.body.firstChild);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
