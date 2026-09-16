#!/usr/bin/env python3
"""Prova privada de Meta per Sóller Ara.

Valida en mode només lectura l'estat de publicació de l'Instagram propi\n@soller.ara mitjançant content_publishing_limit. No crea ni publica contingut.
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


def graph(path: str, method: str = "GET", params: dict | None = None) -> dict:
    url = f"https://graph.facebook.com/{GRAPH_VERSION}/{path.lstrip('/')}"
    data = None
    if method == "GET" and params:
        url += "?" + urlencode(params)
    elif method == "POST":
        data = urlencode(params or {}).encode("utf-8")

    req = Request(
        url,
        data=data,
        method=method,
        headers={
            "Authorization": f"Bearer {TOKEN}",
            "Accept": "application/json",
            "User-Agent": "SollerAra-MetaSmoke/0.23",
        },
    )
    try:
        with urlopen(req, timeout=30) as response:
            return json.loads(response.read().decode("utf-8"))
    except HTTPError as exc:
        raw = exc.read().decode("utf-8", errors="replace")
        try:
            payload = json.loads(raw)
            err = payload.get("error") or {}
            message = err.get("message") or f"HTTP {exc.code}"
            code = err.get("code")
            subcode = err.get("error_subcode")
            raise RuntimeError(f"{message} [code={code}, subcode={subcode}]") from exc
        except json.JSONDecodeError:
            raise RuntimeError(f"HTTP {exc.code}: resposta no interpretable") from exc


def discover_instagram() -> tuple[str, str]:
    payload = graph(
        "me/accounts",
        params={"fields": "id,name,instagram_business_account{id,username}"},
    )
    candidates = []
    for page in payload.get("data") or []:
        ig = page.get("instagram_business_account") or {}
        if ig.get("id"):
            candidates.append((page.get("name") or "", str(ig["id"]), ig.get("username") or ""))

    for page_name, ig_id, username in candidates:
        if page_name.casefold() in {"soller ara", "sóller ara"}:
            return ig_id, username

    if len(candidates) == 1:
        _, ig_id, username = candidates[0]
        return ig_id, username

    raise RuntimeError("No s'ha pogut identificar de forma única l'Instagram de Sóller Ara.")


def main() -> int:
    if not TOKEN:
        print("ERROR: falta META_ACCESS_TOKEN", file=sys.stderr)
        return 2

    try:
        ig_id, username = discover_instagram()
        print(f"OK compte detectat: @{username or '?'}")

        limit = graph(
            f"{ig_id}/content_publishing_limit",
            params={"fields": "config,quota_usage"},
        )
        data = limit.get("data") or []
        if not isinstance(data, list):
            raise RuntimeError("Resposta inesperada de content_publishing_limit.")

        print(f"OK content_publishing_limit consultat: {len(data)} registre(s)")
        if data:
            first = data[0]
            print(
                "Quota publicada per Meta: "
                f"quota_usage={first.get('quota_usage')} "
                f"config={first.get('config')}"
            )

        print("RESULTAT: el token pot consultar l'estat de publicació. No s'ha creat ni publicat cap contingut.")
        return 0
    except Exception as exc:
        print(f"ERROR Meta smoke test: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
