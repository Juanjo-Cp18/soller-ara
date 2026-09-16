#!/usr/bin/env python3
"""Afegeix una publicació pròpia de Sóller Ara al feed.

No conté credencials socials. Manté data/manual_posts.json com a font persistent
i actualitza data/posts.json + data/posts.js perquè la publicació aparegui
immediatament sense esperar la següent recopilació horària.
"""

from __future__ import annotations

import hashlib
import json
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MANUAL_FILE = ROOT / "data" / "manual_posts.json"
POSTS_FILE = ROOT / "data" / "posts.json"
POSTS_JS_FILE = ROOT / "data" / "posts.js"

TITLE = os.environ.get("POST_TITLE", "").strip()
BODY = os.environ.get("POST_BODY", "").strip()
CATEGORY = os.environ.get("POST_CATEGORY", "news").strip() or "news"
LANGUAGE = os.environ.get("POST_LANGUAGE", "ca").strip() or "ca"
IMAGE_URL = os.environ.get("POST_IMAGE_URL", "").strip()
CONFIRMATION = os.environ.get("PUBLISH_CONFIRMATION", "").strip()

ALLOWED_CATEGORIES = {
    "news", "agenda", "alerts", "services", "culture", "sports", "commerce"
}


def stable_id(title: str, published_at: str) -> str:
    raw = f"{published_at}|{title}".encode("utf-8")
    return "soller-ara-" + hashlib.sha1(raw).hexdigest()[:16]


def main() -> int:
    if CONFIRMATION != "PUBLICAR":
        print("ERROR: cal escriure PUBLICAR per confirmar.", file=sys.stderr)
        return 2
    if not TITLE:
        print("ERROR: falta el títol.", file=sys.stderr)
        return 2
    if not BODY:
        print("ERROR: falta el text de la publicació.", file=sys.stderr)
        return 2
    if CATEGORY not in ALLOWED_CATEGORIES:
        print(f"ERROR: categoria no vàlida: {CATEGORY}", file=sys.stderr)
        return 2

    now = datetime.now(timezone.utc).isoformat()
    post_id = stable_id(TITLE, now)

    post = {
        "id": post_id,
        "category": CATEGORY,
        "source_id": "soller-ara",
        "source": "Sóller Ara",
        "source_type": "own",
        "language": LANGUAGE,
        "locality": "Sóller",
        "published_at": now,
        "title": TITLE,
        "summary": BODY,
        "url": "https://juanjo-cp18.github.io/soller-ara/",
        "content_policy": "owned_content",
        "rights_status": "owned",
        "image_allowed": bool(IMAGE_URL),
    }
    if IMAGE_URL:
        post["media_url"] = IMAGE_URL
        post["media_type"] = "image"

    if MANUAL_FILE.exists():
        manual = json.loads(MANUAL_FILE.read_text(encoding="utf-8"))
    else:
        manual = {"version": 1, "posts": []}

    manual_posts = manual.get("posts") or []
    manual_posts.append(post)
    manual["posts"] = manual_posts
    MANUAL_FILE.parent.mkdir(parents=True, exist_ok=True)
    MANUAL_FILE.write_text(json.dumps(manual, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    # Actualització immediata del feed generat existent.
    if POSTS_FILE.exists():
        payload = json.loads(POSTS_FILE.read_text(encoding="utf-8"))
    else:
        payload = {
            "version": 37,
            "generator_version": "0.37",
            "fetched_at": now,
            "source_count": 0,
            "source_status": [],
            "social_integration_status": [],
            "post_count": 0,
            "related_pair_count": 0,
            "errors": [],
            "posts": [],
        }

    generated_posts = payload.get("posts") or []
    generated_posts = [item for item in generated_posts if item.get("id") != post_id]
    generated_posts.insert(0, post)
    payload["posts"] = generated_posts
    payload["post_count"] = len(generated_posts)
    payload["fetched_at"] = now

    json_payload = json.dumps(payload, ensure_ascii=False, indent=2)
    POSTS_FILE.write_text(json_payload + "\n", encoding="utf-8")
    POSTS_JS_FILE.write_text("window.SOLLER_ARA_DATA = " + json_payload + ";\n", encoding="utf-8")

    print(f"RESULTAT: publicació pròpia creada amb id={post_id}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
