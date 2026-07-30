# 🏺 Pomaire 360 — Integración Supabase

## Arquitectura

```
┌──────────────────────────────┐
│   app.pomaire360.cl          │
│   (Panel de comerciantes)    │
│                              │
│   Comerciante edita ficha →  │
│   INSERT/UPDATE en tabla     │
│   "negocios" de Supabase     │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│   Supabase (PostgreSQL)      │
│                              │
│   Tabla: negocios            │
│   Vista: negocios_publicos   │
│   RLS: lectura pública       │
└──────────────┬───────────────┘
               │
       ┌───────┴────────┐
       ▼                ▼
┌─────────────┐  ┌──────────────┐
│ Build-time  │  │ Client-side  │
│             │  │              │
│ build-      │  │ directory-   │
│ directory   │  │ loader.js    │
│ .js         │  │              │
│             │  │ Fetch →      │
│ Genera      │  │ Supabase     │
│ directory-  │  │ REST API     │
│ data.json   │  │              │
└─────────────┘  └──────────────┘
```


## Configuración Paso a Paso

### 1. Crear la tabla en Supabase

1. Ve al [Dashboard de Supabase](https://supabase.com/dashboard)
2. Abre el **SQL Editor**
3. Ejecuta el contenido de `schema.sql`

### 2. Configurar credenciales en el frontend

Edita `directory-loader.js` y reemplaza:

```javascript
var SUPABASE_URL = 'https://TU_PROYECTO.supabase.co';
var SUPABASE_ANON_KEY = 'TU_ANON_KEY_PUBLICA';
```

Encuentra estos valores en:
- Supabase Dashboard → Settings → API → URL
- Supabase Dashboard → Settings → API → anon public key

### 3. Configurar el build script

Agrega estas variables de entorno en tu plataforma de deploy:

```bash
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_KEY=tu_service_role_key
```

### 4. Ejecutar el build

```bash
node build-directory.js
```

Esto genera `directory-data.json` que se incluye en el deploy.

### 5. Deploy hook (auto-rebuild)

Para que pomaire360.cl se actualice cuando un comerciante
edita su ficha en app.pomaire360.cl:

**Opción A: Cloudflare Pages**
1. Crea un Deploy Hook en Cloudflare Pages
2. En Supabase → Database → Webhooks, crea uno que
   dispare POST al deploy hook URL cuando haya INSERT/UPDATE
   en la tabla `negocios`

**Opción B: GitHub Actions**
Agrega el workflow `.github/workflows/build-directory.yml`
(ver ejemplo en este repo)


## Schema de la tabla `negocios`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | ID único autogenerado |
| `nombre` | TEXT | Nombre del negocio |
| `slug` | TEXT | URL-friendly identifier (único) |
| `direccion` | TEXT | Dirección física |
| `telefono` | TEXT | Teléfono principal |
| `whatsapp` | TEXT | Número WhatsApp (formato: 56XXXXXXXXX) |
| `descripcion` | TEXT | Descripción del negocio |
| `categoria` | ENUM | gastronomia, talleres, demos, artesanos, alojamientos, interes, servicios, jardin |
| `plan` | ENUM | gratis, destacado, premium |
| `tag` | TEXT | Etiqueta libre (ej: "Cerveza artesanal") |
| `horario` | TEXT | Horario en texto libre |
| `horario_json` | JSONB | Horario estructurado por día |
| `latitud` | FLOAT | Coordenada GPS |
| `longitud` | FLOAT | Coordenada GPS |
| `google_maps` | TEXT | URL directa a Google Maps |
| `instagram` | TEXT | Handle sin @ |
| `facebook` | TEXT | URL de Facebook |
| `web` | TEXT | URL del sitio web |
| `tiktok` | TEXT | URL de TikTok |
| `foto_portada` | TEXT | URL de imagen principal |
| `fotos` | TEXT[] | Array de URLs de galería |
| `rating_avg` | NUMERIC | Promedio de rating (0-5) |
| `rating_count` | INT | Cantidad de reseñas |
| `pagina_url` | TEXT | Ruta interna si tiene página |
| `publicado` | BOOLEAN | Visible al público |
| `verificado` | BOOLEAN | Negocio verificado |
| `owner_id` | UUID | FK a auth.users |

## Flujo de datos

1. **Comerciante** → Edita ficha en `app.pomaire360.cl`
2. **app.pomaire360.cl** → INSERT/UPDATE en tabla `negocios`
3. **Supabase** → Webhook dispara rebuild de pomaire360.cl
4. **Build** → `node build-directory.js` genera JSON estático
5. **Deploy** → Se sirve `directory-data.json` (SEO-friendly)
6. **Browser** → `directory-loader.js` carga JSON estático primero
7. **Browser** → Luego fetcha Supabase para datos en tiempo real
8. **Resultado** → Ficha visible en ambas web simultáneamente

## Seguridad (RLS)

- **Lectura**: Cualquier usuario anónimo puede leer negocios publicados
- **Escritura**: Solo el owner autenticado puede editar su negocio
- **Build**: Usa `service_role_key` (nunca exponerla en frontend)
- **Frontend**: Usa `anon_key` (segura para exponer, limitada por RLS)
