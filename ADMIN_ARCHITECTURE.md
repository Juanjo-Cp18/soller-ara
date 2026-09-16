# Arquitectura de Administración · Sóller Ara

## Objetivo

Separar la web pública de un área privada de Administración. Ninguna contraseña, token de Meta ni credencial de GitHub debe estar presente en el JavaScript público de GitHub Pages.

## Arquitectura propuesta

### Web pública
- GitHub Pages.
- Solo lectura para visitantes.
- Consume los JSON generados por el recopilador.
- No contiene secretos.

### Administración privada
- Interfaz separada.
- Acceso mediante usuario/clave validado en servidor.
- Sesión temporal mediante cookie segura.
- Rate limiting y bloqueo temporal ante intentos repetidos.
- Nunca entrega secretos al navegador.

### Backend de Administración
Opción recomendada: función serverless ligera (por ejemplo Cloudflare Worker) que:
- valida el acceso;
- mantiene la sesión;
- ejecuta acciones autorizadas sobre el repositorio;
- dispara workflows de GitHub;
- consulta estados;
- registra auditoría.

El backend guardará sus secretos en variables protegidas del proveedor serverless, no en GitHub Pages.

## Módulos previstos

### 1. Panel
- estado general del recopilador;
- última actualización;
- fuentes activas / con error;
- estado Meta;
- últimas publicaciones;
- accesos rápidos.

### 2. Publicaciones propias
- crear;
- vista previa;
- publicar en Sóller Ara;
- publicar simultáneamente en Facebook / Instagram;
- editar;
- eliminar;
- consultar URL individual;
- consultar estado de distribución social.

### 3. Moderación
- ver publicaciones recopiladas;
- ocultar;
- restaurar;
- añadir nota interna;
- futura cola Pendiente / Publicar / Editar / Descartar.

Regla:
- una publicación propia puede eliminarse físicamente;
- una publicación externa se oculta mediante data/moderation.json para evitar que reaparezca al siguiente ciclo.

### 4. Fuentes
- activar/desactivar fuentes;
- ver última ejecución;
- ver número de entradas;
- ver errores;
- futuras altas de nuevas fuentes.

### 5. Redes sociales
- estado Facebook;
- estado Instagram;
- permisos detectados;
- última publicación;
- errores;
- botón de comprobación segura.

Los tokens nunca se mostrarán completos ni se guardarán en el navegador.

### 6. Configuración
- idioma predeterminado;
- categorías;
- datos de contacto;
- email;
- enlaces sociales;
- futura identidad visual/logo.

### 7. Registro / auditoría
- quién hizo la acción;
- fecha y hora;
- publicación afectada;
- acción realizada;
- resultado.

### 8. Copias / mantenimiento
- exportar configuración;
- comprobar integridad;
- restaurar ocultaciones;
- información de versión.

## Migración GitHub

La aplicación no debe depender para siempre de una URL que incluya un usuario personal.

Plan recomendado:
1. mantener el repositorio actual mientras se completa la funcionalidad;
2. definir el nombre definitivo de cuenta/organización y, preferiblemente, un dominio propio;
3. transferir el repositorio cuando el destino definitivo exista;
4. comprobar Pages y Actions;
5. actualizar todas las URLs absolutas;
6. actualizar URLs públicas configuradas en Meta;
7. validar de nuevo Facebook / Instagram;
8. mantener redirecciones del repositorio cuando GitHub las proporcione.

Importante:
- los secretos del repositorio permanecen asociados durante una transferencia de repositorio;
- la URL antigua de GitHub Pages no se redirige automáticamente al nuevo Pages;
- un dominio personalizado evita que futuros cambios de propietario o nombre alteren la URL pública.

## Estado actual del control de publicaciones

Ya implementado:
- data/moderation.json
- scripts/manage_posts.py
- workflow Sóller Ara · gestionar publicacions
- ocultar publicación externa
- restaurar publicación externa
- eliminar publicación propia
- eliminación de página individual propia
- eliminación de imagen generada propia
- respeto de ocultaciones en futuras actualizaciones

Implementado en v0.41:
- interfaz visual de Administración;
- login por clave conectado a backend privado;
- sesiones firmadas y temporales;
- backend Cloudflare Worker preparado;
- panel de estado;
- publicación propia;
- moderación visual;
- eliminación propia y ocultación/restauración externa.

Pendiente:
- desplegar y conectar Cloudflare Worker;
- edición de publicaciones propias;
- gestión visual de fuentes;
- auditoría privada persistente;
- usuarios/roles múltiples.
