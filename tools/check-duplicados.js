#!/usr/bin/env node
/**
 * check-duplicados.js
 * ════════════════════════════════════════════════════════════════════
 * Revisa si hay negocios duplicados en Supabase.
 * SOLO LECTURA — no modifica nada.
 *
 * Criterios de detección:
 * 1. Nombre exacto repetido
 * 2. Nombre normalizado repetido (sin acentos/mayúsculas)
 * 3. Mismo teléfono en negocios diferentes
 *
 * USO:
 *   node tools/check-duplicados.js
 *
 * VARIABLES DE ENTORNO:
 *   SUPABASE_URL, SUPABASE_SERVICE_KEY
 *   (o usa la anon key si no tienes la service key a mano)
 * ════════════════════════════════════════════════════════════════════
 */

'use strict';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://uuskvqtbsvtfsovcjazf.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
  'eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1c2t2cXRic3Z0ZnNvdmNqYXpmIiwi' +
  'cm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2ODU4NDIsImV4cCI6MjEwMDI2MTg0Mn0.' +
  'BbHI3ctSNg5msUnL9eENTNpOujQROAh6vUAZpFVcbBI';

function normalize(str) {
  if (!str) return '';
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function normalizePhone(phone) {
  if (!phone) return '';
  return phone.replace(/[^0-9]/g, '').slice(-8);
}

async function main() {
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  🔍 REVISIÓN DE DUPLICADOS EN SUPABASE');
  console.log('  (Solo lectura — no modifica nada)');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  // Fetch todos los negocios
  const url = `${SUPABASE_URL}/rest/v1/negocios?select=id,nombre,slug,categoria,direccion,telefono,activo&order=nombre`;
  const resp = await fetch(url, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Accept': 'application/json',
    },
  });

  if (!resp.ok) {
    console.error('  ❌ Error al consultar Supabase:', resp.status, await resp.text());
    process.exit(1);
  }

  const negocios = await resp.json();
  console.log(`  Total negocios en BD: ${negocios.length}`);
  console.log('');

  let hayDuplicados = false;

  // ── 1. Duplicados por nombre exacto ────────────────────────────────────
  console.log('  ── Duplicados por NOMBRE EXACTO ──');
  const porNombre = {};
  for (const n of negocios) {
    const key = n.nombre;
    if (!porNombre[key]) porNombre[key] = [];
    porNombre[key].push(n);
  }
  const dupNombreExacto = Object.entries(porNombre).filter(([, v]) => v.length > 1);
  if (dupNombreExacto.length > 0) {
    hayDuplicados = true;
    for (const [nombre, items] of dupNombreExacto) {
      console.log(`  ⚠️  "${nombre}" (${items.length} veces):`);
      for (const it of items) {
        const estado = it.activo ? '✓ activo' : '✗ inactivo';
        console.log(`      • id: ${it.id} | ${it.categoria} | ${it.direccion || '(sin dir)'} | ${estado}`);
      }
    }
  } else {
    console.log('  ✅ No hay duplicados por nombre exacto');
  }
  console.log('');

  // ── 2. Duplicados por nombre normalizado ───────────────────────────────
  console.log('  ── Duplicados por NOMBRE NORMALIZADO ──');
  const porNormalized = {};
  for (const n of negocios) {
    const key = normalize(n.nombre);
    if (!porNormalized[key]) porNormalized[key] = [];
    porNormalized[key].push(n);
  }
  const dupNormalized = Object.entries(porNormalized)
    .filter(([, v]) => v.length > 1)
    .filter(([key]) => !dupNombreExacto.some(([nombre]) => normalize(nombre) === key));
  if (dupNormalized.length > 0) {
    hayDuplicados = true;
    for (const [, items] of dupNormalized) {
      console.log(`  ⚠️  Posible duplicado:`);
      for (const it of items) {
        const estado = it.activo ? '✓' : '✗';
        console.log(`      ${estado} "${it.nombre}" | ${it.categoria} | ${it.direccion || '(sin dir)'} | id: ${it.id}`);
      }
    }
  } else {
    console.log('  ✅ No hay duplicados por nombre normalizado');
  }
  console.log('');

  // ── 3. Duplicados por teléfono ─────────────────────────────────────────
  console.log('  ── Duplicados por TELÉFONO ──');
  const porTelefono = {};
  for (const n of negocios) {
    const phone = normalizePhone(n.telefono);
    if (!phone || phone.length < 7) continue; // ignorar vacíos y cortos (ej: 133)
    if (!porTelefono[phone]) porTelefono[phone] = [];
    porTelefono[phone].push(n);
  }
  const dupTelefono = Object.entries(porTelefono).filter(([, v]) => v.length > 1);
  if (dupTelefono.length > 0) {
    hayDuplicados = true;
    for (const [phone, items] of dupTelefono) {
      console.log(`  ⚠️  Teléfono ...${phone} compartido:`);
      for (const it of items) {
        console.log(`      • "${it.nombre}" | ${it.categoria} | id: ${it.id}`);
      }
    }
  } else {
    console.log('  ✅ No hay duplicados por teléfono');
  }
  console.log('');

  // ── Resumen ────────────────────────────────────────────────────────────
  console.log('═══════════════════════════════════════════════════════════════');
  if (!hayDuplicados) {
    console.log('  ✅ ¡LIMPIO! No se encontraron duplicados.');
  } else {
    console.log('  ⚠️  Se encontraron posibles duplicados.');
    console.log('  Para eliminar uno, usa el SQL Editor en Supabase:');
    console.log('    DELETE FROM negocios WHERE id = \'UUID-A-ELIMINAR\';');
  }
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');
}

main();
