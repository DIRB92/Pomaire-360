/* ═══════════════════════════════════════════════════════════════
   i18n-loader.js — Lazy-loads only the needed language JSON
   Reduces initial payload by loading translations on demand.
   Falls back to embedded ES if fetch fails.
   ═══════════════════════════════════════════════════════════════ */
(function() {
  'use strict';

  var SUPPORTED_LANGS = ['es', 'en', 'pt', 'fr', 'ru', 'ja', 'zh'];
  var loaded = {};

  // Base Spanish is always available from langs.js (already loaded)
  function getBaseLang() {
    return (window.LANGS && window.LANGS.es) ? window.LANGS.es : {};
  }

  /**
   * Load a specific language. Returns a Promise with the translations.
   * If the language is already in window.LANGS, returns it immediately.
   */
  function loadLang(lang) {
    if (!lang || SUPPORTED_LANGS.indexOf(lang) === -1) lang = 'es';

    // Already loaded
    if (window.LANGS && window.LANGS[lang]) {
      loaded[lang] = window.LANGS[lang];
      return Promise.resolve(window.LANGS[lang]);
    }

    // Already fetched this session
    if (loaded[lang]) return Promise.resolve(loaded[lang]);

    // Fetch from separate JSON file
    return fetch('/i18n/' + lang + '.json')
      .then(function(res) { return res.json(); })
      .then(function(data) {
        loaded[lang] = data;
        if (!window.LANGS) window.LANGS = {};
        window.LANGS[lang] = data;
        return data;
      })
      .catch(function() {
        // Fallback to base Spanish
        return getBaseLang();
      });
  }

  /**
   * Get translation for a key in the current language
   */
  function t(key, lang) {
    lang = lang || document.documentElement.lang || 'es';
    var dict = loaded[lang] || (window.LANGS && window.LANGS[lang]) || {};
    var base = getBaseLang();
    return dict[key] !== undefined ? dict[key] : (base[key] !== undefined ? base[key] : key);
  }

  /**
   * Get the user's preferred language
   */
  function getPreferredLang() {
    // 1. HTML lang attribute (for static pages like /en/)
    var htmlLang = document.documentElement.lang;
    if (htmlLang && htmlLang !== 'es' && SUPPORTED_LANGS.indexOf(htmlLang) !== -1) {
      return htmlLang;
    }
    // 2. localStorage (user choice)
    try {
      var saved = localStorage.getItem('p360lang');
      if (saved && SUPPORTED_LANGS.indexOf(saved) !== -1) return saved;
    } catch(e) {}
    // 3. Default to Spanish
    return 'es';
  }

  // Export
  window.P360i18n = {
    loadLang: loadLang,
    t: t,
    getPreferredLang: getPreferredLang,
    SUPPORTED_LANGS: SUPPORTED_LANGS
  };
})();
