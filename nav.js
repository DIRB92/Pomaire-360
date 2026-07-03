/* ══════════════════════════════════════════════════════════════════════════
   nav.js — Menú de navegación compartido · Pomaire 360
   Usado en la home Y en todas las subpáginas para que el menú completo
   (con categorías desplegables) se vea siempre, sin importar la página.
   ══════════════════════════════════════════════════════════════════════════ */
(function () {
  function closeAllGroups() {
    document.querySelectorAll('.nav-group.open').forEach(function (g) {
      g.classList.remove('open');
      var b = g.querySelector('.nav-group-btn');
      if (b) b.setAttribute('aria-expanded', 'false');
    });
  }

  function toggleGroup(e, btn) {
    e.stopPropagation();
    var group = btn.parentElement;
    var wasOpen = group.classList.contains('open');
    closeAllGroups();
    if (!wasOpen) {
      group.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  }

  function toggleNav(e) {
    e.stopPropagation();
    var wrap = document.getElementById('navGroups');
    var burger = document.getElementById('navBurger');
    if (!wrap) return;
    var open = wrap.classList.toggle('open');
    if (burger) burger.setAttribute('aria-expanded', open);
    if (!open) closeAllGroups();
  }

  window.closeAllGroups = closeAllGroups;
  window.toggleGroup = toggleGroup;
  window.toggleNav = toggleNav;

  // Cerrar los desplegables al hacer clic fuera de ellos
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav-group')) closeAllGroups();
  });

  function init() {
    function closeMobileNav() {
      closeAllGroups();
      var wrap = document.getElementById('navGroups');
      var burger = document.getElementById('navBurger');
      if (wrap && wrap.classList.contains('open')) {
        wrap.classList.remove('open');
        if (burger) burger.setAttribute('aria-expanded', 'false');
      }
    }
    // Cerrar el menú móvil al elegir cualquier opción
    document.querySelectorAll('.nav-menu a, .nav-cta, .nav-map-btn').forEach(function (a) {
      a.addEventListener('click', closeMobileNav);
    });
    // Cerrar el menú móvil al hacer scroll (subir o bajar)
    var lastY = window.scrollY;
    window.addEventListener('scroll', function () {
      var wrap = document.getElementById('navGroups');
      if (wrap && wrap.classList.contains('open') && Math.abs(window.scrollY - lastY) > 10) {
        closeMobileNav();
      }
      lastY = window.scrollY;
    }, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/* ══════════════════════════════════════════════════════════════════════════
   Hero slideshow — rota las fotos de fondo del hero cada pocos segundos.
   Respeta prefers-reduced-motion (deja fija la primera foto sin animar).
   ══════════════════════════════════════════════════════════════════════════ */
(function () {
  function initHeroSlideshow() {
    var slides = document.querySelectorAll('.hero-slideshow .hero-slide');
    if (slides.length < 2) return;

    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return; // deja solo la primera foto (is-active), sin rotar

    var current = 0;
    setInterval(function () {
      slides[current].classList.remove('is-active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('is-active');
    }, 5000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroSlideshow);
  } else {
    initHeroSlideshow();
  }
})();
