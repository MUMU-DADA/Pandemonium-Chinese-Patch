from __future__ import annotations
import json
import re
from pathlib import Path

for name in ("translations.jsonl", "web_translations.jsonl"):
    path = Path(__file__).resolve().parents[1] / name
    text = path.read_text(encoding="utf-8-sig")
    # A previous bulk reset used the two-character sequence ``\\n`` as the
    # record separator. Split only between adjacent JSON objects so escaped
    # newlines inside source strings remain untouched.
    pattern = re.compile(r"(?<=\})\\n(?=\{)")
    print("separators", len(pattern.findall(text)))
    chunks = pattern.split(text)
    rows = []
    for index, chunk in enumerate(chunks):
        if not chunk.strip():
            continue
        if chunk.endswith("\\n"):
            chunk = chunk[:-2]
        try:
            rows.append(json.loads(chunk))
        except Exception:
            print("bad chunk", index, len(chunk), repr(chunk[:80]), repr(chunk[-80:]))
            raise
    path.write_text("\n".join(json.dumps(row, ensure_ascii=False) for row in rows) + "\n", encoding="utf-8")
    print(name, len(rows))
