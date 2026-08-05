/* ═══════════════════════════════════════════════════════════════════════════
   app-2026.js — Pomaire 360 · Interacciones Modernas 2026
   Scroll progress, parallax hero, nav glass transition, reveal animations,
   staggered children, counter animations, smooth section transitions.
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  // ── SCROLL PROGRESS BAR ────────────────────────────────────────────────
  var progressBar = document.getElementById('scrollProgress');

  function updateScrollProgress() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return;
    var progress = (scrollTop / docHeight) * 100;
    if (progressBar) {
      progressBar.style.width = progress + '%';
    }
  }

  // ── NAV GLASSMORPHISM ON SCROLL ────────────────────────────────────────
  var nav = document.querySelector('nav');
  var lastScrollY = 0;
  var navScrolled = false;

  function updateNavState() {
    var scrollY = window.scrollY || document.documentElement.scrollTop;
    if (scrollY > 60 && !navScrolled) {
      navScrolled = true;
      if (nav) nav.classList.add('scrolled');
    } else if (scrollY <= 60 && navScrolled) {
      navScrolled = false;
      if (nav) nav.classList.remove('scrolled');
    }
    lastScrollY = scrollY;
  }

  // ── HERO PARALLAX EFFECT ───────────────────────────────────────────────
  var heroSection = document.getElementById('inicio');
  var heroSlideshow = heroSection ? heroSection.querySelector('.hero-slideshow') : null;

  function updateHeroParallax() {
    if (!heroSlideshow || !heroSection) return;
    var scrollY = window.scrollY || document.documentElement.scrollTop;
    var heroHeight = heroSection.offsetHeight;
    if (scrollY > heroHeight) return;
    // Parallax: background moves slower than scroll
    var parallaxOffset = scrollY * 0.35;
    heroSlideshow.style.transform = 'translateY(' + parallaxOffset + 'px) scale(1.05)';
    // Fade out hero content as user scrolls
    var opacity = 1 - (scrollY / (heroHeight * 0.7));
    var heroContent = heroSection.querySelectorAll('.hero-tag, h1, .hero-sub, .hero-cta-row, .dir-search-wrap, .sites-bar');
    heroContent.forEach(function (el) {
      el.style.opacity = Math.max(0, opacity);
      el.style.transform = 'translateY(' + (scrollY * 0.15) + 'px)';
    });
  }


  // ── SCROLL-TRIGGERED REVEAL ANIMATIONS ─────────────────────────────────
  function initRevealObserver() {
    var reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-scale, .stagger-children');
    if (!reveals.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(function (el) {
      observer.observe(el);
    });
  }

  // ── COUNTER ANIMATION (for stats/numbers) ──────────────────────────────
  function animateCounters() {
    var counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var target = parseInt(el.getAttribute('data-count'), 10);
          var duration = 1500;
          var start = 0;
          var startTime = null;

          function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            // Ease out cubic
            var eased = 1 - Math.pow(1 - progress, 3);
            var current = Math.floor(eased * target);
            el.textContent = current.toLocaleString();
            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              el.textContent = target.toLocaleString();
            }
          }
          requestAnimationFrame(step);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) {
      counterObserver.observe(el);
    });
  }

  // ── SMOOTH SECTION TRANSITIONS (color shifts) ──────────────────────────
  function initSectionTransitions() {
    var sections = document.querySelectorAll('section[id]');
    if (!sections.length) return;

    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // Add active class for optional per-section styling
          entry.target.classList.add('section-active');
        } else {
          entry.target.classList.remove('section-active');
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: '-80px 0px -80px 0px'
    });

    sections.forEach(function (s) {
      sectionObserver.observe(s);
    });
  }


  // ── HERO SCROLL HINT HIDE ON SCROLL ────────────────────────────────────
  var scrollHint = document.querySelector('.hero-scroll-hint');
  var scrollHintHidden = false;

  function hideScrollHint() {
    if (scrollHintHidden) return;
    var scrollY = window.scrollY || document.documentElement.scrollTop;
    if (scrollY > 100 && scrollHint) {
      scrollHint.style.opacity = '0';
      scrollHint.style.pointerEvents = 'none';
      scrollHintHidden = true;
    }
  }

  // ── STORY CHAPTER PROGRESS INDICATORS ──────────────────────────────────
  function initChapterProgress() {
    var chapters = document.querySelectorAll('.story-chapter');
    if (!chapters.length) return;

    chapters.forEach(function (ch, i) {
      // Add a subtle number prefix
      var num = i + 1;
      ch.setAttribute('data-chapter-num', num);
    });
  }

  // ── PERFORMANCE: THROTTLED SCROLL HANDLER ──────────────────────────────
  var ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(function () {
        updateScrollProgress();
        updateNavState();
        updateHeroParallax();
        hideScrollHint();
        ticking = false;
      });
      ticking = true;
    }
  }

  // ── REDUCED MOTION CHECK ───────────────────────────────────────────────
  var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── INIT ───────────────────────────────────────────────────────────────
  function init() {
    // Scroll progress
    updateScrollProgress();
    updateNavState();

    // Only enable animations if user hasn't requested reduced motion
    if (!prefersReducedMotion) {
      window.addEventListener('scroll', onScroll, { passive: true });
      initRevealObserver();
      animateCounters();
      initSectionTransitions();
      initChapterProgress();
    } else {
      // Still show content but without animations
      document.querySelectorAll('.reveal, .reveal-left, .reveal-scale, .stagger-children').forEach(function (el) {
        el.classList.add('visible');
      });
      // Still track scroll for progress bar (lightweight)
      window.addEventListener('scroll', function () {
        updateScrollProgress();
        updateNavState();
      }, { passive: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
