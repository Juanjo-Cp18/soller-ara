# Sóller Ara

Projecte públic i sense ànim de lucre per reunir informació local de Sóller en un sol lloc, mantenint sempre visible la font original i l'accés a la publicació d'origen.

## Versió

**v0.21**

## Novetats de la v0.21

- Neteja automàtica dels extractes RSS: elimina el títol i la data quan venen duplicats al resum.
- Nova categoria **Serveis** per a residus, porta a porta, mobilitat, trànsit, aigua, sanejament, obres i altres serveis públics.
- Classificació millorada amb puntuacions i prioritat per categories, en lloc d'assignar la primera paraula clau trobada.
- Ja no s'utilitzen els dies de la setmana com a senyal automàtica d'Agenda.
- Els avisos urgents continuen tenint prioritat sobre la resta de categories.
- El punt visual de font oficial només apareix a les fonts marcades realment com a oficials.
- Corregit el disparador del workflow d'actualització de fonts.
- GitHub Pages es torna a publicar automàticament quan acaba una actualització de dades amb èxit.

## Arquitectura actual

- `index.html`: estructura de la interfície.
- `styles.css`: disseny visual responsive.
- `app.js`: idiomes, filtres, cerca, càrrega de dades i compartició.
- `manifest.webmanifest`: configuració inicial PWA.
- `sources.json`: registre de fonts públiques.
- `scripts/update_sources.py`: lector RSS/Atom, neteja i classificació.
- `data/posts.json`: dades generades automàticament.
- `.github/workflows/update-sources.yml`: actualització horària de les fonts.
- `.github/workflows/deploy-pages.yml`: publicació automàtica a GitHub Pages.

## Principis

- Cost addicional objectiu: **0 €**.
- Català com a idioma inicial de la interfície.
- Respecte a la font: no es reprodueix l'article complet; es mostra un extracte breu i un enllaç directe a l'original.
- Sense IA de pagament a la v0.21.

## Font actual

Ajuntament de Sóller — RSS oficial de notícies:

`https://ajsoller.net/ca/noticies/rss.xml`

## Estat

La v0.21 continua sent una versió pilot. La classificació ha millorat, però seguirà necessitant ajustos a mesura que incorporem més fonts i casos reals.
