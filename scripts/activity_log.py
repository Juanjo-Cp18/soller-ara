#!/usr/bin/env python3
"""Registre compacte d'activitat administrativa de Sóller Ara."""

from __future__ import annotations

import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ACTIVITY_FILE = ROOT / "data" / "activity_log.json"
MAX_ENTRIES = 250


def _load() -> dict:
    if not ACTIVITY_FILE.exists():
        return {"version": 1, "entries": []}
    try:
        payload = json.loads(ACTIVITY_FILE.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        payload = {"version": 1, "entries": []}
    if not isinstance(payload.get("entries"), list):
        payload["entries"] = []
    payload.setdefault("version", 1)
    return payload


def append_activity(
    action: str,
    *,
    area: str,
    target_id: str = "",
    title: str = "",
    detail: str = "",
) -> None:
    now = datetime.now(timezone.utc).isoformat()
    raw_id = f"{now}|{action}|{area}|{target_id}|{title}".encode("utf-8")
    entry = {
        "id": hashlib.sha1(raw_id).hexdigest()[:16],
        "timestamp": now,
        "action": action,
        "area": area,
        "target_id": target_id,
        "title": title,
        "detail": detail,
        "status": "success",
    }

    payload = _load()
    entries = [entry] + [item for item in payload["entries"] if item.get("id") != entry["id"]]
    payload["entries"] = entries[:MAX_ENTRIES]
    ACTIVITY_FILE.parent.mkdir(parents=True, exist_ok=True)
    ACTIVITY_FILE.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
