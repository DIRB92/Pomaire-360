-- ═══════════════════════════════════════════════════════════════════════════
-- Vista de compatibilidad: negocios_directorio360 (v2 — Categorías Unificadas)
-- Expone los negocios de Supabase con el formato que espera
-- directory-loader.js de pomaire360.cl
--
-- AHORA: Mapeo 1:1 directo (mismas categorías en ambos sistemas)
--
-- INSTRUCCIONES:
-- 1. Abre Supabase Dashboard → SQL Editor
-- 2. Pega este SQL completo
-- 3. Haz clic en "Run"
-- ═══════════════════════════════════════════════════════════════════════════

-- Primero eliminamos la vista anterior si existe
DROP VIEW IF EXISTS public.negocios_directorio360;

-- Crear la vista — ahora con mapeo 1:1 (las categorías son las mismas)
CREATE OR REPLACE VIEW public.negocios_directorio360 AS
SELECT
  id,
  nombre,
  slug,
  direccion,
  telefono,
  whatsapp,
  descripcion,

  -- Mapeo directo 1:1 — las categorías ya son las mismas en ambos sistemas
  categoria::text AS categoria,

  -- Plan
  COALESCE(plan, 'gratis') AS plan,

  -- Tag descriptivo basado en categoría
  CASE categoria::text
    WHEN 'alfareria'        THEN 'Alfarería'
    WHEN 'talleres'         THEN 'Taller'
    WHEN 'restaurantes'     THEN 'Restaurante'
    WHEN 'alojamiento'      THEN 'Alojamiento'
    WHEN 'comercio'         THEN 'Comercio'
    WHEN 'servicios'        THEN 'Servicios'
    WHEN 'estacionamientos' THEN 'Estacionamiento'
    WHEN 'salud'            THEN 'Salud'
    WHEN 'seguridad'        THEN 'Seguridad'
    WHEN 'banos'            THEN 'Baños'
    WHEN 'transporte'       THEN 'Transporte'
    WHEN 'turismo'          THEN 'Turismo'
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
  '' AS google_maps,

  -- Redes sociales
  COALESCE(instagram, '') AS instagram,
  '' AS facebook,
  COALESCE(sitio_web, '') AS web,
  '' AS tiktok,

  -- Media
  COALESCE(imagen_principal, '') AS foto_portada,
  COALESCE(imagenes, '{}') AS fotos,

  -- Rating
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
-- NOTA: Esta vista v2 usa mapeo 1:1 porque ambos sistemas (app y sitio
-- estático) ahora comparten las mismas 12 categorías estándar.
-- Ya no se necesita traducir entre sistemas.
-- ═══════════════════════════════════════════════════════════════════════════
