#!/usr/bin/env python3
"""Prepara una cua segura de publicacions recopilades per a Facebook/Instagram.

- No publica res per si mateix.
- Només selecciona contingut recent i no publicat abans.
- Respecta moderació, fonts desactivades, categories i configuració social.
- Per Instagram genera una targeta pròpia de Sóller Ara; no reutilitza imatges de tercers.
"""

from __future__ import annotations

import json
from datetime import datetime, timedelta, timezone
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
CONFIG_FILE = ROOT / "social_distribution.json"
POSTS_FILE = ROOT / "data" / "posts.json"
LOG_FILE = ROOT / "data" / "social_publish_log.json"
QUEUE_FILE = ROOT / "data" / "social_auto_queue.json"
MODERATION_FILE = ROOT / "data" / "moderation.json"
SOURCES_FILE = ROOT / "sources.json"
CARD_DIR = ROOT / "assets" / "generated" / "social"
RAW_BASE = "https://raw.githubusercontent.com/soller-ara/soller-ara/main/assets/generated/social"


def load_json(path: Path, fallback: dict) -> dict:
    if not path.exists():
        return fallback
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return fallback


def parse_date(value: str | None) -> datetime | None:
    if not value:
        return None
    try:
        dt = datetime.fromisoformat(str(value).replace("Z", "+00:00"))
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt.astimezone(timezone.utc)
    except ValueError:
        return None


def load_font(size: int, bold: bool = False):
    candidates = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf",
    ]
    for candidate in candidates:
        try:
            return ImageFont.truetype(candidate, size=size)
        except OSError:
            continue
    return ImageFont.load_default()


def wrap(draw: ImageDraw.ImageDraw, text: str, font, max_width: int) -> list[str]:
    words = str(text or "").split()
    lines: list[str] = []
    current = ""
    for word in words:
        candidate = word if not current else f"{current} {word}"
        box = draw.textbbox((0, 0), candidate, font=font)
        if box[2] - box[0] <= max_width:
            current = candidate
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def generate_card(post: dict) -> str:
    CARD_DIR.mkdir(parents=True, exist_ok=True)
    post_id = str(post.get("id") or "")
    path = CARD_DIR / f"{post_id}.jpg"

    width, height = 1080, 1350
    image = Image.new("RGB", (width, height), "#f6f7f5")
    draw = ImageDraw.Draw(image)
    primary = "#0f766e"
    text_color = "#172421"
    muted = "#687673"

    draw.rounded_rectangle((70, 70, width - 70, height - 70), radius=52, fill="#ffffff")
    draw.rounded_rectangle((110, 110, 270, 270), radius=42, fill=primary)

    logo_font = load_font(68, True)
    brand_font = load_font(38, True)
    title_font = load_font(66, True)
    source_font = load_font(34, True)
    small_font = load_font(30, False)

    draw.text((142, 148), "SA", font=logo_font, fill="#ffffff")
    draw.text((310, 140), "SÓLLER ARA", font=brand_font, fill=primary)
    draw.text((310, 202), str(post.get("category") or "news").upper(), font=small_font, fill=muted)

    lines = wrap(draw, str(post.get("title") or ""), title_font, width - 220)
    if len(lines) > 7:
        lines = lines[:7]
        lines[-1] = lines[-1].rstrip(" .,:;") + "…"

    y = 390
    for line in lines:
        draw.text((110, y), line, font=title_font, fill=text_color)
        box = draw.textbbox((0, 0), line, font=title_font)
        y += (box[3] - box[1]) + 22

    draw.line((110, height - 270, width - 110, height - 270), fill="#dde5e2", width=3)
    draw.text((110, height - 215), f"Font: {post.get('source') or 'Font original'}", font=source_font, fill=text_color)
    draw.text((110, height - 155), "Informació recopilada per Sóller Ara", font=small_font, fill=muted)

    image.save(path, "JPEG", quality=92, optimize=True)
    return f"{RAW_BASE}/{post_id}.jpg"


def success_pairs(log: dict) -> set[tuple[str, str]]:
    pairs: set[tuple[str, str]] = set()
    for entry in log.get("entries") or []:
        if entry.get("status") == "success" and entry.get("post_id") and entry.get("platform"):
            pairs.add((str(entry["post_id"]), str(entry["platform"])))
    return pairs


def save_queue(payload: dict) -> None:
    QUEUE_FILE.parent.mkdir(parents=True, exist_ok=True)
    QUEUE_FILE.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def main() -> int:
    config = load_json(CONFIG_FILE, {"enabled": False})
    if not config.get("enabled"):
        save_queue({"version": 1, "enabled": False, "entries": []})
        print("SOCIAL_AUTO: desactivat; cua buida.")
        return 0

    posts_payload = load_json(POSTS_FILE, {"posts": []})
    log = load_json(LOG_FILE, {"entries": []})
    moderation = load_json(MODERATION_FILE, {"hidden_post_ids": []})
    source_payload = load_json(SOURCES_FILE, {"sources": []})

    hidden = set(moderation.get("hidden_post_ids") or [])
    active_sources = {
        str(item.get("id"))
        for item in (source_payload.get("sources") or [])
        if item.get("id") and item.get("enabled", True) is not False
    }
    published = success_pairs(log)

    global_platforms = config.get("platforms") or {}
    categories = config.get("categories") or {}
    source_rules = config.get("sources") or {}
    max_age = int(config.get("max_age_hours", 6) or 6)
    max_posts = max(1, int(config.get("max_posts_per_run", 3) or 3))
    one_per_source = bool(config.get("one_post_per_source_per_run", True))
    threshold = datetime.now(timezone.utc) - timedelta(hours=max_age)

    candidates: list[dict] = []
    for post in posts_payload.get("posts") or []:
        post_id = str(post.get("id") or "")
        source_id = str(post.get("source_id") or "")
        category = str(post.get("category") or "news")
        if not post_id or post.get("source_type") == "own":
            continue
        if post_id in hidden or source_id not in active_sources:
            continue
        if categories.get(category, True) is False:
            continue

        published_at = parse_date(post.get("published_at"))
        if published_at is None or published_at < threshold:
            continue

        rules = source_rules.get(source_id)
        if not isinstance(rules, dict):
            continue

        platforms: list[str] = []
        for platform in ("facebook", "instagram"):
            if global_platforms.get(platform, False) and rules.get(platform, False):
                if (post_id, platform) not in published:
                    platforms.append(platform)
        if not platforms:
            continue

        item = dict(post)
        item["_published_at"] = published_at
        item["_platforms"] = platforms
        candidates.append(item)

    candidates.sort(key=lambda x: x["_published_at"], reverse=True)

    selected: list[dict] = []
    used_sources: set[str] = set()
    for post in candidates:
        source_id = str(post.get("source_id") or "")
        if one_per_source and source_id in used_sources:
            continue
        used_sources.add(source_id)
        selected.append(post)
        if len(selected) >= max_posts:
            break

    queue_entries: list[dict] = []
    for post in selected:
        platforms = list(post.pop("_platforms"))
        post.pop("_published_at", None)
        image_url = generate_card(post) if "instagram" in platforms else ""
        queue_entries.append({
            "post_id": post.get("id"),
            "title": post.get("title"),
            "summary": post.get("summary") or "",
            "source": post.get("source"),
            "source_id": post.get("source_id"),
            "source_type": post.get("source_type"),
            "category": post.get("category"),
            "language": post.get("language"),
            "published_at": post.get("published_at"),
            "original_url": post.get("url"),
            "content_policy": post.get("content_policy"),
            "rights_status": post.get("rights_status"),
            "platforms": platforms,
            "image_url": image_url,
        })

    payload = {
        "version": 1,
        "enabled": True,
        "generated_at": datetime.now(timezone.utc).isoformat() if queue_entries else None,
        "entries": queue_entries,
    }
    save_queue(payload)
    print(f"SOCIAL_AUTO: {len(queue_entries)} publicacions preparades.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
