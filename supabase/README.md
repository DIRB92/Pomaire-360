# 🏺 Pomaire 360 — Integración con Supabase (pomaire-app)

## Arquitectura

`pomaire360.cl` consume la **misma base de datos** que `app.pomaire360.cl`.
No se crea una tabla nueva — se lee la tabla `negocios` existente.

```
┌──────────────────────────────────────────┐
│        app.pomaire360.cl                 │
│        (Panel de comerciantes)           │
│        Next.js + Supabase SSR            │
│                                          │
│  Comerciante → crea/edita ficha          │
│  INSERT/UPDATE en tabla "negocios"       │
└─────────────────┬────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│  Supabase (pomaire-app)                  │
│  https://uuskvqtbsvtfsovqjar7.supabase.co│
│                                          │
│  Tabla: negocios                         │
│  RLS: lectura pública (activo = true)    │
│  Vista: negocios_ranking (plan + rating) │
└─────────────────┬────────────────────────┘
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
┌───────────────┐   ┌───────────────────┐
│ Build-time    │   │ Client-side       │
│               │   │                   │
│ build-        │   │ directory-        │
│ directory.js  │   │ loader.js         │
│               │   │                   │
│ Genera        │   │ fetch() →         │
│ directory-    │   │ Supabase REST API │
│ data.json     │   │ (anon key)        │
│ (SEO)         │   │                   │
└───────────────┘   └───────────────────┘
        │                   │
        └─────────┬─────────┘
                  ▼
┌──────────────────────────────────────────┐
│          pomaire360.cl                   │
│   Muestra fichas enriquecidas:           │
│   foto, rating, verificado, plan badge   │
│   Link a ficha completa en la app        │
└──────────────────────────────────────────┘
```

## Tabla `negocios` (ya existente en pomaire-app)

| Columna | Tipo | Uso en pomaire360.cl |
|---------|------|----------------------|
| nombre | TEXT | Nombre mostrado |
| slug | TEXT | Link a app.pomaire360.cl/negocios/{slug} |
| categoria | ENUM | Agrupa en secciones (gastronomia, artesania, etc.) |
| descripcion | TEXT | Texto breve en tarjetas destacadas |
| direccion | TEXT | Dirección con icono 📍 |
| telefono | TEXT | Link tel: |
| whatsapp | TEXT | Link wa.me/ |
| instagram | TEXT | Link Instagram |
| sitio_web | TEXT | Link web |
| horarios | JSONB | Texto de horarios |
| latitud/longitud | FLOAT | Link a Google Maps |
| imagen_principal | TEXT | Cover en tarjetas premium/destacadas |
| imagenes | TEXT[] | Galería en modal |
| verificado | BOOLEAN | Badge ✓ verde |
| rating_promedio | NUMERIC | Estrellas ★ |
| total_resenas | INT | Contador "(N)" |
| plan | TEXT | gratis/destacado/premium → orden + badge |
| activo | BOOLEAN | RLS filtra: solo activos visibles |
| updated_at | TIMESTAMPTZ | "hace X días" en footer |

## Credenciales

### Frontend (directory-loader.js) — YA CONFIGURADO
- **URL**: `https://uuskvqtbsvtfsovqjar7.supabase.co`
- **Key**: anon public key (segura, protegida por RLS)

### Build-time (build-directory.js) — Variables de entorno
```bash
SUPABASE_URL=https://uuskvqtbsvtfsovqjar7.supabase.co
SUPABASE_SERVICE_KEY=<tu service_role key>  # O SUPABASE_ANON_KEY
```

## Cómo funciona

### 1. En producción (con build)

```bash
# En el build command de Cloudflare Pages:
node build-directory.js && <tu-build-actual>
```

Esto genera `directory-data.json` que se sirve estáticamente.
El browser carga ese JSON primero (rápido, SEO) y luego
actualiza con datos frescos de Supabase.

### 2. Sin build configurado (solo client-side)

El `directory-loader.js` hace fetch directo a Supabase desde
el browser del visitante. Funciona sin configuración adicional.
Si Supabase no responde, usa el DIRECTORY hardcoded de app.js.

### 3. Auto-rebuild al editar una ficha

Para que pomaire360.cl se actualice automáticamente:

**Cloudflare Pages:**
1. Settings → Builds → Deploy Hooks → crear hook
2. Supabase Dashboard → Database → Webhooks:
   - Table: `negocios`
   - Events: INSERT, UPDATE, DELETE
   - URL: el deploy hook de Cloudflare
   - Method: POST

## Mapeo de categorías

| Supabase (app) | Contenedor en pomaire360.cl |
|----------------|----------------------------|
| gastronomia | #restaurantDir |
| artesania | #artesanoDir |
| hospedaje | #alojamientoDir |
| turismo | #interesDir |
| comercio | #servicioDir |
| servicios | #servicioDir |
| otro | #interesDir |

## Fallback (resiliencia)

```
Supabase disponible?
  ├─ SÍ → Renderiza datos frescos de la API
  └─ NO → ¿Hay directory-data.json?
            ├─ SÍ → Usa JSON estático (último build)
            └─ NO → Usa DIRECTORY hardcoded de app.js
```

El sitio NUNCA se queda sin datos, incluso si Supabase
está caído o no se ha configurado el build.
