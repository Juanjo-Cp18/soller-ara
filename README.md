# Sóller Ara

Projecte públic i sense ànim de lucre per reunir informació local de Sóller en un sol lloc, mantenint sempre visible la font original i l'accés a la publicació d'origen.

## Versió

**v0.3**

## Novetats de la v0.3

- Segona font real: **Sa Veu de Sóller** mitjançant el seu feed RSS públic.
- El sistema combina publicacions de l'Ajuntament de Sóller i Sa Veu en una única portada cronològica.
- Agrupació conservadora de possibles duplicats entre fonts diferents.
- Només s'agrupen publicacions publicades dins una finestra de 72 hores i amb una similitud de títol molt alta.
- Quan una publicació té una font relacionada, la targeta mostra **També a** amb un enllaç directe a l'altra publicació.
- El cercador també té en compte les fonts i títols relacionats.
- El sistema registra el nombre de publicacions brutes i el nombre final després de l'agrupació.
- Es manté el cost addicional en **0 €** i no s'utilitza cap API d'IA de pagament.

## Fonts actuals

1. **Ajuntament de Sóller** — RSS oficial de notícies  
   `https://ajsoller.net/ca/noticies/rss.xml`

2. **Sa Veu de Sóller** — RSS públic del diari digital  
   `https://saveu.cat/feed/`

## Arquitectura actual

- `index.html`: estructura de la interfície.
- `styles.css`: disseny visual responsive.
- `app.js`: idiomes, filtres, cerca, càrrega de dades, fonts relacionades i compartició.
- `manifest.webmanifest`: configuració inicial PWA.
- `sources.json`: registre de fonts públiques.
- `scripts/update_sources.py`: lector RSS/Atom, neteja, classificació i agrupació de duplicats probables.
- `data/posts.json`: dades generades automàticament.
- `.github/workflows/update-sources.yml`: actualització horària de les fonts.
- `.github/workflows/deploy-pages.yml`: publicació automàtica a GitHub Pages.

## Principis

- Cost addicional objectiu: **0 €**.
- Català com a idioma inicial de la interfície.
- Respecte a les fonts: no es reprodueixen els articles complets; es mostra un extracte breu i un enllaç directe a l'original.
- Sense IA de pagament a la v0.3.
- La deduplicació és deliberadament conservadora per evitar unir notícies diferents.

## Estat

La v0.3 és encara una versió pilot. Amb dues fonts reals ja podem començar a observar casos de duplicació, diferències de classificació i qualitat dels extractes en un entorn más semblant al producte final.
