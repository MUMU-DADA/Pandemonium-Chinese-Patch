#!/usr/bin/env python3
"""Build a root-extractable overlay ZIP from completed translation tables."""
from __future__ import annotations

import argparse
import hashlib
import json
import shutil
import subprocess
import sys
import zipfile
from pathlib import Path


DEV = Path(__file__).resolve().parents[1]
GAME = Path(__file__).resolve().parents[2]


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for block in iter(lambda: f.read(1024 * 1024), b""):
            h.update(block)
    return h.hexdigest()


def completed(path: Path) -> list[dict]:
    if not path.exists():
        return []
    return [json.loads(line) for line in path.read_text(encoding="utf-8").splitlines() if line.strip() and json.loads(line).get("target")]


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--game-root", type=Path, default=GAME)
    parser.add_argument("--dev-dir", type=Path, default=DEV)
    parser.add_argument("--zip", type=Path, default=None)
    args = parser.parse_args()
    game_root = args.game_root.resolve()
    dev = args.dev_dir.resolve()
    # Make packaging deterministic even when tables were edited manually.
    subprocess.run([sys.executable, str(dev / "tools" / "filter_visible_targets.py"), "--dev-dir", str(dev)], check=True)
    build_root = dev / "_package_build"
    if build_root.exists():
        shutil.rmtree(build_root)
    (build_root / "patch").mkdir(parents=True)

    # Apply translations to a temporary copy, then retain only changed files.
    translated_root = build_root / "translated"
    translated_root.mkdir()
    apply_script = dev / "tools" / "apply_translations.py"
    subprocess.run([sys.executable, str(apply_script), "--game-root", str(game_root), "--output-root", str(translated_root), "--jsonl", str(dev / "translations.jsonl"), "--js-jsonl", str(dev / "js_translations.jsonl"), "--web-jsonl", str(dev / "web_translations.jsonl")], check=True)
    changed: list[dict] = []
    for path in translated_root.rglob("*"):
        if not path.is_file():
            continue
        rel = path.relative_to(translated_root).as_posix()
        original = game_root / rel
        destination = build_root / "patch" / rel
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(path, destination)
        changed.append({"file": rel, "originalSha256": sha256(original) if original.exists() else None, "patchSha256": sha256(path), "bytes": path.stat().st_size})

    manifest = {
        "format": 1,
        "game": "PAN-DAE-MON-IUM",
        "engine": "RPG Maker MV / NW.js",
        "mode": "overlay",
        "rootHint": "Extract this ZIP directly into the game root (same folder as Game.exe).",
        "files": changed,
        "generatedFrom": {"gameRoot": "redacted", "versionId": "4139551"},
    }
    (build_root / "patch_manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    for relative in ["安装汉化.cmd", "卸载汉化.cmd", "README_汉化流程.md"]:
        shutil.copy2(dev / relative, build_root / relative)
    (build_root / "tools").mkdir()
    for relative in ["install.ps1", "uninstall.ps1"]:
        shutil.copy2(dev / "tools" / relative, build_root / "tools" / relative)

    output_zip = (args.zip or dev / "PANDAEMONIUM_CN_patch_prepared.zip").resolve()
    if output_zip.exists():
        output_zip.unlink()
    with zipfile.ZipFile(output_zip, "w", compression=zipfile.ZIP_DEFLATED) as archive:
        for path in build_root.rglob("*"):
            if path.is_file() and path.name not in {"translated"}:
                archive.write(path, path.relative_to(build_root).as_posix())
    shutil.rmtree(build_root)
    print(json.dumps({"zip": str(output_zip), "files": len(changed), "translatedEntries": len(completed(dev / "translations.jsonl")) + len(completed(dev / "js_translations.jsonl")) + len(completed(dev / "web_translations.jsonl"))}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
