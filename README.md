# Sóller Ara

Projecte públic i sense ànim de lucre per reunir informació local de Sóller en un sol lloc, mantenint sempre visible la font original i l'accés a la publicació d'origen.

## Versió

**v0.9**

## Novetats de la v0.9

- Incorporació del servei oficial d'autobusos **TIB** a la zona d'accessos útils.
- Accés principal a **TIB Ara**, on l'usuari pot consultar informació de servei en temps real, avisos, alertes i planificació de trajectes.
- Accés directe a la parada **Sóller centre 2 (61031)** per consultar pròximes sortides.
- Atajos directes a les línies que passen per Sóller:
  - 203
  - 204
  - 231
  - 232
- No es copien horaris, tarifes o dades operatives del TIB. Els accessos sempre apunten a la informació oficial i vigent.
- Es manté la política de drets de la v0.7.
- S'incrementa la versió dels recursos estàtics a `v=0.9` per evitar problemes de caché.

## Fonts d'actualitat

1. **Ajuntament de Sóller** — RSS oficial.
2. **Sa Veu de Sóller** — RSS públic; ús conservador de titular/enllaç.
3. **Setmanari Sóller** — pàgina pública d'últimes notícies; ús conservador de titular/enllaç.
4. **Sóller 2010** — avisos públics amb verificació de data.

## Accessos oficials

- Ferrocarril de Sóller — horaris oficials.
- TIB — TIB Ara, pròximes sortides i línies de Sóller.
- Sóller 2010 — ORA i aparcament.
- Ajuntament de Sóller — Policia Local.
- Ajuntament de Sóller — Radio Taxis Sóller.

## Fotografies i drets

No es mostren fotografies de tercers de manera automàtica.

Només s'incorporaran quan disposem d'una llicència, permís escrit, domini públic verificat o material propi.

## Arquitectura actual

- `index.html`: estructura de la interfície i accessos útils.
- `styles.css`: disseny responsive.
- `app.js`: idiomes, filtres, cerca, lògica d'Ara i traduccions.
- `sources.json`: fonts d'actualitat i política de drets.
- `scripts/update_sources.py`: lectura, classificació i generació de dades.
- `RIGHTS.md`: política de drets i reutilització.
- `data/posts.json` / `data/posts.js`: dades generades.
- GitHub Actions: actualització horària i publicació automàtica.

## Cost

Cost addicional actual: **0 €**.
