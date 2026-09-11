/**
 * extract-contacts.js
 * ─────────────────────────────────────────────────────────────────────────
 * Extrae TODOS los contactos de negocios/artesanos desde la fuente de verdad:
 * el objeto `DIRECTORY` definido en app.js (mismas 8 categorías que se
 * muestran en el sitio y que se migran a Supabase).
 *
 * Antes este script raspaba el HTML de /alfareria y /comercio con regex, pero
 * esas páginas fueron rediseñadas (ahora usan tarjetas `mod-card-*` renderizadas
 * dinámicamente desde Supabase) y el raspado devolvía 0 restaurantes / 0 comercios.
 * Leer directamente el DIRECTORY de app.js es robusto y captura todo el catálogo.
 *
 * USO:   node extract-contacts.js
 * SALIDA: contactos.json  (lista plana normalizada, deduplicada por teléfono)
 * ─────────────────────────────────────────────────────────────────────────
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const APP_JS = path.join(__dirname, '..', 'app.js');

// ── 1. Extraer el objeto DIRECTORY de app.js y evaluarlo en un sandbox seguro ──
const source = fs.readFileSync(APP_JS, 'utf-8');
const match = source.match(/const DIRECTORY\s*=\s*(\{[\s\S]*?\n\};)/);
if (!match) {
  console.error('❌ No se encontró el objeto DIRECTORY en app.js');
  process.exit(1);
}
const sandbox = {};
new vm.Script('__result = ' + match[1].replace(/;\s*$/, ''))
  .runInContext(vm.createContext(sandbox));
const DIRECTORY = sandbox.__result;

// ── 2. Mapear cada clave del DIRECTORY a una categoría legible para el mensaje ──
const CATEGORY_MAP = {
  restaurants:  'Restaurante',
  talleres:     'Taller de greda',
  demos:        'Demostración en torno',
  jardin:       'Vivero/Jardín',
  alojamientos: 'Alojamiento',
  interes:      'Punto de interés',
  servicios:    'Servicio',
  artesanos:    'Artesano/Tienda de greda',
};

// Categorías que NO son negocios "reclamables" (servicios públicos, emergencias,
// plazas, etc.). Se excluyen del envío de propaganda por defecto.
const NON_BUSINESS_TAGS = new Set([
  'Turismo', 'Salud', 'Seguridad', 'Emergencia', 'Dinero',
  'Templo', 'Educación', 'Mirador', 'Servicios',
]);

// ── 3. Aplanar y normalizar ──────────────────────────────────────────────────
const allRaw = [];
for (const [key, cat] of Object.entries(CATEGORY_MAP)) {
  const arr = DIRECTORY[key];
  if (!Array.isArray(arr)) continue;
  for (const item of arr) {
    allRaw.push({
      nombre: (item.n || '').trim(),
      direccion: (item.a || '').trim(),
      // Normalizar teléfono a formato +56... sin espacios para wa.me / tel:
      telefono: (item.p || '').replace(/\s+/g, ''),
      instagram: item.ig ? '@' + item.ig.replace(/^@/, '') : '',
      web: item.web || '',
      map: item.map || '',
      tag: (item.tag || item.d || '').trim(),
      categoria: cat,
      _key: key,
    });
  }
}

// ── 4. Filtrar servicios públicos y deduplicar por teléfono (o nombre) ─────────
const seen = new Set();
const all = [];
let excluidos = 0;
for (const c of allRaw) {
  // Excluir servicios públicos / de emergencia (no son negocios a inscribir)
  if (c._key === 'servicios' && NON_BUSINESS_TAGS.has(c.tag)) {
    excluidos++;
    continue;
  }
  const key = c.telefono || c.nombre;
  if (seen.has(key)) continue;
  seen.add(key);
  delete c._key;
  all.push(c);
}

// ── 5. Reporte y guardado ──────────────────────────────────────────────────
const porCategoria = {};
for (const c of all) porCategoria[c.categoria] = (porCategoria[c.categoria] || 0) + 1;

console.log(`Total contactos extraídos: ${all.length}`);
for (const [cat, n] of Object.entries(porCategoria)) {
  console.log(`  - ${cat}: ${n}`);
}
console.log(`  (servicios públicos/emergencia excluidos: ${excluidos})`);
console.log(`  Con teléfono: ${all.filter(c => c.telefono).length}`);

fs.writeFileSync(
  path.join(__dirname, 'contactos.json'),
  JSON.stringify(all, null, 2),
  'utf8'
);
console.log('\n✅ Archivo contactos.json generado desde app.js (DIRECTORY)');
