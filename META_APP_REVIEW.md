# Meta App Review · Sóller Ara

Objectiu: obtenir l'accés necessari per llegir de forma automatitzada contingut públic de tercers quan Meta ho permeti, sense reutilitzar credencials personals ni copiar contingut complet.

## Cas d'ús

Sóller Ara és un agregador local sense ànim de lucre. El sistema consulta fonts públiques i mostra:
- títol propi o titular;
- data;
- font;
- enllaç original;
- resum breu quan els drets ho permeten.

Per a Instagram/Facebook, la finalitat és detectar publicacions noves de comptes oficials o professionals públics relacionats amb Sóller i mostrar-ne una referència al feed mantenint l'enllaç original.

## Estat tècnic verificat

- La connexió amb Meta funciona.
- El compte propi @soller.ara es descobreix correctament.
- La lectura del compte propi funciona.
- La publicació pròpia a Instagram ja ha estat validada.
- Business Discovery sobre comptes de tercers retorna actualment:
  `(#10) Application does not have permission for this action`.

Això indica que el bloqueig actual és de permisos/revisió, no de connectivitat.

## URLs públiques verificades

- Sóller Ara: https://soller-ara.github.io/soller-ara/
- Política de privacitat: https://soller-ara.github.io/soller-ara/privacy.html
- Eliminació de dades: https://soller-ara.github.io/soller-ara/data-deletion.html

Aquestes pàgines es despleguen mitjançant GitHub Pages i el workflow de desplegament ha finalitzat correctament.

## Material que hem de tenir preparat per a App Review

1. Descripció clara del cas d'ús.
2. Vídeo/screencast del flux real dins Sóller Ara.
3. Passos exactes perquè el revisor pugui reproduir la funció.
4. Compte de prova o credencials de revisió si Meta les demana.
5. Política de privacitat pública.
6. URL pública de Sóller Ara.
7. Explicació de quines dades es guarden i durant quant de temps.
8. Explicació de com es pot eliminar la informació almacenada.
9. Justificació de cada permís solicitado.
10. Evidencia de que el contenido mostrado conserva siempre la fuente y el enlace original.

## Criterio de minimización

Sóller Ara no necesita descargar ni almacenar permanentemente fotos o vídeos de terceros. Cuando sea posible:
- se usará el embed oficial de la plataforma;
- se conservará solo identificador, fecha, enlace, cuenta y metadatos mínimos;
- no se copiará el texto completo de publicaciones de terceros.

## Justificación preparada para Meta

### Facebook · Page Public Content Access

**Necesidad:** Sóller Ara necesita detectar nuevas publicaciones públicas de páginas oficiales o institucionales que no administra, para mostrar una referencia local con fuente, fecha y enlace original.

**Uso previsto:** analizar y mostrar publicaciones públicas relevantes para Sóller. No se pretende acceder a contenido privado ni a datos de usuarios no públicos.

**Datos mínimos conservados:** identificador de la publicación cuando sea necesario, nombre de la fuente, fecha, URL original y metadatos mínimos para clasificarla.

**Contenido multimedia:** cuando sea posible se utilizará el enlace o embed oficial en vez de descargar y conservar el archivo.

### Instagram · cuentas profesionales públicas

**Necesidad:** detectar publicaciones nuevas de cuentas Business/Creator públicas relacionadas con Sóller mediante la vía oficial autorizada por Meta.

**Estado actual:** la consulta al propio `@soller.ara` funciona. Las consultas Business Discovery a terceros devuelven el error `#10 Application does not have permission for this action`, por lo que esta función no se activa hasta recibir el acceso correspondiente.

## Guion para el screencast de App Review

1. Abrir la URL pública de Sóller Ara.
2. Mostrar el feed y el selector de fuentes.
3. Entrar en la categoría **Xarxes**.
4. Mostrar una publicación de prueba servida por una cuenta controlada por Sóller Ara.
5. Explicar que la misma función, una vez aprobada, consulta únicamente cuentas públicas configuradas.
6. Mostrar que cada tarjeta conserva:
   - nombre de la fuente;
   - cuenta;
   - fecha;
   - enlace original;
   - plataforma.
7. Abrir el enlace original para demostrar que el contenido permanece alojado en Meta.
8. Mostrar la Política de privacidad.
9. Mostrar la página de Eliminación de datos.
10. Mostrar que no existe un formulario de extracción masiva ni una exportación de datos personales.

## Instrucciones para el revisor

- URL principal: https://soller-ara.github.io/soller-ara/
- Política de privacidad: https://soller-ara.github.io/soller-ara/privacy.html
- Eliminación de datos: https://soller-ara.github.io/soller-ara/data-deletion.html
- La aplicación es un agregador local informativo sin ánimo de lucro.
- El idioma predeterminado es catalán; puede cambiarse a español o inglés desde la cabecera.
- La funcionalidad solicitada se encuentra en la sección **Xarxes**.
- No se solicita acceso a contenido privado.

## Próximo paso

Cuando la documentación pública (privacidad y borrado de datos) esté desplegada en GitHub Pages, preparar el screencast y enviar App Review con los permisos estrictamente necesarios.
