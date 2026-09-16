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

Repositori `Juanjo-Cp18/soller-ara`:

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

## X i Facebook

X no s'activa automàticament mentre vulguem mantenir el projecte amb cost addicional 0 €, perquè la lectura mitjançant l'API oficial és de pagament.

Per llegir posts públics de pàgines de Facebook que no gestionam, Meta pot requerir **Page Public Content Access** i revisió de l'app. Per això Facebook continua de moment com a accés directe.


## Descobriment automàtic de l'Instagram ID (v0.20)

Quan existeix `META_ACCESS_TOKEN` però no `META_IG_USER_ID`, Sóller Ara prova la consulta oficial de pàgines administrades i cerca la pàgina **Sóller Ara** amb un `instagram_business_account` vinculat.

Només s'escriuen als logs dades no secretes: nom de pàgina, username d'Instagram i identificador numèric. El token mai s'imprimeix.

Si Meta no retorna la pàgina amb un token de sistema, caldrà obtenir l'ID per una altra via oficial i guardar-lo com `META_IG_USER_ID`.
