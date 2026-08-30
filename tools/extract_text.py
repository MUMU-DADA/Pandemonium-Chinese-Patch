#!/usr/bin/env python3
"""Extract RPG Maker MV text and resource metadata for localization work.

The extractor intentionally records every non-empty JSON string.  Records that
look like dialogue/menu text are marked translatable; technical values remain in
the table with review=false so nothing is silently lost.
"""
from __future__ import annotations

import argparse
import ast
import hashlib
import json
import re
import shutil
import warnings
from pathlib import Path
from typing import Any, Iterable


ROOT = Path(__file__).resolve().parents[2]
DEV = Path(__file__).resolve().parents[1]


def pointer(parts: Iterable[Any]) -> str:
    return "/" + "/".join(str(p).replace("~", "~0").replace("/", "~1") for p in parts)


def text_key(parts: list[Any]) -> str:
    return str(parts[-1]).lower() if parts else ""


def command_context(stack: list[Any]) -> int | None:
    for value in reversed(stack):
        if isinstance(value, dict) and isinstance(value.get("code"), int):
            return value["code"]
    return None


def context_for(file_name: str, parts: list[Any], stack: list[Any]) -> dict[str, Any]:
    result: dict[str, Any] = {"file": file_name}
    if file_name.startswith("Map"):
        result["map"] = file_name[:-5]
    if parts and isinstance(parts[0], int):
        result["record_id"] = parts[0]
        if file_name == "CommonEvents.json":
            result["common_event_id"] = parts[0]
    for i, part in enumerate(parts):
        if part == "events" and i + 1 < len(parts):
            result["event_id"] = parts[i + 1]
        if part == "pages" and i + 1 < len(parts):
            result["page"] = parts[i + 1]
        if part == "list" and i + 1 < len(parts):
            result["command_index"] = parts[i + 1]
    code = command_context(stack)
    if code is not None:
        result["event_code"] = code
    for value in reversed(stack):
        if isinstance(value, dict) and value.get("name") and "event_id" in result:
            result["event_name"] = value["name"]
            break
    return result


def is_translatable_json(parts: list[Any], stack: list[Any]) -> tuple[bool, str]:
    key = text_key(parts)
    code = command_context(stack)
    if code in {401, 405, 402, 403, 404, 655}:
        return True, "event_text"
    if key in {
        "name", "nickname", "profile", "description", "displayname", "gametitle",
        "currencyunit", "title1name", "title2name", "message", "actionfailure",
        "actor damage", "text", "elements", "skilltypes", "weapontypes", "armortypes",
        "equiptypes", "switches", "variables", "basic", "commands", "params",
    }:
        return True, "database_text"
    if key in {"note", "script", "parameters"}:
        return True, "mixed_or_plugin_text"
    return False, "technical_or_resource"


def walk_json(value: Any, parts: list[Any], stack: list[Any], file_name: str):
    if isinstance(value, dict):
        for key, child in value.items():
            yield from walk_json(child, parts + [key], stack + [value], file_name)
    elif isinstance(value, list):
        for index, child in enumerate(value):
            yield from walk_json(child, parts + [index], stack + [value], file_name)
    elif isinstance(value, str) and value:
        translatable, category = is_translatable_json(parts, stack)
        yield {
            "id": hashlib.sha1((file_name + pointer(parts) + "\0" + value).encode("utf-8")).hexdigest()[:16],
            "kind": "json",
            "file": file_name,
            "path": pointer(parts),
            "source": value,
            "target": "",
            "translatable": translatable,
            "category": category,
            "context": context_for(file_name, parts, stack),
        }


STRING_RE = re.compile(r'"(?:\\.|[^"\\])*"|\'(?:\\.|[^\'\\])*\'|`(?:\\.|[^`\\])*`')


def decode_js(raw: str) -> str:
    if raw.startswith("`"):
        return raw[1:-1]
    try:
        with warnings.catch_warnings():
            warnings.simplefilter("ignore", SyntaxWarning)
            return ast.literal_eval(raw)
    except Exception:
        return raw[1:-1]


def extract_js(path: Path, root: Path):
    rel = path.relative_to(root).as_posix()
    content = path.read_text(encoding="utf-8", errors="replace")
    occurrence = 0
    for match in STRING_RE.finditer(content):
        raw = match.group(0)
        source = decode_js(raw)
        if not source:
            continue
        occurrence += 1
        looks_text = bool(re.search(r"[A-Za-z]{2,}", source) and (" " in source or len(source) > 3))
        yield {
            "id": hashlib.sha1((rel + str(occurrence) + "\0" + raw).encode("utf-8")).hexdigest()[:16],
            "kind": "js",
            "file": rel,
            "occurrence": occurrence,
            "raw": raw,
            "source": source,
            "target": "",
            "translatable": looks_text,
            "category": "plugin_or_engine_literal",
            "context": {"file": rel, "line": content.count("\n", 0, match.start()) + 1},
        }


TAG_RE = re.compile(r"<[^>]+>")
HTML_TEXT_RE = re.compile(r">([^<]+)<")
def extract_web(path: Path, root: Path):
    rel = path.relative_to(root).as_posix()
    content = path.read_text(encoding="utf-8", errors="replace")
    if path.suffix.lower() in {".html", ".htm"}:
        candidates = [m.group(1) for m in HTML_TEXT_RE.finditer(content)]
    else:
        candidates = [line for line in content.splitlines() if re.search(r"[A-Za-z]{2,}", line)]
    for occurrence, source in enumerate(candidates, 1):
        source = source.strip()
        if not source or not re.search(r"[A-Za-z]{2,}", source):
            continue
        yield {
            "id": hashlib.sha1((rel + str(occurrence) + "\0" + source).encode("utf-8")).hexdigest()[:16],
            "kind": "web",
            "file": rel,
            "occurrence": occurrence,
            "source": source,
            "target": "",
            "translatable": True,
            "category": "html_or_text",
            "context": {"file": rel},
        }


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--game-root", type=Path, default=ROOT)
    parser.add_argument("--dev-dir", type=Path, default=DEV)
    args = parser.parse_args()
    game_root = args.game_root.resolve()
    dev = args.dev_dir.resolve()
    source_dir = dev / "source"
    if source_dir.exists():
        shutil.rmtree(source_dir)
    source_dir.mkdir(parents=True, exist_ok=True)
    records: list[dict[str, Any]] = []
    inventory: list[dict[str, Any]] = []

    for path in sorted((game_root / "www" / "data").glob("*.json")):
        rel = path.relative_to(game_root).as_posix()
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
        except Exception as exc:
            inventory.append({"file": rel, "type": "json", "error": str(exc)})
            continue
        records.extend(walk_json(data, [], [], rel))
        destination = source_dir / rel
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(path, destination)
        inventory.append({"file": rel, "type": "json", "sha256": sha256(path), "bytes": path.stat().st_size})

    js_records: list[dict[str, Any]] = []
    for path in sorted((game_root / "www" / "js").rglob("*.js")):
        js_records.extend(extract_js(path, game_root))
        rel = path.relative_to(game_root).as_posix()
        destination = source_dir / rel
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(path, destination)
        inventory.append({"file": rel, "type": "js", "sha256": sha256(path), "bytes": path.stat().st_size})

    web_records: list[dict[str, Any]] = []
    for path in sorted((game_root / "www").rglob("*")):
        if not path.is_file() or path.suffix.lower() not in {".html", ".htm", ".css", ".txt"}:
            continue
        rel = path.relative_to(game_root).as_posix()
        web_records.extend(extract_web(path, game_root))
        destination = source_dir / rel
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(path, destination)
        inventory.append({"file": rel, "type": "web", "sha256": sha256(path), "bytes": path.stat().st_size})

    (dev / "translations.jsonl").write_text("\n".join(json.dumps(r, ensure_ascii=False) for r in records) + "\n", encoding="utf-8")
    dialogue = [r for r in records if r.get("category") == "event_text"]
    (dev / "reports" / "dialogue_index.jsonl").write_text("\n".join(json.dumps({k: r[k] for k in ("id", "file", "path", "source", "context")}, ensure_ascii=False) for r in dialogue) + "\n", encoding="utf-8")
    (dev / "js_translations.jsonl").write_text("\n".join(json.dumps(r, ensure_ascii=False) for r in js_records) + "\n", encoding="utf-8")
    (dev / "web_translations.jsonl").write_text("\n".join(json.dumps(r, ensure_ascii=False) for r in web_records) + "\n", encoding="utf-8")

    resources: list[dict[str, Any]] = []
    for path in sorted((game_root / "www").rglob("*")):
        if path.is_file() and path.suffix.lower() in {".rpgmvp", ".rpgmvo", ".rpgmvm", ".png", ".jpg", ".jpeg", ".webp", ".ttf", ".otf"}:
            rel = path.relative_to(game_root).as_posix()
            extension = path.suffix.lower()
            role = "font" if extension in {".ttf", ".otf"} else ("audio" if extension in {".rpgmvo", ".rpgmvm"} else "image")
            resources.append({"file": rel, "extension": extension, "role": role, "bytes": path.stat().st_size, "sha256": sha256(path), "text_in_image": "review_required" if role == "image" else False})
    (dev / "reports" / "resource_manifest.json").write_text(json.dumps(resources, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (dev / "reports" / "source_manifest.json").write_text(json.dumps(inventory, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    summary = {
        "json_records": len(records),
        "json_translatable": sum(1 for r in records if r["translatable"]),
        "js_records": len(js_records),
        "js_translatable": sum(1 for r in js_records if r["translatable"]),
        "web_records": len(web_records),
        "resource_files": len(resources),
        "json_files": sum(1 for r in inventory if r["type"] == "json"),
        "js_files": sum(1 for r in inventory if r["type"] == "js"),
    }
    (dev / "reports" / "extraction_summary.json").write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(summary, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
