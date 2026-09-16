#!/usr/bin/env python3
"""Comprovació de només lectura per a la pàgina Facebook Sóller Ara.

No crea ni publica contingut. Revisa:
- permisos concedits al token de sistema;
- pàgina Sóller Ara accessible;
- tasques de la pàgina, inclosa CREATE_CONTENT quan Meta la retorna.
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


def graph(path: str, params: dict | None = None) -> dict:
    url = f"https://graph.facebook.com/{GRAPH_VERSION}/{path.lstrip('/')}"
    if params:
        url += "?" + urlencode(params)

    request = Request(
        url,
        method="GET",
        headers={
            "Authorization": f"Bearer {TOKEN}",
            "Accept": "application/json",
            "User-Agent": "SollerAra-FacebookCheck/0.28",
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
            message = error.get("message") or f"HTTP {exc.code}"
            code = error.get("code")
            subcode = error.get("error_subcode")
            raise RuntimeError(f"{message} [code={code}, subcode={subcode}]") from exc
        except json.JSONDecodeError:
            raise RuntimeError(f"HTTP {exc.code}: resposta no interpretable") from exc


def main() -> int:
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

        relevant = [
            "pages_show_list",
            "pages_read_engagement",
            "pages_manage_posts",
            "business_management",
            "instagram_basic",
            "instagram_content_publish",
        ]
        for permission in relevant:
            print(
                f"PERMÍS {permission}: "
                + ("CONCEDIT" if permission in granted else "NO CONCEDIT")
            )

        pages = graph(
            "me/accounts",
            params={
                "fields": "id,name,tasks,instagram_business_account{id,username}",
            },
        )

        candidates = []
        for page in pages.get("data") or []:
            name = page.get("name") or ""
            if name.casefold() in {"soller ara", "sóller ara"}:
                candidates.append(page)

        if not candidates and len(pages.get("data") or []) == 1:
            candidates = [pages["data"][0]]

        if len(candidates) != 1:
            raise RuntimeError("No s'ha pogut identificar de forma única la pàgina Sóller Ara.")

        page = candidates[0]
        tasks = page.get("tasks") or []
        print(f"OK pàgina detectada: {page.get('name') or 'Sóller Ara'}")
        print("Tasques de pàgina: " + (", ".join(tasks) if tasks else "cap retornada per Meta"))
        print(
            "CREATE_CONTENT: "
            + ("DISPONIBLE" if "CREATE_CONTENT" in tasks else "NO DISPONIBLE / NO RETORNADA")
        )

        can_publish = "pages_manage_posts" in granted and "CREATE_CONTENT" in tasks
        if can_publish:
            print("RESULTAT: preparat per provar una publicació manual a Facebook.")
        else:
            print("RESULTAT: encara falta almenys un requisit per publicar a Facebook.")
        return 0

    except Exception as exc:
        print(f"ERROR Facebook check: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
