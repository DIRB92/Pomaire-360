# 📱 Mensajes de WhatsApp — Pomaire 360

Plantillas para invitar a los negocios y artesanos a **reclamar e inscribir su ficha**
en Pomaire 360, la guía digital de Pomaire para los turistas.

> Estas plantillas son la referencia editorial. Los mensajes **reales y personalizados
> por negocio** los genera automáticamente `generate-fichas.js` dentro de cada link
> `wa.me` de `fichas-contacto.html`. Si cambias el texto aquí, refléjalo también en
> la función `getMessage()` de `generate-fichas.js`.

---

## 🧭 Propósito del sitio (incluido en todos los mensajes)

> Pomaire 360 es la **guía digital de Pomaire para los turistas**: la página donde los
> visitantes descubren qué hacer, dónde comer, dónde comprar greda y qué lugares
> visitar. El objetivo es que quien busque *"qué hacer en Pomaire"* encuentre todo en
> un solo lugar — y que ese lugar impulse a los negocios y artesanos locales.

---

## 🏺 ARTESANOS / TALLERES DE GREDA / DEMOSTRACIONES

```
¡Hola {NOMBRE}! 👋

Te escribimos del equipo de *Pomaire 360* (pomaire360.cl), la *guía digital de Pomaire para los turistas*: la página donde los visitantes descubren qué hacer, dónde comer, dónde comprar greda y qué lugares visitar en el pueblo. 🏺

Tu taller/tienda ya aparece en nuestro directorio y queremos que *reclames tu ficha* para destacar tu trabajo y, si quieres, *contar tu historia como artesano/a* de Pomaire 🏺✨

Inscribirte es *gratis* e incluye:

✅ Tu ficha destacada con fotos de tu trabajo
✅ Tu historia como artesano/a (opcional)
✅ Link directo a tu WhatsApp para que los turistas te contacten
✅ Aparecer en Google al buscar "artesanos en Pomaire"
✅ Reseñas y valoraciones en app.pomaire360.cl

Nuestro propósito es simple: que cuando alguien busque "qué hacer en Pomaire", encuentre TODO en un solo lugar — y que ese lugar impulse a los negocios y artesanos locales.

👉 *Reclama e inscribe tu negocio gratis* respondiéndome este mensaje. ¡Solo toma unos minutos! 🙌

Saludos,
Equipo Pomaire 360
🌐 pomaire360.cl
📱 app.pomaire360.cl
```

---

## 🍽️ RESTAURANTES

```
¡Hola {NOMBRE}! 👋

Te escribimos del equipo de *Pomaire 360* (pomaire360.cl), la *guía digital de Pomaire para los turistas*: la página donde los visitantes descubren qué hacer, dónde comer, dónde comprar greda y qué lugares visitar en el pueblo. 🏺

Tu restaurante ya aparece en nuestro directorio y queremos que *reclames tu ficha* para destacarlo entre los miles de turistas que visitan Pomaire cada mes 🍽️

Inscribirte es *gratis* e incluye:

✅ Ficha destacada con fotos de tus platos y local
✅ Menú o especialidades visibles para los turistas
✅ Link directo a tu WhatsApp para reservas
✅ Horarios y días de atención actualizados
✅ Reseñas y valoraciones en app.pomaire360.cl
✅ Aparecer en Google al buscar "dónde comer en Pomaire"

Nuestro propósito es simple: que cuando alguien busque "qué hacer en Pomaire", encuentre TODO en un solo lugar — y que ese lugar impulse a los negocios y artesanos locales.

👉 *Reclama e inscribe tu negocio gratis* respondiéndome este mensaje. ¡Solo toma unos minutos! 🙌

Saludos,
Equipo Pomaire 360
🌐 pomaire360.cl
📱 app.pomaire360.cl
```

---

## 🛏️ ALOJAMIENTOS

```
¡Hola {NOMBRE}! 👋

Te escribimos del equipo de *Pomaire 360* (pomaire360.cl), la *guía digital de Pomaire para los turistas*: la página donde los visitantes descubren qué hacer, dónde comer, dónde comprar greda y qué lugares visitar en el pueblo. 🏺

Tu alojamiento ya figura en nuestro directorio y queremos que *reclames tu ficha* para que los turistas que buscan dónde quedarse en Pomaire te encuentren primero 🛏️

Inscribirte es *gratis* e incluye:

✅ Ficha destacada con fotos de tus cabañas/habitaciones
✅ Link directo a tu WhatsApp para reservas
✅ Servicios, precios y disponibilidad visibles
✅ Reseñas y valoraciones en app.pomaire360.cl
✅ Aparecer en Google al buscar "dónde alojar en Pomaire"

Nuestro propósito es simple: que cuando alguien busque "qué hacer en Pomaire", encuentre TODO en un solo lugar — y que ese lugar impulse a los negocios y artesanos locales.

👉 *Reclama e inscribe tu negocio gratis* respondiéndome este mensaje. ¡Solo toma unos minutos! 🙌

Saludos,
Equipo Pomaire 360
🌐 pomaire360.cl
📱 app.pomaire360.cl
```

---

## 🌱 VIVEROS, 📍 PUNTOS DE INTERÉS Y 🛎️ SERVICIOS

```
¡Hola {NOMBRE}! 👋

Te escribimos del equipo de *Pomaire 360* (pomaire360.cl), la *guía digital de Pomaire para los turistas*: la página donde los visitantes descubren qué hacer, dónde comer, dónde comprar greda y qué lugares visitar en el pueblo. 🏺

Ya apareces en nuestro directorio y queremos que *reclames e inscribas tu ficha* para llegar a más visitantes y vecinos 📍

Es *gratis* e incluye:

✅ Ficha con fotos y descripción de lo que ofreces
✅ Link directo a tu WhatsApp
✅ Ubicación en el mapa de la guía
✅ Aparecer en las búsquedas de Google sobre Pomaire
✅ Reseñas de clientes en app.pomaire360.cl

Nuestro propósito es simple: que cuando alguien busque "qué hacer en Pomaire", encuentre TODO en un solo lugar — y que ese lugar impulse a los negocios y artesanos locales.

👉 *Reclama e inscribe tu negocio gratis* respondiéndome este mensaje. ¡Solo toma unos minutos! 🙌

Saludos,
Equipo Pomaire 360
🌐 pomaire360.cl
📱 app.pomaire360.cl
```

---

## ⚙️ Cómo generar y enviar (flujo seguro, sin riesgo de baneo)

```bash
cd contactos
node extract-contacts.js   # 1. Lee el DIRECTORY de app.js -> contactos.json
node generate-csv.js       # 2. Exporta contactos-pomaire360.csv (para Excel)
node generate-fichas.js    # 3. Genera fichas-contacto.html (botones WhatsApp)
```

Luego abre **`fichas-contacto.html`** en el navegador y, para cada negocio, haz clic
en **💬 Enviar WhatsApp**: se abre el chat con el mensaje ya escrito y solo presionas
enviar. Marca cada uno como *Contactado* / *Saltado* (el avance se guarda en el
navegador).

---

## 📝 NOTAS DE USO Y BUENAS PRÁCTICAS

1. **Reemplaza `{NOMBRE}`** por el nombre real (las fichas HTML ya lo hacen solas).
2. Este flujo es **semi-manual a propósito**: cada mensaje lo envías tú desde tu
   WhatsApp. Es la vía **segura y legal** — NO usa bots ni envío automático masivo.
3. **Evita el baneo:** WhatsApp bloquea el envío masivo no solicitado. Envía en
   tandas pequeñas (recomendado **máx. 20–30 por día**) y desde WhatsApp Business.
4. **Cumplimiento (Chile, Ley 21.719 / Ley 19.496):** se contacta solo a negocios ya
   listados públicamente, con un fin informativo y ofreciendo un servicio gratuito.
   Respeta de inmediato a quien pida no ser contactado (no reenviar).
5. Para envío masivo real y automatizado, la vía correcta es la **WhatsApp Business
   API oficial** (Meta / Twilio / 360dialog) con plantillas aprobadas — tiene costo
   por conversación pero no arriesga tu número.
