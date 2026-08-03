#!/usr/bin/env node
/**
 * build-directory.js — Genera directory-data.json desde Supabase
 * v2: 12 categorías estándar unificadas
 *
 * Se ejecuta en build-time (CI/CD, deploy hook, o manualmente):
 *   node build-directory.js
 *
 * Genera /directory-data.json con los datos frescos de Supabase,
 * que luego se sirve estáticamente para SEO y carga inicial rápida.
 *
 * Variables de entorno requeridas:
 *   SUPABASE_URL       — URL del proyecto Supabase
 *   SUPABASE_SERVICE_KEY — Service role key (tiene acceso total)
 */
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Faltan variables de entorno:');
  console.error('   SUPABASE_URL y SUPABASE_SERVICE_KEY');
  process.exit(1);
}

const TABLE = 'negocios_directorio360';
const OUTPUT = path.resolve(__dirname, 'directory-data.json');

// 12 categorías estándar unificadas (v2)
const CATEGORIES = [
  'alfareria',
  'talleres',
  'restaurantes',
  'alojamiento',
  'comercio',
  'servicios',
  'estacionamientos',
  'salud',
  'seguridad',
  'banos',
  'transporte',
  'turismo'
];

/** Convierte registro de Supabase al formato del directory-loader */
function mapRow(row) {
  return {
    n: row.nombre,
    a: row.direccion,
    p: row.telefono || '',
    d: row.horario || '',
    tag: row.tag || '',
    map: row.google_maps || '',
    ig: row.instagram || '',
    fb: row.facebook || '',
    web: row.web || '',
    wsp: row.whatsapp || '',
    plan: (row.plan && row.plan !== 'gratis') ? row.plan : undefined,
    slug: row.slug || '',
    page: row.pagina_url || '',
    hours: row.horario || '',
    desc: row.descripcion || '',
    photos: row.fotos || [],
    foto_portada: row.foto_portada || '',
    rating_avg: row.rating_avg || 0,
    rating_count: row.rating_count || 0,
    verificado: row.verificado || false,
    tiktok: row.tiktok || '',
    updated_at: row.updated_at || '',
    lat: row.latitud,
    lng: row.longitud,
    _source: 'build',
    _categoria: row.categoria
  };
}


async function main() {
  console.log('🔄 Descargando negocios desde Supabase...');

  const url = `${SUPABASE_URL}/rest/v1/${TABLE}?select=*&order=updated_at.desc`;
  const res = await fetch(url, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Accept': 'application/json'
    }
  });

  if (!res.ok) {
    console.error(`❌ Error Supabase: ${res.status} ${res.statusText}`);
    const body = await res.text();
    console.error(body);
    process.exit(1);
  }

  const rows = await res.json();
  console.log(`✅ ${rows.length} negocios descargados`);

  // Agrupar por categoría (12 categorías estándar)
  const grouped = {};
  CATEGORIES.forEach(cat => { grouped[cat] = []; });

  rows.forEach(row => {
    const mapped = mapRow(row);
    const cat = row.categoria;
    if (grouped[cat]) {
      grouped[cat].push(mapped);
    } else {
      // Categoría desconocida → servicios como fallback
      console.warn(`  ⚠️  Categoría desconocida "${cat}" para "${row.nombre}" → asignada a servicios`);
      grouped['servicios'].push(mapped);
    }
  });

  // Estadísticas
  let totalMapped = 0;
  CATEGORIES.forEach(cat => {
    if (grouped[cat].length > 0) {
      console.log(`  📂 ${cat}: ${grouped[cat].length} negocios`);
      totalMapped += grouped[cat].length;
    }
  });
  console.log(`  ─── Total mapeado: ${totalMapped} negocios`);

  // Metadata
  const output = {
    _generated: new Date().toISOString(),
    _count: rows.length,
    _version: 2,
    _categories: CATEGORIES,
    ...grouped
  };

  fs.writeFileSync(OUTPUT, JSON.stringify(output, null, 2), 'utf-8');
  console.log(`\n📁 Archivo generado: ${OUTPUT}`);
  console.log('🚀 Listo para deploy');
}

main().catch(err => {
  console.error('❌ Error fatal:', err);
  process.exit(1);
});
