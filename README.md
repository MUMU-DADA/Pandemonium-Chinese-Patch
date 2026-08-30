# PAN-DAE-MON-IUM 汉化准备包

本目录只保存汉化开发材料，不包含开发者本机绝对路径或用户隐私信息。游戏为 RPG Maker MV/NW.js，资源以明文 `www/data/*.json`、JavaScript 插件和加密图片/音频文件组成。

## 当前方案

- **文本覆盖层优先**：翻译后的 JSON/JS 文件会按原目录写入补丁 ZIP，解压到 `Game.exe` 同目录即可被游戏读取。
- **无需 BepInEx**：本作资源是 NW.js 松散文件，准备包不依赖注入框架；只有在未来确认某段文本无法通过资源覆盖修改时，才另行评估插件方案。
- **动态安装/卸载**：`安装汉化.cmd` 和 `卸载汉化.cmd` 自动调用 PowerShell，不需要填写参数。安装器在 `.cnpatch_backup` 中保存原文件，卸载时恢复。
- **版本保护**：安装前校验原文件 SHA-256。游戏版本或文件被修改时会停止，不强行覆盖。
- **当前状态**：汉化准备包已完成。角色、可见数据库词条、事件对白、选项和系统菜单已写入目标列；图块标签、动画名、地图名、公共事件名、事件内部标识、音效/BGM/资源文件名、代码型插件参数和许可证文本均保留原文，避免破坏运行逻辑。

## 翻译工作流

1. 运行 `python tools/extract_text.py`（仅当原始游戏文件发生变化时需要重新提取）。
2. 翻译 `translations.jsonl` 中 `translatable: true` 的记录；每行是独立 JSON，**只修改 `target` 字段**，保留 `id`、`file`、`path`、`source` 和 `context`。
3. `js_translations.jsonl` 是插件/引擎字符串，只有确认是玩家可见文本才填写 `target`；代码、文件名、正则和参数保持空白。
4. 按地图和事件顺序处理对白。`context.map`、`event_id`、`page`、`command_index` 用于连续上下文；同一角色的称呼、语气和专名必须统一。
5. 在 `glossary.json` 登记人名、地名、技能名、系统术语和固定译法。遇到歧义时在 `notes` 字段说明，不要改动原文。
6. 运行 `python tools/filter_visible_targets.py` 清除所有非玩家可见目标；再运行 `python tools/verify_patch.py` 检查白名单、重复 ID 和 ZIP 结构。确认译文后运行 `python tools/build_patch.py` 生成 `PANDAEMONIUM_CN_patch_prepared.zip`。构建器也会自动执行一次白名单过滤。

本地批量初译可运行 `python tools/translate_local.py`；该工具只使用目录内的术语表和短语表，不访问外部翻译服务，并在结束时自动执行玩家可见白名单过滤。运行 `python tools/validate_tokens.py` 可检查控制码、占位符和标签是否完整保留。

## 翻译约定

- 保留 RPG Maker 控制码（例如 `\\C[n]`、`\\V[n]`、`\\N[n]`、`\\I[n]`、`\\.`、`\\|`、`\\^`）及 `<角色名>` 说话人标签，不能翻译或删除。
- 保留 `%1`、`%2` 等格式化占位符、换行和转义符；中文标点可替换英文标点，但不改变占位符顺序。
- 对白以角色性格、关系、场景和前后句为准，避免逐句直译；同一事件的多行文本应作为连续台词审校。
- 菜单、战斗提示、技能/道具说明使用简洁一致的术语；必要时在 `context` 和 `glossary.json` 中补充背景。
- `note`、脚本参数和插件元数据可能混有代码：只翻译注释或确认为玩家可见的部分，尖括号标签和 JavaScript 语法必须原样保留。

## 文件说明

- `translations.jsonl`：JSON 数据库、地图事件、系统词条的完整字符串清单。
- `reports/dialogue_index.jsonl`：仅对白的阅读索引（按原文件/事件顺序），实际译文仍须回写 `translations.jsonl`。
- `js_translations.jsonl`：`www/js/**/*.js` 字符串字面量清单，含出现序号和原始引号。
- `web_translations.jsonl`：HTML/CSS/TXT 的人工复核清单。
- `source/`：提取时的原始文本快照；`reports/`：SHA-256、资源清单和提取统计。
- `tools/`：提取、应用、构建、校验以及安装/卸载脚本。
- `font/README_字体说明.md`：中文字体准备和授权注意事项。
- `tools/decrypt_rpgmvp.py`：按需解密 `.rpgmvp` 图片到 `decoded_assets/`，用于检查标题/界面嵌字；解密结果不打进 ZIP。
- `reports/resource_manifest.json`：图片、加密图片、字体、音频的完整清单。`.rpgmvp` 等图片含密钥保护，是否有嵌字需人工查看；音频无需翻译。

需要查看图片时运行 `python tools/decrypt_rpgmvp.py --file www/img/titles1/某文件.rpgmvp`，或省略 `--file` 批量解密；只对确认含文字的图片制作同路径 PNG 覆盖素材。本准备包未发现需要替换的嵌字图片。

## 构建与交付

构建器只把有 `target` 的记录写入覆盖层，原始游戏目录不会被修改。最终 ZIP 默认释放在游戏根目录，双击 `安装汉化.cmd` 安装，双击 `卸载汉化.cmd` 回滚。按用户要求不进行实机测试；安装器和静态哈希检查仅用于避免路径/版本错误。
