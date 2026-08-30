#!/usr/bin/env python3
"""Apply only reviewed exact translations after restoring the prior patch."""
from __future__ import annotations

import json
from pathlib import Path

from translate_local import PHRASES

DEV = Path(__file__).resolve().parents[1]
VISIBLE_DB = {"Actors.json", "Armors.json", "Classes.json", "Enemies.json", "Items.json", "Skills.json", "States.json", "Weapons.json"}


def main() -> None:
    path = DEV / "translations.jsonl"
    rows = [json.loads(line) for line in path.read_text(encoding="utf-8-sig").splitlines() if line.strip()]
    filled = 0
    for row in rows:
        if not row.get("translatable") or row.get("target"):
            continue
        source = row.get("source", "")
        exact = PHRASES.get(source)
        file_name = Path(row.get("file", "")).name
        if row.get("category") == "database_text":
            # Names/descriptions in the player database are visible; map/event
            # labels, BGM and sound filenames are intentionally excluded.
            if file_name not in VISIBLE_DB or not row.get("path", "").endswith(("/name", "/description", "/profile")):
                continue
        elif row.get("category") != "event_text":
            continue
        # A few control-code-heavy reactions are easier to review by shape;
        # preserve every literal RPG Maker control while translating speech.
        if row.get("category") == "event_text":
            if source == r"\n<Orobas>I'm":
                exact = r'\n<Orobas>我是'
            elif source.endswith(r'Hm.\.\. Hm.\.\. Hah.'):
                exact = source.replace("Hm.", "嗯。", 2).replace("Hah.", "哈。")
            elif source.startswith(r'\n<???>I wonder.'):
                exact = source.replace("I wonder", "我想知道", 1)
            elif source.startswith(r'\n<???>Po'):
                exact = source.replace("Po", "噗", 1).replace("po", "噗")
            elif source.startswith(r'\n<Kushiel>.') or source.startswith(r'\n<Zepar>.'):
                # Punctuation-only pause; keep the controls but normalize the
                # visible periods to Chinese ellipsis.
                exact = source.replace(".", "", 1) + "……"
            elif "Ferryman's First Rule:" in source:
                exact = source.replace('"Ferryman\'s First Rule:"', '“摆渡人的第一条规则：”')
            elif "Ferryman's Second Rule:" in source:
                exact = source.replace('"Ferryman\'s Second Rule:"', '“摆渡人的第二条规则：”')
            elif "Ferryman's Third Rule:" in source:
                exact = source.replace('"Ferryman\'s Third Rule:"', '“摆渡人的第三条规则：”')
            elif source.endswith(">..."):
                exact = source[:-3] + "\u2026\u2026"
        if exact and exact != source:
            row["target"] = exact
            filled += 1
    path.write_text("\n".join(json.dumps(r, ensure_ascii=False) for r in rows) + "\n", encoding="utf-8")
    print(json.dumps({"filled": filled, "rows": len(rows)}, ensure_ascii=False))


if __name__ == "__main__":
    main()
