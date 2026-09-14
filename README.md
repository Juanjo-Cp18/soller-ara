# Sóller Ara

Projecte públic i sense ànim de lucre per reunir informació local de Sóller en un sol lloc, mantenint sempre visible la font original i l'accés a la publicació d'origen.

## Versió

**v0.61**

## Novetats de la v0.6 / v0.61

- Quarta font real: **Sóller 2010**, entitat pública empresarial municipal.
- Els avisos es llegeixen des de la pàgina pública de notícies i es comprova la data publicada a cada avís individual.
- Si un avís de Sóller 2010 no té una data fiable, no s'incorpora a la cronologia.
- La font queda aïllada: si Sóller 2010 canvia la seva web o falla, les altres fonts continuen actualitzant-se.
- Neteja específica dels títols i descripcions genèriques de Sóller 2010.
- Millora de classificació per a recollida selectiva, voluminosos, reciclatge, piscines i Son Angelats.
- La secció **Ara** ja no manté avisos antics indefinidament:
  - Avisos: fins a 7 dies.
  - Serveis: fins a 5 dies.
  - Altres continguts: fins a 24 hores.
- Dins **Ara**, els avisos i serveis tenen prioritat sobre la resta.

## Fonts actuals

1. **Ajuntament de Sóller** — RSS oficial.
2. **Sa Veu de Sóller** — RSS públic.
3. **Setmanari Sóller** — pàgina pública d'últimes notícies.
4. **Sóller 2010** — pàgina pública d'avisos, amb verificació de data a cada publicació.

## Regles de contingut

- Cap notícia d'una font s'elimina o fusiona automàticament amb una altra.
- Un titular igual no implica necessàriament el mateix contingut.
- Les publicacions només es poden marcar com a relacionades si coincideixen clarament tant en titular com en resum i proximitat temporal.
- Fins i tot si estan relacionades, totes les publicacions continuen visibles separadament.
- No es copia el cos complet dels articles; es conserva la font i l'enllaç original.
- Un avís sense data fiable no es presenta com a actual.

## Arquitectura actual

- `index.html`: estructura de la interfície.
- `styles.css`: disseny visual responsive.
- `app.js`: idiomes, filtres per categoria i font, cerca, lògica d'Ara, càrrega web/local i compartició.
- `manifest.webmanifest`: configuració inicial PWA.
- `sources.json`: registre de fonts públiques.
- `scripts/update_sources.py`: lectura de RSS, webs públiques, classificació, control d'estat i generació de dades.
- `data/posts.json`: dades per a la web.
- `data/posts.js`: dades compatibles amb obertura local.
- `.github/workflows/update-sources.yml`: actualització horària.
- `.github/workflows/deploy-pages.yml`: publicació automàtica a GitHub Pages.

## Cost

Cost addicional actual: **0 €**.
