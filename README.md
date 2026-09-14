# Sóller Ara

Projecte públic i sense ànim de lucre per reunir informació local de Sóller en un sol lloc, mantenint sempre visible la font original i l'accés a la publicació d'origen.

## Versió

**v0.5**

## Novetats de la v0.5

- Filtre per font a la portada.
- L'usuari pot veure totes les publicacions o limitar-les a:
  - Ajuntament de Sóller
  - Sa Veu de Sóller
  - Setmanari Sóller
- El generador registra ara l'estat de cada font a `data/posts.json`:
  - si l'actualització ha funcionat,
  - quantes publicacions ha aportat,
  - quin mètode s'ha utilitzat,
  - i l'error concret si una font falla.
- Una font que falla no impedeix que les altres continuïn actualitzant-se.
- Es manté la compatibilitat amb obertura local mitjançant `data/posts.js`.

## Fonts actuals

1. **Ajuntament de Sóller** — RSS oficial.
2. **Sa Veu de Sóller** — RSS públic.
3. **Setmanari Sóller** — pàgina pública d'últimes notícies.

## Font candidata pendent

**Sóller 2010** publica avisos útils sobre residus, ORA, aparcaments, Son Angelats i altres serveis públics. De moment no s'ha afegit a la cronologia perquè el seu llistat públic no ofereix una data fiable per a cada avís. Preferim no mostrar una publicació antiga com si fos recent.

## Regles de contingut

- Cap notícia d'una font s'elimina o fusiona automàticament amb una altra.
- Un titular igual no implica necessàriament el mateix contingut.
- Les publicacions només es poden marcar com a relacionades si coincideixen clarament tant en titular com en resum i proximitat temporal.
- Fins i tot si estan relacionades, totes les publicacions continuen visibles separadament.
- No es copia el cos complet dels articles; es conserva la font i l'enllaç original.

## Arquitectura actual

- `index.html`: estructura de la interfície.
- `styles.css`: disseny visual responsive.
- `app.js`: idiomes, filtres per categoria i font, cerca, càrrega web/local i compartició.
- `manifest.webmanifest`: configuració inicial PWA.
- `sources.json`: registre de fonts públiques.
- `scripts/update_sources.py`: lectura de fonts, classificació, control d'estat i generació de dades.
- `data/posts.json`: dades per a la web.
- `data/posts.js`: dades compatibles amb obertura local.
- `.github/workflows/update-sources.yml`: actualització horària.
- `.github/workflows/deploy-pages.yml`: publicació automàtica a GitHub Pages.

## Cost

Cost addicional actual: **0 €**.
