/* ══════════════════════════════════════════════════════════════════════════
   RECORRIDOS INTERACTIVOS — elige un establecimiento en cada parada
   Convierte la "Ruta Turística Oficial" y el "Recorrido libre" en itinerarios
   personalizables. Usa los datos de PLACES (app.js) y dibuja el recorrido en
   el mapa interactivo. Las elecciones se guardan en localStorage.
   ════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var STORE = 'p360tour';

  /* ── Textos de la interfaz (respaldo a español si falta el idioma) ── */
  var I18N = {
    es: { choose:'— Elige un lugar —', seemap:'🗺️ Ver mi recorrido en el mapa', reset:'↺ Reiniciar', viewone:'📍 Ver en el mapa', intro:'✨ Personaliza tu recorrido: elige un establecimiento en cada parada.', empty:'Elige al menos un establecimiento para ver tu recorrido en el mapa.' },
    en: { choose:'— Choose a place —', seemap:'🗺️ See my route on the map', reset:'↺ Reset', viewone:'📍 View on map', intro:'✨ Personalise your route: pick a place at each stop.', empty:'Pick at least one place to see your route on the map.' },
    pt: { choose:'— Escolha um lugar —', seemap:'🗺️ Ver meu roteiro no mapa', reset:'↺ Reiniciar', viewone:'📍 Ver no mapa', intro:'✨ Personalize seu roteiro: escolha um lugar em cada parada.', empty:'Escolha pelo menos um lugar para ver seu roteiro no mapa.' },
    fr: { choose:'— Choisissez un lieu —', seemap:'🗺️ Voir mon itinéraire sur la carte', reset:'↺ Réinitialiser', viewone:'📍 Voir sur la carte', intro:'✨ Personnalisez votre itinéraire : choisissez un lieu à chaque étape.', empty:'Choisissez au moins un lieu pour voir votre itinéraire sur la carte.' },
    ru: { choose:'— Выберите место —', seemap:'🗺️ Показать мой маршрут на карте', reset:'↺ Сбросить', viewone:'📍 На карте', intro:'✨ Настройте маршрут: выберите место на каждой остановке.', empty:'Выберите хотя бы одно место, чтобы увидеть маршрут на карте.' },
    ja: { choose:'— 場所を選ぶ —', seemap:'🗺️ 地図でルートを見る', reset:'↺ リセット', viewone:'📍 地図で見る', intro:'✨ ルートをカスタマイズ：各ポイントで場所を選びましょう。', empty:'地図でルートを見るには、少なくとも1つの場所を選んでください。' },
    zh: { choose:'— 选择一个地点 —', seemap:'🗺️ 在地图上查看我的路线', reset:'↺ 重置', viewone:'📍 在地图上查看', intro:'✨ 定制您的路线：在每个站点选择一个地点。', empty:'请至少选择一个地点以在地图上查看您的路线。' }
  };

  /* ── Etiqueta (actividad) de cada parada ── */
  var LABELS = {
    p_or_breakfast: { es:'☕ Desayuno', en:'☕ Breakfast', pt:'☕ Café da manhã', fr:'☕ Petit-déjeuner', ru:'☕ Завтрак', ja:'☕ 朝食', zh:'☕ 早餐' },
    p_or_workshop:  { es:'🏺 Taller de greda', en:'🏺 Pottery workshop', pt:'🏺 Oficina de cerâmica', fr:'🏺 Atelier de poterie', ru:'🏺 Гончарная мастерская', ja:'🏺 陶芸ワークショップ', zh:'🏺 陶艺工作坊' },
    p_or_lunch:     { es:'🥘 Almuerzo', en:'🥘 Lunch', pt:'🥘 Almoço', fr:'🥘 Déjeuner', ru:'🥘 Обед', ja:'🥘 昼食', zh:'🥘 午餐' },
    p_or_green:     { es:'🌿 Pausa verde', en:'🌿 Green break', pt:'🌿 Pausa verde', fr:'🌿 Pause nature', ru:'🌿 Зелёная пауза', ja:'🌿 グリーンブレイク', zh:'🌿 绿色休憩' },
    p_or_shop:      { es:'🛍️ Compras de greda', en:'🛍️ Pottery shopping', pt:'🛍️ Compras de cerâmica', fr:'🛍️ Achats de poterie', ru:'🛍️ Покупки керамики', ja:'🛍️ 陶器ショッピング', zh:'🛍️ 陶器购物' },
    p_ft_parking:   { es:'🅿️ Llegada y estacionamiento', en:'🅿️ Arrival & parking', pt:'🅿️ Chegada e estacionamento', fr:'🅿️ Arrivée et stationnement', ru:'🅿️ Прибытие и парковка', ja:'🅿️ 到着・駐車', zh:'🅿️ 抵达与停车' },
    p_ft_breakfast: { es:'☕ Desayuno', en:'☕ Breakfast', pt:'☕ Café da manhã', fr:'☕ Petit-déjeuner', ru:'☕ Завтрак', ja:'☕ 朝食', zh:'☕ 早餐' },
    p_ft_workshop:  { es:'🏺 Talleres alfareros', en:'🏺 Pottery workshops', pt:'🏺 Oficinas de cerâmica', fr:'🏺 Ateliers de poterie', ru:'🏺 Гончарные мастерские', ja:'🏺 陶芸工房', zh:'🏺 陶艺工坊' },
    p_ft_shop:      { es:'🛍️ Compras de artesanía', en:'🛍️ Craft shopping', pt:'🛍️ Compras de artesanato', fr:'🛍️ Achats artisanaux', ru:'🛍️ Покупка ремёсел', ja:'🛍️ 工芸品ショッピング', zh:'🛍️ 手工艺品购物' },
    p_ft_lunch:     { es:'🥘 Almuerzo típico', en:'🥘 Traditional lunch', pt:'🥘 Almoço típico', fr:'🥘 Déjeuner traditionnel', ru:'🥘 Традиционный обед', ja:'🥘 伝統的な昼食', zh:'🥘 传统午餐' },
    p_ft_around:    { es:'🏔️ Paseo por los alrededores', en:'🏔️ Explore the surroundings', pt:'🏔️ Passeio pelos arredores', fr:'🏔️ Balade dans les environs', ru:'🏔️ Прогулка по окрестностям', ja:'🏔️ 周辺を散策', zh:'🏔️ 周边漫步' }
  };

  /* ── Configuración de cada parada: qué establecimientos ofrece ──
        cats: categorías de PLACES a incluir · ids: lista explícita · def: preselección ── */
  var PICKS = {
    p_or_breakfast: { cats:['food'], def:'fo1' },
    p_or_workshop:  { cats:['pottery'], def:'po1' },
    p_or_lunch:     { cats:['food'], def:'fo2' },
    p_or_green:     { ids:['hl6','po7','ar1'], def:'hl6' },
    p_or_shop:      { cats:['pottery','highlight'], def:'' },
    p_ft_parking:   { cats:['parking'], def:'pk1' },
    p_ft_breakfast: { cats:['food'], def:'' },
    p_ft_workshop:  { cats:['pottery'], def:'' },
    p_ft_shop:      { cats:['pottery','highlight'], def:'' },
    p_ft_lunch:     { cats:['food'], def:'' },
    p_ft_around:    { ids:['ar1','hl6'], def:'' }
  };

  /* ── Grupos (itinerarios) y orden de sus paradas ── */
  var GROUPS = {
    official: { color:'#8C3D16', lead:'sv1', picks:['p_or_breakfast','p_or_workshop','p_or_lunch','p_or_green','p_or_shop'] },
    free:     { color:'#4A7C59', picks:['p_ft_parking','p_ft_breakfast','p_ft_workshop','p_ft_shop','p_ft_lunch','p_ft_around'] }
  };

  var selections = load();

  /* ── Utilidades ── */
  function lang() {
    var l = document.documentElement.lang || 'es';
    return I18N[l] ? l : 'es';
  }
  function tr(key) { return (I18N[lang()] && I18N[lang()][key]) || I18N.es[key]; }
  function lbl(pickId) { var m = LABELS[pickId] || {}; return m[lang()] || m.es || ''; }
  function load() { try { return JSON.parse(localStorage.getItem(STORE)) || {}; } catch (e) { return {}; } }
  function save() { try { localStorage.setItem(STORE, JSON.stringify(selections)); } catch (e) {} }
  function escapeHtml(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

  function getPlaces() { return (typeof PLACES !== 'undefined') ? PLACES : (window.PLACES || []); }
  function findPlace(id) { return getPlaces().filter(function (p) { return p.id === id; })[0]; }

  function placesFor(cfg) {
    var all = getPlaces();
    if (cfg.ids) {
      return cfg.ids.map(function (id) { return findPlace(id); }).filter(Boolean);
    }
    return all.filter(function (p) { return cfg.cats.indexOf(p.cat) !== -1; });
  }

  function currentValue(pickId) {
    var cfg = PICKS[pickId];
    return Object.prototype.hasOwnProperty.call(selections, pickId) ? selections[pickId] : cfg.def;
  }

  /* ── Render de una parada interactiva ── */
  function renderStop(stopEl) {
    var pickId = stopEl.getAttribute('data-pick');
    var cfg = PICKS[pickId];
    if (!cfg) return;

    var labelEl = stopEl.querySelector('.pick-label');
    var select = stopEl.querySelector('.stop-select');
    var detail = stopEl.querySelector('.pick-detail');
    if (!labelEl || !select || !detail) return;

    labelEl.textContent = lbl(pickId);

    var sel = currentValue(pickId);
    var opts = '<option value="">' + tr('choose') + '</option>';
    placesFor(cfg).forEach(function (p) {
      opts += '<option value="' + p.id + '"' + (p.id === sel ? ' selected' : '') + '>' + escapeHtml(p.icon + ' ' + p.name) + '</option>';
    });
    select.innerHTML = opts;

    if (!select.dataset.bound) {
      select.addEventListener('change', function () {
        selections[pickId] = select.value;
        save();
        renderDetail(detail, select.value);
      });
      select.dataset.bound = '1';
    }
    renderDetail(detail, sel);
  }

  function renderDetail(detail, id) {
    var p = id ? findPlace(id) : null;
    if (!p) { detail.innerHTML = ''; return; }
    var addr = p.addr ? '📍 ' + escapeHtml(p.addr) : '';
    detail.innerHTML = addr +
      ' · <a href="#lugar=' + p.id + '" class="pick-maplink" data-id="' + p.id + '">' + tr('viewone') + '</a>';
  }

  /* ── Render de la barra de acciones de un grupo ── */
  function renderActions(barEl) {
    var seeBtn = barEl.querySelector('.tour-see');
    var resetBtn = barEl.querySelector('.tour-reset');
    var intro = barEl.parentNode.querySelector('.tour-intro[data-group="' + barEl.getAttribute('data-group') + '"]');
    if (seeBtn) seeBtn.textContent = tr('seemap');
    if (resetBtn) resetBtn.textContent = tr('reset');
    if (intro) intro.textContent = tr('intro');
  }

  /* ── Construcción del recorrido y dibujo en el mapa ── */
  function showTourRoute(groupKey) {
    var g = GROUPS[groupKey];
    if (!g) return;
    var ids = [];
    if (g.lead) ids.push(g.lead);
    g.picks.forEach(function (pk) {
      var v = currentValue(pk);
      if (v) ids.push(v);
    });
    // quitar duplicados conservando orden
    var seen = {}, ordered = [];
    ids.forEach(function (id) { if (!seen[id]) { seen[id] = 1; ordered.push(id); } });

    var stops = ordered.filter(function (id) { return id !== g.lead; });
    if (stops.length === 0) { alert(tr('empty')); return; }

    if (typeof window.showCustomRoute === 'function') {
      window.showCustomRoute(ordered, g.color);
    }
    var map = document.getElementById('mapa');
    if (map && map.scrollIntoView) map.scrollIntoView({ behavior: 'smooth' });
  }

  function resetTour(groupKey) {
    var g = GROUPS[groupKey];
    if (!g) return;
    g.picks.forEach(function (pk) { delete selections[pk]; });
    save();
    initTourPicks();
    if (typeof window.clearRoute === 'function') window.clearRoute(true);
  }

  /* ── Inicialización / refresco (idempotente) ── */
  function initTourPicks() {
    document.querySelectorAll('.or-pick, .tour-pick').forEach(renderStop);
    document.querySelectorAll('.tour-actions').forEach(function (bar) {
      renderActions(bar);
      if (!bar.dataset.bound) {
        var group = bar.getAttribute('data-group');
        var seeBtn = bar.querySelector('.tour-see');
        var resetBtn = bar.querySelector('.tour-reset');
        if (seeBtn) seeBtn.addEventListener('click', function () { showTourRoute(group); });
        if (resetBtn) resetBtn.addEventListener('click', function () { resetTour(group); });
        bar.dataset.bound = '1';
      }
    });
  }

  /* Enlace "Ver en el mapa" de cada parada → reutiliza focusPlace de app.js */
  document.addEventListener('click', function (e) {
    var link = e.target.closest && e.target.closest('.pick-maplink');
    if (!link) return;
    e.preventDefault();
    var id = link.getAttribute('data-id');
    if (typeof window.focusPlace === 'function') window.focusPlace(id);
    else location.hash = '#lugar=' + id;
  });

  /* Hook de idioma: applyLang() en app.js llama a window.translateContent(),
     que a su vez invocará esta función (ver app.js). */
  window.refreshTourPicks = function () { initTourPicks(); };

  document.addEventListener('DOMContentLoaded', initTourPicks);
})();
