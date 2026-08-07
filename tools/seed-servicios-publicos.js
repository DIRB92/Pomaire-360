#!/usr/bin/env node
/**
 * seed-servicios-publicos.js
 * ════════════════════════════════════════════════════════════════════
 * Registra los servicios públicos de Pomaire en Supabase.
 *
 * Estos son negocios de tipo "utilidad" (seguridad, salud, turismo, etc.)
 * que no tienen un comerciante dueño — se asignan al admin del sistema.
 *
 * SEGURIDAD:
 * - Usa service_role key (necesaria para bypass RLS al insertar)
 * - Tiene modo DRY-RUN por defecto (no inserta nada sin confirmación)
 * - Verifica duplicados antes de insertar (por nombre normalizado)
 * - Genera slugs automáticamente via trigger de Supabase
 *
 * USO:
 *   # Vista previa (no inserta nada):
 *   node tools/seed-servicios-publicos.js
 *
 *   # Insertar de verdad:
 *   node tools/seed-servicios-publicos.js --confirmar
 *
 * VARIABLES DE ENTORNO REQUERIDAS:
 *   SUPABASE_URL         — URL del proyecto (ej: https://xxx.supabase.co)
 *   SUPABASE_SERVICE_KEY — Service role key (Dashboard → Settings → API)
 *   ADMIN_USER_ID        — UUID del usuario admin en perfiles
 *
 * CÓMO OBTENER EL ADMIN_USER_ID:
 *   1. Ve a Supabase Dashboard → Authentication → Users
 *   2. Busca tu usuario admin (ej: tu email)
 *   3. Copia el UUID (columna "User UID")
 * ════════════════════════════════════════════════════════════════════
 */

'use strict';

// ─── Configuración ───────────────────────────────────────────────────────────

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const ADMIN_USER_ID = process.env.ADMIN_USER_ID;

const DRY_RUN = !process.argv.includes('--confirmar');

// ─── Validación de entorno ───────────────────────────────────────────────────

function validateEnv() {
  const missing = [];
  if (!SUPABASE_URL) missing.push('SUPABASE_URL');
  if (!SUPABASE_SERVICE_KEY) missing.push('SUPABASE_SERVICE_KEY');
  if (!ADMIN_USER_ID) missing.push('ADMIN_USER_ID');

  if (missing.length > 0) {
    console.error('');
    console.error('  ❌ Faltan variables de entorno:');
    missing.forEach(v => console.error(`     • ${v}`));
    console.error('');
    console.error('  Configúralas antes de ejecutar:');
    console.error('');
    console.error('  En PowerShell (Windows):');
    console.error('    $env:SUPABASE_URL = "https://uuskvqtbsvtfsovcjazf.supabase.co"');
    console.error('    $env:SUPABASE_SERVICE_KEY = "tu-service-role-key"');
    console.error('    $env:ADMIN_USER_ID = "tu-uuid-admin"');
    console.error('');
    console.error('  En Mac/Linux:');
    console.error('    export SUPABASE_URL="https://uuskvqtbsvtfsovcjazf.supabase.co"');
    console.error('    export SUPABASE_SERVICE_KEY="tu-service-role-key"');
    console.error('    export ADMIN_USER_ID="tu-uuid-admin"');
    console.error('');
    console.error('  ¿Dónde encontrar cada valor?');
    console.error('    SUPABASE_URL         → Ya la conoces: https://uuskvqtbsvtfsovcjazf.supabase.co');
    console.error('    SUPABASE_SERVICE_KEY  → Supabase Dashboard → Settings → API → service_role (secret)');
    console.error('    ADMIN_USER_ID        → Supabase Dashboard → Authentication → Users → tu usuario → User UID');
    console.error('');
    process.exit(1);
  }

  // Validar formato UUID del admin
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(ADMIN_USER_ID)) {
    console.error('');
    console.error('  ❌ ADMIN_USER_ID no tiene formato UUID válido.');
    console.error(`     Valor actual: "${ADMIN_USER_ID}"`);
    console.error('     Formato esperado: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
    console.error('');
    process.exit(1);
  }
}

// ─── Datos: Servicios públicos a registrar ───────────────────────────────────
// Estos son los que el reporte de cruce marcó como "SIN REGISTRAR"
// y corresponden a categorías de tipo "utilidad" o "interes"

const SERVICIOS_PUBLICOS = [
  // ── SEGURIDAD ──
  {
    nombre: 'Carabineros de Pomaire',
    categoria: 'seguridad',
    descripcion: 'Tenencia de Carabineros de Chile en Pomaire. Emergencias: llamar al 133.',
    direccion: 'San Antonio 361, Pomaire',
    telefono: '133',
    verificado: true,
  },
  {
    nombre: 'Bomberos de Pomaire',
    categoria: 'seguridad',
    descripcion: 'Cuerpo de Bomberos de Pomaire. Para emergencias de incendio y rescate.',
    direccion: 'San Antonio 362, Pomaire',
    telefono: '+56 2 29224430',
    verificado: true,
  },

  // ── SALUD ──
  {
    nombre: 'Farmacia Acua-Naser Pomaire',
    categoria: 'salud',
    descripcion: 'Farmacia ubicada en el centro de Pomaire.',
    direccion: 'San Antonio 362, Pomaire',
    telefono: '+56 2 29224430',
    verificado: true,
  },

  // ── SERVICIOS ──
  {
    nombre: 'Cajero Automático (ATM)',
    categoria: 'servicios',
    descripcion: 'Cajero automático disponible en Pomaire para retiro de efectivo.',
    direccion: 'Roberto Bravo 445, Pomaire',
    telefono: '',
    verificado: true,
  },
  {
    nombre: 'Colegio de Pomaire',
    categoria: 'servicios',
    descripcion: 'Colegio y Jardín Infantil. Enseñanza básica para la comunidad de Pomaire.',
    direccion: 'Pomaire',
    telefono: '',
    instagram: 'colegiopomaire_',
    verificado: true,
  },

  // ── TURISMO / PUNTOS DE INTERÉS ──
  {
    nombre: 'Oficina de Información Turística (OIT)',
    categoria: 'turismo',
    descripcion: 'Punto de información turística oficial en la Plaza de Pomaire. Consulta mapas, rutas y recomendaciones.',
    direccion: 'Plaza de Pomaire',
    telefono: '+56 9 41814611',
    verificado: true,
  },
  {
    nombre: 'Plaza de Pomaire',
    categoria: 'turismo',
    descripcion: 'Plaza central y punto de encuentro del pueblo. Punto de partida ideal para recorrer Pomaire.',
    direccion: 'San Antonio 140, Pomaire',
    telefono: '',
    verificado: true,
  },
  {
    nombre: 'Iglesia de Pomaire',
    categoria: 'turismo',
    descripcion: 'Templo histórico de Pomaire, ubicado en calle El Carmen.',
    direccion: 'El Carmen 420, Pomaire',
    telefono: '',
    verificado: true,
  },
  {
    nombre: 'El Cristo de Pomaire',
    categoria: 'turismo',
    descripcion: 'Mirador con vista panorámica del pueblo. Un clásico para fotografías y contemplación.',
    direccion: 'Roberto Bravo 1, Pomaire',
    telefono: '',
    verificado: true,
  },
  {
    nombre: 'Paseo Jardín de los Almendros',
    categoria: 'turismo',
    descripcion: 'Paseo arbolado ideal para caminatas tranquilas por los alrededores de Pomaire.',
    direccion: 'Pomaire',
    telefono: '',
    verificado: true,
  },

  // ── ESTACIONAMIENTOS ──
  {
    nombre: 'Estacionamiento y Baños Públicos',
    categoria: 'estacionamientos',
    descripcion: 'Futuro proyecto de estacionamiento público y baños para visitantes.',
    direccion: 'Guillermo Barros con Diego de Almagro, Pomaire',
    telefono: '',
    verificado: false, // aún es proyecto futuro
  },
];

// ─── Funciones auxiliares ────────────────────────────────────────────────────

function normalize(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function fetchExistingNegocios() {
  const url = `${SUPABASE_URL}/rest/v1/negocios?select=id,nombre,categoria&activo=eq.true`;
  const resp = await fetch(url, {
    method: 'GET',
    headers: {
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Accept': 'application/json',
    },
  });

  if (!resp.ok) {
    const body = await resp.text();
    throw new Error(`Error al leer negocios (${resp.status}): ${body}`);
  }
  return resp.json();
}

async function verifyAdminExists() {
  const url = `${SUPABASE_URL}/rest/v1/perfiles?id=eq.${ADMIN_USER_ID}&select=id,nombre,rol`;
  const resp = await fetch(url, {
    method: 'GET',
    headers: {
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Accept': 'application/json',
    },
  });

  if (!resp.ok) {
    throw new Error(`Error al verificar admin (${resp.status})`);
  }

  const data = await resp.json();
  if (data.length === 0) {
    console.error('');
    console.error(`  ❌ No se encontró el usuario con ID: ${ADMIN_USER_ID}`);
    console.error('     Verifica que el UUID sea correcto en Supabase → Authentication → Users');
    console.error('');
    process.exit(1);
  }

  return data[0];
}

async function insertNegocios(negocios) {
  const url = `${SUPABASE_URL}/rest/v1/negocios`;
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
    },
    body: JSON.stringify(negocios),
  });

  if (!resp.ok) {
    const body = await resp.text();
    throw new Error(`Error al insertar (${resp.status}): ${body}`);
  }

  return resp.json();
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  SEED: Servicios Públicos de Pomaire → Supabase');
  if (DRY_RUN) {
    console.log('  ⚠️  MODO DRY-RUN (vista previa — no inserta nada)');
    console.log('  Para insertar de verdad: node tools/seed-servicios-publicos.js --confirmar');
  } else {
    console.log('  🔴 MODO REAL — SE INSERTARÁN DATOS EN SUPABASE');
  }
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  // 0. Validar variables de entorno (sale con mensaje claro si faltan)
  validateEnv();

  // 1. Verificar que el admin existe
  console.log('  🔍 Verificando usuario admin...');
  const admin = await verifyAdminExists();
  console.log(`  ✓ Admin encontrado: "${admin.nombre}" (rol: ${admin.rol})`);
  console.log('');

  // 2. Obtener negocios existentes (para evitar duplicados)
  console.log('  🔍 Cargando negocios existentes...');
  const existentes = await fetchExistingNegocios();
  const nombresExistentes = new Set(existentes.map(n => normalize(n.nombre)));
  console.log(`  ✓ ${existentes.length} negocios ya existen en Supabase`);
  console.log('');

  // 3. Filtrar duplicados
  const nuevos = [];
  const duplicados = [];

  for (const servicio of SERVICIOS_PUBLICOS) {
    const nombreNorm = normalize(servicio.nombre);
    if (nombresExistentes.has(nombreNorm)) {
      duplicados.push(servicio);
    } else {
      nuevos.push({
        ...servicio,
        owner_id: ADMIN_USER_ID,
        activo: true,
        plan: 'gratis',
      });
    }
  }

  // 4. Mostrar resumen
  console.log('  📋 RESUMEN:');
  console.log(`     • Total servicios públicos definidos:  ${SERVICIOS_PUBLICOS.length}`);
  console.log(`     • Ya existen (se omiten):             ${duplicados.length}`);
  console.log(`     • Nuevos a insertar:                  ${nuevos.length}`);
  console.log('');

  if (duplicados.length > 0) {
    console.log('  ⏭️  Se omiten (ya existen):');
    for (const d of duplicados) {
      console.log(`     • "${d.nombre}" [${d.categoria}]`);
    }
    console.log('');
  }

  if (nuevos.length === 0) {
    console.log('  ✅ Todos los servicios públicos ya están registrados. ¡Nada que hacer!');
    console.log('');
    return;
  }

  console.log('  🆕 Se insertarán:');
  for (const n of nuevos) {
    const tel = n.telefono || '(sin tel)';
    console.log(`     • [${n.categoria}] "${n.nombre}" — ${n.direccion} — ${tel}`);
  }
  console.log('');

  // 5. Insertar o solo mostrar
  if (DRY_RUN) {
    console.log('───────────────────────────────────────────────────────────────');
    console.log('  ℹ️  DRY-RUN completado. No se insertó nada.');
    console.log('');
    console.log('  Para insertar de verdad, ejecuta:');
    console.log('    node tools/seed-servicios-publicos.js --confirmar');
    console.log('───────────────────────────────────────────────────────────────');
    console.log('');
    return;
  }

  // MODO REAL: Insertar
  console.log('  🚀 Insertando en Supabase...');
  try {
    const insertados = await insertNegocios(nuevos);
    console.log('');
    console.log('  ✅ ¡ÉXITO! Servicios públicos registrados:');
    console.log('');
    for (const neg of insertados) {
      console.log(`     ✓ [${neg.categoria}] "${neg.nombre}" → slug: "${neg.slug}"`);
    }
    console.log('');
    console.log(`  Total insertados: ${insertados.length}`);
    console.log('  Los negocios ya son visibles en app.pomaire360.cl y pomaire360.cl');
    console.log('');
  } catch (err) {
    console.error('');
    console.error('  ❌ Error al insertar:', err.message);
    console.error('');
    console.error('  Posibles causas:');
    console.error('    • La service_role key es incorrecta');
    console.error('    • El ADMIN_USER_ID no existe en la tabla perfiles');
    console.error('    • Algún nombre genera un slug duplicado');
    console.error('');
    process.exit(1);
  }
}

main();
