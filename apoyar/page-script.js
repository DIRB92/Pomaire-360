/* Claves de traducción exclusivas de esta página, fusionadas en LANGS
   antes de que subi18n.js aplique el idioma (sin tocar langs.js). */
(function(){
  var X = {
    es:{ apoyar_tag:"💛 Proyecto independiente · Hecho en Pomaire", apoyar_b1_t:"🔄 Siempre actualizado", apoyar_b1_d:"Horarios, contactos y datos revisados constantemente.", apoyar_b2_t:"🚫 Sin publicidad", apoyar_b2_d:"Una guía limpia, sin anuncios ni rastreo.", apoyar_b3_t:"🤝 Apoyo local", apoyar_b3_d:"Damos visibilidad a los artesanos y locales del pueblo.", apoyar_other_t:"Otras formas de apoyar", apoyar_share:"📲 Compartir la guía", apoyar_follow:"📸 Síguenos en Instagram" },
    en:{ apoyar_tag:"💛 Independent project · Made in Pomaire", apoyar_b1_t:"🔄 Always up to date", apoyar_b1_d:"Hours, contacts and details checked constantly.", apoyar_b2_t:"🚫 Ad-free", apoyar_b2_d:"A clean guide, with no ads or tracking.", apoyar_b3_t:"🤝 Local support", apoyar_b3_d:"We give visibility to the village's artisans and shops.", apoyar_other_t:"Other ways to support", apoyar_share:"📲 Share the guide", apoyar_follow:"📸 Follow us on Instagram" },
    pt:{ apoyar_tag:"💛 Projeto independente · Feito em Pomaire", apoyar_b1_t:"🔄 Sempre atualizado", apoyar_b1_d:"Horários, contatos e dados revisados constantemente.", apoyar_b2_t:"🚫 Sem publicidade", apoyar_b2_d:"Um guia limpo, sem anúncios nem rastreamento.", apoyar_b3_t:"🤝 Apoio local", apoyar_b3_d:"Damos visibilidade aos artesãos e comércios do vilarejo.", apoyar_other_t:"Outras formas de apoiar", apoyar_share:"📲 Compartilhar o guia", apoyar_follow:"📸 Siga-nos no Instagram" },
    fr:{ apoyar_tag:"💛 Projet indépendant · Fait à Pomaire", apoyar_b1_t:"🔄 Toujours à jour", apoyar_b1_d:"Horaires, contacts et infos vérifiés en permanence.", apoyar_b2_t:"🚫 Sans publicité", apoyar_b2_d:"Un guide épuré, sans pub ni traçage.", apoyar_b3_t:"🤝 Soutien local", apoyar_b3_d:"Nous donnons de la visibilité aux artisans et commerces du village.", apoyar_other_t:"Autres façons de soutenir", apoyar_share:"📲 Partager le guide", apoyar_follow:"📸 Suivez-nous sur Instagram" },
    ru:{ apoyar_tag:"💛 Независимый проект · Сделано в Помайре", apoyar_b1_t:"🔄 Всегда актуально", apoyar_b1_d:"Часы работы, контакты и данные постоянно обновляются.", apoyar_b2_t:"🚫 Без рекламы", apoyar_b2_d:"Чистый гид — без рекламы и слежки.", apoyar_b3_t:"🤝 Поддержка местных", apoyar_b3_d:"Мы продвигаем мастеров и заведения посёлка.", apoyar_other_t:"Другие способы поддержать", apoyar_share:"📲 Поделиться гидом", apoyar_follow:"📸 Подписывайтесь в Instagram" },
    ja:{ apoyar_tag:"💛 独立プロジェクト · ポマイレ発", apoyar_b1_t:"🔄 常に最新", apoyar_b1_d:"営業時間・連絡先・情報を随時更新。", apoyar_b2_t:"🚫 広告なし", apoyar_b2_d:"広告も追跡もない、すっきりしたガイド。", apoyar_b3_t:"🤝 地元を応援", apoyar_b3_d:"村の職人や店舗を紹介しています。", apoyar_other_t:"他の応援方法", apoyar_share:"📲 ガイドを共有", apoyar_follow:"📸 Instagramでフォロー" },
    zh:{ apoyar_tag:"💛 独立项目 · 波迈雷出品", apoyar_b1_t:"🔄 持续更新", apoyar_b1_d:"营业时间、联系方式和信息持续核实。", apoyar_b2_t:"🚫 无广告", apoyar_b2_d:"干净的指南，无广告、无追踪。", apoyar_b3_t:"🤝 支持本地", apoyar_b3_d:"我们为村里的工匠和店铺提供曝光。", apoyar_other_t:"其他支持方式", apoyar_share:"📲 分享指南", apoyar_follow:"📸 在 Instagram 关注我们" }
  };
  if (window.LANGS) { for (var l in X) { if (window.LANGS[l]) { for (var k in X[l]) window.LANGS[l][k] = X[l][k]; } } }
})();
function shareApoyar(){
  var L = window.LANGS || {}, lang = document.documentElement.lang || 'es';
  var t = (L[lang] && L[lang].wa_share) || (L.es && L.es.wa_share) || 'https://www.pomaire360.cl/';
  if (navigator.share) {
    navigator.share({ title: 'Pomaire 360', text: t, url: 'https://www.pomaire360.cl/' }).catch(function(){});
  } else {
    window.open('https://wa.me/?text=' + encodeURIComponent(t), '_blank', 'noopener');
  }
}
