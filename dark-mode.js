/* ═══════════════════════════════════════════════════════════════
   dark-mode.js — Botón flotante de modo oscuro para Pomaire 360
   Inyecta un toggle sol/luna en la esquina inferior derecha.
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
    updateBtnStyle(dark);
  }

  function init() {
    // Apply theme immediately (before button is created) to avoid flash
    var dark = isDark();
    document.documentElement.classList.toggle('dark-mode', dark);

    // Create the floating button
    var btn = document.createElement('button');
    btn.id = 'darkModeBtn';
    btn.type = 'button';
    btn.textContent = dark ? icon_sun : icon_moon;
    btn.setAttribute('aria-label', dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
    btn.setAttribute('title', dark ? 'Modo claro' : 'Modo oscuro');
    btn.style.cssText = [
      'position:fixed',
      'bottom:24px',
      'right:24px',
      'z-index:1100',
      'width:48px',
      'height:48px',
      'border-radius:50%',
      'border:2px solid rgba(184,92,44,.3)',
      'background:rgba(255,255,255,.92)',
      'color:#2D1A0A',
      'font-size:1.4rem',
      'cursor:pointer',
      'display:flex',
      'align-items:center',
      'justify-content:center',
      'box-shadow:0 4px 14px rgba(0,0,0,.18)',
      'transition:transform .15s,box-shadow .15s,background .2s,border-color .2s',
      'backdrop-filter:blur(6px)',
      '-webkit-backdrop-filter:blur(6px)',
      'touch-action:manipulation',
      '-webkit-tap-highlight-color:transparent'
    ].join(';');

    btn.addEventListener('mouseenter', function() {
      btn.style.transform = 'scale(1.1)';
      btn.style.boxShadow = '0 6px 20px rgba(0,0,0,.25)';
    });
    btn.addEventListener('mouseleave', function() {
      btn.style.transform = 'scale(1)';
      btn.style.boxShadow = '0 4px 14px rgba(0,0,0,.18)';
    });

    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      var nowDark = !document.documentElement.classList.contains('dark-mode');
      applyTheme(nowDark);
    });

    document.body.appendChild(btn);

    // Update button style for dark mode
    updateBtnStyle(dark);

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

  function updateBtnStyle(dark) {
    var btn = document.getElementById('darkModeBtn');
    if (!btn) return;
    if (dark) {
      btn.style.background = 'rgba(43,38,34,.92)';
      btn.style.color = '#f0e8dc';
      btn.style.borderColor = 'rgba(230,178,70,.4)';
    } else {
      btn.style.background = 'rgba(255,255,255,.92)';
      btn.style.color = '#2D1A0A';
      btn.style.borderColor = 'rgba(184,92,44,.3)';
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
