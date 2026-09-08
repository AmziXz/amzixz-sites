"""Assemble one publishable site into out/<name>/.

The same script runs in CI and on your machine, so what you preview locally is
what gets published - there is no second, different build path to drift.

    py tools/build.py            # both sites
    py tools/build.py services   # just one

Preview:

    py tools/build.py && py -m http.server -d out/main 8080

Standard library only, to match the rest of the toolchain.
"""

from __future__ import annotations

import json
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "out"

# Not web content. These sit in sites/<name>/ so they stay version-controlled,
# and so Claude Code picks up CLAUDE.md while you work, but publishing them
# would put local tooling and working notes on a public site.
#
# LICENSE is deliberately NOT here: it is fine to serve.
EXCLUDE_NAMES = {
    "CLAUDE.md",
    "README.md",
    "package.json",
    "package-lock.json",
    "tsconfig.json",
    "serve.js",
    "serve.py",
    ".gitignore",
    ".gitattributes",
    ".DS_Store",
    "Thumbs.db",
    "desktop.ini",
}

# Whole folders that never ship.
EXCLUDE_DIRS = {
    "node_modules",
    ".claude",
    ".git",
    "docs",          # internal plans and specs - not for the public site
}


def load_sites() -> list[dict]:
    with (ROOT / "sites.json").open(encoding="utf-8") as f:
        return json.load(f)["sites"]


def publishable(rel: Path) -> bool:
    if any(part in EXCLUDE_DIRS for part in rel.parts):
        return False
    return rel.name not in EXCLUDE_NAMES


def copy_tree(src: Path, dest: Path) -> int:
    """Copy src into dest, skipping anything that is not web content."""
    copied = 0
    for path in sorted(src.rglob("*")):
        if not path.is_file():
            continue
        rel = path.relative_to(src)
        if not publishable(rel):
            continue
        target = dest / rel
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(path, target)
        copied += 1
    return copied


def build(site: dict) -> Path:
    name, domain = site["name"], site["domain"]
    src = ROOT / "sites" / name
    if not src.is_dir():
        raise SystemExit(f"no such site folder: {src}")

    dest = OUT / name
    if dest.exists():
        shutil.rmtree(dest)
    dest.mkdir(parents=True)

    n = copy_tree(src, dest)

    # shared/ mirrors a site's own layout, so it merges straight over the top.
    # That is why the fonts live at shared/assets/fonts/: the stylesheets keep
    # asking for assets/fonts/... and never had to change.
    shared = ROOT / "shared"
    n_shared = copy_tree(shared, dest) if shared.is_dir() else 0

    # Without this the force-push in the workflow deletes the CNAME, GitHub
    # Pages quietly falls back to <user>.github.io, and the custom domain
    # "randomly stops working". Generated every time, on purpose.
    (dest / "CNAME").write_text(domain + "\n", encoding="utf-8", newline="\n")

    print(f"{name:<10} {n:>3} files + {n_shared} shared -> out/{name}  (CNAME {domain})")
    return dest


def main(argv: list[str]) -> int:
    sites = load_sites()
    if argv:
        wanted = set(argv)
        known = {s["name"] for s in sites}
        unknown = wanted - known
        if unknown:
            raise SystemExit(f"unknown site(s): {', '.join(sorted(unknown))}; "
                             f"known: {', '.join(sorted(known))}")
        sites = [s for s in sites if s["name"] in wanted]

    for site in sites:
        build(site)
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
