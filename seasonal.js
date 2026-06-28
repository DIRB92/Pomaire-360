/* ════════════════════════════════════════════════════════════════════════
   Avisos de temporada · Pomaire 360
   Muestra/oculta automáticamente los avisos de "vacaciones de invierno"
   según el rango de fechas configurado abajo.

   Hay dos ventanas:
   • WINTER_RANGES → cuando el lugar REALMENTE está abierto lun-dom
       (banner en "Cómo visitar" [data-winter] y nota del mapa)
   • PROMO_RANGES  → anuncio LLAMATIVO anticipado + durante las vacaciones
       (barra superior [data-winter-promo]); ideal para promocionar antes.

   ▸ PARA ACTUALIZAR CADA AÑO: edita o agrega rangos abajo.
     Formato de fecha: 'AAAA-MM-DD' (inclusive).
   ════════════════════════════════════════════════════════════════════════ */
(function(){
  var WINTER_RANGES = [
    { start: '2026-07-06', end: '2026-07-19' }   // Vacaciones de invierno 2026 (referencial · ajustar a fechas oficiales)
    // { start: '2027-07-12', end: '2027-07-25' } // ← ejemplo próximo año
  ];
  // Anuncio anticipado: se muestra desde antes y hasta el fin del receso
  var PROMO_RANGES = [
    { start: '2026-06-20', end: '2026-07-19' }   // promoción vacaciones de invierno 2026
    // { start: '2027-06-20', end: '2027-07-25' } // ← ejemplo próximo año
  ];
  window.POMAIRE_WINTER_RANGES = WINTER_RANGES;
  window.POMAIRE_PROMO_RANGES = PROMO_RANGES;

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
  // ¿Hoy se debe mostrar el anuncio promocional (anticipado + durante)?
  window.isPomaireWinterPromo = function(date){ return inRanges(PROMO_RANGES, date); };

  // Mostrar/ocultar elementos marcados (van ocultos por defecto)
  function applyWinterBanners(){
    var w = window.isPomaireWinter();
    document.querySelectorAll('[data-winter]').forEach(function(el){
      el.style.display = w ? '' : 'none';
    });
    var p = window.isPomaireWinterPromo();
    document.querySelectorAll('[data-winter-promo]').forEach(function(el){
      el.style.display = p ? '' : 'none';
    });
    updatePromoHeight();
  }
  window.applyWinterBanners = applyWinterBanners;

  // Mide la altura real de la barra superior fija y la expone como --promoH,
  // para que el nav (sticky) se ubique justo debajo sin solaparse.
  function updatePromoHeight(){
    var root = document.documentElement;
    var bar = document.querySelector('.home-promo[data-winter-promo]');
    var h = (bar && bar.offsetParent !== null) ? bar.offsetHeight : 0;
    root.style.setProperty('--promoH', h + 'px');
  }
  window.updatePromoHeight = updatePromoHeight;

  // Recalcular ante cambios de tamaño/orientación (el texto puede ajustar líneas)
  window.addEventListener('resize', updatePromoHeight);
  window.addEventListener('orientationchange', updatePromoHeight);
  window.addEventListener('load', updatePromoHeight);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyWinterBanners);
  } else {
    applyWinterBanners();
  }
})();
