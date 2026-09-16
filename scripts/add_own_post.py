#!/usr/bin/env python3
"""Afegeix una publicació pròpia de Sóller Ara al feed.

No conté credencials socials. Manté data/manual_posts.json com a font persistent
i actualitza data/posts.json + data/posts.js perquè la publicació aparegui
immediatament sense esperar la següent recopilació horària.
"""

from __future__ import annotations

import hashlib
import html
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
DETAIL_DIR = ROOT / "noticies"
SITE_URL = "https://juanjo-cp18.github.io/soller-ara"

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

    post_url = f"{SITE_URL}/noticies/{post_id}.html"

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
        "url": post_url,
        "content_policy": "owned_content",
        "rights_status": "owned",
        "image_allowed": bool(IMAGE_URL),
    }
    if IMAGE_URL:
        post["media_url"] = IMAGE_URL
        post["media_type"] = "image"

    DETAIL_DIR.mkdir(parents=True, exist_ok=True)
    safe_title = html.escape(TITLE, quote=True)
    safe_body = html.escape(BODY, quote=True)
    safe_url = html.escape(post_url, quote=True)
    safe_image = html.escape(IMAGE_URL, quote=True) if IMAGE_URL else ""
    image_meta = (
        f'<meta property="og:image" content="{safe_image}" />\n'
        f'  <meta name="twitter:image" content="{safe_image}" />'
        if safe_image else ""
    )
    image_html = (
        f'<img class="article-image" src="{safe_image}" alt="" />'
        if safe_image else ""
    )
    detail_html = f"""<!doctype html>
<html lang="{html.escape(LANGUAGE, quote=True)}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#0f766e" />
  <title>{safe_title} · Sóller Ara</title>
  <meta name="description" content="{safe_body[:280]}" />
  <link rel="canonical" href="{safe_url}" />
  <link rel="stylesheet" href="../styles.css?v=0.38" />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="Sóller Ara" />
  <meta property="og:title" content="{safe_title}" />
  <meta property="og:description" content="{safe_body[:280]}" />
  <meta property="og:url" content="{safe_url}" />
  {image_meta}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="{safe_title}" />
  <meta name="twitter:description" content="{safe_body[:280]}" />
</head>
<body>
  <header class="topbar">
    <a class="brand-wrap" href="../index.html" style="text-decoration:none">
      <div class="brand-mark" aria-hidden="true">SA</div>
      <div><h1>Sóller Ara</h1><p>Tot el que passa a Sóller, en un sol lloc.</p></div>
    </a>
  </header>
  <main class="legal-page">
    <a class="legal-back" href="../index.html">← Tornar a Sóller Ara</a>
    <article class="legal-card own-article">
      <p class="eyebrow">Sóller Ara</p>
      <h1>{safe_title}</h1>
      <p class="article-date">{now}</p>
      {image_html}
      <div class="article-body"><p>{safe_body}</p></div>
      <p><a class="origin-link" href="../index.html">Veure més informació a Sóller Ara →</a></p>
    </article>
  </main>
  <footer class="footer"><p>© 2026 Sóller Ara · Projecte sense ànim de lucre</p></footer>
</body>
</html>
"""
    detail_path = DETAIL_DIR / f"{post_id}.html"
    detail_path.write_text(detail_html, encoding="utf-8")

    github_env = os.environ.get("GITHUB_ENV")
    if github_env:
        with open(github_env, "a", encoding="utf-8") as env_file:
            env_file.write(f"OWN_POST_ID={post_id}\n")
            env_file.write(f"OWN_POST_URL={post_url}\n")

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
