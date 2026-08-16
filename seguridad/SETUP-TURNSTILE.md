# ⚙️ Configurar Cloudflare Turnstile para /seguridad/

El formulario de reporte de vulnerabilidades usa **Cloudflare Turnstile** como CAPTCHA anti-spam.
Turnstile es gratuito, respeta la privacidad (no rastrea usuarios) y tiene menor fricción que reCAPTCHA.

---

## Pasos de configuración

### 1. Crear un widget en Cloudflare Dashboard

1. Ir a [Cloudflare Dashboard → Turnstile](https://dash.cloudflare.com/?to=/:account/turnstile)
2. Click **"Add Site"**
3. Configurar:
   - **Site name:** `Pomaire 360 — Seguridad`
   - **Domain:** `pomaire360.cl`
   - **Widget Mode:** `Managed` (recomendado — muestra el widget solo si es necesario)
   - **Pre-clearance:** `No`
4. Click **"Create"**
5. Copiar la **Site Key** generada (algo como `0x4AAAAAAAB...`)

### 2. Reemplazar la site key en el HTML

En `seguridad/index.html`, buscar:

```html
data-sitekey="YOUR_TURNSTILE_SITE_KEY"
```

Y reemplazar `YOUR_TURNSTILE_SITE_KEY` por la site key real. Ejemplo:

```html
data-sitekey="0x4AAAAAAABkMYinukE8nMYi"
```

### 3. (Opcional) Validación server-side

Si quieres validar el token de Turnstile en el servidor (recomendado para máxima seguridad):

```javascript
// En tu API o webhook que recibe el form:
const SECRET_KEY = process.env.TURNSTILE_SECRET_KEY;

async function validateTurnstile(token, ip) {
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${SECRET_KEY}&response=${token}&remoteip=${ip}`
  });
  const data = await res.json();
  return data.success === true;
}
```

> **Nota:** FormSubmit.co no valida tokens de Turnstile server-side.
> La validación client-side (el widget) es suficiente para bloquear bots automatizados.
> Si necesitas validación server-side, migra el formulario a un endpoint propio.

### 4. Testing

Para desarrollo local, Cloudflare proporciona keys de prueba:

| Key | Comportamiento |
|-----|----------------|
| `1x00000000000000000000AA` | Siempre pasa |
| `2x00000000000000000000AB` | Siempre falla |
| `3x00000000000000000000FF` | Fuerza challenge interactivo |

### 5. CSP (Content Security Policy)

Si tu CSP bloquea el script de Turnstile, agrega estos dominios:

```
script-src: https://challenges.cloudflare.com
frame-src: https://challenges.cloudflare.com
```

En tu archivo `_headers`:
```
Content-Security-Policy: ... script-src 'self' https://challenges.cloudflare.com ...; frame-src 'self' https://challenges.cloudflare.com;
```

---

## 💡 Por qué Turnstile y no reCAPTCHA

| Aspecto | Turnstile | reCAPTCHA v3 |
|---------|-----------|--------------|
| Costo | Gratis ilimitado | Gratis hasta 1M/mes |
| Privacidad | No rastrea | Usa cookies de Google |
| UX | Invisible o managed | Invisible |
| Dependencia | Cloudflare | Google |
| GDPR compliance | ✅ Mejor | ⚠️ Requiere consentimiento |
