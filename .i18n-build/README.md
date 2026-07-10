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

Este generador crea copias estáticas reales en inglés y portugués —con su
propio `<title>`, meta description, Open Graph, JSON-LD y contenido
HTML ya traducido— para que Google pueda indexarlas y posicionarlas en
búsquedas en esos idiomas. Francés, ruso, japonés y chino siguen funcionando
solo como el switcher dinámico original (no se generan páginas estáticas
para esos 4 idiomas por ahora).

## Cómo usarlo

Si se actualiza contenido en las páginas en español (`langs.js` o el HTML de
alguna página), hay que volver a correr el generador para que `/en/` y
`/pt/` queden sincronizados:

```bash
cd .i18n-build
npm install        # solo la primera vez
node generate.js         # regenera las 40 páginas en /en/ y /pt/
node patch-es.js         # solo si cambia la lista de páginas (agrega hreflang
                          # y convierte el selector de idioma a enlaces reales
                          # en páginas ES nuevas; es seguro re-ejecutarlo)
node generate-sitemap.js # regenera sitemap.xml con las 60 URLs (20 x 3 idiomas)
```

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

- **Estáticos (indexables):** es, en, pt.
- **Solo switcher dinámico (no indexables):** fr, ru, ja, zh — sin cambios,
  siguen funcionando exactamente igual que antes de este cambio.
