/**
 * Genera archivo CSV compatible con Excel (UTF-8 BOM) 
 * con todos los contactos de Pomaire 360
 */
const fs = require('fs');
const path = require('path');

const contacts = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'contactos.json'), 'utf8')
);

// Header CSV
const header = ['Nombre Negocio', 'Dirección', 'Teléfono', 'Instagram', 'Categoría', 'Horario/Tag', 'WhatsApp Link'];

// Generar filas
const rows = contacts.map(c => {
  const tel = c.telefono.replace('+', '');
  const waLink = tel ? `https://wa.me/${tel}` : '';
  return [
    c.nombre,
    c.direccion,
    c.telefono,
    c.instagram,
    c.categoria,
    c.tag,
    waLink
  ];
});

// Escapar campos CSV
function escapeCSV(field) {
  const str = String(field || '');
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

const csvContent = [header, ...rows]
  .map(row => row.map(escapeCSV).join(','))
  .join('\n');

// BOM para que Excel reconozca UTF-8
const BOM = '\uFEFF';
fs.writeFileSync(
  path.join(__dirname, 'contactos-pomaire360.csv'),
  BOM + csvContent,
  'utf8'
);

console.log(`✅ CSV generado: contactos-pomaire360.csv (${contacts.length} registros)`);
