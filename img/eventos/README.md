# 📸 Imágenes de eventos — Pomaire 360

Sube aquí las imágenes que se muestran en el **banner de eventos del inicio** y en las **páginas de noticia** de cada evento (`/evento/...`).

## Cómo agregar la imagen de un evento

1. Sube el archivo a esta carpeta: `/img/eventos/`
2. Usa el **mismo nombre** que espera la página del evento.

### Evento: Concurso de la Mejor Empanada de Pomaire

- **Imagen principal:** `mejor-empanada-de-pomaire.webp` (afiche oficial, 1200×630, ~212 KB) — optimizada, se usa en la portada, redes sociales y datos estructurados.
- **Fallback:** `mejor-empanada-de-pomaire.png` (misma imagen, para navegadores sin soporte WebP y como og:image secundario).
- Para reemplazar el afiche en el futuro, sube el nuevo archivo con el mismo nombre (idealmente WebP < 300 KB).
- **Se usa en:**
  - Imagen de portada (hero) de `/evento/mejor-empanada-de-pomaire/` (y sus versiones `/en/`, `/pt/`, `/ja/`)
  - Imagen para compartir en redes (Open Graph / Twitter Card)
  - Imagen del dato estructurado `Event` (JSON-LD, aparece en Google)

## Recomendaciones de imagen

| Uso | Medida recomendada | Formato |
|-----|--------------------|---------|
| Portada / redes sociales | **1200 × 630 px** (horizontal) | `.jpg` (o `.webp`) |
| Peso | menos de ~300 KB | optimizada para web |

- Formato horizontal (apaisado). Evita imágenes verticales para la portada.
- Que el motivo principal (la empanada, la gente, el horno) esté centrado, porque en el banner la imagen se recorta.
- Si tienes fotos oficiales del concurso, reemplaza las imágenes de referencia de la galería (que hoy usan `/img/gallery/`).

## Añadir un evento nuevo en el futuro

Para otro evento, sube su imagen aquí (por ejemplo `feria-navidena.jpg`) y en la página del evento apunta a `/img/eventos/feria-navidena.jpg`.
