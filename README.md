# Sóller Ara

Projecte públic i sense ànim de lucre per reunir informació local de Sóller en un sol lloc, mantenint sempre visible la font original i l'accés a la publicació d'origen.

## Versió

**v0.41**

## Novetat de la v0.41: còpia local

A partir d'aquesta versió, una còpia completa del projecte es pot obrir directament des d'una carpeta del PC fent doble clic a `index.html`.

El sistema genera les dades en dos formats:

- `data/posts.json`: utilitzat principalment per la web publicada a GitHub Pages.
- `data/posts.js`: còpia de les mateixes dades que el navegador pot carregar quan `index.html` s'obre com a fitxer local (`file://`).

### Limitació important

La còpia local mostra les notícies que contenia en el moment de descarregar el projecte, però **no s'actualitza automàticament cada hora per si sola**. L'actualització automàtica continua executant-se amb GitHub Actions a la versió publicada.

Més endavant es pot preparar un actualitzador local per Windows/macOS si es considera útil.

## Fonts actuals

1. **Ajuntament de Sóller** — RSS oficial  
   `https://ajsoller.net/ca/noticies/rss.xml`

2. **Sa Veu de Sóller** — RSS públic  
   `https://saveu.cat/feed/`

3. **Setmanari Sóller** — pàgina pública d'últimes notícies  
   `https://www.elsoller.cat/ultimes.html`

## Regles de contingut

- Cap notícia d'una font s'elimina o fusiona automàticament amb una altra.
- Un titular igual no implica necessàriament el mateix contingut.
- Les publicacions només es poden marcar com a relacionades si coincideixen clarament tant en titular com en resum i proximitat temporal.
- Fins i tot si estan relacionades, totes les publicacions continuen visibles separadament.
- No es copia el cos complet dels articles; es conserva la font i l'enllaç original.

## Arquitectura actual

- `index.html`: estructura de la interfície.
- `styles.css`: disseny visual responsive.
- `app.js`: idiomes, filtres, cerca, càrrega web/local, contingut relacionat i compartició.
- `manifest.webmanifest`: configuració inicial PWA.
- `sources.json`: registre de fonts públiques.
- `scripts/update_sources.py`: lector RSS/Atom, lector HTML controlat, classificació i generació de dades.
- `data/posts.json`: dades per a la web.
- `data/posts.js`: dades compatibles amb obertura local.
- `.github/workflows/update-sources.yml`: actualització horària de les fonts.
- `.github/workflows/deploy-pages.yml`: publicació automàtica a GitHub Pages.

## Cost

Cost addicional actual: **0 €**.
