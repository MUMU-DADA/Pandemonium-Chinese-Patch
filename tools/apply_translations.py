#!/usr/bin/env python3
"""Apply completed translation JSONL files to a clean game copy."""
from __future__ import annotations

import argparse
import ast
import json
import re
import warnings
from collections import defaultdict
from pathlib import Path
from typing import Any

STRING_RE = re.compile(r'"(?:\\.|[^"\\])*"|\'(?:\\.|[^\'\\])*\'|`(?:\\.|[^`\\])*`')
HTML_TEXT_RE = re.compile(r">([^<]+)<")


def unescape(raw: str) -> str:
    if raw.startswith("`"):
        return raw[1:-1]
    try:
        with warnings.catch_warnings():
            warnings.simplefilter("ignore", SyntaxWarning)
            return ast.literal_eval(raw)
    except Exception:
        return raw[1:-1]


def pointer_parts(path: str) -> list[str]:
    if not path or path == "/":
        return []
    return [part.replace("~1", "/").replace("~0", "~") for part in path.lstrip("/").split("/")]


def set_pointer(root: Any, path: str, value: Any) -> None:
    parts = pointer_parts(path)
    if not parts:
        raise ValueError("root replacement is not supported")
    current = root
    for part in parts[:-1]:
        current = current[int(part)] if isinstance(current, list) else current[part]
    leaf = parts[-1]
    if isinstance(current, list):
        current[int(leaf)] = value
    else:
        current[leaf] = value


def load_records(path: Path) -> list[dict[str, Any]]:
    if not path.exists():
        return []
    records = []
    for line_no, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        if not line.strip():
            continue
        record = json.loads(line)
        record["_line"] = line_no
        records.append(record)
    return records


def apply_json(records: list[dict[str, Any]], game_root: Path, output_root: Path) -> set[str]:
    grouped: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for record in records:
        if record.get("kind") == "json" and record.get("target"):
            grouped[record["file"]].append(record)
    changed: set[str] = set()
    for rel, entries in grouped.items():
        source_path = game_root / rel
        data = json.loads(source_path.read_text(encoding="utf-8"))
        for entry in entries:
            parts = pointer_parts(entry["path"])
            current = data
            for part in parts:
                current = current[int(part)] if isinstance(current, list) else current[part]
            if current != entry["source"]:
                raise ValueError(f"source mismatch at {rel}{entry['path']} (line {entry['_line']})")
            set_pointer(data, entry["path"], entry["target"])
        destination = output_root / rel
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
        changed.add(rel)
    return changed


def quote_target(target: str, quote: str) -> str:
    if quote == '"':
        return json.dumps(target, ensure_ascii=False)[1:-1]
    if quote == "'":
        return target.replace("\\", "\\\\").replace("'", "\\'").replace("\n", "\\n").replace("\r", "\\r")
    return target.replace("\\", "\\\\").replace("`", "\\`").replace("\n", "\\n").replace("\r", "\\r")


def apply_js(records: list[dict[str, Any]], game_root: Path, output_root: Path) -> set[str]:
    grouped: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for record in records:
        if record.get("kind") == "js" and record.get("target"):
            grouped[record["file"]].append(record)
    changed: set[str] = set()
    for rel, entries in grouped.items():
        source_path = game_root / rel
        content = source_path.read_text(encoding="utf-8", errors="replace")
        matches = list(STRING_RE.finditer(content))
        for entry in sorted(entries, key=lambda item: int(item["occurrence"]), reverse=True):
            ordinal = 0
            selected = None
            for match in matches:
                raw = match.group(0)
                if not unescape(raw):
                    continue
                ordinal += 1
                if ordinal == int(entry["occurrence"]):
                    selected = match
                    break
            if selected is None:
                raise ValueError(f"JS occurrence not found at {rel}#{entry['occurrence']}")
            raw = selected.group(0)
            if unescape(raw) != entry["source"]:
                raise ValueError(f"JS source mismatch at {rel}#{entry['occurrence']}")
            replacement = raw[0] + quote_target(entry["target"], raw[0]) + raw[-1]
            content = content[:selected.start()] + replacement + content[selected.end():]
            matches = list(STRING_RE.finditer(content))
        destination = output_root / rel
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_text(content, encoding="utf-8")
        changed.add(rel)
    return changed


def apply_web(records: list[dict[str, Any]], game_root: Path, output_root: Path) -> set[str]:
    grouped: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for record in records:
        if record.get("kind") == "web" and record.get("target"):
            grouped[record["file"]].append(record)
    changed: set[str] = set()
    for rel, entries in grouped.items():
        source_path = game_root / rel
        content = source_path.read_text(encoding="utf-8", errors="replace")
        is_html = source_path.suffix.lower() in {".html", ".htm"}
        for entry in sorted(entries, key=lambda item: int(item["occurrence"]), reverse=True):
            ordinal = int(entry["occurrence"])
            source = entry["source"]
            if is_html:
                matches = list(HTML_TEXT_RE.finditer(content))
                if ordinal < 1 or ordinal > len(matches):
                    raise ValueError(f"web source not found at {rel}#{ordinal}")
                selected = matches[ordinal - 1]
                if selected.group(1).strip() != source:
                    raise ValueError(f"web source mismatch at {rel}#{ordinal}")
                replacement = selected.group(1).replace(source, entry["target"], 1)
                content = content[:selected.start(1)] + replacement + content[selected.end(1):]
            else:
                lines = content.splitlines(keepends=True)
                candidates = [i for i, line in enumerate(lines) if re.search(r"[A-Za-z]{2,}", line)]
                if ordinal < 1 or ordinal > len(candidates):
                    raise ValueError(f"web source not found at {rel}#{ordinal}")
                line_index = candidates[ordinal - 1]
                line = lines[line_index]
                if line.strip() != source:
                    raise ValueError(f"web source mismatch at {rel}#{ordinal}")
                lines[line_index] = line.replace(source, entry["target"], 1)
                content = "".join(lines)
        destination = output_root / rel
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_text(content, encoding="utf-8")
        changed.add(rel)
    return changed


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--game-root", type=Path, required=True)
    parser.add_argument("--output-root", type=Path, required=True)
    parser.add_argument("--jsonl", type=Path, default=None)
    parser.add_argument("--js-jsonl", type=Path, default=None)
    parser.add_argument("--web-jsonl", type=Path, default=None)
    args = parser.parse_args()
    args.output_root.mkdir(parents=True, exist_ok=True)
    jsonl = args.jsonl or args.output_root.parent / "translations.jsonl"
    js_jsonl = args.js_jsonl or args.output_root.parent / "js_translations.jsonl"
    web_jsonl = args.web_jsonl or args.output_root.parent / "web_translations.jsonl"
    changed_json = apply_json(load_records(jsonl), args.game_root, args.output_root)
    changed_js = apply_js(load_records(js_jsonl), args.game_root, args.output_root)
    changed_web = apply_web(load_records(web_jsonl), args.game_root, args.output_root)
    print(json.dumps({"changed_json": sorted(changed_json), "changed_js": sorted(changed_js), "changed_web": sorted(changed_web)}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
