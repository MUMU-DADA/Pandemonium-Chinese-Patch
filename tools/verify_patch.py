#!/usr/bin/env python3
"""Static checks for extraction tables and a generated patch package."""
from __future__ import annotations
import argparse, json, zipfile
from pathlib import Path

from filter_visible_targets import VISIBLE_JS, json_allowed

def records(path: Path):
    return [json.loads(line) for line in path.read_text(encoding="utf-8").splitlines() if line.strip()] if path.exists() else []

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--dev-dir", type=Path, default=Path(__file__).resolve().parents[1])
    p.add_argument("--zip", type=Path, default=None)
    args = p.parse_args()
    dev = args.dev_dir.resolve()
    json_records = records(dev / "translations.jsonl")
    js_records = records(dev / "js_translations.jsonl")
    web_records = records(dev / "web_translations.jsonl")
    all_records = json_records + js_records + web_records
    duplicate_ids = len(all_records) - len({r["id"] for r in all_records})
    blank_translatable = sum(1 for r in all_records if r.get("translatable") and not r.get("target"))
    invalid_targets = sum(1 for r in json_records if r.get("target") and not json_allowed(r))
    invalid_targets += sum(1 for r in js_records if r.get("target") and (r.get("file"), int(r.get("occurrence", 0) or 0)) not in VISIBLE_JS)
    invalid_targets += sum(1 for r in web_records if r.get("target"))
    result = {"jsonRecords": len(json_records), "jsRecords": len(js_records), "webRecords": len(web_records), "duplicateIds": duplicate_ids, "blankTranslatable": blank_translatable, "invalidTargets": invalid_targets, "ok": duplicate_ids == 0 and invalid_targets == 0}
    zip_path = (args.zip or dev / "PANDAEMONIUM_CN_patch_prepared.zip").resolve()
    if zip_path.exists():
        with zipfile.ZipFile(zip_path) as z:
            names = z.namelist()
            result["zipEntries"] = len(names)
            result["hasInstaller"] = "安装汉化.cmd" in names and "卸载汉化.cmd" in names
            result["manifestFiles"] = len(json.loads(z.read("patch_manifest.json"))["files"])
            forbidden = [name for name in names if name.lower().startswith("patch/www/img/tilesets/") and name.lower().endswith(".txt")]
            forbidden += [name for name in names if name.lower() in {"patch/www/data/animations.json", "patch/www/data/mapinfos.json", "patch/www/data/tilesets.json", "patch/www/data/troops.json"}]
            result["forbiddenEntries"] = forbidden
            result["ok"] = result["ok"] and result["hasInstaller"] and not forbidden
    print(json.dumps(result, ensure_ascii=False, indent=2))
    raise SystemExit(0 if result["ok"] else 1)

if __name__ == "__main__":
    main()
