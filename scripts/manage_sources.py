#!/usr/bin/env python3
"""Activa o desactiva fonts de Sóller Ara de forma segura."""

from __future__ import annotations

import json
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCES_FILE = ROOT / "sources.json"

SOURCE_ID = os.environ.get("SOURCE_ID", "").strip()
SOURCE_ENABLED = os.environ.get("SOURCE_ENABLED", "").strip().lower()
CONFIRMATION = os.environ.get("SOURCE_CONFIRMATION", "").strip()


def main() -> int:
    if CONFIRMATION != "CONFIRMAR":
        print("ERROR: cal escriure CONFIRMAR.", file=sys.stderr)
        return 2
    if not SOURCE_ID:
        print("ERROR: falta SOURCE_ID.", file=sys.stderr)
        return 2
    if SOURCE_ENABLED not in {"true", "false"}:
        print("ERROR: SOURCE_ENABLED ha de ser true o false.", file=sys.stderr)
        return 2

    payload = json.loads(SOURCES_FILE.read_text(encoding="utf-8"))
    sources = payload.get("sources") or []
    target = next((item for item in sources if item.get("id") == SOURCE_ID), None)
    if target is None:
        print(f"ERROR: font no trobada: {SOURCE_ID}", file=sys.stderr)
        return 1

    enabled = SOURCE_ENABLED == "true"
    if bool(target.get("enabled", True)) == enabled:
        print(f"RESULTAT: la font {SOURCE_ID} ja estava {'activa' if enabled else 'desactivada'}.")
        return 0

    target["enabled"] = enabled
    try:
        payload["version"] = int(payload.get("version", 0)) + 1
    except (TypeError, ValueError):
        payload["version"] = 1

    SOURCES_FILE.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"RESULTAT: font {SOURCE_ID} {'activada' if enabled else 'desactivada'}.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
