#!/usr/bin/env python3
"""Clear translations that would rename RPG Maker audio resources."""
from __future__ import annotations

import json
from pathlib import Path

DEV = Path(__file__).resolve().parents[1]
GAME = DEV.parent
AUDIO_DIRS = ["www/audio/se", "www/audio/bgm", "www/audio/bgs", "www/audio/me"]


def stems() -> set[str]:
    values: set[str] = set()
    for rel in AUDIO_DIRS:
        root = GAME / rel
        if not root.exists():
            continue
        for p in root.iterdir():
            if p.is_file():
                values.add(p.stem)
                values.add(p.stem.lower())
    return values


def is_audio_row(row: dict, names: set[str]) -> bool:
    source = row.get("source", "")
    path = row.get("path", "")
    file = row.get("file", "")
    if not row.get("target"):
        return False
    # Plugin parameter literals may also hold audio filenames.
    if file.lower().endswith((".js", ".json")) and source.lower() in names:
        if file.endswith(".js"):
            return True
    # Animation timing SE names.
    if file == "www/data/Animations.json" and "/timings/" in path and path.endswith("/se/name"):
        return True
    # System-level BGM/ME/SE names.
    if file == "www/data/System.json" and (
        path.endswith("/bgm/name") or path.endswith("/name") and any(x in path for x in ("/sounds/", "/battleBgm", "/defeatMe", "/victoryMe", "/titleBgm"))
    ):
        return source in names or source.lower() in names
    # Event command audio parameters (Play BGM/BGS/ME/SE and change battle BGM).
    if path.endswith("/name") and row.get("context", {}).get("event_code") in {132, 133, 245, 249, 250, 251, 252, 253}:
        return source in names or source.lower() in names
    # Any explicitly extracted audio-path record.
    if "audio/" in path.lower() or "/se/" in path.lower() or "/bgm/" in path.lower() or "/bgs/" in path.lower() or "/me/" in path.lower():
        return source in names or source.lower() in names
    return False


def sanitize_jsonl(path: Path, names: set[str]) -> int:
    rows = [json.loads(line) for line in path.read_text(encoding="utf-8-sig").splitlines() if line.strip()]
    cleared = 0
    for row in rows:
        if is_audio_row(row, names):
            row["target"] = ""
            cleared += 1
    path.write_text("\n".join(json.dumps(r, ensure_ascii=False) for r in rows) + "\n", encoding="utf-8")
    return cleared


def main() -> None:
    names = stems()
    total = sanitize_jsonl(DEV / "translations.jsonl", names)
    total += sanitize_jsonl(DEV / "js_translations.jsonl", names)
    print(json.dumps({"audioStems": len(names), "cleared": total}, ensure_ascii=False))


if __name__ == "__main__":
    main()
