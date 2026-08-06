#!/usr/bin/env node
/**
 * migrate-2026.js — Migra TODAS las subpáginas de Pomaire 360 al diseño 2026.
 * 
 * Cambios que aplica a cada index.html (excepto ./index.html que ya migró):
 * 1. theme-color: #B85C2C → #D4654A
 * 2. style.css → style-2026.css
 * 3. Agrega CSS inline crítico para el hero (si la página tiene #inicio)
 * 4. Mantiene components.css y directory-cards.css
 */
const fs = require('fs');
const path = require('path');

// Find all index.html files (exclude .git and main index.html already migrated)
function findHtmlFiles(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.name === '.git' || entry.name === 'node_modules') continue;
    if (entry.isDirectory()) {
      findHtmlFiles(full, files);
    } else if (entry.name === 'index.html' && full !== path.join(dir, 'index.html')) {
      files.push(full);
    }
  }
  return files;
}

const ROOT = __dirname;
const mainIndex = path.join(ROOT, 'index.html');

// Get all HTML files except the main index (already migrated)
let allFiles = [];
const entries = fs.readdirSync(ROOT, { withFileTypes: true });
for (const entry of entries) {
  if (entry.name === '.git' || entry.name === 'node_modules' || entry.name === '.i18n-build') continue;
  if (entry.isDirectory()) {
    const subIndex = path.join(ROOT, entry.name, 'index.html');
    if (fs.existsSync(subIndex)) allFiles.push(subIndex);
    // Check nested dirs (en/alfareria/, pt/salud/, etc.)
    const subEntries = fs.readdirSync(path.join(ROOT, entry.name), { withFileTypes: true });
    for (const sub of subEntries) {
      if (sub.isDirectory()) {
        const nested = path.join(ROOT, entry.name, sub.name, 'index.html');
        if (fs.existsSync(nested)) allFiles.push(nested);
      }
    }
  }
}

// Critical inline CSS for subpages (lighter version — no hero needed on subpages)
const INLINE_CSS = `
<!-- Critical inline styles 2026 -->
<style>
body{font-family:'Inter',-apple-system,sans-serif;background:#FAFAF7;color:#2D1A0A}
nav{background:rgba(255,255,255,.72);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px)}
.section-icon{background:rgba(212,101,74,.15);border:2px solid #F0A090;border-radius:16px}
</style>`;

let migrated = 0;
let skipped = 0;
let errors = 0;

for (const file of allFiles) {
  try {
    let html = fs.readFileSync(file, 'utf8');
    
    // Skip if already migrated
    if (html.includes('style-2026.css')) {
      skipped++;
      continue;
    }
    
    // Skip if doesn't use style.css (e.g., comercio uses its own CSS)
    if (!html.includes('style.css')) {
      skipped++;
      continue;
    }

    // 1. Update theme-color
    html = html.replace(
      /<meta name="theme-color" content="#B85C2C">/g,
      '<meta name="theme-color" content="#D4654A">'
    );

    // 2. Replace style.css with style-2026.css
    html = html.replace(
      /<link rel="stylesheet" href="\/style\.css">/g,
      '<link rel="stylesheet" href="/style-2026.css">'
    );

    // 3. Add inline critical CSS after theme-color (if not already there)
    if (!html.includes('Critical inline styles 2026')) {
      html = html.replace(
        '<meta name="theme-color" content="#D4654A">',
        '<meta name="theme-color" content="#D4654A">\n' + INLINE_CSS
      );
    }

    fs.writeFileSync(file, html, 'utf8');
    migrated++;
    console.log('✅ ' + path.relative(ROOT, file));
  } catch (e) {
    errors++;
    console.error('❌ ' + path.relative(ROOT, file) + ': ' + e.message);
  }
}

console.log('\n═══════════════════════════════════');
console.log('Migrated: ' + migrated);
console.log('Skipped:  ' + skipped);
console.log('Errors:   ' + errors);
console.log('Total:    ' + allFiles.length);
