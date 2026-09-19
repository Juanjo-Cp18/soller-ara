# Medición de visitas — v0.68

Cloudflare Web Analytics se incorpora a la web de GitHub Pages con el token público facilitado por el usuario. La integración y la política de privacidad están preparadas para publicar en v0.68. La recepción de estadísticas se debe confirmar en el panel privado de Cloudflare.

## Configuración prevista

- Dar de alta `soller-ara.github.io` en Web Analytics dentro de la cuenta del proyecto; no mover DNS ni contratar otro alojamiento.
- Obtener el token público del fragmento de instalación. No utilizar una clave API de Cloudflare.
- Portada, página de enlaces, páginas públicas informativas y noticias propias actuales y futuras.
- Excluir Administración y las pruebas en otros dominios. El cargador respeta Do Not Track y Global Privacy Control cuando el navegador los declara.
- Consultar visitas, páginas vistas, procedencia disponible y rutas consultadas en el panel de Cloudflare. Las visitas no equivalen a personas únicas.
- Los enlaces externos y los cambios de categoría dentro de la portada no son páginas propias adicionales; no se prometen estadísticas por noticia externa ni clics sin otra instrumentación.

## Preparación técnica

`scripts/configure_web_analytics.py` trabaja sobre una copia completa y actualizada del repositorio. Sin opciones muestra los archivos que cambiaría y no escribe nada. Con `--token TOKEN_PUBLICO --apply` prepara los cambios locales, pero nunca los sube ni publica. Se requiere un token real antes de aplicar. También incorpora el cargador a las plantillas de creación y edición de noticias.

Antes de publicar, actualizar `privacy.html` con el servicio activado, las métricas y la finalidad, y revisar la configuración aplicable. La descripción comercial de un servicio sin cookies no sustituye esta revisión.

Después de publicar, comprobar la carga del beacon en una página pública, su ausencia en Administración y pruebas locales, y la recepción real de datos en el panel. Los bloqueadores pueden reducir el recuento. No existen datos retroactivos anteriores a la activación.

## Referencias oficiales consultadas

- Instalación para sitios externos: https://developers.cloudflare.com/web-analytics/get-started/
- Características del servicio: https://developers.cloudflare.com/web-analytics/about/
- Definición de visitas y páginas vistas: https://developers.cloudflare.com/web-analytics/data-metrics/high-level-metrics/
- Recogida de datos y dirección del beacon: https://developers.cloudflare.com/web-analytics/data-metrics/data-origin-and-collection/



## Consulta privada desde Administración (v0.69)

Estado: interfaz implementada y consulta preparada, **pendiente de configuración y validación con la cuenta real**. Publicar GitHub Pages no despliega por sí solo el Worker.

1. En Cloudflare, crear un token de API personalizado con permiso **Account → Account Analytics → Read**, limitado a la cuenta que contiene Web Analytics de Sóller Ara. No hacen falta permisos de edición ni la Global API Key.
2. En **Workers & Pages → soller-ara-admin → Settings → Variables and Secrets**, guardar:
   - `CF_ANALYTICS_API_TOKEN`: tipo **Secret**, con el token de lectura. No pegarlo en el chat, archivos del repositorio ni código del navegador.
   - `CF_ANALYTICS_ACCOUNT_ID`: ID de esa cuenta (32 caracteres hexadecimales). Es diferente del token público del beacon.
3. Actualizar el Worker con el archivo completo `worker/admin-worker.js` y desplegar. Conservar los secrets existentes de Administración/GitHub. Si se usa Wrangler, ejecutar `npx wrangler deploy` desde `worker/` con una sesión de despliegue autorizada; el token de lectura de estadísticas no permite desplegar.
4. Entrar en Administración → Visitas → Actualizar. Si aparece que falta activar el servidor, sigue desplegada una versión anterior del Worker. Si aparece pendiente de conectar, faltan las variables de este apartado.
5. Contrastar visitas y páginas vistas con Cloudflare en el mismo periodo y para el hostname `soller-ara.github.io`, rutas `/soller-ara/` (excluyendo Administración). La primera consulta real también debe confirmar la disponibilidad del conjunto GraphQL `rumPageloadEventsAdaptiveGroups` y sus filtros para esta cuenta. Los errores de API se muestran sin divulgar la respuesta del proveedor.

Detalles: GET `/api/analytics?period=24h|7d` requiere sesión válida; caché privada en memoria de hasta cinco minutos, respuestas HTTP `no-store`; no se escriben conteos en el repositorio público. Son ventanas móviles, no días naturales. Se muestran las horas en Europe/Madrid. Cloudflare puede aplicar muestreo; visitas no equivale a personas únicas. No se promete un conteo en tiempo real.

Pruebas sin credenciales: `node tests/test_admin_analytics.mjs` (autenticación, filtros, periodos, caché, errores y ausencia real de datos). Estas pruebas usan respuestas simuladas y no sustituyen la comprobación con Cloudflare.

Referencias oficiales:
- https://developers.cloudflare.com/analytics/graphql-api/getting-started/authentication/api-token-auth/
- https://developers.cloudflare.com/analytics/graphql-api/getting-started/explore-graphql-schema/
- https://developers.cloudflare.com/web-analytics/faq/
