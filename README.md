# Sóller Ara

Projecte públic i sense ànim de lucre per reunir informació local de Sóller en un sol lloc, mantenint sempre visible la font original i l'accés a la publicació d'origen.

## Versió

**v0.8**

## Novetats de la v0.8

- Nova zona **Accessos útils** orientada a mobilitat i serveis.
- Enllaç directe als horaris oficials de Tren i Tramvia de Sóller.
- Enllaç directe a la informació oficial d'ORA i aparcament de Sóller 2010.
- Enllaç directe a la pàgina oficial de la Policia Local de Sóller.
- Enllaç directe a la fitxa municipal de Radio Taxis Sóller.
- No es copien horaris, tarifes, mapes, fotografies ni altres continguts d'aquestes webs: Sóller Ara actua com a porta d'entrada a la font oficial.
- Els accessos estan traduïts a català, castellà i anglès.
- Es manté la política de drets de la v0.7 i les 4 fonts d'actualitat.

## Fonts d'actualitat

1. **Ajuntament de Sóller** — RSS oficial.
2. **Sa Veu de Sóller** — RSS públic; ús conservador de titular/enllaç.
3. **Setmanari Sóller** — pàgina pública d'últimes notícies; ús conservador de titular/enllaç.
4. **Sóller 2010** — avisos públics amb verificació de data.

## Accessos oficials

- Ferrocarril de Sóller — horaris oficials.
- Sóller 2010 — ORA i aparcament.
- Ajuntament de Sóller — Policia Local.
- Ajuntament de Sóller — Radio Taxis Sóller.

## Fotografies i drets

No es mostren fotografies de tercers de manera automàtica.

Només s'incorporaran quan disposem d'una llicència, permís escrit, domini públic verificat o material propi.

Els accessos útils utilitzen icones genèriques pròpies del sistema i enllacen directament a la font oficial.

## Arquitectura actual

- `index.html`: estructura de la interfície i accessos útils.
- `styles.css`: disseny responsive.
- `app.js`: idiomes, filtres, cerca, lògica d'Ara i traducció dels accessos.
- `sources.json`: fonts d'actualitat i política de drets.
- `scripts/update_sources.py`: lectura, classificació i generació de dades.
- `RIGHTS.md`: política de drets i reutilització.
- `data/posts.json` / `data/posts.js`: dades generades.
- GitHub Actions: actualització horària i publicació automàtica.

## Cost

Cost addicional actual: **0 €**.
