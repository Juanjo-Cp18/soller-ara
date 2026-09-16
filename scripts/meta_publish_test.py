#!/usr/bin/env python3
"""Publicació manual de prova a l'Instagram propi de Sóller Ara.

Només s'executa des d'un workflow manual amb confirmació explícita.
Publica una imatge pròpia del projecte a @soller.ara.
"""

from __future__ import annotations

import json
import os
import sys
import time
from urllib.error import HTTPError
from urllib.parse import urlencode
from urllib.request import Request, urlopen

TOKEN = os.environ.get("META_ACCESS_TOKEN", "").strip()
GRAPH_VERSION = os.environ.get("META_GRAPH_VERSION", "v26.0").strip() or "v26.0"
CONFIRMATION = os.environ.get("PUBLISH_CONFIRMATION", "").strip()
CAPTION = os.environ.get(
    "PUBLISH_CAPTION",
    "Prova de publicació de Sóller Ara. Aquesta publicació forma part de la configuració tècnica inicial del projecte.",
).strip()
IMAGE_URL = "https://juanjo-cp18.github.io/soller-ara/assets/meta-test.jpg"


def graph(path: str, method: str = "GET", params: dict | None = None, token: str | None = None) -> dict:
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
            "User-Agent": "SollerAra-InstagramPublish/0.26",
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


def discover_instagram() -> tuple[str, str, str]:
    payload = graph(
        "me/accounts",
        params={"fields": "id,name,access_token,instagram_business_account{id,username}"},
    )

    candidates = []
    for page in payload.get("data") or []:
        instagram = page.get("instagram_business_account") or {}
        page_token = str(page.get("access_token") or "")
        if instagram.get("id") and page_token:
            candidates.append(
                (
                    page.get("name") or "",
                    str(instagram["id"]),
                    instagram.get("username") or "",
                    page_token,
                )
            )

    for page_name, ig_id, username, page_token in candidates:
        if page_name.casefold() in {"soller ara", "sóller ara"}:
            return ig_id, username, page_token

    if len(candidates) == 1:
        _, ig_id, username, page_token = candidates[0]
        return ig_id, username, page_token

    raise RuntimeError(
        "No s'ha pogut identificar de forma única l'Instagram de Sóller Ara amb un Page Access Token."
    )


def main() -> int:
    if CONFIRMATION != "PUBLICAR":
        print("ERROR: confirmació incorrecta. Cal escriure exactament PUBLICAR.", file=sys.stderr)
        return 2

    if not TOKEN:
        print("ERROR: falta META_ACCESS_TOKEN", file=sys.stderr)
        return 2

    try:
        ig_id, username, page_token = discover_instagram()
        print(f"OK compte detectat: @{username or '?'}")
        print("OK Page Access Token obtingut per a la publicació.")

        container = graph(
            f"{ig_id}/media",
            method="POST",
            params={
                "image_url": IMAGE_URL,
                "caption": CAPTION,
            },
            token=page_token,
        )

        container_id = str(container.get("id") or "")
        if not container_id:
            raise RuntimeError("Meta no ha retornat cap identificador de contenidor.")

        print(f"OK contenidor creat: {container_id}")
        for attempt in range(12):
            payload = graph(
                container_id,
                params={"fields": "status_code,status"},
                token=page_token,
            )
            status = str(payload.get("status_code") or "").upper()

            if status == "FINISHED":
                print("OK contenidor preparat per publicar.")
                break
            if status in {"ERROR", "EXPIRED"}:
                raise RuntimeError(f"El contenidor ha fallat amb status_code={status}")

            print(f"Esperant contenidor... intent {attempt + 1}/12, estat={status or 'desconegut'}")
            time.sleep(5)
        else:
            raise RuntimeError("El contenidor no ha quedat preparat dins del temps d'espera.")

        published = graph(
            f"{ig_id}/media_publish",
            method="POST",
            params={"creation_id": container_id},
            token=page_token,
        )

        media_id = str(published.get("id") or "")
        if not media_id:
            raise RuntimeError("Meta no ha retornat l'identificador de la publicació.")

        print(f"RESULTAT: publicació creada correctament. media_id={media_id}")
        return 0
    except Exception as exc:
        print(f"ERROR Meta publish test: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
