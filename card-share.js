/* card-share.js - Pomaire 360
   Agrega un botón de "Compartir" individual a cada tarjeta de contenido
   (.card, .card-v2, .wine-card) para que los visitantes puedan compartir
   un atractivo, servicio o dato puntual — no solo la página completa.
   Usa la Web Share API nativa cuando está disponible y cae a WhatsApp
   como respaldo, igual que el resto de los botones de compartir del sitio. */

(function () {
  'use strict';

  var CARD_SELECTOR = '.card, .card-v2, .wine-card, .event-card';
  var DETAIL_SELECTOR = '.card-detail, .cv2-detail, .event-info p, p';

  function getText(card, selector) {
    var el = card.querySelector(selector);
    return el ? el.textContent.replace(/\s+/g, ' ').trim() : '';
  }

  function pageUrl() {
    return window.location.href.split('#')[0];
  }

  function buildShareData(card) {
    var title = getText(card, 'h3') || document.title;
    var detail = getText(card, DETAIL_SELECTOR);
    var url = pageUrl();
    var text = detail ? (title + ' — ' + detail) : title;
    return { title: title, text: text, url: url };
  }

  function shareCard(card, btn) {
    var data = buildShareData(card);
    if (navigator.share) {
      navigator.share(data).catch(function () {});
      return;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(data.text + ' ' + data.url).then(function () {
        showTip(btn);
      }).catch(function () {
        openWhatsapp(data);
      });
    } else {
      openWhatsapp(data);
    }
  }

  function openWhatsapp(data) {
    var msg = data.text + '\n' + data.url;
    window.open('https://wa.me/?text=' + encodeURIComponent(msg), '_blank', 'noopener');
  }

  function showTip(btn) {
    var tip = document.createElement('span');
    tip.className = 'card-share-tip';
    tip.textContent = '¡Copiado!';
    btn.appendChild(tip);
    setTimeout(function () {
      if (tip.parentNode) tip.parentNode.removeChild(tip);
    }, 1600);
  }

  var ICON = '<svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15" aria-hidden="true">' +
    '<path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/></svg>';

  function injectButtons() {
    document.querySelectorAll(CARD_SELECTOR).forEach(function (card) {
      if (card.querySelector('.card-share-btn')) return;
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'card-share-btn';
      btn.setAttribute('aria-label', 'Compartir');
      btn.setAttribute('title', 'Compartir');
      btn.innerHTML = ICON;
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        shareCard(card, btn);
      });
      card.appendChild(btn);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectButtons);
  } else {
    injectButtons();
  }
})();
