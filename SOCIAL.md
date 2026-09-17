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


## Primera font automàtica activada

La primera font social automàtica és el canal oficial de YouTube de l'Ajuntament de Sóller.

Canal: `@ajuntamentdesoller_`

Sóller Ara consulta el feed públic oficial de YouTube i crea una entrada social per cada vídeo recent. El text resum és generat per Sóller Ara a partir del títol i del tipus de publicació; no copia la descripció completa del vídeo.

El vídeo es reprodueix amb el reproductor oficial de YouTube i continua allotjat a YouTube.

## v0.53 — Entitats locals i creadors fora de Meta

S'incorporen deu canals addicionals de YouTube i dos feeds de museus. La relació, procedència i criteris de selecció es documenten a [SOURCES_REVIEW.md](SOURCES_REVIEW.md).

Els canals d'abast insular només aporten vídeos amb referència local al títol; els canals de les entitats locals seleccionades recullen la seva activitat. Es manté el límit de 60 dies i la data original. Cap imatge o vídeo extern es descarrega o torna a allotjar.

El reproductor de YouTube aplica les restriccions d'inserció del titular. El feed públic serveix per descobrir entrades recents, i la seva disponibilitat no concedeix drets de reutilització del fitxer audiovisual.


## v0.16 — Xarxes en directe

S'ha afegit una capa de visualització oficial que no depèn de scraping:

- X: timelines embegudes d'AEMET Baleares, IBANAT i SAMU 061 Illes Balears.
- Facebook: Page Plugin de Policia Tutor de Sóller.
- Instagram: accés al perfil @serveissocialssoller, identificat pel web oficial de l'Ajuntament.

Aquesta capa és diferent de les targetes socials automàtiques. Les timelines mostren contingut real servit directament per la plataforma, però Sóller Ara no pot llegir programàticament cada publicació per resumir-la sense l'accés API corresponent.

La meta continua sent que les publicacions seleccionades de X, Facebook i Instagram acabin entrant com a targetes individuals a Tot/Ara/Xarxes. Per fer-ho de forma estable i conforme a les plataformes, s'activaran les API oficials quan disposem dels permisos necessaris.


## v0.17 — Correcció dels embeds socials

Les timelines i iframes globals de xarxes s'han retirat de la interfície perquè no ofereixen una experiència prou fiable. En concret, determinades pàgines de Facebook poden rebutjar la connexió i Instagram no ofereix un feed de perfil reutilitzable només amb un iframe.

A partir d'ara:
- una plataforma només compta com a integrada quan Sóller Ara pot obtenir publicacions individuals;
- les plataformes no integrades es mantenen com a accessos directes verificats;
- no es mostraran finestres buides o errors de connexió com si fossin contingut social.


## v0.19 — Connector Meta preparat

Sóller Ara ja incorpora un connector opcional per Instagram Business Discovery.

Quan GitHub disposi de `META_ACCESS_TOKEN` i `META_IG_USER_ID`, les fonts marcades com `meta_business_discovery` a `social_sources.json` es consultaran automàticament.

El text original de la publicació s'utilitza només per classificar-la i generar una descripció pròpia i neutral. No es publica íntegrament.

El contingut visual es presenta amb l'embed oficial d'Instagram a partir del permalink original.

Si les credencials no estan configurades, el connector s'omet sense provocar errors en les fonts existents.
