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
