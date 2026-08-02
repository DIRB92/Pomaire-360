/* Pestañas del directorio "Todas las tiendas de Pomaire":
   cada categoría es una ventana que se desliza hacia el costado,
   entrando desde la derecha al avanzar y desde la izquierda al
   retroceder en el orden de las pestañas. */
var pomaireSlideToCat = (function(){
  var tabs = document.querySelectorAll('.shop-cat-tab');
  var catOrder = Array.prototype.map.call(tabs, function(t){ return t.dataset.cat; });
  var current = catOrder[0];

  function slideTo(cat){
    if(cat === current) return;
    var oldPanel = document.querySelector('.shop-cat-panel[data-panel="'+current+'"]');
    var newPanel = document.querySelector('.shop-cat-panel[data-panel="'+cat+'"]');
    if(!newPanel) return;
    var forward = catOrder.indexOf(cat) > catOrder.indexOf(current);
    current = cat;

    tabs.forEach(function(t){ t.classList.toggle('active', t.dataset.cat===cat); t.setAttribute('aria-selected', t.dataset.cat===cat ? 'true':'false'); });

    function showNew(){
      newPanel.classList.add('active');
      newPanel.classList.add(forward ? 'win-in-right' : 'win-in-left');
      newPanel.addEventListener('animationend', function handler(){
        newPanel.classList.remove('win-in-right','win-in-left');
        newPanel.removeEventListener('animationend', handler);
      });
    }

    if(oldPanel && oldPanel !== newPanel){
      var done = false;
      oldPanel.classList.add(forward ? 'win-out-left' : 'win-out-right');
      oldPanel.addEventListener('animationend', function handler(){
        if(done) return; done = true;
        oldPanel.classList.remove('active','win-out-left','win-out-right');
        showNew();
        oldPanel.removeEventListener('animationend', handler);
      });
      setTimeout(function(){
        if(done) return; done = true;
        oldPanel.classList.remove('active','win-out-left','win-out-right');
        showNew();
      }, 260);
    } else {
      showNew();
    }
  }

  tabs.forEach(function(tab){
    tab.addEventListener('click', function(){ slideTo(tab.dataset.cat); });
  });

  return slideTo;
})();

/* Buscador de negocios: filtra por nombre o dirección en todas las categorías,
   y salta a la primera pestaña con resultados para no dejar al usuario
   mirando un panel vacío. */
(function(){
  var input   = document.getElementById('shopSearchInput');
  var clearBt = document.getElementById('shopSearchClear');
  var countEl = document.getElementById('shopSearchCount');
  var panels  = document.querySelectorAll('.shop-cat-panel');
  if(!input) return;

  function norm(str){
    return (str || '').toString().toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // quita tildes
  }

  function activateTab(cat){
    pomaireSlideToCat(cat);
  }

  function runSearch(){
    var q = norm(input.value.trim());
    clearBt.hidden = q.length === 0;

    if(q.length === 0){
      panels.forEach(function(panel){
        panel.querySelectorAll('.dir-item').forEach(function(item){ item.style.display = ''; });
      });
      countEl.textContent = '';
      return;
    }

    var totalMatches = 0;
    var firstMatchCat = null;

    panels.forEach(function(panel){
      var matchesInPanel = 0;
      panel.querySelectorAll('.dir-item').forEach(function(item){
        var name = norm(item.querySelector('.dir-name') ? item.querySelector('.dir-name').textContent : '');
        var addr = norm(item.querySelector('.dir-addr') ? item.querySelector('.dir-addr').textContent : '');
        var tag  = norm(item.querySelector('.dir-tag')  ? item.querySelector('.dir-tag').textContent  : '');
        var match = name.indexOf(q) !== -1 || addr.indexOf(q) !== -1 || tag.indexOf(q) !== -1;
        item.style.display = match ? '' : 'none';
        if(match){ matchesInPanel++; totalMatches++; }
      });
      if(matchesInPanel > 0 && firstMatchCat === null){
        firstMatchCat = panel.dataset.panel;
      }
    });

    if(firstMatchCat){
      activateTab(firstMatchCat);
    }

    countEl.textContent = totalMatches === 0
      ? '😕 Sin resultados para "' + input.value.trim() + '"'
      : totalMatches + (totalMatches === 1 ? ' resultado encontrado' : ' resultados encontrados');
  }

  input.addEventListener('input', runSearch);
  clearBt.addEventListener('click', function(){
    input.value = '';
    input.focus();
    runSearch();
  });
})();
