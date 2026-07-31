#!/usr/bin/env node
/**
 * build-directory.js — Genera directory-data.json desde Supabase (pomaire-app)
 *
 * Se ejecuta en build-time (CI/CD, deploy hook, o manualmente):
 *   node build-directory.js
 *
 * Lee la tabla "negocios" de app.pomaire360.cl vía la API REST de Supabase
 * y genera un JSON estático agrupado por categoría para SEO y carga rápida.
 *
 * Variables de entorno requeridas:
 *   SUPABASE_URL         — https://uuskvqtbsvtfsovqjar7.supabase.co
 *   SUPABASE_SERVICE_KEY — Service role key (acceso total, NUNCA exponer)
 *
 * Si no hay service key, usa la anon key (solo lee negocios activos via RLS).
 */
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://uuskvqtbsvtfsovqjar7.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || '';

if (!SUPABASE_KEY) {
  console.error('❌ Falta variable de entorno: SUPABASE_SERVICE_KEY o SUPABASE_ANON_KEY');
  console.error('   Configúrala en tu plataforma de deploy (Cloudflare Pages, Vercel, etc.)');
  process.exit(1);
}

const SELECT_COLS = [
  'id', 'nombre', 'slug', 'categoria', 'descripcion', 'direccion',
  'telefono', 'whatsapp', 'instagram', 'sitio_web', 'horarios',
  'latitud', 'longitud', 'imagen_principal', 'imagenes', 'verificado',
  'rating_promedio', 'total_resenas', 'plan', 'updated_at'
].join(',');

const OUTPUT = path.resolve(__dirname, 'directory-data.json');

// Categorías válidas en la app
const CATEGORIES = [
  'artesania', 'gastronomia', 'hospedaje',
  'turismo', 'comercio', 'servicios', 'otro'
];

/** Formatea horarios JSONB a string */
function formatHorarios(horarios) {
  if (!horarios || typeof horarios !== 'object') return '';
  if (typeof horarios === 'string') return horarios;
  var keys = Object.keys(horarios);
  if (keys.length === 0) return '';
  return keys.map(function(dia) {
    return horarios[dia] ? dia + ': ' + horarios[dia] : '';
  }).filter(Boolean).join(' · ');
}

/** Convierte registro Supabase al formato del loader */
function mapRow(row) {
  return {
    n: row.nombre,
    a: row.direccion || 'Pomaire',
    p: row.telefono || '',
    d: formatHorarios(row.horarios),
    tag: '',
    map: (row.latitud && row.longitud)
      ? 'https://maps.google.com/?q=' + row.latitud + ',' + row.longitud
      : '',
    ig: row.instagram || '',
    fb: '',
    web: row.sitio_web || '',
    wsp: row.whatsapp || '',
    plan: (row.plan && row.plan !== 'gratis') ? row.plan : undefined,
    slug: row.slug || '',
    page: '',
    hours: formatHorarios(row.horarios),
    desc: row.descripcion || '',
    photos: row.imagenes || [],
    foto_portada: row.imagen_principal || '',
    rating_avg: parseFloat(row.rating_promedio) || 0,
    rating_count: row.total_resenas || 0,
    verificado: row.verificado || false,
    updated_at: row.updated_at || '',
    lat: row.latitud,
    lng: row.longitud,
    _source: 'build',
    _categoria: row.categoria
  };
}

async function main() {
  console.log('🔄 Descargando negocios desde Supabase (pomaire-app)...');
  console.log('   URL:', SUPABASE_URL);

  const url = `${SUPABASE_URL}/rest/v1/negocios?select=${SELECT_COLS}&activo=eq.true&order=rating_promedio.desc`;

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

  // Agrupar por categoría
  const grouped = {};
  CATEGORIES.forEach(cat => { grouped[cat] = []; });

  rows.forEach(row => {
    const mapped = mapRow(row);
    const cat = row.categoria;
    if (grouped[cat]) {
      grouped[cat].push(mapped);
    } else {
      grouped.otro.push(mapped);
    }
  });

  // Estadísticas
  console.log('');
  CATEGORIES.forEach(cat => {
    if (grouped[cat].length > 0) {
      console.log(`  📂 ${cat}: ${grouped[cat].length} negocios`);
    }
  });

  // Output con metadata
  const output = {
    _generated: new Date().toISOString(),
    _source: 'supabase/pomaire-app',
    _count: rows.length,
    ...grouped
  };

  fs.writeFileSync(OUTPUT, JSON.stringify(output, null, 2), 'utf-8');
  console.log(`\n📁 Archivo generado: ${OUTPUT}`);
  console.log(`   Tamaño: ${(fs.statSync(OUTPUT).size / 1024).toFixed(1)} KB`);
  console.log('🚀 Listo para deploy');
}

main().catch(err => {
  console.error('❌ Error fatal:', err);
  process.exit(1);
});
