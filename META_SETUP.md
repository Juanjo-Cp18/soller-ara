# Configuració de Meta per a Sóller Ara

Aquesta configuració és necessària perquè Sóller Ara pugui descobrir automàticament publicacions d'Instagram de comptes professionals i convertir-les en targetes de `Tot / Ara / Xarxes`.

## Què queda preparat

El codi ja suporta **Instagram Business Discovery**. Quan les credencials existeixin:

1. GitHub Actions consulta Meta.
2. Recupera publicacions recents dels comptes configurats a `social_sources.json`.
3. Sóller Ara crea un títol i resum propi, sense copiar íntegrament el text.
4. La foto, carrusel o Reel es mostra mitjançant l'embed oficial d'Instagram.
5. La publicació conserva sempre l'enllaç original.

## Credencials necessàries

No s'han de guardar mai al repositori ni enviar per xat.

GitHub necessita dos secrets:

- `META_ACCESS_TOKEN`
- `META_IG_USER_ID`

## Preparació a Meta

La via Business Discovery requereix:

- una app de Meta;
- una compte d'Instagram Professional (Business o Creator);
- amb la configuració de Facebook Login de la Instagram API, una pàgina de Facebook vinculada a aquesta compte professional;
- permisos adequats, com `pages_show_list`, `instagram_basic` i `pages_read_engagement`.

És preferible crear una identitat professional pròpia de **Sóller Ara** per mantenir separades les credencials del projecte de qualsevol negoci privat.

## Afegir els secrets a GitHub

Repositori `soller-ara/soller-ara`:

1. Settings.
2. Secrets and variables.
3. Actions.
4. New repository secret.
5. Crear `META_ACCESS_TOKEN`.
6. Crear `META_IG_USER_ID`.

El workflow mai imprimeix el token.

## Comptes preparats inicialment

- @serveissocialssoller
- @emergencies112_ib

Es poden afegir més comptes professionals a `social_sources.json`.

## Per què compartir manualment sí i recopilar automàticament no és el mateix

Compartir una publicació des de Facebook o Instagram és una acció iniciada per una persona dins la plataforma. La publicació continua allotjada a Meta i la plataforma controla en aquell moment si es pot compartir.

Sóller Ara, en canvi, necessita una operació de **lectura automàtica**: consultar periòdicament comptes de tercers, detectar publicacions noves i incorporar-ne la referència al feed sense intervenció humana. Meta tracta aquesta operació com a accés API a contingut de tercers i hi aplica permisos i, segons el cas, revisió de l'app.

Estat verificat del projecte:

- el token actual identifica correctament `@soller.ara` i pot llegir el compte propi;
- la publicació pròpia a Instagram ja s'ha validat;
- les consultes Business Discovery als comptes de tercers configurats retornen l'error Meta `#10 Application does not have permission for this action`;
- per tant, el bloqueig actual és de **permís/revisió de Meta**, no de capacitat tècnica del recopilador.

A Facebook, la via oficial per llegir publicacions públiques de pàgines que no gestionam és **Page Public Content Access**, subjecta a les condicions i revisió de Meta.

A Instagram, Business Discovery permet treballar amb comptes professionals de tercers, però l'accés efectiu depèn dels permisos i del nivell d'accés concedit a l'app. Fins que Meta aprovi aquesta part, Sóller Ara manté les fonts socials de tercers com a complement i prioritza RSS, webs oficials i APIs obertes.

## X i Facebook

X no s'activa automàticament mentre vulguem mantenir el projecte amb cost addicional 0 €, perquè la lectura mitjançant l'API oficial és de pagament.

Per llegir posts públics de pàgines de Facebook que no gestionam, Meta pot requerir **Page Public Content Access** i revisió de l'app. Per això Facebook continua de moment com a accés directe.


## Descobriment automàtic de l'Instagram ID (v0.20)

Quan existeix `META_ACCESS_TOKEN` però no `META_IG_USER_ID`, Sóller Ara prova la consulta oficial de pàgines administrades i cerca la pàgina **Sóller Ara** amb un `instagram_business_account` vinculat.

Només s'escriuen als logs dades no secretes: nom de pàgina, username d'Instagram i identificador numèric. El token mai s'imprimeix.

Si Meta no retorna la pàgina amb un token de sistema, caldrà obtenir l'ID per una altra via oficial i guardar-lo com `META_IG_USER_ID`.
