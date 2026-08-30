#!/usr/bin/env python3
"""Restore reviewed web/tile-label targets from the previous patch ZIP."""
from __future__ import annotations

import json
import zipfile
from pathlib import Path

DEV = Path(__file__).resolve().parents[1]


def main() -> None:
    path = DEV / "web_translations.jsonl"
    rows = [json.loads(line) for line in path.read_text(encoding="utf-8-sig").splitlines() if line.strip()]
    cache = {}
    restored = 0
    with zipfile.ZipFile(DEV / "PANDAEMONIUM_CN_patch_prepared.zip") as zf:
        for row in rows:
            rel = row.get("file", "")
            name = "patch/" + rel
            if name not in zf.namelist():
                continue
            if rel not in cache:
                cache[rel] = zf.read(name).decode("utf-8-sig").splitlines()
            lines = cache[rel]
            index = int(row.get("occurrence", 0)) - 1
            if index < 0 or index >= len(lines):
                continue
            value = lines[index]
            if value and value != row.get("source", "") and row.get("source", "").strip():
                row["target"] = value
                restored += 1
    path.write_text("\n".join(json.dumps(r, ensure_ascii=False) for r in rows) + "\n", encoding="utf-8")
    print(json.dumps({"restored": restored, "rows": len(rows)}, ensure_ascii=False))


if __name__ == "__main__":
    main()
