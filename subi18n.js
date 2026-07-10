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
    var saved=null; try{saved=localStorage.getItem('p360lang');}catch(e){} var lang=saved||((navigator.language||'es').slice(0,2)); if(!window.LANGS||!window.LANGS[lang]) lang='es'; applyLang(lang);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
