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
