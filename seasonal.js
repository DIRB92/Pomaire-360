/* ════════════════════════════════════════════════════════════════════════
   Avisos de temporada · Pomaire 360
   Muestra/oculta automáticamente los avisos de "vacaciones de invierno"
   (banner en la página de El Chancho y nota en el mapa interactivo)
   según el rango de fechas configurado abajo.

   ▸ PARA ACTUALIZAR CADA AÑO: edita o agrega rangos en WINTER_RANGES.
     Formato de fecha: 'AAAA-MM-DD' (inclusive). Puedes dejar varios años
     cargados y el aviso aparecerá solo dentro de cada rango.
   ════════════════════════════════════════════════════════════════════════ */
(function(){
  var WINTER_RANGES = [
    { start: '2026-07-06', end: '2026-07-19' }   // Vacaciones de invierno 2026 (referencial · ajustar a fechas oficiales)
    // { start: '2027-07-12', end: '2027-07-25' } // ← ejemplo para el próximo año
  ];
  window.POMAIRE_WINTER_RANGES = WINTER_RANGES;

  function ymd(d){
    return d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
  }
  // ¿Hoy está dentro de algún rango de vacaciones de invierno?
  window.isPomaireWinter = function(date){
    var today = ymd(date || new Date());
    return WINTER_RANGES.some(function(r){ return today >= r.start && today <= r.end; });
  };

  // Mostrar/ocultar elementos marcados con [data-winter] (van ocultos por defecto)
  function applyWinterBanners(){
    var show = window.isPomaireWinter();
    document.querySelectorAll('[data-winter]').forEach(function(el){
      el.style.display = show ? '' : 'none';
    });
  }
  window.applyWinterBanners = applyWinterBanners;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyWinterBanners);
  } else {
    applyWinterBanners();
  }
})();
