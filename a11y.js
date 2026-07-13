/* ════════════════════════════════════════════════════════════════════════
   Accesibilidad reutilizable para subpáginas de Pomaire 360
   Inyecta el panel ♿ (tamaño de letra + lectura en voz alta) y su lógica.
   Depende de /langs.js (window.LANGS) y de /style.css (clases .a11y).
   No se debe cargar en el home (allí la lógica vive en app.js).
   ════════════════════════════════════════════════════════════════════════ */
(function(){
  if (window.__a11yShared) return;          // evitar doble carga
  if (document.getElementById('a11yPanel')) return; // ya existe (home)
  window.__a11yShared = true;

  var FONT_STEPS = [0.9, 1, 1.15, 1.3, 1.45, 1.6];
  var fontIdx = 1;
  var speechOK = ('speechSynthesis' in window);
  var readingMode = false;
  var lastSpoken = null;

  function curLang(){
    // SEO: el idioma real de la página es <html lang="...">. No se recurre a
    // navigator.language como último fallback (Googlebot reporta "en-US" por
    // defecto), para no traducir el panel de accesibilidad a un idioma
    // distinto del que realmente sirve la página estática.
    var l = document.documentElement.lang;
    if (l && window.LANGS && window.LANGS[l]) return l;
    try { var s = localStorage.getItem('p360lang'); if (s && window.LANGS && window.LANGS[s]) return s; } catch(e){}
    return 'es';
  }
  function a11yT(k){
    var L = window.LANGS || {};
    var t = L[curLang()] || {}, base = L.es || {};
    if (t[k] !== undefined) return t[k];
    if (base[k] !== undefined) return base[k];
    return k;
  }

  // ── Inyección del panel ──────────────────────────────────────────────────
  function injectPanel(){
    var div = document.createElement('div');
    div.className = 'a11y';
    div.id = 'a11yPanel';
    div.innerHTML =
      '<button class="a11y-toggle" id="a11yToggle" onclick="toggleA11y(event)" aria-label="Opciones de accesibilidad" aria-expanded="false" title="Accesibilidad">\u267F</button>' +
      '<div class="a11y-menu" role="dialog" aria-label="Opciones de accesibilidad">' +
        '<button class="a11y-close" onclick="toggleA11y(event)" aria-label="Cerrar">\u2715</button>' +
        '<div class="a11y-title" data-t="a11y_title">\u267F Accesibilidad</div>' +
        '<div class="a11y-row">' +
          '<span data-t="a11y_font">\uD83D\uDD20 Tama\u00f1o de letra</span>' +
          '<div class="a11y-btns">' +
            '<button class="a11y-small" onclick="changeFont(-1)" aria-label="Reducir tama\u00f1o de letra">A\u2212</button>' +
            '<button onclick="resetFont()" aria-label="Tama\u00f1o normal">A</button>' +
            '<button class="a11y-big" onclick="changeFont(1)" aria-label="Aumentar tama\u00f1o de letra">A+</button>' +
          '</div>' +
          '<div class="a11y-scale-label" id="a11yScaleLabel">Tama\u00f1o normal (100%)</div>' +
        '</div>' +
        '<div class="a11y-row">' +
          '<span data-t="a11y_read">\uD83D\uDD0A Lectura en voz alta</span>' +
          '<div class="a11y-btns">' +
            '<button id="readToggleBtn" onclick="toggleReadMode()" data-t="a11y_activate">\uD83D\uDD0A Activar</button>' +
            '<button onclick="readWholePage()" aria-label="Leer toda la p\u00e1gina" data-t="a11y_readall">\uD83D\uDCD6 Leer todo</button>' +
          '</div>' +
        '</div>' +
        '<p class="a11y-hint" id="a11yHint" data-t="a11y_hint">Activa la lectura y luego toca cualquier texto del sitio para escucharlo en voz alta.</p>' +
      '</div>';
    document.body.appendChild(div);
    translatePanel(div);
  }
  function translatePanel(root){
    var lang = curLang();
    var L = window.LANGS || {}, t = L[lang] || {}, base = L.es || {};
    root.querySelectorAll('[data-t]').forEach(function(el){
      var k = el.dataset.t, v = (t[k] !== undefined ? t[k] : base[k]);
      if (v !== undefined) el.innerHTML = v;
    });
  }

  // ── Tamaño de letra ──────────────────────────────────────────────────────
  function applyFont(){
    document.documentElement.style.setProperty('--fontScale', FONT_STEPS[fontIdx]);
    var pct = Math.round(FONT_STEPS[fontIdx] * 100);
    var lbl = document.getElementById('a11yScaleLabel');
    if (lbl) lbl.textContent = (fontIdx === 1 ? a11yT('a11y_size_normal') : a11yT('a11y_size')) + ' (' + pct + '%)';
    try { localStorage.setItem('p360font', fontIdx); } catch(e){}
  }
  function changeFont(dir){
    fontIdx = Math.max(0, Math.min(FONT_STEPS.length - 1, fontIdx + dir));
    applyFont();
  }
  function resetFont(){ fontIdx = 1; applyFont(); }

  // ── Abrir / cerrar panel ───────────────────────────────────────────────────
  function toggleA11y(e){
    if (e) e.stopPropagation();
    var p = document.getElementById('a11yPanel');
    var open = p.classList.toggle('open');
    document.getElementById('a11yToggle').setAttribute('aria-expanded', open);
  }
  document.addEventListener('click', function(e){
    var p = document.getElementById('a11yPanel');
    if (p && p.classList.contains('open') && !e.target.closest('.a11y')) p.classList.remove('open');
  });

  // ── Lectura en voz alta (Web Speech API) ───────────────────────────────────
  function speechLang(){
    var map = { es:'es-ES', en:'en-US', pt:'pt-BR', fr:'fr-FR', ru:'ru-RU', ja:'ja-JP', zh:'zh-CN' };
    return map[document.documentElement.lang] || 'es-ES';
  }
  function speak(text){
    if (!speechOK || !text) return;
    text = text.replace(/\s+/g, ' ').trim();
    if (!text) return;
    window.speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(text);
    u.lang = speechLang(); u.rate = 0.95;
    window.speechSynthesis.speak(u);
  }
  function stopSpeak(){
    if (speechOK) window.speechSynthesis.cancel();
    if (lastSpoken){ lastSpoken.classList.remove('reading-highlight'); lastSpoken = null; }
  }
  function toggleReadMode(){
    if (!speechOK){ alert(a11yT('a11y_no_support')); return; }
    readingMode = !readingMode;
    var btn = document.getElementById('readToggleBtn');
    var hint = document.getElementById('a11yHint');
    document.body.classList.toggle('reading-mode', readingMode);
    if (readingMode){
      btn.textContent = a11yT('a11y_stop'); btn.classList.add('active');
      hint.textContent = a11yT('a11y_hint_active');
      speak(a11yT('a11y_voice_on'));
    } else {
      btn.textContent = a11yT('a11y_activate'); btn.classList.remove('active');
      hint.textContent = a11yT('a11y_hint');
      stopSpeak();
    }
  }
  // Al tocar texto en modo lectura, leerlo en voz alta
  document.addEventListener('click', function(e){
    if (!readingMode) return;
    if (e.target.closest('.a11y')) return;
    var el = e.target.closest('p, h1, h2, h3, h4, li, span, a, strong, .card, .dir-item, .ct-step, .ch-bio-text, .ch-visit-row');
    if (!el) return;
    var txt = el.innerText || el.textContent;
    if (!txt || !txt.trim()) return;
    if (lastSpoken) lastSpoken.classList.remove('reading-highlight');
    el.classList.add('reading-highlight');
    lastSpoken = el;
    speak(txt);
  }, true);
  // Leer toda la página
  function readWholePage(){
    if (!speechOK){ alert(a11yT('a11y_no_support')); return; }
    var parts = [];
    document.querySelectorAll('h1, section h2, section h3, section p, .card h3, .card .card-detail, .ct-step h3, .ct-step p').forEach(function(el){
      if (el.offsetParent === null) return;
      var t = (el.innerText || '').trim();
      if (t) parts.push(t);
    });
    var full = parts.join('. ');
    window.speechSynthesis.cancel();
    var chunks = full.match(/[\s\S]{1,200}(?:\.|$)/g) || [full];
    chunks.forEach(function(c){
      var u = new SpeechSynthesisUtterance(c.trim());
      u.lang = speechLang(); u.rate = 0.95;
      window.speechSynthesis.speak(u);
    });
  }
  window.addEventListener('beforeunload', stopSpeak);

  // ── Re-traducir textos dinámicos al cambiar idioma ─────────────────────────
  function refreshA11y(){
    applyFont();
    var tgl = document.getElementById('a11yToggle');
    if (tgl){ tgl.setAttribute('aria-label', a11yT('a11y_aria_options')); tgl.setAttribute('title', a11yT('a11y_title').replace(/^[^\wÀ-ÿ]+\s*/, '')); }
    var menu = document.querySelector('.a11y-menu');
    if (menu) menu.setAttribute('aria-label', a11yT('a11y_aria_options'));
    var closeBtn = document.querySelector('.a11y-close');
    if (closeBtn) closeBtn.setAttribute('aria-label', a11yT('a11y_aria_close'));
    var btn = document.getElementById('readToggleBtn');
    var hint = document.getElementById('a11yHint');
    if (btn && !btn.disabled) btn.textContent = readingMode ? a11yT('a11y_stop') : a11yT('a11y_activate');
    if (hint) hint.textContent = readingMode ? a11yT('a11y_hint_active') : a11yT('a11y_hint');
  }

  // Exponer funciones usadas por los onclick del panel
  window.toggleA11y = toggleA11y;
  window.changeFont = changeFont;
  window.resetFont = resetFont;
  window.toggleReadMode = toggleReadMode;
  window.readWholePage = readWholePage;
  window.refreshA11y = refreshA11y;

  // Envolver selectLang de subi18n para refrescar los textos dinámicos del panel
  var prevSelectLang = window.selectLang;
  window.selectLang = function(l){
    if (typeof prevSelectLang === 'function') prevSelectLang(l);
    try { refreshA11y(); } catch(e){}
  };

  // ── Init ───────────────────────────────────────────────────────────────────
  function init(){
    injectPanel();
    try { var saved = parseInt(localStorage.getItem('p360font')); if (!isNaN(saved) && saved >= 0 && saved < FONT_STEPS.length) fontIdx = saved; } catch(e){}
    applyFont();
    if (!speechOK){ var b = document.getElementById('readToggleBtn'); if (b){ b.disabled = true; b.textContent = a11yT('a11y_unavailable'); } }
    refreshA11y();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
