# Sóller Ara

Projecte públic i sense ànim de lucre per reunir informació local de Sóller en un sol lloc, mantenint sempre visible la font original i l'accés a la publicació d'origen.

## Versió

**v0.38**

## Novetats de la v0.38

- Sóller Ara admet ara **publicacions pròpies** persistents, que no desapareixen quan s'actualitzen les fonts externes.
- S'afegeix el workflow **Sóller Ara · publicar contingut propi** per crear una entrada pròpia i, opcionalment, publicar-la també a les xarxes pròpies.
- Facebook pot publicar text o text + imatge.
- Instagram es pot seleccionar quan la publicació té una imatge pública; si no hi ha imatge, el flux ho impedeix per evitar una publicació incompleta.
- Les credencials de Meta continuen guardades únicament com a secrets de GitHub i mai s'envien al navegador.
- Les targetes pròpies no mostren l'enllaç «Original», perquè Sóller Ara és la font original.

## Novetats de la v0.37

- TIB mostra ara el títol complet de l'avís i intenta extreure el primer paràgraf informatiu de la pàgina oficial.
- Consell de Mallorca passa a revisar les primeres pàgines de **Totes les notícies**, amb prefiltre per URL abans de descarregar articles.
- El prefiltre local inclou Sóller, Fornalutx, Biniaraix, Serra de Tramuntana, Fàbrica Nova i Torre Picada.
- Es manté el fallback específic per HTML Liferay.

## Novetats de la v0.36

- TIB i Consell de Mallorca deixen de dependre d'un índex extern i es tornen a consultar directament des dels seus webs oficials.
- El recopilador utilitza ara una identificació de navegador compatible amb portals Liferay que serveixen contingut diferent segons el client.
- TIB llegeix els avisos `/es/w/...` i el Consell les notícies de Sala de Premsa, sempre filtrant per rellevància local.

## Novetats de la v0.35

- TIB passa a consultar-se mitjançant un índex de metadades sobre el domini oficial `tib.org`, evitant els problemes del HTML dinàmic de Liferay.
- S'afegeix **Consell de Mallorca** com a font oficial filtrada per Sóller, Port de Sóller, Fornalutx, Biniaraix i Serra de Tramuntana.
- Es crea `META_APP_REVIEW.md` amb el cas d'ús, estat tècnic, criteri de minimització de dades i material pendent per sol·licitar la revisió de Meta.

## Novetats de la v0.34

- S'incorporen els **avisos oficials TIB** relacionats amb Sóller, Port de Sóller, Fornalutx i les línies 203, 204, 231 i 232.
- Els avisos TIB entren directament al feed com a **Alertes**, sense crear un bloc separat que dupliqui informació.
- Es reforça la classificació per titular: detencions, robatoris, accidents, protestes i manifestacions es mantenen a **Notícies** encara que les metadades de la pàgina contenguin paraules d'altres categories.
- Es reforça també la detecció de contingut cultural (Art Sóller, artistes, exposicions, teatre, concerts i havaneres).

## Novetats de la v0.33

- S'elimina de la portada el bloc separat **Emergències i meteorologia** per evitar duplicar avisos que ja entren al feed.
- AEMET continua com a font automàtica: els avisos meteorològics no desapareixen, simplement deixen de tenir un bloc duplicat.
- S'incorporen **Diario de Mallorca**, **Última Hora** i **Mallorca Directo**.
- Diario de Mallorca es consulta mitjançant un índex de metadades de notícies que conserva el **titular, la data i l'URL original de diariodemallorca.es**; això evita la limitació del seu RSS, que només manté una finestra molt curta.
- Última Hora i Mallorca Directo es consulten des de les seves pàgines específiques de Sóller.
- En els mitjans de comunicació es manté la política de mostrar **titular, data i enllaç original**, sense copiar el cos de la notícia.

## Novetats de la v0.32

- S'incorporen **IB3 Notícies** i **dBalears** com a noves fonts automàtiques. IB3 es consulta directament pel seu cercador web de «Sóller» perquè el seu RSS general no sempre reflecteix les notícies més recents.
- Ambdues fonts generals es filtren abans de publicar perquè només entrin peces relacionades amb Sóller, Port de Sóller, la Vall de Sóller o la Serra de Tramuntana.
- Per als mitjans de comunicació es manté la política conservadora: **titular, data i enllaç original**, sense copiar el cos de la notícia.
- La recopilació continua executant-se cada hora mitjançant GitHub Actions i no depèn de Meta.
- La configuració queda preparada per continuar afegint RSS externs sense canviar la interfície de l'app.

## Novetats de la v0.31

- S'afegeix el canal RSS oficial de notícies del **Govern de les Illes Balears**.
- La font es filtra perquè només entrin peces que mencionin Sóller, Port de Sóller o Serra de Tramuntana.
- El filtre per paraules clau queda disponible per afegir més fonts generals sense omplir la portada de contingut no local.
- Els RSS poden configurar ara un `max_items` propi per revisar més entrades quan la font és molt àmplia.
- Aquesta via no depèn de Meta i manté el projecte operatiu encara que l'accés a contingut social públic continuï pendent d'App Review.

## Novetats de la v0.30

- La prioritat passa de publicar a **recopilar informació**.
- Nova prova de només lectura per comprovar si l'accés actual de Meta permet:
  - cercar publicacions recents amb `#soller`;
  - llegir publicacions que etiquetin `@soller.ara`.
- La prova s'executa automàticament una vegada en pujar aquesta versió i també es pot llançar manualment.
- Business Discovery de comptes concrets continua separat i pendent d'accés avançat.
- Cap contingut social de tercers es publica automàticament a Sóller Ara durant aquesta prova.

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
