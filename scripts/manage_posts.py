#!/usr/bin/env python3
"""Gestiona publicacions pròpies i moderació de Sóller Ara.

Accions:
- delete-own: elimina una publicació pròpia, la seva pàgina i imatge generada.
- hide: oculta qualsevol publicació del feed, incloses les de fonts externes.
- unhide: torna a permetre una publicació prèviament oculta.
"""

from __future__ import annotations

import json
import os
import sys
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
MANUAL_FILE = ROOT / "data" / "manual_posts.json"
MODERATION_FILE = ROOT / "data" / "moderation.json"
POSTS_FILE = ROOT / "data" / "posts.json"
POSTS_JS_FILE = ROOT / "data" / "posts.js"

ACTION = os.environ.get("MODERATION_ACTION", "").strip()
POST_ID = os.environ.get("POST_ID", "").strip()
CONFIRMATION = os.environ.get("MODERATION_CONFIRMATION", "").strip()
NOTE = os.environ.get("MODERATION_NOTE", "").strip()


def load_json(path: Path, fallback: dict) -> dict:
    if not path.exists():
        return fallback
    return json.loads(path.read_text(encoding="utf-8"))


def save_json(path: Path, payload: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def refresh_generated_feed() -> None:
    if not POSTS_FILE.exists():
        return

    payload = load_json(POSTS_FILE, {"posts": []})
    moderation = load_json(MODERATION_FILE, {"hidden_post_ids": []})
    hidden = set(moderation.get("hidden_post_ids") or [])

    manual = load_json(MANUAL_FILE, {"posts": []})
    valid_manual_ids = {item.get("id") for item in (manual.get("posts") or []) if item.get("id")}

    posts = []
    for post in payload.get("posts") or []:
        post_id = post.get("id")
        if post_id in hidden:
            continue
        if post.get("source_type") == "own" and post_id not in valid_manual_ids:
            continue
        posts.append(post)

    payload["posts"] = posts
    payload["post_count"] = len(posts)

    json_payload = json.dumps(payload, ensure_ascii=False, indent=2)
    POSTS_FILE.write_text(json_payload + "\n", encoding="utf-8")
    POSTS_JS_FILE.write_text("window.SOLLER_ARA_DATA = " + json_payload + ";\n", encoding="utf-8")


def delete_own() -> None:
    manual = load_json(MANUAL_FILE, {"version": 1, "posts": []})
    posts = manual.get("posts") or []
    target = next((item for item in posts if item.get("id") == POST_ID), None)

    if target is None:
        raise RuntimeError("No s'ha trobat aquesta publicació pròpia.")

    manual["posts"] = [item for item in posts if item.get("id") != POST_ID]
    save_json(MANUAL_FILE, manual)

    detail = ROOT / "noticies" / f"{POST_ID}.html"
    if detail.exists():
        detail.unlink()

    media_url = str(target.get("media_url") or "")
    if media_url:
        media_name = Path(urlparse(media_url).path).name
        generated = ROOT / "assets" / "generated" / media_name
        if generated.exists() and generated.name.startswith("soller-ara-"):
            generated.unlink()

    moderation = load_json(MODERATION_FILE, {"version": 1, "hidden_post_ids": [], "notes": {}})
    moderation["hidden_post_ids"] = [
        item for item in (moderation.get("hidden_post_ids") or []) if item != POST_ID
    ]
    notes = moderation.setdefault("notes", {})
    notes.pop(POST_ID, None)
    save_json(MODERATION_FILE, moderation)

    refresh_generated_feed()
    print(f"RESULTAT: publicació pròpia eliminada: {POST_ID}")


def hide() -> None:
    moderation = load_json(MODERATION_FILE, {"version": 1, "hidden_post_ids": [], "notes": {}})
    hidden = moderation.setdefault("hidden_post_ids", [])
    if POST_ID not in hidden:
        hidden.append(POST_ID)
    if NOTE:
        moderation.setdefault("notes", {})[POST_ID] = NOTE
    save_json(MODERATION_FILE, moderation)
    refresh_generated_feed()
    print(f"RESULTAT: publicació ocultada: {POST_ID}")


def unhide() -> None:
    moderation = load_json(MODERATION_FILE, {"version": 1, "hidden_post_ids": [], "notes": {}})
    moderation["hidden_post_ids"] = [
        item for item in (moderation.get("hidden_post_ids") or []) if item != POST_ID
    ]
    moderation.setdefault("notes", {}).pop(POST_ID, None)
    save_json(MODERATION_FILE, moderation)
    print(f"RESULTAT: publicació reactivada: {POST_ID}. Tornarà a aparèixer a la pròxima actualització si la font encara la serveix.")


def main() -> int:
    if CONFIRMATION != "CONFIRMAR":
        print("ERROR: cal escriure CONFIRMAR.", file=sys.stderr)
        return 2
    if not POST_ID:
        print("ERROR: falta POST_ID.", file=sys.stderr)
        return 2

    try:
        if ACTION == "delete-own":
            delete_own()
        elif ACTION == "hide":
            hide()
        elif ACTION == "unhide":
            unhide()
        else:
            raise RuntimeError(f"Acció no suportada: {ACTION}")
        return 0
    except Exception as exc:
        print(f"ERROR moderació: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
