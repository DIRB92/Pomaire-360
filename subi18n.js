/* i18n compartido para subpáginas de Pomaire 360 */
(function(){
  function applyLang(lang){
    var L=window.LANGS; if(!L||!L[lang]) return;
    document.documentElement.lang=lang;
    var t=L[lang], base=L.es;
    var val=function(k){return t[k]!==undefined?t[k]:base[k];};
    document.querySelectorAll('[data-t]').forEach(function(el){var v=val(el.dataset.t); if(v!==undefined) el.innerHTML=v;});
    document.querySelectorAll('[data-ph-t]').forEach(function(el){var v=val(el.dataset.phT); if(v!==undefined) el.setAttribute('placeholder',v);});
    var DT=window.DIR_TAGS||{};
    document.querySelectorAll('.dir-tag').forEach(function(el){
      var o=el.dataset.tag; if(!o) return;
      if(lang==='es'){el.textContent=o;return;}
      var e=DT[o]; el.textContent=(e&&e[lang])?e[lang]:o;
    });
    document.querySelectorAll('.lang-option').forEach(function(b){b.classList.toggle('lang-active', b.dataset.lang===lang);});
    var labels={es:['🇨🇱','Español'],en:['🇬🇧','English'],pt:['🇧🇷','Português'],fr:['🇫🇷','Français'],ru:['🇷🇺','Русский'],ja:['🇯🇵','日本語'],zh:['🇨🇳','中文']};
    if(labels[lang]){var f=document.getElementById('langCurrentFlag'),n=document.getElementById('langCurrentName'); if(f)f.textContent=labels[lang][0]; if(n)n.textContent=labels[lang][1];}
    try{localStorage.setItem('p360lang',lang);}catch(e){}
  }
  function toggleLangMenu(e){ if(e)e.stopPropagation(); var s=document.getElementById('langSelector'); if(s)s.classList.toggle('open'); }
  function selectLang(l){ applyLang(l); var s=document.getElementById('langSelector'); if(s)s.classList.remove('open'); }
  document.addEventListener('click',function(e){ var s=document.getElementById('langSelector'); if(s&&!e.target.closest('#langSelector')) s.classList.remove('open'); });
  window.toggleLangMenu=toggleLangMenu; window.selectLang=selectLang;
  // Los botones es/en/pt son <a href> de navegación real (llevan a la página
  // estática de ese idioma), a diferencia de fr/ru/ja/zh que solo cambian el
  // texto en la misma página vía JS. Sin esto, si el usuario habia elegido
  // antes ru/fr/ja/zh (quedando guardado en localStorage), al hacer clic en
  // "Español" para volver, la pagina en español recien cargada leia ese
  // idioma viejo del localStorage y volvia a aplicarlo, deshaciendo el clic.
  // Se guarda el idioma elegido ANTES de navegar, para que coincida con la
  // pagina de destino real.
  document.querySelectorAll('.lang-option[href]').forEach(function(a){
    a.addEventListener('click', function(){
      var l = a.dataset.lang;
      if (l) { try { localStorage.setItem('p360lang', l); } catch(e){} }
    });
  });
  function init(){
    // Páginas estáticas por idioma (/en/, /pt/): el idioma real de la
    // página es el que ya viene fijado en <html lang="...">, no el que
    // haya quedado guardado en localStorage de una visita anterior a
    // otra sección del sitio. Sin esto, entrar a /en/alfareria/ con
    // 'es' guardado en localStorage revertía todo el contenido ya
    // traducido de vuelta a español (o mezclaba idiomas).
    var htmlLang = document.documentElement.lang;
    if (htmlLang && htmlLang !== 'es' && window.LANGS && window.LANGS[htmlLang]) {
      applyLang(htmlLang);
      return;
    }
    // IMPORTANTE (SEO): en las páginas por defecto (español) NO se debe usar
    // navigator.language para elegir el idioma automáticamente. Googlebot
    // reporta "en-US" por defecto al renderizar, lo que hacía que este script
    // reescribiera con innerHTML todo el contenido visible a inglés antes de
    // que Google capturara el snippet — resultando en subpáginas en español
    // indexadas con títulos y descripciones en inglés. Solo se respeta una
    // elección explícita previa del usuario (guardada en localStorage); si no
    // hay ninguna, se mantiene el español servido por el servidor.
    var saved=null; try{saved=localStorage.getItem('p360lang');}catch(e){}
    var lang=(saved && window.LANGS && window.LANGS[saved]) ? saved : 'es';
    applyLang(lang);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
