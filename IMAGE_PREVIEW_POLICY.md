# Política de previsualitzacions amb imatge

Revisió feta el 18 de setembre de 2026.

## Decisió

`og:image` identifica la imatge que una pàgina proposa per representar el seu enllaç a xarxes, però no acredita una llicència de reutilització. Sóller Ara no descarrega, copia ni torna a allotjar aquestes fotografies.

S'admeten només aquests casos:

- imatges pròpies de Sóller Ara;
- imatges amb permís escrit o llicència compatible comprovada;
- reproductors o previsualitzacions oficials servits per la plataforma o la font original.

## Pilot oEmbed

| Font | Resultat tècnic | Tractament |
| --- | --- | --- |
| Sa Veu de Sóller | Publica descoberta `application/json+oembed` i pàgina `/embed/` | Previsualització oficial dins un `iframe` restringit |
| MUCBO | Publica descoberta `application/json+oembed` i pàgina `/embed/` | Previsualització oficial dins un `iframe` restringit |
| Can Prunera | Publica descoberta `application/json+oembed` i pàgina `/embed/` | Previsualització oficial dins un `iframe` restringit |
| YouTube | Reproductor oficial disponible | Es manté `youtube-nocookie.com`; no s'utilitza la miniatura separadament |
| Mitjans i webs restants | `og:image` disponible en alguns casos, però sense permís o inserció oficial comprovada | Sense fotografia; titular, font, data i enllaç original |

La URL inserida ha de ser HTTPS, pertànyer al mateix domini que la notícia i acabar exactament en `/embed/`. Si una font retira el servei, la notícia i l'enllaç original continuen disponibles.

## Privacitat i seguretat

- càrrega diferida (`loading="lazy"`);
- `sandbox` limitat a les capacitats necessàries per a la previsualització;
- política de referència restringida;
- cap HTML extern s'injecta directament dins Sóller Ara.

L'activació d'una font nova exigeix repetir la comprovació tècnica i de drets i canviar explícitament la seva política a `official_oembed`, `allowed` o una futura modalitat igualment documentada.
