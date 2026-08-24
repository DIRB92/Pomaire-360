#!/usr/bin/env node
/**
 * export-directory-json.js
 * 
 * Extrae el objeto DIRECTORY de app.js y lo guarda como JSON puro
 * para ser usado por el script de migración a Supabase.
 * 
 * USO: node tools/export-directory-json.js
 * SALIDA: tools/directory-data.json
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const APP_JS = path.join(__dirname, '..', 'app.js');
const OUTPUT = path.join(__dirname, 'directory-data.json');

// Leer el archivo app.js
const source = fs.readFileSync(APP_JS, 'utf-8');

// Extraer el bloque DIRECTORY usando regex
const match = source.match(/const DIRECTORY\s*=\s*(\{[\s\S]*?\n\};)/);
if (!match) {
  console.error('❌ No se encontró el objeto DIRECTORY en app.js');
  process.exit(1);
}

// Evaluar el objeto en un sandbox seguro
const sandbox = {};
const script = new vm.Script('const DIRECTORY = ' + match[1] + '\n__result = DIRECTORY;');
const context = vm.createContext(sandbox);
script.runInContext(context);

const data = sandbox.__result;

// Contar registros
let total = 0;
for (const [key, arr] of Object.entries(data)) {
  if (Array.isArray(arr)) {
    total += arr.length;
    console.log(`  ${key}: ${arr.length} registros`);
  }
}

// Guardar
fs.writeFileSync(OUTPUT, JSON.stringify(data, null, 2), 'utf-8');
console.log(`\n✅ Exportado ${total} registros a ${OUTPUT}`);
console.log('   Siguiente paso: node tools/migrate-directory-to-supabase.js');
