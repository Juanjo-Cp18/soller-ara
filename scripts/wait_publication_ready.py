#!/usr/bin/env python3
"""Espera fins que la notícia i la imatge pròpia siguin públiques a GitHub Pages."""

from __future__ import annotations

import os
import sys
import time
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

POST_URL = os.environ.get("OWN_POST_URL", "").strip()
IMAGE_URL = os.environ.get("OWN_IMAGE_URL", "").strip()


def available(url: str) -> bool:
    if not url:
        return True
    req = Request(
        url,
        method="GET",
        headers={
            "User-Agent": "Mozilla/5.0 SollerAra-PublishCheck/0.39",
            "Cache-Control": "no-cache",
        },
    )
    try:
        with urlopen(req, timeout=15) as response:
            return 200 <= response.status < 400
    except (HTTPError, URLError, TimeoutError):
        return False


def main() -> int:
    if not POST_URL:
        print("ERROR: falta OWN_POST_URL", file=sys.stderr)
        return 2

    for attempt in range(30):
        post_ok = available(POST_URL)
        image_ok = available(IMAGE_URL)
        print(
            f"Comprovació pública {attempt + 1}/30: "
            f"notícia={'OK' if post_ok else 'pendent'}, "
            f"imatge={'OK' if image_ok else 'pendent'}"
        )
        if post_ok and image_ok:
            print("RESULTAT: notícia i imatge disponibles públicament.")
            return 0
        time.sleep(5)

    print("ERROR: GitHub Pages no ha publicat encara tots els recursos.", file=sys.stderr)
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
