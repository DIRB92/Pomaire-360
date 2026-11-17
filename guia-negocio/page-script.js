/* Guía interactiva "Registra tu negocio" (/guia-negocio/)
 * Sin dependencias. El avance se guarda en localStorage (clave p360_guia_negocio).
 * Sin JavaScript, la página muestra todos los pasos de corrido. */
(function () {
  'use strict';

  var KEY = 'p360_guia_negocio';
  var root = document.getElementById('gn');
  if (!root) return;

  var PROFILES = [
    { id: 'taller',   label: '🏺 Taller o alfarería' },
    { id: 'comida',   label: '🍽️ Restaurante o fonda' },
    { id: 'hospedaje', label: '🛏️ Alojamiento' },
    { id: 'comercio', label: '🛍️ Tienda o comercio' },
    { id: 'servicio', label: '🔧 Servicios' },
    { id: 'alfarero', label: '👩‍🎨 Soy alfarero/a (sin local)' }
  ];

  // Consejos por perfil y paso
  var TIPS = {
    taller:   { 1: 'Fotografía tus piezas terminadas y, si puedes, a alguien trabajando la greda.', 3: 'Elige la categoría «Alfarería». Si además haces clases, también puedes publicar talleres (paso 7).' },
    comida:   { 1: 'Ten a mano una foto de tu plato más pedido y tu horario de atención.', 3: 'Elige la categoría «Restaurantes» y menciona tus platos típicos en la descripción.' },
    hospedaje: { 1: 'Reúne fotos de las piezas o cabañas y los datos de reserva.', 3: 'Elige «Alojamiento» y cuenta cuántas personas caben y qué incluye.' },
    comercio: { 1: 'Escoge la foto que mejor muestre lo que más vendes.', 3: 'Elige «Comercio» y nombra tus productos principales en la descripción.' },
    servicio: { 1: 'Piensa en qué problema resuelves al visitante (grúa, mecánico, estacionamiento, etc.).', 3: 'Elige la categoría que mejor calce: servicios, estacionamientos, transporte, salud, seguridad o baños.' },
    alfarero: { 1: 'Prepara tu historia: cuántos años llevas, quién te enseñó y qué piezas haces.', 3: 'Puedes registrar un negocio si vendes, y además crear tu biografía de alfarero/a desde el panel (paso 7).' }
  };

  var PLANS = [
    { id: 'gratis', name: '🏺 Gratis', price: '$0', yes: ['Ficha básica en el directorio', '1 foto de portada', 'Recibir reseñas'], no: ['Galería de fotos', 'Horarios, Instagram y web', 'Insignia'] },
    { id: 'destacado', name: '⭐ Destacado', price: '$4.990 al mes', yes: ['Todo lo del plan Gratis', 'Hasta 5 fotos con galería', 'Horarios, Instagram y sitio web', 'Insignia Destacado y mejor lugar en búsquedas', 'Estadísticas de visitas'], no: ['Perfil verificado', 'Responder reseñas'] },
    { id: 'premium', name: '💎 Premium', price: '$9.990 al mes', yes: ['Todo lo del plan Destacado', 'Hasta 10 fotos', 'Perfil verificado y primer lugar en tu categoría', 'Responder reseñas públicamente', 'Banner en el mapa y soporte prioritario por WhatsApp'], no: [] }
  ];

  // Qué puedes hacer en el panel. rec = perfiles para los que se recomienda.
  var DO = [
    { t: '📝 Editar tu negocio', d: 'Cambia textos, fotos, teléfono y ubicación cuando quieras.', link: 'panel/negocio', rec: ['*'] },
    { t: '📣 Publicaciones', d: 'Cuenta novedades, ofertas o eventos. Se guardan como borrador, publicada o archivada.', link: 'panel/publicaciones', rec: ['*'] },
    { t: '🏺 Talleres', d: 'Crea clases con fecha, horario, precio, cupos y nivel. Recibe y gestiona reservas.', link: 'panel/talleres', rec: ['taller', 'alfarero'] },
    { t: '📖 Biografía de alfarero/a', d: 'Cuenta tu oficio y tu historia. Se revisa antes de publicarse.', link: 'panel/biografias', rec: ['alfarero', 'taller'] },
    { t: '⭐ Reseñas', d: 'Mira lo que dicen tus clientes. Con Premium puedes responderlas.', link: 'panel/resenas', rec: ['*'] },
    { t: '💬 Soporte', d: 'Escribe al equipo, pide ayuda o reclama un negocio que ya aparece.', link: 'panel/soporte', rec: ['*'] },
    { t: '🕒 Horarios', d: 'Muestra a qué hora abres y cierras (desde plan Destacado).', link: 'panel/negocio', rec: ['comida', 'hospedaje', 'comercio', 'servicio'], badge: 'Destacado' },
    { t: '🔗 Instagram y web', d: 'Enlaza tus redes para que te sigan (desde plan Destacado).', link: 'panel/negocio', rec: ['comercio', 'comida', 'hospedaje'], badge: 'Destacado' },
    { t: '🏅 Perfil verificado', d: 'Insignia que da confianza al visitante (plan Premium).', link: 'planes', rec: [], badge: 'Premium' }
  ];
  var APP = 'https://app.pomaire360.cl/';

  var LAST = 7;
  var state = load();

  function load() {
    var s = { step: 1, profile: null, plan: 'gratis', checks: {} };
    try {
      var raw = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (raw && typeof raw === 'object') {
        s.step = clamp(parseInt(raw.step, 10) || 1);
        s.profile = PROFILES.some(function (p) { return p.id === raw.profile; }) ? raw.profile : null;
        s.plan = PLANS.some(function (p) { return p.id === raw.plan; }) ? raw.plan : 'gratis';
        s.checks = raw.checks && typeof raw.checks === 'object' ? raw.checks : {};
      }
    } catch (e) { /* almacenamiento no disponible */ }
    return s;
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }
  function clamp(n) { return Math.min(LAST, Math.max(1, n)); }
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function el(tag, props, children) {
    var n = document.createElement(tag);
    Object.keys(props || {}).forEach(function (k) {
      if (k === 'text') n.textContent = props[k]; else n.setAttribute(k, props[k]);
    });
    (children || []).forEach(function (c) { n.appendChild(c); });
    return n;
  }

  var steps = $$('.gn-step', root);
  var dots = $('#gnDots');
  var prev = $('#gnPrev'), next = $('#gnNext');

  root.classList.add('is-wizard');

  // ---- Perfiles
  var profBox = $('#gnProfiles');
  PROFILES.forEach(function (p) {
    var b = el('button', { type: 'button', 'class': 'gn-chip', role: 'radio', 'data-id': p.id, text: p.label });
    b.addEventListener('click', function () {
      state.profile = state.profile === p.id ? null : p.id;
      save(); renderProfile(); renderDo();
    });
    profBox.appendChild(b);
  });
  function renderProfile() {
    $$('.gn-chip', profBox).forEach(function (b) {
      b.setAttribute('aria-checked', String(b.getAttribute('data-id') === state.profile));
    });
    $$('[data-tip]', root).forEach(function (n) {
      var t = state.profile && TIPS[state.profile] && TIPS[state.profile][n.getAttribute('data-tip')];
      n.textContent = t ? '💡 ' + t : '';
    });
  }

  // ---- Puntos de navegación
  steps.forEach(function (s, i) {
    var li = el('li');
    var b = el('button', { type: 'button', 'aria-label': 'Ir al paso ' + (i + 1), text: String(i + 1) });
    b.addEventListener('click', function () { go(i + 1, true); });
    li.appendChild(b); dots.appendChild(li);
  });

  // ---- Checkboxes
  $$('input[data-check]', root).forEach(function (cb) {
    var k = cb.getAttribute('data-check');
    cb.checked = !!state.checks[k];
    cb.addEventListener('change', function () {
      if (cb.checked) state.checks[k] = true; else delete state.checks[k];
      save(); renderProgress();
    });
  });

  function stepDone(i) {
    var boxes = $$('input[data-check]', steps[i - 1]);
    return boxes.length > 0 && boxes.every(function (b) { return b.checked; });
  }

  // ---- Planes
  var plansBox = $('#gnPlans'), planDetail = $('#gnPlanDetail');
  PLANS.forEach(function (p) {
    var b = el('button', { type: 'button', 'class': 'gn-plan', role: 'radio', 'data-id': p.id }, [
      el('b', { text: p.name }), el('small', { text: p.price })
    ]);
    b.addEventListener('click', function () { state.plan = p.id; save(); renderPlan(); renderDo(); });
    plansBox.appendChild(b);
  });
  function renderPlan() {
    $$('.gn-plan', plansBox).forEach(function (b) {
      b.setAttribute('aria-checked', String(b.getAttribute('data-id') === state.plan));
    });
    var p = PLANS.filter(function (x) { return x.id === state.plan; })[0];
    planDetail.textContent = '';
    var ul = el('ul');
    p.yes.forEach(function (t) { ul.appendChild(el('li', { text: '✓ ' + t })); });
    p.no.forEach(function (t) { ul.appendChild(el('li', { 'class': 'off', text: '✗ ' + t + ' (no incluido)' })); });
    planDetail.appendChild(el('strong', { text: p.name + ' · ' + p.price }));
    planDetail.appendChild(ul);
    if (p.id !== 'gratis') {
      var a = el('a', { href: 'https://wa.me/56957517166?text=' + encodeURIComponent('Hola, quiero contratar el plan ' + p.id.toUpperCase() + ' para mi negocio en Pomaire 360'), target: '_blank', rel: 'noopener', text: 'Contratar por WhatsApp ↗' });
      planDetail.appendChild(el('p', {}, [a]));
    }
  }

  // ---- Qué puedes hacer
  var doBox = $('#gnDo');
  function renderDo() {
    doBox.textContent = '';
    DO.forEach(function (d) {
      var rec = d.rec.indexOf('*') > -1 || (state.profile && d.rec.indexOf(state.profile) > -1);
      var locked = (d.badge === 'Destacado' && state.plan === 'gratis') || (d.badge === 'Premium' && state.plan !== 'premium');
      var card = el('div', { 'class': 'gn-do' + (rec && d.rec.indexOf('*') < 0 ? ' is-rec' : '') });
      if (d.badge) card.appendChild(el('span', { 'class': 'gn-badge', text: locked ? '🔒 Plan ' + d.badge : '✓ Incluido en tu plan' }));
      else if (rec && d.rec.indexOf('*') < 0) card.appendChild(el('span', { 'class': 'gn-badge', text: '👍 Recomendado para ti' }));
      card.appendChild(el('h3', { text: d.t }));
      card.appendChild(el('p', { text: d.d }));
      card.appendChild(el('a', { href: APP + d.link, target: '_blank', rel: 'noopener', text: 'Abrir ↗' }));
      doBox.appendChild(card);
    });
  }

  // ---- Progreso y pasos
  function renderProgress() {
    var done = 0;
    $$('button', dots).forEach(function (b, i) {
      var d = stepDone(i + 1);
      b.classList.toggle('is-done', d);
      if (d) done++;
    });
    var withChecks = steps.filter(function (s) { return $('input[data-check]', s); }).length;
    var pct = Math.round(done / withChecks * 100);
    $('#gnBarFill').style.width = pct + '%';
    $('#gnBar').setAttribute('aria-valuenow', String(pct));
    $('#gnBarText').textContent = 'Paso ' + state.step + ' de ' + LAST + ' · ' + done + ' de ' + withChecks + ' pasos con tareas completados';
    $('#gnDone').hidden = done < withChecks;
  }

  function go(n, focus) {
    state.step = clamp(n);
    steps.forEach(function (s, i) { s.classList.toggle('is-active', i + 1 === state.step); });
    $$('button', dots).forEach(function (b, i) {
      if (i + 1 === state.step) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
    });
    prev.disabled = state.step === 1;
    next.disabled = state.step === LAST;
    save(); renderProgress();
    if (focus) {
      var h = $('h2', steps[state.step - 1]);
      if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); h.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    }
  }

  prev.addEventListener('click', function () { go(state.step - 1, true); });
  next.addEventListener('click', function () { go(state.step + 1, true); });
  $('#gnReset').addEventListener('click', function () {
    if (!window.confirm('¿Borrar tu avance y empezar de nuevo?')) return;
    try { localStorage.removeItem(KEY); } catch (e) {}
    state = { step: 1, profile: null, plan: 'gratis', checks: {} };
    $$('input[data-check]', root).forEach(function (c) { c.checked = false; });
    renderProfile(); renderPlan(); renderDo(); go(1, true);
  });

  renderProfile(); renderPlan(); renderDo(); go(state.step, false);
})();
