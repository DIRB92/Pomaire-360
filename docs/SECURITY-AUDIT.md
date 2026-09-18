# Auditoría de Seguridad — Pomaire 360

Guía viva de endurecimiento del sitio estático (`www.pomaire360.cl`, desplegado
en Cloudflare Pages) y su backend de datos en Supabase.

---

## 1. Cabeceras HTTP (`_headers`)

Cambios aplicados en esta rama:

| Cambio | Motivo |
|--------|--------|
| Eliminado `X-Frame-Options: ALLOW-FROM …` en `/mapa-turistico/picker/*` | `ALLOW-FROM` está **obsoleto** y ningún navegador moderno lo respeta. El control de framing de esa ruta ya lo hace `frame-ancestors` en la CSP. |
| Añadido `frame-ancestors 'self'` a la CSP de `/*` | Defensa en profundidad contra clickjacking, consistente con `X-Frame-Options: SAMEORIGIN`. |
| Añadido `form-action 'self'` a ambas CSP | Evita que un `<form>` inyectado exfiltre datos a un host externo. |
| Añadido `Cross-Origin-Opener-Policy: same-origin` en `/*` | Aísla el `window` de otras pestañas/popups (mitigación clase Spectre / tabnabbing). |
| Añadido `Cross-Origin-Resource-Policy: same-origin` en `/*` y `cross-origin` en el picker | Restringe qué orígenes pueden incrustar los recursos; el picker necesita `cross-origin` porque se embebe desde `app.pomaire360.cl`. |

### Pendiente / mejora futura (no incluida aquí)

- **`/mapa-turistico/picker/*` usa `script-src 'self' … 'unsafe-inline'`.**
  `'unsafe-inline'` anula buena parte del beneficio de la CSP en esa ruta. La
  mejora es extraer los scripts inline a archivos `.js` o calcular sus hashes
  `sha256-…` (como ya se hace en el resto del sitio) y quitar `'unsafe-inline'`.
- **`img-src … https:`** es amplio (permite imágenes de cualquier host HTTPS).
  Si el origen de las imágenes se limita a Supabase Storage + dominios propios,
  conviene acotarlo a esos hosts.

---

## 2. XSS en render de datos de usuario

Los negocios provienen de Supabase (contenido enviado por comerciantes) y se
renderizan con `innerHTML`. `escapeHTML()` neutraliza `<`, `>`, `&`, `"` pero
**no** bloquea esquemas peligrosos en atributos `href`/`src`
(p. ej. `href="javascript:…"`). Se añadieron saneadores de URL:

- **`sanitizeURL(url)`** — permite solo `http(s):`, `tel:`, `mailto:` o rutas
  relativas; cualquier otro esquema devuelve `''`. Aplicado a los `href` de
  sitio web, Facebook y Google Maps.
- **`sanitizeImageURL(url)`** — permite solo `http(s):`, rutas relativas o
  `data:image/*`. Aplicado a los `src` de imágenes/carruseles.

Archivos corregidos: `comercio/page-script.js`, `map-supabase.js`,
`featured-businesses.js`. (`app.js` ya usaba `sanitizeURL`; `dir-search.js` y
`directory-loader.js` solo construyen rutas internas con `slug` controlado.)

> **Regla para nuevo código:** todo `href`/`src` construido a partir de datos de
> Supabase debe pasar por `sanitizeURL` / `sanitizeImageURL` **antes** de
> `escapeHTML`. Ambos son complementarios, no sustitutos.

---

## 3. Supabase — la seguridad de datos depende de RLS

La `anon key` está incrustada en el cliente (`map-supabase.js`,
`comercio/page-script.js`, `dir-search.js`, `directory-loader.js`). **Esto es
correcto y esperado**: la anon key es pública por diseño. Pero implica que
**toda** la protección de datos recae en las políticas *Row Level Security*
(RLS) y en los privilegios de columna de la tabla `negocios_directorio360`.

Cualquiera con la anon key puede lanzar consultas arbitrarias al endpoint REST,
incluido `select=*`. Por eso hay que garantizar que:

1. RLS está **habilitado** en la tabla.
2. El rol `anon` solo puede **leer** (SELECT), nunca INSERT/UPDATE/DELETE.
3. Las columnas sensibles (emails de dueños, teléfonos privados, tokens,
   `user_id`, etc.) **no** son legibles por `anon`.

### 3.1 Verificar que RLS está habilitado

```sql
select relname            as tabla,
       relrowsecurity     as rls_habilitado,
       relforcerowsecurity as rls_forzado
from pg_class
where relname = 'negocios_directorio360';
-- Se espera rls_habilitado = true
```

### 3.2 Listar las políticas existentes

```sql
select policyname,
       cmd            as operacion,   -- SELECT / INSERT / UPDATE / DELETE / ALL
       roles,
       qual           as condicion_using,
       with_check     as condicion_with_check
from pg_policies
where tablename = 'negocios_directorio360'
order by cmd, policyname;
```

**Revisar:** que para el rol `anon`/`public` solo exista una política `SELECT`.
Si aparece alguna `INSERT`/`UPDATE`/`DELETE`/`ALL` para `anon`, es un hallazgo.

### 3.3 Ver qué columnas puede leer el rol `anon`

```sql
select grantee, privilege_type, column_name
from information_schema.column_privileges
where table_name = 'negocios_directorio360'
  and grantee in ('anon', 'authenticated', 'public')
order by grantee, column_name;
```

### 3.4 Prueba de caja negra (desde una terminal, sin sesión)

Sustituye `<ANON_KEY>`. Debe devolver **solo columnas públicas** y **fallar** en
escrituras.

```bash
BASE="https://uuskvqtbsvtfsovcjazf.supabase.co/rest/v1"
KEY="<ANON_KEY>"

# Lectura con select=* : inspeccionar que NO aparezcan columnas sensibles
curl -s "$BASE/negocios_directorio360?select=*&limit=1" \
  -H "apikey: $KEY" -H "Authorization: Bearer $KEY" | jq '.[0] | keys'

# Intento de escritura: DEBE devolver 401/403 o error de política RLS
curl -s -o /dev/null -w "%{http_code}\n" -X POST "$BASE/negocios_directorio360" \
  -H "apikey: $KEY" -H "Authorization: Bearer $KEY" \
  -H "Content-Type: application/json" \
  -d '{"nombre":"__pentest__"}'
# Esperado: 401 o 403 (nunca 201)
```

### 3.5 Plantilla de política de solo lectura pública

Si hiciera falta (re)crear la política de lectura pública mínima:

```sql
alter table public.negocios_directorio360 enable row level security;

-- Lectura pública (ajusta el filtro a tu columna real de publicación)
create policy "lectura_publica_negocios_activos"
on public.negocios_directorio360
for select
to anon
using ( activo is true );   -- o: verificado is true / estado = 'publicado'

-- Restringir columnas legibles por anon (revoca todo y concede solo públicas)
revoke select on public.negocios_directorio360 from anon;
grant  select (nombre, slug, categoria, descripcion, direccion, telefono,
               whatsapp, instagram, web, plan, latitud, longitud, verificado,
               foto_portada, fotos, horario, rating_avg, rating_count)
       on public.negocios_directorio360 to anon;
```

> Ajusta la lista de columnas a las que realmente son públicas en tu esquema.
> Las de escritura/gestión deben pasar por el rol `authenticated` con una
> política que compruebe la propiedad del registro (p. ej. `owner_id = auth.uid()`).

---

## 4. Checklist de repaso periódico

- [ ] `security.txt` — renovar `Expires` antes de su vencimiento.
- [ ] Rotar la anon key si alguna vez se filtró una `service_role` key.
- [ ] Confirmar que ninguna `service_role` key vive en el repo o en el cliente.
- [ ] Validar el token de Turnstile (`challenges.cloudflare.com`) **en el servidor**, no solo en el cliente.
- [ ] Re-ejecutar las pruebas de la sección 3.4 tras cambios de esquema.
