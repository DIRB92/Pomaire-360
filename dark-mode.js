/* ═══════════════════════════════════════════════════════════════════════════
   dark-mode.js — Floating dark mode toggle for Pomaire 360
   Injects a sun/moon button at bottom-right.
   Persists preference in localStorage.
   Styles now in /components.css (no more inline style.cssText).
   ═══════════════════════════════════════════════════════════════════════════ */
(function() {
  'use strict';

  var STORAGE_KEY = 'p360_dark_mode';
  var icon_sun = '\u2600\uFE0F'; // sun
  var icon_moon = '\uD83C\uDF19'; // moon

  function isDark() {
    var stored = null;
    try { stored = localStorage.getItem(STORAGE_KEY); } catch(e) {}
    if (stored === 'dark') return true;
    if (stored === 'light') return false;
    // System preference
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function applyTheme(dark) {
    document.documentElement.classList.toggle('dark-mode', dark);
    try { localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light'); } catch(e) {}
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
      applyTheme(nowDark);
    });

    document.body.appendChild(btn);

    // Watch for system preference changes
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        var stored = null;
        try { stored = localStorage.getItem(STORAGE_KEY); } catch(err) {}
        // Only follow system if user hasn't manually chosen
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
