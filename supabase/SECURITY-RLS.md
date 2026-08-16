# 🔒 Seguridad Supabase — Políticas RLS (Row Level Security)

> **Fecha:** Agosto 2026  
> **Prioridad:** Alta — Verificar que estas políticas estén activas en producción  
> **Contexto:** La `anon key` de Supabase está expuesta públicamente en el frontend (esto es normal y esperado), pero REQUIERE que RLS esté correctamente configurado para que un atacante no pueda escribir/eliminar datos directamente.

---

## ⚠️ Por qué es crítico

La `SUPABASE_ANON_KEY` está presente en:
- `directory-loader.js`
- `map-unified.js`, `map-home.js`, `map-supabase.js`
- `dir-search.js`
- `comercio/page-script.js`
- `mapa-turistico/mapa-turistico-v2.js`

**Cualquier persona puede usar esta key** para hacer peticiones REST directamente a tu proyecto Supabase. Sin RLS, podrían:
- ❌ Insertar negocios falsos
- ❌ Modificar datos de negocios existentes
- ❌ Eliminar registros
- ❌ Leer datos no publicados

---

## ✅ Políticas RLS requeridas

### Tabla: `negocios`

```sql
-- ═══════════════════════════════════════════════════════════════════════════
-- ACTIVAR RLS (si no está activado)
-- ═══════════════════════════════════════════════════════════════════════════
ALTER TABLE negocios ENABLE ROW LEVEL SECURITY;

-- ═══════════════════════════════════════════════════════════════════════════
-- POLÍTICA 1: Lectura pública (SELECT) — solo negocios publicados
-- ═══════════════════════════════════════════════════════════════════════════
-- Cualquier persona (anon o autenticada) puede leer negocios publicados.
-- Los no publicados son invisibles para el público.
CREATE POLICY "select_public_negocios"
  ON negocios FOR SELECT
  USING (publicado = true);

-- ═══════════════════════════════════════════════════════════════════════════
-- POLÍTICA 2: Inserción — solo usuarios autenticados como owner
-- ═══════════════════════════════════════════════════════════════════════════
-- Un usuario puede crear un negocio solo si se asigna como owner.
-- Esto previene que alguien cree negocios "en nombre" de otro.
CREATE POLICY "insert_own_negocio"
  ON negocios FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

-- ═══════════════════════════════════════════════════════════════════════════
-- POLÍTICA 3: Actualización — solo el owner de su propio negocio
-- ═══════════════════════════════════════════════════════════════════════════
-- Previene que un usuario edite negocios ajenos.
CREATE POLICY "update_own_negocio"
  ON negocios FOR UPDATE
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- ═══════════════════════════════════════════════════════════════════════════
-- POLÍTICA 4: Eliminación — NADIE puede eliminar desde el frontend
-- ═══════════════════════════════════════════════════════════════════════════
-- Los negocios no se eliminan, solo se despublican (publicado = false).
-- Eliminación solo posible desde Dashboard o con service_role key.
CREATE POLICY "no_delete_negocios"
  ON negocios FOR DELETE
  USING (false);
```

### Tabla: `negocios_directorio360` (vista)

Si `negocios_directorio360` es una **vista** (`CREATE VIEW`), hereda las políticas de la tabla subyacente. Verificar que:

```sql
-- Si es una vista, asegurar que es SECURITY INVOKER (por defecto)
-- y NO security definer (que saltaría RLS):
SELECT schemaname, viewname, definition
FROM pg_views
WHERE viewname = 'negocios_directorio360';
```

⚠️ **Si es una tabla independiente** (no vista), agregar las mismas políticas:

```sql
ALTER TABLE negocios_directorio360 ENABLE ROW LEVEL SECURITY;

-- Solo lectura pública
CREATE POLICY "select_directorio360"
  ON negocios_directorio360 FOR SELECT
  USING (true);  -- todos los registros son públicos en esta tabla

-- Bloquear toda escritura desde anon/autenticado
CREATE POLICY "no_insert_directorio360"
  ON negocios_directorio360 FOR INSERT
  WITH CHECK (false);

CREATE POLICY "no_update_directorio360"
  ON negocios_directorio360 FOR UPDATE
  USING (false);

CREATE POLICY "no_delete_directorio360"
  ON negocios_directorio360 FOR DELETE
  USING (false);
```

### Tabla: `perfiles`

```sql
ALTER TABLE perfiles ENABLE ROW LEVEL SECURITY;

-- Lectura: cada usuario solo puede leer su propio perfil
CREATE POLICY "select_own_perfil"
  ON perfiles FOR SELECT
  USING (auth.uid() = id);

-- Actualización: solo tu propio perfil
CREATE POLICY "update_own_perfil"
  ON perfiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admin puede leer todos (para el panel admin)
CREATE POLICY "admin_select_all_perfiles"
  ON perfiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM perfiles
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

-- Inserción: solo el sistema (trigger on_auth_user_created)
CREATE POLICY "system_insert_perfil"
  ON perfiles FOR INSERT
  WITH CHECK (auth.uid() = id);
```

### Tabla: `resenas` (reseñas)

```sql
ALTER TABLE resenas ENABLE ROW LEVEL SECURITY;

-- Lectura pública de todas las reseñas
CREATE POLICY "select_public_resenas"
  ON resenas FOR SELECT
  USING (true);

-- Inserción: solo usuarios autenticados
CREATE POLICY "insert_authenticated_resena"
  ON resenas FOR INSERT
  WITH CHECK (auth.uid() = autor_id);

-- Actualización: solo el autor puede editar su reseña
CREATE POLICY "update_own_resena"
  ON resenas FOR UPDATE
  USING (auth.uid() = autor_id);

-- Eliminación: nadie desde frontend (solo admin desde dashboard)
CREATE POLICY "no_delete_resenas"
  ON resenas FOR DELETE
  USING (false);
```

---

## 🔍 Cómo verificar que RLS está activo

Ejecutar en el **SQL Editor** de Supabase:

```sql
-- Ver estado de RLS para todas las tablas del proyecto
SELECT
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

**Resultado esperado:**
| tablename | rowsecurity |
|---|---|
| negocios | true |
| perfiles | true |
| resenas | true |
| talleres | true |
| reservas | true |

⚠️ Si alguna tabla tiene `rowsecurity = false`, ejecutar:
```sql
ALTER TABLE nombre_tabla ENABLE ROW LEVEL SECURITY;
```

---

## 🧪 Test manual de seguridad

Puedes verificar que un usuario anónimo NO puede escribir:

```bash
# Intentar INSERT con la anon key (debería fallar con 403)
curl -X POST \
  'https://uuskvqtbsvtfsovcjazf.supabase.co/rest/v1/negocios' \
  -H 'apikey: TU_ANON_KEY' \
  -H 'Authorization: Bearer TU_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"nombre":"TEST HACK","slug":"test-hack","direccion":"Test","categoria":"servicios"}'

# Respuesta esperada: 401 o error de policy violation
```

---

## 📋 Checklist de auditoría

- [ ] RLS activado en TODAS las tablas públicas
- [ ] Tabla `negocios`: SELECT solo publicados, INSERT/UPDATE solo owner
- [ ] Tabla `negocios_directorio360`: solo SELECT (si es tabla, no vista)
- [ ] Tabla `perfiles`: cada usuario solo lee/edita el suyo; admin lee todos
- [ ] Tabla `resenas`: SELECT público, INSERT autenticado, no DELETE
- [ ] Tabla `talleres`: SELECT público, INSERT/UPDATE solo owner del negocio
- [ ] Tabla `reservas`: INSERT autenticado, SELECT solo propias + owner del taller
- [ ] La `service_role` key NUNCA está en frontend (solo en `build-directory.js` vía env)
- [ ] Verificar que no existe política con `USING (true)` en INSERT/UPDATE/DELETE

---

## 🚨 Acción inmediata requerida

1. Ir a **Supabase Dashboard → Authentication → Policies**
2. Verificar que cada tabla tiene RLS habilitado (candado verde 🔒)
3. Si alguna tabla NO tiene políticas, aplicar las de este documento
4. Ejecutar el test manual para confirmar que INSERT anónimo falla
