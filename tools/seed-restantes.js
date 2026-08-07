#!/usr/bin/env node
/**
 * seed-restantes.js
 * ════════════════════════════════════════════════════════════════════
 * Registra los 78 negocios restantes de fichas fijas en Supabase.
 * También elimina el duplicado de "Farmacia Acua-Naser".
 *
 * SEGURIDAD:
 * - Modo DRY-RUN por defecto (no modifica nada sin --confirmar)
 * - Verifica duplicados antes de insertar
 * - Normaliza todas las keys para evitar PGRST102
 * - Usa service_role key (bypass RLS)
 *
 * USO:
 *   node tools/seed-restantes.js              # Vista previa
 *   node tools/seed-restantes.js --confirmar  # Insertar de verdad
 *
 * VARIABLES DE ENTORNO:
 *   SUPABASE_URL, SUPABASE_SERVICE_KEY, ADMIN_USER_ID
 * ════════════════════════════════════════════════════════════════════
 */

'use strict';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const ADMIN_USER_ID = process.env.ADMIN_USER_ID;
const DRY_RUN = !process.argv.includes('--confirmar');


// ─── Validación ──────────────────────────────────────────────────────────────

function validateEnv() {
  const missing = [];
  if (!SUPABASE_URL) missing.push('SUPABASE_URL');
  if (!SUPABASE_SERVICE_KEY) missing.push('SUPABASE_SERVICE_KEY');
  if (!ADMIN_USER_ID) missing.push('ADMIN_USER_ID');
  if (missing.length > 0) {
    console.error('\n  ❌ Faltan variables de entorno:');
    missing.forEach(v => console.error(`     • ${v}`));
    console.error('\n  En PowerShell:');
    console.error('    $env:SUPABASE_URL = "https://uuskvqtbsvtfsovcjazf.supabase.co"');
    console.error('    $env:SUPABASE_SERVICE_KEY = "tu-service-role-key"');
    console.error('    $env:ADMIN_USER_ID = "tu-uuid-admin"\n');
    process.exit(1);
  }
  const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRe.test(ADMIN_USER_ID)) {
    console.error(`\n  ❌ ADMIN_USER_ID no es UUID válido: "${ADMIN_USER_ID}"\n`);
    process.exit(1);
  }
}


// ─── Los 78 negocios restantes (del reporte de cruce) ────────────────────────

const NEGOCIOS_RESTANTES = [
  // ── RESTAURANTES (7) ──
  { nombre:'Emporio Doña Tránsito', categoria:'restaurantes', direccion:'San Antonio 321, Pomaire', telefono:'+56 9 54461130', descripcion:'Restaurante en Pomaire. Sábado y domingo.' },
  { nombre:'El Nico', categoria:'restaurantes', direccion:'Roberto Bravo 397, Pomaire', telefono:'+56 9 61629311', descripcion:'Restaurante en Pomaire. Sábado y domingo.' },
  { nombre:'Quinta Los Naranjos', categoria:'restaurantes', direccion:'San Antonio 279, Pomaire', telefono:'+56 9 59579197', descripcion:'Restaurante en Pomaire. Sábado y domingo.' },
  { nombre:'Flor y Tierra', categoria:'restaurantes', direccion:'Guillermo Barros 225, Pomaire', telefono:'+56 9 88291191', descripcion:'Restaurante en Pomaire. Sábado y domingo.' },
  { nombre:'La Coyita', categoria:'restaurantes', direccion:'San Antonio 615, Pomaire', telefono:'+56 9 49772557', descripcion:'Restaurante en Pomaire. Sábado y domingo.' },
  { nombre:'Los Secretos de Anita', categoria:'restaurantes', direccion:'San Antonio 213, Pomaire', telefono:'+56 9 74906024', descripcion:'Restaurante en Pomaire. Viernes a domingo.' },
  { nombre:'Las Tinajas de Pomaire', categoria:'restaurantes', direccion:'San Antonio 402, Pomaire', telefono:'+56 9 90177467', descripcion:'Restaurante en Pomaire. Sábado y domingo.' },


  // ── TALLERES / DEMOS (4) ──
  { nombre:'Juan Pablo Muñoz', categoria:'talleres', direccion:'Roberto Bravo 164, Pomaire', telefono:'+56 9 50821246', descripcion:'Artesano alfarero. Demostraciones en vivo.', instagram:'pablo.artesanodepomaire' },
  { nombre:'Pascual Gómez', categoria:'talleres', direccion:'Arturo Prat 352, Pomaire', telefono:'+56 9 89075630', descripcion:'Artesano alfarero. Demostraciones en vivo.' },
  { nombre:'Jorge Garrido', categoria:'talleres', direccion:'Bernardo O\'Higgins 260, Pomaire', telefono:'+56 9 84144279', descripcion:'Artesano alfarero. Demostraciones en vivo.' },
  { nombre:'El Pericote Artesanía', categoria:'talleres', direccion:'Guillermo Barros 150, Pomaire', telefono:'+56 9 40869289', descripcion:'Artesanía y demostraciones de alfarería.', instagram:'el.rinconcito.alfarero' },


  // ── COMERCIO (7) ──
  { nombre:'Jardín Monserrat', categoria:'comercio', direccion:'El Carmen 389, Pomaire', telefono:'+56 9 91510810', descripcion:'Vivero y jardín en Pomaire.' },
  { nombre:'La Chakana', categoria:'comercio', direccion:'Roberto Bravo 195, Pomaire', telefono:'+56 9 91162709', descripcion:'Tienda en Pomaire.' },
  { nombre:'Panadería y Heladería ALSA', categoria:'comercio', direccion:'Roberto Bravo 1606, Pomaire', telefono:'', descripcion:'Panadería y heladería en Pomaire.' },
  { nombre:'Cervecería / Chanchería Don Manuel', categoria:'comercio', direccion:'Pasaje Juana Álvarez 107, Pomaire', telefono:'+56 9 42271014', descripcion:'Cecinas y cerveza artesanal.' },
  { nombre:'Tejidos de Punto', categoria:'comercio', direccion:'San Antonio 180, local 4, Pomaire', telefono:'+56 9 96711139', descripcion:'Tejidos y artesanía textil.' },
  { nombre:'Vestuaristas Pomaire', categoria:'comercio', direccion:'Galería La Loica, Roberto Bravo 324, Pomaire', telefono:'', descripcion:'Vestuario y diseño.', instagram:'vestuaristas' },
  { nombre:'El Místico', categoria:'servicios', direccion:'Roberto Bravo 27, Pomaire', telefono:'', descripcion:'Masajes, reiki y bienestar.' },


  // ── SERVICIOS / BIENESTAR (1) ──
  { nombre:'La Yerberita', categoria:'servicios', direccion:'Roberto Bravo 1606, Pomaire', telefono:'', descripcion:'Farmacia natural y hierbas medicinales.' },

  // ── TURISMO (1) ──
  { nombre:'El Chancho Alcancía de Greda Más Grande del Mundo', categoria:'turismo', direccion:'Los Paltos 323, Pomaire', telefono:'+56 9 33566057', descripcion:'El chancho-alcancía de greda más grande del mundo: un atractivo imperdible de Pomaire. Figuras gigantes de greda, ideal para fotografías.' },

  // ── ALFARERÍA — Artesanías Miriam ──
  { nombre:'Artesanías Miriam', categoria:'alfareria', direccion:'San Antonio 180, local 3, Pomaire', telefono:'+56 9 94810090', descripcion:'Artesanía en mimbre.' },


  // ── ALFARERÍA — Artesanos (55) ──
  { nombre:'Camila y Diego', categoria:'alfareria', direccion:'Roberto Bravo 29, Pomaire', telefono:'+56 9 61277310', descripcion:'Artesanía en greda.' },
  { nombre:'Isolina Guzmán Araya', categoria:'alfareria', direccion:'Roberto Bravo 59, Pomaire', telefono:'+56 9 87667822', descripcion:'Artesanía en greda.' },
  { nombre:'Juana García', categoria:'alfareria', direccion:'Manuel Rodríguez 347, Pomaire', telefono:'+56 9 92174717', descripcion:'Artesanía en greda.' },
  { nombre:'Isabel R. & Eduardo G.', categoria:'alfareria', direccion:'Roberto Bravo esq. 18 de Septiembre, Pomaire', telefono:'+56 9 66055530', descripcion:'Artesanía en greda.' },
  { nombre:'Gredas Nene La Ruca', categoria:'alfareria', direccion:'Roberto Bravo 44B, Pomaire', telefono:'+56 9 88291191', descripcion:'Artesanía en greda.' },
  { nombre:'Cerámicas Valentina', categoria:'alfareria', direccion:'Roberto Bravo 88-A, Pomaire', telefono:'+56 9 73887858', descripcion:'Artesanía en greda.' },
  { nombre:'El Larita', categoria:'alfareria', direccion:'Roberto Bravo 465, Pomaire', telefono:'+56 9 97335365', descripcion:'Artesanía en greda.' },
  { nombre:'Eduardo Pardo Z.', categoria:'alfareria', direccion:'Roberto Bravo 272, Pomaire', telefono:'+56 9 99498024', descripcion:'Artesanía en greda.' },
  { nombre:'Roberto Bravo Artesanías', categoria:'alfareria', direccion:'Roberto Bravo 447, Pomaire', telefono:'+56 9 77750106', descripcion:'Artesanía en greda.' },
  { nombre:'Aracely', categoria:'alfareria', direccion:'General Baquedano esq. San Antonio, Pomaire', telefono:'+56 9 83342757', descripcion:'Artesanía en greda.' },

  { nombre:'Lámparas Irarrazaval Diseños', categoria:'alfareria', direccion:'Roberto Bravo 53 A, Pomaire', telefono:'+56 9 82851797', descripcion:'Lámparas y diseño en greda.' },
  { nombre:'Jesús Mi Alfarero', categoria:'alfareria', direccion:'Roberto Bravo 221, Pomaire', telefono:'+56 9 97568575', descripcion:'Artesanía en greda.' },
  { nombre:'Taller Edi Art', categoria:'alfareria', direccion:'General Baquedano 316, Pomaire', telefono:'+56 9 79340584', descripcion:'Taller de artesanía en greda.' },
  { nombre:'Miguel Salinas Baeza', categoria:'alfareria', direccion:'Roberto Bravo 13B, Pomaire', telefono:'+56 9 94560850', descripcion:'Artesanía en greda.' },
  { nombre:'La Raquelita', categoria:'alfareria', direccion:'Roberto Bravo 88, Pomaire', telefono:'+56 9 95169386', descripcion:'Artesanía en greda.' },
  { nombre:'Cerámica y Decoración Inelia', categoria:'alfareria', direccion:'Arturo Prat 338, Pomaire', telefono:'+56 9 75182329', descripcion:'Cerámica decorativa.' },
  { nombre:'San Marcos', categoria:'alfareria', direccion:'Roberto Bravo 267, Pomaire', telefono:'+56 9 53160316', descripcion:'Artesanía en greda.' },
  { nombre:'Segundo Enrique Trujillo S.', categoria:'alfareria', direccion:'San Antonio 10, Pomaire', telefono:'+56 9 85669982', descripcion:'Artesanía en greda.' },
  { nombre:'Rosa y Marcela', categoria:'alfareria', direccion:'Roberto Bravo 414, Pomaire', telefono:'+56 9 85039992', descripcion:'Artesanía en greda.' },
  { nombre:'Gredas Ximena', categoria:'alfareria', direccion:'San Antonio esq. Arturo Prat, Pomaire', telefono:'+56 9 96687585', descripcion:'Artesanía en greda.' },

  { nombre:'Cerámica Badi', categoria:'alfareria', direccion:'Roberto Bravo 49, Pomaire', telefono:'+56 9 87584538', descripcion:'Artesanía en greda.' },
  { nombre:'Cerámicas Fonola', categoria:'alfareria', direccion:'Roberto Bravo 185, Pomaire', telefono:'+56 9 92467532', descripcion:'Artesanía en greda.' },
  { nombre:'La Palmera', categoria:'alfareria', direccion:'Roberto Bravo 502, Pomaire', telefono:'+56 9 87854529', descripcion:'Artesanía en greda.' },
  { nombre:'Alfarería Edison', categoria:'alfareria', direccion:'General Baquedano 312, Pomaire', telefono:'+56 9 79340584', descripcion:'Artesanía en greda.' },
  { nombre:'Gredas Flores', categoria:'alfareria', direccion:'San Antonio 335, Pomaire', telefono:'+56 9 51123005', descripcion:'Artesanía en greda.' },
  { nombre:'Cerámicas El Cheo', categoria:'alfareria', direccion:'Roberto Bravo 56 A, Pomaire', telefono:'+56 9 91661194', descripcion:'Artesanía en greda.' },
  { nombre:'Cerámicas Tania', categoria:'alfareria', direccion:'Roberto Bravo 454, Pomaire', telefono:'+56 9 62577048', descripcion:'Artesanía en greda.' },
  { nombre:'Enrique Garrido', categoria:'alfareria', direccion:'Manuel Rodríguez 345, Pomaire', telefono:'+56 9 73165446', descripcion:'Artesanía en greda.' },
  { nombre:'Artesanías Bernarda Hernández', categoria:'alfareria', direccion:'Roberto Bravo 248, Galería Serruchos, Pomaire', telefono:'+56 9 90225433', descripcion:'Artesanía en greda.' },
  { nombre:'Robertito', categoria:'alfareria', direccion:'Roberto Bravo esq. 18 de Septiembre, Pomaire', telefono:'+56 9 46497460', descripcion:'Artesanía en greda.' },

  { nombre:'Fresia Castillo Romero', categoria:'alfareria', direccion:'Roberto Bravo 13A, Pomaire', telefono:'+56 9 94511658', descripcion:'Artesanía en greda.' },
  { nombre:'Rosa Mora', categoria:'alfareria', direccion:'Roberto Bravo 457, Pomaire', telefono:'+56 9 95580575', descripcion:'Artesanía en greda.' },
  { nombre:'Octavio Fernando Silva R.', categoria:'alfareria', direccion:'Manuel Rodríguez con San Antonio, Pomaire', telefono:'+56 9 31471192', descripcion:'Artesanía en greda.' },
  { nombre:'Mami Inés', categoria:'alfareria', direccion:'Roberto Bravo 252, Galería Catalán Local 1, Pomaire', telefono:'+56 9 83290566', descripcion:'Artesanía en greda.' },
  { nombre:'Artesanía Tradicional Loza de Greda', categoria:'alfareria', direccion:'Roberto Bravo con Morandé, Pomaire', telefono:'+56 9 98781143', descripcion:'Artesanía tradicional en loza de greda.' },
  { nombre:'Gredas La Mamy', categoria:'alfareria', direccion:'Roberto Bravo 44C, Pomaire', telefono:'+56 9 97225185', descripcion:'Artesanía en greda.' },
  { nombre:'Cerámicas Miguel Ángel', categoria:'alfareria', direccion:'Roberto Bravo 97, Pomaire', telefono:'', descripcion:'Artesanía en greda.' },
  { nombre:'María Elisa Salinas Aguilera', categoria:'alfareria', direccion:'Roberto Bravo 469, Pomaire', telefono:'+56 9 92320964', descripcion:'Artesanía en greda.' },
  { nombre:'Donde Miguel', categoria:'alfareria', direccion:'Arturo Prat 380, Pomaire', telefono:'+56 9 92682046', descripcion:'Artesanía en greda.' },
  { nombre:'La Poza', categoria:'alfareria', direccion:'Roberto Bravo 311, Pomaire', telefono:'+56 9 93617561', descripcion:'Artesanía en greda.' },

  { nombre:'Artesanía Utilitaria El Cone', categoria:'alfareria', direccion:'San Antonio 215, Pomaire', telefono:'+56 9 84730313', descripcion:'Artesanía utilitaria en greda.' },
  { nombre:'Mi Chanchita', categoria:'alfareria', direccion:'Roberto Bravo 453, Pomaire', telefono:'+56 9 96721752', descripcion:'Artesanía en greda.' },
  { nombre:'Cerámicas Rosa Ester', categoria:'alfareria', direccion:'Manuel Rodríguez 15, Pomaire', telefono:'+56 9 77751558', descripcion:'Artesanía en greda.' },
  { nombre:'Don Francisco', categoria:'alfareria', direccion:'Roberto Bravo 56 B, Pomaire', telefono:'+56 9 68089602', descripcion:'Artesanía en greda.' },
  { nombre:'Taller Tierra Arte', categoria:'alfareria', direccion:'Roberto Bravo 221, Pomaire', telefono:'+56 9 77877784', descripcion:'Taller de artesanía en greda.' },
  { nombre:'María', categoria:'alfareria', direccion:'El Carmen 275, Pomaire', telefono:'+56 9 89909036', descripcion:'Artesanía en greda.' },
  { nombre:'Oscar Alejandro Durán', categoria:'alfareria', direccion:'El Carmen 690, Pomaire', telefono:'+56 9 83527207', descripcion:'Artesanía en greda.' },
  { nombre:'Marisol Quiróz Abarca', categoria:'alfareria', direccion:'Lautaro 752, Pomaire', telefono:'+56 9 99745542', descripcion:'Artesanía en greda.' },
  { nombre:'Fábrica Roca', categoria:'alfareria', direccion:'Roberto Bravo 114, Pomaire', telefono:'+56 9 99745542', descripcion:'Fábrica de artesanía en greda.' },
  { nombre:'Cerámicas Dami', categoria:'alfareria', direccion:'El Carmen 479, Pomaire', telefono:'+56 9 68007192', descripcion:'Artesanía en greda.' },

  { nombre:'Cerámica Carolina', categoria:'alfareria', direccion:'El Limonal 722, Pomaire', telefono:'+56 9 71031885', descripcion:'Artesanía en greda.' },
  { nombre:'Amelia Rojas Quiróz', categoria:'alfareria', direccion:'Bernardo O\'Higgins 315, Pomaire', telefono:'+56 9 78316925', descripcion:'Artesanía en greda.' },
  { nombre:'Rosa Rojas', categoria:'alfareria', direccion:'General Baquedano 448, Pomaire', telefono:'+56 9 77877784', descripcion:'Artesanía en greda.' },
  { nombre:'Cerámicas Anaís', categoria:'alfareria', direccion:'El Carmen 329, Pomaire', telefono:'+56 9 67749664', descripcion:'Artesanía en greda.' },
  { nombre:'Elías Veliz', categoria:'alfareria', direccion:'Rafael Morandé 480 B, Pomaire', telefono:'+56 9 90325852', descripcion:'Artesanía en greda.' },
];


// ─── Funciones auxiliares ────────────────────────────────────────────────────

function normalize(str) {
  if (!str) return '';
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

// Todas las keys que PostgREST necesita ver iguales en cada objeto
const ALL_KEYS = [
  'owner_id', 'nombre', 'categoria', 'descripcion', 'direccion',
  'telefono', 'whatsapp', 'instagram', 'sitio_web', 'verificado',
  'activo', 'plan',
];

function normalizeKeys(obj) {
  const out = {};
  for (const key of ALL_KEYS) {
    out[key] = obj[key] !== undefined ? obj[key] : null;
  }
  return out;
}

async function apiFetch(endpoint, options = {}) {
  const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
  const resp = await fetch(url, {
    ...options,
    headers: {
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(options.headers || {}),
    },
  });
  if (!resp.ok) {
    const body = await resp.text();
    throw new Error(`API error (${resp.status}): ${body}`);
  }
  const text = await resp.text();
  return text ? JSON.parse(text) : null;
}


// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  SEED: Negocios Restantes + Limpieza Duplicado');
  if (DRY_RUN) {
    console.log('  ⚠️  MODO DRY-RUN (vista previa — no modifica nada)');
    console.log('  Para ejecutar: node tools/seed-restantes.js --confirmar');
  } else {
    console.log('  🔴 MODO REAL — SE MODIFICARÁ SUPABASE');
  }
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  validateEnv();

  // 1. Verificar admin
  console.log('  🔍 Verificando admin...');
  const admins = await apiFetch(`perfiles?id=eq.${ADMIN_USER_ID}&select=id,nombre,rol`);
  if (!admins || admins.length === 0) {
    console.error(`  ❌ Admin no encontrado: ${ADMIN_USER_ID}`);
    process.exit(1);
  }
  console.log(`  ✓ Admin: "${admins[0].nombre}" (${admins[0].rol})`);
  console.log('');

  // 2. Cargar existentes
  console.log('  🔍 Cargando negocios existentes...');
  const existentes = await apiFetch('negocios?select=id,nombre,categoria&activo=eq.true');
  const nombresExistentes = new Set(existentes.map(n => normalize(n.nombre)));
  console.log(`  ✓ ${existentes.length} negocios actuales`);
  console.log('');

  // 3. Filtrar duplicados
  const nuevos = [];
  const duplicados = [];
  for (const neg of NEGOCIOS_RESTANTES) {
    if (nombresExistentes.has(normalize(neg.nombre))) {
      duplicados.push(neg);
    } else {
      nuevos.push(normalizeKeys({
        ...neg,
        owner_id: ADMIN_USER_ID,
        activo: true,
        plan: 'gratis',
        verificado: false,
      }));
    }
  }


  // 4. Buscar duplicado de Farmacia
  console.log('  🔍 Buscando duplicado "Farmacia Acua-Naser" (sin Pomaire)...');
  const farmacias = await apiFetch(
    'negocios?select=id,nombre&nombre=eq.Farmacia Acua-Naser'
  );
  const farmaciaDuplicada = farmacias && farmacias.length > 0 ? farmacias[0] : null;
  if (farmaciaDuplicada) {
    console.log(`  ✓ Duplicado encontrado: "${farmaciaDuplicada.nombre}" (${farmaciaDuplicada.id})`);
  } else {
    console.log('  ℹ️  No se encontró duplicado de Farmacia (ya limpio)');
  }
  console.log('');

  // 5. Resumen
  console.log('  📋 RESUMEN:');
  console.log(`     • Negocios definidos:    ${NEGOCIOS_RESTANTES.length}`);
  console.log(`     • Ya existen (omitir):   ${duplicados.length}`);
  console.log(`     • Nuevos a insertar:     ${nuevos.length}`);
  console.log(`     • Duplicado a eliminar:  ${farmaciaDuplicada ? 1 : 0}`);
  console.log('');

  if (duplicados.length > 0) {
    console.log('  ⏭️  Omitidos (ya existen):');
    duplicados.forEach(d => console.log(`     • "${d.nombre}"`));
    console.log('');
  }

  if (nuevos.length > 0) {
    console.log(`  🆕 Se insertarán ${nuevos.length} negocios:`);
    const cats = {};
    nuevos.forEach(n => { cats[n.categoria] = (cats[n.categoria] || 0) + 1; });
    Object.entries(cats).sort((a,b) => b[1]-a[1]).forEach(([cat, count]) => {
      console.log(`     • ${cat}: ${count}`);
    });
    console.log('');
  }

  if (DRY_RUN) {
    console.log('───────────────────────────────────────────────────────────────');
    console.log('  ℹ️  DRY-RUN. No se modificó nada.');
    console.log('  Para ejecutar: node tools/seed-restantes.js --confirmar');
    console.log('───────────────────────────────────────────────────────────────\n');
    return;
  }


  // 6. MODO REAL: Eliminar duplicado
  if (farmaciaDuplicada) {
    console.log('  🗑️  Eliminando duplicado de Farmacia...');
    await apiFetch(`negocios?id=eq.${farmaciaDuplicada.id}`, { method: 'DELETE' });
    console.log(`  ✓ Eliminado: "${farmaciaDuplicada.nombre}"`);
    console.log('');
  }

  // 7. MODO REAL: Insertar en lotes de 20 (evitar timeout)
  if (nuevos.length > 0) {
    console.log(`  🚀 Insertando ${nuevos.length} negocios en lotes...`);
    const BATCH_SIZE = 20;
    let totalInsertados = 0;

    for (let i = 0; i < nuevos.length; i += BATCH_SIZE) {
      const batch = nuevos.slice(i, i + BATCH_SIZE);
      const loteNum = Math.floor(i / BATCH_SIZE) + 1;
      const totalLotes = Math.ceil(nuevos.length / BATCH_SIZE);

      try {
        const insertados = await apiFetch('negocios', {
          method: 'POST',
          headers: { 'Prefer': 'return=representation' },
          body: JSON.stringify(batch),
        });
        totalInsertados += insertados.length;
        console.log(`     ✓ Lote ${loteNum}/${totalLotes}: ${insertados.length} insertados`);
      } catch (err) {
        console.error(`     ❌ Lote ${loteNum} falló: ${err.message}`);
        console.error('     Continuando con el siguiente lote...');
      }
    }

    console.log('');
    console.log(`  ✅ ¡ÉXITO! ${totalInsertados} negocios insertados.`);
    console.log(`  Tu directorio ahora tiene ~${existentes.length + totalInsertados} negocios activos.`);
    console.log('  Ya son visibles en app.pomaire360.cl y pomaire360.cl');
  }

  console.log('');
}

main();
