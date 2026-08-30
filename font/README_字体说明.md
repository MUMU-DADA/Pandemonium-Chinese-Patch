# 字体准备

当前游戏只将 `www/fonts/alagard.ttf` 注册为 `GameFont`，该字体不包含完整中文字符。RPG Maker/NW.js 通常会对缺字回退到系统字体，但正式汉化建议准备一套 CJK 字体。

推荐从系统下载目录中选择已取得授权的 `Source Han Sans SC` 或 `Noto Sans CJK SC` TTF/OTF 文件，复制到补丁的 `patch/www/fonts/`，并在 `www/fonts/gamefont.css` 中增加字体回退。例如：

```css
@font-face {
    font-family: GameFont;
    src: url("alagard.ttf");
}
@font-face {
    font-family: GameFontCJK;
    src: url("SourceHanSansSC-Regular.otf");
}
```

随后在 `www/js/rpg_windows.js` 的 `standardFontFace` 返回值中使用 `GameFont, GameFontCJK, sans-serif`。字体文件不要直接从本准备包自动复制，避免把未确认授权的系统下载内容打进最终发布 ZIP。
