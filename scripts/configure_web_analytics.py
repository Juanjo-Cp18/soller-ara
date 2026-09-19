#!/usr/bin/env python3
"""Prepare Cloudflare Web Analytics locally; preview by default, never deploy."""

import argparse
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
LOADER = """// Public Cloudflare Web Analytics site token, never an API credential.
(() => {
  const token = "__SITE_TOKEN__";
  const path = window.location.pathname;
  if (window.location.origin !== "https://soller-ara.github.io" ||
      !path.startsWith("/soller-ara/") ||
      path.startsWith("/soller-ara/admin/") || path === "/soller-ara/admin" ||
      navigator.doNotTrack === "1" || navigator.globalPrivacyControl === true ||
      document.querySelector("script[data-cf-beacon]")) return;
  const beacon = document.createElement("script");
  beacon.type = "module";
  beacon.src = "https://static.cloudflareinsights.com/beacon.min.js";
  beacon.defer = true;
  beacon.setAttribute("data-cf-beacon", JSON.stringify({ token }));
  document.head.appendChild(beacon);
})();
"""


def with_loader(content, prefix):
    if 'src="' + prefix + 'analytics.js' in content:
        return content
    if content.count("</body>") != 1:
        raise ValueError("Expected exactly one closing body tag")
    return content.replace("</body>", f'  <script src="{prefix}analytics.js?v=1" defer></script>\n</body>')


def prepare(root, token):
    changes = {root / "analytics.js": LOADER.replace("__SITE_TOKEN__", token)}
    for filename in ("index.html", "enllacos.html", "privacy.html", "data-deletion.html"):
        path = root / filename
        content = path.read_text(encoding="utf-8")
        updated = with_loader(content, "")
        if updated != content:
            changes[path] = updated
    for path in sorted((root / "noticies").glob("*.html")):
        content = path.read_text(encoding="utf-8")
        updated = with_loader(content, "../")
        if updated != content:
            changes[path] = updated
    for filename in ("add_own_post.py", "edit_own_post.py"):
        path = root / "scripts" / filename
        content = path.read_text(encoding="utf-8")
        updated = with_loader(content, "../")
        if updated != content:
            changes[path] = updated
    return changes


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--token", default="", help="Public token from the Cloudflare Web Analytics snippet")
    parser.add_argument("--apply", action="store_true", help="Write local files; does not publish")
    args = parser.parse_args()
    if args.token and not re.fullmatch(r"[a-fA-F0-9]{32}", args.token):
        parser.error("Expected a 32-character hexadecimal site token, not an API credential")
    if args.apply and not args.token:
        parser.error("A verified public site token is required to apply")
    changes = prepare(ROOT, args.token)
    for path in changes:
        print(path.relative_to(ROOT))
    if args.apply:
        for path, content in changes.items():
            path.write_text(content, encoding="utf-8")
        print("Local files prepared. Update privacy information before publishing.")
    else:
        print("Preview only: no files changed and no analytics enabled.")


if __name__ == "__main__":
    main()
