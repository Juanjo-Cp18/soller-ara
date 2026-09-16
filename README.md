# Sóller Ara

Projecte públic i sense ànim de lucre per reunir informació local de Sóller en un sol lloc, mantenint sempre visible la font original i l'accés a la publicació d'origen.

## Versió

**v0.29**

## Novetats de la v0.29

- Nou workflow manual **Meta · publicar prova Facebook**.
- Requereix escriure exactament `PUBLICAR` abans d'executar-se.
- Publica una imatge pròpia de Sóller Ara a la pàgina Facebook **Sóller Ara**.
- Utilitza el Page Access Token obtingut durant l'execució; no s'emmagatzema ni s'imprimeix.
- Cap actualització automàtica pot activar aquesta publicació.

## Novetats de la v0.28

- Confirmada la primera publicació real a Instagram `@soller.ara` des de GitHub Actions.
- Nou workflow manual **Meta · prova privada Facebook**.
- La prova de Facebook és només lectura: comprova `pages_manage_posts` i la tasca `CREATE_CONTENT` sense publicar res.
- Cap token ni Page Access Token s'imprimeix als logs.

## Novetats de la v0.27

- La imatge de prova d'Instagram es substitueix per un JPEG estàndard **1080 × 1080**, RGB.
- Nova URL `assets/meta-test-v2.jpg` per evitar qualsevol caché del fitxer anterior.
- No es canvien tokens ni permisos de Meta.

## Novetats de la v0.26

- La publicació d'Instagram obté primer el **Page Access Token** de la pàgina Sóller Ara.
- Les crides `/media`, estat del contenidor i `/media_publish` utilitzen aquest token de pàgina.
- La imatge de prova es serveix des de GitHub Pages, no des de `raw.githubusercontent.com`.
- El token de pàgina només viu durant l'execució de GitHub Actions i no s'imprimeix als logs.

## Novetats de la v0.25

- Nou workflow manual **Meta · publicar prova Instagram**.
- Requereix escriure exactament `PUBLICAR` abans d'executar-se.
- Publica una imatge pròpia del projecte a `@soller.ara` mitjançant el token de sistema de Meta.
- Cap actualització automàtica pot activar aquest workflow: només funciona amb `workflow_dispatch`.
- El text es pot modificar abans d'executar la prova.

## Novetats de la v0.24

- La prova manual de Meta passa a ser **només lectura**.
- Consulta `content_publishing_limit` de `@soller.ara` per validar l'accés de publicació sense crear contenidors ni publicar res.
- Això evita errors poc clars relacionats amb la descàrrega d'imatges durant les proves.

## Novetats de la v0.23

- Nou workflow manual **Meta · prova privada Instagram**.
- La prova crea només un contenidor tècnic a `@soller.ara`; no executa `/media_publish` i, per tant, no publica res.
- Serveix per validar de forma segura el permís `instagram_content_publish` amb el token de sistema guardat a GitHub Secrets.
- S'afegeix una imatge de prova pròpia del projecte per evitar reutilitzar contingut de tercers.

## Novetats de la v0.21

- Valida el compte propi `@soller.ara` amb Meta després del descobriment automàtic.
- Els errors de Meta ara mostren només el missatge/codi segur retornat per l'API; mai el token.
- Les integracions socials encara en proves no fan aparèixer les sis fonts estables com a caigudes.
- Business Discovery continua en diagnòstic fins saber exactament quin requisit de Meta falta.

## Novetats de la v0.20

- Si `META_ACCESS_TOKEN` està configurat però `META_IG_USER_ID` encara no existeix, GitHub Actions intenta descobrir automàticament la pàgina **Sóller Ara** i el seu `instagram_business_account.id`.
- El token de Meta mai s'imprimeix als logs.
- Si el descobriment automàtic funciona, el connector d'Instagram pot continuar sense copiar manualment l'ID.
- Si Meta no permet aquesta consulta amb el token de sistema, el connector queda inactiu sense afectar la resta de fonts.

## Novetats de la v0.19

- Preparada la integració oficial d'**Instagram amb Meta Business Discovery**.
- Els comptes d'Instagram configurats podran entrar automàticament com a targetes a **Tot / Ara / Xarxes**.
- Cada targeta social conservarà data, compte, enllaç original i un resum propi de Sóller Ara.
- Les fotos, carrusels i Reels es mostraran mitjançant l'**embed oficial d'Instagram**, no descarregant els fitxers.
- GitHub Actions queda preparat per rebre les credencials com a secrets, sense exposar-les al repositori.
- Comptes inicials preparats:
  - @serveissocialssoller
  - @emergencies112_ib
- X es manté com a accés directe perquè la seva API oficial de lectura és de pagament.
- Facebook queda pendent de Page Public Content Access / permisos de Meta.
- Es manté la correcció de **Ara** de la v0.18: ordre estrictament cronològic, més recent primer.

## Activació de Instagram

Vegeu `META_SETUP.md`. Fins que no existeixin `META_ACCESS_TOKEN` i `META_IG_USER_ID`, la integració Meta es manté preparada però inactiva i no afecta les sis fonts actuals.

## Cost

Cost addicional actual de Sóller Ara: **0 €**.
