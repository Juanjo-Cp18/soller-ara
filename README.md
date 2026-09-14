# Sóller Ara

Projecte públic i sense ànim de lucre per reunir informació local de Sóller en un sol lloc, mantenint sempre visible la font original i l'accés a la publicació d'origen.

## Versió

**v0.2**

## Novetats de la v0.2

- Primera font real: **Ajuntament de Sóller**.
- Connexió mitjançant el RSS oficial de notícies.
- Actualització automàtica amb GitHub Actions, programada cada hora.
- Les dades es guarden a `data/posts.json` i GitHub Pages les publica com a fitxer estàtic.
- Sistema de fonts independent a `sources.json`.
- Classificació automàtica bàsica per paraules clau: notícies, avisos, agenda, cultura, esports i comerç.
- La interfície continua disponible en català, castellà i anglès; el contingut de la font es conserva en el seu idioma original.
- Les targetes mostren la font, la data, un extracte breu i l'enllaç a l'original.

## Arquitectura actual

- `index.html`: estructura de la interfície.
- `styles.css`: disseny visual responsive.
- `app.js`: idiomes, filtres, cerca, càrrega de dades i compartició.
- `manifest.webmanifest`: configuració inicial PWA.
- `sources.json`: registre de fonts públiques.
- `scripts/update_sources.py`: lector RSS/Atom i normalitzador de publicacions.
- `data/posts.json`: dades generades automàticament.
- `.github/workflows/update-sources.yml`: actualització horària de les fonts.
- `.github/workflows/deploy-pages.yml`: publicació automàtica a GitHub Pages.

## Principis

- Cost addicional objectiu: **0 €**.
- Català com a idioma inicial de la interfície.
- Respecte a la font: no es reprodueix l'article complet; es mostra un extracte breu i un enllaç directe a l'original.
- Sense IA de pagament a la v0.2.

## Font v0.2

Ajuntament de Sóller — RSS oficial de notícies:

`https://ajsoller.net/ca/noticies/rss.xml`

## Estat

La v0.2 és encara una versió pilot. La classificació per paraules clau és deliberadament simple i haurà d'anar millorant a mesura que afegim fonts i vegem casos reals.
