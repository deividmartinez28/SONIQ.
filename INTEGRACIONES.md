# Guía de conexión real — SONIQ One

Esta guía parte de que todavía no existen cuentas de HubSpot, GTM ni GA4. No se han inventado IDs y ninguna integración se considera conectada hasta verificarla.

## 0. Antes de empezar
- Usa una cuenta Google para GTM y GA4.
- Para una prueba local puedes abrir `index.html`, pero para probar herramientas externas de forma fiable publica el sitio en una URL de prueba HTTPS (por ejemplo, un hosting estático). GTM Preview suele funcionar mejor con una URL accesible.
- Nunca compartas contraseñas, códigos de acceso ni tokens privados.
- Mantén el formulario como demo hasta que la política de privacidad y el tratamiento de datos estén listos.

## 1. Crear HubSpot y su formulario
1. Abre https://www.hubspot.com/products/crm y crea una cuenta gratuita si la disponibilidad de tu región/plan lo permite.
2. En HubSpot, abre **Marketing > Formularios** (el nombre del menú puede variar según la versión).
3. Crea un formulario de contacto con estos campos: nombre, correo, celular opcional y motivo de interés.
4. Añade un aviso de privacidad y, si vas a enviar publicidad, una casilla separada para comunicaciones comerciales.
5. Publica/guarda el formulario y abre la opción **Compartir / Insertar** para copiar el código de inserción que HubSpot genere para ese formulario.
6. Guarda una copia del código de inserción localmente. No lo inventes ni sustituyas por un token supuesto.
7. En `index.html`, reemplaza el formulario local `<form class="lead-form" id="orderForm"> ... </form>` por el snippet oficial de HubSpot. Asegúrate de no borrar por accidente los contenedores y scripts que necesita la página.
8. En `script.js`, el listener actual de `#orderForm` es para la versión local de demostración. Si usas el formulario embebido, elimina/desactiva ese listener y usa el callback/evento de envío exitoso documentado por HubSpot para disparar `generate_lead` una sola vez.
9. Haz un envío de prueba con datos ficticios y confirma que el contacto aparece en el CRM.

Referencia oficial: https://knowledge.hubspot.com/forms

## 2. Crear GTM
1. Abre https://tagmanager.google.com e inicia sesión.
2. Pulsa **Crear cuenta**.
3. Nombre de cuenta: `SONIQ One (proyecto académico)`.
4. País: Colombia. Nombre del contenedor: `SONIQ One` o la URL final del sitio.
5. Tipo de contenedor: **Web**. Acepta las condiciones.
6. GTM mostrará un ID real con formato `GTM-...` y dos fragmentos de instalación.
7. En `index.html`, pega el primer fragmento oficial lo más arriba posible dentro de `<head>`, y el fragmento `<noscript>` inmediatamente después de abrir `<body>`. No copies un ID de ejemplo de documentación.
8. En GTM, crea los activadores de **Evento personalizado** con los nombres exactos que vayas a usar: `cta_click`, `view_item`, `add_to_cart`, `begin_checkout`, `generate_lead`, `faq_open`.
9. El código de `script.js` ya coloca eventos en `window.dataLayer`. Eso no los envía por sí solo a GA4: debes crear etiquetas de evento GA4 en GTM para los eventos que quieras medir.
10. Usa **Vista previa** en GTM/Tag Assistant, conecta la URL de la página y confirma que el contenedor se carga. No publiques todavía si hay errores.

Referencia oficial para crear cuenta/contenedor: https://support.google.com/tagmanager/answer/14842164?hl=es
Instalación del contenedor: https://support.google.com/tagmanager/answer/14847097?hl=es

## 3. Crear GA4 y conectarlo por GTM
1. Abre https://analytics.google.com.
2. Pulsa **Empezar a medir** si es una cuenta nueva.
3. Crea la cuenta `SONIQ One` y una propiedad `SONIQ One - Web`.
4. En la configuración de la propiedad, crea un **flujo de datos Web**. Introduce la URL pública real del sitio; si aún no tienes URL, puedes crear el flujo y actualizarla después.
5. Copia el **ID de medición** real, que comienza por `G-`. Encuéntralo en Administrador > Recopilación y modificación de datos > Flujos de datos > tu flujo web.
6. Abre GTM > Etiquetas > Nueva > **Etiqueta de Google**. Pega el ID `G-...` real y usa el activador **Initialization - All Pages** (o la recomendación actual de la interfaz).
7. Crea etiquetas de evento GA4 para los eventos personalizados que decidiste medir. En la etiqueta, elige la etiqueta de Google/ID de destino y configura el nombre del evento.
8. Para los eventos de ecommerce, usa parámetros consistentes como `currency`, `value` e `items`. No envíes `purchase` hasta que exista un pago confirmado real; en este prototipo no hay pasarela de pago.
9. Prueba GTM Preview y GA4 > Administrador/Informes > DebugView. Puede haber un breve retraso en los informes normales.
10. Cuando todos los eventos estén probados, en GTM pulsa **Enviar > Publicar y crear versión** y documenta la versión.

Referencias oficiales:
- Crear/configurar GA4: https://support.google.com/analytics/answer/14183469?hl=es
- Encontrar el ID de medición: https://support.google.com/analytics/answer/12270356?hl=es-419
- Configurar GA4 con GTM: https://support.google.com/tagmanager/answer/9442095?hl=es-419

## 4. Eventos ya preparados en `script.js`
- `cta_click`: botones de llamada a la acción.
- `view_item`: cuando la ficha/área de compra es visible.
- `add_to_cart`: cuando se pulsa agregar al carrito.
- `begin_checkout`: al pulsar la bolsa con productos.
- `generate_lead`: formulario local validado. Al integrar HubSpot, debe dispararse únicamente tras el envío exitoso real.
- `faq_open`: al abrir una pregunta.
- `newsletter_signup_demo` y `feedback_submit_demo`: demostraciones locales, no registros externos.

Los eventos aparecen en `dataLayer`, pero no llegan a GA4 hasta crear las etiquetas y activadores correspondientes en GTM.

## 5. Consentimiento de cookies
El banner actual es una interfaz de demostración. Para publicar de verdad, integra una CMP que gestione consentimiento y bloquee las etiquetas no esenciales hasta tener la elección correspondiente. Configura Consent Mode y asegúrate de que las etiquetas de Google y cualquier herramienta de análisis respeten el estado de consentimiento. Probar aceptar, rechazar, cambiar preferencias y retirar consentimiento. La interfaz actual por sí sola no garantiza que los scripts estén bloqueados.

## 6. Lista de comprobación antes de entregar
- [ ] El ID real de GTM está instalado una sola vez.
- [ ] La etiqueta de Google usa el ID real `G-...`.
- [ ] Tag Assistant conecta y no reporta errores.
- [ ] Los eventos personalizados aparecen en la secuencia de GTM Preview.
- [ ] Los eventos llegan a GA4 DebugView.
- [ ] El formulario de HubSpot crea un contacto de prueba.
- [ ] `generate_lead` se dispara solo cuando HubSpot confirma un envío.
- [ ] No se envían nombres, correos, teléfonos ni otros datos personales a GA4.
- [ ] No se dispara `purchase` en la versión sin pagos.
- [ ] La CMP y el consentimiento se prueban antes de publicar.
