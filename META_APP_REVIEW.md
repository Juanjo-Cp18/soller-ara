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

## Próximo paso

Cuando la documentación pública (privacidad y borrado de datos) esté desplegada en GitHub Pages, preparar el screencast y enviar App Review con los permisos estrictamente necesarios.
