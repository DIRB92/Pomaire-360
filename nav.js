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
   BOTÓN FLOTANTE — Pomaire Arcade (/juegos/)
   Vive dentro de .social-fab, arriba del botón de TikTok, en TODAS las
   páginas del sitio (home y subpáginas, ya que nav.js se carga en todas).
   Se puede cerrar con la X y se recuerda esa preferencia por unos días.
   ══════════════════════════════════════════════════════════════════════════ */
(function () {
  var STORE_KEY = 'p360_games_float';
  var REVISIT_DAYS = 7;

  function isDismissed() {
    try {
      var v = localStorage.getItem(STORE_KEY);
      if (!v) return false;
      var ts = parseInt(v, 10);
      if (isNaN(ts)) return true;
      return (Date.now() - ts) < REVISIT_DAYS * 86400000;
    } catch (e) { return false; }
  }

  function init() {
    var wrap = document.getElementById('gamesFloatWrap');
    if (!wrap) return;
    if (isDismissed()) { wrap.remove(); return; }

    var closeBtn = wrap.querySelector('.games-float-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        try { localStorage.setItem(STORE_KEY, String(Date.now())); } catch (err) {}
        if (wrap && wrap.parentNode) wrap.remove();
      });
    }
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


/* ══════════════════════════════════════════════════════════════════════════
   BOTÓN "ACCESO COMERCIANTES" — Inyectado dinámicamente en la nav.
   Se muestra como un enlace discreto al lado del CTA "Apoyar", que lleva
   a /admin/ (la página puente hacia app.pomaire360.cl/auth/login).
   ══════════════════════════════════════════════════════════════════════════ */
(function () {
  function injectAdminLink() {
    var navWrap = document.getElementById('navGroups');
    if (!navWrap) return;

    // Evitar doble inyección
    if (navWrap.querySelector('.nav-admin-btn')) return;

    // No inyectar en la propia página /admin/ (ya está implícito)
    if (window.location.pathname.indexOf('/admin') === 0) return;

    var link = document.createElement('a');
    link.className = 'nav-admin-btn';
    link.href = '/admin/';
    link.innerHTML = '🔐 <span data-t="nav_admin">Comerciantes</span>';
    link.title = 'Acceso al panel de comerciantes';

    // Insertar después del CTA de Apoyar
    var cta = navWrap.querySelector('.nav-cta');
    if (cta && cta.nextSibling) {
      navWrap.insertBefore(link, cta.nextSibling);
    } else {
      navWrap.appendChild(link);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectAdminLink);
  } else {
    injectAdminLink();
  }
})();
