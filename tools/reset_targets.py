from __future__ import annotations
import json
from pathlib import Path

for name in ("translations.jsonl", "web_translations.jsonl", "js_translations.jsonl"):
    path = Path(__file__).resolve().parents[1] / name
    rows = [json.loads(line) for line in path.read_text(encoding="utf-8-sig").splitlines() if line.strip()]
    for row in rows:
        row["target"] = ""
    path.write_text("\n".join(json.dumps(row, ensure_ascii=False) for row in rows) + "\n", encoding="utf-8")
    print(name, len(rows))
