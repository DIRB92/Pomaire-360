#!/usr/bin/env node
/**
 * sync-coordenadas.js
 * ════════════════════════════════════════════════════════════════════
 * Extrae lat/lng de los arrays PLACES hardcodeados (app.js + mapa-turistico.js)
 * y los sube a los negocios correspondientes en Supabase.
 *
 * Matching: por nombre normalizado.
 *
 * SEGURIDAD:
 * - DRY-RUN por defecto
 * - Solo actualiza latitud/longitud (no toca otros campos)
 * - Usa service_role key
 *
 * USO:
 *   node tools/sync-coordenadas.js              # vista previa
 *   node tools/sync-coordenadas.js --confirmar  # actualizar de verdad
 *
 * VARIABLES: SUPABASE_URL, SUPABASE_SERVICE_KEY
 * ════════════════════════════════════════════════════════════════════
 */

'use strict';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://uuskvqtbsvtfsovcjazf.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;
const DRY_RUN = !process.argv.includes('--confirmar');

if (!SUPABASE_KEY) {
  console.error('\n  ❌ Falta SUPABASE_SERVICE_KEY');
  console.error('  En PowerShell:');
  console.error('    $env:SUPABASE_SERVICE_KEY = "tu-service-role-key"\n');
  process.exit(1);
}

function normalize(str) {
  if (!str) return '';
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}


// ─── Coordenadas extraídas de PLACES en app.js + mapa-turistico.js ───────────
// Solo incluimos negocios/lugares que tienen equivalente en Supabase.
// Formato: { nombre (para matching), lat, lng }

const COORDENADAS = [
  // PARKING
  { nombre: 'Estacionamiento y Baños Públicos', lat: -33.65027186391058, lng: -71.15430268749077 },

  // HEALTH
  { nombre: 'CESFAM Pomaire', lat: -33.6497, lng: -71.15053 },
  { nombre: 'Farmacia Acua-Naser Pomaire', lat: -33.653491296625084, lng: -71.15118860753486 },

  // SECURITY
  { nombre: 'Carabineros de Pomaire', lat: -33.650798492760984, lng: -71.1512808846173 },
  { nombre: 'Bomberos de Pomaire', lat: -33.64977969139366, lng: -71.15086677981947 },

  // SERVICES
  { nombre: 'Oficina de Información Turística (OIT)', lat: -33.65033, lng: -71.15093 },
  { nombre: 'Plaza de Pomaire', lat: -33.65033, lng: -71.15093 },
  { nombre: 'Iglesia de Pomaire', lat: -33.646214708973325, lng: -71.15097954893574 },
  { nombre: 'Cajero Automático (ATM)', lat: -33.65029994302147, lng: -71.1496768882763 },
  { nombre: 'Colegio de Pomaire', lat: -33.6500313951976, lng: -71.15053295001364 },
  { nombre: 'El Cristo de Pomaire', lat: -33.6563274403623, lng: -71.15040862537278 },

  // POTTERY / TALLERES
  { nombre: 'Granja Educativa Alfarera', lat: -33.65119135971276, lng: -71.15284938597316 },
  { nombre: 'Espacio Greda', lat: -33.65176286310916, lng: -71.15033526947308 },
  { nombre: 'Taller del Sol', lat: -33.652051018925114, lng: -71.14908723334928 },
  { nombre: 'Taller Barros', lat: -33.65435030691243, lng: -71.15447074355414 },
  { nombre: 'El Chancho Alcancía de Greda Más Grande del Mundo', lat: -33.652552962128134, lng: -71.1534523252861 },
  { nombre: 'Los Ceramistas', lat: -33.6475116, lng: -71.1503954 },

  // FOOD
  { nombre: 'Imperio Pomaire', lat: -33.65460729825698, lng: -71.15001597751701 },
  { nombre: 'Restaurant La Greda', lat: -33.65317799731006, lng: -71.14994054878586 },
  { nombre: 'Restaurante Los Naranjos', lat: -33.655708576989326, lng: -71.15010831317134 },
  { nombre: 'La Casa del Costillar', lat: -33.6515220531864, lng: -71.14978770847507 },
  { nombre: 'El Boliche de Pomaire', lat: -33.65600068412172, lng: -71.15083197607485 },
  { nombre: 'La Normita (Tenedor libre)', lat: -33.65314424375147, lng: -71.15047939144097 },
  { nombre: 'Restaurant El Parrón de Pomaire', lat: -33.65178030571566, lng: -71.14900454933903 },
  { nombre: 'La Pica de la Mireya', lat: -33.654255535020724, lng: -71.1496627003142 },
  { nombre: 'La Cañada', lat: -33.65165080014213, lng: -71.14996004940937 },
  { nombre: 'Restaurante San Pedro', lat: -33.65435582442494, lng: -71.150266197532 },
  { nombre: 'Restaurant El Cototudo', lat: -33.65435582442494, lng: -71.150266197532 },

  // LODGING
  { nombre: 'Hostal Pomaire', lat: -33.65198924949971, lng: -71.15296875422749 },
  { nombre: 'La Quinta de la Plaza', lat: -33.64978985059087, lng: -71.15138707552667 },
  { nombre: 'Cabañas Glamen', lat: -33.64827253156989, lng: -71.15605889381351 },
  { nombre: 'Pomaire Lodge & Suites', lat: -33.65136884009364, lng: -71.15274217075873 },

  // HIGHLIGHT / COMERCIO
  { nombre: 'Cervecería Pomaire', lat: -33.65165740947676, lng: -71.14995842541745 },
  { nombre: 'Tienda Calafate Austral', lat: -33.65478707835062, lng: -71.15025443200825 },
  { nombre: 'Charcutería Don Mati', lat: -33.65192, lng: -71.1499 },
  { nombre: 'Panadería y Heladería ALSA', lat: -33.651768302417416, lng: -71.14981400869864 },
  { nombre: 'Vivero Luchín', lat: -33.653664329289256, lng: -71.15135912053388 },

  // PASEO
  { nombre: 'Paseo Jardín de los Almendros', lat: -33.652, lng: -71.153 },
];


// ─── Main ────────────────────────────────────────────────────────────────────

async function apiFetch(endpoint, options = {}) {
  const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
  const resp = await fetch(url, {
    ...options,
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
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

async function main() {
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  SYNC COORDENADAS: PLACES hardcoded → Supabase');
  if (DRY_RUN) {
    console.log('  ⚠️  MODO DRY-RUN (no actualiza nada)');
    console.log('  Para actualizar: node tools/sync-coordenadas.js --confirmar');
  } else {
    console.log('  🔴 MODO REAL — Se actualizarán coordenadas en Supabase');
  }
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  // 1. Cargar negocios de Supabase
  console.log('  🔍 Cargando negocios de Supabase...');
  const negocios = await apiFetch('negocios?select=id,nombre,latitud,longitud&activo=eq.true');
  console.log(`  ✓ ${negocios.length} negocios cargados`);
  console.log('');

  // 2. Hacer matching y preparar updates
  const updates = [];
  const noMatch = [];
  const yaConCoords = [];

  for (const coord of COORDENADAS) {
    const normCoord = normalize(coord.nombre);

    // Buscar match por nombre normalizado
    const match = negocios.find(n => normalize(n.nombre) === normCoord);

    if (!match) {
      // Buscar match parcial (el nombre del negocio contiene el nombre de la coordenada o viceversa)
      const partialMatch = negocios.find(n => {
        const nn = normalize(n.nombre);
        return nn.includes(normCoord) || normCoord.includes(nn);
      });

      if (partialMatch) {
        if (partialMatch.latitud && partialMatch.longitud) {
          yaConCoords.push({ coord: coord.nombre, negocio: partialMatch.nombre });
        } else {
          updates.push({ id: partialMatch.id, nombre: partialMatch.nombre, lat: coord.lat, lng: coord.lng, from: coord.nombre });
        }
      } else {
        noMatch.push(coord.nombre);
      }
    } else {
      if (match.latitud && match.longitud) {
        yaConCoords.push({ coord: coord.nombre, negocio: match.nombre });
      } else {
        updates.push({ id: match.id, nombre: match.nombre, lat: coord.lat, lng: coord.lng, from: coord.nombre });
      }
    }
  }

  // 3. Mostrar resumen
  console.log('  📋 RESUMEN:');
  console.log(`     • Coordenadas disponibles:     ${COORDENADAS.length}`);
  console.log(`     • A actualizar (sin coords):   ${updates.length}`);
  console.log(`     • Ya tienen coords (omitir):   ${yaConCoords.length}`);
  console.log(`     • Sin match en Supabase:       ${noMatch.length}`);
  console.log('');

  if (updates.length > 0) {
    console.log('  🆕 Se actualizarán coordenadas:');
    for (const u of updates) {
      console.log(`     • "${u.nombre}" ← (${u.lat.toFixed(5)}, ${u.lng.toFixed(5)})`);
    }
    console.log('');
  }

  if (noMatch.length > 0) {
    console.log('  ⚠️  Sin match (no se actualizan):');
    noMatch.forEach(n => console.log(`     • "${n}"`));
    console.log('');
  }

  if (DRY_RUN) {
    console.log('───────────────────────────────────────────────────────────────');
    console.log('  ℹ️  DRY-RUN. No se modificó nada.');
    console.log('  Para actualizar: node tools/sync-coordenadas.js --confirmar');
    console.log('───────────────────────────────────────────────────────────────\n');
    return;
  }

  // 4. MODO REAL: actualizar uno a uno
  if (updates.length === 0) {
    console.log('  ✅ Nada que actualizar. Todos ya tienen coordenadas.\n');
    return;
  }

  console.log('  🚀 Actualizando coordenadas...');
  let ok = 0, fail = 0;

  for (const u of updates) {
    try {
      await apiFetch(`negocios?id=eq.${u.id}`, {
        method: 'PATCH',
        headers: { 'Prefer': 'return=minimal' },
        body: JSON.stringify({ latitud: u.lat, longitud: u.lng }),
      });
      console.log(`     ✓ "${u.nombre}"`);
      ok++;
    } catch (err) {
      console.error(`     ❌ "${u.nombre}": ${err.message}`);
      fail++;
    }
  }

  console.log('');
  console.log(`  ✅ Actualizados: ${ok} | ❌ Fallidos: ${fail}`);
  console.log('  Los negocios con coordenadas ahora aparecerán en el mapa.\n');
}

main();
