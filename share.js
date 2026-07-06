/* share.js - Floating share bar for Pomaire 360
   Auto-initializes on DOMContentLoaded.
   Reads og:url / og:title or falls back to location.href / document.title. */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var url = (function () {
      var m = document.querySelector('meta[property="og:url"]');
      return m ? m.getAttribute('content') : window.location.href;
    })();

    var title = (function () {
      var m = document.querySelector('meta[property="og:title"]');
      return m ? m.getAttribute('content') : document.title;
    })();

    // SVG icons (compact inline)
    var icons = {
      whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.198.297-.767.966-.94 1.164-.174.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.654-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.981.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>',
      facebook: '<svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
      twitter: '<svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
      copy: '<svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>'
    };

    // Build the bar
    var bar = document.createElement('div');
    bar.className = 'share-bar';
    bar.setAttribute('aria-label', 'Compartir esta pagina');

    var encodedUrl = encodeURIComponent(url);
    var encodedTitle = encodeURIComponent(title);

    var buttons = [
      {
        label: 'Compartir en WhatsApp',
        href: 'https://wa.me/?text=' + encodedTitle + '%20' + encodedUrl,
        icon: icons.whatsapp,
        cls: 'share-btn share-btn--whatsapp'
      },
      {
        label: 'Compartir en Facebook',
        href: 'https://www.facebook.com/sharer/sharer.php?u=' + encodedUrl,
        icon: icons.facebook,
        cls: 'share-btn share-btn--facebook'
      },
      {
        label: 'Compartir en Twitter',
        href: 'https://twitter.com/intent/tweet?url=' + encodedUrl + '&text=' + encodedTitle,
        icon: icons.twitter,
        cls: 'share-btn share-btn--twitter'
      },
      {
        label: 'Copiar enlace',
        href: '#',
        icon: icons.copy,
        cls: 'share-btn share-btn--copy',
        isCopy: true
      }
    ];

    buttons.forEach(function (btn) {
      var a = document.createElement('a');
      a.className = btn.cls;
      a.setAttribute('aria-label', btn.label);
      a.setAttribute('title', btn.label);
      a.innerHTML = btn.icon;

      if (btn.isCopy) {
        a.href = '#';
        a.addEventListener('click', function (e) {
          e.preventDefault();
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(url).then(function () {
              showCopied(a);
            }).catch(function () {
              fallbackCopy(url, a);
            });
          } else {
            fallbackCopy(url, a);
          }
        });
      } else {
        a.href = btn.href;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
      }

      bar.appendChild(a);
    });

    document.body.appendChild(bar);

    function showCopied(el) {
      var tip = document.createElement('span');
      tip.className = 'share-btn-tip';
      tip.textContent = 'Copiado!';
      el.appendChild(tip);
      setTimeout(function () {
        if (tip.parentNode) tip.parentNode.removeChild(tip);
      }, 1800);
    }

    function fallbackCopy(text, el) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); showCopied(el); } catch (e) { /* silent */ }
      document.body.removeChild(ta);
    }
  });
})();
