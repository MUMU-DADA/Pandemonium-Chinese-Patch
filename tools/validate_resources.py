#!/usr/bin/env python3
"""Audit the applied overlay for resource-name and whitelist regressions."""
from __future__ import annotations

import argparse
import json
import zipfile
from pathlib import Path
from typing import Any, Iterator

from filter_visible_targets import VISIBLE_JS, json_allowed, load


DEV = Path(__file__).resolve().parents[1]
GAME = DEV.parent


def effective(game: Path, patch: Path, rel: str) -> Path:
    candidate = patch / rel
    return candidate if candidate.exists() else game / rel


def audio_objects(value: Any, pointer: str = "") -> Iterator[tuple[str, str]]:
    if isinstance(value, dict):
        if isinstance(value.get("name"), str) and {"volume", "pitch"}.issubset(value):
            yield pointer + "/name", value["name"]
        for key, child in value.items():
            escaped = str(key).replace("~", "~0").replace("/", "~1")
            yield from audio_objects(child, pointer + "/" + escaped)
    elif isinstance(value, list):
        for index, child in enumerate(value):
            yield from audio_objects(child, pointer + f"/{index}")


def audio_snapshot(game: Path, patch: Path) -> dict[str, str]:
    result: dict[str, str] = {}
    for original in sorted((game / "www/data").glob("*.json")):
        rel = original.relative_to(game).as_posix()
        data = json.loads(effective(game, patch, rel).read_text(encoding="utf-8-sig"))
        for pointer, name in audio_objects(data):
            result[f"{rel}{pointer}"] = name
    return result


def animation_names(game: Path, patch: Path) -> list[str | None]:
    rel = "www/data/Animations.json"
    data = json.loads(effective(game, patch, rel).read_text(encoding="utf-8-sig"))
    return [entry.get("name") if isinstance(entry, dict) else None for entry in data]


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--game-root", type=Path, default=GAME)
    parser.add_argument("--patch-root", type=Path, default=DEV / "_apply_final")
    parser.add_argument("--zip", type=Path, default=DEV / "PANDAEMONIUM_CN_patch_prepared.zip")
    args = parser.parse_args()
    game = args.game_root.resolve()
    patch = args.patch_root.resolve()
    no_patch = game / "__cnpatch_no_overlay__"

    original_audio = audio_snapshot(game, no_patch)
    patched_audio = audio_snapshot(game, patch)
    original_animation_names = animation_names(game, no_patch)
    patched_animation_names = animation_names(game, patch)

    invalid_json = [row["id"] for row in load(DEV / "translations.jsonl") if row.get("target") and not json_allowed(row)]
    invalid_js = [
        row["id"]
        for row in load(DEV / "js_translations.jsonl")
        if row.get("target") and (row.get("file"), int(row.get("occurrence", 0) or 0)) not in VISIBLE_JS
    ]
    web_targets = sum(1 for row in load(DEV / "web_translations.jsonl") if row.get("target"))

    forbidden_zip: list[str] = []
    if args.zip.exists():
        with zipfile.ZipFile(args.zip) as archive:
            for name in archive.namelist():
                lower = name.lower()
                if lower.startswith("patch/www/img/tilesets/") and lower.endswith(".txt"):
                    forbidden_zip.append(name)
                if lower in {
                    "patch/www/data/animations.json",
                    "patch/www/data/mapinfos.json",
                    "patch/www/data/tilesets.json",
                    "patch/www/data/troops.json",
                }:
                    forbidden_zip.append(name)

    result = {
        "audioReferences": len(original_audio),
        "audioNamesUnchanged": original_audio == patched_audio,
        "animationNamesUnchanged": original_animation_names == patched_animation_names,
        "invalidJsonTargets": len(invalid_json),
        "invalidJsTargets": len(invalid_js),
        "webTargets": web_targets,
        "forbiddenZipEntries": forbidden_zip,
    }
    result["ok"] = all(
        [
            result["audioNamesUnchanged"],
            result["animationNamesUnchanged"],
            not invalid_json,
            not invalid_js,
            web_targets == 0,
            not forbidden_zip,
        ]
    )
    print(json.dumps(result, ensure_ascii=False, indent=2))
    raise SystemExit(0 if result["ok"] else 1)


if __name__ == "__main__":
    main()
