/**
 * Genera fichas HTML con links wa.me personalizados
 * y mensajes pre-escritos para cada contacto de Pomaire 360
 */
const fs = require('fs');
const path = require('path');

const contacts = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'contactos.json'), 'utf8')
);

// Mensajes por categoría
function getMessage(contact) {
  const name = contact.nombre;
  if (contact.categoria === 'Restaurante') {
    return `¡Hola ${name}! 👋\n\nSoy del equipo de *Pomaire 360* (pomaire360.cl), la guía digital gratuita más completa de Pomaire.\n\nTu restaurante ya aparece en nuestro directorio. Ahora estamos mejorando las fichas de cada local gastronómico para que los visitantes los encuentren más fácil 🍽️\n\n¿Te gustaría tener tu ficha completa? Es *gratuito* e incluye:\n\n✅ Ficha destacada con fotos de tus platos y local\n✅ Menú o especialidades visibles para los turistas\n✅ Link directo a tu WhatsApp para reservas\n✅ Horarios actualizados y días de atención\n✅ Reseñas y valoraciones en app.pomaire360.cl\n✅ Aparecer en Google cuando busquen "dónde comer en Pomaire"\n\nSolo necesito unas fotos de tu local/platos y confirmar tus horarios.\n\n¿Te interesa participar? ¡Respóndeme! 🙌\n\nSaludos,\nEquipo Pomaire 360\n🌐 pomaire360.cl`;
  }
  // Artesanos, talleres, demostraciones
  return `¡Hola ${name}! 👋\n\nSoy del equipo de *Pomaire 360* (pomaire360.cl), la guía digital gratuita más completa de Pomaire.\n\nTu taller/tienda ya aparece en nuestro directorio. Ahora estamos trabajando en algo especial: queremos *contar la historia de cada artesano* de Pomaire 🏺✨\n\n¿Te gustaría participar? Es totalmente gratuito e incluye:\n\n✅ Tu ficha destacada en pomaire360.cl con fotos\n✅ Tu historia como artesano/a\n✅ Link directo a tu WhatsApp para que los turistas te contacten\n✅ Aparecer en Google cuando busquen "artesanos en Pomaire"\n✅ Reseñas y valoraciones en app.pomaire360.cl\n\nSolo necesitamos una breve conversación para conocer tu historia y unas fotos de tu trabajo.\n\n¿Te interesa? ¡Respóndeme y coordinamos! 🙌\n\nSaludos,\nEquipo Pomaire 360\n🌐 pomaire360.cl`;
}

function encodeWAMessage(text) {
  return encodeURIComponent(text);
}


function getCategoryIcon(cat) {
  switch(cat) {
    case 'Taller de greda': return '🎨';
    case 'Demostración en torno': return '🌀';
    case 'Artesano/Tienda de greda': return '🏺';
    case 'Restaurante': return '🍽️';
    default: return '🛍️';
  }
}

function getCategoryColor(cat) {
  switch(cat) {
    case 'Taller de greda': return '#e67e22';
    case 'Demostración en torno': return '#8e44ad';
    case 'Artesano/Tienda de greda': return '#c0392b';
    case 'Restaurante': return '#27ae60';
    default: return '#2980b9';
  }
}

function generateCard(contact, index) {
  const tel = contact.telefono.replace('+', '');
  const msg = getMessage(contact);
  const waLink = tel ? `https://wa.me/${tel}?text=${encodeWAMessage(msg)}` : '';
  const icon = getCategoryIcon(contact.categoria);
  const color = getCategoryColor(contact.categoria);
  const igLink = contact.instagram 
    ? `<a href="https://instagram.com/${contact.instagram.replace('@','')}" target="_blank" class="ig-link">📷 ${contact.instagram}</a>` 
    : '';
  const status = '⬜ Pendiente';

  return `
    <div class="ficha" style="border-left: 4px solid ${color}">
      <div class="ficha-header">
        <span class="ficha-num">#${index + 1}</span>
        <span class="ficha-cat">${icon} ${contact.categoria}</span>
        <span class="ficha-status" id="status-${index}">${status}</span>
      </div>
      <h3 class="ficha-name">${contact.nombre}</h3>
      <p class="ficha-addr">📍 ${contact.direccion || 'Sin dirección'}</p>
      <p class="ficha-tel">📞 ${contact.telefono || 'Sin teléfono'}</p>
      ${igLink ? `<p class="ficha-ig">${igLink}</p>` : ''}
      ${contact.tag ? `<p class="ficha-tag">🏷️ ${contact.tag}</p>` : ''}
      <div class="ficha-actions">
        ${waLink ? `<a href="${waLink}" target="_blank" class="btn-wa">💬 Enviar WhatsApp</a>` : '<span class="no-tel">Sin teléfono</span>'}
        <button class="btn-done" onclick="markDone(${index})">✅ Marcar contactado</button>
        <button class="btn-skip" onclick="markSkip(${index})">⏭️ Saltar</button>
      </div>
    </div>`;
}


// Generar HTML completo
const cards = contacts.map((c, i) => generateCard(c, i)).join('\n');

const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Fichas de Contacto - Pomaire 360</title>
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f5f5; padding: 20px; }
.header { text-align: center; margin-bottom: 30px; background: #fff; padding: 30px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
.header h1 { color: #2c3e50; margin-bottom: 10px; }
.header p { color: #666; }
.stats { display: flex; gap: 15px; justify-content: center; margin-top: 15px; flex-wrap: wrap; }
.stat { background: #ecf0f1; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 600; }
.filters { display: flex; gap: 10px; justify-content: center; margin-bottom: 20px; flex-wrap: wrap; }
.filter-btn { padding: 8px 16px; border: none; border-radius: 20px; cursor: pointer; font-size: 13px; background: #ddd; transition: all 0.2s; }
.filter-btn.active, .filter-btn:hover { background: #3498db; color: #fff; }
.fichas-grid { max-width: 900px; margin: 0 auto; }
.ficha { background: #fff; border-radius: 10px; padding: 20px; margin-bottom: 15px; box-shadow: 0 2px 6px rgba(0,0,0,0.08); transition: transform 0.2s; }
.ficha:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.12); }
.ficha-header { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.ficha-num { background: #2c3e50; color: #fff; padding: 2px 8px; border-radius: 10px; font-size: 12px; font-weight: 700; }
.ficha-cat { font-size: 13px; color: #666; }
.ficha-status { margin-left: auto; font-size: 13px; }
.ficha-name { font-size: 18px; color: #2c3e50; margin-bottom: 8px; }
.ficha-addr, .ficha-tel, .ficha-ig, .ficha-tag { font-size: 14px; color: #555; margin-bottom: 4px; }
.ficha-actions { display: flex; gap: 10px; margin-top: 15px; flex-wrap: wrap; }
.btn-wa { display: inline-block; background: #25D366; color: #fff; padding: 10px 20px; border-radius: 25px; text-decoration: none; font-weight: 600; font-size: 14px; transition: background 0.2s; }
.btn-wa:hover { background: #128C7E; }
.btn-done { background: #27ae60; color: #fff; border: none; padding: 10px 16px; border-radius: 25px; cursor: pointer; font-size: 13px; }
.btn-skip { background: #95a5a6; color: #fff; border: none; padding: 10px 16px; border-radius: 25px; cursor: pointer; font-size: 13px; }
.no-tel { color: #e74c3c; font-style: italic; font-size: 13px; }
.ig-link { color: #c13584; text-decoration: none; font-weight: 500; }
.ig-link:hover { text-decoration: underline; }
.done { opacity: 0.5; }
.hidden { display: none; }
</style>
</head>
<body>
<div class="header">
  <h1>📋 Fichas de Contacto - Pomaire 360</h1>
  <p>Haz clic en "Enviar WhatsApp" para abrir la conversación con el mensaje pre-escrito</p>
  <div class="stats">
    <span class="stat">📊 Total: ${contacts.length}</span>
    <span class="stat">📞 Con teléfono: ${contacts.filter(c=>c.telefono).length}</span>
    <span class="stat" id="stat-done">✅ Contactados: 0</span>
    <span class="stat" id="stat-pending">⏳ Pendientes: ${contacts.filter(c=>c.telefono).length}</span>
  </div>
</div>

<div class="filters">
  <button class="filter-btn active" onclick="filterBy('all')">Todos</button>
  <button class="filter-btn" onclick="filterBy('Taller de greda')">🎨 Talleres</button>
  <button class="filter-btn" onclick="filterBy('Demostración en torno')">🌀 Demos</button>
  <button class="filter-btn" onclick="filterBy('Artesano/Tienda de greda')">🏺 Artesanos</button>
  <button class="filter-btn" onclick="filterBy('Restaurante')">🍽️ Restaurantes</button>
  <button class="filter-btn" onclick="filterBy('done')">✅ Contactados</button>
  <button class="filter-btn" onclick="filterBy('pending')">⏳ Pendientes</button>
</div>

<div class="fichas-grid">
${cards}
</div>

<script>
const state = JSON.parse(localStorage.getItem('pomaire360_contacts') || '{}');
const cats = ${JSON.stringify(contacts.map(c => c.categoria))};

// Restore state
Object.keys(state).forEach(i => {
  const el = document.getElementById('status-' + i);
  const ficha = el?.closest('.ficha');
  if (state[i] === 'done') {
    el.textContent = '✅ Contactado';
    ficha?.classList.add('done');
  } else if (state[i] === 'skip') {
    el.textContent = '⏭️ Saltado';
    ficha?.classList.add('done');
  }
});
updateStats();

function markDone(i) {
  state[i] = 'done';
  localStorage.setItem('pomaire360_contacts', JSON.stringify(state));
  document.getElementById('status-' + i).textContent = '✅ Contactado';
  document.getElementById('status-' + i).closest('.ficha').classList.add('done');
  updateStats();
}

function markSkip(i) {
  state[i] = 'skip';
  localStorage.setItem('pomaire360_contacts', JSON.stringify(state));
  document.getElementById('status-' + i).textContent = '⏭️ Saltado';
  document.getElementById('status-' + i).closest('.ficha').classList.add('done');
  updateStats();
}

function updateStats() {
  const done = Object.values(state).filter(v => v === 'done').length;
  const total = ${contacts.filter(c=>c.telefono).length};
  document.getElementById('stat-done').textContent = '✅ Contactados: ' + done;
  document.getElementById('stat-pending').textContent = '⏳ Pendientes: ' + (total - done);
}

function filterBy(cat) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  document.querySelectorAll('.ficha').forEach((f, i) => {
    if (cat === 'all') { f.classList.remove('hidden'); }
    else if (cat === 'done') { f.classList.toggle('hidden', state[i] !== 'done'); }
    else if (cat === 'pending') { f.classList.toggle('hidden', !!state[i]); }
    else { f.classList.toggle('hidden', cats[i] !== cat); }
  });
}
</script>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, 'fichas-contacto.html'), html, 'utf8');
console.log('✅ Fichas HTML generadas: fichas-contacto.html');
console.log('   - ' + contacts.length + ' fichas con links wa.me personalizados');
console.log('   - Mensajes pre-escritos diferenciados por categoría');
console.log('   - Sistema de seguimiento (contactado/pendiente/saltado)');
