#!/usr/bin/env python3
"""Guarda canvis socials validats i retorna un resultat consultable pel panell."""
import copy
import json
import os
import re
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CONFIG_FILE = ROOT / "social_distribution.json"
SOURCES_FILE = ROOT / "sources.json"
RESULTS_FILE = ROOT / "data/social_settings_results.json"


def apply_change(config, sources, change):
    if not isinstance(change, dict) or set(change) - {"base_version", "enabled", "sources"}:
        raise ValueError("Configuración de redes no válida.")
    version = change.get("base_version")
    if type(version) is not int or version < 1 or version != config.get("version"):
        raise ValueError("La configuración ha cambiado. Pulsa Actualizar antes de guardar.")
    if "enabled" in change and type(change["enabled"]) is not bool:
        raise ValueError("Estado de automatización no válido.")
    rules = change.get("sources", {})
    if not isinstance(rules, dict) or len(rules) > 100 or ("enabled" not in change and not rules):
        raise ValueError("No hay cambios válidos para guardar.")
    known = {source["id"] for source in sources.get("sources", [])}
    for source_id, rule in rules.items():
        if (source_id not in known or not isinstance(rule, dict)
                or set(rule) != {"facebook", "instagram"}
                or any(type(value) is not bool for value in rule.values())):
            raise ValueError("La selección de fuentes o redes no es válida.")
    result = copy.deepcopy(config)
    if "enabled" in change:
        result["enabled"] = change["enabled"]
    result.setdefault("sources", {}).update(rules)
    if result != config:
        result["version"] = config["version"] + 1
    return result


def write_json(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def main():
    request_id = os.environ.get("SOCIAL_SETTINGS_REQUEST_ID", "")
    if os.environ.get("SOCIAL_SETTINGS_CONFIRMATION") != "GUARDAR" or not re.fullmatch(r"[a-f0-9-]{36}", request_id):
        raise ValueError("Petición no válida.")
    results = json.loads(RESULTS_FILE.read_text()) if RESULTS_FILE.exists() else {"entries": []}
    if any(entry.get("request_id") == request_id for entry in results["entries"]):
        print("La petición ya se ha procesado.")
        return 0
    result = {"request_id": request_id, "recorded_at": datetime.now(timezone.utc).isoformat()}
    try:
        config = json.loads(CONFIG_FILE.read_text(encoding="utf-8"))
        sources = json.loads(SOURCES_FILE.read_text(encoding="utf-8"))
        change = json.loads(os.environ.get("SOCIAL_SETTINGS_CHANGE", "{}"))
        updated = apply_change(config, sources, change)
        write_json(CONFIG_FILE, updated)
        result.update(ok=True, version=updated["version"])
    except (ValueError, TypeError, KeyError):
        result.update(ok=False, error="No se ha guardado el cambio. Actualiza el panel y revisa la selección; puede haber cambiado en otra sesión.")
    results["entries"] = (results["entries"] + [result])[-30:]
    write_json(RESULTS_FILE, results)
    print("Configuración guardada." if result["ok"] else result["error"])
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
