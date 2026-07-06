/* ════════════════════════════════════════════════════════════════════════
   Avisos de temporada · Pomaire 360
   Muestra/oculta automáticamente los avisos de "vacaciones de invierno"
   según el rango de fechas configurado abajo.

   WINTER_RANGES → cuando el lugar REALMENTE está abierto lun-dom
       (banner en "Cómo visitar" [data-winter] y nota del mapa)

   ▸ PARA ACTUALIZAR CADA AÑO: edita o agrega rangos abajo.
     Formato de fecha: 'AAAA-MM-DD' (inclusive).
   ════════════════════════════════════════════════════════════════════════ */
(function(){
  var WINTER_RANGES = [
    { start: '2026-07-06', end: '2026-07-19' }   // Vacaciones de invierno 2026 (referencial · ajustar a fechas oficiales)
    // { start: '2027-07-12', end: '2027-07-25' } // ← ejemplo próximo año
  ];
  window.POMAIRE_WINTER_RANGES = WINTER_RANGES;

  function ymd(d){
    return d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
  }
  function inRanges(ranges, date){
    var today = ymd(date || new Date());
    return ranges.some(function(r){ return today >= r.start && today <= r.end; });
  }
  // ¿Hoy el lugar está abierto por vacaciones de invierno?
  window.isPomaireWinter = function(date){ return inRanges(WINTER_RANGES, date); };

  // Mostrar/ocultar elementos marcados con [data-winter] (van ocultos por defecto)
  function applyWinterBanners(){
    var w = window.isPomaireWinter();
    document.querySelectorAll('[data-winter]').forEach(function(el){
      el.style.display = w ? '' : 'none';
    });
    var p = window.isPomaireWinter();
    document.querySelectorAll('[data-winter-promo]').forEach(function(el){
      el.style.display = p ? '' : 'none';
    });
  }
  window.applyWinterBanners = applyWinterBanners;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyWinterBanners);
  } else {
    applyWinterBanners();
  }
})();
