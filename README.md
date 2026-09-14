# Sóller Ara

Projecte públic i sense ànim de lucre per reunir informació local de Sóller en un sol lloc, mantenint sempre visible la font original i l'accés a la publicació d'origen.

## Versió

**v0.31**

## Canvi important de la v0.31

- **Cap publicació d'una font s'elimina ni es fusiona automàticament amb una altra.**
- Un mateix titular pot correspondre a continguts diferents; per tant, la similitud del títol per si sola no es considera suficient.
- Cada notícia conserva sempre la seva pròpia targeta, font, resum i enllaç original.
- El sistema només pot marcar dues publicacions com a **contingut relacionat** quan coincideixen molt tant el titular com el resum i s'han publicat dins una finestra de 72 hores.
- Encara que dues publicacions es marquin com a relacionades, totes dues continuen visibles per separat.

## Novetats iniciades a la v0.3

- Segona font real: **Sa Veu de Sóller** mitjançant el seu feed RSS públic.
- El sistema combina publicacions de l'Ajuntament de Sóller i Sa Veu en una única portada cronològica.
- El cercador també té en compte els continguts relacionats.
- Es manté el cost addicional en **0 €** i no s'utilitza cap API d'IA de pagament.

## Fonts actuals

1. **Ajuntament de Sóller** — RSS oficial de notícies  
   `https://ajsoller.net/ca/noticies/rss.xml`

2. **Sa Veu de Sóller** — RSS públic del diari digital  
   `https://saveu.cat/feed/`

## Arquitectura actual

- `index.html`: estructura de la interfície.
- `styles.css`: disseny visual responsive.
- `app.js`: idiomes, filtres, cerca, càrrega de dades, contingut relacionat i compartició.
- `manifest.webmanifest`: configuració inicial PWA.
- `sources.json`: registre de fonts públiques.
- `scripts/update_sources.py`: lector RSS/Atom, neteja, classificació i detecció conservadora de contingut relacionat.
- `data/posts.json`: dades generades automàticament.
- `.github/workflows/update-sources.yml`: actualització horària de les fonts.
- `.github/workflows/deploy-pages.yml`: publicació automàtica a GitHub Pages.

## Principis

- Cost addicional objectiu: **0 €**.
- Català com a idioma inicial de la interfície.
- Respecte a les fonts: no es reprodueixen els articles complets; es mostra un extracte breu i un enllaç directe a l'original.
- Sense IA de pagament.
- Prioritat a no perdre informació: davant el dubte, dues publicacions es mantenen separades.

## Estat

La v0.31 és una versió pilot amb dues fonts reals. La detecció de continguts relacionats és deliberadament restrictiva i s'anirà ajustant només amb casos reals verificats.
