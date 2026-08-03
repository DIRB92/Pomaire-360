-- ═══════════════════════════════════════════════════════════════════════════
-- Vista de compatibilidad: negocios_directorio360
-- Traduce el esquema de app.pomaire360.cl al formato que espera
-- directory-loader.js de pomaire360.cl
--
-- INSTRUCCIONES:
-- 1. Abre Supabase Dashboard → SQL Editor
-- 2. Pega este SQL completo
-- 3. Haz clic en "Run"
-- ═══════════════════════════════════════════════════════════════════════════

-- Primero eliminamos la vista anterior si existe
DROP VIEW IF EXISTS public.negocios_directorio360;

-- Crear la vista que traduce nombres de columna y categorías
CREATE OR REPLACE VIEW public.negocios_directorio360 AS
SELECT
  id,
  nombre,
  slug,
  direccion,
  telefono,
  whatsapp,
  descripcion,

  -- Mapeo de categorías: app → directorio del sitio principal
  CASE categoria::text
    WHEN 'artesania'   THEN 'artesanos'
    WHEN 'gastronomia' THEN 'gastronomia'
    WHEN 'hospedaje'   THEN 'alojamientos'
    WHEN 'turismo'     THEN 'interes'
    WHEN 'comercio'    THEN 'interes'
    WHEN 'servicios'   THEN 'servicios'
    WHEN 'otro'        THEN 'interes'
    ELSE 'interes'
  END AS categoria,

  -- Plan (ya existe por la migración)
  COALESCE(plan, 'gratis') AS plan,

  -- Tag (texto libre descriptivo)
  CASE categoria::text
    WHEN 'artesania'   THEN 'Artesanía'
    WHEN 'gastronomia' THEN 'Restaurante'
    WHEN 'hospedaje'   THEN 'Alojamiento'
    WHEN 'turismo'     THEN 'Atractivo'
    WHEN 'comercio'    THEN 'Tienda'
    WHEN 'servicios'   THEN 'Servicios'
    WHEN 'otro'        THEN 'Otro'
    ELSE ''
  END AS tag,

  -- Horarios (texto plano del JSON si existe)
  COALESCE(
    (SELECT string_agg(key || ': ' || value, ' · ')
     FROM jsonb_each_text(horarios)
     WHERE horarios IS NOT NULL AND horarios != '{}'::jsonb),
    ''
  ) AS horario,

  -- Ubicación
  latitud,
  longitud,
  '' AS google_maps,  -- La app no almacena URL de Google Maps

  -- Redes sociales (traducción de nombres de columna)
  COALESCE(instagram, '') AS instagram,
  '' AS facebook,     -- La app no tiene campo facebook
  COALESCE(sitio_web, '') AS web,
  '' AS tiktok,       -- La app no tiene campo tiktok

  -- Media (traducción de nombres)
  COALESCE(imagen_principal, '') AS foto_portada,
  COALESCE(imagenes, '{}') AS fotos,

  -- Rating (traducción de nombres)
  COALESCE(rating_promedio, 0) AS rating_avg,
  COALESCE(total_resenas, 0) AS rating_count,

  -- Otros campos
  '' AS pagina_url,
  verificado,
  updated_at

FROM public.negocios
WHERE activo = true;

-- Dar permiso de lectura anónima a la vista
GRANT SELECT ON public.negocios_directorio360 TO anon;
GRANT SELECT ON public.negocios_directorio360 TO authenticated;

-- ═══════════════════════════════════════════════════════════════════════════
-- NOTA: Si la vista da error por la columna "plan", asegúrate de haber
-- ejecutado primero la migración de planes:
--   ALTER TABLE public.negocios ADD COLUMN IF NOT EXISTS plan TEXT NOT NULL DEFAULT 'gratis';
-- ═══════════════════════════════════════════════════════════════════════════
