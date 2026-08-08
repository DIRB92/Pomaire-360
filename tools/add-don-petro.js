#!/usr/bin/env node
/**
 * add-don-petro.js — Agrega Fábrica de Maceteros Don Petro a Supabase
 *
 * USO:
 *   node tools/add-don-petro.js              # vista previa
 *   node tools/add-don-petro.js --confirmar  # insertar
 *
 * VARIABLES: SUPABASE_URL, SUPABASE_SERVICE_KEY, ADMIN_USER_ID
 */
'use strict';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://uuskvqtbsvtfsovcjazf.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;
const ADMIN_USER_ID = process.env.ADMIN_USER_ID;
const DRY_RUN = !process.argv.includes('--confirmar');

if (!SUPABASE_KEY || !ADMIN_USER_ID) {
  console.error('\n  ❌ Faltan variables:');
  console.error('  $env:SUPABASE_SERVICE_KEY = "tu-key"');
  console.error('  $env:ADMIN_USER_ID = "tu-uuid"\n');
  process.exit(1);
}

const NEGOCIO = {
  owner_id: ADMIN_USER_ID,
  nombre: 'Fábrica de Maceteros Don Petro',
  categoria: 'alfareria',
  descripcion: 'Fábrica de maceteros y vasijas de greda. Exhibiciones y venta directa.',
  direccion: 'Calle El Carmen, Pomaire',
  telefono: '+56 9 94648449',
  whatsapp: '56994648449',
  instagram: null,
  sitio_web: null,
  latitud: -33.646642321720606,
  longitud: -71.15017194940056,
  verificado: false,
  activo: true,
  plan: 'gratis',
};

async function main() {
  console.log('');
  console.log('  📦 Agregar: "' + NEGOCIO.nombre + '"');
  console.log('     Categoría: ' + NEGOCIO.categoria);
  console.log('     Dirección: ' + NEGOCIO.direccion);
  console.log('     Teléfono:  ' + NEGOCIO.telefono);
  console.log('     WhatsApp:  ' + NEGOCIO.whatsapp);
  console.log('     Coords:    ' + NEGOCIO.latitud + ', ' + NEGOCIO.longitud);
  console.log('');

  if (DRY_RUN) {
    console.log('  ⚠️  DRY-RUN. Para insertar: node tools/add-don-petro.js --confirmar\n');
    return;
  }

  const resp = await fetch(SUPABASE_URL + '/rest/v1/negocios', {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': 'Bearer ' + SUPABASE_KEY,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
    },
    body: JSON.stringify(NEGOCIO),
  });

  if (!resp.ok) {
    const body = await resp.text();
    console.error('  ❌ Error:', resp.status, body);
    process.exit(1);
  }

  const result = await resp.json();
  console.log('  ✅ Insertado: "' + result[0].nombre + '" → slug: "' + result[0].slug + '"');
  console.log('  Ya visible en app.pomaire360.cl y en el mapa.\n');
}

main();
