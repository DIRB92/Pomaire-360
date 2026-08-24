#!/usr/bin/env node
/**
 * ═══════════════════════════════════════════════════════════════════════════
 * migrate-directory-to-supabase.js
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Script de migración para trasladar los datos hardcodeados del DIRECTORY
 * (app.js) a la base de datos Supabase.
 * 
 * MOTIVO DE SEGURIDAD:
 * Los datos de contacto (nombres, teléfonos, direcciones) de artesanos y
 * comerciantes estaban expuestos en texto plano en el JavaScript del frontend,
 * accesibles para cualquier scraper sin límite de tasa. Al migrarlos a
 * Supabase, se pueden servir con rate limiting y se cumple con el principio
 * de minimización de datos de la Ley 21.719.
 * 
 * USO:
 *   1. Configura las variables de entorno:
 *      export SUPABASE_URL="https://xxxxx.supabase.co"
 *      export SUPABASE_SERVICE_KEY="eyJhbG..."
 *   2. Ejecuta: node tools/migrate-directory-to-supabase.js
 * 
 * REQUISITOS:
 *   - Tabla "negocios" en Supabase con las columnas definidas en el schema
 *   - Variable SUPABASE_SERVICE_KEY (service role, NO anon key)
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Faltan variables de entorno SUPABASE_URL y SUPABASE_SERVICE_KEY');
  console.error('   export SUPABASE_URL="https://xxxxx.supabase.co"');
  console.error('   export SUPABASE_SERVICE_KEY="eyJhbG..."');
  process.exit(1);
}

// ─────────────────────────────────────────────────────────────────────────────
// Datos del DIRECTORY (extraídos de app.js para migración)
// NOTA: Estos datos contienen información personal de los comerciantes.
// Solo deben insertarse en la base de datos con consentimiento previo
// documentado de cada titular (ver /docs/consentimiento-artesanos.md).
// ─────────────────────────────────────────────────────────────────────────────

const CATEGORY_MAP = {
  restaurants: 'restaurantes',
  talleres: 'talleres',
  demos: 'alfareria',
  jardin: 'comercio',
  alojamientos: 'alojamiento',
  interes: 'turismo',
  servicios: 'servicios',
  artesanos: 'alfareria',
};

/**
 * Transforma un ítem del DIRECTORY legacy al formato de la tabla negocios.
 */
function transformItem(item, category) {
  const slug = slugify(item.n);
  return {
    nombre: item.n,
    slug,
    categoria: CATEGORY_MAP[category] || 'comercio',
    descripcion: item.d || item.desc || item.tag || null,
    direccion: item.a || null,
    telefono: item.p || null,
    whatsapp: item.p || null,
    instagram: item.ig || null,
    sitio_web: item.web || null,
    latitud: null,
    longitud: null,
    verificado: false,
    activo: true,
    plan: item.plan || 'gratis',
    // Metadatos de migración
    legacy_category: category,
    legacy_map_url: item.map || null,
    legacy_facebook: item.fb || null,
    migrated_at: new Date().toISOString(),
    consent_status: 'pending', // Requiere confirmación de consentimiento
  };
}

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function supabaseInsert(table, rows) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Prefer': 'return=minimal,resolution=merge-duplicates',
    },
    body: JSON.stringify(rows),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Supabase error (${res.status}): ${err}`);
  }

  return res;
}

async function main() {
  // Importar los datos del DIRECTORY desde el archivo exportado
  let DIRECTORY;
  try {
    DIRECTORY = require('./directory-data.json');
  } catch (e) {
    console.error('❌ No se encontró ./directory-data.json');
    console.error('   Primero ejecuta: node tools/export-directory-json.js');
    process.exit(1);
  }

  console.log('🏺 Migrando DIRECTORY a Supabase...\n');

  let total = 0;
  let errors = 0;

  for (const [category, items] of Object.entries(DIRECTORY)) {
    if (!Array.isArray(items)) continue;

    const rows = items.map((item) => transformItem(item, category));
    console.log(`  📁 ${category}: ${rows.length} registros`);

    try {
      await supabaseInsert('negocios', rows);
      total += rows.length;
    } catch (e) {
      console.error(`  ❌ Error en ${category}: ${e.message}`);
      errors += rows.length;
    }
  }

  console.log(`\n✅ Migración completada: ${total} insertados, ${errors} errores.`);
  console.log('\n⚠️  IMPORTANTE: Los registros tienen consent_status="pending".');
  console.log('   Debes confirmar el consentimiento de cada titular antes de');
  console.log('   publicar sus datos. Ver /docs/consentimiento-artesanos.md');
}

main().catch((e) => {
  console.error('💥 Error fatal:', e.message);
  process.exit(1);
});
