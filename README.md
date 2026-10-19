# SONIQ One — Landing page académica

Landing page responsive desarrollada con HTML, CSS y JavaScript vanilla. La marca, los testimonios, el precio y las características son material demostrativo para una clase; no representan un producto comercial real.

## Archivos
- `index.html`: estructura con las 10 secciones de la rúbrica.
- `styles.css`: identidad visual premium y estilos responsive.
- `script.js`: menú móvil, cantidad/carrito de demostración, formularios, FAQ, feedback, banner de cookies y eventos de analítica.
- `README.md`: instrucciones y guía de integraciones.

## Cómo abrir
1. Descarga y descomprime el ZIP.
2. Abre `index.html` en un navegador moderno.
3. Para una prueba más completa, abre la carpeta en VS Code y utiliza una extensión de servidor local (por ejemplo, Live Server).

No se necesita instalar paquetes ni ejecutar un servidor backend para ver la página.

## Funciones incluidas
- Navegación por anclas y menú móvil.
- Cantidad y carrito demostrativo; no procesa pagos.
- Formulario de compra/interés con nombre, correo, celular opcional, motivo de contacto y consentimiento; además de newsletter. La validación es local y no envían datos fuera del navegador.
- FAQ desplegable.
- Ventana de feedback visual; no envía respuestas a Contentsquare.
- Banner de consentimiento demostrativo y preferencias guardadas en `localStorage`.
- Eventos enviados a `window.dataLayer` como andamiaje para GTM.

## Eventos disponibles
Los nombres implementados o previstos en el código:
- `cta_click`
- `view_item`
- `add_to_cart`
- `begin_checkout`
- `generate_lead`
- `faq_open`
- `newsletter_signup_demo`
- `feedback_submit_demo`
- `consent_preferences_updated`

Para la rúbrica de cinco eventos, valida con el docente qué eventos deben usarse. Los eventos estándar de ecommerce (`view_item`, `add_to_cart`, `begin_checkout`, `purchase`) deben corresponder a acciones reales. En esta versión no hay pagos, por lo que **no se dispara `purchase`**. No simules una venta confirmada.

## Conectar Google Tag Manager (GTM) y GA4
1. Crea un contenedor web en Google Tag Manager y una propiedad GA4.
2. Inserta el snippet oficial del contenedor GTM en el `<head>` y el bloque `noscript` después de abrir `<body>` usando el código que GTM proporciona para tu ID real.
3. Configura la etiqueta de Google/GA4 con el ID `G-XXXXXXXXXX` de tu propiedad.
4. Crea etiquetas de evento GA4 para los eventos del `dataLayer` que vayas a entregar. Usa activadores de evento personalizado con los nombres exactos.
5. Para los parámetros de ecommerce, configura los campos y datos del producto según la documentación de GA4.
6. Prueba cada acción en el modo Preview de GTM y en DebugView de GA4. Publica solo después de comprobar los resultados.
7. Evita instalar el mismo ID de GA4 por dos vías distintas, para no duplicar datos.

**Importante:** en este prototipo, los formularios son locales. Para medir una captación exitosa en producción, envía `generate_lead` únicamente después de que HubSpot confirme el registro. El evento `purchase` solo debe enviarse tras confirmar una transacción real, idealmente con un `transaction_id` único.

## Conectar HubSpot CRM
1. Crea el formulario en HubSpot y define los campos necesarios (nombre, correo y, si aplica, interés por producto).
2. Usa el código de inserción oficial del formulario de HubSpot o su integración documentada.
3. Reemplaza el formulario local `#orderForm` por el formulario integrado o conecta un backend seguro. No pongas tokens privados de HubSpot en JavaScript del navegador.
4. Prueba que un contacto de prueba aparezca en el CRM.
5. Configura el evento `generate_lead` para que ocurra después de una confirmación real del formulario.
6. Separa el consentimiento para gestionar una solicitud del consentimiento opcional para comunicaciones comerciales.

## Conectar Contentsquare
1. Accede a la cuenta de Contentsquare y crea una encuesta/widget de feedback.
2. Instala el snippet oficial siguiendo la documentación de la cuenta y los requisitos de consentimiento.
3. Configura la audiencia o activación (por ejemplo, tras interactuar con el producto, no inmediatamente al entrar).
4. Prueba la visualización y confirma que las respuestas aparezcan en la herramienta.
5. El botón y el modal de feedback incluidos aquí son solo una maqueta visual; no sustituyen la encuesta real.

## Consentimiento de cookies
El banner incluido es una demostración funcional de interfaz y guarda la elección en `localStorage`, pero **no es por sí solo una plataforma certificada de consentimiento** y no bloquea automáticamente todos los scripts externos. Para una entrega real:
1. Selecciona una CMP compatible con las etiquetas y necesidades de la web.
2. Clasifica cookies necesarias, analíticas y publicitarias.
3. Configura la CMP para comunicar el estado de consentimiento a GTM/Google Consent Mode.
4. Asegura que Contentsquare y cualquier etiqueta no esencial se carguen de acuerdo con la preferencia y normativa aplicable.
5. Prueba aceptar, rechazar, volver a abrir preferencias y retirar consentimiento.
6. Añade política de privacidad y cookies reales antes de publicar.

## Pruebas para la entrega
- [ ] Revisar en escritorio y móvil.
- [ ] Probar todos los enlaces de navegación.
- [ ] Añadir y quitar cantidad; verificar el total demostrativo.
- [ ] Probar validación del formulario con correo válido y consentimiento marcado.
- [ ] Abrir y cerrar FAQ y encuesta.
- [ ] Probar aceptar/rechazar cookies y reabrir preferencias.
- [ ] Validar eventos en GTM Preview y GA4 DebugView una vez conectados.
- [ ] Verificar HubSpot y Contentsquare en sus paneles.
- [ ] Capturar evidencias de cada integración para la presentación.

## Antes de entregar
Sustituye los placeholders por IDs de las cuentas de clase, verifica las integraciones en tiempo real y elimina cualquier afirmación de funcionalidad que no hayas probado. No uses datos personales reales en las pruebas.


## Guía de conexión real
Consulta `INTEGRACIONES.md` para crear desde cero HubSpot, Google Tag Manager y GA4, copiar los IDs reales, configurar las etiquetas y validar cada conexión. Ninguna integración externa queda activa hasta completar y probar esos pasos.
