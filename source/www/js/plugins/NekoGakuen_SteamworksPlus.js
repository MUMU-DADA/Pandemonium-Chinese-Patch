//=============================================================================
// NekoGakuen_SteamworksPlus.js
// Version: 1.3.0
//=============================================================================
/*:zh_TW
 * @target MV MZ
 * @plugindesc Steamworks API+ (Ver 1.3.0)
 * @author 貓咪學園 NekoGakuen
 * @url https://twitter.com/NekoGakuen
 * @help
 * ================================
 * 作者：貓咪學園 NekoGakuen
 * 版本：1.3.0
 * 聯絡推特(X)：https://twitter.com/NekoGakuen
 * ================================
 *
 * ─ 插件簡介 ─
 * 在 RPG Maker MV/MZ 中也能使用來自 Steam 遊戲平台的 API 功能。
 *
 *
 * ─ 更新履歷 ─
 * V1.3.0 修正跨平台相容性：
 *        - 修正 SteamAPI_Init() 在成功分支中被重複呼叫兩次的問題。
 *        - 移除 IsSteamOverlayActive() 中重複的 RunCallbacks() 呼叫。
 *        - 修正 C++ 側 OverlayDetector 在 SteamAPI_Init() 之前被建構的問題。
 * V1.2.1 修正部分的插件命令出現錯誤的問題，新增時間戳轉換為日期時間的格式。
 * V1.2.0 改善Steam初始化時的執行檢查，新增英文的翻譯版本 (使用ChatGPT翻譯)。
 * V1.1.2 修正無法初始化Steam API的問題。
 * V1.1.1 新增排行榜的API功能。
 * V1.1.0 新增NWjs版本，並移除Steam Deck選單暫停功能。
 * V1.0.0 初次版本的插件發佈。
 *
 *
 * ─ 使用說明 ─
 * 1.需先完成一些前置步驟，請參閱放在Manual資料夾內的使用手冊連結。
 * 2.在 RPG Maker MV/MZ 的「插件管理器」之中載入本插件，
 *   並在本插件的「參數」區塊設定即可。
 * 3.在事件頁中高級區塊選擇「插件命令/腳本...」，
 *   並輸入以下要執行的插件命令/腳本及參數即可。
 *
 *
 * ─ 插件命令/腳本 ─
 * 本插件為核心模組，不包含各功能的插件命令。
 * 請依需求安裝對應的功能子模組插件：
 *
 * -------------------------
 *  ■ 可選子模組列表
 * -------------------------
 * SteamApps         → 應用程式/DLC 安裝狀態、語言、版本
 * SteamFriends      → 好友、Overlay、豐富狀態、頭像
 * SteamInput        → 遊戲手把輸入、震動、LED 顏色
 * SteamMusic        → Steam 音樂播放器控制
 * SteamTimeline     → Steam 遊戲時間軸事件標記
 * SteamUserStats    → 成就、統計數據、排行榜
 * SteamUtils        → 工具類（電量、Overlay 位置、鍵盤輸入等）
 * SteamScreenshots  → 截圖管理
 *
 * 各子模組的插件命令說明請參閱對應的插件說明。
 *
 * 
 * ─ 支援環境 ─
 * 支援 NWjs（RPG Maker MV/MZ 預設引擎）和 Electron 兩種執行環境。
 * 在 Electron 環境下，插件會自動偵測並使用正確的模組路徑。
 * 
 * 
 * ─ 支援平台 ─
 * - NWjs：
 *  【√ 支援(Windows、macOS、Linux)】
 * - Electron：
 *  【√ 支援(Windows、macOS)】
 * - Google Chrome：
 *  【× 不支援】
 * - Mozilla Firefox：
 *  【× 不支援】
 * - Microsoft Edge：
 *  【× 不支援】
 * - Apple Safari：
 *  【× 不支援】
 * - Android：
 *  【× 不支援】
 * - iOS：
 *  【× 不支援】
 * - Steam Deck：
 *  【√ 支援(NWjs)】
 *
 *
 * ─ 著作聲明 ─
 * 修改或翻譯本插件無需事前告知，如果插件有BUG可以回報。
 * 本插件著作權為貓咪學園(NekoGakuen)所有。
 * 並且保留對插件使用規則的修改與更動之權利。
 * 
 * --------------------
 * -來源標示：【△ 不需要，但有的話會很感謝。 (註1)】
 * -商業營利：【√ 允許】
 * -成人用途：【√ 允許】
 * 
 * ※註1：但如有註明的話，可以註明「NekoGakuen」即可。
 * --------------------
 * 
 *
 * @param Steamworks Class
 * @text ◆ Steamworks 核心參數
 * 
 * @param Steam AppID
 * @text 遊戲應用程式 ID
 * @desc 指定在 Steam 上的遊戲應用程式 ID。
 * @type string
 * @parent Steamworks Class
 * @default 480
 * 
 * @param Check BuyGame Boolean
 * @text 開啟 Steam 購買檢查功能
 * @desc 是否開啟 Steam 購買驗證和客戶端執行檢查的功能。
 * @default false
 * @type boolean
 * @parent Steamworks Class
 * @on 開啟
 * @off 關閉
 * 
 * @param Check FullScreen
 * @text 開啟 Steam Deck UI 全螢幕
 * @desc 是否在 Steam Deck UI 上開啟全螢幕顯示。
 * @default true
 * @type boolean
 * @parent Steamworks Class
 * @on 開啟
 * @off 關閉
 * 
 * @param Check Music Pause
 * @text 開啟遊戲執行時暫停音樂播放
 * @desc 是否在遊戲執行時暫停遊戲原聲帶的音樂播放。
 * @default false
 * @type boolean
 * @parent Steamworks Class
 * @on 開啟
 * @off 關閉
 * 
 *
 * @param Error Log Class
 * @text ◆ 錯誤訊息參數
 * 
 * @param Error BuyGame Title
 * @text 錯誤標題(未購買遊戲)
 * @desc 當未購買此遊戲時，指定要顯示的錯誤標題。
 * @type string
 * @parent Error Log Class
 * @default 未購買此遊戲
 * 
 * @param Error BuyGame Message
 * @text 錯誤訊息(未購買遊戲)
 * @desc 當未購買此遊戲時，指定要顯示的錯誤訊息。
 * @type string
 * @parent Error Log Class
 * @default 您尚未在 Steam 上購買本遊戲。
 * 
 * @param Error BuyGame Button
 * @text 連結按鈕
 * @desc 指定要前往購買的按鈕名稱。
 * @type string
 * @parent Error Log Class
 * @default 前往購買
 *
 */
/*:
 * @target MV MZ
 * @plugindesc Steamworks API+ (Ver 1.3.0)
 * @author NekoGakuen
 * @url https://twitter.com/NekoGakuen
 * @help
 * ================================
 * Author: NekoGakuen
 * Version: 1.3.0
 * X (Twitter): https://twitter.com/NekoGakuen
 * ================================
 *
 * ─ Plugin Overview ─
 * Enables the use of Steam platform API features within RPG Maker MV/MZ.
 *
 *
 * ─ Update History ─
 * V1.3.0 Cross-platform compatibility fixes:
 *        - Fixed an issue where SteamAPI_Init() was called twice in the success branch.
 *        - Removed duplicate RunCallbacks() calls in IsSteamOverlayActive().
 *        - Fixed an issue where the C++ OverlayDetector was constructed before SteamAPI_Init().
 * V1.2.1 Fixed errors occurring in certain plugin commands.
 *        Added a timestamp-to-datetime conversion format.
 * V1.2.0 Improved execution checks during Steam initialization.
 *        Added an English translation version (translated using ChatGPT).
 * V1.1.2 Fixed an issue preventing Steam API initialization.
 * V1.1.1 Added Steam Leaderboard API functionality.
 * V1.1.0 Added NWjs support and removed the Steam Deck menu pause feature.
 * V1.0.0 Initial release.
 *
 *
 * ─ Instructions ─
 * 1. Complete the required setup steps beforehand.
 *    Please refer to the manual link located in the Manual folder.
 * 2. Load this plugin through the Plugin Manager in RPG Maker MV/MZ,
 *    then configure the parameters in the plugin settings.
 * 3. In an event page, select "Plugin Command / Script..."
 *    from the advanced section and enter the desired command/script
 *    along with its parameters.
 *
 *
 * ─ Plugin Commands / Scripts ─
 * This plugin serves as a core module and does not include
 * feature-specific plugin commands.
 * Please install the corresponding optional submodule plugins
 * according to your needs:
 *
 * -------------------------
 *  ■ Optional Submodule List
 * -------------------------
 * SteamApps         → Application/DLC installation status, language, version
 * SteamFriends      → Friends, Overlay, Rich Presence, Avatars
 * SteamInput        → Game controller input, vibration, LED colors
 * SteamMusic        → Steam Music Player controls
 * SteamTimeline     → Steam gameplay timeline event markers
 * SteamUserStats    → Achievements, statistics, leaderboards
 * SteamUtils        → Utility functions (battery, overlay position, keyboard input, etc.)
 * SteamScreenshots  → Screenshot management
 *
 * For plugin command details of each submodule,
 * please refer to the corresponding plugin documentation.
 *
 *
 * ─ Supported Environments ─
 * Supports both NWjs (the default RPG Maker MV/MZ runtime)
 * and Electron environments.
 * In Electron environments, the plugin automatically detects
 * and uses the correct module path.
 *
 *
 * ─ Supported Platforms ─
 * - NWjs:
 *   [√ Supported (Windows, macOS, Linux)]
 * - Electron:
 *   [√ Supported (Windows, macOS)]
 * - Google Chrome:
 *   [× Not Supported]
 * - Mozilla Firefox:
 *   [× Not Supported]
 * - Microsoft Edge:
 *   [× Not Supported]
 * - Apple Safari:
 *   [× Not Supported]
 * - Android:
 *   [× Not Supported]
 * - iOS:
 *   [× Not Supported]
 * - Steam Deck:
 *   [√ Supported (NWjs)]
 *
 *
 * ─ License & Terms ─
 * Modifying or translating this plugin does not require prior permission.
 * Bug reports are welcome.
 * This plugin is copyrighted by NekoGakuen.
 * The author reserves the right to modify or update the usage terms.
 *
 * --------------------
 * - Attribution: [△ Not Required, but Appreciated. (Note 1)]
 * - Commercial Use: [√ Allowed]
 * - Adult Content: [√ Allowed]
 *
 * Note 1:
 * If attribution is provided, simply credit "NekoGakuen".
 * --------------------
 *
 *
 * @param Steamworks Class
 * @text ◆ Steamworks Core Settings
 *
 * @param Steam AppID
 * @text Game Application ID
 * @desc Specifies the Steam Application ID of the game.
 * @type string
 * @parent Steamworks Class
 * @default 480
 *
 * @param Check BuyGame Boolean
 * @text Enable Steam Ownership Verification
 * @desc Enables Steam ownership verification and client launch validation.
 * @default false
 * @type boolean
 * @parent Steamworks Class
 * @on Enabled
 * @off Disabled
 *
 * @param Check FullScreen
 * @text Enable Steam Deck UI Fullscreen
 * @desc Enables fullscreen display when running under Steam Deck UI.
 * @default true
 * @type boolean
 * @parent Steamworks Class
 * @on Enabled
 * @off Disabled
 *
 * @param Check Music Pause
 * @text Pause Music While Game Is Running
 * @desc Pauses soundtrack playback while the game is running.
 * @default false
 * @type boolean
 * @parent Steamworks Class
 * @on Enabled
 * @off Disabled
 *
 *
 * @param Error Log Class
 * @text ◆ Error Message Settings
 *
 * @param Error BuyGame Title
 * @text Error Title (Game Not Owned)
 * @desc Specifies the error title displayed when the game has not been purchased.
 * @type string
 * @parent Error Log Class
 * @default Game Not Purchased
 *
 * @param Error BuyGame Message
 * @text Error Message (Game Not Owned)
 * @desc Specifies the error message displayed when the game has not been purchased.
 * @type string
 * @parent Error Log Class
 * @default You have not purchased this game on Steam.
 *
 * @param Error BuyGame Button
 * @text Purchase Button
 * @desc Specifies the button text used to open the purchase page.
 * @type string
 * @parent Error Log Class
 * @default Go to Store
 *
 */
/*:ja
 * @target MV MZ
 * @plugindesc Steamworks API+ (Ver 1.3.0)
 * @author NekoGakuen
 * @url https://twitter.com/NekoGakuen
 * @help
 * ================================
 * 作者：NekoGakuen
 * バージョン：1.3.0
 * X(Twitter)：https://twitter.com/NekoGakuen
 * ================================
 *
 * ─ プラグイン概要 ─
 * RPG Maker MV/MZ 上で Steam プラットフォームの API 機能を利用できるようにします。
 *
 *
 * ─ 更新履歴 ─
 * V1.3.0 クロスプラットフォーム互換性の修正：
 *        - SteamAPI_Init() が成功時に二重実行される問題を修正。
 *        - IsSteamOverlayActive() 内の重複した RunCallbacks() 呼び出しを削除。
 *        - SteamAPI_Init() 実行前に C++ 側 OverlayDetector が生成される問題を修正。
 * V1.2.1 一部のプラグインコマンドで発生するエラーを修正。
 *        タイムスタンプから日時への変換形式を追加。
 * V1.2.0 Steam 初期化時の実行チェックを改善。
 *        英語翻訳版を追加（ChatGPT による翻訳）。
 * V1.1.2 Steam API を初期化できない問題を修正。
 * V1.1.1 ランキング API 機能を追加。
 * V1.1.0 NWjs 版を追加し、Steam Deck メニューの一時停止機能を削除。
 * V1.0.0 初版公開。
 *
 *
 * ─ 使用方法 ─
 * 1. 事前設定が必要です。
 *    Manual フォルダ内のマニュアルリンクを参照してください。
 * 2. RPG Maker MV/MZ のプラグインマネージャーで本プラグインを読み込み、
 *    パラメータを設定してください。
 * 3. イベントページの「プラグインコマンド / スクリプト...」を選択し、
 *    実行したいコマンドまたはスクリプトとその引数を入力してください。
 *
 *
 * ─ プラグインコマンド / スクリプト ─
 * 本プラグインはコアモジュールであり、
 * 機能別のプラグインコマンドは含まれていません。
 * 必要に応じて対応するサブモジュールを導入してください。
 *
 * -------------------------
 *  ■ オプションサブモジュール一覧
 * -------------------------
 * SteamApps         → アプリ/DLC インストール状況、言語、バージョン
 * SteamFriends      → フレンド、オーバーレイ、リッチプレゼンス、アバター
 * SteamInput        → コントローラー入力、振動、LEDカラー
 * SteamMusic        → Steam ミュージックプレイヤー制御
 * SteamTimeline     → Steam ゲームプレイタイムラインイベント
 * SteamUserStats    → 実績、統計情報、ランキング
 * SteamUtils        → ユーティリティ機能（バッテリー、オーバーレイ位置、キーボード入力など）
 * SteamScreenshots  → スクリーンショット管理
 *
 * 各サブモジュールのプラグインコマンドについては、
 * 対応するプラグイン説明書を参照してください。
 *
 *
 * ─ 対応環境 ─
 * RPG Maker MV/MZ 標準ランタイムである NWjs と、
 * Electron の両方の実行環境に対応しています。
 * Electron 環境では、プラグインが自動的に適切なモジュールパスを検出して使用します。
 *
 *
 * ─ 対応プラットフォーム ─
 * - NWjs：
 *  【√ 対応（Windows、macOS、Linux）】
 * - Electron：
 *  【√ 対応（Windows、macOS）】
 * - Google Chrome：
 *  【× 非対応】
 * - Mozilla Firefox：
 *  【× 非対応】
 * - Microsoft Edge：
 *  【× 非対応】
 * - Apple Safari：
 *  【× 非対応】
 * - Android：
 *  【× 非対応】
 * - iOS：
 *  【× 非対応】
 * - Steam Deck：
 *  【√ 対応（NWjs）】
 *
 *
 * ─ 利用規約 ─
 * 本プラグインの改変および翻訳は、
 * 事前の許可なく自由に行うことができます。
 * バグを発見した場合はご報告いただけますと幸いです。
 * 本プラグインの著作権は
 * NekoGakuen が所有しています。
 * また、利用規約を変更する権利を留保します。
 *
 * --------------------
 * - クレジット表記：
 *   【△ 必須ではありませんが、記載していただけると嬉しいです。（注1）】
 * - 商用利用：
 *   【√ 許可】
 * - 成人向け作品：
 *   【√ 許可】
 *
 * ※注1：
 * クレジットを記載する場合は「NekoGakuen」と表記してください。
 * --------------------
 *
 *
 * @param Steamworks Class
 * @text ◆ Steamworks コア設定
 *
 * @param Steam AppID
 * @text ゲームアプリケーションID
 * @desc Steam 上のゲームアプリケーションIDを指定します。
 * @type string
 * @parent Steamworks Class
 * @default 480
 *
 * @param Check BuyGame Boolean
 * @text Steam購入確認機能を有効化
 * @desc Steamでの所有権確認およびクライアント起動チェックを有効にします。
 * @default false
 * @type boolean
 * @parent Steamworks Class
 * @on 有効
 * @off 無効
 *
 * @param Check FullScreen
 * @text Steam Deck UIフルスクリーンを有効化
 * @desc Steam Deck UI上でフルスクリーン表示を有効にします。
 * @default true
 * @type boolean
 * @parent Steamworks Class
 * @on 有効
 * @off 無効
 *
 * @param Check Music Pause
 * @text ゲーム実行中に音楽を一時停止
 * @desc ゲーム実行中にサウンドトラックの再生を一時停止します。
 * @default false
 * @type boolean
 * @parent Steamworks Class
 * @on 有効
 * @off 無効
 *
 *
 * @param Error Log Class
 * @text ◆ エラーメッセージ設定
 *
 * @param Error BuyGame Title
 * @text エラータイトル（未購入）
 * @desc ゲームを所有していない場合に表示するエラータイトルです。
 * @type string
 * @parent Error Log Class
 * @default ゲームを所有していません
 *
 * @param Error BuyGame Message
 * @text エラーメッセージ（未購入）
 * @desc ゲームを所有していない場合に表示するエラーメッセージです。
 * @type string
 * @parent Error Log Class
 * @default このゲームはSteamで購入されていません。
 *
 * @param Error BuyGame Button
 * @text 購入ページボタン
 * @desc 購入ページへ移動するボタン名を指定します。
 * @type string
 * @parent Error Log Class
 * @default 購入ページへ移動
 *
 */
//=============================================================================
'use strict';

let NekoGakuen_SteamworksPlus = {};
function pluginisTChinese(name01, name02) {
    return navigator.language == "zh-TW" ? name01 : name02;
};
const path = require("path");
const koffi = require('koffi');
const options = {
    lazy: true
};

// ── koffi 結構體定義 ──────────────────────────────────────────────────────────
// 成就解鎖時間資料
const GetAchievementAndUnlockTimeData = koffi.struct('GetAchievementAndUnlockTimeData', {
    'achieved': 'bool',
    'unlockTime': 'uint32'
});
// 排行榜單筆資料
const GetDownloadedLeaderboardEntryData = koffi.struct('GetDownloadedLeaderboardEntryData', {
    'playerName': 'const char*',
    'playerScore': 'int'
});
// SteamInput 數位動作資料
const NekoDigitalActionData = koffi.struct('NekoDigitalActionData', {
    'bState': 'bool',
    'bActive': 'bool'
});
// SteamInput 類比動作資料
const NekoAnalogActionData = koffi.struct('NekoAnalogActionData', {
    'eMode': 'int',
    'x': 'float',
    'y': 'float',
    'bActive': 'bool'
});

// ── 執行環境偵測（NWjs / Electron 雙重支援）──────────────────────────────────
let isElectron = false;
let base = (function () {
    // Electron 環境：使用 app.getAppPath() 取得應用程式根目錄
    try {
        let electron = require('electron');
        if (electron) {
            isElectron = true;
            return path.dirname(__filename);
        }
    } catch (e) { /* 非 Electron 環境，繼續嘗試 NWjs */ }
    // NWjs 環境：使用 process.mainModule.filename
    if (process.mainModule && process.mainModule.filename) {
        isElectron = false;
        return path.dirname(process.mainModule.filename);
    }
    // 備援：使用 process.cwd()
    return process.cwd();
})();
// 【修正 v1.3.0】依平台正確選擇函式庫副檔名
const _libFileName = process.platform === 'win32'
    ? 'NekoGakuen_SteamworksPlus.dll'
    : process.platform === 'darwin'
        ? 'NekoGakuen_SteamworksPlus.dylib'
        : 'NekoGakuen_SteamworksPlus.so'; // Linux
const lib = koffi.load(path.join(base, _libFileName), options);

let NekoGakuen_SteamworksPlus_PluginName = "NekoGakuen_SteamworksPlus";
NekoGakuen_SteamworksPlus.Parameters = PluginManager.parameters(NekoGakuen_SteamworksPlus_PluginName);
NekoGakuen_SteamworksPlus = {
    SteamAppID: Number(NekoGakuen_SteamworksPlus.Parameters["Steam AppID"] || 480),
    CheckBuyGameBoolean: String(NekoGakuen_SteamworksPlus.Parameters['Check BuyGame Boolean'] || 'false'),
    CheckFullScreen: String(NekoGakuen_SteamworksPlus.Parameters['Check FullScreen'] || 'true'),
    CheckMusicPause: String(NekoGakuen_SteamworksPlus.Parameters['Check Music Pause'] || 'false'),
    ErrorBuyGameTitle: String(NekoGakuen_SteamworksPlus.Parameters['Error BuyGame Title'] || pluginisTChinese('未購買遊戲', 'No Games Purchased')),
    ErrorBuyGameMessage: String(NekoGakuen_SteamworksPlus.Parameters['Error BuyGame Message'] || pluginisTChinese('您尚未在Steam上購買本遊戲。', 'You have not yet purchased this game on Steam.')),
    ErrorBuyGameButton: String(NekoGakuen_SteamworksPlus.Parameters['Error BuyGame Button'] || pluginisTChinese('前往購買', 'Buy Game')),
    SteamGameLaunch: false,
    ConsoleError01: pluginisTChinese("Steamworks初始化失敗。", "Steamworks initialization failed."),
    ConsoleLog01: pluginisTChinese('已完成Steam API初始化。', 'Steam API initialization has been completed.'),

    // ── SteamAPI ──────────────────────────────────────────────────────────
    SteamAPI_Init: lib.func("bool NekoGakuen_SteamAPI_Init()"),
    SteamAPI_ReleaseCurrentThreadMemory: lib.func("void NekoGakuen_SteamAPI_ReleaseCurrentThreadMemory()"),
    SteamAPI_RestartAppIfNecessary: lib.func("bool NekoGakuen_SteamAPI_RestartAppIfNecessary(uint32 unOwnAppID)"),
    SteamAPI_RunCallbacks: lib.func("void NekoGakuen_SteamAPI_RunCallbacks()"),
    SteamAPI_Shutdown: lib.func("void NekoGakuen_SteamAPI_Shutdown()"),
    SteamAPI_IsSteamRunning: lib.func("bool NekoGakuen_SteamAPI_IsSteamRunning()"),
    SteamAPI_IsSteamOverlayActive: lib.func("bool NekoGakuen_SteamAPI_IsSteamOverlayActive()"),

    // ── SteamApps ──────────────────────────────────────────────────────────
    SteamApps_GetDLCDataByIndex: lib.func("bool NekoGakuen_SteamApps_GetDLCDataByIndex(int iDLC, uint32* pAppID, bool* pbAvailable, char* pchName, int cchNameBufferSize)"),
    SteamApps_AppInstalled: lib.func("bool NekoGakuen_SteamApps_AppInstalled(uint32 appID)"),
    SteamApps_DlcInstalled: lib.func("bool NekoGakuen_SteamApps_DlcInstalled(uint32 appID)"),
    SteamApps_LowViolence: lib.func("bool NekoGakuen_SteamApps_LowViolence()"),
    SteamApps_Subscribed: lib.func("bool NekoGakuen_SteamApps_Subscribed()"),
    SteamApps_SubscribedApp: lib.func("bool NekoGakuen_SteamApps_SubscribedApp(uint32 appID)"),
    SteamApps_SubscribedFromFamilySharing: lib.func("bool NekoGakuen_SteamApps_SubscribedFromFamilySharing()"),
    SteamApps_SubscribedFromFreeWeekend: lib.func("bool NekoGakuen_SteamApps_SubscribedFromFreeWeekend()"),
    SteamApps_TimedTrial: lib.func("bool NekoGakuen_SteamApps_TimedTrial(uint32* punSecondsAllowed, uint32* punSecondsPlayed)"),
    SteamApps_VACBanned: lib.func("bool NekoGakuen_SteamApps_VACBanned()"),
    SteamApps_GetAppBuildId: lib.func("int NekoGakuen_SteamApps_GetAppBuildId()"),
    SteamApps_GetAppInstallDir: lib.func("const char* NekoGakuen_SteamApps_GetAppInstallDir(uint32 appID)"),
    SteamApps_GetAppOwner: lib.func("uint64 NekoGakuen_SteamApps_GetAppOwner()"),
    SteamApps_GetAvailableGameLanguages: lib.func("const char* NekoGakuen_SteamApps_GetAvailableGameLanguages()"),
    SteamApps_GetCurrentBetaName: lib.func("bool NekoGakuen_SteamApps_GetCurrentBetaName(str pchName, int cchNameBufferSize)"),
    SteamApps_GetNumBetas: lib.func("int NekoGakuen_SteamApps_GetNumBetas(_Out_ int* pnAvailable, _Out_ int* pnPrivate)"),
    SteamApps_GetBetaInfo: lib.func("bool NekoGakuen_SteamApps_GetBetaInfo(int iBetaIndex, uint32* punFlags, uint32* punBuildID, char* pchBetaName, int cchBetaName, char* pchDescription, int cchDescription, uint32* punLastUpdated)"),
    SteamApps_SetActiveBeta: lib.func("bool NekoGakuen_SteamApps_SetActiveBeta(const char* pchBetaName)"),
    SteamApps_GetCurrentGameLanguage: lib.func("const char* NekoGakuen_SteamApps_GetCurrentGameLanguage()"),
    SteamApps_GetDLCCount: lib.func("int NekoGakuen_SteamApps_GetDLCCount()"),
    SteamApps_GetDlcDownloadProgress: lib.func("bool NekoGakuen_SteamApps_GetDlcDownloadProgress(uint32 nAppID, uint64* punBytesDownloaded, uint64* punBytesTotal)"),
    SteamApps_GetEarliestPurchaseUnixTime: lib.func("uint32 NekoGakuen_SteamApps_GetEarliestPurchaseUnixTime(uint32 nAppID)"),
    // SteamApps_GetFileDetails: lib.func(),
    SteamApps_GetInstalledDepots: lib.func("uint32 NekoGakuen_SteamApps_GetInstalledDepots(uint32 appID, uint32* pvecDepots, uint32 cMaxDepots)"),
    SteamApps_GetLaunchCommandLine: lib.func("int NekoGakuen_SteamApps_GetLaunchCommandLine(str pszCommandLine, int cubCommandLine)"),
    SteamApps_GetLaunchQueryParam: lib.func("const char* NekoGakuen_SteamApps_GetLaunchQueryParam(const char* pchKey)"),
    SteamApps_InstallDLC: lib.func("void NekoGakuen_SteamApps_InstallDLC(uint32 nAppID)"),
    SteamApps_MarkContentCorrupt: lib.func("bool NekoGakuen_SteamApps_MarkContentCorrupt(bool bMissingFilesOnly)"),
    SteamApps_UninstallDLC: lib.func("void NekoGakuen_SteamApps_UninstallDLC(uint32 nAppID)"),

    // ── SteamFriends ───────────────────────────────────────────────────────
    SteamFriends_ActivateGameOverlay: lib.func("void NekoGakuen_SteamFriends_ActivateGameOverlay(const char* pchDialog)"),
    // SteamFriends_ActivateGameOverlayInviteDialog: lib.func("void NekoGakuen_SteamFriends_ActivateGameOverlayInviteDialog(uint64 steamIDLobby)"),
    SteamFriends_ActivateGameOverlayToStore: lib.func("void NekoGakuen_SteamFriends_ActivateGameOverlayToStore(uint32 nAppID, int eFlag)"),
    SteamFriends_ActivateGameOverlayToUser: lib.func("void NekoGakuen_SteamFriends_ActivateGameOverlayToUser(const char* pchDialog, uint64 steamID)"),
    SteamFriends_ActivateGameOverlayToWebPage: lib.func("void NekoGakuen_SteamFriends_ActivateGameOverlayToWebPage(const char* pchURL)"),
    // SteamFriends_ClearRichPresence: lib.func("void NekoGakuen_SteamFriends_ClearRichPresence()"),
    // SteamFriends_GetFriendRichPresence: lib.func("const char* NekoGakuen_SteamFriends_GetFriendRichPresence(uint64 steamIDFriend, const char* pchKey)"),
    // SteamFriends_GetFriendRichPresenceKeyCount: lib.func("int NekoGakuen_SteamFriends_GetFriendRichPresenceKeyCount(uint64 steamIDFriend)"),
    // SteamFriends_GetFriendRichPresenceKeyByIndex: lib.func("const char* NekoGakuen_SteamFriends_GetFriendRichPresenceKeyByIndex(uint64 steamIDFriend, int iKey)"),
    // SteamFriends_RequestFriendRichPresence: lib.func("void NekoGakuen_SteamFriends_RequestFriendRichPresence(uint64 steamIDFriend)"),
    SteamFriends_GetPersonaName: lib.func("const char* NekoGakuen_SteamFriends_GetPersonaName()"),
    // SteamFriends_GetPersonaState: lib.func("int NekoGakuen_SteamFriends_GetPersonaState()"),
    SteamFriends_GetPlayerNickname: lib.func("const char* NekoGakuen_SteamFriends_GetPlayerNickname(uint64 steamIDPlayer)"),
    // SteamFriends_GetFriendCount: lib.func("int NekoGakuen_SteamFriends_GetFriendCount(int iFriendFlags)"),
    // SteamFriends_GetFriendByIndex: lib.func("uint64 NekoGakuen_SteamFriends_GetFriendByIndex(int iFriend, int iFriendFlags)"),
    SteamFriends_GetFriendPersonaName: lib.func("const char* NekoGakuen_SteamFriends_GetFriendPersonaName(uint64 steamID)"),
    // SteamFriends_GetFriendPersonaState: lib.func("int NekoGakuen_SteamFriends_GetFriendPersonaState(uint64 steamID)"),
    // SteamFriends_GetFriendSteamLevel: lib.func("int NekoGakuen_SteamFriends_GetFriendSteamLevel(uint64 steamID)"),
    // SteamFriends_GetFriendRelationship: lib.func("int NekoGakuen_SteamFriends_GetFriendRelationship(uint64 steamID)"),
    // SteamFriends_HasFriend: lib.func("bool NekoGakuen_SteamFriends_HasFriend(uint64 steamIDFriend, int iFriendFlags)"),
    // SteamFriends_RequestUserInformation: lib.func("bool NekoGakuen_SteamFriends_RequestUserInformation(uint64 steamIDUser, bool bRequireNameOnly)"),
    // SteamFriends_GetClanCount: lib.func("int NekoGakuen_SteamFriends_GetClanCount()"),
    // SteamFriends_GetClanByIndex: lib.func("uint64 NekoGakuen_SteamFriends_GetClanByIndex(int iClan)"),
    // SteamFriends_GetClanName: lib.func("const char* NekoGakuen_SteamFriends_GetClanName(uint64 steamIDClan)"),
    // SteamFriends_GetClanTag: lib.func("const char* NekoGakuen_SteamFriends_GetClanTag(uint64 steamIDClan)"),
    // SteamFriends_InviteUserToGame: lib.func("bool NekoGakuen_SteamFriends_InviteUserToGame(uint64 steamIDFriend, const char* pchConnectString)"),
    // SteamFriends_SetPlayedWith: lib.func("void NekoGakuen_SteamFriends_SetPlayedWith(uint64 steamIDUserPlayedWith)"),
    // SteamFriends_SetRichPresence: lib.func("bool NekoGakuen_SteamFriends_SetRichPresence(const char* pchKey, const char* pchValue)"),
    // SteamFriends_GetCoplayFriendCount: lib.func("int NekoGakuen_SteamFriends_GetCoplayFriendCount()"),
    // SteamFriends_GetCoplayFriend: lib.func("uint64 NekoGakuen_SteamFriends_GetCoplayFriend(int iCoplayFriend)"),
    // SteamFriends_SetInGameVoiceSpeaking: lib.func("void NekoGakuen_SteamFriends_SetInGameVoiceSpeaking(uint64 steamIDUser, bool bSpeaking)"),
    SteamFriends_GetSmallFriendAvatar: lib.func("int NekoGakuen_SteamFriends_GetSmallFriendAvatar(uint64 steamID)"),
    SteamFriends_GetMediumFriendAvatar: lib.func("int NekoGakuen_SteamFriends_GetMediumFriendAvatar(uint64 steamID)"),
    SteamFriends_GetLargeFriendAvatar: lib.func("int NekoGakuen_SteamFriends_GetLargeFriendAvatar(uint64 steamID)"),

    // ── SteamInput ─────────────────────────────────────────────────────────
    SteamInput_Init: lib.func("bool NekoGakuen_SteamInput_Init(bool bExplicitlyCallRunFrame)"),
    SteamInput_Shutdown: lib.func("bool NekoGakuen_SteamInput_Shutdown()"),
    SteamInput_RunFrame: lib.func("void NekoGakuen_SteamInput_RunFrame()"),
    SteamInput_GetInputTypeForHandle: lib.func("const char* NekoGakuen_SteamInput_GetInputTypeForHandle(int nIndex)"),
    SteamInput_GetControllerForGamepadIndex: lib.func("uint64 NekoGakuen_SteamInput_GetControllerForGamepadIndex(int nIndex)"),
    SteamInput_GetGamepadIndexForController: lib.func("int NekoGakuen_SteamInput_GetGamepadIndexForController(uint64 ulControllerHandle)"),
    // SteamInput_GetActionSetHandle: lib.func("uint64 NekoGakuen_SteamInput_GetActionSetHandle(const char* pszActionSetName)"),
    // SteamInput_ActivateActionSet: lib.func("void NekoGakuen_SteamInput_ActivateActionSet(uint64 inputHandle, uint64 actionSetHandle)"),
    // SteamInput_GetCurrentActionSet: lib.func("uint64 NekoGakuen_SteamInput_GetCurrentActionSet(uint64 inputHandle)"),
    // SteamInput_GetDigitalActionHandle: lib.func("uint64 NekoGakuen_SteamInput_GetDigitalActionHandle(const char* pszActionName)"),
    // SteamInput_GetDigitalActionData: lib.func("NekoDigitalActionData NekoGakuen_SteamInput_GetDigitalActionData(uint64 inputHandle, uint64 digitalActionHandle)"),
    // SteamInput_GetAnalogActionHandle: lib.func("uint64 NekoGakuen_SteamInput_GetAnalogActionHandle(const char* pszActionName)"),
    // SteamInput_GetAnalogActionData: lib.func("NekoAnalogActionData NekoGakuen_SteamInput_GetAnalogActionData(uint64 inputHandle, uint64 analogActionHandle)"),
    SteamInput_TriggerVibration: lib.func("void NekoGakuen_SteamInput_TriggerVibration(uint64 inputHandle, uint16 usLeftSpeed, uint16 usRightSpeed)"),
    SteamInput_TriggerVibrationExtended: lib.func("void NekoGakuen_SteamInput_TriggerVibrationExtended(uint64 inputHandle, uint16 usLeftSpeed, uint16 usRightSpeed, uint16 usLeftTriggerSpeed, uint16 usRightTriggerSpeed)"),
    SteamInput_SetLEDColor: lib.func("void NekoGakuen_SteamInput_SetLEDColor(uint64 inputHandle, uint8 nColorR, uint8 nColorG, uint8 nColorB, uint32 nFlags)"),
    SteamInput_ShowBindingPanel: lib.func("bool NekoGakuen_SteamInput_ShowBindingPanel(int nIndex)"),
    SteamInput_GetStringForActionOrigin: lib.func("const char* NekoGakuen_SteamInput_GetStringForActionOrigin(int eOrigin)"),
    SteamInput_GetGlyphPNGForActionOrigin: lib.func("const char* NekoGakuen_SteamInput_GetGlyphPNGForActionOrigin(int eOrigin, int eSize, uint32 unFlags)"),

    // ── SteamMatchmaking ───────────────────────────────────────────────────
    // SteamMatchmaking_CreateLobby: lib.func("uint64 NekoGakuen_SteamMatchmaking_CreateLobby(int eLobbyType, int cMaxMembers)"),
    // SteamMatchmaking_JoinLobby: lib.func("uint64 NekoGakuen_SteamMatchmaking_JoinLobby(uint64 steamIDLobby)"),
    // SteamMatchmaking_LeaveLobby: lib.func("void NekoGakuen_SteamMatchmaking_LeaveLobby(uint64 steamIDLobby)"),
    // SteamMatchmaking_RequestLobbyList: lib.func("uint64 NekoGakuen_SteamMatchmaking_RequestLobbyList()"),
    // SteamMatchmaking_GetLobbyByIndex: lib.func("uint64 NekoGakuen_SteamMatchmaking_GetLobbyByIndex(int iLobby)"),
    // SteamMatchmaking_GetLobbyData: lib.func("const char* NekoGakuen_SteamMatchmaking_GetLobbyData(uint64 steamIDLobby, const char* pchKey)"),
    // SteamMatchmaking_SetLobbyData: lib.func("bool NekoGakuen_SteamMatchmaking_SetLobbyData(uint64 steamIDLobby, const char* pchKey, const char* pchValue)"),
    // SteamMatchmaking_DeleteLobbyData: lib.func("bool NekoGakuen_SteamMatchmaking_DeleteLobbyData(uint64 steamIDLobby, const char* pchKey)"),
    // SteamMatchmaking_GetNumLobbyMembers: lib.func("int NekoGakuen_SteamMatchmaking_GetNumLobbyMembers(uint64 steamIDLobby)"),
    // SteamMatchmaking_GetLobbyMemberByIndex: lib.func("uint64 NekoGakuen_SteamMatchmaking_GetLobbyMemberByIndex(uint64 steamIDLobby, int iMember)"),
    // SteamMatchmaking_GetLobbyMemberData: lib.func("const char* NekoGakuen_SteamMatchmaking_GetLobbyMemberData(uint64 steamIDLobby, uint64 steamIDUser, const char* pchKey)"),
    // SteamMatchmaking_SetLobbyMemberData: lib.func("void NekoGakuen_SteamMatchmaking_SetLobbyMemberData(uint64 steamIDLobby, const char* pchKey, const char* pchValue)"),
    // SteamMatchmaking_GetLobbyOwner: lib.func("uint64 NekoGakuen_SteamMatchmaking_GetLobbyOwner(uint64 steamIDLobby)"),
    // SteamMatchmaking_SetLobbyMemberLimit: lib.func("bool NekoGakuen_SteamMatchmaking_SetLobbyMemberLimit(uint64 steamIDLobby, int cMaxMembers)"),
    // SteamMatchmaking_GetLobbyMemberLimit: lib.func("int NekoGakuen_SteamMatchmaking_GetLobbyMemberLimit(uint64 steamIDLobby)"),
    // SteamMatchmaking_SetLobbyType: lib.func("bool NekoGakuen_SteamMatchmaking_SetLobbyType(uint64 steamIDLobby, int eLobbyType)"),
    // SteamMatchmaking_SetLobbyJoinable: lib.func("bool NekoGakuen_SteamMatchmaking_SetLobbyJoinable(uint64 steamIDLobby, bool bLobbyJoinable)"),
    // SteamMatchmaking_InviteUserToLobby: lib.func("bool NekoGakuen_SteamMatchmaking_InviteUserToLobby(uint64 steamIDLobby, uint64 steamIDInvitee)"),
    // SteamMatchmaking_SendLobbyChatMsg: lib.func("bool NekoGakuen_SteamMatchmaking_SendLobbyChatMsg(uint64 steamIDLobby, const char* pvMsgBody)"),
    // SteamMatchmaking_RequestLobbyData: lib.func("bool NekoGakuen_SteamMatchmaking_RequestLobbyData(uint64 steamIDLobby)"),
    // SteamMatchmaking_AddRequestLobbyListStringFilter: lib.func("void NekoGakuen_SteamMatchmaking_AddRequestLobbyListStringFilter(const char* pchKeyToMatch, const char* pchValueToMatch, int eComparisonType)"),
    // SteamMatchmaking_AddRequestLobbyListNumericalFilter: lib.func("void NekoGakuen_SteamMatchmaking_AddRequestLobbyListNumericalFilter(const char* pchKeyToMatch, int nValueToMatch, int eComparisonType)"),
    // SteamMatchmaking_AddRequestLobbyListNearValueFilter: lib.func("void NekoGakuen_SteamMatchmaking_AddRequestLobbyListNearValueFilter(const char* pchKeyToMatch, int nValueToBeCloseTo)"),
    // SteamMatchmaking_AddRequestLobbyListFilterSlotsAvailable: lib.func("void NekoGakuen_SteamMatchmaking_AddRequestLobbyListFilterSlotsAvailable(int nSlotsAvailable)"),
    // SteamMatchmaking_AddRequestLobbyListDistanceFilter: lib.func("void NekoGakuen_SteamMatchmaking_AddRequestLobbyListDistanceFilter(int eLobbyDistanceFilter)"),
    // SteamMatchmaking_AddRequestLobbyListResultCountFilter: lib.func("void NekoGakuen_SteamMatchmaking_AddRequestLobbyListResultCountFilter(int cMaxResults)"),

    // ── SteamMusic ─────────────────────────────────────────────────────────
    SteamMusic_IsEnabled: lib.func("bool NekoGakuen_SteamMusic_IsEnabled()"),
    SteamMusic_IsPlaying: lib.func("bool NekoGakuen_SteamMusic_IsPlaying()"),
    SteamMusic_GetPlaybackStatus: lib.func("int NekoGakuen_SteamMusic_GetPlaybackStatus()"),
    SteamMusic_GetVolume: lib.func("float NekoGakuen_SteamMusic_GetVolume()"),
    SteamMusic_Pause: lib.func("void NekoGakuen_SteamMusic_Pause()"),
    SteamMusic_Play: lib.func("void NekoGakuen_SteamMusic_Play()"),
    SteamMusic_PlayNext: lib.func("void NekoGakuen_SteamMusic_PlayNext()"),
    SteamMusic_PlayPrevious: lib.func("void NekoGakuen_SteamMusic_PlayPrevious()"),
    SteamMusic_SetVolume: lib.func("void NekoGakuen_SteamMusic_SetVolume(float flVolume)"),

    // ── SteamNetworking ────────────────────────────────────────────────────
    // SteamNetworking_IsP2PPacketAvailable: lib.func("bool NekoGakuen_SteamNetworking_IsP2PPacketAvailable(_Out_ uint32* pcubMsgSize, int nChannel)"),
    // SteamNetworking_SendP2PPacket: lib.func("bool NekoGakuen_SteamNetworking_SendP2PPacket(uint64 steamID, void* pubData, uint32 cubData, int P2PSendType, int nChannel)"),
    // SteamNetworking_AcceptP2PSessionWithUser: lib.func("bool NekoGakuen_SteamNetworking_AcceptP2PSessionWithUser(uint64 steamIDRemote)"),
    // SteamNetworking_CloseP2PSessionWithUser: lib.func("bool NekoGakuen_SteamNetworking_CloseP2PSessionWithUser(uint64 steamIDRemote)"),
    // SteamNetworking_CloseP2PChannelWithUser: lib.func("bool NekoGakuen_SteamNetworking_CloseP2PChannelWithUser(uint64 steamIDRemote, int nChannel)"),
    // SteamNetworking_AllowP2PPacketRelay: lib.func("bool NekoGakuen_SteamNetworking_AllowP2PPacketRelay(bool bAllow)"),

    // ── SteamTimeline ──────────────────────────────────────────────────────
    SteamTimeline_SetTimelineTooltip: lib.func("void NekoGakuen_SteamTimeline_SetTimelineTooltip(const char* pchDescription, float flTimeDelta)"),
    SteamTimeline_ClearTimelineTooltip: lib.func("void NekoGakuen_SteamTimeline_ClearTimelineTooltip(float flTimeDelta)"),
    SteamTimeline_AddInstantaneousTimelineEvent: lib.func("uint64 NekoGakuen_SteamTimeline_AddInstantaneousTimelineEvent(const char* pchTitle, const char* pchDescription, const char* pchIcon, uint32 unIconPriority, float flStartOffsetSeconds, int ePossibleClip)"),
    SteamTimeline_AddRangeTimelineEvent: lib.func("uint64 NekoGakuen_SteamTimeline_AddRangeTimelineEvent(const char* pchTitle, const char* pchDescription, const char* pchIcon, uint32 unIconPriority, float flStartOffsetSeconds, float flDurationSeconds, int ePossibleClip)"),
    SteamTimeline_StartRangeTimelineEvent: lib.func("uint64 NekoGakuen_SteamTimeline_StartRangeTimelineEvent(const char* pchTitle, const char* pchDescription, const char* pchIcon, uint32 unIconPriority, float flStartOffsetSeconds, int ePossibleClip)"),
    SteamTimeline_UpdateRangeTimelineEvent: lib.func("void NekoGakuen_SteamTimeline_UpdateRangeTimelineEvent(uint64 ulEvent, const char* pchTitle, const char* pchDescription, const char* pchIcon, uint32 unIconPriority, int ePossibleClip)"),
    SteamTimeline_EndRangeTimelineEvent: lib.func("void NekoGakuen_SteamTimeline_EndRangeTimelineEvent(uint64 ulEvent, float flEndOffsetSeconds)"),
    SteamTimeline_RemoveTimelineEvent: lib.func("void NekoGakuen_SteamTimeline_RemoveTimelineEvent(uint64 ulEvent)"),
    // SteamTimeline_DoesEventRecordingExist: lib.func("bool NekoGakuen_SteamTimeline_DoesEventRecordingExist(uint64 ulEvent)"),
    SteamTimeline_StartGamePhase: lib.func("void NekoGakuen_SteamTimeline_StartGamePhase()"),
    SteamTimeline_EndGamePhase: lib.func("void NekoGakuen_SteamTimeline_EndGamePhase()"),
    SteamTimeline_SetGamePhaseID: lib.func("void NekoGakuen_SteamTimeline_SetGamePhaseID(const char* pchPhaseID)"),
    // SteamTimeline_DoesGamePhaseRecordingExist: lib.func("bool NekoGakuen_SteamTimeline_DoesGamePhaseRecordingExist(const char* pchPhaseID)"),
    SteamTimeline_AddGamePhaseTag: lib.func("void NekoGakuen_SteamTimeline_AddGamePhaseTag(const char* pchTagName, const char* pchTagIcon, const char* pchTagGroup, uint32 unPriority)"),
    // SteamTimeline_SetGamePhaseAttribute: lib.func("void NekoGakuen_SteamTimeline_SetGamePhaseAttribute(const char* pchAttributeGroup, const char* pchAttributeValue, uint32 unPriority)"),
    SteamTimeline_SetTimelineGameMode: lib.func("void NekoGakuen_SteamTimeline_SetTimelineGameMode(int eMode)"),
    SteamTimeline_OpenOverlayToGamePhase: lib.func("void NekoGakuen_SteamTimeline_OpenOverlayToGamePhase(const char* pchPhaseID)"),
    SteamTimeline_OpenOverlayToTimelineEvent: lib.func("void NekoGakuen_SteamTimeline_OpenOverlayToTimelineEvent(uint64 hEvent)"),

    // ── SteamUserStats ─────────────────────────────────────────────────────
    // SteamUserStats_AttachLeaderboardUGC: lib.func(),
    SteamUserStats_ClearAchievement: lib.func("bool NekoGakuen_SteamUserStats_ClearAchievement(const char* pchName)"),
    SteamUserStats_DownloadLeaderboardEntries: lib.func("void NekoGakuen_SteamUserStats_DownloadLeaderboardEntries(int leaderboardId)"),
    // SteamUserStats_DownloadLeaderboardEntriesForUsers: lib.func(),
    SteamUserStats_FindLeaderboard: lib.func("void NekoGakuen_SteamUserStats_FindLeaderboard(const char* leaderboardName)"),
    SteamUserStats_FindOrCreateLeaderboard: lib.func("uint64 NekoGakuen_SteamUserStats_FindOrCreateLeaderboard(const char* pchLeaderboardName, int LeaderboardSortMethod, int LeaderboardDisplayType)"),
    SteamUserStats_GetAchievement: lib.func("bool NekoGakuen_SteamUserStats_GetAchievement(const char* pchName, bool* pbAchieved)"),
    SteamUserStats_GetAchievementAchievedPercent: lib.func("bool NekoGakuen_SteamUserStats_GetAchievementAchievedPercent(const char* pchName, _Out_ float* pflPercent)"),
    SteamUserStats_GetAchievementAndUnlockTime: lib.func("GetAchievementAndUnlockTimeData NekoGakuen_SteamUserStats_GetAchievementAndUnlockTime(const char* pchName)"),
    SteamUserStats_GetAchievementDisplayAttribute: lib.func("const char* NekoGakuen_SteamUserStats_GetAchievementDisplayAttribute(const char* pchName, const char* pchKey)"),
    SteamUserStats_GetAchievementIcon: lib.func("int NekoGakuen_SteamUserStats_GetAchievementIcon(const char* pchName)"),
    SteamUserStats_GetAchievementName: lib.func("const char* NekoGakuen_SteamUserStats_GetAchievementName(uint32 iAchievement)"),
    SteamUserStats_GetDownloadedLeaderboardEntry: lib.func("GetDownloadedLeaderboardEntryData NekoGakuen_SteamUserStats_GetDownloadedLeaderboardEntry(int index)"),
    // SteamUserStats_GetGlobalStat: lib.func(),
    // SteamUserStats_GetGlobalStatHistory: lib.func(),
    SteamUserStats_GetLeaderboardDisplayType: lib.func("int NekoGakuen_SteamUserStats_GetLeaderboardDisplayType(uint64 hSteamLeaderboard)"),
    SteamUserStats_GetLeaderboardEntryCount: lib.func("int NekoGakuen_SteamUserStats_GetLeaderboardEntryCount(uint64 hSteamLeaderboard)"),
    SteamUserStats_GetLeaderboardName: lib.func("const char* NekoGakuen_SteamUserStats_GetLeaderboardName(uint64 hSteamLeaderboard)"),
    SteamUserStats_GetLeaderboardSortMethod: lib.func("int NekoGakuen_SteamUserStats_GetLeaderboardSortMethod(uint64 hSteamLeaderboard)"),
    // SteamUserStats_GetMostAchievedAchievementInfo: lib.func(),
    // SteamUserStats_GetNextMostAchievedAchievementInfo: lib.func(),
    SteamUserStats_GetNumAchievements: lib.func("uint32 NekoGakuen_SteamUserStats_GetNumAchievements()"),
    SteamUserStats_GetNumberOfCurrentPlayers: lib.func("uint64 NekoGakuen_SteamUserStats_GetNumberOfCurrentPlayers()"),
    // SteamUserStats_GetUserAchievement: lib.func(),
    // SteamUserStats_GetUserAchievementAndUnlockTime: lib.func(),
    // SteamUserStats_GetUserStat: lib.func(),
    SteamUserStats_IndicateAchievementProgress: lib.func("bool NekoGakuen_SteamUserStats_IndicateAchievementProgress(const char* pchName, uint32 nCurProgress, uint32 nMaxProgress)"),
    SteamUserStats_RequestGlobalAchievementPercentages: lib.func("uint64 NekoGakuen_SteamUserStats_RequestGlobalAchievementPercentages()"),
    SteamUserStats_RequestGlobalStats: lib.func("uint64 NekoGakuen_SteamUserStats_RequestGlobalStats(int nHistoryDays)"),
    SteamUserStats_RequestUserStats: lib.func("uint64 NekoGakuen_SteamUserStats_RequestUserStats(uint64 steamIDUser)"),
    SteamUserStats_ResetAllStats: lib.func("bool NekoGakuen_SteamUserStats_ResetAllStats(bool bAchievementsToo)"),
    SteamUserStats_SetAchievement: lib.func("bool NekoGakuen_SteamUserStats_SetAchievement(const char* pchName)"),
    // SteamUserStats_SetStat: lib.func(),
    SteamUserStats_StoreStats: lib.func("bool NekoGakuen_SteamUserStats_StoreStats()"),
    // SteamUserStats_UpdateAvgRateStat: lib.func(),
    SteamUserStats_UploadLeaderboardScore: lib.func("bool NekoGakuen_SteamUserStats_UploadLeaderboardScore(int leaderboardId, int score)"),

    // ── SteamUtils ─────────────────────────────────────────────────────────
    SteamUtils_BOverlayNeedsPresent: lib.func("bool NekoGakuen_SteamUtils_BOverlayNeedsPresent()"),
    // SteamUtils_GetAPICallFailureReason: lib.func(),
    SteamUtils_GetAPICallResult: lib.func("bool NekoGakuen_SteamUtils_GetAPICallResult(uint64 hSteamAPICall, void* pCallback, int cubCallback, int iCallbackExpected, _Out_ bool* pbFailed)"),
    SteamUtils_GetAppID: lib.func("uint32 NekoGakuen_SteamUtils_GetAppID()"),
    SteamUtils_GetCurrentBatteryPower: lib.func("uint8 NekoGakuen_SteamUtils_GetCurrentBatteryPower()"),
    SteamUtils_GetEnteredGamepadTextInput: lib.func("bool NekoGakuen_SteamUtils_GetEnteredGamepadTextInput(str pchText, uint32 cchText)"),
    SteamUtils_GetEnteredGamepadTextLength: lib.func("uint32 NekoGakuen_SteamUtils_GetEnteredGamepadTextLength()"),
    SteamUtils_GetImageRGBA: lib.func("bool NekoGakuen_SteamUtils_GetImageRGBA(int iImage, uint8* pubDest, int nDestBufferSize)"),
    SteamUtils_GetImageSize: lib.func("bool NekoGakuen_SteamUtils_GetImageSize(int iImage, _Out_ uint32* pnWidth, _Out_ uint32* pnHeight)"),
    SteamUtils_GetIPCCallCount: lib.func("uint32 NekoGakuen_SteamUtils_GetIPCCallCount()"),
    SteamUtils_GetIPCountry: lib.func("const char* NekoGakuen_SteamUtils_GetIPCountry()"),
    SteamUtils_GetSecondsSinceAppActive: lib.func("uint32 NekoGakuen_SteamUtils_GetSecondsSinceAppActive()"),
    SteamUtils_GetSecondsSinceComputerActive: lib.func("uint32 NekoGakuen_SteamUtils_GetSecondsSinceComputerActive()"),
    SteamUtils_GetServerRealTime: lib.func("uint32 NekoGakuen_SteamUtils_GetServerRealTime()"),
    SteamUtils_GetSteamUILanguage: lib.func("const char* NekoGakuen_SteamUtils_GetSteamUILanguage()"),
    SteamUtils_IsAPICallCompleted: lib.func("bool NekoGakuen_SteamUtils_IsAPICallCompleted(uint64 hSteamAPICall, _Out_ bool* pbFailed)"),
    SteamUtils_IsOverlayEnabled: lib.func("bool NekoGakuen_SteamUtils_IsOverlayEnabled()"),
    SteamUtils_InitFilterText: lib.func("bool NekoGakuen_SteamUtils_InitFilterText(uint32 unFilterOptions)"),
    SteamUtils_FilterText: lib.func("int NekoGakuen_SteamUtils_FilterText(int eContext, uint64 sourceSteamID, const char* pchInputMessage, str pchOutFilteredText, uint32 nByteSizeOutFilteredText)"),
    SteamUtils_IsSteamInBigPictureMode: lib.func("bool NekoGakuen_SteamUtils_IsSteamInBigPictureMode()"),
    // SteamUtils_IsSteamRunningInVR: lib.func("bool NekoGakuen_SteamUtils_IsSteamRunningInVR()"),
    // SteamUtils_IsVRHeadsetStreamingEnabled: lib.func("bool NekoGakuen_SteamUtils_IsVRHeadsetStreamingEnabled()"),
    SteamUtils_IsSteamRunningOnSteamDeck: lib.func("bool NekoGakuen_SteamUtils_IsSteamRunningOnSteamDeck()"),
    SteamUtils_SetOverlayNotificationInset: lib.func("void NekoGakuen_SteamUtils_SetOverlayNotificationInset(int nHorizontalInset, int nVerticalInset)"),
    SteamUtils_SetOverlayNotificationPosition: lib.func("void NekoGakuen_SteamUtils_SetOverlayNotificationPosition(int eNotificationPosition)"),
    // SteamUtils_SetVRHeadsetStreamingEnabled: lib.func("void NekoGakuen_SteamUtils_SetVRHeadsetStreamingEnabled(bool bEnabled)"),
    // SteamUtils_SetWarningMessageHook: lib.func(),
    SteamUtils_ShowGamepadTextInput: lib.func("const char* NekoGakuen_SteamUtils_ShowGamepadTextInput(int eInputMode, int eLineInputMode, const char* pchDescription, uint32 unCharMax, const char* pchExistingText)"),
    SteamUtils_ShowFloatingGamepadTextInput: lib.func("bool NekoGakuen_SteamUtils_ShowFloatingGamepadTextInput(int eKeyboardMode, int nTextFieldXPosition, int nTextFieldYPosition, int nTextFieldWidth, int nTextFieldHeight)"),
    // SteamUtils_StartVRDashboard: lib.func(),
    // SetGameLauncherMode: lib.func(),

    // ── Steam_gameserver（遊戲伺服器核心）──────────────────────────────────────
    // SteamGameServer_InitEx: lib.func("bool NekoGakuen_SteamGameServer_Init(uint32 unIP, uint16 usGamePort, uint16 usQueryPort, int eServerMode, const char* pchVersionString)"),
    // SteamGameServer_ShutdownFn: lib.func("void NekoGakuen_SteamGameServer_Shutdown()"),
    // SteamGameServer_RunCallbacksFn: lib.func("void NekoGakuen_SteamGameServer_RunCallbacks()"),
    // SteamGameServer_GetSteamIDStr: lib.func("const char* NekoGakuen_SteamGameServer_GetSteamID()"),

    // ── ISteamGameServer ───────────────────────────────────────────────────────
    // SteamGameServer_SetProduct: lib.func("void NekoGakuen_SteamGameServer_SetProduct(const char* pszProduct)"),
    // SteamGameServer_SetGameDescription: lib.func("void NekoGakuen_SteamGameServer_SetGameDescription(const char* pszGameDescription)"),
    // SteamGameServer_SetServerName: lib.func("void NekoGakuen_SteamGameServer_SetServerName(const char* pszServerName)"),
    // SteamGameServer_SetMapName: lib.func("void NekoGakuen_SteamGameServer_SetMapName(const char* pszMapName)"),
    // SteamGameServer_SetMaxPlayerCount: lib.func("void NekoGakuen_SteamGameServer_SetMaxPlayerCount(int cPlayersMax)"),
    // SteamGameServer_SetBotPlayerCount: lib.func("void NekoGakuen_SteamGameServer_SetBotPlayerCount(int cBotplayers)"),
    // SteamGameServer_SetPasswordProtected: lib.func("void NekoGakuen_SteamGameServer_SetPasswordProtected(bool bPasswordProtected)"),
    // SteamGameServer_SetGameData: lib.func("void NekoGakuen_SteamGameServer_SetGameData(const char* pchGameData)"),
    // SteamGameServer_LogOnAnonymous: lib.func("void NekoGakuen_SteamGameServer_LogOnAnonymous()"),
    // SteamGameServer_LogOff: lib.func("void NekoGakuen_SteamGameServer_LogOff()"),
    // SteamGameServer_BLoggedOn: lib.func("bool NekoGakuen_SteamGameServer_BLoggedOn()"),
    // SteamGameServer_BSecure: lib.func("bool NekoGakuen_SteamGameServer_BSecure()"),
    // SteamGameServer_SetKeyValue: lib.func("void NekoGakuen_SteamGameServer_SetKeyValue(const char* pKey, const char* pValue)"),
    // SteamGameServer_ClearAllKeyValues: lib.func("void NekoGakuen_SteamGameServer_ClearAllKeyValues()"),
    // SteamGameServer_EndAuthSession: lib.func("void NekoGakuen_SteamGameServer_EndAuthSession(uint64 steamID)"),

    // ── SteamGameServerStats ───────────────────────────────────────────────────
    // SteamGameServerStats_RequestUserStats: lib.func("uint64 NekoGakuen_SteamGameServerStats_RequestUserStats(uint64 steamIDUser)"),
    // SteamGameServerStats_SetUserStatInt: lib.func("bool NekoGakuen_SteamGameServerStats_SetUserStatInt(uint64 steamIDUser, const char* pchName, int nData)"),
    // SteamGameServerStats_SetUserStatFloat: lib.func("bool NekoGakuen_SteamGameServerStats_SetUserStatFloat(uint64 steamIDUser, const char* pchName, float fData)"),
    // SteamGameServerStats_SetUserAchievement: lib.func("bool NekoGakuen_SteamGameServerStats_SetUserAchievement(uint64 steamIDUser, const char* pchName)"),
    // SteamGameServerStats_ClearUserAchievement: lib.func("bool NekoGakuen_SteamGameServerStats_ClearUserAchievement(uint64 steamIDUser, const char* pchName)"),
    // SteamGameServerStats_StoreUserStats: lib.func("uint64 NekoGakuen_SteamGameServerStats_StoreUserStats(uint64 steamIDUser)"),

    // ── SteamHTTP ──────────────────────────────────────────────────────────────
    // SteamHTTP_CreateCookieContainer: lib.func(),
    // SteamHTTP_CreateHTTPRequest: lib.func("uint32 NekoGakuen_SteamHTTP_CreateHTTPRequest(int eHTTPRequestMethod, const char* pchAbsoluteURL)"),
    // SteamHTTP_DeferHTTPRequest: lib.func(),
    // SteamHTTP_GetHTTPDownloadProgressPct: lib.func("bool NekoGakuen_SteamHTTP_GetHTTPDownloadProgressPct(uint32 hRequest, _Out_ float* pflPercentOut)"),
    // SteamHTTP_GetHTTPRequestWasTimedOut: lib.func(),
    // SteamHTTP_GetHTTPResponseBodyData: lib.func(),
    // SteamHTTP_GetHTTPResponseBodySize: lib.func("bool NekoGakuen_SteamHTTP_GetHTTPResponseBodySize(uint32 hRequest, _Out_ uint32* unBodySize)"),
    // SteamHTTP_GetHTTPResponseHeaderSize: lib.func(),
    // SteamHTTP_SetHTTPRequestHeaderValue: lib.func("bool NekoGakuen_SteamHTTP_SetHTTPRequestHeaderValue(uint32 hRequest, const char* pchHeaderName, const char* pchHeaderValue)"),
    // SteamHTTP_GetHTTPStreamingResponseBodyData: lib.func(),
    // SteamHTTP_PrioritizeHTTPRequest: lib.func(),
    // SteamHTTP_ReleaseCookieContainer: lib.func(),
    // SteamHTTP_ReleaseHTTPRequest: lib.func("bool NekoGakuen_SteamHTTP_ReleaseHTTPRequest(uint32 hRequest)"),
    // SteamHTTP_SendHTTPRequest: lib.func("bool NekoGakuen_SteamHTTP_SendHTTPRequest(uint32 hRequest, _Out_ uint64* pCallHandle)"),
    // SteamHTTP_SendHTTPRequestAndStreamResponse: lib.func(),
    // SteamHTTP_SetCookie: lib.func(),
    // SteamHTTP_SetHTTPRequestAbsoluteTimeoutMS: lib.func(),
    // SteamHTTP_SetHTTPRequestContextValue: lib.func(),
    // SteamHTTP_SetHTTPRequestCookieContainer: lib.func(),
    // SteamHTTP_SetHTTPRequestGetOrPostParameter: lib.func("bool NekoGakuen_SteamHTTP_SetHTTPRequestGetOrPostParameter(uint32 hRequest, const char* pchParamName, const char* pchParamValue)"),
    // SteamHTTP_SetHTTPRequestHeaderValue: lib.func(),
    // SteamHTTP_SetHTTPRequestNetworkActivityTimeout: lib.func("bool NekoGakuen_SteamHTTP_SetHTTPRequestNetworkActivityTimeout(uint32 hRequest, uint32 unTimeoutSeconds)"),
    // SteamHTTP_SetHTTPRequestRawPostBody: lib.func(),
    // SteamHTTP_SetHTTPRequestRequiresVerifiedCertificate: lib.func(),
    // SteamHTTP_SetHTTPRequestUserAgentInfo: lib.func(),

    // ── SteamInventory ─────────────────────────────────────────────────────────
    // SteamInventory_GetAllItems: lib.func("bool NekoGakuen_SteamInventory_GetAllItems(_Out_ int* phResultHandle)"),
    // SteamInventory_GetResultStatus: lib.func("int NekoGakuen_SteamInventory_GetResultStatus(int resultHandle)"),
    // SteamInventory_GetResultTimestamp: lib.func("uint32 NekoGakuen_SteamInventory_GetResultTimestamp(int resultHandle)"),
    // SteamInventory_DestroyResult: lib.func("void NekoGakuen_SteamInventory_DestroyResult(int resultHandle)"),
    // SteamInventory_TriggerItemDrop: lib.func("bool NekoGakuen_SteamInventory_TriggerItemDrop(_Out_ int* phResultHandle, int dropListDefinition)"),
    // SteamInventory_LoadItemDefinitions: lib.func("bool NekoGakuen_SteamInventory_LoadItemDefinitions()"),

    // ── SteamRemoteStorage（雲端存檔）─────────────────────────────────────────
    // SteamRemoteStorage_IsCloudEnabledForAccount: lib.func("bool NekoGakuen_SteamRemoteStorage_IsCloudEnabledForAccount()"),
    // SteamRemoteStorage_IsCloudEnabledForApp: lib.func("bool NekoGakuen_SteamRemoteStorage_IsCloudEnabledForApp()"),
    // SteamRemoteStorage_SetCloudEnabledForApp: lib.func("void NekoGakuen_SteamRemoteStorage_SetCloudEnabledForApp(bool bEnabled)"),
    // SteamRemoteStorage_FileWriteString: lib.func("bool NekoGakuen_SteamRemoteStorage_FileWriteString(const char* pchFile, const char* pchData)"),
    // SteamRemoteStorage_FileReadString: lib.func("const char* NekoGakuen_SteamRemoteStorage_FileReadString(const char* pchFile)"),
    // SteamRemoteStorage_FileDelete: lib.func("bool NekoGakuen_SteamRemoteStorage_FileDelete(const char* pchFile)"),
    // SteamRemoteStorage_FileForget: lib.func("bool NekoGakuen_SteamRemoteStorage_FileForget(const char* pchFile)"),
    // SteamRemoteStorage_FileExists: lib.func("bool NekoGakuen_SteamRemoteStorage_FileExists(const char* pchFile)"),
    // SteamRemoteStorage_FilePersisted: lib.func("bool NekoGakuen_SteamRemoteStorage_FilePersisted(const char* pchFile)"),
    // SteamRemoteStorage_GetFileSize: lib.func("int32 NekoGakuen_SteamRemoteStorage_GetFileSize(const char* pchFile)"),
    // SteamRemoteStorage_GetFileTimestamp: lib.func("int64 NekoGakuen_SteamRemoteStorage_GetFileTimestamp(const char* pchFile)"),
    // SteamRemoteStorage_GetFileCount: lib.func("int32 NekoGakuen_SteamRemoteStorage_GetFileCount()"),
    // SteamRemoteStorage_GetFileNameAndSize: lib.func("const char* NekoGakuen_SteamRemoteStorage_GetFileNameAndSize(int iFile, _Out_ int* pnFileSizeInBytes)"),
    // SteamRemoteStorage_GetQuota: lib.func("bool NekoGakuen_SteamRemoteStorage_GetQuota(_Out_ uint64* pnTotalBytes, _Out_ uint64* puAvailableBytes)"),

    // ── SteamScreenshots ────────────────────────────────────────────────────────
    SteamScreenshots_AddScreenshotToLibrary: lib.func("uint32 NekoGakuen_SteamScreenshots_AddScreenshotToLibrary(const char* pchFilename, const char* pchThumbnailFilename, int nWidth, int nHeight)"),
    // SteamScreenshots_AddVRScreenshotToLibrary: lib.func(),
    SteamScreenshots_HookScreenshots: lib.func("void NekoGakuen_SteamScreenshots_HookScreenshots(bool bHook)"),
    SteamScreenshots_IsScreenshotsHooked: lib.func("bool NekoGakuen_SteamScreenshots_IsScreenshotsHooked()"),
    SteamScreenshots_SetLocation: lib.func("void NekoGakuen_SteamScreenshots_SetLocation(uint32 hScreenshot, const char* pchLocation)"),
    SteamScreenshots_TagPublishedFile: lib.func("bool NekoGakuen_SteamScreenshots_TagPublishedFile(uint32 hScreenshot, uint64 unPublishedFileID)"),
    SteamScreenshots_TagUser: lib.func("bool NekoGakuen_SteamScreenshots_TagUser(uint32 hScreenshot, uint64 steamID)"),
    SteamScreenshots_TriggerScreenshot: lib.func("void NekoGakuen_SteamScreenshots_TriggerScreenshot()"),
    SteamScreenshots_WriteScreenshot: lib.func("uint32 NekoGakuen_SteamScreenshots_WriteScreenshot(void* pubRGB, uint32 cubRGB, int nWidth, int nHeight)"),

    // ── SteamRemotePlay ────────────────────────────────────────────────────────
    // SteamRemotePlay_GetSessionCount: lib.func("uint32 NekoGakuen_SteamRemotePlay_GetSessionCount()"),
    // SteamRemotePlay_GetSessionID: lib.func("uint32 NekoGakuen_SteamRemotePlay_GetSessionID(int iSessionIndex)"),
    // SteamRemotePlay_GetSessionSteamID: lib.func("const char* NekoGakuen_SteamRemotePlay_GetSessionSteamID(uint32 unSessionID)"),
    // SteamRemotePlay_GetSessionClientName: lib.func("const char* NekoGakuen_SteamRemotePlay_GetSessionClientName(uint32 unSessionID)"),
    // SteamRemotePlay_GetSessionClientFormFactor: lib.func("int NekoGakuen_SteamRemotePlay_GetSessionClientFormFactor(uint32 unSessionID)"),
    // SteamRemotePlay_BSendRemotePlayTogetherInvite: lib.func("bool NekoGakuen_SteamRemotePlay_BSendRemotePlayTogetherInvite(uint64 steamIDFriend)"),

    // ── SteamUGC（Workshop）────────────────────────────────────────────────────
    // SteamUGC_GetNumSubscribedItems: lib.func("uint32 NekoGakuen_SteamUGC_GetNumSubscribedItems()"),
    // SteamUGC_SubscribeItem: lib.func("uint64 NekoGakuen_SteamUGC_SubscribeItem(uint64 nPublishedFileID)"),
    // SteamUGC_UnsubscribeItem: lib.func("uint64 NekoGakuen_SteamUGC_UnsubscribeItem(uint64 nPublishedFileID)"),
    // SteamUGC_GetItemState: lib.func("uint32 NekoGakuen_SteamUGC_GetItemState(uint64 nPublishedFileID)"),
    // SteamUGC_DownloadItem: lib.func("bool NekoGakuen_SteamUGC_DownloadItem(uint64 nPublishedFileID, bool bHighPriority)"),
    // SteamUGC_AddItemToFavorites: lib.func("uint64 NekoGakuen_SteamUGC_AddItemToFavorites(uint32 nAppId, uint64 nPublishedFileID)"),
    // SteamUGC_RemoveItemFromFavorites: lib.func("uint64 NekoGakuen_SteamUGC_RemoveItemFromFavorites(uint32 nAppId, uint64 nPublishedFileID)"),
    // SteamUGC_CreateItem: lib.func("uint64 NekoGakuen_SteamUGC_CreateItem(uint32 nConsumerAppId, int eFileType)"),
    // SteamUGC_StartItemUpdate: lib.func("uint64 NekoGakuen_SteamUGC_StartItemUpdate(uint32 nConsumerAppId, uint64 nPublishedFileID)"),
    // SteamUGC_SetItemTitle: lib.func("bool NekoGakuen_SteamUGC_SetItemTitle(uint64 handle, const char* pchTitle)"),
    // SteamUGC_SetItemDescription: lib.func("bool NekoGakuen_SteamUGC_SetItemDescription(uint64 handle, const char* pchDescription)"),
    // SteamUGC_SetItemVisibility: lib.func("bool NekoGakuen_SteamUGC_SetItemVisibility(uint64 handle, int eVisibility)"),
    // SteamUGC_SetItemContent: lib.func("bool NekoGakuen_SteamUGC_SetItemContent(uint64 handle, const char* pszContentFolder)"),
    // SteamUGC_SetItemPreview: lib.func("bool NekoGakuen_SteamUGC_SetItemPreview(uint64 handle, const char* pszPreviewFile)"),
    // SteamUGC_SubmitItemUpdate: lib.func("uint64 NekoGakuen_SteamUGC_SubmitItemUpdate(uint64 handle, const char* pchChangeNote)"),
    // SteamUGC_GetItemUpdateProgress: lib.func("int NekoGakuen_SteamUGC_GetItemUpdateProgress(uint64 handle, _Out_ uint64* punBytesProcessed, _Out_ uint64* punBytesTotal)"),
    // SteamUGC_SetUserItemVote: lib.func("uint64 NekoGakuen_SteamUGC_SetUserItemVote(uint64 nPublishedFileID, bool bVoteUp)"),
    // Workshop 物品清單和安裝資訊（syncSubscribedItems 需要）
    // SteamUGC_GetSubscribedItems: lib.func("uint32 NekoGakuen_SteamUGC_GetSubscribedItems(uint64* pvecPublishedFileID, uint32 cMaxEntries)"),
    // SteamUGC_GetItemInstallInfo: lib.func("bool NekoGakuen_SteamUGC_GetItemInstallInfo(uint64 nPublishedFileID, _Out_ uint64* punSizeOnDisk, str pchFolder, uint32 cchFolderSize, _Out_ uint32* punTimeStamp)"),

    // ── SteamNetworkingSockets ─────────────────────────────────────────────────
    // SteamNetworkingSockets_ConnectP2P: lib.func("uint32 NekoGakuen_SteamNetworkingSockets_ConnectP2P(uint64 steamID, int nVirtualPort)"),
    // SteamNetworkingSockets_CreateListenSocketP2P: lib.func("uint32 NekoGakuen_SteamNetworkingSockets_CreateListenSocketP2P(int nVirtualPort)"),
    // SteamNetworkingSockets_CloseConnection: lib.func("bool NekoGakuen_SteamNetworkingSockets_CloseConnection(uint32 hPeer, int nReason, const char* pszDebug, bool bEnableLinger)"),
    // SteamNetworkingSockets_CloseListenSocket: lib.func("bool NekoGakuen_SteamNetworkingSockets_CloseListenSocket(uint32 hSocket)"),
    // SteamNetworkingSockets_SendStringToConnection: lib.func("int NekoGakuen_SteamNetworkingSockets_SendStringToConnection(uint32 hConn, const char* pszMessage, int nSendFlags)"),
    // SteamNetworkingSockets_AcceptConnection: lib.func("int NekoGakuen_SteamNetworkingSockets_AcceptConnection(uint32 hConn)"),
    // SteamNetworkingSockets_FlushMessagesOnConnection: lib.func("void NekoGakuen_SteamNetworkingSockets_FlushMessagesOnConnection(uint32 hConn)"),
    // SteamNetworkingSockets_GetConnectionRemoteSteamID: lib.func("const char* NekoGakuen_SteamNetworkingSockets_GetConnectionRemoteSteamID(uint32 hConn)"),
    // SteamNetworkingSockets_GetConnectionName: lib.func("const char* NekoGakuen_SteamNetworkingSockets_GetConnectionName(uint32 hConn)"),
    // SteamNetworkingSockets_SetConnectionName: lib.func("void NekoGakuen_SteamNetworkingSockets_SetConnectionName(uint32 hConn, const char* pszName)"),
    // 輪詢群組（取代已移除的 ReceiveMessagesOnListenSocket）
    // SteamNetworkingSockets_CreatePollGroup: lib.func("uint32 NekoGakuen_SteamNetworkingSockets_CreatePollGroup()"),
    // SteamNetworkingSockets_DestroyPollGroup: lib.func("bool NekoGakuen_SteamNetworkingSockets_DestroyPollGroup(uint32 hPollGroup)"),
    // SteamNetworkingSockets_SetConnectionPollGroup: lib.func("bool NekoGakuen_SteamNetworkingSockets_SetConnectionPollGroup(uint32 hConn, uint32 hPollGroup)"),

    // ── SteamUser ──────────────────────────────────────────────────────────────
    // SteamUser_GetSteamID: lib.func("const char* NekoGakuen_SteamUser_GetSteamID()"),
    // SteamUser_GetPlayerSteamLevel: lib.func("int NekoGakuen_SteamUser_GetPlayerSteamLevel()"),
    // SteamUser_BLoggedOn: lib.func("bool NekoGakuen_SteamUser_BLoggedOn()"),
    // SteamUser_GetGameBadgeLevel: lib.func("int NekoGakuen_SteamUser_GetGameBadgeLevel(int nSeries, bool bFoil)"),
    // SteamUser_GetAuthSessionTicket: lib.func("uint32 NekoGakuen_SteamUser_GetAuthSessionTicket(void* pTicket, int cbMaxTicket, _Out_ uint32* pcbTicket)"),
    // SteamUser_CancelAuthTicket: lib.func("void NekoGakuen_SteamUser_CancelAuthTicket(uint32 hAuthTicket)"),
    // SteamUser_BeginAuthSession: lib.func("int NekoGakuen_SteamUser_BeginAuthSession(void* pAuthTicket, int cbAuthTicket, uint64 steamID)"),
    // SteamUser_EndAuthSession: lib.func("void NekoGakuen_SteamUser_EndAuthSession(uint64 steamID)"),
    // SteamUser_StartVoiceRecording: lib.func("void NekoGakuen_SteamUser_StartVoiceRecording()"),
    // SteamUser_StopVoiceRecording: lib.func("void NekoGakuen_SteamUser_StopVoiceRecording()"),
    // SteamUser_GetAvailableVoice: lib.func("int NekoGakuen_SteamUser_GetAvailableVoice(_Out_ uint32* pcbCompressed)"),
    // SteamUser_GetVoiceOptimalSampleRate: lib.func("uint32 NekoGakuen_SteamUser_GetVoiceOptimalSampleRate()"),
    // SteamUser_RequestEncryptedAppTicket: lib.func("uint64 NekoGakuen_SteamUser_RequestEncryptedAppTicket(void* pDataToInclude, int cbDataToInclude)"),
    // SteamUser_GetAuthTicketForWebApi: lib.func("uint32 NekoGakuen_SteamUser_GetAuthTicketForWebApi(const char* pchIdentity)"),
    // SteamUser_GetHSteamUser: lib.func("int NekoGakuen_SteamUser_GetHSteamUser()"),

    // ── SteamVideo ─────────────────────────────────────────────────────────────
    // SteamVideo_IsBroadcasting: lib.func("bool NekoGakuen_SteamVideo_IsBroadcasting(_Out_ int* pnNumViewers)"),
    // SteamVideo_GetVideoURL: lib.func("void NekoGakuen_SteamVideo_GetVideoURL(uint32 unVideoAppID)"),
    // SteamVideo_GetOPFSettings: lib.func("bool NekoGakuen_SteamVideo_GetOPFSettings(uint32 unVideoAppID)"),

    // ── SteamNetworkingUtils ────────────────────────────────────────────────────
    // SteamNetworkingUtils_InitRelayNetworkAccess: lib.func("void NekoGakuen_SteamNetworkingUtils_InitRelayNetworkAccess()"),
    // SteamNetworkingUtils_GetRelayNetworkStatus: lib.func("int NekoGakuen_SteamNetworkingUtils_GetRelayNetworkStatus(void* pDetails)"),
    // SteamNetworkingUtils_GetLocalTimestamp: lib.func("int64 NekoGakuen_SteamNetworkingUtils_GetLocalTimestamp()"),

    // ── SteamHTMLSurface ────────────────────────────────────────────────────────
    // SteamHTMLSurface_Init: lib.func("bool NekoGakuen_SteamHTMLSurface_Init()"),
    // SteamHTMLSurface_Shutdown: lib.func("bool NekoGakuen_SteamHTMLSurface_Shutdown()"),
    // SteamHTMLSurface_CreateBrowser: lib.func("void NekoGakuen_SteamHTMLSurface_CreateBrowser(const char* pchUserAgent, const char* pchUserCSS)"),
    // SteamHTMLSurface_RemoveBrowser: lib.func("void NekoGakuen_SteamHTMLSurface_RemoveBrowser(uint32 unBrowserHandle)"),
    // SteamHTMLSurface_LoadURL: lib.func("void NekoGakuen_SteamHTMLSurface_LoadURL(uint32 unBrowserHandle, const char* pchURL, const char* pchPostData)"),
    // SteamHTMLSurface_SetSize: lib.func("void NekoGakuen_SteamHTMLSurface_SetSize(uint32 unBrowserHandle, uint32 unWidth, uint32 unHeight)"),
    // SteamHTMLSurface_StopLoad: lib.func("void NekoGakuen_SteamHTMLSurface_StopLoad(uint32 unBrowserHandle)"),
    // SteamHTMLSurface_Reload: lib.func("void NekoGakuen_SteamHTMLSurface_Reload(uint32 unBrowserHandle)"),
    // SteamHTMLSurface_GoBack: lib.func("void NekoGakuen_SteamHTMLSurface_GoBack(uint32 unBrowserHandle)"),
    // SteamHTMLSurface_GoForward: lib.func("void NekoGakuen_SteamHTMLSurface_GoForward(uint32 unBrowserHandle)"),
    // SteamHTMLSurface_ExecuteJavascript: lib.func("void NekoGakuen_SteamHTMLSurface_ExecuteJavascript(uint32 unBrowserHandle, const char* pchScript)"),
    // SteamHTMLSurface_Find: lib.func("void NekoGakuen_SteamHTMLSurface_Find(uint32 unBrowserHandle, const char* pchSearchStr, bool bCurrentlyInFind, bool bReverse)"),
    // SteamHTMLSurface_StopFind: lib.func("void NekoGakuen_SteamHTMLSurface_StopFind(uint32 unBrowserHandle)"),
    // SteamHTMLSurface_CopyToClipboard: lib.func("void NekoGakuen_SteamHTMLSurface_CopyToClipboard(uint32 unBrowserHandle)"),
    // SteamHTMLSurface_PasteFromClipboard: lib.func("void NekoGakuen_SteamHTMLSurface_PasteFromClipboard(uint32 unBrowserHandle)")
};

function SteamworksPlusManager() {
    throw new Error("This is a static class");
};


//=============================================================================
// SteamAPI_Class
//=============================================================================
SteamworksPlusManager.steamAPI_Init = function () {
    if (!NekoGakuen_SteamworksPlus.SteamAPI_Init()) {
        console.log(`%c${NekoGakuen_SteamworksPlus.ConsoleError01}`, 'color: red;');
        if (NekoGakuen_SteamworksPlus.CheckBuyGameBoolean == 'true') {
            if (isElectron) {
                require('electron').ipcRenderer.send('openExternal', 'steam://launch/' + NekoGakuen_SteamworksPlus.SteamAppID + '/');
                NekoGakuen_SteamworksPlus.SteamAPI_Shutdown();
                require("electron").ipcRenderer.send("quitGame");
            } else {
                require('nw.gui').Shell.openExternal('steam://launch/' + NekoGakuen_SteamworksPlus.SteamAppID + '/');
                NekoGakuen_SteamworksPlus.SteamAPI_Shutdown();
                SceneManager.exit();
            }
        }
    } else {
        console.log(`%c${NekoGakuen_SteamworksPlus.ConsoleLog01}`, 'color: green;');
        setInterval(() => {
            SteamworksPlusManager.steamAPI_RunCallbacks();
            if (NekoGakuen_SteamworksPlus.CheckBuyGameBoolean == 'true') {
                SteamworksPlusManager.steamAPI_IsSteamRunning();
            }
        }, 100);
    }
};

SteamworksPlusManager.steamAPI_RestartAppIfNecessary = function () {
    return NekoGakuen_SteamworksPlus.SteamAPI_RestartAppIfNecessary(NekoGakuen_SteamworksPlus.SteamAppID);
};

SteamworksPlusManager.steamAPI_Shutdown = function () {
    NekoGakuen_SteamworksPlus.SteamAPI_Shutdown();
};

SteamworksPlusManager.steamAPI_RunCallbacks = function () {
    NekoGakuen_SteamworksPlus.SteamAPI_RunCallbacks();
};

SteamworksPlusManager.steamAPI_IsSteamOverlayActive = function () {
    return NekoGakuen_SteamworksPlus.SteamAPI_IsSteamOverlayActive();
};

SteamworksPlusManager.steamAPI_IsSteamRunning = function () {
    if (!NekoGakuen_SteamworksPlus.SteamAPI_IsSteamRunning()) {
        NekoGakuen_SteamworksPlus.SteamAPI_Shutdown();
        if (isElectron) {
            require("electron").ipcRenderer.send("quitGame");
        } else {
            SceneManager.exit();
        }
        return false;
    }
};


// ── MZ 核心初始化 ─────────────────────────────────────────────────────────────
if (Utils.RPGMAKER_NAME === "MZ") {
    (() => {

        PluginManager.isPlugins = function (pluginsName) {
            return this._scripts.includes(pluginsName);
        };

        Graphics.showBuyGameButton = function (retry) {
            const button = document.createElement("button");
            button.id = "retryButton";
            button.innerHTML = NekoGakuen_SteamworksPlus.ErrorBuyGameButton;
            // [Note] stopPropagation() is required for iOS Safari.
            button.ontouchstart = e => e.stopPropagation();
            button.onclick = () => {
                Graphics.eraseError();
                retry();
            };
            this._errorPrinter.appendChild(button);
            button.focus();
        };

        NekoGakuen_SteamworksPlus._Scene_Boot_startNormalGame = Scene_Boot.prototype.startNormalGame;
        Scene_Boot.prototype.startNormalGame = function () {
            if (NekoGakuen_SteamworksPlus.SteamUtils_IsSteamRunningOnSteamDeck() || NekoGakuen_SteamworksPlus.SteamUtils_IsSteamInBigPictureMode()) {
                if (isElectron) {
                    require("electron").ipcRenderer.send("setFullscreen");
                } else {
                    Graphics._requestFullScreen();
                }
            }
            if (NekoGakuen_SteamworksPlus.CheckMusicPause == 'true') {
                NekoGakuen_SteamworksPlus.SteamMusic_Pause();
            }
            if (NekoGakuen_SteamworksPlus.CheckBuyGameBoolean == 'true') {
                setTimeout(() => {
                    SteamworksPlusManager.steamAPI_RestartAppIfNecessary();
                    if (!NekoGakuen_SteamworksPlus.SteamApps_Subscribed()) {
                        Graphics.printError(NekoGakuen_SteamworksPlus.ErrorBuyGameTitle, NekoGakuen_SteamworksPlus.ErrorBuyGameMessage);
                        Graphics.showBuyGameButton(() => {
                            NekoGakuen_SteamworksPlus.SteamFriends_ActivateGameOverlayToStore("this", 0);
                        });
                        AudioManager.stopAll();
                        SceneManager.stop();
                    }
                }, 250);
            }
            NekoGakuen_SteamworksPlus.SteamGameLaunch = true;
            NekoGakuen_SteamworksPlus._Scene_Boot_startNormalGame.call(this);
        };


        NekoGakuen_SteamworksPlus._SceneManager_initialize = SceneManager.initialize;
        SceneManager.initialize = function () {
            NekoGakuen_SteamworksPlus._SceneManager_initialize.apply(this, arguments);
            SteamworksPlusManager.steamAPI_Init();
        };

    })();
}

// ── MV 核心初始化 ─────────────────────────────────────────────────────────────
if (Utils.RPGMAKER_NAME === "MV") {
    (function () {

        var _render = Graphics.render;
        Graphics.render = function (stage) {
            if (this._skipCount < 0) {
                this._skipCount = 0;
            }
            _render.call(this, stage);
        };

        PluginManager.isPlugins = function (pluginsName) {
            return this._scripts.includes(pluginsName);
        };

        Graphics.showBuyGameButton = function () {
            var button = document.createElement('button');
            button.innerHTML = NekoGakuen_SteamworksPlus.ErrorBuyGameButton;
            button.style.fontSize = '24px';
            button.style.color = '#ffffff';
            button.style.backgroundColor = '#000000';
            button.onmousedown = button.ontouchstart = function (event) {
                NekoGakuen_SteamworksPlus.SteamFriends_ActivateGameOverlayToStore("this", 0);
                location.reload();
                event.stopPropagation();
            };
            this._errorPrinter.appendChild(button);
            this._loadingCount = -Infinity;
        };

        NekoGakuen_SteamworksPlus._Scene_Boot_start = Scene_Boot.prototype.start;
        Scene_Boot.prototype.start = function () {
            if (NekoGakuen_SteamworksPlus.SteamUtils_IsSteamRunningOnSteamDeck() || NekoGakuen_SteamworksPlus.SteamUtils_IsSteamInBigPictureMode()) {
                if (isElectron) {
                    require("electron").ipcRenderer.send("setFullscreen");
                } else {
                    Graphics._requestFullScreen();
                }
            }
            if (NekoGakuen_SteamworksPlus.CheckMusicPause == 'true') {
                NekoGakuen_SteamworksPlus.SteamMusic_Pause();
            }
            if (NekoGakuen_SteamworksPlus.CheckBuyGameBoolean == 'true') {
                setTimeout(() => {
                    SteamworksPlusManager.steamAPI_RestartAppIfNecessary();
                    if (!NekoGakuen_SteamworksPlus.SteamApps_Subscribed()) {
                        Graphics.printError(NekoGakuen_SteamworksPlus.ErrorBuyGameTitle, NekoGakuen_SteamworksPlus.ErrorBuyGameMessage);
                        Graphics.showBuyGameButton()
                        AudioManager.stopAll();
                        SceneManager.stop();
                    }
                }, 250);
            }
            NekoGakuen_SteamworksPlus.SteamGameLaunch = true;
            NekoGakuen_SteamworksPlus._Scene_Boot_start.call(this);
        };

        NekoGakuen_SteamworksPlus._SceneManager_initialize = SceneManager.initialize;
        SceneManager.initialize = function () {
            NekoGakuen_SteamworksPlus._SceneManager_initialize.apply(this, arguments);
            SteamworksPlusManager.steamAPI_Init();
        };

        if (isElectron) {
            SceneManager.onKeyDown = function (event) {
                if (!event.ctrlKey && !event.altKey) {
                    switch (event.keyCode) {
                        case 116:   // F5
                            if (Utils.isNwjs()) {
                                require('electron').ipcRenderer.send('reloadGame');
                            }
                            break;
                        case 119:   // F8
                            if (Utils.isNwjs() && Utils.isOptionValid('test')) {
                                require('electron').ipcRenderer.send('openDevTools');
                            }
                            break;
                    }
                }
            };
        }

    })();
}
