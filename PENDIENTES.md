# Pendientes de Sóller Ara

## Imágenes de vista previa de enlaces externos — resuelto en v0.59

Sóller Ara puede mostrar una vista previa únicamente cuando la fuente ofrece un mecanismo oficial de inserción. El primer piloto se limita a Sa Veu, MUCBO y Can Prunera mediante sus páginas `oEmbed`, servidas directamente por cada fuente.

Antes de activarlo hay que comprobar:

- qué fuentes publican una imagen mediante metadatos Open Graph (`og:image`);
- si la imagen puede mostrarse desde la página original sin descargarla ni volverla a alojar;
- las condiciones de uso y los derechos de cada fuente;
- qué hacer cuando la fuente cambia o elimina la imagen;
- una alternativa sin fotografía para las fuentes que no permitan ese uso.

No se copia, descarga ni vuelve a alojar ninguna fotografía. Las etiquetas `og:image` continúan sin habilitar por sí solas el uso de una imagen. El criterio completo queda documentado en `IMAGE_PREVIEW_POLICY.md`.

## Medición de visitas

Incorporar una medición de visitas que permita conocer, como mínimo, páginas vistas, visitantes aproximados, origen del tráfico y contenidos más consultados. Antes de activarla hay que elegir una solución respetuosa con la privacidad y comprobar si requiere aviso de cookies; Cloudflare Web Analytics es la primera opción a evaluar para esta web estática.

## Identidad visual y movimiento

- El nuevo logotipo `SA` con montañas y capilla se usa desde v0.60 en la cabecera y en las nuevas tarjetas propias para Instagram. Las publicaciones anteriores no se modifican.
- Preparar una animación suave y continua del fondo que pase por el color actual, amanecer, día, atardecer y noche. En la web debe respetar `prefers-reduced-motion` y no dificultar la lectura.
- Comprobar para cada ubicación de Facebook e Instagram si admite movimiento. Cuando una ubicación solo acepte imagen estática, conservar el logotipo fijo y reservar la versión animada para vídeo, reel o historia.
- La portada estática de Facebook ya está compuesta con las siete fotografías aportadas. Antes de publicarla hay que confirmar las licencias de las imágenes identificadas como iStock.
- La ayuda actual de Facebook describe la portada de Página como una fotografía. Preparar una variante animada únicamente si la propia interfaz de la Página admite vídeo en el momento de publicarla; en caso contrario, usar el ciclo día/noche en la web y como vídeo, reel o historia.
