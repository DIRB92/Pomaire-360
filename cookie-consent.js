(function() {
'use strict';
var STORAGE_KEY = 'p360_cookie_consent';
try {
var consent = localStorage.getItem(STORAGE_KEY);
if (consent === '1' || consent === 'all' || consent === 'essential') return;
} catch(e) { return; }

// Textos por idioma (es/en/pt/ja estáticos + fr/ru/zh del switcher dinámico).
var I18N = {
es: { aria: 'Consentimiento de cookies', msg: 'Usamos cookies esenciales y de an\u00e1lisis para mejorar tu experiencia.', link: 'Pol\u00edtica de privacidad', reject: 'Solo esenciales', accept: 'Aceptar todas' },
en: { aria: 'Cookie consent', msg: 'We use essential and analytics cookies to improve your experience.', link: 'Privacy policy', reject: 'Essential only', accept: 'Accept all' },
pt: { aria: 'Consentimento de cookies', msg: 'Usamos cookies essenciais e de an\u00e1lise para melhorar a sua experi\u00eancia.', link: 'Pol\u00edtica de privacidade', reject: 'Apenas essenciais', accept: 'Aceitar todos' },
ja: { aria: 'Cookie\u306e\u540c\u610f', msg: '\u3088\u308a\u826f\u3044\u4f53\u9a13\u306e\u305f\u3081\u3001\u5fc5\u9808Cookie\u3068\u5206\u6790\u7528Cookie\u3092\u4f7f\u7528\u3057\u3066\u3044\u307e\u3059\u3002', link: '\u30d7\u30e9\u30a4\u30d0\u30b7\u30fc\u30dd\u30ea\u30b7\u30fc', reject: '\u5fc5\u9808\u306e\u307f', accept: '\u3059\u3079\u3066\u8a31\u53ef' },
fr: { aria: 'Consentement aux cookies', msg: 'Nous utilisons des cookies essentiels et d\u2019analyse pour am\u00e9liorer votre exp\u00e9rience.', link: 'Politique de confidentialit\u00e9', reject: 'Essentiels uniquement', accept: 'Tout accepter' },
ru: { aria: '\u0421\u043e\u0433\u043b\u0430\u0441\u0438\u0435 \u043d\u0430 cookie', msg: '\u041c\u044b \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u0443\u0435\u043c \u043e\u0441\u043d\u043e\u0432\u043d\u044b\u0435 \u0438 \u0430\u043d\u0430\u043b\u0438\u0442\u0438\u0447\u0435\u0441\u043a\u0438\u0435 \u0444\u0430\u0439\u043b\u044b cookie, \u0447\u0442\u043e\u0431\u044b \u0443\u043b\u0443\u0447\u0448\u0438\u0442\u044c \u0432\u0430\u0448 \u043e\u043f\u044b\u0442.', link: '\u041f\u043e\u043b\u0438\u0442\u0438\u043a\u0430 \u043a\u043e\u043d\u0444\u0438\u0434\u0435\u043d\u0446\u0438\u0430\u043b\u044c\u043d\u043e\u0441\u0442\u0438', reject: '\u0422\u043e\u043b\u044c\u043a\u043e \u043d\u0435\u043e\u0431\u0445\u043e\u0434\u0438\u043c\u044b\u0435', accept: '\u041f\u0440\u0438\u043d\u044f\u0442\u044c \u0432\u0441\u0435' },
zh: { aria: 'Cookie \u540c\u610f', msg: '\u6211\u4eec\u4f7f\u7528\u5fc5\u8981\u7684\u548c\u5206\u6790\u7c7b Cookie \u6765\u6539\u5584\u60a8\u7684\u4f53\u9a8c\u3002', link: '\u9690\u79c1\u653f\u7b56', reject: '\u4ec5\u5fc5\u8981', accept: '\u5168\u90e8\u63a5\u53d7' }
};
function dict() {
var l = (document.documentElement.lang || 'es').slice(0, 2).toLowerCase();
return I18N[l] || I18N.es;
}

function init() {
var banner = document.createElement('div');
banner.id = 'cookieConsent';
banner.setAttribute('role', 'dialog');
var text = document.createElement('p');
text.className = 'cookie-text';
var msg = document.createElement('span');
var link = document.createElement('a');
link.href = '/privacidad/';
text.appendChild(msg);
text.appendChild(document.createTextNode(' '));
text.appendChild(link);
var btnWrap = document.createElement('div');
btnWrap.className = 'cookie-buttons';
var btnReject = document.createElement('button');
btnReject.type = 'button';
btnReject.className = 'cookie-btn-reject';
btnReject.onclick = function() {
try { localStorage.setItem(STORAGE_KEY, 'essential'); } catch(e) {}
window['ga-disable-G-ZR4KWKER0B'] = true;
banner.style.animation = 'cookieSlideDown .3s ease forwards';
setTimeout(function() { banner.parentNode && banner.parentNode.removeChild(banner); }, 350);
};
var btn = document.createElement('button');
btn.type = 'button';
btn.className = 'cookie-btn-accept';
btn.onclick = function() {
try { localStorage.setItem(STORAGE_KEY, 'all'); } catch(e) {}
banner.style.animation = 'cookieSlideDown .3s ease forwards';
setTimeout(function() { banner.parentNode && banner.parentNode.removeChild(banner); }, 350);
};

function applyLang() {
var d = dict();
banner.setAttribute('aria-label', d.aria);
msg.textContent = d.msg;
link.textContent = d.link;
btnReject.textContent = d.reject;
btn.textContent = d.accept;
}
applyLang();
// Si el usuario cambia de idioma con el switcher dinámico, el banner lo sigue.
new MutationObserver(applyLang).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

btnWrap.appendChild(btnReject);
btnWrap.appendChild(btn);
banner.appendChild(text);
banner.appendChild(btnWrap);
document.body.appendChild(banner);
}
if (document.readyState === 'loading') {
document.addEventListener('DOMContentLoaded', init);
} else {
init();
}
})();
