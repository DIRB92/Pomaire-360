/* card-share.js - Pomaire 360
   Agrega un botón de "Compartir" individual a cada tarjeta de contenido
   (.card, .card-v2, .wine-card, .dir-item) para que los visitantes puedan
   compartir un atractivo, servicio o negocio puntual — no solo la página
   completa. Usa la Web Share API nativa cuando está disponible y cae a
   WhatsApp como respaldo, igual que el resto de los botones del sitio.

   Cada ficha de negocio tiene un id único (slug) que se incluye como #ancla
   en la URL compartida, para que el destinatario llegue directo a esa ficha. */

(function () {
  'use strict';

  var CARD_SELECTOR = '.card, .card-v2, .wine-card, .event-card, .dir-item';
  var DETAIL_SELECTOR = '.card-detail, .cv2-detail, .event-info p, p';

  function getText(card, selector) {
    var el = card.querySelector(selector);
    return el ? el.textContent.replace(/\s+/g, ' ').trim() : '';
  }

  /** Devuelve la URL base de la página sin hash */
  function pageUrl() {
    return window.location.href.split('#')[0];
  }

  /** Construye la URL completa con el ancla única del negocio */
  function cardUrl(card) {
    var cardId = card.getAttribute('id');
    return pageUrl() + (cardId ? '#' + cardId : '');
  }

  function buildShareData(card) {
    var isDirItem = card.classList.contains('dir-item');
    var title = getText(card, 'h3') || getText(card, '.dir-name') || document.title;
    var url = cardUrl(card);
    var text;

    if (isDirItem) {
      var addr = getText(card, '.dir-addr');
      var tag = getText(card, '.dir-tag');
      var parts = [title];
      if (tag) parts.push(tag);
      if (addr) parts.push(addr);
      parts.push('Pomaire 360');
      text = parts.join(' — ');
    } else {
      var detail = getText(card, DETAIL_SELECTOR);
      text = detail ? (title + ' — ' + detail) : title;
    }

    return { title: title, text: text, url: url };
  }

  function shareCard(card, btn) {
    var data = buildShareData(card);

    // Web Share API (móviles y navegadores compatibles)
    if (navigator.share) {
      navigator.share(data).catch(function () {});
      return;
    }

    // Fallback: copiar al portapapeles
    if (navigator.clipboard && navigator.clipboard.writeText) {
      var copyText = data.text + '\n' + data.url;
      navigator.clipboard.writeText(copyText).then(function () {
        showTip(btn, '¡Enlace copiado!');
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

  function showTip(btn, message) {
    // Remover tip anterior si existe
    var existing = btn.querySelector('.card-share-tip');
    if (existing) existing.parentNode.removeChild(existing);

    var tip = document.createElement('span');
    tip.className = 'card-share-tip';
    tip.textContent = message || '¡Copiado!';
    btn.appendChild(tip);
    setTimeout(function () {
      if (tip.parentNode) tip.parentNode.removeChild(tip);
    }, 2000);
  }

  var ICON = '<svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15" aria-hidden="true">' +
    '<path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/></svg>';

  function injectButton(card) {
    if (card.querySelector('.card-share-btn')) return;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'card-share-btn';
    btn.setAttribute('aria-label', 'Compartir esta ficha');
    btn.setAttribute('title', 'Compartir enlace directo a esta ficha');
    btn.innerHTML = ICON;
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      shareCard(card, btn);
    });
    card.appendChild(btn);
  }

  function injectButtons() {
    document.querySelectorAll(CARD_SELECTOR).forEach(function (card) {
      injectButton(card);
    });
  }

  // ─── Observador para fichas renderizadas dinámicamente ──────────────────
  // El directorio se carga desde Supabase o JSON después del DOMContentLoaded,
  // así que usamos MutationObserver para detectar nuevas fichas e inyectar botones.
  function observeNewCards() {
    if (!window.MutationObserver) return;

    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        mutation.addedNodes.forEach(function (node) {
          if (node.nodeType !== 1) return; // solo elementos
          // Si el nodo añadido es una tarjeta
          if (node.matches && node.matches(CARD_SELECTOR)) {
            injectButton(node);
          }
          // Si el nodo contiene tarjetas hijas
          if (node.querySelectorAll) {
            node.querySelectorAll(CARD_SELECTOR).forEach(function (card) {
              injectButton(card);
            });
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  // ─── Inicialización ─────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      injectButtons();
      observeNewCards();
    });
  } else {
    injectButtons();
    observeNewCards();
  }
})();
