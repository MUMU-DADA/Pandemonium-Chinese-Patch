#!/usr/bin/env python3
"""Restore target strings from the previously built patch ZIP."""
from __future__ import annotations

import json
import zipfile
from pathlib import Path

DEV = Path(__file__).resolve().parents[1]
ZIP = DEV / "PANDAEMONIUM_CN_patch_prepared.zip"


def resolve(obj, pointer: str):
    cur = obj
    for part in pointer.lstrip("/").split("/"):
        if not part:
            continue
        part = part.replace("~1", "/").replace("~0", "~")
        cur = cur[int(part)] if isinstance(cur, list) else cur[part]
    return cur


def main() -> None:
    rows_path = DEV / "translations.jsonl"
    rows = [json.loads(line) for line in rows_path.read_text(encoding="utf-8-sig").splitlines() if line.strip()]
    cache = {}
    restored = 0
    with zipfile.ZipFile(ZIP) as zf:
        for row in rows:
            rel = row.get("file", "")
            if not rel.startswith("www/"):
                continue
            name = "patch/" + rel
            if name not in zf.namelist():
                continue
            if rel not in cache:
                try:
                    cache[rel] = json.loads(zf.read(name).decode("utf-8-sig"))
                except Exception:
                    cache[rel] = None
            data = cache[rel]
            if data is None:
                continue
            try:
                value = resolve(data, row.get("path", ""))
            except (KeyError, IndexError, TypeError, ValueError):
                continue
            if isinstance(value, str) and value and value != row.get("source", ""):
                row["target"] = value
                restored += 1
    rows_path.write_text("\n".join(json.dumps(r, ensure_ascii=False) for r in rows) + "\n", encoding="utf-8")
    print(json.dumps({"restored": restored, "rows": len(rows)}, ensure_ascii=False))


if __name__ == "__main__":
    main()
