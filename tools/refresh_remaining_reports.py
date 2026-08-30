#!/usr/bin/env python3
"""Refresh concise reports of intentionally blank translatable records."""
from __future__ import annotations

import json
from pathlib import Path

DEV = Path(__file__).resolve().parents[1]


def load(name: str):
    return [json.loads(line) for line in (DEV / name).read_text(encoding="utf-8-sig").splitlines() if line.strip()]


def write(name: str, lines: list[str]) -> None:
    (DEV / name).write_text("\n".join(lines) + ("\n" if lines else ""), encoding="utf-8")


def main() -> None:
    rows = load("translations.jsonl")
    db = [r for r in rows if r.get("category") == "database_text" and r.get("translatable") and not r.get("target")]
    db_sound = [r for r in db if r.get("file") == "www/data/Animations.json" and r.get("path", "").endswith("/se/name")]
    db_other = [r for r in db if r not in db_sound]
    write("_remaining_db.txt", [f"动画音效资源名（保留原文）：{len(db_sound)} 条"] + sorted({r.get("source", "") for r in db_other}))

    events = [r for r in rows if r.get("category") == "event_text" and r.get("translatable") and not r.get("target")]
    write("_remaining_events.txt", sorted({r.get("source", "") for r in events}))

    web = load("web_translations.jsonl")
    web_blank = [r for r in web if r.get("translatable") and not r.get("target")]
    write("_remaining_web.txt", sorted({r.get("source", "") for r in web_blank}))
    print(json.dumps({"database": len(db), "databaseSoundNames": len(db_sound), "databaseOther": len(db_other), "events": len(events), "web": len(web_blank)}, ensure_ascii=False))


if __name__ == "__main__":
    main()
