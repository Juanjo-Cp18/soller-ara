#!/usr/bin/env python3
"""Actualitza data/posts.json a partir de les fonts públiques configurades.

v0.2: suporta RSS/Atom amb llibreries estàndard de Python.
"""

from __future__ import annotations

import hashlib
import html
import json
import re
import sys
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from pathlib import Path
from urllib.request import Request, urlopen
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
SOURCES_FILE = ROOT / "sources.json"
OUTPUT_FILE = ROOT / "data" / "posts.json"
MAX_POSTS_PER_SOURCE = 40
SUMMARY_LIMIT = 260
USER_AGENT = "SollerAra/0.2 (+https://github.com/Juanjo-Cp18/soller-ara)"

CATEGORY_KEYWORDS = {
    "alerts": [
        "alerta", "avís", "avis", "emergència", "emergencia", "meteobal",
        "tall", "tancament", "carretera", "mobilitat", "seguretat", "pluges",
        "tempesta", "inund", "incendi", "112",
    ],
    "agenda": [
        "agenda", "reunió", "reunion", "activitat", "acte", "taller", "jornada",
        "dilluns", "dimarts", "dimecres", "dijous", "divendres", "dissabte", "diumenge",
    ],
    "culture": [
        "cultura", "concert", "exposició", "exposicion", "art", "museu", "literari",
        "festa", "festes", "teatre", "música", "musica",
    ],
    "sports": [
        "esport", "esports", "futbol", "bàsquet", "basquet", "cursa", "club", "torneig",
    ],
    "commerce": [
        "comerç", "comerc", "comercial", "horeca", "restauració", "restauracio",
        "mercat", "empresa", "negoci", "bons comercials",
    ],
}


def clean_text(value: str | None) -> str:
    if not value:
        return ""
    value = re.sub(r"<script\b[^>]*>.*?</script>", " ", value, flags=re.I | re.S)
    value = re.sub(r"<style\b[^>]*>.*?</style>", " ", value, flags=re.I | re.S)
    value = re.sub(r"<[^>]+>", " ", value)
    value = html.unescape(value)
    value = re.sub(r"\s+", " ", value).strip()
    return value


def truncate(value: str, limit: int = SUMMARY_LIMIT) -> str:
    if len(value) <= limit:
        return value
    shortened = value[: limit + 1].rsplit(" ", 1)[0].rstrip(" ,.;:-")
    return f"{shortened}…"


def parse_date(value: str | None) -> str | None:
    if not value:
        return None
    value = value.strip()
    try:
        dt = parsedate_to_datetime(value)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt.isoformat()
    except (TypeError, ValueError, OverflowError):
        pass

    normalized = value.replace("Z", "+00:00")
    try:
        dt = datetime.fromisoformat(normalized)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt.isoformat()
    except ValueError:
        return None


def categorize(title: str, summary: str) -> str:
    text = f"{title} {summary}".lower()
    for category, keywords in CATEGORY_KEYWORDS.items():
        if any(keyword in text for keyword in keywords):
            return category
    return "news"


def stable_id(source_id: str, url: str, title: str) -> str:
    raw = f"{source_id}|{url}|{title}".encode("utf-8")
    return hashlib.sha256(raw).hexdigest()[:20]


def text_of(parent: ET.Element, names: list[str]) -> str:
    for name in names:
        found = parent.find(name)
        if found is not None and found.text:
            return found.text.strip()
    return ""


def parse_rss(xml_bytes: bytes, source: dict) -> list[dict]:
    root = ET.fromstring(xml_bytes)
    items: list[dict] = []

    rss_items = root.findall(".//item")
    if rss_items:
        for item in rss_items[:MAX_POSTS_PER_SOURCE]:
            title = clean_text(text_of(item, ["title"]))
            url = clean_text(text_of(item, ["link", "guid"]))
            summary = truncate(clean_text(text_of(item, ["description", "summary"])))
            published_at = parse_date(text_of(item, ["pubDate", "date", "published", "updated"]))
            if not title or not url:
                continue
            items.append(build_post(source, title, summary, url, published_at))
        return items

    # Atom fallback (namespaces variables segons servidor).
    entries = root.findall(".//{*}entry")
    for entry in entries[:MAX_POSTS_PER_SOURCE]:
        title = clean_text(text_of(entry, ["{*}title"]))
        summary = truncate(clean_text(text_of(entry, ["{*}summary", "{*}content"])))
        published_at = parse_date(text_of(entry, ["{*}published", "{*}updated"]))
        url = ""
        for link in entry.findall("{*}link"):
            href = link.attrib.get("href", "").strip()
            rel = link.attrib.get("rel", "alternate")
            if href and rel in ("alternate", ""):
                url = href
                break
        if not title or not url:
            continue
        items.append(build_post(source, title, summary, url, published_at))
    return items


def build_post(source: dict, title: str, summary: str, url: str, published_at: str | None) -> dict:
    return {
        "id": stable_id(source["id"], url, title),
        "category": categorize(title, summary),
        "source_id": source["id"],
        "source": source["name"],
        "source_type": source.get("source_type", "publisher"),
        "language": source.get("language", "ca"),
        "locality": source.get("locality", "Sóller"),
        "published_at": published_at,
        "title": title,
        "summary": summary,
        "url": url,
    }


def fetch_source(source: dict) -> list[dict]:
    request = Request(
        source["url"],
        headers={
            "User-Agent": USER_AGENT,
            "Accept": "application/rss+xml, application/atom+xml, application/xml, text/xml;q=0.9, */*;q=0.8",
        },
    )
    with urlopen(request, timeout=30) as response:
        payload = response.read()
    if source["type"] in ("rss", "atom"):
        return parse_rss(payload, source)
    raise ValueError(f"Tipus de font no suportat: {source['type']}")


def sort_key(post: dict) -> str:
    return post.get("published_at") or ""


def main() -> int:
    config = json.loads(SOURCES_FILE.read_text(encoding="utf-8"))
    posts: list[dict] = []
    errors: list[dict] = []

    for source in config.get("sources", []):
        if not source.get("enabled", True):
            continue
        try:
            source_posts = fetch_source(source)
            posts.extend(source_posts)
            print(f"OK {source['name']}: {len(source_posts)} publicacions")
        except Exception as exc:  # Es registra l'error sense impedir altres fonts.
            errors.append({"source_id": source.get("id"), "error": str(exc)})
            print(f"ERROR {source.get('name', source.get('id'))}: {exc}", file=sys.stderr)

    # Elimina duplicats per ID i ordena les publicacions més recents primer.
    deduped = {post["id"]: post for post in posts}
    ordered_posts = sorted(deduped.values(), key=sort_key, reverse=True)

    payload = {
        "version": 1,
        "fetched_at": datetime.now(timezone.utc).isoformat(),
        "source_count": len([s for s in config.get("sources", []) if s.get("enabled", True)]),
        "errors": errors,
        "posts": ordered_posts,
    }

    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_FILE.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    if not ordered_posts:
        print("No s'ha obtingut cap publicació; es conserva un JSON vàlid però buit.", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
