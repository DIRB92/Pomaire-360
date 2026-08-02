/* ═══════════════════════════════════════════════════════════════════════════
   ecosystem-bar.js — Cross-navigation banner for the Pomaire 360 ecosystem
   Injects a thin top bar with links to related sites.
   Dismissible (remembers in sessionStorage).
   Styles now in /components.css (no more inline style.cssText).
   ═══════════════════════════════════════════════════════════════════════════ */
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

    var label = document.createElement('span');
    label.className = 'eco-label';
    label.textContent = '\uD83C\uDFFA Ecosistema Pomaire 360:';

    var linkApp = document.createElement('a');
    linkApp.href = 'https://app.pomaire360.cl';
    linkApp.target = '_blank';
    linkApp.rel = 'noopener';
    linkApp.className = 'eco-link';
    linkApp.textContent = '\uD83D\uDCF1 App';

    var linkShop = document.createElement('a');
    linkShop.href = 'https://comprayvende.pomaire360.cl';
    linkShop.target = '_blank';
    linkShop.rel = 'noopener';
    linkShop.className = 'eco-link';
    linkShop.textContent = '\uD83D\uDED2 Compra y Vende';

    var closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', 'Cerrar barra');
    closeBtn.className = 'eco-close';
    closeBtn.textContent = '\u2715';
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
