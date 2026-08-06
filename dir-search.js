/* ══ BÚSQUEDA INSTANTÁNEA DEL DIRECTORIO — Supabase ══ */
(function(){
  'use strict';

  var input = document.getElementById('dirSearchInput');
  var results = document.getElementById('dirSearchResults');
  if(!input || !results) return;

  // ─── Supabase Config (misma que comercio/page-script.js) ────────────────
  var SUPABASE_URL = 'https://uuskvqtbsvtfsovcjazf.supabase.co';
  var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1c2t2cXRic3Z0ZnNvdmNqYXpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2ODU4NDIsImV4cCI6MjEwMDI2MTg0Mn0.BbHI3ctSNg5msUnL9eENTNpOujQROAh6vUAZpFVcbBI';
  var TABLE = 'negocios_directorio360';

  // ─── Emojis por categoría ───────────────────────────────────────────────
  var catEmojis = {
    alfareria: '🏺',
    talleres: '🎨',
    restaurantes: '🍽️',
    alojamiento: '🛏️',
    comercio: '🛍️',
    servicios: '📌',
    estacionamientos: '🅿️',
    salud: '💊',
    seguridad: '🛡️',
    banos: '🚻',
    transporte: '🚌',
    turismo: '✨'
  };

  var catLabels = {
    alfareria: 'Alfarería',
    talleres: 'Taller',
    restaurantes: 'Restaurante',
    alojamiento: 'Alojamiento',
    comercio: 'Comercio',
    servicios: 'Servicios',
    estacionamientos: 'Estacionamiento',
    salud: 'Salud',
    seguridad: 'Seguridad',
    banos: 'Baños',
    transporte: 'Transporte',
    turismo: 'Turismo'
  };

  // ─── Cache de negocios ──────────────────────────────────────────────────
  var cachedItems = null;
  var loadingPromise = null;

  function slugify(str){
    return (str || '').toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
      .replace(/[^a-z0-9]+/g,'-')
      .replace(/(^-|-$)/g,'');
  }

  function escHtml(s){
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  // ─── Carga de datos desde Supabase ──────────────────────────────────────
  function loadNegocios(){
    if(cachedItems) return Promise.resolve(cachedItems);
    if(loadingPromise) return loadingPromise;

    var url = SUPABASE_URL + '/rest/v1/' + TABLE + '?select=nombre,direccion,categoria,slug,horario&order=nombre.asc&limit=500';
    loadingPromise = fetch(url, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
        'Accept': 'application/json'
      }
    })
    .then(function(res){
      if(!res.ok) throw new Error('Supabase error ' + res.status);
      return res.json();
    })
    .then(function(rows){
      cachedItems = rows.map(function(row){
        return {
          name: row.nombre || '',
          addr: row.direccion || '',
          cat: row.categoria || 'servicios',
          slug: row.slug || slugify(row.nombre || ''),
          tag: row.horario || ''
        };
      });
      return cachedItems;
    })
    .catch(function(err){
      console.warn('[dir-search] Error cargando Supabase:', err);
      loadingPromise = null;
      // Fallback: intentar usar DIRECTORY si existe
      if(typeof DIRECTORY !== 'undefined') return getFallbackItems();
      return [];
    });

    return loadingPromise;
  }

  // ─── Fallback: usar DIRECTORY hardcodeado si Supabase falla ─────────────
  function getFallbackItems(){
    var items = [];
    var keyToCat = {
      restaurants:'restaurantes', talleres:'talleres', demos:'talleres',
      artesanos:'alfareria', alojamientos:'alojamiento',
      interes:'turismo', jardin:'servicios', servicios:'servicios'
    };
    Object.keys(keyToCat).forEach(function(key){
      if(!DIRECTORY[key]) return;
      DIRECTORY[key].forEach(function(it){
        items.push({
          name: it.n || '',
          addr: it.a || '',
          cat: keyToCat[key],
          slug: it.slug || slugify(it.n || ''),
          tag: it.tag || ''
        });
      });
    });
    cachedItems = items;
    return items;
  }

  // ─── Búsqueda ──────────────────────────────────────────────────────────
  var debounce = null;
  input.addEventListener('input', function(){
    clearTimeout(debounce);
    debounce = setTimeout(doSearch, 180);
  });
  input.addEventListener('focus', function(){
    if(input.value.trim().length >= 2) doSearch();
  });
  document.addEventListener('click', function(e){
    if(!e.target.closest('.dir-search-wrap')) results.classList.remove('open');
  });

  function normalize(str){
    return (str || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  }

  function doSearch(){
    var q = normalize(input.value.trim());
    if(q.length < 2){
      results.classList.remove('open');
      results.innerHTML = '';
      return;
    }

    loadNegocios().then(function(items){
      if(!items || !items.length){
        results.classList.remove('open');
        results.innerHTML = '<div class="dir-search-empty">Sin datos disponibles</div>';
        return;
      }

      var matches = items.filter(function(it){
        var n = normalize(it.name);
        var a = normalize(it.addr);
        var c = normalize(catLabels[it.cat] || it.cat);
        var t = normalize(it.tag);
        return n.indexOf(q) !== -1 || a.indexOf(q) !== -1 || c.indexOf(q) !== -1 || t.indexOf(q) !== -1;
      }).slice(0, 8);

      if(!matches.length){
        results.innerHTML = '<div class="dir-search-empty">Sin resultados para "' + escHtml(input.value.trim()) + '"</div>';
        results.classList.add('open');
        return;
      }

      results.innerHTML = matches.map(function(it){
        var icon = catEmojis[it.cat] || '📍';
        var label = catLabels[it.cat] || it.cat;
        // Todas las fichas van a /comercio/#slug
        var href = '/comercio/#' + it.slug;
        return '<a class="dir-search-item" href="' + href + '">' +
          '<span class="dsi-icon">' + icon + '</span>' +
          '<div><div class="dsi-name">' + escHtml(it.name) + '</div>' +
          '<div class="dsi-cat">' + escHtml(label) + (it.addr ? ' · ' + escHtml(it.addr) : '') + '</div></div></a>';
      }).join('');
      results.classList.add('open');
    });
  }

  // ─── Precargar datos al pasar el mouse sobre el buscador ────────────────
  input.addEventListener('mouseenter', function(){
    loadNegocios();
  }, { once: true });

})();
