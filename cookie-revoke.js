/* ═══════════════════════════════════════════════════════════════════════════
   cookie-revoke.js — Permite revocar el consentimiento de cookies
   Se usa en la página /privacidad/ para cumplir con la Ley 21.719 (art. 12)
   que exige que el consentimiento sea revocable en cualquier momento.
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var STORAGE_KEY = 'p360_cookie_consent';

  // Mostrar estado actual del consentimiento
  function updateStatus() {
    var statusEl = document.getElementById('cookieCurrentStatus');
    var btn = document.getElementById('cookieRevokeBtn');
    if (!statusEl) return;

    var consent = null;
    try { consent = localStorage.getItem(STORAGE_KEY); } catch (e) {}

    if (consent === 'all') {
      statusEl.innerHTML = '<strong style="color:#27ae60;">✅ Has aceptado todas las cookies</strong> (incluye Google Analytics).';
      if (btn) btn.style.display = '';
    } else if (consent === 'essential') {
      statusEl.innerHTML = '<strong style="color:#E6B246;">⚠️ Solo cookies esenciales</strong> (Google Analytics desactivado).';
      if (btn) {
        btn.textContent = 'Eliminar preferencia y ver banner nuevamente';
        btn.style.display = '';
      }
    } else if (consent === '1') {
      statusEl.innerHTML = '<strong style="color:#27ae60;">✅ Has aceptado cookies</strong> (consentimiento previo).';
      if (btn) btn.style.display = '';
    } else {
      statusEl.innerHTML = '<strong style="color:var(--muted);">⏳ Aún no has dado tu consentimiento</strong> (se mostrará el banner al navegar).';
      if (btn) btn.style.display = 'none';
    }
  }

  // Función global de revocación
  window.revokeCookieConsent = function () {
    // 1. Eliminar la preferencia de localStorage
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}

    // 2. Desactivar GA inmediatamente
    window['ga-disable-G-ZR4KWKER0B'] = true;

    // 3. Eliminar cookies de Google Analytics
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim();
      var name = cookie.split('=')[0];
      if (name.indexOf('_ga') === 0 || name.indexOf('_gid') === 0) {
        // Eliminar cookie con diferentes paths y dominios
        var domains = [window.location.hostname, '.' + window.location.hostname, '.pomaire360.cl'];
        var paths = ['/', ''];
        for (var d = 0; d < domains.length; d++) {
          for (var p = 0; p < paths.length; p++) {
            document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=' + paths[p] + '; domain=' + domains[d];
          }
        }
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
      }
    }

    // 4. Actualizar la UI
    updateStatus();

    // 5. Mostrar confirmación
    var statusEl = document.getElementById('cookieCurrentStatus');
    if (statusEl) {
      statusEl.innerHTML = '<strong style="color:#B85C2C;">🗑️ Consentimiento revocado.</strong> Las cookies de analítica han sido eliminadas. El banner aparecerá en tu próxima visita.';
    }

    var btn = document.getElementById('cookieRevokeBtn');
    if (btn) btn.style.display = 'none';
  };

  // Inicializar al cargar
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateStatus);
  } else {
    updateStatus();
  }
})();
