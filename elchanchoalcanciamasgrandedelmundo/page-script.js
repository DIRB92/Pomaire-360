  function sharePage() {
    var lang = document.documentElement.lang || 'es';
    var L = (window.LANGS && (window.LANGS[lang] || window.LANGS.es)) || {};
    var url = 'https://www.pomaire360.cl/elchanchoalcanciamasgrandedelmundo/';
    var text = L.ch_share_msg || 'El Chancho alcancía de greda más grande del mundo — Pomaire';
    var title = document.title;
    if (navigator.share) {
      navigator.share({ title: title, text: text, url: url }).catch(function(){});
    } else if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text + ' ' + url).then(function(){
        window.open('https://wa.me/?text=' + encodeURIComponent(text + ' ' + url), '_blank', 'noopener');
      }).catch(function(){
        window.open('https://wa.me/?text=' + encodeURIComponent(text + ' ' + url), '_blank', 'noopener');
      });
    } else {
      window.open('https://wa.me/?text=' + encodeURIComponent(text + ' ' + url), '_blank', 'noopener');
    }
  }
  // Fija la barra de anuncio justo debajo del menú de navegación (sticky apilado)
  function syncPromoOffset(){
    var promo = document.querySelector('.ch-promo');
    var topbar = document.querySelector('nav');
    if (!promo || !topbar) return;
    var visible = getComputedStyle(promo).display !== 'none';
    promo.style.top = visible ? topbar.offsetHeight + 'px' : '0px';
  }
  syncPromoOffset();
  window.addEventListener('resize', syncPromoOffset);
  window.addEventListener('load', syncPromoOffset);
