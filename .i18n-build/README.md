# Generador i18n de Pomaire 360

Este directorio contiene las herramientas usadas para generar las páginas
estáticas en inglés (`/en/`) y portugués (`/pt/`) del sitio, a partir de las
páginas fuente en español.

## Por qué existe esto

El sitio ya tenía un selector de idioma con 7 idiomas (es/en/pt/fr/ru/ja/zh)
que traduce el texto visible vía JavaScript (`subi18n.js` + `langs.js`), pero
**ninguna de esas variantes tenía una URL real indexable por buscadores**: el
`<title>`, la meta description y el HTML servido por el servidor eran siempre
los mismos (en español), sin importar el idioma elegido.

Este generador crea copias estáticas reales en inglés, portugués y japonés
—con su propio `<title>`, meta description, Open Graph, JSON-LD y contenido
HTML ya traducido— para que Google pueda indexarlas y posicionarlas en
búsquedas en esos idiomas. Francés, ruso y chino siguen funcionando solo como
el switcher dinámico original (no se generan páginas estáticas para esos 3
idiomas por ahora).

## Cómo usarlo

Si se actualiza contenido en las páginas en español (`langs.js` o el HTML de
alguna página), hay que volver a correr el generador para que `/en/` y
`/pt/` queden sincronizados:

```bash
cd .i18n-build
npm install        # solo la primera vez (instala cheerio; ver nota abajo)
node generate.js         # regenera las 45 páginas en /en/, /pt/ y /ja/
node patch-es.js         # solo si cambia la lista de páginas (agrega hreflang
                          # es/en/pt/ja y convierte el selector de idioma a
                          # enlaces reales en páginas ES; es seguro re-ejecutarlo)
node generate-sitemap.js # regenera sitemap.xml con las 60 URLs (15 x 4 idiomas)
```

### Nota sobre cheerio / entornos sin acceso a npm

`generate.js` usa `cheerio` para parsear y reescribir el HTML. Si `cheerio`
está instalado (entorno normal con `npm install`), se usa tal cual. Si no está
disponible (por ejemplo, un sandbox sin acceso al registro npm), el generador
cae automáticamente a `mini-cheerio.js`, un reemplazo mínimo y sin dependencias
incluido en este directorio que implementa solo la parte de la API de cheerio
que el generador necesita. Para producción se recomienda instalar cheerio real.

## Archivos

- `page-map.js` — mapa de slugs a rutas de archivo y URLs por idioma.
- `langs-loader.js` — carga `langs.js` y los overrides inline de
  `apoyar/`, `locomocion/` y `sugerencias/` en un diccionario fusionado.
- `head-utils.js` — helpers para hreflang y metadata del `<head>`.
- `generate.js` — generador principal: produce las 40 páginas en `/en/` y `/pt/`.
- `patch-es.js` — aplica hreflang + selector de idioma real a las páginas ES.
- `generate-sitemap.js` — regenera `sitemap.xml` con las 60 URLs.
- `*_i18n.json` — diccionarios de traducción para contenido que no usa
  `data-t` (metadata SEO, páginas `anunciate/`, `links/`, `juegos/`, JSON-LD
  de negocio, FAQ del home, alt/aria-label del home).

## Idiomas y cobertura

- **Estáticos (indexables):** es, en, pt, ja.
- **Solo switcher dinámico (no indexables):** fr, ru, zh — sin cambios,
  siguen funcionando exactamente igual que antes de este cambio.

## Archivos de traducción adicionales

- `visible_static_i18n.json` — textos visibles que no usan `data-t` y son
  comunes a varias páginas: enlace "saltar al contenido", última miga visible
  del breadcrumb y el botón CTA "Ver todos…" del directorio.
- `mini-cheerio.js` — reemplazo mínimo de cheerio para entornos sin npm.

## Nota sobre `langs.js`

Varias claves `data-t` usadas en el HTML (secciones de El Chancho, sugerencias,
apoyar, destacados del home, etc.) se reincorporaron a `langs.js` en el bloque
`SUPPLEMENTAL_I18N` (es/en/pt/ja). Esto es necesario para que tanto el switcher
dinámico como el generador estático traduzcan esas secciones en los cuatro
idiomas.
