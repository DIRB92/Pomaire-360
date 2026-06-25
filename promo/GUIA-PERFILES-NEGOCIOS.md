# Guía — Perfiles de negocio (Destacado / Premium)

Esta guía explica cómo dar de alta un negocio pagado en Pomaire 360 y qué incluye cada plan.

> Gestión **manual** (Opción A): cuando un negocio paga, se marca su ficha con un plan y se "encienden" sus beneficios automáticamente.

---

## 1. Planes y beneficios

| Beneficio | 🆓 Gratis | ⭐ Destacado | 💎 Premium |
|---|:---:|:---:|:---:|
| Nombre, dirección y pin en el mapa | ✅ | ✅ | ✅ |
| 1 contacto (teléfono) | ✅ | ✅ | ✅ |
| Insignia dorada en directorio y mapa | — | ✅ | ✅ |
| Aparece **primero** en su categoría | — | ✅ | ✅ (antes que Destacado) |
| Marcador del mapa **resaltado** (más grande/dorado) | — | ✅ | ✅ |
| Todos los enlaces (web, Instagram, Facebook, WhatsApp) | — | ✅ | ✅ |
| Ficha ampliada con descripción y horario ("Ver perfil") | — | ✅ | ✅ |
| **Galería de fotos** en la ficha | — | — | ✅ |

---

## 2. Qué datos pedir al negocio

Para publicar un perfil pagado, junta estos datos:

- **Nombre** del negocio
- **Dirección** (calle y número)
- **Teléfono / WhatsApp**
- **Categoría** (restaurante, taller de greda, alojamiento, comercio, etc.)
- **Enlace de Google Maps** (ubicación exacta) + coordenadas si las tiene
- **Instagram / Facebook / sitio web** (si tiene)
- **Horario de atención**
- **Descripción corta** (2–3 frases)
- **Fotos** (solo Premium): 2 a 5 imágenes horizontales de buena calidad

---

## 3. Plantilla técnica (para publicar)

Cada negocio aparece en dos lugares del archivo `app.js`:

### a) En el **directorio** (objeto `DIRECTORY`)

```js
{
  n: 'Nombre del Negocio',
  a: 'Calle 123',
  p: '+56 9 1234 5678',
  ig: 'usuario_instagram',          // opcional
  web: 'https://sitio.cl/',         // opcional
  fb: 'https://facebook.com/pagina',// opcional
  map: 'https://maps.app.goo.gl/XXXX',
  tag: 'Restaurante',               // etiqueta corta

  // --- Campos del plan pagado ---
  plan: 'destacado',                // 'destacado' o 'premium'
  slug: 'nombre-del-negocio',       // identificador único, sin espacios
  hours: 'Lun a Dom · 10:00–19:00',
  desc: 'Descripción breve y atractiva del negocio.',
  photos: ['https://.../foto1.jpg', 'https://.../foto2.jpg'] // solo Premium
}
```

### b) En el **mapa** (lista `PLACES`)

Al marcador correspondiente se le agrega el mismo `plan`:

```js
{ id:'xx1', cat:'food', icon:'🍽️', lat:-33.65, lng:-71.15,
  name:'Nombre del Negocio', desc:'...', addr:'Calle 123, Pomaire',
  gmap:'https://maps.app.goo.gl/XXXX', ig:'usuario_instagram',
  plan:'destacado' }   // ← esto resalta el marcador
```

> En la práctica, envíame los datos del punto 2 y yo publico ambos lugares por ti.

---

## 4. Precios sugeridos (ajustables)

> Valores de **referencia** en pesos chilenos. Conviene partir bajo para conseguir los primeros clientes y subir cuando el sitio tenga más visitas demostrables.

| Plan | Mensual | Anual (2 meses gratis) |
|---|---|---|
| ⭐ Destacado | $4.990 | $49.900 |
| 💎 Premium | $9.990 | $99.900 |

**Recomendaciones:**
- Ofrece un **precio de lanzamiento** (ej. 50% el primer trimestre) para los primeros 5–10 negocios.
- El plan **anual** da ingresos más estables y menos gestión de cobros.
- Cobra con **link de Mercado Pago** (o Flow). Para cobro automático recurrente: Mercado Pago Suscripciones.
- Emite **boleta** por cada pago (SII).

---

## 5. Flujo de venta sugerido

1. Contactas al negocio y muestras cómo se ve un perfil Destacado/Premium en el sitio.
2. El negocio paga (link de pago).
3. Te envía sus datos (punto 2).
4. Se publica el perfil con su plan.
5. Renovación mensual/anual según el plan.
