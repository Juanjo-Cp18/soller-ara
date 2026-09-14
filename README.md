# Sóller Ara

Projecte públic i sense ànim de lucre per reunir informació local de Sóller en un sol lloc, mantenint sempre visible la font original i l'accés a la publicació d'origen.

## Versió

**v0.7**

## Novetats de la v0.7

- Política conservadora de propietat intel·lectual integrada al sistema.
- Els mitjans de comunicació (Sa Veu i Setmanari Sóller) es mostren amb:
  - titular,
  - font,
  - data,
  - categoria,
  - enllaç original.
- No es publiquen els extractes dels articles de mitjans mentre no hi hagi una autorització clara.
- Les fotografies de totes les fonts estan desactivades per defecte fins que els drets s'hagin verificat.
- Cada font declara ara la seva política de contingut i l'estat dels drets a `sources.json`.
- Nova documentació específica a `RIGHTS.md`.
- Es manté Sóller 2010 com a quarta font i la lògica millorada de la secció **Ara**.

## Fonts actuals

1. **Ajuntament de Sóller** — RSS oficial.
2. **Sa Veu de Sóller** — RSS públic; ús conservador de titular/enllaç.
3. **Setmanari Sóller** — pàgina pública d'últimes notícies; ús conservador de titular/enllaç.
4. **Sóller 2010** — avisos públics amb verificació de data.

## Fotografies

No es mostren fotografies de tercers de manera automàtica.

Només s'incorporaran quan disposem d'una llicència, permís escrit, domini públic verificat o material propi.

## Regles de contingut

- Cap notícia d'una font s'elimina o fusiona automàticament amb una altra.
- Un titular igual no implica necessàriament el mateix contingut.
- Els mitjans privats no aporten extractes textuals a la targeta mentre la reutilització no estigui autoritzada.
- Les fonts oficials poden aportar informació factual breu sota una política conservadora.
- Un avís sense data fiable no es presenta com a actual.
- Sempre es conserva un enllaç visible a la font d'origen.

## Arquitectura actual

- `index.html`: estructura de la interfície.
- `styles.css`: disseny visual responsive.
- `app.js`: idiomes, filtres, cerca, lògica d'Ara i renderització.
- `manifest.webmanifest`: configuració PWA.
- `sources.json`: fonts i política de drets per font.
- `scripts/update_sources.py`: lectura, classificació, control d'estat i aplicación de política de contingut.
- `RIGHTS.md`: política de drets i reutilització.
- `data/posts.json` / `data/posts.js`: dades generades.
- `.github/workflows/update-sources.yml`: actualització horària.
- `.github/workflows/deploy-pages.yml`: publicació automàtica.

## Cost

Cost addicional actual: **0 €**.
