/* ══ BÚSQUEDA INSTANTÁNEA DEL DIRECTORIO ══ */
(function(){
  const input = document.getElementById('dirSearchInput');
  const results = document.getElementById('dirSearchResults');
  if(!input || !results) return;

  // Mapeo de categoría a página interna del sitio
  const catPages = {
    'Restaurante': '/gastronomia/',
    'Taller': '/alfareria/',
    'Demostración': '/alfareria/',
    'Artesano': '/alfareria/',
    'Alojamiento': '/alojamientos/',
    'Punto de interés': '/que-ver/',
    'Jardín': '/servicios/',
    'Servicio': '/servicios/'
  };

  // Genera slug único para el ancla (id de la ficha)
  function slugify(str){
    return str.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
      .replace(/[^a-z0-9]+/g,'-')
      .replace(/(^-|-$)/g,'');
  }

  // Esperar a que DIRECTORY esté disponible (cargado por app.js)
  function getAllItems(){
    if(typeof DIRECTORY === 'undefined') return [];
    const items = [];
    const cats = {restaurants:'🍽️',talleres:'🎨',demos:'🌀',artesanos:'🏺',alojamientos:'🛏️',interes:'✨',jardin:'🌱',servicios:'📌'};
    const labels = {restaurants:'Restaurante',talleres:'Taller',demos:'Demostración',artesanos:'Artesano',alojamientos:'Alojamiento',interes:'Punto de interés',jardin:'Jardín',servicios:'Servicio'};
    Object.keys(cats).forEach(function(key){
      if(!DIRECTORY[key]) return;
      DIRECTORY[key].forEach(function(it){
        items.push({name:it.n, addr:it.a||'', icon:cats[key], cat:labels[key], phone:it.p||'', map:it.map||null, page:it.page||'', slug:it.slug||''});
      });
    });
    return items;
  }

  let debounce = null;
  input.addEventListener('input', function(){
    clearTimeout(debounce);
    debounce = setTimeout(doSearch, 150);
  });
  input.addEventListener('focus', function(){ if(input.value.trim().length >= 2) doSearch(); });
  document.addEventListener('click', function(e){ if(!e.target.closest('.dir-search-wrap')) results.classList.remove('open'); });

  function doSearch(){
    const q = input.value.trim().toLowerCase();
    if(q.length < 2){ results.classList.remove('open'); results.innerHTML=''; return; }
    const all = getAllItems();
    const matches = all.filter(function(it){
      return it.name.toLowerCase().includes(q) || it.addr.toLowerCase().includes(q) || it.cat.toLowerCase().includes(q);
    }).slice(0, 8);

    if(!matches.length){ results.classList.remove('open'); results.innerHTML=''; return; }

    results.innerHTML = matches.map(function(it){
      // Generar el ID único de la ficha (mismo que card-share.js usa)
      const cardId = it.slug || slugify(it.name);
      // Página base: propia del negocio o la de su categoría
      const basePage = it.page ? it.page : (catPages[it.cat] || '/');
      // URL final apunta directo a la ficha: /gastronomia/#imperio-pomaire
      const href = basePage + '#' + cardId;
      return '<a class="dir-search-item" href="'+href+'">' +
        '<span class="dsi-icon">'+it.icon+'</span>' +
        '<div><div class="dsi-name">'+escHtml(it.name)+'</div><div class="dsi-cat">'+escHtml(it.cat)+' · '+escHtml(it.addr)+'</div></div></a>';
    }).join('');
    results.classList.add('open');
  }

  function escHtml(s){ var d=document.createElement('div'); d.textContent=s; return d.innerHTML; }
})();
