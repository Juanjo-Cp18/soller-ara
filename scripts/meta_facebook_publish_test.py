#!/usr/bin/env python3
"""Publicació manual de prova a la pàgina Facebook Sóller Ara.

Només s'executa des d'un workflow manual amb confirmació explícita.
Publica una imatge pròpia del projecte amb un missatge de prova.
"""

from __future__ import annotations

import json
import os
import sys
from urllib.error import HTTPError
from urllib.parse import urlencode
from urllib.request import Request, urlopen

TOKEN = os.environ.get("META_ACCESS_TOKEN", "").strip()
GRAPH_VERSION = os.environ.get("META_GRAPH_VERSION", "v26.0").strip() or "v26.0"
CONFIRMATION = os.environ.get("PUBLISH_CONFIRMATION", "").strip()
MESSAGE = os.environ.get(
    "PUBLISH_MESSAGE",
    "Prova de publicació de Sóller Ara. Aquesta publicació forma part de la configuració tècnica inicial del projecte.",
).strip()
IMAGE_URL = "https://juanjo-cp18.github.io/soller-ara/assets/meta-test-v2.jpg"


def graph(
    path: str,
    method: str = "GET",
    params: dict | None = None,
    token: str | None = None,
) -> dict:
    url = f"https://graph.facebook.com/{GRAPH_VERSION}/{path.lstrip('/')}"
    data = None

    if method == "GET" and params:
        url += "?" + urlencode(params)
    elif method == "POST":
        data = urlencode(params or {}).encode("utf-8")

    active_token = token or TOKEN

    request = Request(
        url,
        data=data,
        method=method,
        headers={
            "Authorization": f"Bearer {active_token}",
            "Accept": "application/json",
            "User-Agent": "SollerAra-FacebookPublish/0.29",
        },
    )

    try:
        with urlopen(request, timeout=45) as response:
            return json.loads(response.read().decode("utf-8"))
    except HTTPError as exc:
        raw = exc.read().decode("utf-8", errors="replace")
        try:
            payload = json.loads(raw)
            error = payload.get("error") or {}
            message = error.get("message") or f"HTTP {exc.code}"
            code = error.get("code")
            subcode = error.get("error_subcode")
            raise RuntimeError(f"{message} [code={code}, subcode={subcode}]") from exc
        except json.JSONDecodeError:
            raise RuntimeError(f"HTTP {exc.code}: resposta no interpretable") from exc


def discover_page() -> tuple[str, str, str]:
    payload = graph(
        "me/accounts",
        params={"fields": "id,name,access_token,tasks"},
    )

    candidates = []
    for page in payload.get("data") or []:
        page_id = str(page.get("id") or "")
        page_name = page.get("name") or ""
        page_token = str(page.get("access_token") or "")
        tasks = page.get("tasks") or []

        if page_id and page_token:
            candidates.append((page_name, page_id, page_token, tasks))

    for page_name, page_id, page_token, tasks in candidates:
        if page_name.casefold() in {"soller ara", "sóller ara"}:
            if "CREATE_CONTENT" not in tasks:
                raise RuntimeError(
                    "La pàgina Sóller Ara no retorna la tasca CREATE_CONTENT."
                )
            return page_id, page_name, page_token

    if len(candidates) == 1:
        page_name, page_id, page_token, tasks = candidates[0]
        if "CREATE_CONTENT" not in tasks:
            raise RuntimeError(
                "La pàgina disponible no retorna la tasca CREATE_CONTENT."
            )
        return page_id, page_name, page_token

    raise RuntimeError("No s'ha pogut identificar de forma única la pàgina Sóller Ara.")


def main() -> int:
    if CONFIRMATION != "PUBLICAR":
        print(
            "ERROR: confirmació incorrecta. Cal escriure exactament PUBLICAR.",
            file=sys.stderr,
        )
        return 2

    if not TOKEN:
        print("ERROR: falta META_ACCESS_TOKEN", file=sys.stderr)
        return 2

    try:
        permissions_payload = graph("me/permissions")
        granted = {
            item.get("permission")
            for item in (permissions_payload.get("data") or [])
            if item.get("status") == "granted"
        }

        if "pages_manage_posts" not in granted:
            raise RuntimeError("Falta el permís pages_manage_posts.")

        page_id, page_name, page_token = discover_page()
        print(f"OK pàgina detectada: {page_name}")
        print("OK Page Access Token obtingut per a la publicació.")

        published = graph(
            f"{page_id}/photos",
            method="POST",
            params={
                "url": IMAGE_URL,
                "caption": MESSAGE,
                "published": "true",
            },
            token=page_token,
        )

        photo_id = str(published.get("id") or "")
        post_id = str(published.get("post_id") or "")

        if not photo_id and not post_id:
            raise RuntimeError("Meta no ha retornat cap identificador de publicació.")

        print(
            "RESULTAT: publicació creada correctament "
            f"(photo_id={photo_id or 'n/a'}, post_id={post_id or 'n/a'})."
        )
        return 0

    except Exception as exc:
        print(f"ERROR Meta Facebook publish test: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
