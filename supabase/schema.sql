-- ══════════════════════════════════════════════════════════════════════════
-- Pomaire 360 — Tabla de negocios para Supabase
-- Ejecutar en el SQL Editor de Supabase Dashboard
-- ══════════════════════════════════════════════════════════════════════════

-- Extensión para UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────────────────────────────────────
-- ENUM: categorías de negocio
-- ─────────────────────────────────────────────────────────────────────────
CREATE TYPE categoria_negocio AS ENUM (
  'gastronomia',
  'talleres',
  'demos',
  'artesanos',
  'alojamientos',
  'interes',
  'servicios',
  'jardin'
);

-- ─────────────────────────────────────────────────────────────────────────
-- ENUM: plan de monetización
-- ─────────────────────────────────────────────────────────────────────────
CREATE TYPE plan_negocio AS ENUM (
  'gratis',
  'destacado',
  'premium'
);

-- ─────────────────────────────────────────────────────────────────────────
-- TABLA PRINCIPAL: negocios
-- ─────────────────────────────────────────────────────────────────────────
CREATE TABLE negocios (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Datos básicos
  nombre        TEXT NOT NULL,
  slug          TEXT UNIQUE NOT NULL,
  direccion     TEXT NOT NULL,
  telefono      TEXT DEFAULT '',
  whatsapp      TEXT DEFAULT '',
  descripcion   TEXT DEFAULT '',

  -- Categoría y plan
  categoria     categoria_negocio NOT NULL,
  plan          plan_negocio NOT NULL DEFAULT 'gratis',
  tag           TEXT DEFAULT '',  -- etiqueta libre (ej: "Cerveza artesanal", "Lunes a domingo")

  -- Horarios
  horario       TEXT DEFAULT '',           -- texto libre: "Lunes a domingo · 10:00 a 18:00"
  horario_json  JSONB DEFAULT '[]'::jsonb, -- detallado: [{dia:"lunes", apertura:"10:00", cierre:"18:00"}]

  -- Ubicación
  latitud       DOUBLE PRECISION,
  longitud      DOUBLE PRECISION,
  google_maps   TEXT DEFAULT '',  -- URL directa a Google Maps

  -- Redes y enlaces
  instagram     TEXT DEFAULT '',
  facebook      TEXT DEFAULT '',
  web           TEXT DEFAULT '',
  tiktok        TEXT DEFAULT '',

  -- Media
  foto_portada  TEXT DEFAULT '',      -- URL de imagen principal
  fotos         TEXT[] DEFAULT '{}',  -- array de URLs de galería

  -- Rating (calculado desde reseñas en app.pomaire360.cl)
  rating_avg    NUMERIC(2,1) DEFAULT 0,
  rating_count  INT DEFAULT 0,

  -- SEO / página dedicada
  pagina_url    TEXT DEFAULT '',  -- ruta interna si tiene página propia (ej: /elchanchoalcanciamasgrandedelmundo/)

  -- Estado
  publicado     BOOLEAN NOT NULL DEFAULT true,
  verificado    BOOLEAN NOT NULL DEFAULT false,

  -- Owner (referencia al usuario comerciante en auth.users)
  owner_id      UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- ─────────────────────────────────────────────────────────────────────────
-- ÍNDICES
-- ─────────────────────────────────────────────────────────────────────────
CREATE INDEX idx_negocios_categoria ON negocios(categoria);
CREATE INDEX idx_negocios_plan ON negocios(plan);
CREATE INDEX idx_negocios_publicado ON negocios(publicado);
CREATE INDEX idx_negocios_slug ON negocios(slug);
CREATE INDEX idx_negocios_updated ON negocios(updated_at DESC);

-- ─────────────────────────────────────────────────────────────────────────
-- TRIGGER: actualizar updated_at automáticamente
-- ─────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_negocios_updated
  BEFORE UPDATE ON negocios
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─────────────────────────────────────────────────────────────────────────
-- RLS (Row Level Security) — lectura pública, escritura solo owner
-- ─────────────────────────────────────────────────────────────────────────
ALTER TABLE negocios ENABLE ROW LEVEL SECURITY;

-- Política de lectura: cualquier persona puede leer negocios publicados
CREATE POLICY "Lectura pública de negocios publicados"
  ON negocios FOR SELECT
  USING (publicado = true);

-- Política de escritura: solo el owner puede editar su negocio
CREATE POLICY "Owner puede editar su negocio"
  ON negocios FOR UPDATE
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- Política de inserción: usuarios autenticados pueden crear negocios
CREATE POLICY "Usuarios autenticados pueden crear negocios"
  ON negocios FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

-- ─────────────────────────────────────────────────────────────────────────
-- VISTA PÚBLICA (para el API REST anónimo de pomaire360.cl)
-- ─────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW negocios_publicos AS
SELECT
  id,
  nombre,
  slug,
  direccion,
  telefono,
  whatsapp,
  descripcion,
  categoria,
  plan,
  tag,
  horario,
  horario_json,
  latitud,
  longitud,
  google_maps,
  instagram,
  facebook,
  web,
  tiktok,
  foto_portada,
  fotos,
  rating_avg,
  rating_count,
  pagina_url,
  verificado,
  updated_at
FROM negocios
WHERE publicado = true;
