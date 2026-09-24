/* ═══════════════════════════════════════════════════════════════════════════
   event-popup.js — Banner flotante del evento "2° Encuentro de Bandas —
   Pomaire en Toque de Guerra". Muestra un modal sobre fondo semitransparente
   con el banner del evento; al pinchar lleva a la página del evento.
   Aparece unos segundos tras cargar la portada y se cierra solo (auto-cierre),
   pero el usuario lo puede sacar en cualquier momento (X, fondo o tecla Esc).
   Si el usuario lo cierra manualmente, no vuelve a molestar (localStorage).
   Se autodesactiva tras la fecha del evento.
   Banner responsivo: imagen horizontal en escritorio, vertical en móvil.
   Componente autónomo: sin dependencias, inyecta su propio CSS y HTML.
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  // ── Configuración del evento ───────────────────────────────────────────
  var EVENT_URL = "/evento/encuentro-de-bandas-pomaire/";
  var EVENT_EXPIRES = new Date("2026-09-27T00:00:00-03:00"); // día después del evento (26 sept)
  var STORAGE_KEY = "p360_popup_bandas_2026"; // marca de "ya lo cerré"
  var AUTO_CLOSE_MS = 8000; // se cierra solo tras ~8 s (0 = desactivar autocierre)

  // Banner responsivo. La imagen horizontal se usa en pantallas anchas y la
  // vertical en móvil (más alta). Deben subirse a /img/eventos/.
  var BANNER = {
    href: EVENT_URL,
    alt: "2° Encuentro de Bandas — Pomaire en Toque de Guerra. Viernes 26 de septiembre en Pomaire.",
    horizontal: { src: "/img/eventos/encuentro-de-bandas-pomaire-hrzt.webp", w: 1024, h: 410 },
    vertical:    { src: "/img/eventos/encuentro-de-bandas-pomaire.webp",      w: 576,  h: 1024 }
  };

  // ── Textos por idioma (según <html lang>) ──────────────────────────────
  var T = {
    es: { cta: "Conoce todos los detalles →", close: "Cerrar", dont: "No volver a mostrar" },
    en: { cta: "See all the details →", close: "Close", dont: "Don't show again" },
    pt: { cta: "Veja todos os detalhes →", close: "Fechar", dont: "Não mostrar de novo" },
    ja: { cta: "詳細を見る →", close: "閉じる", dont: "今後表示しない" }
  };

  // ── Guardas: no mostrar si ya pasó el evento o el usuario lo cerró ──────
  function shouldShow() {
    try {
      if (new Date() >= EVENT_EXPIRES) return false;
      if (localStorage.getItem(STORAGE_KEY) === "closed") return false;
    } catch (e) { /* localStorage bloqueado: mostrar igual */ }
    // Solo en la home (raíz de cada idioma), no dentro de la propia página del evento
    var p = location.pathname.replace(/index\.html$/, "");
    var isHome = /^\/(en\/|pt\/|ja\/)?$/.test(p);
    return isHome;
  }

  function lang() {
    var l = (document.documentElement.lang || "es").slice(0, 2).toLowerCase();
    return T[l] ? l : "es";
  }

  // ── Inyección de estilos ────────────────────────────────────────────────
  function injectCSS() {
    if (document.getElementById("evtPopupCSS")) return;
    var css = ""
      + ".evtp-overlay{position:fixed;inset:0;z-index:100000;display:flex;align-items:center;justify-content:center;padding:1rem;background:rgba(20,12,4,.72);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);opacity:0;transition:opacity .25s ease}"
      + ".evtp-overlay.is-open{opacity:1}"
      // Escritorio: banner horizontal ancho. Móvil: banner vertical (ver media query)
      + ".evtp-modal{position:relative;width:min(760px,100%);max-height:92vh;overflow:hidden;background:#fff;border-radius:18px;box-shadow:0 24px 70px rgba(0,0,0,.5);transform:translateY(12px) scale(.98);transition:transform .28s cubic-bezier(.2,.7,.3,1);display:flex;flex-direction:column}"
      + ".evtp-overlay.is-open .evtp-modal{transform:none}"
      + ".evtp-close{position:absolute;top:.6rem;right:.6rem;z-index:3;width:40px;height:40px;border:none;border-radius:50%;background:rgba(0,0,0,.55);color:#fff;font-size:1.25rem;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .15s}"
      + ".evtp-close:hover{background:rgba(0,0,0,.85)}"
      + ".evtp-close:focus-visible{outline:3px solid #E6B246;outline-offset:2px}"
      + ".evtp-banner{display:block;line-height:0;background:#2D1A0A}"
      + ".evtp-banner img{width:100%;height:auto;display:block}"
      // Barra de progreso del autocierre
      + ".evtp-timer{position:absolute;left:0;right:0;bottom:0;z-index:3;height:4px;background:rgba(255,255,255,.25)}"
      + ".evtp-timer-fill{height:100%;width:100%;background:linear-gradient(90deg,#D4654A,#E6B246);transform-origin:left;transform:scaleX(1)}"
      + ".evtp-foot{padding:.9rem 1rem 1rem;text-align:center}"
      + ".evtp-cta{display:inline-block;width:100%;box-sizing:border-box;padding:.9rem 1.2rem;border-radius:12px;background:linear-gradient(135deg,#D4654A,#B84A32);color:#fff;font-weight:800;font-size:1.02rem;text-decoration:none;box-shadow:0 6px 18px rgba(184,74,50,.35);transition:transform .15s}"
      + ".evtp-cta:hover{transform:translateY(-2px)}"
      + ".evtp-cta:focus-visible{outline:3px solid #E6B246;outline-offset:2px}"
      + ".evtp-dont{display:block;margin:.7rem auto 0;background:none;border:none;color:#8A7E76;font-size:.8rem;cursor:pointer;text-decoration:underline}"
      // En móvil el modal es más angosto para lucir el banner vertical
      + "@media (max-width:600px){.evtp-modal{width:min(420px,100%)}}"
      + "@media (prefers-reduced-motion:reduce){.evtp-overlay,.evtp-modal,.evtp-cta{transition:none}.evtp-timer-fill{transition:none !important}}";
    var s = document.createElement("style");
    s.id = "evtPopupCSS";
    s.textContent = css;
    document.head.appendChild(s);
  }

  // ── Construcción del modal ──────────────────────────────────────────────
  function build() {
    var t = T[lang()];
    var alt = BANNER.alt.replace(/"/g, "&quot;");
    var overlay = document.createElement("div");
    overlay.className = "evtp-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "2° Encuentro de Bandas — Pomaire en Toque de Guerra");

    // <picture>: vertical en móvil, horizontal en pantallas anchas
    var picture = ''
      + '<picture>'
      + '  <source media="(min-width:601px)" srcset="' + BANNER.horizontal.src + '" width="' + BANNER.horizontal.w + '" height="' + BANNER.horizontal.h + '">'
      + '  <img src="' + BANNER.vertical.src + '" alt="' + alt + '" width="' + BANNER.vertical.w + '" height="' + BANNER.vertical.h + '" fetchpriority="high">'
      + '</picture>';

    var timer = AUTO_CLOSE_MS > 0
      ? '<div class="evtp-timer" aria-hidden="true"><div class="evtp-timer-fill"></div></div>'
      : '';

    overlay.innerHTML = ''
      + '<div class="evtp-modal">'
      + '  <button class="evtp-close" type="button" aria-label="' + t.close + '">✕</button>'
      + '  <a class="evtp-banner" href="' + BANNER.href + '" aria-label="' + t.cta + '">' + picture + '</a>'
      + '  <div class="evtp-foot">'
      + '    <a class="evtp-cta" href="' + BANNER.href + '">' + t.cta + '</a>'
      + '    <button class="evtp-dont" type="button">' + t.dont + '</button>'
      + '  </div>'
      + '  ' + timer
      + '</div>';

    return overlay;
  }

  // ── Lógica de apertura/cierre y autocierre ──────────────────────────────
  function open() {
    injectCSS();
    var overlay = build();
    document.body.appendChild(overlay);
    var prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(function () { overlay.classList.add("is-open"); });

    var autoTimer = null;

    function remember() { try { localStorage.setItem(STORAGE_KEY, "closed"); } catch (e) {} }
    function close(persist) {
      if (persist) remember();
      if (autoTimer) { clearTimeout(autoTimer); autoTimer = null; }
      overlay.classList.remove("is-open");
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      setTimeout(function () { if (overlay.parentNode) overlay.parentNode.removeChild(overlay); }, 280);
    }
    function onKey(e) { if (e.key === "Escape") close(false); }

    overlay.querySelector(".evtp-close").addEventListener("click", function () { close(true); });
    overlay.querySelector(".evtp-dont").addEventListener("click", function () { close(true); });
    // Clic en el fondo (fuera del modal) cierra sin persistir
    overlay.addEventListener("click", function (e) { if (e.target === overlay) close(false); });
    document.addEventListener("keydown", onKey);

    // Autocierre tras unos segundos (el usuario lo puede sacar antes).
    // Cerrar por temporizador NO persiste: puede reaparecer en otra visita.
    if (AUTO_CLOSE_MS > 0) {
      var fill = overlay.querySelector(".evtp-timer-fill");
      if (fill) {
        requestAnimationFrame(function () {
          fill.style.transition = "transform " + AUTO_CLOSE_MS + "ms linear";
          fill.style.transform = "scaleX(0)";
        });
      }
      autoTimer = setTimeout(function () { close(false); }, AUTO_CLOSE_MS);
      // Si el usuario interactúa (hover/touch), cancelamos el autocierre
      overlay.querySelector(".evtp-modal").addEventListener("pointerenter", function () {
        if (autoTimer) { clearTimeout(autoTimer); autoTimer = null; }
        if (fill) { fill.style.transition = "none"; fill.style.transform = "scaleX(0)"; fill.style.opacity = "0"; }
      }, { once: true });
    }
  }

  function init() {
    if (!shouldShow()) return;
    // Pequeño retraso para no competir con el render inicial del hero
    setTimeout(open, 1200);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
