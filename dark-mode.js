/* ═══════════════════════════════════════════════════════════════
   dark-mode.js — Botón fijo de modo oscuro/claro para Pomaire 360
   Inyecta un toggle sol/luna fijo en la parte inferior de la pantalla.
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
    updateBtnContent(dark);
    updateBtnStyle(dark);
  }

  function updateBtnContent(dark) {
    var icon = document.getElementById('darkModeIcon');
    var label = document.getElementById('darkModeLabel');
    if (icon) icon.textContent = dark ? icon_sun : icon_moon;
    if (label) label.textContent = dark ? 'Modo Claro' : 'Modo Oscuro';
    var btn = document.getElementById('darkModeBtn');
    if (btn) {
      btn.setAttribute('aria-label', dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
      btn.setAttribute('title', dark ? 'Modo claro' : 'Modo oscuro');
    }
  }

  function init() {
    // Apply theme immediately (before button is created) to avoid flash
    var dark = isDark();
    document.documentElement.classList.toggle('dark-mode', dark);

    // Create the fixed bottom bar container
    var bar = document.createElement('div');
    bar.id = 'darkModeBar';
    bar.style.cssText = [
      'position:fixed',
      'bottom:0',
      'left:0',
      'right:0',
      'z-index:1100',
      'display:flex',
      'justify-content:center',
      'align-items:center',
      'padding:8px 16px',
      'pointer-events:none'
    ].join(';');

    // Create the button
    var btn = document.createElement('button');
    btn.id = 'darkModeBtn';
    btn.type = 'button';
    btn.setAttribute('aria-label', dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
    btn.setAttribute('title', dark ? 'Modo claro' : 'Modo oscuro');
    btn.style.cssText = [
      'pointer-events:auto',
      'display:flex',
      'align-items:center',
      'gap:8px',
      'padding:10px 20px',
      'border-radius:30px',
      'border:2px solid rgba(184,92,44,.3)',
      'background:rgba(255,255,255,.95)',
      'color:#2D1A0A',
      'font-size:.9rem',
      'font-weight:600',
      'font-family:Inter,sans-serif',
      'cursor:pointer',
      'box-shadow:0 -2px 16px rgba(0,0,0,.12),0 4px 14px rgba(0,0,0,.1)',
      'transition:transform .15s,box-shadow .15s,background .2s,border-color .2s,color .2s',
      'backdrop-filter:blur(8px)',
      '-webkit-backdrop-filter:blur(8px)',
      'touch-action:manipulation',
      '-webkit-tap-highlight-color:transparent'
    ].join(';');

    // Icon span
    var iconSpan = document.createElement('span');
    iconSpan.id = 'darkModeIcon';
    iconSpan.textContent = dark ? icon_sun : icon_moon;
    iconSpan.style.cssText = 'font-size:1.3rem;line-height:1;';

    // Label span
    var labelSpan = document.createElement('span');
    labelSpan.id = 'darkModeLabel';
    labelSpan.textContent = dark ? 'Modo Claro' : 'Modo Oscuro';

    btn.appendChild(iconSpan);
    btn.appendChild(labelSpan);

    btn.addEventListener('mouseenter', function() {
      btn.style.transform = 'scale(1.04)';
      btn.style.boxShadow = '0 -2px 20px rgba(0,0,0,.18),0 6px 20px rgba(0,0,0,.15)';
    });
    btn.addEventListener('mouseleave', function() {
      btn.style.transform = 'scale(1)';
      btn.style.boxShadow = '0 -2px 16px rgba(0,0,0,.12),0 4px 14px rgba(0,0,0,.1)';
    });

    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      var nowDark = !document.documentElement.classList.contains('dark-mode');
      applyTheme(nowDark);
    });

    bar.appendChild(btn);
    document.body.appendChild(bar);

    // Apply initial style
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
      btn.style.background = 'rgba(43,38,34,.95)';
      btn.style.color = '#f0e8dc';
      btn.style.borderColor = 'rgba(230,178,70,.4)';
      btn.style.boxShadow = '0 -2px 16px rgba(0,0,0,.25),0 4px 14px rgba(0,0,0,.2)';
    } else {
      btn.style.background = 'rgba(255,255,255,.95)';
      btn.style.color = '#2D1A0A';
      btn.style.borderColor = 'rgba(184,92,44,.3)';
      btn.style.boxShadow = '0 -2px 16px rgba(0,0,0,.12),0 4px 14px rgba(0,0,0,.1)';
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
