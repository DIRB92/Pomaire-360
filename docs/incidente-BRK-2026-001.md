# Registro de Brecha de Seguridad — BRK-2026-001

> **Uso interno.** Conforme al art. 14 quinquies de la Ley N° 21.719 y a la sección 6
> ("Registro interno de brechas") del Procedimiento de Notificación de Vulneraciones de Pomaire 360.
> **Borrador técnico** — la decisión de notificar a la Agencia y/o a los titulares debe validarse con asesoría legal.
> Los campos marcados `[...]` deben completarse/verificarse antes de darse por definitivo.

---

## Ficha del incidente

| Campo | Detalle |
|-------|---------|
| **Identificador** | BRK-2026-001 |
| **Severidad** | CRÍTICO — acceso no autorizado potencial a datos personales de contacto |
| **Estado actual** | CERRADO — vulnerabilidad corregida y verificada |
| **Fecha/hora de detección** | 18-09-2026, durante auditoría interna. `[Ajustar a hora exacta de conocimiento]` |
| **Origen de la detección** | Auditoría interna proactiva de políticas RLS de Supabase. Sin reporte externo. |
| **Sistema afectado** | Supabase — tabla `perfiles`, endpoint REST público `/rest/v1/perfiles` |

---

## 1. Naturaleza de la vulneración y circunstancias

La tabla `perfiles` tenía RLS habilitado, pero incluía una política de lectura
(`"Perfiles visibles para todos"`, `SELECT`) con condición `USING (true)` para el rol `public`.
Como la *anon key* de Supabase es pública por diseño y está embebida en el código del sitio,
esa política permitía que **cualquier persona sin autenticación** consultara el endpoint REST
y descargara el contenido completo de la tabla de perfiles.

No fue una intrusión ni un compromiso de credenciales, sino una **configuración de política de
acceso demasiado permisiva** (control de acceso / exposición de datos), detectada de forma proactiva.

## 2. Categorías de datos y de titulares afectados

- **Datos personales expuestos:** nombre completo, correo electrónico, URL de avatar, rol de la
  cuenta, UUID de usuario, fechas de creación/actualización.
- **NO expuestos:** contraseñas (gestionadas por Supabase Auth, fuera de esta tabla) ni datos
  sensibles (art. 2 Ley 21.719).
- **Titulares:** usuarios registrados de `app.pomaire360.cl` (comerciantes y administrador).
- **N° aproximado de afectados:** 17 titulares (total de perfiles registrados al momento de la detección).

## 3. Ventana de exposición

- **Inicio:** no se dispone de la fecha exacta de creación de la política permisiva. Como referencia, el
  perfil más antiguo se registró el **25-07-2026** (`min(created_at)`); si la política existió desde el
  diseño inicial de la tabla —lo más probable—, cada perfil estuvo expuesto desde su propia creación, por
  lo que la exposición del conjunto se remonta al **25-07-2026**.
- **Fin:** 18-09-2026, al eliminar la política.
- **Duración estimada:** ~8 semanas (25-07-2026 → 18-09-2026).
- **Evidencia de explotación:** no consta acceso de terceros. Por prudencia, asumir que los datos
  **pudieron** ser recolectados por bots/scrapers, dado que el endpoint era público.

## 4. Medidas de remediación y mitigación adoptadas

1. **Contención:** `DROP POLICY "Perfiles visibles para todos"` sobre `public.perfiles`.
2. **Políticas de lectura restrictivas:** usuario ve solo su perfil (`auth.uid() = id`); admins ven
   todo mediante función `SECURITY DEFINER` `es_admin()` (evita recursión de RLS).
3. **Cierre de escalada de privilegios:** `WITH CHECK (auth.uid() = id)` en el UPDATE y protección de
   la columna `rol` para impedir auto-asignarse admin.
4. **Verificación:** el endpoint REST devuelve `[]` a solicitantes no autenticados.
5. **Auditoría integral:** revisadas las 8 tablas del esquema (RLS habilitado y políticas correctas);
   corregidos además los controles de escritura de `resenas` (INSERT/UPDATE validan `autor_id`) y
   `reservas` (INSERT requiere login y `usuario_id = auth.uid()`).
6. **Endurecimiento web:** cabeceras HTTP reforzadas (CSP `frame-ancestors`, COOP/CORP, `form-action`;
   eliminado `X-Frame-Options: ALLOW-FROM` obsoleto) y saneamiento de URLs/imágenes de datos de usuario
   (prevención XSS). — PR de código correspondiente.

## 5. Medidas preventivas para evitar repetición

- Prohibir políticas RLS `USING (true)` en tablas con datos personales.
- Centralizar las comprobaciones de rol en `es_admin()`.
- Añadir revisión periódica de RLS + pruebas de caja negra (lectura/escritura anónima) al mantenimiento.
- Documentar la pauta de auditoría RLS en el repositorio.

## 6. Evaluación de riesgo y notificación

| Pregunta | Respuesta |
|----------|-----------|
| ¿Afecta datos personales? | Sí (contacto: nombre, email) |
| Notificación a la Agencia (72 h) | `[Pendiente validación legal]` — evaluar según riesgo; procedimiento Fase 3 |
| Notificación a titulares | `[Pendiente validación legal]` — procede si hay "riesgo alto"; datos de contacto, no sensibles |

## 7. Contacto del responsable

- **Responsable / DPD:** Diego Ignacio Rojas Barros
- **Correo de seguridad:** seguridad@pomaire360.cl

---

**Registrado por:** Diego Rojas B. · **Fecha de registro:** 18-09-2026
