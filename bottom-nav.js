/* ═══════════════════════════════════════════════════════════════════════════
   bottom-nav.js — Pomaire 360 · Bottom Navigation Logic 2026
   Section detection (scroll spy), hide on scroll down, "More" menu,
   ripple effect, smooth scroll to sections.
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var bottomNav = document.getElementById('bottomNav');
  if (!bottomNav) return;

  var navItems = bottomNav.querySelectorAll('.bottom-nav-item[data-section]');
  var moreBtn = bottomNav.querySelector('.bottom-nav-more-btn');
  var moreMenu = document.getElementById('bnMoreMenu');

  // ── SCROLL SPY: detect active section ──────────────────────────────────
  var sections = [];
  navItems.forEach(function (item) {
    var sectionId = item.getAttribute('data-section');
    var section = document.getElementById(sectionId);
    if (section) {
      sections.push({ id: sectionId, el: section, navItem: item });
    }
  });

  function updateActiveSection() {
    var scrollY = window.scrollY || document.documentElement.scrollTop;
    var windowHeight = window.innerHeight;
    var activeId = null;

    // Find which section is most visible
    for (var i = sections.length - 1; i >= 0; i--) {
      var s = sections[i];
      var rect = s.el.getBoundingClientRect();
      // Section is considered active if its top is within the upper 60% of viewport
      if (rect.top <= windowHeight * 0.5) {
        activeId = s.id;
        break;
      }
    }

    // Default to first section if at top
    if (!activeId && sections.length > 0 && scrollY < 200) {
      activeId = sections[0].id;
    }

    // Update classes
    navItems.forEach(function (item) {
      var isActive = item.getAttribute('data-section') === activeId;
      item.classList.toggle('active', isActive);
      item.setAttribute('aria-current', isActive ? 'true' : 'false');
    });
  }

  // ── HIDE ON SCROLL DOWN, SHOW ON SCROLL UP ─────────────────────────────
  var lastScrollY = 0;
  var scrollDelta = 0;
  var hideThreshold = 15;
  var isHidden = false;

  function updateNavVisibility() {
    var currentScrollY = window.scrollY || document.documentElement.scrollTop;
    var diff = currentScrollY - lastScrollY;

    if (diff > 0) {
      // Scrolling down
      scrollDelta += diff;
      if (scrollDelta > hideThreshold && !isHidden && currentScrollY > 300) {
        bottomNav.classList.add('hidden');
        isHidden = true;
        closeMoreMenu();
      }
    } else {
      // Scrolling up
      scrollDelta = 0;
      if (isHidden) {
        bottomNav.classList.remove('hidden');
        isHidden = false;
      }
    }

    lastScrollY = currentScrollY;
  }

  // ── THROTTLED SCROLL HANDLER ───────────────────────────────────────────
  var ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(function () {
        updateActiveSection();
        updateNavVisibility();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // ── SMOOTH SCROLL TO SECTION ───────────────────────────────────────────
  navItems.forEach(function (item) {
    item.addEventListener('click', function (e) {
      var sectionId = this.getAttribute('data-section');
      var href = this.getAttribute('href');

      // If it's an internal anchor, smooth scroll
      if (sectionId && document.getElementById(sectionId)) {
        e.preventDefault();
        var target = document.getElementById(sectionId);
        var navHeight = document.querySelector('nav') ? document.querySelector('nav').offsetHeight : 0;
        var targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight - 10;

        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });

        // Immediately mark as active
        navItems.forEach(function (ni) { ni.classList.remove('active'); });
        this.classList.add('active');

        // Ripple feedback
        addRipple(this);
      }
      // For external links (href="/..."), let normal navigation happen
    });
  });

  // ── RIPPLE EFFECT ──────────────────────────────────────────────────────
  function addRipple(item) {
    item.classList.add('ripple');
    setTimeout(function () {
      item.classList.remove('ripple');
    }, 400);
  }

  // ── "MORE" MENU LOGIC ──────────────────────────────────────────────────
  function closeMoreMenu() {
    if (moreMenu) moreMenu.classList.remove('open');
    if (moreBtn) {
      moreBtn.setAttribute('aria-expanded', 'false');
      moreBtn.classList.remove('active');
    }
  }

  function toggleMoreMenu(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!moreMenu) return;

    var isOpen = moreMenu.classList.toggle('open');
    if (moreBtn) {
      moreBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      moreBtn.classList.toggle('active', isOpen);
    }
    addRipple(moreBtn);
  }

  if (moreBtn) {
    moreBtn.addEventListener('click', toggleMoreMenu);
  }

  // Close more menu on outside click
  document.addEventListener('click', function (e) {
    if (moreMenu && moreMenu.classList.contains('open')) {
      if (!e.target.closest('.bottom-nav-more-menu') && !e.target.closest('.bottom-nav-more-btn')) {
        closeMoreMenu();
      }
    }
  });

  // Close more menu on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && moreMenu && moreMenu.classList.contains('open')) {
      closeMoreMenu();
      if (moreBtn) moreBtn.focus();
    }
  });

  // ── INIT ───────────────────────────────────────────────────────────────
  updateActiveSection();

  // Expose close function for external use
  window.closeBottomNavMore = closeMoreMenu;
})();
