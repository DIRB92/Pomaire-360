/* ═══════════════════════════════════════════════════════════════════════════
   event-popup.js — Propaganda flotante del evento "Concurso de la Mejor
   Empanada de Pomaire". Muestra un modal sobre fondo semitransparente con
   las imágenes del evento; al pinchar lleva a la página del evento.
   Se puede cerrar (X, fondo o tecla Esc) y no vuelve a molestar en la misma
   sesión/día si el usuario lo cerró. Se autodesactiva tras la fecha del evento.
   Componente autónomo: sin dependencias, inyecta su propio CSS y HTML.
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  // ── Configuración del evento ───────────────────────────────────────────
  var EVENT_URL = "/evento/mejor-empanada-de-pomaire/";
  var EVENT_EXPIRES = new Date("2026-09-06T00:00:00-03:00"); // día después del evento
  var STORAGE_KEY = "p360_popup_empanada_2026"; // marca de "ya lo cerré"
  var IMAGES = [
    { src: "/img/eventos/mejor-empanada-de-pomaire-hrzt.webp", alt: "Concurso de la Mejor Empanada de Pomaire — sábado 5 de septiembre, 11:30, Plaza de Pomaire" },
    { src: "/img/eventos/Programacion-empanada.webp", alt: "Programación del concurso: bienvenida, cata oficial, folclore, masterclass y premiación" },
    { src: "/img/eventos/Programacion-empanada1.webp", alt: "Invitados: Willy Sabor, Masterclass de Mikel Zulueta y Otakín" }
  ];

  // ── Textos por idioma (según <html lang>) ──────────────────────────────
  var T = {
    es: { cta: "Ver toda la info del evento →", close: "Cerrar", dont: "No volver a mostrar" },
    en: { cta: "See all the event info →", close: "Close", dont: "Don't show again" },
    pt: { cta: "Ver todas as informações do evento →", close: "Fechar", dont: "Não mostrar de novo" },
    ja: { cta: "イベントの詳細を見る →", close: "閉じる", dont: "今後表示しない" }
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
      + ".evtp-modal{position:relative;width:min(440px,100%);max-height:92vh;overflow:hidden;background:#fff;border-radius:18px;box-shadow:0 24px 70px rgba(0,0,0,.5);transform:translateY(12px) scale(.98);transition:transform .28s cubic-bezier(.2,.7,.3,1);display:flex;flex-direction:column}"
      + ".evtp-overlay.is-open .evtp-modal{transform:none}"
      + ".evtp-close{position:absolute;top:.6rem;right:.6rem;z-index:3;width:38px;height:38px;border:none;border-radius:50%;background:rgba(0,0,0,.55);color:#fff;font-size:1.2rem;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .15s}"
      + ".evtp-close:hover{background:rgba(0,0,0,.8)}"
      + ".evtp-stage{position:relative;display:block;background:#2D1A0A;line-height:0}"
      + ".evtp-track{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;scroll-behavior:smooth;scrollbar-width:none}"
      + ".evtp-track::-webkit-scrollbar{display:none}"
      + ".evtp-slide{flex:0 0 100%;scroll-snap-align:center}"
      + ".evtp-slide img{width:100%;height:auto;max-height:74vh;object-fit:contain;display:block;background:#2D1A0A}"
      + ".evtp-nav{position:absolute;top:50%;transform:translateY(-50%);z-index:2;width:38px;height:38px;border:none;border-radius:50%;background:rgba(255,255,255,.85);color:#8C3D16;font-size:1.4rem;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,.25)}"
      + ".evtp-nav--prev{left:.5rem}.evtp-nav--next{right:.5rem}"
      + ".evtp-nav:disabled{opacity:0;pointer-events:none}"
      + ".evtp-dots{position:absolute;bottom:.6rem;left:0;right:0;z-index:2;display:flex;gap:.4rem;justify-content:center}"
      + ".evtp-dot{width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,.5);border:none;padding:0;cursor:pointer}"
      + ".evtp-dot.is-active{background:#fff;width:20px;border-radius:5px}"
      + ".evtp-foot{padding:.9rem 1rem 1rem;text-align:center}"
      + ".evtp-cta{display:inline-block;width:100%;box-sizing:border-box;padding:.85rem 1.2rem;border-radius:12px;background:linear-gradient(135deg,#D4654A,#B84A32);color:#fff;font-weight:800;font-size:1rem;text-decoration:none;box-shadow:0 6px 18px rgba(184,74,50,.35);transition:transform .15s}"
      + ".evtp-cta:hover{transform:translateY(-2px)}"
      + ".evtp-dont{display:block;margin:.7rem auto 0;background:none;border:none;color:#8A7E76;font-size:.8rem;cursor:pointer;text-decoration:underline}"
      + "@media (prefers-reduced-motion:reduce){.evtp-overlay,.evtp-modal,.evtp-cta{transition:none}}";
    var s = document.createElement("style");
    s.id = "evtPopupCSS";
    s.textContent = css;
    document.head.appendChild(s);
  }

  // ── Construcción del modal ──────────────────────────────────────────────
  function build() {
    var t = T[lang()];
    var overlay = document.createElement("div");
    overlay.className = "evtp-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Concurso de la Mejor Empanada de Pomaire");

    var slides = IMAGES.map(function (im, i) {
      return '<a class="evtp-slide" href="' + EVENT_URL + '" aria-label="' + t.cta + '">'
        + '<img src="' + im.src + '" alt="' + im.alt.replace(/"/g, "&quot;") + '" '
        + (i === 0 ? '' : 'loading="lazy" ') + 'width="1200" height="1350"></a>';
    }).join("");

    var dots = IMAGES.map(function (_, i) {
      return '<button class="evtp-dot' + (i === 0 ? ' is-active' : '') + '" type="button" data-i="' + i + '" aria-label="Imagen ' + (i + 1) + '"></button>';
    }).join("");

    overlay.innerHTML = ''
      + '<div class="evtp-modal">'
      + '  <button class="evtp-close" type="button" aria-label="' + t.close + '">✕</button>'
      + '  <div class="evtp-stage">'
      + '    <div class="evtp-track" id="evtpTrack">' + slides + '</div>'
      + '    <button class="evtp-nav evtp-nav--prev" type="button" aria-label="Anterior">‹</button>'
      + '    <button class="evtp-nav evtp-nav--next" type="button" aria-label="Siguiente">›</button>'
      + '    <div class="evtp-dots">' + dots + '</div>'
      + '  </div>'
      + '  <div class="evtp-foot">'
      + '    <a class="evtp-cta" href="' + EVENT_URL + '">' + t.cta + '</a>'
      + '    <button class="evtp-dont" type="button">' + t.dont + '</button>'
      + '  </div>'
      + '</div>';

    return overlay;
  }

  // ── Lógica de apertura/cierre y carrusel ────────────────────────────────
  function open() {
    injectCSS();
    var overlay = build();
    document.body.appendChild(overlay);
    var prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(function () { overlay.classList.add("is-open"); });

    var track = overlay.querySelector("#evtpTrack");
    var dots = Array.prototype.slice.call(overlay.querySelectorAll(".evtp-dot"));
    var prev = overlay.querySelector(".evtp-nav--prev");
    var next = overlay.querySelector(".evtp-nav--next");

    function current() {
      return Math.round(track.scrollLeft / track.clientWidth);
    }
    function goTo(i) {
      i = Math.max(0, Math.min(IMAGES.length - 1, i));
      track.scrollTo({ left: i * track.clientWidth, behavior: "smooth" });
    }
    function update() {
      var c = current();
      dots.forEach(function (d, i) { d.classList.toggle("is-active", i === c); });
      prev.disabled = c <= 0;
      next.disabled = c >= IMAGES.length - 1;
    }
    track.addEventListener("scroll", function () { window.requestAnimationFrame(update); }, { passive: true });
    prev.addEventListener("click", function (e) { e.preventDefault(); e.stopPropagation(); goTo(current() - 1); });
    next.addEventListener("click", function (e) { e.preventDefault(); e.stopPropagation(); goTo(current() + 1); });
    dots.forEach(function (d) {
      d.addEventListener("click", function (e) { e.preventDefault(); e.stopPropagation(); goTo(parseInt(d.dataset.i, 10)); });
    });
    update();

    function remember() { try { localStorage.setItem(STORAGE_KEY, "closed"); } catch (e) {} }
    function close(persist) {
      if (persist) remember();
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
