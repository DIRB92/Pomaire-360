/* ═══════════════════════════════════════════════════════════════════════════
   p360-config.js — Configuración centralizada del cliente Pomaire 360
   ---------------------------------------------------------------------------
   Punto único de definición de la URL y la clave anónima de Supabase que
   consumen los scripts del front-end (directory-loader, dir-search,
   featured-businesses, map-*, ratings, etc.).

   Debe cargarse ANTES que cualquier script que consuma Supabase:
       <script defer src="/p360-config.js"></script>

   IMPORTANTE — sobre la clave anónima:
   La "anon key" de Supabase es PÚBLICA por diseño: viaja al navegador en
   cada petición REST. No es un secreto. La seguridad real de los datos NO
   depende de ocultar esta clave, sino de las políticas Row Level Security
   (RLS) definidas en la base de datos. Centralizarla aquí es una mejora de
   mantenibilidad (una sola fuente de verdad), no de confidencialidad.

   Cada consumidor sigue aplicando el patrón
       window.P360_SUPABASE_URL || '<valor por defecto>'
   por lo que el sitio sigue funcionando aunque este archivo no se cargue.
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  // Permite override en tiempo de despliegue (p. ej. entorno de staging)
  // sin editar este archivo: basta con definir las variables antes de cargarlo.
  window.P360_SUPABASE_URL = window.P360_SUPABASE_URL ||
    'https://uuskvqtbsvtfsovcjazf.supabase.co';

  window.P360_SUPABASE_ANON_KEY = window.P360_SUPABASE_ANON_KEY ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1c2t2cXRic3Z0ZnNvdmNqYXpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2ODU4NDIsImV4cCI6MjEwMDI2MTg0Mn0.BbHI3ctSNg5msUnL9eENTNpOujQROAh6vUAZpFVcbBI';
})();
