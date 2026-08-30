#!/usr/bin/env python3
"""Keep only translations that can be shown to a player.

The extraction tables intentionally contain editor names, resource references,
and implementation strings too.  This filter is the single repeatable policy
for deciding which completed targets may reach the overlay patch.
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any


DEV = Path(__file__).resolve().parents[1]
DATABASE_FILES = {
    "Actors.json",
    "Armors.json",
    "Classes.json",
    "Enemies.json",
    "Items.json",
    "Skills.json",
    "States.json",
    "Weapons.json",
}
MAP_PREFIX = "www/data/Map"
VISIBLE_EVENT_CODES = {102, 401, 402}

# These are runtime fallback strings, not comments, identifiers, or parameter
# keys.  Every other extracted JS target is deliberately left untouched.
VISIBLE_JS = {
    ("www/js/plugins/ItemBook.js", 10),       # Equip fallback shown by ItemBook
    ("www/js/plugins/YEP_QuestJournal.js", 504),  # Cancel fallback in quest list
}


def load(path: Path) -> list[dict[str, Any]]:
    if not path.exists():
        return []
    return [
        json.loads(line)
        for line in path.read_text(encoding="utf-8-sig").splitlines()
        if line.strip()
    ]


def json_allowed(row: dict[str, Any]) -> bool:
    file = row.get("file", "")
    path = row.get("path", "")
    category = row.get("category", "")
    if file.startswith("www/data/") and file.rsplit("/", 1)[-1] in DATABASE_FILES:
        return category == "database_text" and path.rsplit("/", 1)[-1] in {
            "name", "description", "profile"
        }
    if file == "www/data/System.json":
        return path == "/gameTitle" or path.startswith("/terms/")
    if file.startswith(MAP_PREFIX) and file.endswith(".json"):
        # CommonEvents has no map prefix but follows the same event-code rule.
        code = row.get("context", {}).get("event_code")
        return code in VISIBLE_EVENT_CODES and (code == 102 or category == "event_text")
    if file == "www/data/CommonEvents.json":
        code = row.get("context", {}).get("event_code")
        return code in VISIBLE_EVENT_CODES and (code == 102 or category == "event_text")
    return False


def propagate_choice_targets(rows: list[dict[str, Any]]) -> int:
    """Copy reviewed 402 branch labels to the displayed 102 option arrays."""
    reviewed: dict[str, str] = {}
    for row in rows:
        context = row.get("context", {})
        if row.get("target") and context.get("event_code") == 402:
            source = row.get("source", "")
            target = row["target"]
            if source not in reviewed:
                reviewed[source] = target
            elif reviewed[source] != target:
                # Ambiguous source text is not safe to propagate globally.
                reviewed[source] = ""
    changed = 0
    for row in rows:
        context = row.get("context", {})
        if context.get("event_code") != 102 or not row.get("source"):
            continue
        target = reviewed.get(row["source"], "")
        if target and not row.get("target"):
            row["target"] = target
            changed += 1
    return changed


def filter_jsonl(path: Path) -> tuple[int, int]:
    rows = load(path)
    cleared = 0
    kept = 0
    for row in rows:
        if row.get("target") and not json_allowed(row):
            row["target"] = ""
            cleared += 1
        elif row.get("target"):
            kept += 1
    propagated = propagate_choice_targets(rows)
    kept += propagated
    path.write_text(
        "\n".join(json.dumps(row, ensure_ascii=False) for row in rows) + "\n",
        encoding="utf-8",
    )
    return cleared, kept


def filter_js(path: Path) -> tuple[int, int]:
    rows = load(path)
    cleared = 0
    kept = 0
    for row in rows:
        key = (row.get("file", ""), int(row.get("occurrence", 0) or 0))
        if row.get("target") and key not in VISIBLE_JS:
            row["target"] = ""
            cleared += 1
        elif row.get("target"):
            kept += 1
    path.write_text(
        "\n".join(json.dumps(row, ensure_ascii=False) for row in rows) + "\n",
        encoding="utf-8",
    )
    return cleared, kept


def clear_web(path: Path) -> tuple[int, int]:
    rows = load(path)
    cleared = sum(1 for row in rows if row.get("target"))
    for row in rows:
        row["target"] = ""
    path.write_text(
        "\n".join(json.dumps(row, ensure_ascii=False) for row in rows) + "\n",
        encoding="utf-8",
    )
    return cleared, 0


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dev-dir", type=Path, default=DEV)
    args = parser.parse_args()
    dev = args.dev_dir.resolve()
    result = {}
    result["json"] = filter_jsonl(dev / "translations.jsonl")
    result["js"] = filter_js(dev / "js_translations.jsonl")
    result["web"] = clear_web(dev / "web_translations.jsonl")
    print(json.dumps({"cleared": result}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
