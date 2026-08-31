/* ═══════════════════════════════════════════════════════════════════════════
   biografias.js — Sección "Biografías de Alfareros" de pomaire360.cl

   Los datos viven en el backend de comprayvende.pomaire360.cl (Redis + Vercel),
   el mismo que modera y almacena las biografías. Esta página consume ese API:
     GET  /api/alfareros   -> biografías ya aprobadas (públicas)
     POST /api/alfareros   -> envía una nueva biografía (queda en moderación)
     POST /api/upload      -> sube la foto opcional

   CORS: el backend ya permite el origin https://(www.)pomaire360.cl.
   CSP:  connect-src incluye https://comprayvende.pomaire360.cl (ver _headers).
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var API_BASE = 'https://comprayvende.pomaire360.cl';

  // Textos de respaldo (es). Las traducciones vienen de window.LANGS[lang].
  var FALLBACK = {
    bio_loading: 'Cargando biografías…',
    bio_empty: 'Aún no hay biografías publicadas. Sé el primero en compartir la historia de un alfarero.',
    bio_empty_search: 'No se encontraron alfareros con ese nombre.',
    bio_error: 'No se pudieron cargar las biografías. Intenta más tarde.',
    bio_more: 'Leer más ▾',
    bio_less: 'Leer menos ▴',
    bio_by: 'aportado por',
    bio_wa: 'WhatsApp',
    bio_copied: 'Contacto copiado',
    bio_sent: '¡Biografía enviada! Se publicará tras revisión.',
    bio_err_required: 'Completa al menos el nombre y la biografía.',
    bio_err_short: 'La biografía es muy corta. Cuéntanos un poco más (mínimo 40 caracteres).',
    bio_err_img_big: 'Imagen muy pesada. Máximo 4 MB.',
    bio_err_img_type: 'Solo JPEG, PNG, WebP o GIF.',
    bio_err_img_upload: 'No se pudo subir la imagen.',
    bio_submit: 'Enviar biografía',
    bio_submitting: 'Enviando…'
  };

  // Idioma activo: subi18n.js fija document.documentElement.lang; respaldo en localStorage.
  function currentLang() {
    var l = document.documentElement.lang;
    if (l && window.LANGS && window.LANGS[l]) return l;
    try { var s = localStorage.getItem('p360lang'); if (s && window.LANGS && window.LANGS[s]) return s; } catch (e) {}
    return 'es';
  }
  // Traduce una clave usando LANGS con respaldo a es y luego a FALLBACK.
  function t(key) {
    var lang = currentLang();
    var L = window.LANGS || {};
    if (L[lang] && L[lang][key] !== undefined) return L[lang][key];
    if (L.es && L.es[key] !== undefined) return L.es[key];
    return FALLBACK[key] !== undefined ? FALLBACK[key] : key;
  }

  function esc(s) {
    var d = document.createElement('div');
    d.textContent = s == null ? '' : String(s);
    return d.innerHTML;
  }

  function fmtDate(ts) {
    try {
      var d = new Date(ts);
      return d.toLocaleDateString(currentLang() === 'es' ? 'es-CL' : currentLang(), { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch (e) { return ''; }
  }

  // Extrae un WhatsApp chileno del texto de contacto, o null.
  function waLink(contacto) {
    if (!contacto) return null;
    var cleaned = String(contacto).replace(/[\s\-().]/g, '');
    var m = cleaned.match(/(?:\+?56)?9\d{8}/);
    if (!m) return null;
    var num = m[0].replace(/^\+/, '');
    if (num.charAt(0) === '9' && num.length === 9) num = '56' + num;
    if (num.indexOf('56') !== 0) num = '56' + num;
    return 'https://wa.me/' + num;
  }

  var els = {};
  var state = { all: [], query: '', uploadedFoto: '' };

  function toast(msg, isError) {
    var el = els.toast;
    if (!el) return;
    el.textContent = msg;
    el.classList.toggle('is-error', !!isError);
    el.hidden = false;
    clearTimeout(el._timer);
    el._timer = setTimeout(function () { el.hidden = true; }, 2800);
  }

  /* ─────────── Cargar y renderizar ─────────── */
  function load() {
    els.status.hidden = false;
    els.status.classList.remove('is-error');
    els.status.textContent = t('bio_loading');
    els.list.innerHTML = '';

    fetch(API_BASE + '/api/alfareros', { headers: { 'Accept': 'application/json' } })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        state.all = (data && data.alfareros) || [];
        render();
      })
      .catch(function () {
        els.status.hidden = false;
        els.status.classList.add('is-error');
        els.status.textContent = t('bio_error');
      });
  }

  function render() {
    var q = state.query.toLowerCase().trim();
    var items = state.all.slice();
    if (q) {
      items = items.filter(function (a) {
        return (a.nombre && a.nombre.toLowerCase().indexOf(q) !== -1) ||
               (a.oficio && a.oficio.toLowerCase().indexOf(q) !== -1) ||
               (a.biografia && a.biografia.toLowerCase().indexOf(q) !== -1);
      });
    }
    items.sort(function (a, b) { return (b.creado || 0) - (a.creado || 0); });

    if (!items.length) {
      els.list.innerHTML = '';
      els.status.hidden = false;
      els.status.classList.remove('is-error');
      els.status.textContent = q ? t('bio_empty_search') : t('bio_empty');
      return;
    }
    els.status.hidden = true;

    els.list.innerHTML = items.map(function (a) {
      var photo = a.foto
        ? '<img class="bio-photo" src="' + esc(a.foto) + '" alt="' + esc(a.nombre) + '" loading="lazy" onerror="this.outerHTML=\'<div class=&quot;bio-photo-ph&quot;>🏺</div>\'">'
        : '<div class="bio-photo-ph">🏺</div>';
      var oficio = a.oficio ? '<div class="bio-oficio">' + esc(a.oficio) + '</div>' : '';
      var exp = a.experiencia ? '<span class="bio-exp">⏳ ' + esc(a.experiencia) + '</span>' : '';
      var wa = waLink(a.contacto);
      var contacto = a.contacto
        ? (wa
            ? '<a class="bio-wa" href="' + esc(wa) + '" target="_blank" rel="noopener">💬 ' + esc(t('bio_wa')) + '</a>'
            : '<button type="button" class="bio-contact" data-contacto="' + esc(a.contacto) + '">📞 ' + esc(a.contacto) + '</button>')
        : '';
      return '' +
        '<article class="bio-card">' +
          '<div class="bio-card-head">' + photo +
            '<div class="bio-card-info">' + oficio +
              '<h2 class="bio-name">' + esc(a.nombre) + '</h2>' + exp +
            '</div>' +
          '</div>' +
          '<p class="bio-text">' + esc(a.biografia) + '</p>' +
          '<button type="button" class="bio-more" data-more>' + esc(t('bio_more')) + '</button>' +
          '<div class="bio-foot">' +
            '<span>' + contacto + '</span>' +
            '<span class="bio-author">' + esc(t('bio_by')) + ' ' + esc(a.autor || 'Anónimo') + ' · ' + fmtDate(a.creado) + '</span>' +
          '</div>' +
        '</article>';
    }).join('');

    // Ocultar "Leer más" en biografías cortas que no se recortan.
    var cards = els.list.querySelectorAll('.bio-card');
    for (var i = 0; i < cards.length; i++) {
      var text = cards[i].querySelector('.bio-text');
      var more = cards[i].querySelector('[data-more]');
      if (text && more && text.scrollHeight <= text.clientHeight + 4) more.style.display = 'none';
    }
  }

  /* ─────────── Modal ─────────── */
  function openModal() {
    els.formError.textContent = '';
    els.modal.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    els.modal.hidden = true;
    document.body.style.overflow = '';
  }
  function resetFoto() {
    state.uploadedFoto = '';
    els.fotoFile.value = '';
    els.imgPreview.src = '';
    els.imgPreview.hidden = true;
    els.imgRemove.hidden = true;
    els.imgPh.hidden = false;
  }

  function submit() {
    var nombre = els.nombre.value.trim();
    var oficio = els.oficio.value.trim();
    var experiencia = els.experiencia.value.trim();
    var biografia = els.texto.value.trim();
    var contacto = els.contacto.value.trim();
    var autor = els.autor.value.trim() || 'Anónimo';

    els.formError.textContent = '';
    if (!nombre || !biografia) { els.formError.textContent = t('bio_err_required'); return; }
    if (biografia.length < 40) { els.formError.textContent = t('bio_err_short'); return; }

    els.submitBtn.disabled = true;
    els.submitBtn.textContent = t('bio_submitting');

    fetch(API_BASE + '/api/alfareros', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: nombre, oficio: oficio, experiencia: experiencia, biografia: biografia, contacto: contacto, foto: state.uploadedFoto || '', autor: autor })
    })
      .then(function (res) { return res.json().then(function (d) { return { ok: res.ok, data: d }; }); })
      .then(function (r) {
        if (!r.ok) throw new Error((r.data && r.data.error) || 'error');
        closeModal();
        els.nombre.value = els.oficio.value = els.experiencia.value = els.texto.value = els.contacto.value = els.autor.value = '';
        resetFoto();
        toast((r.data && r.data.mensaje) || t('bio_sent'));
      })
      .catch(function (e) {
        els.formError.textContent = (e && e.message && e.message !== 'error') ? e.message : t('bio_err_required');
      })
      .finally(function () {
        els.submitBtn.disabled = false;
        els.submitBtn.textContent = t('bio_submit');
      });
  }

  function handleFoto() {
    var file = els.fotoFile.files[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) { toast(t('bio_err_img_big'), true); els.fotoFile.value = ''; return; }
    if (['image/jpeg', 'image/png', 'image/webp', 'image/gif'].indexOf(file.type) === -1) { toast(t('bio_err_img_type'), true); els.fotoFile.value = ''; return; }

    var reader = new FileReader();
    reader.onload = function (ev) {
      els.imgPreview.src = ev.target.result;
      els.imgPreview.hidden = false;
      els.imgRemove.hidden = false;
      els.imgPh.hidden = true;
    };
    reader.readAsDataURL(file);

    fetch(API_BASE + '/api/upload', { method: 'POST', headers: { 'Content-Type': file.type }, body: file })
      .then(function (res) { return res.json().then(function (d) { return { ok: res.ok, data: d }; }); })
      .then(function (r) {
        if (!r.ok) throw new Error((r.data && r.data.error) || 'upload');
        state.uploadedFoto = r.data.url;
      })
      .catch(function () { toast(t('bio_err_img_upload'), true); resetFoto(); });
  }

  /* ─────────── Init ─────────── */
  function init() {
    els.status = document.getElementById('bioStatus');
    els.list = document.getElementById('bioList');
    els.search = document.getElementById('bioSearch');
    els.addBtn = document.getElementById('bioAddBtn');
    els.modal = document.getElementById('bioModal');
    els.cancelBtn = document.getElementById('bioCancelBtn');
    els.submitBtn = document.getElementById('bioSubmitBtn');
    els.formError = document.getElementById('bioFormError');
    els.toast = document.getElementById('bioToast');
    els.nombre = document.getElementById('bioNombre');
    els.oficio = document.getElementById('bioOficio');
    els.experiencia = document.getElementById('bioExperiencia');
    els.texto = document.getElementById('bioTexto');
    els.contacto = document.getElementById('bioContacto');
    els.autor = document.getElementById('bioAutor');
    els.fotoFile = document.getElementById('bioFotoFile');
    els.imgArea = document.getElementById('bioImgArea');
    els.imgPh = document.getElementById('bioImgPh');
    els.imgPreview = document.getElementById('bioImgPreview');
    els.imgRemove = document.getElementById('bioImgRemove');

    if (!els.list) return;

    els.search.addEventListener('input', function () { state.query = this.value; render(); });

    els.list.addEventListener('click', function (e) {
      var moreBtn = e.target.closest('[data-more]');
      if (moreBtn) {
        var txt = moreBtn.parentElement.querySelector('.bio-text');
        var expanded = txt.classList.toggle('is-expanded');
        moreBtn.textContent = expanded ? t('bio_less') : t('bio_more');
        return;
      }
      var cBtn = e.target.closest('.bio-contact');
      if (cBtn && navigator.clipboard) {
        navigator.clipboard.writeText(cBtn.dataset.contacto || '').then(function () { toast(t('bio_copied')); }).catch(function () {});
      }
    });

    els.addBtn.addEventListener('click', openModal);
    els.cancelBtn.addEventListener('click', closeModal);
    els.modal.addEventListener('click', function (e) { if (e.target === els.modal) closeModal(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !els.modal.hidden) closeModal(); });
    els.submitBtn.addEventListener('click', submit);

    els.imgArea.addEventListener('click', function (e) {
      if (e.target === els.imgRemove || e.target.closest('#bioImgRemove')) return;
      els.fotoFile.click();
    });
    els.fotoFile.addEventListener('change', handleFoto);
    els.imgRemove.addEventListener('click', function (e) { e.stopPropagation(); resetFoto(); });

    load();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
