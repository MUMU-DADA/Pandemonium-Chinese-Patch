#!/usr/bin/env python3
"""Decode RPG Maker MV encrypted images for visual/OCR review.

Decoded files are written outside the game tree by default and are not part of
the distributable patch.  The key is read from www/data/System.json.
"""
from __future__ import annotations
import argparse, json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DEV = Path(__file__).resolve().parents[1]

def decode(source: Path, destination: Path, key: bytes) -> None:
    payload = source.read_bytes()
    if len(payload) < 16:
        raise ValueError(f"encrypted file is too short: {source}")
    body = payload[16:]
    decoded = bytes(value ^ key[index % len(key)] for index, value in enumerate(body))
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_bytes(decoded)

def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--game-root", type=Path, default=ROOT)
    parser.add_argument("--output", type=Path, default=DEV / "decoded_assets")
    parser.add_argument("--file", type=Path, default=None, help="single .rpgmvp path relative to game root")
    args = parser.parse_args()
    root = args.game_root.resolve()
    system = json.loads((root / "www/data/System.json").read_text(encoding="utf-8"))
    key = bytes.fromhex(system["encryptionKey"])
    if args.file:
        files = [args.file if args.file.is_absolute() else root / args.file]
    else:
        files = sorted((root / "www/img").rglob("*.rpgmvp"))
    count = 0
    for source in files:
        if source.suffix.lower() != ".rpgmvp":
            continue
        relative = source.relative_to(root).with_suffix(".png")
        decode(source, args.output.resolve() / relative, key)
        count += 1
    print(json.dumps({"decoded": count, "output": str(args.output.resolve())}, ensure_ascii=False, indent=2))

if __name__ == "__main__":
    main()
