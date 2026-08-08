/* ═══════════════════════════════════════════════════════════════════════════
   dark-mode.js — Floating dark mode toggle for Pomaire 360
   Injects a sun/moon button at bottom-right.
   Persists preference in localStorage.
   Styles in /components.css + /dark-mode-overrides.css
   ═══════════════════════════════════════════════════════════════════════════ */
(function() {
  'use strict';

  var STORAGE_KEY = 'p360_dark_mode';
  var icon_sun = '\u2600\uFE0F'; // ☀️ sun
  var icon_moon = '\uD83C\uDF19'; // 🌙 moon
  var THEME_LIGHT = '#D4654A';
  var THEME_DARK = '#1A1614';
  var transitionTimeout = null;

  function isDark() {
    var stored = null;
    try { stored = localStorage.getItem(STORAGE_KEY); } catch(e) {}
    if (stored === 'dark') return true;
    if (stored === 'light') return false;
    // System preference fallback
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function updateMetaThemeColor(dark) {
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', dark ? THEME_DARK : THEME_LIGHT);
    }
  }

  function enableTransitions() {
    // Add transition class for smooth switching
    document.documentElement.classList.add('dark-mode-transition');
    // Remove after transitions complete to avoid performance issues
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
    // Apply theme immediately (before button is created) to avoid flash
    var dark = isDark();
    document.documentElement.classList.toggle('dark-mode', dark);
    updateMetaThemeColor(dark);

    // Create the floating button (styled via #darkModeBtn in components.css)
    var btn = document.createElement('button');
    btn.id = 'darkModeBtn';
    btn.type = 'button';
    btn.textContent = dark ? icon_sun : icon_moon;
    btn.setAttribute('aria-label', dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
    btn.setAttribute('title', dark ? 'Modo claro' : 'Modo oscuro');

    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      var nowDark = !document.documentElement.classList.contains('dark-mode');
      applyTheme(nowDark, true); // animate = true on user click
    });

    document.body.appendChild(btn);

    // Watch for system preference changes
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        var stored = null;
        try { stored = localStorage.getItem(STORAGE_KEY); } catch(err) {}
        // Only follow system if user hasn't manually chosen
        if (!stored) {
          applyTheme(e.matches, true);
        }
      });
    }
  }

  // Apply dark class ASAP to prevent flash of wrong theme
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
