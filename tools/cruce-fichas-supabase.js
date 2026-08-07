#!/usr/bin/env node
/**
 * cruce-fichas-supabase.js
 * ════════════════════════════════════════════════════════════════════
 * Script SOLO-LECTURA que cruza las fichas fijas (app.js DIRECTORY)
 * con los negocios registrados en Supabase.
 *
 * SEGURIDAD:
 * - Solo ejecuta SELECT (lectura) contra Supabase via REST API
 * - No modifica nada en la base de datos ni en archivos del sitio
 * - Usa la anon key (rol de solo lectura)
 *
 * USO:
 *   node tools/cruce-fichas-supabase.js
 *
 * SALIDA:
 *   Imprime un reporte en consola y genera tools/reporte-cruce.csv
 * ════════════════════════════════════════════════════════════════════
 */

'use strict';

const fs = require('fs');
const path = require('path');

// ─── Configuracion Supabase (SOLO LECTURA — anon key) ────────────────────────
const SUPABASE_URL = 'https://uuskvqtbsvtfsovcjazf.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
  'eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1c2t2cXRic3Z0ZnNvdmNqYXpmIiwi' +
  'cm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2ODU4NDIsImV4cCI6MjEwMDI2MTg0Mn0.' +
  'BbHI3ctSNg5msUnL9eENTNpOujQROAh6vUAZpFVcbBI';
const TABLE = 'negocios_directorio360'; // vista de solo lectura


// ─── Fichas fijas (copiadas de app.js DIRECTORY) ─────────────────────────────
// Cada entrada: { n: nombre, a: direccion, p: telefono, cat: categoria_interna }
const FICHAS_FIJAS = [
  // === RESTAURANTES (27) ===
  { n:'Imperio Pomaire', a:'Roberto Bravo 78', p:'+56 9 73421189', cat:'restaurantes' },
  { n:'Restaurant La Greda', a:'Manuel Rodríguez 251', p:'', cat:'restaurantes' },
  { n:'Restaurante Los Naranjos', a:'Roberto Bravo 29', p:'+56 9 45606393', cat:'restaurantes' },
  { n:'La Cañada', a:'Roberto Bravo 307', p:'+56 9 76768309', cat:'restaurantes' },
  { n:'La Pica del Artesano', a:'Roberto Bravo 114', p:'+56 9 92812141', cat:'restaurantes' },
  { n:'El Boliche de Pomaire', a:'San Antonio 17', p:'+56 9 32734479', cat:'restaurantes' },
  { n:'La Normita (Tenedor libre)', a:'Manuel Rodríguez 325', p:'+56 9 46609599', cat:'restaurantes' },
  { n:'Emporio Doña Tránsito', a:'San Antonio 321', p:'+56 9 54461130', cat:'restaurantes' },
  { n:'San Sebastián', a:'Roberto Bravo 50', p:'+56 9 90440988', cat:'restaurantes' },
  { n:'La Pica de la Mireya', a:'Roto Chileno 249', p:'+56 9 53387756', cat:'restaurantes' },
  { n:'El Nico', a:'Roberto Bravo 397', p:'+56 9 61629311', cat:'restaurantes' },
  { n:'Las Delicias de Patricia', a:'Manuel Rodríguez 321', p:'+56 9 59296110', cat:'restaurantes' },
  { n:'San Antonio', a:'San Antonio 298', p:'+56 9 65707019', cat:'restaurantes' },
  { n:'Restaurant Chilper', a:'Camino La Cruz 454', p:'+56 9 76256505', cat:'restaurantes' },
  { n:'La Casa del Costillar', a:'Roberto Bravo 324', p:'+56 9 54153360', cat:'restaurantes' },
  { n:'El Rincón de las Brujas', a:'Roberto Bravo 302', p:'+56 9 35410406', cat:'restaurantes' },
  { n:'Quinta Los Naranjos', a:'San Antonio 279', p:'+56 9 59579197', cat:'restaurantes' },
  { n:'Flor y tierra', a:'Guillermo Barros 225', p:'+56 9 88291191', cat:'restaurantes' },
  { n:'Restaurant El Cototudo', a:'Roto Chileno 340', p:'+56 9 42419789', cat:'restaurantes' },
  { n:'La Coyita', a:'San Antonio 615', p:'+56 9 49772557', cat:'restaurantes' },
  { n:'La Fuente de mi Tierra', a:'Roberto Bravo 49', p:'+56 9 84753494', cat:'restaurantes' },
  { n:'Restaurante San Pedro - Pomaire', a:'Roto Chileno 332', p:'+56 9 85285787', cat:'restaurantes' },
  { n:'El Ranchito de Amalia', a:'Manuel Rodríguez 204', p:'+56 9 91843195', cat:'restaurantes' },
  { n:'Los Secretos de Anita', a:'San Antonio 213', p:'+56 9 74906024', cat:'restaurantes' },
  { n:'Restaurant El Parrón de Pomaire', a:'Arturo Prat 210', p:'+56 9 52433979', cat:'restaurantes' },
  { n:'Las Tinajas de Pomaire', a:'San Antonio 402', p:'+56 9 90177467', cat:'restaurantes' },
  { n:'Glamen', a:'Roberto Bravo 289', p:'+56 9 54109214', cat:'restaurantes' },

  // === TALLERES (4) ===
  { n:'Granja Educativa Alfarera Greda', a:'Bernardo O\'Higgins 260', p:'+56 9 98793533', cat:'talleres' },
  { n:'Espacio Greda', a:'Arturo Prat 352', p:'+56 9 20854538', cat:'talleres' },
  { n:'Taller del Sol', a:'Arturo Prat 237 B', p:'+56 9 45203264', cat:'talleres' },
  { n:'Taller Barros', a:'Guillermo Barros 150', p:'+56 9 50432417', cat:'talleres' },

  // === DEMOS (4) ===
  { n:'Juan Pablo Muñoz', a:'Roberto Bravo 164', p:'+56 9 50821246', cat:'talleres' },
  { n:'Pascual Gómez', a:'Arturo Prat 352', p:'+56 9 89075630', cat:'talleres' },
  { n:'Jorge Garrido', a:'Bernardo O\'Higgins 260', p:'+56 9 84144279', cat:'talleres' },
  { n:'El Pericote Artesanía', a:'Guillermo Barros 150', p:'+56 9 40869289', cat:'talleres' },

  // === JARDIN (2) ===
  { n:'Vivero Luchín', a:'San Antonio 191', p:'+56 9 54095760', cat:'comercio' },
  { n:'Jardín Monserrat', a:'El Carmen 389', p:'+56 9 91510810', cat:'comercio' },

  // === ALOJAMIENTOS (5) ===
  { n:'Hostal Pomaire', a:'Bernardo O\'Higgins 219', p:'+56 9 48172678', cat:'alojamiento' },
  { n:'Pomaire Lodge & Suites', a:'Bernardo O\'Higgins 219', p:'+56 9 65707019', cat:'alojamiento' },
  { n:'La Quinta de la Plaza', a:'San Antonio 410', p:'+56 9 99598919', cat:'alojamiento' },
  { n:'Cabañas Glamen 1', a:'Roberto Bravo 284', p:'+56 9 54109214', cat:'alojamiento' },
  { n:'Cabañas Glamen 2', a:'Pomaire', p:'+56 9 54109214', cat:'alojamiento' },

  // === INTERES (14) ===
  { n:'El Chancho alcancia de greda más grande del mundo', a:'Los Paltos 323', p:'+56 9 33566057', cat:'turismo' },
  { n:'Cervecería Pomaire', a:'Roberto Bravo 307', p:'+56 9 93979689', cat:'comercio' },
  { n:'Tienda Calafate Austral', a:'Roberto Bravo 77B', p:'+56 9 36572068', cat:'comercio' },
  { n:'La Chakana', a:'Roberto Bravo 195', p:'+56 9 91162709', cat:'comercio' },
  { n:'Charcutería Don Mati', a:'Arturo Prat 237', p:'+56 9 65852914', cat:'comercio' },
  { n:'Los Ceramistas', a:'General Baquedano 350', p:'+56 9 22579079', cat:'alfareria' },
  { n:'Panadería y Heladería ALSA', a:'Roberto Bravo 1606', p:'', cat:'comercio' },
  { n:'Cervecería / Chanchería Don Manuel', a:'Pasaje Juana Álvarez 107', p:'+56 9 42271014', cat:'comercio' },
  { n:'Artesanías Miriam (mimbre)', a:'San Antonio 180, local 3', p:'+56 9 94810090', cat:'alfareria' },
  { n:'Tejidos de Punto', a:'San Antonio 180, local 4', p:'+56 9 96711139', cat:'comercio' },
  { n:'Vestuaristas Pomaire', a:'Galería La Loica, Roberto Bravo 324', p:'', cat:'comercio' },
  { n:'El Místico (masajes, reiki)', a:'Roberto Bravo 27', p:'', cat:'servicios' },
  { n:'La Yerberita (farmacia natural)', a:'Roberto Bravo 1606', p:'', cat:'servicios' },
  { n:'Paseo Jardín de los Almendros', a:'Pomaire', p:'', cat:'turismo' },

  // === SERVICIOS (11) ===
  { n:'Oficina de Información Turística (OIT)', a:'Plaza de Pomaire', p:'+56 9 41814611', cat:'turismo' },
  { n:'Plaza de Pomaire (punto de encuentro)', a:'San Antonio 140', p:'', cat:'turismo' },
  { n:'CESFAM Pomaire', a:'Artesana Julita Vera 354', p:'+56 2 2568 8849', cat:'salud' },
  { n:'Carabineros Policia', a:'San Antonio 361', p:'133', cat:'seguridad' },
  { n:'Bomberos', a:'San Antonio 362', p:'+56 2 29224430', cat:'seguridad' },
  { n:'Farmacia Acua-Naser Pomaire', a:'San Antonio 362', p:'+56 2 29224430', cat:'salud' },
  { n:'Cajero Automático (ATM)', a:'Roberto Bravo 445', p:'', cat:'servicios' },
  { n:'Iglesia de Pomaire', a:'El Carmen 420', p:'', cat:'turismo' },
  { n:'Colegio de Pomaire', a:'Colegio y Jardín · Enseñanza Básica', p:'', cat:'servicios' },
  { n:'El Cristo', a:'Roberto Bravo 1', p:'', cat:'turismo' },
  { n:'Futuros Estacionamiento y baños públicos', a:'Guillermo Barros con Diego de Almagro', p:'', cat:'estacionamientos' },

  // === ARTESANOS (63) ===
  { n:'Camila y Diego', a:'Roberto Bravo 29', p:'+56 9 61277310', cat:'alfareria' },
  { n:'Isolina Guzmán Araya', a:'Roberto Bravo 59', p:'+56 9 87667822', cat:'alfareria' },
  { n:'Cerámicas Los Gemelos', a:'Roberto Bravo 455', p:'+56 9 62759986', cat:'alfareria' },
  { n:'Juana García', a:'Manuel Rodríguez 347', p:'+56 9 92174717', cat:'alfareria' },
  { n:'Familia Gatica Catalán', a:'Roberto Bravo 252, Galería Catalán Local 26', p:'+56 9 82814690', cat:'alfareria' },
  { n:'Isabel R. & Eduardo G.', a:'Roberto Bravo esq. 18 de Septiembre', p:'+56 9 66055530', cat:'alfareria' },
  { n:'Gredas Nene La Ruca', a:'Roberto Bravo 44B', p:'+56 9 88291191', cat:'alfareria' },
  { n:'Cerámicas Valentina', a:'Roberto Bravo 88-A', p:'+56 9 73887858', cat:'alfareria' },
  { n:'El Larita', a:'Roberto Bravo 465', p:'+56 9 97335365', cat:'alfareria' },
  { n:'Pachamama Taller', a:'Arturo Prat 338 B', p:'+56 9 54042248', cat:'alfareria' },
  { n:'Eduardo Pardo Z.', a:'Roberto Bravo 272', p:'+56 9 99498024', cat:'alfareria' },
  { n:'Nano Santibáñez', a:'San Antonio 39', p:'+56 9 96212055', cat:'alfareria' },
  { n:'Roberto Bravo', a:'Roberto Bravo 447', p:'+56 9 77750106', cat:'alfareria' },
  { n:'Aracely', a:'General Baquedano esq. San Antonio', p:'+56 9 83342757', cat:'alfareria' },
  { n:'Lámparas Irarrazaval Diseños', a:'Roberto Bravo 53 A', p:'+56 9 82851797', cat:'alfareria' },
  { n:'Jesús Mi Alfarero', a:'Roberto Bravo 221', p:'+56 9 97568575', cat:'alfareria' },
  { n:'Cerámica El Arbolito', a:'Roberto Bravo 510', p:'+56 9 93733512', cat:'alfareria' },
  { n:'Taller Edi Art', a:'General Baquedano 316', p:'+56 9 79340584', cat:'alfareria' },
  { n:'Miguel Salinas Baeza', a:'Roberto Bravo 13B', p:'+56 9 94560850', cat:'alfareria' },
  { n:'La Raquelita', a:'Roberto Bravo 88', p:'+56 9 95169386', cat:'alfareria' },
  { n:'Taller San José', a:'Roberto Bravo 460', p:'+56 9 82117144', cat:'alfareria' },
  { n:'Cerámica y Decoración Inelia', a:'Arturo Prat 338', p:'+56 9 75182329', cat:'alfareria' },
  { n:'San Marcos', a:'Roberto Bravo 267', p:'+56 9 53160316', cat:'alfareria' },
  { n:'Segundo Enrique Trujillo S.', a:'San Antonio 10', p:'+56 9 85669982', cat:'alfareria' },
  { n:'Rosa y Marcela', a:'Roberto Bravo 414', p:'+56 9 85039992', cat:'alfareria' },

  { n:'Gredas Ximena', a:'San Antonio esq. Arturo Prat', p:'+56 9 96687585', cat:'alfareria' },
  { n:'Cerámica Badi', a:'Roberto Bravo 49', p:'+56 9 87584538', cat:'alfareria' },
  { n:'Cerámicas Fonola', a:'Roberto Bravo 185', p:'+56 9 92467532', cat:'alfareria' },
  { n:'La Palmera', a:'Roberto Bravo 502', p:'+56 9 87854529', cat:'alfareria' },
  { n:'Alfarería Edison', a:'General Baquedano 312', p:'+56 9 79340584', cat:'alfareria' },
  { n:'Doña Laurita', a:'Roberto Bravo 407', p:'+56 9 61651455', cat:'alfareria' },
  { n:'Gredas Flores', a:'San Antonio 335', p:'+56 9 51123005', cat:'alfareria' },
  { n:'Cerámicas El Cheo', a:'Roberto Bravo 56 A', p:'+56 9 91661194', cat:'alfareria' },
  { n:'Cerámicas Tania', a:'Roberto Bravo 454', p:'+56 9 62577048', cat:'alfareria' },
  { n:'Enrique Garrido', a:'Manuel Rodríguez 345', p:'+56 9 73165446', cat:'alfareria' },
  { n:'Artesanías Bernarda Hernández', a:'Roberto Bravo 248, Galería Serruchos', p:'+56 9 90225433', cat:'alfareria' },
  { n:'Robertito', a:'Roberto Bravo esq. 18 de Septiembre', p:'+56 9 46497460', cat:'alfareria' },
  { n:'Fresia Castillo Romero', a:'Roberto Bravo 13A', p:'+56 9 94511658', cat:'alfareria' },
  { n:'Artesanía Tradicional El Gomero', a:'Roberto Bravo 80', p:'+56 9 91606574', cat:'alfareria' },
  { n:'Rosa Mora', a:'Roberto Bravo 457', p:'+56 9 95580575', cat:'alfareria' },
  { n:'Octavio Fernando Silva R.', a:'Manuel Rodríguez con San Antonio', p:'+56 9 31471192', cat:'alfareria' },
  { n:'Mami Inés', a:'Roberto Bravo 252, Galería Catalán Local 1', p:'+56 9 83290566', cat:'alfareria' },
  { n:'Artesanía Tradicional Loza de Greda', a:'Roberto Bravo con Morandé', p:'+56 9 98781143', cat:'alfareria' },
  { n:'Gredas La Mamy', a:'Roberto Bravo 44C', p:'+56 9 97225185', cat:'alfareria' },
  { n:'Cerámicas Miguel Ángel', a:'Roberto Bravo 97', p:'', cat:'alfareria' },
  { n:'María Elisa Salinas Aguilera', a:'Roberto Bravo 469', p:'+56 9 92320964', cat:'alfareria' },
  { n:'Donde Miguel', a:'Arturo Prat 380', p:'+56 9 92682046', cat:'alfareria' },
  { n:'La Poza', a:'Roberto Bravo 311', p:'+56 9 93617561', cat:'alfareria' },
  { n:'Artesanía Utilitaria El Cone', a:'San Antonio 215', p:'+56 9 84730313', cat:'alfareria' },
  { n:'Mi Chanchita', a:'Roberto Bravo 453', p:'+56 9 96721752', cat:'alfareria' },
  { n:'Cerámicas Rosa Ester', a:'Manuel Rodríguez 15', p:'+56 9 77751558', cat:'alfareria' },
  { n:'Don Francisco', a:'Roberto Bravo 56 B', p:'+56 9 68089602', cat:'alfareria' },
  { n:'Taller Tierra Arte', a:'Roberto Bravo 221', p:'+56 9 77877784', cat:'alfareria' },
  { n:'María', a:'El Carmen 275', p:'+56 9 89909036', cat:'alfareria' },
  { n:'Oscar Alejandro Durán', a:'El Carmen 690', p:'+56 9 83527207', cat:'alfareria' },
  { n:'Marisol Quiróz Abarca', a:'Lautaro 752', p:'+56 9 99745542', cat:'alfareria' },
  { n:'Fábrica Roca', a:'Roberto Bravo 114', p:'+56 9 99745542', cat:'alfareria' },
  { n:'Cerámicas Dami', a:'El Carmen 479', p:'+56 9 68007192', cat:'alfareria' },
  { n:'Cerámica Carolina', a:'El Limonal 722', p:'+56 9 71031885', cat:'alfareria' },
  { n:'Amelia Rojas Quiróz', a:'Bernardo O\'Higgins 315', p:'+56 9 78316925', cat:'alfareria' },
  { n:'Rosa Rojas', a:'General Baquedano 448', p:'+56 9 77877784', cat:'alfareria' },
  { n:'Cerámicas Anaís', a:'El Carmen 329', p:'+56 9 67749664', cat:'alfareria' },
  { n:'Elías Veliz', a:'Rafael Morandé 480 B', p:'+56 9 90325852', cat:'alfareria' },
];


// ─── Utilidades de normalización y matching ──────────────────────────────────

/**
 * Normaliza un string para comparación fuzzy:
 * - minúsculas
 * - sin acentos/tildes
 * - sin caracteres especiales
 * - sin espacios extras
 */
function normalize(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // quitar acentos
    .replace(/[^a-z0-9\s]/g, ' ')   // solo alfanumerico
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Normaliza un telefono a solo digitos (sin +56 9 prefijo variable)
 */
function normalizePhone(phone) {
  if (!phone) return '';
  return phone.replace(/[^0-9]/g, '').slice(-8); // ultimos 8 digitos
}

/**
 * Calcula similitud entre dos strings (Dice coefficient sobre bigramas)
 * Retorna 0.0 a 1.0
 */
function similarity(a, b) {
  const na = normalize(a);
  const nb = normalize(b);
  if (na === nb) return 1.0;
  if (na.length < 2 || nb.length < 2) return 0;

  const bigrams = (s) => {
    const set = new Map();
    for (let i = 0; i < s.length - 1; i++) {
      const bi = s.substring(i, i + 2);
      set.set(bi, (set.get(bi) || 0) + 1);
    }
    return set;
  };

  const ba = bigrams(na);
  const bb = bigrams(nb);
  let matches = 0;

  for (const [bi, count] of ba) {
    if (bb.has(bi)) matches += Math.min(count, bb.get(bi));
  }

  return (2.0 * matches) / (na.length - 1 + nb.length - 1);
}


/**
 * Intenta hacer match entre una ficha fija y un negocio de Supabase.
 * Estrategia multi-criterio:
 *  1. Match exacto por nombre normalizado → confianza ALTA
 *  2. Match por telefono (ultimos 8 digitos) → confianza ALTA
 *  3. Match por similitud de nombre >= 0.7 + misma direccion → confianza MEDIA
 *  4. Match por similitud de nombre >= 0.8 → confianza MEDIA
 */
function findMatch(ficha, supabaseList) {
  const fichaName = normalize(ficha.n);
  const fichaPhone = normalizePhone(ficha.p);
  const fichaAddr = normalize(ficha.a);

  let bestMatch = null;
  let bestScore = 0;
  let confidence = 'NONE';

  for (const neg of supabaseList) {
    const negName = normalize(neg.nombre);
    const negPhone = normalizePhone(neg.telefono);
    const negAddr = normalize(neg.direccion);

    // 1. Match exacto por nombre
    if (fichaName === negName) {
      return { match: neg, confidence: 'ALTA', score: 1.0, reason: 'nombre exacto' };
    }

    // 2. Match por telefono
    if (fichaPhone && negPhone && fichaPhone === negPhone) {
      return { match: neg, confidence: 'ALTA', score: 1.0, reason: 'telefono' };
    }

    // 3-4. Match por similitud
    const nameSim = similarity(ficha.n, neg.nombre);

    if (nameSim >= 0.7 && fichaAddr && negAddr && similarity(ficha.a, neg.direccion) >= 0.6) {
      if (nameSim > bestScore) {
        bestMatch = neg;
        bestScore = nameSim;
        confidence = 'MEDIA';
      }
    } else if (nameSim >= 0.8 && nameSim > bestScore) {
      bestMatch = neg;
      bestScore = nameSim;
      confidence = 'MEDIA';
    }
  }

  if (bestMatch) {
    return { match: bestMatch, confidence, score: bestScore, reason: 'similitud nombre' };
  }

  return { match: null, confidence: 'NONE', score: 0, reason: '' };
}


// ─── Fetch de Supabase (SOLO LECTURA) ────────────────────────────────────────

async function fetchNegocios() {
  // Usamos la vista negocios_directorio360 (solo activos, solo lectura)
  const url = `${SUPABASE_URL}/rest/v1/${TABLE}?select=id,nombre,slug,direccion,telefono,categoria,plan,rating_avg,rating_count,verificado`;

  const resp = await fetch(url, {
    method: 'GET', // SOLO LECTURA
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Accept': 'application/json',
    },
  });

  if (!resp.ok) {
    const body = await resp.text();
    throw new Error(`Error al leer Supabase (${resp.status}): ${body}`);
  }

  return resp.json();
}

// ─── Generación del reporte ──────────────────────────────────────────────────

function generateReport(results, supabaseNegocios) {
  const matched = results.filter(r => r.confidence !== 'NONE');
  const unmatched = results.filter(r => r.confidence === 'NONE');

  // Negocios en Supabase que NO estan en fichas fijas
  const matchedIds = new Set(matched.map(r => r.supabaseMatch?.id).filter(Boolean));
  const soloEnSupabase = supabaseNegocios.filter(n => !matchedIds.has(n.id));

  console.log('\n');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  REPORTE DE CRUCE: Fichas Fijas vs Supabase');
  console.log('  (SOLO LECTURA — nada fue modificado)');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');
  console.log(`  Total fichas fijas:               ${FICHAS_FIJAS.length}`);
  console.log(`  Total negocios en Supabase:       ${supabaseNegocios.length}`);
  console.log('');
  console.log(`  ✅ Fichas CON match en Supabase:   ${matched.length}`);
  console.log(`  ❌ Fichas SIN match en Supabase:   ${unmatched.length}`);
  console.log(`  🆕 Solo en Supabase (nuevos):      ${soloEnSupabase.length}`);
  console.log('');


  // Detalle de matches
  if (matched.length > 0) {
    console.log('───────────────────────────────────────────────────────────────');
    console.log('  ✅ FICHAS CON MATCH EN SUPABASE:');
    console.log('───────────────────────────────────────────────────────────────');
    for (const r of matched) {
      const badge = r.confidence === 'ALTA' ? '🟢' : '🟡';
      console.log(`  ${badge} "${r.ficha.n}" → "${r.supabaseMatch.nombre}" [${r.confidence}] (${r.reason})`);
    }
    console.log('');
  }

  // Detalle de no-match
  if (unmatched.length > 0) {
    console.log('───────────────────────────────────────────────────────────────');
    console.log('  ❌ FICHAS SIN REGISTRAR EN SUPABASE (oportunidad):');
    console.log('───────────────────────────────────────────────────────────────');
    for (const r of unmatched) {
      const phone = r.ficha.p || '(sin teléfono)';
      console.log(`  • [${r.ficha.cat}] "${r.ficha.n}" — ${r.ficha.a} — ${phone}`);
    }
    console.log('');
  }

  // Negocios solo en Supabase
  if (soloEnSupabase.length > 0) {
    console.log('───────────────────────────────────────────────────────────────');
    console.log('  🆕 NEGOCIOS SOLO EN SUPABASE (no están en fichas fijas):');
    console.log('───────────────────────────────────────────────────────────────');
    for (const n of soloEnSupabase) {
      const verified = n.verificado ? '✓' : '○';
      console.log(`  ${verified} [${n.categoria}] "${n.nombre}" — ${n.direccion || '(sin dir)'} — Plan: ${n.plan}`);
    }
    console.log('');
  }

  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  return { matched, unmatched, soloEnSupabase };
}


// ─── Generación de CSV ───────────────────────────────────────────────────────

function generateCSV(results, soloEnSupabase) {
  const lines = [
    'estado,ficha_nombre,ficha_direccion,ficha_telefono,ficha_categoria,supabase_nombre,supabase_slug,supabase_categoria,supabase_plan,confianza,razon'
  ];

  for (const r of results) {
    const estado = r.confidence !== 'NONE' ? 'MATCH' : 'SIN_REGISTRAR';
    const sn = r.supabaseMatch ? r.supabaseMatch.nombre : '';
    const ss = r.supabaseMatch ? r.supabaseMatch.slug : '';
    const sc = r.supabaseMatch ? r.supabaseMatch.categoria : '';
    const sp = r.supabaseMatch ? r.supabaseMatch.plan : '';
    lines.push(
      `${estado},"${r.ficha.n}","${r.ficha.a}","${r.ficha.p}",${r.ficha.cat},"${sn}","${ss}",${sc},${sp},${r.confidence},${r.reason}`
    );
  }

  for (const n of soloEnSupabase) {
    lines.push(
      `SOLO_SUPABASE,,,,,"${n.nombre}","${n.slug}",${n.categoria},${n.plan},,`
    );
  }

  const csvPath = path.join(__dirname, 'reporte-cruce.csv');
  fs.writeFileSync(csvPath, lines.join('\n'), 'utf8');
  console.log(`  📄 CSV exportado: ${csvPath}`);
  console.log('');
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('');
  console.log('  🔍 Obteniendo negocios de Supabase (solo lectura)...');

  let supabaseNegocios;
  try {
    supabaseNegocios = await fetchNegocios();
  } catch (err) {
    console.error('');
    console.error('  ⚠️  No se pudo conectar a Supabase:', err.message);
    console.error('  Asegurate de tener conexion a internet.');
    console.error('');
    process.exit(1);
  }

  console.log(`  ✓ ${supabaseNegocios.length} negocios activos encontrados en Supabase`);
  console.log(`  🔄 Cruzando con ${FICHAS_FIJAS.length} fichas fijas...`);

  // Ejecutar matching
  const results = FICHAS_FIJAS.map(ficha => {
    const { match, confidence, score, reason } = findMatch(ficha, supabaseNegocios);
    return {
      ficha,
      supabaseMatch: match,
      confidence,
      score,
      reason,
    };
  });

  // Generar reporte
  const { matched, unmatched, soloEnSupabase } = generateReport(results, supabaseNegocios);

  // Exportar CSV
  generateCSV(results, soloEnSupabase);

  // Resumen final
  console.log('  📊 RESUMEN EJECUTIVO:');
  console.log(`     • ${Math.round(matched.length / FICHAS_FIJAS.length * 100)}% de fichas fijas ya están en Supabase`);
  console.log(`     • ${unmatched.length} negocios por contactar/registrar`);
  console.log(`     • ${soloEnSupabase.length} negocios nuevos se registraron directo en la app`);
  console.log('');
}

main();
