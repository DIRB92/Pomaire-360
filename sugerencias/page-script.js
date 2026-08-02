/* Claves de traducción exclusivas de esta página, fusionadas en LANGS
   antes de que subi18n.js aplique el idioma (sin tocar langs.js). */
(function(){
  var X = {
    es:{ sg_title:"Sugerencias y comentarios", sg_sub:"¿Encontraste un error, tienes una idea o quieres dejar tu comentario? Ayúdanos a mejorar la guía de Pomaire. Tu mensaje llega directo a nuestro correo y WhatsApp.", sg_form_title:"📝 Cuéntanos tu sugerencia", sg_label_name:"Tu nombre", sg_label_email:"Tu correo", sg_optional:"(opcional)", sg_ph_name:"Ej: Camila", sg_ph_email:"tucorreo@ejemplo.com", sg_label_type:"Tipo de mensaje", sg_opt_general:"💡 Idea o sugerencia general", sg_opt_place:"📍 Corregir datos de un lugar", sg_opt_business:"🏪 Sumar un negocio o lugar", sg_opt_error:"🐞 Reportar un error del sitio", sg_opt_praise:"💛 Felicitaciones", sg_opt_other:"✉️ Otro", sg_label_msg:"Tu mensaje", sg_ph_msg:"Escribe aquí tu comentario o sugerencia...", sg_send_wa:"Enviar por WhatsApp", sg_send_mail:"Enviar por correo", sg_note:"🔒 No compartimos tus datos. Usamos tu mensaje solo para responderte y mejorar la guía.", sg_alert_msg:"Por favor escribe tu mensaje antes de enviar.", sg_subject:"Sugerencia para Pomaire 360", sg_lbl_type:"Tipo", sg_lbl_name:"Nombre", sg_lbl_email:"Correo", sg_b1_t:"👂 Te escuchamos", sg_b1_d:"Cada comentario lo revisa una persona real del proyecto.", sg_b2_t:"🔄 Datos al día", sg_b2_d:"Nos ayudas a corregir horarios, direcciones y contactos.", sg_b3_t:"🤝 Hecho con la comunidad", sg_b3_d:"Pomaire 360 mejora gracias a quienes visitan y viven el pueblo.", nav_suggest:"Sugerencias" },
    en:{ sg_title:"Suggestions & feedback", sg_sub:"Found an error, have an idea or want to leave a comment? Help us improve the Pomaire guide. Your message goes straight to our email and WhatsApp.", sg_form_title:"📝 Send us your suggestion", sg_label_name:"Your name", sg_label_email:"Your email", sg_optional:"(optional)", sg_ph_name:"E.g. Camila", sg_ph_email:"youremail@example.com", sg_label_type:"Message type", sg_opt_general:"💡 General idea or suggestion", sg_opt_place:"📍 Fix details of a place", sg_opt_business:"🏪 Add a business or place", sg_opt_error:"🐞 Report a site bug", sg_opt_praise:"💛 Compliments", sg_opt_other:"✉️ Other", sg_label_msg:"Your message", sg_ph_msg:"Write your comment or suggestion here...", sg_send_wa:"Send via WhatsApp", sg_send_mail:"Send by email", sg_note:"🔒 We don't share your data. We use your message only to reply and improve the guide.", sg_alert_msg:"Please write your message before sending.", sg_subject:"Suggestion for Pomaire 360", sg_lbl_type:"Type", sg_lbl_name:"Name", sg_lbl_email:"Email", sg_b1_t:"👂 We listen", sg_b1_d:"Every comment is reviewed by a real person on the project.", sg_b2_t:"🔄 Up-to-date info", sg_b2_d:"You help us fix opening hours, addresses and contacts.", sg_b3_t:"🤝 Built with the community", sg_b3_d:"Pomaire 360 improves thanks to those who visit and live in the town.", nav_suggest:"Feedback" },
    pt:{ sg_title:"Sugestões e comentários", sg_sub:"Encontrou um erro, tem uma ideia ou quer deixar um comentário? Ajude-nos a melhorar o guia de Pomaire. Sua mensagem chega direto ao nosso e-mail e WhatsApp.", sg_form_title:"📝 Conte sua sugestão", sg_label_name:"Seu nome", sg_label_email:"Seu e-mail", sg_optional:"(opcional)", sg_ph_name:"Ex: Camila", sg_ph_email:"seuemail@exemplo.com", sg_label_type:"Tipo de mensagem", sg_opt_general:"💡 Ideia ou sugestão geral", sg_opt_place:"📍 Corrigir dados de um lugar", sg_opt_business:"🏪 Adicionar um negócio ou lugar", sg_opt_error:"🐞 Reportar um erro do site", sg_opt_praise:"💛 Elogios", sg_opt_other:"✉️ Outro", sg_label_msg:"Sua mensagem", sg_ph_msg:"Escreva aqui seu comentário ou sugestão...", sg_send_wa:"Enviar pelo WhatsApp", sg_send_mail:"Enviar por e-mail", sg_note:"🔒 Não compartilhamos seus dados. Usamos sua mensagem apenas para responder e melhorar o guia.", sg_alert_msg:"Por favor, escreva sua mensagem antes de enviar.", sg_subject:"Sugestão para Pomaire 360", sg_lbl_type:"Tipo", sg_lbl_name:"Nome", sg_lbl_email:"E-mail", sg_b1_t:"👂 Nós ouvimos", sg_b1_d:"Cada comentário é revisado por uma pessoa real do projeto.", sg_b2_t:"🔄 Dados atualizados", sg_b2_d:"Você nos ajuda a corrigir horários, endereços e contatos.", sg_b3_t:"🤝 Feito com a comunidade", sg_b3_d:"O Pomaire 360 melhora graças a quem visita e vive no povoado.", nav_suggest:"Sugestões" },
    fr:{ sg_title:"Suggestions et commentaires", sg_sub:"Vous avez trouvé une erreur, une idée ou un commentaire ? Aidez-nous à améliorer le guide de Pomaire. Votre message arrive directement sur notre e-mail et WhatsApp.", sg_form_title:"📝 Envoyez votre suggestion", sg_label_name:"Votre nom", sg_label_email:"Votre e-mail", sg_optional:"(facultatif)", sg_ph_name:"Ex : Camila", sg_ph_email:"votremail@exemple.com", sg_label_type:"Type de message", sg_opt_general:"💡 Idée ou suggestion générale", sg_opt_place:"📍 Corriger les infos d'un lieu", sg_opt_business:"🏪 Ajouter un commerce ou un lieu", sg_opt_error:"🐞 Signaler un bug du site", sg_opt_praise:"💛 Félicitations", sg_opt_other:"✉️ Autre", sg_label_msg:"Votre message", sg_ph_msg:"Écrivez ici votre commentaire ou suggestion...", sg_send_wa:"Envoyer par WhatsApp", sg_send_mail:"Envoyer par e-mail", sg_note:"🔒 Nous ne partageons pas vos données. Nous utilisons votre message uniquement pour vous répondre et améliorer le guide.", sg_alert_msg:"Veuillez écrire votre message avant d'envoyer.", sg_subject:"Suggestion pour Pomaire 360", sg_lbl_type:"Type", sg_lbl_name:"Nom", sg_lbl_email:"E-mail", sg_b1_t:"👂 On vous écoute", sg_b1_d:"Chaque commentaire est lu par une vraie personne du projet.", sg_b2_t:"🔄 Infos à jour", sg_b2_d:"Vous nous aidez à corriger horaires, adresses et contacts.", sg_b3_t:"🤝 Fait avec la communauté", sg_b3_d:"Pomaire 360 s'améliore grâce à ceux qui visitent et habitent le village.", nav_suggest:"Suggestions" },
    ru:{ sg_title:"Предложения и отзывы", sg_sub:"Нашли ошибку, есть идея или хотите оставить комментарий? Помогите нам улучшить гид по Помайре. Ваше сообщение придёт прямо на нашу почту и в WhatsApp.", sg_form_title:"📝 Расскажите своё предложение", sg_label_name:"Ваше имя", sg_label_email:"Ваш e-mail", sg_optional:"(необязательно)", sg_ph_name:"Напр.: Camila", sg_ph_email:"vashemail@primer.com", sg_label_type:"Тип сообщения", sg_opt_general:"💡 Идея или общее предложение", sg_opt_place:"📍 Исправить данные места", sg_opt_business:"🏪 Добавить заведение или место", sg_opt_error:"🐞 Сообщить об ошибке сайта", sg_opt_praise:"💛 Благодарность", sg_opt_other:"✉️ Другое", sg_label_msg:"Ваше сообщение", sg_ph_msg:"Напишите здесь ваш комментарий или предложение...", sg_send_wa:"Отправить в WhatsApp", sg_send_mail:"Отправить по e-mail", sg_note:"🔒 Мы не передаём ваши данные. Сообщение используется только для ответа и улучшения гида.", sg_alert_msg:"Пожалуйста, напишите сообщение перед отправкой.", sg_subject:"Предложение для Pomaire 360", sg_lbl_type:"Тип", sg_lbl_name:"Имя", sg_lbl_email:"E-mail", sg_b1_t:"👂 Мы слушаем", sg_b1_d:"Каждый комментарий читает реальный человек из проекта.", sg_b2_t:"🔄 Актуальные данные", sg_b2_d:"Вы помогаете исправлять часы работы, адреса и контакты.", sg_b3_t:"🤝 Создано с сообществом", sg_b3_d:"Pomaire 360 улучшается благодаря тем, кто посещает посёлок и живёт в нём.", nav_suggest:"Отзывы" },
    ja:{ sg_title:"ご意見・ご提案", sg_sub:"間違いを見つけた、アイデアがある、コメントを残したいですか？ ポマイレのガイド改善にご協力ください。メッセージは私たちのメールとWhatsAppに直接届きます。", sg_form_title:"📝 ご提案をお聞かせください", sg_label_name:"お名前", sg_label_email:"メールアドレス", sg_optional:"（任意）", sg_ph_name:"例：Camila", sg_ph_email:"yourmail@example.com", sg_label_type:"メッセージの種類", sg_opt_general:"💡 アイデア・一般的な提案", sg_opt_place:"📍 場所の情報を修正", sg_opt_business:"🏪 店舗や場所を追加", sg_opt_error:"🐞 サイトの不具合を報告", sg_opt_praise:"💛 応援メッセージ", sg_opt_other:"✉️ その他", sg_label_msg:"メッセージ", sg_ph_msg:"ここにコメントやご提案をご記入ください...", sg_send_wa:"WhatsAppで送信", sg_send_mail:"メールで送信", sg_note:"🔒 データは共有しません。メッセージは返信とガイド改善のためにのみ使用します。", sg_alert_msg:"送信する前にメッセージをご記入ください。", sg_subject:"Pomaire 360 へのご提案", sg_lbl_type:"種類", sg_lbl_name:"お名前", sg_lbl_email:"メール", sg_b1_t:"👂 お聞きします", sg_b1_d:"すべてのコメントはプロジェクトの実在の担当者が確認します。", sg_b2_t:"🔄 最新の情報", sg_b2_d:"営業時間・住所・連絡先の修正にご協力いただけます。", sg_b3_t:"🤝 コミュニティと共に", sg_b3_d:"Pomaire 360 は村を訪れ、暮らす人々のおかげで良くなります。", nav_suggest:"ご意見" },
    zh:{ sg_title:"建议与反馈", sg_sub:"发现了错误、有好点子或想留言？帮助我们改进波马伊雷指南。您的留言会直接发送到我们的邮箱和 WhatsApp。", sg_form_title:"📝 告诉我们您的建议", sg_label_name:"您的姓名", sg_label_email:"您的邮箱", sg_optional:"（可选）", sg_ph_name:"例如：Camila", sg_ph_email:"youremail@example.com", sg_label_type:"留言类型", sg_opt_general:"💡 想法或一般建议", sg_opt_place:"📍 更正某地点的信息", sg_opt_business:"🏪 添加商家或地点", sg_opt_error:"🐞 报告网站错误", sg_opt_praise:"💛 表扬鼓励", sg_opt_other:"✉️ 其他", sg_label_msg:"您的留言", sg_ph_msg:"在此写下您的评论或建议...", sg_send_wa:"通过 WhatsApp 发送", sg_send_mail:"通过邮件发送", sg_note:"🔒 我们不会分享您的数据。您的留言仅用于回复您和改进指南。", sg_alert_msg:"请先填写留言再发送。", sg_subject:"给 Pomaire 360 的建议", sg_lbl_type:"类型", sg_lbl_name:"姓名", sg_lbl_email:"邮箱", sg_b1_t:"👂 我们倾听", sg_b1_d:"每条留言都由项目中的真人查看。", sg_b2_t:"🔄 信息及时更新", sg_b2_d:"您帮助我们更正营业时间、地址和联系方式。", sg_b3_t:"🤝 与社区共建", sg_b3_d:"Pomaire 360 因到访和生活在镇上的人们而不断改善。", nav_suggest:"反馈" }
  };
  if (window.LANGS) { for (var l in X) { if (window.LANGS[l]) { for (var k in X[l]) window.LANGS[l][k] = X[l][k]; } } }
})();

/* ── Configuración de contacto ──────────────────────────────────────────────
   WhatsApp: número del proyecto (mismo de "Anúnciate").
   Correo: dirección donde quieres recibir las sugerencias.
   ⚠️ Cambia CONTACT_EMAIL por el correo real donde quieras recibir los mensajes. */
var CONTACT_WA = '56957517166';
var CONTACT_EMAIL = 'contacto@pomaire360.cl';

function sgTxt(key){
  var L = window.LANGS || {}, lang = document.documentElement.lang || 'es';
  var t = (L[lang] && L[lang][key] !== undefined) ? L[lang][key] : (L.es ? L.es[key] : key);
  return t !== undefined ? t : key;
}

function sendSuggestion(channel){
  var form = document.getElementById('sgForm');
  var name = (document.getElementById('sg-name').value || '').trim();
  var email = (document.getElementById('sg-email').value || '').trim();
  var typeSel = document.getElementById('sg-type');
  var typeLabel = typeSel.options[typeSel.selectedIndex].text.replace(/^[^\p{L}\p{N}]+/u, '').trim();
  var message = (document.getElementById('sg-message').value || '').trim();
  var errEl = document.getElementById('sgError');
  var msgErrEl = document.getElementById('sgMsgError');

  // Mark form as validated for CSS states
  form.classList.add('was-validated');

  // Validate message field
  if (!message) {
    errEl.style.display = 'block';
    if (msgErrEl) { msgErrEl.textContent = sgTxt('sg_alert_msg'); msgErrEl.classList.add('visible'); }
    document.getElementById('sg-message').focus();
    return;
  }
  if (message.length < 10) {
    errEl.style.display = 'block';
    if (msgErrEl) { msgErrEl.textContent = 'Mensaje muy corto (mín. 10 caracteres)'; msgErrEl.classList.add('visible'); }
    document.getElementById('sg-message').focus();
    return;
  }

  // Validate email format if provided
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errEl.style.display = 'block';
    errEl.textContent = 'Por favor ingresa un correo válido.';
    document.getElementById('sg-email').focus();
    return;
  }

  errEl.style.display = 'none';
  if (msgErrEl) { msgErrEl.classList.remove('visible'); }

  // Cuerpo del mensaje (texto plano, multilínea)
  var lines = [];
  lines.push('🏺 ' + sgTxt('sg_subject'));
  lines.push(sgTxt('sg_lbl_type') + ': ' + typeLabel);
  if (name)  lines.push(sgTxt('sg_lbl_name') + ': ' + name);
  if (email) lines.push(sgTxt('sg_lbl_email') + ': ' + email);
  lines.push('');
  lines.push(message);
  var body = lines.join('\n');

  if (channel === 'wa') {
    window.open('https://wa.me/' + CONTACT_WA + '?text=' + encodeURIComponent(body), '_blank', 'noopener');
  } else {
    var subject = sgTxt('sg_subject') + ' — ' + typeLabel;
    var mailto = 'mailto:' + CONTACT_EMAIL +
                 '?subject=' + encodeURIComponent(subject) +
                 '&body=' + encodeURIComponent(body);
    window.location.href = mailto;
  }
}
