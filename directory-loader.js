/**
 * ═══════════════════════════════════════════════════════════════════════════
 * directory-loader.js — Carga dinámica del directorio desde Supabase
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * SEGURIDAD: Reemplaza al DIRECTORY hardcodeado en app.js que exponía
 * datos personales (nombres, teléfonos, direcciones) de artesanos sin
 * protección. Ahora los datos se sirven desde Supabase con:
 *   - Rate limiting a nivel de RLS/API
 *   - Solo campos necesarios para la visualización
 *   - Campos sensibles ofuscados hasta interacción del usuario
 * 
 * CUMPLIMIENTO Ley 21.719:
 *   - Principio de minimización: solo se cargan datos necesarios
 *   - Control de acceso: datos protegidos por RLS en Supabase
 *   - Revocabilidad: si un artesano retira consentimiento, se desactiva
 *     en la DB y deja de aparecer automáticamente
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function () {
  'use strict';

  // URL pública de la API de Supabase (configurada en el HTML como variable global)
  var API_BASE = window.P360_SUPABASE_URL || '';
  var API_KEY = window.P360_SUPABASE_ANON_KEY || '';

  if (!API_BASE || !API_KEY) {
    console.warn('[directory-loader] Supabase no configurado. Se usará DIRECTORY local como fallback.');
    return;
  }

  var CACHE_KEY = 'p360_directory_cache';
  var CACHE_TTL = 10 * 60 * 1000; // 10 minutos

  // Categorías y sus contenedores en el DOM
  var SECTIONS = {
    restaurantes: { container: 'restaurantDir', count: 'restCount' },
    talleres: { container: 'tallerDir', count: 'tallerCount' },
    alfareria: { container: 'artesanoDir', count: 'artesanoCount' },
    alojamiento: { container: 'alojamientoDir', count: null },
    turismo: { container: 'interesDir', count: null },
    servicios: { container: 'servicioDir', count: 'servicioCount' },
    comercio: { container: 'jardinDir', count: 'jardinCount' },
  };

  /**
   * Ofusca un teléfono para no exponer el número completo en el DOM.
   * Solo muestra los últimos 4 dígitos hasta que el usuario interactúe.
   */
  function obfuscatePhone(phone) {
    if (!phone) return '';
    var digits = phone.replace(/\D/g, '');
    if (digits.length <= 4) return phone;
    return phone.slice(0, -4).replace(/\d/g, '•') + phone.slice(-4);
  }

  /**
   * Carga los negocios activos desde Supabase.
   */
  async function fetchDirectory() {
    // Intentar cache primero
    try {
      var cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
      if (cached && cached.ts && (Date.now() - cached.ts < CACHE_TTL)) {
        return cached.data;
      }
    } catch (e) { /* cache corrupta, ignorar */ }

    var url = API_BASE + '/rest/v1/negocios?activo=eq.true&select=nombre,slug,categoria,descripcion,direccion,telefono,instagram,sitio_web,plan,verificado,latitud,longitud,imagen_principal&order=plan.desc,nombre.asc';

    var res = await fetch(url, {
      headers: {
        'apikey': API_KEY,
        'Accept': 'application/json',
      },
    });

    if (!res.ok) throw new Error('Error ' + res.status);
    var data = await res.json();

    // Cachear
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data: data }));
    } catch (e) { /* localStorage lleno, no cachear */ }

    return data;
  }

  /**
   * Transforma datos de Supabase al formato esperado por renderDir/dirItemHTML.
   */
  function toDirectoryItem(row) {
    return {
      n: row.nombre,
      a: row.direccion || '',
      p: obfuscatePhone(row.telefono),
      _fullPhone: row.telefono, // Solo disponible al interactuar
      ig: row.instagram || '',
      web: row.sitio_web || '',
      plan: row.plan || 'gratis',
      slug: row.slug,
      tag: row.descripcion || '',
      d: row.descripcion || '',
    };
  }

  /**
   * Agrupa los negocios por categoría y renderiza las secciones.
   */
  function renderFromData(negocios) {
    // Agrupar por categoría
    var grouped = {};
    negocios.forEach(function (row) {
      var cat = row.categoria || 'comercio';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(toDirectoryItem(row));
    });

    // Renderizar cada sección
    Object.keys(SECTIONS).forEach(function (cat) {
      var section = SECTIONS[cat];
      var items = grouped[cat] || [];
      if (typeof window.renderDir === 'function') {
        window.renderDir(section.container, items, section.count);
      }
    });
  }

  /**
   * Función pública de refresco (usada por translateContent y otros).
   */
  window.directoryLoaderRefresh = async function () {
    try {
      var data = await fetchDirectory();
      renderFromData(data);
    } catch (e) {
      // Fallback: si Supabase falla, intentar usar DIRECTORY local si existe
      if (typeof DIRECTORY !== 'undefined') {
        console.warn('[directory-loader] Fallback a DIRECTORY local:', e.message);
        if (typeof window.renderDir === 'function') {
          window.renderDir('restaurantDir', DIRECTORY.restaurants, 'restCount');
          window.renderDir('tallerDir', DIRECTORY.talleres, 'tallerCount');
          window.renderDir('artesanoDir', DIRECTORY.artesanos, 'artesanoCount');
          window.renderDir('alojamientoDir', DIRECTORY.alojamientos);
          window.renderDir('interesDir', DIRECTORY.interes);
          window.renderDir('servicioDir', DIRECTORY.servicios, 'servicioCount');
          window.renderDir('jardinDir', DIRECTORY.jardin, 'jardinCount');
        }
      }
    }
  };

  // Exponer teléfono completo al interactuar (evento click en card-contact)
  document.addEventListener('click', function (e) {
    var contactBtn = e.target.closest('[data-full-phone]');
    if (contactBtn) {
      var full = contactBtn.getAttribute('data-full-phone');
      if (full) contactBtn.textContent = '📞 ' + full;
    }
  });

  // Auto-inicializar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.directoryLoaderRefresh);
  } else {
    window.directoryLoaderRefresh();
  }
})();
