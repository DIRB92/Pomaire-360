/* ═══════════════════════════════════════════════════════════════
   dark-mode.js — Toggle de modo oscuro/claro para Pomaire 360
   Inyecta botones en la NAV (arriba) y en el FOOTER (abajo).
   Persiste la preferencia en localStorage.
   ═══════════════════════════════════════════════════════════════ */
(function() {
  'use strict';

  var STORAGE_KEY = 'p360_dark_mode';
  var icon_sun = '\u2600\uFE0F'; // ☀️
  var icon_moon = '\uD83C\uDF19'; // 🌙

  function isDark() {
    var stored = null;
    try { stored = localStorage.getItem(STORAGE_KEY); } catch(e) {}
    if (stored === 'dark') return true;
    if (stored === 'light') return false;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function applyTheme(dark) {
    document.documentElement.classList.toggle('dark-mode', dark);
    try { localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light'); } catch(e) {}
    // Update all dark mode buttons
    var btns = document.querySelectorAll('.dark-mode-toggle');
    for (var i = 0; i < btns.length; i++) {
      var iconEl = btns[i].querySelector('.dm-icon');
      var labelEl = btns[i].querySelector('.dm-label');
      if (iconEl) iconEl.textContent = dark ? icon_sun : icon_moon;
      if (labelEl) labelEl.textContent = dark ? 'Día' : 'Noche';
      btns[i].setAttribute('aria-label', dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
      btns[i].setAttribute('title', dark ? 'Modo claro' : 'Modo oscuro');
    }
  }

  function handleToggle(e) {
    e.stopPropagation();
    var nowDark = !document.documentElement.classList.contains('dark-mode');
    applyTheme(nowDark);
  }

  /* ── Botón para la NAV ─────────────────────────────────────── */
  function createNavBtn(dark) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'dark-mode-toggle nav-dark-toggle';
    btn.setAttribute('aria-label', dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
    btn.setAttribute('title', dark ? 'Modo claro' : 'Modo oscuro');

    var iconSpan = document.createElement('span');
    iconSpan.className = 'dm-icon';
    iconSpan.textContent = dark ? icon_sun : icon_moon;

    var labelSpan = document.createElement('span');
    labelSpan.className = 'dm-label';
    labelSpan.textContent = dark ? 'Día' : 'Noche';

    btn.appendChild(iconSpan);
    btn.appendChild(labelSpan);
    btn.addEventListener('click', handleToggle);
    return btn;
  }

  /* ── Botón para el FOOTER ──────────────────────────────────── */
  function createFooterBtn(dark) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'dark-mode-toggle footer-dark-toggle';
    btn.setAttribute('aria-label', dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
    btn.setAttribute('title', dark ? 'Modo claro' : 'Modo oscuro');

    var iconSpan = document.createElement('span');
    iconSpan.className = 'dm-icon';
    iconSpan.textContent = dark ? icon_sun : icon_moon;

    var labelSpan = document.createElement('span');
    labelSpan.className = 'dm-label';
    labelSpan.textContent = dark ? 'Día' : 'Noche';

    btn.appendChild(iconSpan);
    btn.appendChild(labelSpan);
    btn.addEventListener('click', handleToggle);
    return btn;
  }

  function init() {
    var dark = isDark();
    document.documentElement.classList.toggle('dark-mode', dark);

    // Inject in NAV — after .lang-selector or at end of nav
    var nav = document.querySelector('nav');
    if (nav) {
      var navBtn = createNavBtn(dark);
      var langSelector = nav.querySelector('.lang-selector');
      if (langSelector && langSelector.nextSibling) {
        nav.insertBefore(navBtn, langSelector.nextSibling);
      } else {
        nav.appendChild(navBtn);
      }
    }

    // Inject in FOOTER — inside .footer-bottom-inner
    var footerInner = document.querySelector('.footer-bottom-inner');
    if (footerInner) {
      var footerBtn = createFooterBtn(dark);
      footerInner.appendChild(footerBtn);
    }

    // Watch for system preference changes
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        var stored = null;
        try { stored = localStorage.getItem(STORAGE_KEY); } catch(err) {}
        if (!stored) {
          applyTheme(e.matches);
        }
      });
    }
  }

  // Apply dark class ASAP to prevent flash of light theme
  if (isDark()) {
    document.documentElement.classList.add('dark-mode');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
