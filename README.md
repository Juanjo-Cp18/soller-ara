# Sóller Ara

Projecte públic i sense ànim de lucre per reunir informació local de Sóller en un sol lloc, mantenint sempre visible la font original i l'accés a la publicació d'origen.

## Versió

**v0.4**

## Novetats de la v0.4

- Tercera font real: **Setmanari Sóller** (`elsoller.cat`).
- Com que no hem localitzat un RSS públic del Setmanari Sóller, aquesta font s'integra mitjançant la seva pàgina pública d'últimes notícies.
- El sistema recull només:
  - enllaç de la notícia,
  - titular,
  - descripció/metadades públiques,
  - data de publicació.
- No es copia el cos complet de l'article.
- Si l'estructura HTML del Setmanari Sóller canvia, aquesta font pot fallar sense impedir que l'Ajuntament i Sa Veu continuïn actualitzant-se.
- Les tres fonts es mostren cronològicament en una única portada.
- Es manté la regla de la v0.31: **cap notícia d'una font s'elimina o fusiona automàticament amb una altra**.

## Fonts actuals

1. **Ajuntament de Sóller** — RSS oficial  
   `https://ajsoller.net/ca/noticies/rss.xml`

2. **Sa Veu de Sóller** — RSS públic  
   `https://saveu.cat/feed/`

3. **Setmanari Sóller** — pàgina pública d'últimes notícies  
   `https://www.elsoller.cat/ultimes.html`

## Arquitectura actual

- `index.html`: estructura de la interfície.
- `styles.css`: disseny visual responsive.
- `app.js`: idiomes, filtres, cerca, càrrega de dades, contingut relacionat i compartició.
- `manifest.webmanifest`: configuració inicial PWA.
- `sources.json`: registre de fonts públiques.
- `scripts/update_sources.py`: lector RSS/Atom, lector HTML controlat, neteja, classificació i detecció conservadora de contingut relacionat.
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

La v0.4 és una versió pilot amb tres fonts reals. La font del Setmanari Sóller és tècnicament més fràgil que les dues fonts RSS perquè depèn de l'estructura de la seva pàgina pública.
