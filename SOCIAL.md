# Xarxes socials i multimèdia — Sóller Ara

## Objectiu

Les xarxes socials han de funcionar com una font més de Sóller Ara quan una publicació pública sigui rellevant per a Sóller.

Una entrada social pot aparèixer a:

- **Tot**
- **Ara**
- **Xarxes**
- la seva categoria temàtica corresponent (avisos, esports, cultura, serveis, etc.)

## Format d'una entrada social

Cada entrada social conservarà:

- plataforma;
- compte o entitat;
- data i hora;
- títol intern;
- resum propi i neutral de Sóller Ara;
- URL de la publicació original;
- categoria;
- opcionalment, multimèdia embeguda mitjançant les eines oficials de la plataforma.

## Fotografies i vídeos

Sóller Ara no descarrega ni torna a allotjar fotos o vídeos d'una xarxa social.

Quan una plataforma ofereix un sistema oficial d'embed es pot mostrar el post original dins la targeta. Això permet conservar autoria, context, enllaç i controls de la plataforma.

### Plataformes preparades

- **X**: post públic embegut; pot conservar fotos, vídeo i previsualitzacions.
- **TikTok**: reproductor oficial per a vídeos/posts públics.
- **YouTube**: reproductor oficial per a vídeos embebibles.
- **Imatge directa**: només si `image_allowed=true` i els drets de reutilització han estat verificats.

Instagram i Facebook s'afegiran quan la via oficial d'integració i les condicions aplicables al nostre cas estiguin verificades.

## Descobriment de contingut

La visualització i el descobriment són problemes diferents.

Poder embedir una publicació no implica que puguem consultar automàticament totes les publicacions d'una plataforma. Cada xarxa té APIs, permisos i condicions diferents.

Per tant, l'arquitectura permet multimèdia des d'ara, però l'activació automàtica de cada xarxa s'implementarà només quan existeixi una via oficial i estable.

## Regla editorial

Una publicación social nunca se elimina por parecerse a una noticia de otra fuente. Puede marcarse como relacionada, pero siempre conserva su tarjeta y enlace original.
