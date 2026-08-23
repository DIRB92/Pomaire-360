(function () {
'use strict';

/* ═══ Forzar scroll al inicio al cargar la página ═══ */
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

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
var heroSection = document.getElementById('inicio');
var heroSlideshow = heroSection ? heroSection.querySelector('.hero-slideshow') : null;
var heroHeight = 0;
var heroContent = null;
function cacheHeroDimensions() {
if (heroSection) heroHeight = heroSection.offsetHeight;
if (heroSection && !heroContent) heroContent = heroSection.querySelectorAll('.hero-tag, h1, .hero-sub, .hero-cta-row, .dir-search-wrap, .sites-bar');
}
function updateHeroParallax() {
if (!heroSlideshow || !heroSection || !heroHeight) return;
var scrollY = window.scrollY || document.documentElement.scrollTop;
if (scrollY > heroHeight) return;
heroSlideshow.style.transform = 'translateY(' + (scrollY * 0.35) + 'px) scale(1.05)';
var opacity = Math.max(0, 1 - (scrollY / (heroHeight * 0.7)));
var ty = scrollY * 0.15;
if (heroContent) {
heroContent.forEach(function (el) {
el.style.opacity = opacity;
el.style.transform = 'translateY(' + ty + 'px)';
});
}
}
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
function initSectionTransitions() {
var sections = document.querySelectorAll('section[id]');
if (!sections.length) return;
var sectionObserver = new IntersectionObserver(function (entries) {
entries.forEach(function (entry) {
if (entry.isIntersecting) {
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
function initChapterProgress() {
var chapters = document.querySelectorAll('.story-chapter');
if (!chapters.length) return;
chapters.forEach(function (ch, i) {
var num = i + 1;
ch.setAttribute('data-chapter-num', num);
});
}
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
var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function init() {
document.body.classList.add('loaded');
document.documentElement.classList.add('reveal-ready');
cacheHeroDimensions();
window.addEventListener('resize', cacheHeroDimensions, { passive: true });
updateScrollProgress();
updateNavState();
if (!prefersReducedMotion) {
window.addEventListener('scroll', onScroll, { passive: true });
initRevealObserver();
animateCounters();
initSectionTransitions();
initChapterProgress();
} else {
document.querySelectorAll('.reveal, .reveal-left, .reveal-scale, .stagger-children').forEach(function (el) {
el.classList.add('visible');
});
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