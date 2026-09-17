#!/usr/bin/env python3
"""Afegeix al registre una acció administrativa ja completada correctament."""

from __future__ import annotations

import json
import os
from pathlib import Path

from activity_log import append_activity

ROOT = Path(__file__).resolve().parents[1]
ACTION = os.environ.get("ACTIVITY_ACTION", "").strip()
AREA = os.environ.get("ACTIVITY_AREA", "").strip()
TARGET_ID = os.environ.get("ACTIVITY_TARGET_ID", "").strip()
TITLE = os.environ.get("ACTIVITY_TITLE", "").strip()
DETAIL = os.environ.get("ACTIVITY_DETAIL", "").strip()


def load(path: Path, fallback):
    if not path.exists():
        return fallback
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return fallback


def infer_title() -> str:
    if TITLE:
        return TITLE
    if AREA == "sources":
        data = load(ROOT / "sources.json", {"sources": []})
        item = next((x for x in data.get("sources", []) if x.get("id") == TARGET_ID), None)
        return str((item or {}).get("name") or TARGET_ID)

    moderation = load(ROOT / "data" / "moderation.json", {"hidden_posts": {}})
    archived = (moderation.get("hidden_posts") or {}).get(TARGET_ID)
    if archived:
        return str(archived.get("title") or TARGET_ID)

    posts = load(ROOT / "data" / "posts.json", {"posts": []})
    item = next((x for x in posts.get("posts", []) if x.get("id") == TARGET_ID), None)
    if item:
        return str(item.get("title") or TARGET_ID)
    return TARGET_ID


def main() -> int:
    if not ACTION or not AREA:
        return 0
    append_activity(
        ACTION,
        area=AREA,
        target_id=TARGET_ID,
        title=infer_title(),
        detail=DETAIL,
    )
    print(f"ACTIVITAT: {AREA}/{ACTION}/{TARGET_ID}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
