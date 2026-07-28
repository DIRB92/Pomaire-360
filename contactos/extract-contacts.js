/**
 * Script para extraer contactos de los archivos HTML de Pomaire 360
 * Genera un JSON con todos los negocios/artesanos
 */
const fs = require('fs');
const path = require('path');

function extractContacts(html, categoria) {
  const contacts = [];
  const regex = /<div class="dir-item">(.*?)<\/div><\/div>/gs;
  let match;

  while ((match = regex.exec(html)) !== null) {
    const block = match[1];
    const nameMatch = block.match(/<span class="dir-name">(.*?)<\/span>/);
    const addrMatch = block.match(/<span class="dir-addr">📍\s*(.*?)<\/span>/);
    const telMatch = block.match(/href="tel:(\+\d+)"/);
    const igMatch = block.match(/href="https:\/\/instagram\.com\/(.*?)"/);
    const tagMatch = block.match(/<span class="dir-tag"[^>]*>(.*?)<\/span>/);

    if (nameMatch) {
      contacts.push({
        nombre: nameMatch[1].trim(),
        direccion: addrMatch ? addrMatch[1].trim() : '',
        telefono: telMatch ? telMatch[1] : '',
        instagram: igMatch ? '@' + igMatch[1] : '',
        tag: tagMatch ? tagMatch[1].trim() : '',
        categoria: categoria
      });
    }
  }
  return contacts;
}

// Leer archivos HTML
const basePath = path.join(__dirname, '..');


const alfareriaHtml = fs.readFileSync(path.join(basePath, 'alfareria', 'index.html'), 'utf8');
const comercioHtml = fs.readFileSync(path.join(basePath, 'comercio', 'index.html'), 'utf8');

// Extraer secciones por categoría del archivo alfarería
const talleres = extractContacts(
  alfareriaHtml.match(/Talleres de greda.*?<\/div>\s*<\/div>\s*<\/div>/s)?.[0] || '',
  'Taller de greda'
);
const demos = extractContacts(
  alfareriaHtml.match(/Demostraciones en torno.*?<\/div>\s*<\/div>\s*<\/div>/s)?.[0] || '',
  'Demostración en torno'
);
const artesanos = extractContacts(
  alfareriaHtml.match(/Tiendas y artesanos.*?<\/div>\s*<\/div>\s*<\/div>/s)?.[0] || '',
  'Artesano/Tienda de greda'
);

// Extraer del archivo comercio - panel pottery
const comercioPottery = extractContacts(
  comercioHtml.match(/data-panel="pottery".*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/s)?.[0] || '',
  'Artesano/Tienda de greda'
);
// Panel food (restaurantes)
const restaurantes = extractContacts(
  comercioHtml.match(/data-panel="food".*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/s)?.[0] || '',
  'Restaurante'
);


// Combinar y deduplicar por teléfono
const allRaw = [...talleres, ...demos, ...artesanos, ...comercioPottery, ...restaurantes];
const seen = new Set();
const all = [];

for (const c of allRaw) {
  const key = c.telefono || c.nombre;
  if (!seen.has(key)) {
    seen.add(key);
    all.push(c);
  }
}

console.log(`Total contactos extraídos: ${all.length}`);
console.log(`- Talleres: ${talleres.length}`);
console.log(`- Demostraciones: ${demos.length}`);
console.log(`- Artesanos (alfarería): ${artesanos.length}`);
console.log(`- Artesanos (comercio): ${comercioPottery.length}`);
console.log(`- Restaurantes: ${restaurantes.length}`);

// Guardar JSON
fs.writeFileSync(
  path.join(__dirname, 'contactos.json'),
  JSON.stringify(all, null, 2),
  'utf8'
);
console.log('\n✅ Archivo contactos.json generado');
