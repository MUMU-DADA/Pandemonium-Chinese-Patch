from __future__ import annotations
import json
import re
from pathlib import Path

token = re.compile(r"\\\\[A-Za-z.!|^]+|%\d+|<[^>]+>")
bad = []
for name in ("translations.jsonl", "js_translations.jsonl", "web_translations.jsonl"):
    path = Path(__file__).resolve().parents[1] / name
    for line_no, line in enumerate(path.read_text(encoding="utf-8-sig").splitlines(), 1):
        row = json.loads(line)
        if row.get("target") and sorted(token.findall(row.get("source", ""))) != sorted(token.findall(row["target"])):
            bad.append({"file": name, "line": line_no, "id": row.get("id")})
print(json.dumps({"tokenViolations": len(bad), "samples": bad[:10]}, ensure_ascii=False, indent=2))
raise SystemExit(1 if bad else 0)
