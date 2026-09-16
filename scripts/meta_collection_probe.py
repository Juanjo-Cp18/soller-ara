#!/usr/bin/env python3
"""Prova de recopilació social per Sóller Ara (només lectura).

Comprova dues vies que no depenen de Business Discovery d'un compte concret:
1) cerca del hashtag #soller;
2) publicacions on l'Instagram propi @soller.ara està etiquetat.

No publica, modifica ni elimina contingut a Meta.
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


def graph(path: str, params: dict | None = None, token: str | None = None) -> dict:
    url = f"https://graph.facebook.com/{GRAPH_VERSION}/{path.lstrip('/')}"
    if params:
        url += "?" + urlencode(params)

    request = Request(
        url,
        method="GET",
        headers={
            "Authorization": f"Bearer {token or TOKEN}",
            "Accept": "application/json",
            "User-Agent": "SollerAra-CollectionProbe/0.30",
        },
    )

    try:
        with urlopen(request, timeout=30) as response:
            return json.loads(response.read().decode("utf-8"))
    except HTTPError as exc:
        raw = exc.read().decode("utf-8", errors="replace")
        try:
            payload = json.loads(raw)
            error = payload.get("error") or {}
            message = str(error.get("message") or f"HTTP {exc.code}")
            code = error.get("code")
            subcode = error.get("error_subcode")
            raise RuntimeError(f"{message} [code={code}, subcode={subcode}]") from exc
        except json.JSONDecodeError:
            raise RuntimeError(f"HTTP {exc.code}: resposta no interpretable") from exc


def discover() -> tuple[str, str, str]:
    payload = graph(
        "me/accounts",
        params={
            "fields": "id,name,access_token,instagram_business_account{id,username}",
        },
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

    raise RuntimeError("No s'ha pogut identificar de forma única @soller.ara.")


def probe_hashtag(ig_id: str, page_token: str) -> None:
    try:
        result = graph(
            "ig_hashtag_search",
            params={"user_id": ig_id, "q": "soller"},
            token=page_token,
        )
        data = result.get("data") or []
        if not data:
            print("HASHTAG #soller: DISPONIBLE, però Meta no ha retornat identificador.")
            return

        hashtag_id = str(data[0].get("id") or "")
        if not hashtag_id:
            print("HASHTAG #soller: resposta sense id.")
            return

        recent = graph(
            f"{hashtag_id}/recent_media",
            params={
                "user_id": ig_id,
                "fields": "id,caption,media_type,permalink,timestamp",
                "limit": 10,
            },
            token=page_token,
        )
        items = recent.get("data") or []
        print(f"HASHTAG #soller: OK · {len(items)} publicacions recents accessibles.")
    except Exception as exc:
        print(f"HASHTAG #soller: BLOQUEJAT · {exc}")


def probe_tagged(ig_id: str, page_token: str) -> None:
    try:
        tagged = graph(
            f"{ig_id}/tags",
            params={
                "fields": "id,caption,media_type,permalink,timestamp,username",
                "limit": 10,
            },
            token=page_token,
        )
        items = tagged.get("data") or []
        print(f"ETIQUETES @soller.ara: OK · {len(items)} publicacions accessibles.")
    except Exception as exc:
        print(f"ETIQUETES @soller.ara: BLOQUEJAT · {exc}")


def main() -> int:
    if not TOKEN:
        print("ERROR: falta META_ACCESS_TOKEN", file=sys.stderr)
        return 2

    try:
        ig_id, username, page_token = discover()
        print(f"OK compte propi detectat: @{username or '?'}")
        probe_hashtag(ig_id, page_token)
        probe_tagged(ig_id, page_token)
        print("RESULTAT: prova de recopilació completada. No s'ha publicat res.")
        return 0
    except Exception as exc:
        print(f"ERROR Collection Probe: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
