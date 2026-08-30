//=============================================================================
// NekoGakuen_SteamworksAPI_en_US.js
// Version: 1.1.4
//=============================================================================
/*:
 * @target MV MZ
 * @plugindesc Steamworks API
 * @author (Translator Name)
 * @url (Translator Website)
 * @help
 * ================================
 * Author: NekoGakuen
 * Version: 1.1.4
 * Twitter: https://twitter.com/NekoGakuen
 * ================================
 * 
 * -- Plugin Information --
 * Let RPG Maker MV/MZ to use the API features from the Steam platform as well.
 * 
 * 
 * -- Update Information --
 * V1.1.4 Fixed the parameter name of the translation patch.
 * V1.1.3 Fixed the issue where DLC ID was not recognized correctly.
 * V1.1.2 Added support for setting leaderboard scores using variables.
 *        (Thanks to "Undermax Games" for his assistance.)
 * V1.1.1 Added the functionality to pause the original soundtrack music playback during the game runtime.
 * V1.1.0 Added Microtransactions(Alpha) and Leaderboards(Alpha) features.
 * V1.0.8 Fixed the feature related to game stat.
 * V1.0.7 Added a fix update for RPG Maker MV causing screen stalls on Steam Deck's Proton 8.0-3 version.
 * V1.0.6 Bug fixes.
 * V1.0.5 Change the action that runs when the Steam client is not started.
 * V1.0.4 Fix game pause on Steam Deck.
 * V1.0.3 Add plugin parameters for fullscreen and pause features.
 * V1.0.2 Fix the part on Steam Deck.
 * V1.0.1 Remove the check code at non-game test mode.
 * V1.0.0 Release plugin.
 * 
 * 
 * -- Use Description --
 * 1. There are a few pre-requisite steps to complete,
 *    please refer to the manual link in the Manual folder.
 * 2. Load the plugin in the "Plugin Manager" of RPG Maker MV/MZ.
 * 3. Select the Advanced section of Event Commands "Plugin Command..." or "Script...", 
 *    and set the parameters of the "Plugin Command" or "Script" to be executed.
 * 
 * 
 * -- Plugin Command / Script --
 * 
 * --------------------------------
 *  ▪ Common Features
 * --------------------------------
 * 
 * [ Check Purchased Games ]
 * -- Description: 
 *    Check if the user has purchased the game.
 * >> Parameter01: 
 *    Game Application ID (AppID). 
 *    If you have set "Game Application ID" parameter in "Plugin Manager", 
 *    you can input "this" to get the currently set game application ID.
 * >> Parameter02: 
 *    Switch ID.
 *    In the case of event command "Conditional Branch", this parameter can be omitted.
 * -- Plugin Command: 
 *    NekoCommands GetBuy_SteamGameApp <Parameter01> <Parameter02>
 * -- Script: 
 *    SteamworksAPIManager.isSubscribedApp('<Parameter01>', <Parameter02>);
 * -- Conditional Branch: 
 *    SteamworksAPIManager.isSubscribedApp('<Parameter01>') == <Conditional Args>;
 * >> Conditional Args: 
 *    Enter "true" or "false", 
 *    "true" means you have purchased the game,
 *    "false" means you have not purchased the game.
 *
 * [ Check Installed Games ]
 * -- Description: 
 *    Check if the user has installed the game on the computer during the game.
 * >> Parameter01:
 *    Game Application ID (AppID). 
 *    If you have set "Game Application ID" parameter in "Plugin Manager", 
 *    you can input "this" to get the currently set game application ID.
 * >> Parameter02: 
 *    Switch ID.
 *    In the case of event command "Conditional Branch", this parameter can be omitted.
 * -- Plugin Command: 
 *    NekoCommands GetInstalled_SteamGameApp <Parameter01> <Parameter02>
 * -- Script: 
 *    SteamworksAPIManager.isAppInstalled('<Parameter01>', <Parameter02>);
 * -- Conditional Branch: 
 *    SteamworksAPIManager.isAppInstalled('<Parameter01>') == <Conditional Args>;
 * >> Conditional Args: 
 *    Enter "true" or "false", 
 *    "true" is installed game to computer, 
 *    "false" is not installed game to computer.
 * 
 * [ Call Steam Overlay ]
 * -- Description: 
 *    Call "Steam Overlay" for the Steam platform in-game.
 * >> Parameter:
 *    The "Steam Overlay" paging option you want to display, 
 *    select the paging option you want to call in "Steam Overlay", 
 *    the parameter options available are as follows:
 *    ● Friends
 *    ● Community
 *    ● Players
 *    ● Settings
 *    ● OfficialGameGroup
 *    ● Stats
 *    ● Achievements
 * -- Plugin Command: 
 *    NekoCommands Call_SteamGameOverlay <Parameter>
 * -- Script: 
 *    SteamworksAPIManager.activateGameOverlay('<Parameter>');
 * 
 * [ Check Steam Overlay ]
 * -- Description: 
 *    Check if "Steam Overlay" is currently enable on in the game.
 * >> Parameter: 
 *    Switch ID.
 *    In the case of event command "Conditional Branch", this parameter can be omitted.
 * -- Plugin Command: 
 *    NekoCommands GetCurrentState_SteamGameOverlay <Parameter>
 * -- Script: 
 *    SteamworksAPIManager.isGameOverlayEnabled(<Parameter>);
 * -- Conditional Branch: 
 *    SteamworksAPIManager.isGameOverlayEnabled() == <Conditional Args>;
 * >> Conditional Args: 
 *    Enter "true" or "false", 
 *    "true" means Steam Overlay is enabled, "false" means Steam Overlay is not enabled.
 * 
 * [ Check Big Picture Mode ]
 * -- Description: 
 *    Check if "Big Picture Mode" is currently on in the game.
 * >> Parameter: 
 *    Switch ID.
 *    In the case of event command "Conditional Branch", this parameter can be omitted.
 * -- Plugin Command: 
 *    NekoCommands GetCurrentState_SteamBigPictureMode <Parameter>
 * -- Script: 
 *    SteamworksAPIManager.isSteamInBigPictureMode(<Parameter>);
 * -- Conditional Branch: 
 *    SteamworksAPIManager.isSteamInBigPictureMode() == <Conditional Args>;
 * >> Conditional Args: 
 *    Enter "true" or "false", 
 *    "true" means Big Picture Mode is enabled, "false" means Big Picture Mode is not enabled.
 * 
 * [ Check Steam Deck Gaming Mode ]
 * -- Description: 
 *    Check if the game is currently in the "Gaming Mode" of the Steam Deck console.
 * >> Parameter: 
 *    Switch ID.
 *    In the case of event command "Conditional Branch", this parameter can be omitted.
 * -- Plugin Command: 
 *    NekoCommands GetCurrentState_SteamDeckMode <Parameter>
 * -- Script: 
 *    SteamworksAPIManager.isSteamDeckMode(<Parameter>);
 * -- Conditional Branch: 
 *    SteamworksAPIManager.isSteamDeckMode() == <Conditional Args>;
 * >> Conditional Args: 
 *    Enter "true" or "false", 
 *    "true" for Steam Deck console, "false" for other PC platforms.
 * 
 * [ Call Web Page ]
 * -- Description: 
 *    Call the set web page on the Steam client.
 * >> Parameter: 
 *    Web URL.
 * -- Plugin Command: 
 *    NekoCommands Call_SteamInGameWebURL <Parameter>
 * -- Script: 
 *    SteamworksAPIManager.activateGameOverlayToWebPage('<Parameter>');
 * 
 * [ Call Game Purchase Page ]
 * -- Description: 
 *    Call your game purchase page in the Steam client, 
 *    this feature can be used on occasions such as the Add to Wish List button option.
 * -- Plugin Command: 
 *    NekoCommands BuyGamePage_SteamGameApp
 * -- Script: 
 *    SteamworksAPIManager.goToGamePage();
 * 
 * 
 * --------------------------------
 *  ▪ Game Achievement Features
 * --------------------------------
 * 
 * [ Unlock Achievement ]
 * -- Description: 
 *    Unlock the set Steam game achievement in the game.
 * >> Parameter01: 
 *    The achievement ID you set on the Steamworks page.
 * >> Parameter02: 
 *    Common Event ID.
 *    After you unlock this game achievement, call the Common Event of the setting, 
 *    if you do not want to use the call Common Event, you can not enter this parameter.
 * -- Plugin Command: 
 *    NekoCommands Unlock_SteamAchievement <Parameter01> <Parameter02>
 * -- Script: 
 *    SteamworksAPIManager.activateAchievement('<Parameter01>', <Parameter02>);
 * 
 * [ Check Unlocked Achievement ]
 * -- Description: 
 *    Check if the user has unlocked the set Steam game achievements in the game.
 * >> Parameter01:
 *    The achievement ID you set on the Steamworks page.
 * >> Parameter02:
 *    Switch ID.
 *    ＊This features requires a "Switch ID" to be set for subsequent event.
 * -- Plugin Command: 
 *    NekoCommands Get_SteamAchievement <Parameter01> <Parameter02>
 * -- Script: 
 *    SteamworksAPIManager.getAchievement('<Parameter01>', <Parameter02>);
 * 
 * [ Clear Achievement ]
 * -- Description: 
 *    Clear the set Steam game achievement in the game.
 * >> Parameter:
 *    The achievement ID you set on the Steamworks page.
 * -- Plugin Command: 
 *    NekoCommands Clear_SteamAchievement <Parameter>
 * -- Script: 
 *    SteamworksAPIManager.clearAchievement('<Parameter>');
 * 
 * [ Show Achievement Progress(?) ]
 * -- Description: 
 *    Show in-game achievements for Steam games that have progress type. (Experimental?)
 * >> Parameter01:
 *    The achievement ID you set on the Steamworks page.
 * >> Parameter02:
 *    The current value of the progress of achievements.
 * >> Parameter03:
 *    The maximum value of achievement progress.
 * >> Parameter04:
 *    Switch ID.
 *    In the case of event command "Conditional Branch", this parameter can be omitted.
 * -- Plugin Command: 
 *    NekoCommands Progress_SteamAchievement <Parameter01> <Parameter02> <Parameter03> <Parameter04>
 * -- Script: 
 *    SteamworksAPIManager.indicateAchievementProgress('<Parameter01>', <Parameter02>, <Parameter03>, <Parameter04>);
 * -- Conditional Branch: 
 *    SteamworksAPIManager.indicateAchievementProgress('<Parameter01>', <Parameter02>, <Parameter03>) == <Conditional Args>;
 * >> Conditional Args: 
 *    Enter "true" or "false", 
 *    "true" is the achievement completed, "false" is the achievement not completed.
 * 
 * 
 * --------------------------------
 *  ▪ Downloadable Content
 * --------------------------------
 * 
 * [ Get Number of Downloadable Content ]
 * -- Description: 
 *    Get Downloadable Content of this game the user has in the game.
 * >> Parameter: 
 *    Variable ID.
 *    In the case of event command "Conditional Branch", this parameter can be omitted.
 * -- Plugin Command: 
 *    NekoCommands GetCount_SteamDLC <Parameter>
 * -- Script: 
 *    SteamworksAPIManager.getDLCCount(<Parameter>);
 * -- Conditional Branch: 
 *    SteamworksAPIManager.getDLCCount() >= <Conditional Args>;
 * >> Conditional Args: 
 *    Enter the number.
 * 
 * [ Check the Installed Downloadable Content ]
 * -- Description: 
 *    Check in-game if the user has installed this game's Downloadable Content on the computer.
 * >> Parameter01: 
 *    The Downloadable Content ID(DLCAppID) you set on the Steamworks page.
 * >> Parameter02: 
 *    Switch ID.
 *    In the case of event command "Conditional Branch", this parameter can be omitted.
 * -- Plugin Command: 
 *    NekoCommands GetInstalled_SteamDLC <Parameter01> <Parameter02>
 * -- Script: 
 *    SteamworksAPIManager.isDLCInstalled('<Parameter01>', <Parameter02>);
 * -- Conditional Branch: 
 *    SteamworksAPIManager.isDLCInstalled('<Parameter01>') == <Conditional Args>;
 * >> Conditional Args: 
 *    Enter "true" or "false", 
 *    "true" is installed game to computer, "false" is not installed game to computer.
 * 
 * [ Install Downloadable Content ]
 * -- Description: 
 *    Install the Downloadable Content of this game in the game to your computer.
 * >> Parameter: 
 *    The Downloadable Content ID(DLCAppID) you set on the Steamworks page.
 * -- Plugin Command: 
 *    NekoCommands Install_SteamDLC <Parameter>
 * -- Script: 
 *    SteamworksAPIManager.installDLC('<Parameter>');
 * 
 * [ Uninstall Downloadable Content ]
 * -- Description: 
 *    Uninstall the Downloadable Content of this game.
 * >> Parameter: 
 *    The Downloadable Content ID(DLCAppID) you set on the Steamworks page.
 * -- Plugin Command: 
 *    NekoCommands Uninstall_SteamDLC <Parameter>
 * -- Script: 
 *    SteamworksAPIManager.uninstallDLC('<Parameter>');
 * 
 * 
 * --------------------------------
 *  ▪ Game Language Features
 * --------------------------------
 * 
 * [ Get Game Language ]
 * -- Description: 
 *    Get the user's language settings in the game application.
 * >> Parameter: 
 *    Variable ID.
 *    In the case of event command "Conditional Branch", this parameter can be omitted.
 * -- Plugin Command: 
 *    NekoCommands GetCurrentGame_SteamLanguage <Parameter>
 * -- Script: 
 *    SteamworksAPIManager.getCurrentGameLanguage(<Parameter>);
 * -- Conditional Branch: 
 *    SteamworksAPIManager.getCurrentGameLanguage() == <Conditional Args>;
 * >> Conditional Args: 
 *    Enter the language code provided by the Steam platform.
 *    Refer to the "Supported Languages" in the table on the following URL page:
 *    https://partner.steamgames.com/doc/store/localization#supported_languages
 * 
 * [ Get Steam Language ]
 * -- Description: 
 *    Get the user's language settings on the Steam client.
 * >> Parameter: 
 *    Variable ID.
 *    In the case of event command "Conditional Branch", this parameter can be omitted.
 * -- Plugin Command: 
 *    NekoCommands GetCurrentUI_SteamLanguage <Parameter>
 * -- Script: 
 *    SteamworksAPIManager.getCurrentUILanguage(<Parameter>);
 * -- Conditional Branch: 
 *    SteamworksAPIManager.getCurrentUILanguage() == <Conditional Args>;
 * >> Conditional Args: 
 *    Enter the language code provided by the Steam platform.
 *    Refer to the "Supported Languages" in the table on the following URL page:
 *    https://partner.steamgames.com/doc/store/localization#supported_languages
 * 
 * 
 * --------------------------------
 *  ▪ Game Stats Features
 * --------------------------------
 * 
 * [ Set Game Stats ]
 * -- Description: 
 *    Set the value to the game stats in the game.
 * >> Parameter01: 
 *    The Game stats name you set on the Steamworks page.
 * >> Parameter02: 
 *    Enter the number.
 * >> Parameter03: 
 *    Switch ID.
 *    In the case of event command "Conditional Branch", this parameter can be omitted.
 * -- Plugin Command: 
 *    NekoCommands SetValue_SteamStats <Parameter01> <Parameter02> <Parameter03>
 * -- Script: 
 *    SteamworksAPIManager.setStat('<Parameter01>', <Parameter02>, <Parameter03>);
 * -- Conditional Branch: 
 *    SteamworksAPIManager.setStat('<Parameter01>', <Parameter02>) == <Conditional Args>;
 * >> Conditional Args: 
 *    Enter "true" or "false", 
 *    "true" is successful in saving the stats, "false" is unable to save the stats.
 * 
 * [ Get Game Stats ]
 * -- Description: 
 *    Get the set game stats in the game.
 * >> Parameter01: 
 *    Set the value to the game stats in the game.
 * >> Parameter02: 
 *    The show type of the game stats.
 *    "1" is show as a floating point number, "2" is show as a number.
 * >> Parameter03: 
 *    Variable ID.
 *    In the case of event command "Conditional Branch", this parameter can be omitted.
 * -- Plugin Command: 
 *    NekoCommands GetValue_SteamStats <Parameter01> <Parameter02> <Parameter03>
 * -- Script: 
 *    SteamworksAPIManager.getStat('<Parameter01>', <Parameter02>, <Parameter03>);
 * -- Conditional Branch: 
 *    SteamworksAPIManager.getStat('<Parameter01>', <Parameter02>) >= <Conditional Args>;
 * >> Conditional Args: 
 *    Enter a number or floating point number.
 * 
 * [ Sync Game Stats]
 * -- Description: 
 *    Sync current game stats to the Steam platform server in-game.
 * -- Plugin Command: 
 *    NekoCommands StoreValues_SteamStats
 * -- Script: 
 *    SteamworksAPIManager.storeStats();
 * 
 * 
 * --------------------------------
 *  ▪ Microtransactions Features (Alpha)
 * --------------------------------
 * 
 * [ Call Product Purchase ]
 * -- Description: 
 *    Call the product's purchase page.
 * >> Parameter: 
 *    Product ID.
 *    The "Product ID" you set in the "Microtransactions Product List" of the Plugin Manager.
 * -- Plugin Command: 
 *    NekoCommands CallBuyItem_SteamMicroTxn <Parameter>
 * -- Script: 
 *    SteamworksAPIManager.callMicroTxn(<Parameter>);
 * 
 * [ Get Transaction Status ]
 * -- Description: 
 *    Get the status of your current transactions on the product in the game.
 *    ＊This features requires the "Call Product Purchase" plugin command before subsequent event can be performed.
 * -- Plugin Command: 
 *    NekoCommands GetBuyQuery_SteamMicroTxn
 * -- Script: 
 *    SteamworksAPIManager.isMicroTxnQuery();
 * 
 * [ Call Product Refund ]
 * -- Description: 
 *    Refund your currently purchased products in the game.
 *    ＊This features requires the "Call Product Purchase" plugin command before subsequent event can be performed.
 * -- Plugin Command: 
 *    NekoCommands CallRefund_SteamMicroTxn
 * -- Script: 
 *    SteamworksAPIManager.refundMicroTxn();
 * 
 * [ Call Product Checkout ]
 * -- Description: 
 *    Checkout the products you currently have in your shopping cart.
 *    ＊This features requires the "Get Transaction Status" plugin command before subsequent event can be performed.
 * -- Plugin Command: 
 *    NekoCommands CallFinalBuy_SteamMicroTxn
 * -- Script:
 *    SteamworksAPIManager.finalizeMicroTxn();
 * 
 * 
 * -----------------
 *  ▪ Leaderboard Features (Alpha)
 * -----------------
 * 
 * [ Delete Leaderboard ]
 * -- Description: 
 *    Leaderboard data deleted during gameplay.
 * >> Parameter: 
 *    Leaderboard Name, set the name of the leaderboard to be deleted.
 * -- Plugin Command: 
 *    NekoCommands DeleteLeaderboard_SteamLeaderboard <Parameter>
 * -- Script:
 *    SteamworksAPIManager.deleteLeaderboard('<Parameter>');
 * 
 * [ Find or Create Leaderboards ]
 * -- Description: 
 *    Finds or creates leaderboard data in the game.
 * >> Parameter01: 
 *    Leaderboard Name, set the name of the leaderboard to find or create.
 * >> Parameter02: 
 *    Create Leaderboard, enter "true" or "false".
 *    When this is turned on, if no existing leaderboard is found, the leaderboard will be created automatically.
 * >> Parameter03: 
 *    Write Leaderboard, enter "true" or "false",
 *    when this is turned on, the leaderboard will be created automatically when no existing leaderboard is found.
 * >> Parameter04: 
 *    Read only by friends, enter "true" or "false", 
 *    when turned on, will accept only trusted data writes.
 * -- Plugin Command: 
 *    NekoCommands FindOrCreateLeaderboard_SteamLeaderboard <Parameter01> <Parameter02> <Parameter03> <Parameter04>
 * -- Script:
 *    SteamworksAPIManager.findOrCreateLeaderboard('<Parameter01>', <Parameter02>, <Parameter03>, <Parameter04>);
 * 
 * [ Get Leaderboard Entry ]
 * -- Description: 
 *    To get the Leaderboard item data in the game,
 *    remember to call it once with the "Get Game Leaderboard" plugin command before using it.
 * >> Parameter01: 
 *    "Start Range" sets the starting position of the leaderboard item.
 * >> Parameter02: 
 *    "End Range" sets the starting position of the leaderboard item.
 * >> Parameter03: 
 *    "Data Request Method", set the data request method of the leaderboard, 
 *    the specified parameters are "RequestGlobal", "RequestAroundUser" and "RequestFriends".
 * -- Plugin Command: 
 *    NekoCommands GetLeaderboardEntries_SteamLeaderboard <Parameter01> <Parameter02> <Parameter03>
 * -- Script:
 *    SteamworksAPIManager.getLeaderboardEntries(<Parameter01>, <Parameter02>, '<Parameter03>');
 * 
 * [ Get Game Leaderboard ]
 * -- Description: 
 *    Get on the game leaderboards.
 * >> Parameter: 
 *    "Sequence ID", set the sequence ID of the leaderboard.
 * -- Plugin Command: 
 *    NekoCommands GetLeaderboardsForGame_SteamLeaderboard <Parameter>
 * -- Script:
 *    SteamworksAPIManager.getLeaderboardsForGame(<Parameter>);
 * 
 * [ Reset Game Leaderboards ]
 * -- Description: 
 *    To reset the game leaderboard in the game, 
 *    remember to call it once with the "Get Game Leaderboard" plugin command before using it.
 * -- Plugin Command: 
 *    NekoCommands ResetLeaderboard_SteamLeaderboard
 * -- Script:
 *    SteamworksAPIManager.resetLeaderboard();
 * 
 * [ Set Leaderboard Score ]
 * -- Description: 
 *    Setting game leaderboard scores in the game,
 *    remember to call it once with the "Get Game Leaderboard" plugin command before using it.
 * >> Parameter01: 
 *    "Score", set the score of the leaderboard.
 * >> Parameter02: 
 *    "Score Principle", set the principle of updating the score, 
 *    the parameters are "KeepBest" and "ForceUpdate".
 * >> Parameter03: 
 *    ID of the game variable storing the score. If set, it will override the Score setting.
 * -- Plugin Command: 
 *    NekoCommands SetLeaderboardScore_SteamLeaderboard <Parameter01> <Parameter02> <Parameter03>
 * -- Script:
 *    SteamworksAPIManager.setLeaderboardScore(<Parameter01>, '<Parameter02>', <Parameter03>);
 * 
 * [ Call Game Leaderboard ]
 * -- Description: 
 *    To call the game leaderboard in the game, 
 *    remember to call it with the "Get Game Leaderboard" and "Get Leaderboard Entry" plugin commands before using it.
 * -- Plugin Command: 
 *    NekoCommands CallLeaderboard_SteamLeaderboard
 * 
 * 
 * --------------------------------
 *  ▪ Other Features
 * --------------------------------
 * 
 * [ Get the Number of Players ]
 * -- Description: 
 *    Get the number of players who are currently playing the game in the game.
 * >> Parameter: 
 *    Variable ID.
 *    ＊This features requires a "Variable ID" to be set for subsequent event.
 * -- Plugin Command: 
 *    NekoCommands GetCurrentCount_SteamPlayers <Parameter>
 * -- Script:
 *    SteamworksAPIManager.getNumberOfPlayers(<Parameter>);
 * 
 * [ Get Steam ID ]
 * -- Description: 
 *    Get the Steam ID of the current player in the game.
 * >> Parameter: 
 *    Variable ID.
 *    In the case of event command "Conditional Branch", this parameter can be omitted.
 * -- Plugin Command: 
 *    NekoCommands GetSteamID_SteamPlayers <Parameter>
 * -- Script:
 *    SteamworksAPIManager.getSteamId(<Parameter>);
 * 
 * [ Get Player Nickname ]
 * -- Description: 
 *    Get the current player nickname in the game.
 * >> Parameter01: 
 *    Steam ID.
 * >> Parameter02:
 *    Variable ID.
 *    In the case of event command "Conditional Branch", this parameter can be omitted.
 * -- Plugin Command: 
 *    NekoCommands GetPlayerName_SteamPlayers <Parameter01> <Parameter02>
 * -- Script:
 *    SteamworksAPIManager.getPlayerName('<Parameter01>', <Parameter02>);
 * 
 * [ Delete Cloud Saves ]
 * -- Description: 
 *    Clear all the game archives in the cloud server.
 * -- Plugin Command: 
 *    NekoCommands DelAllCloudData_SteamCloudSave
 * -- Script:
 *    CloudSaveManager.clearAllCloud();
 * 
 * 
 *  --Supported Platforms --
 * - NWjs:
 *   [√ Yes(Windows、macOS)]
 * - Electron:
 *   [√ Yes(Windows、macOS)]
 * - Google Chrome:
 *   [× No]
 * - Mozilla Firefox:
 *   [× No]
 * - Microsoft Edge:
 *   [× No]
 * - Apple Safari:
 *   [× No]
 * - Android:
 *   [× No]
 * - iOS:
 *   [× No]
 *
 *
 *
 * -- Terms of Use --
 * No prior notice is required to modify or translate this plugin, and if the plugin has bugs you can report them.
 * The copyright of this plugin is owned by NekoGakuen.
 * We also reserve the right to modify and change the rules of use of the plugin.
 * 
 * --------------------
 * - Credit: 
 *   [△ Not required, but appreciated if you have one. (#1)]
 * - Commercial: 
 *   [√ OK]
 * - Adults:
 *   [√ OK]
 * 
 * #1：If you want to attach it, you can mark it with "NekoGakuen".
 * --------------------
 * 
 * @command NekoCommands GetBuy_SteamGameApp
 * @text Check Purchased Games
 * @desc Check if the user has purchased the game.
 * 
 * @arg appId
 * @text Game Application ID(AppID)
 * @desc If you have set "Game Application ID" parameter in "Plugin Manager", you can input "this" to get the currently set game application ID.
 * @type string
 * @default this
 * 
 * @arg switchesId
 * @text Switch ID
 * @desc In the case of event command "Conditional Branch", this parameter can be omitted.
 * @type switch
 * @default 0
 * 
 * 
 * @command NekoCommands GetInstalled_SteamGameApp
 * @text Check Installed Games
 * @desc Check if the user has installed the game on the computer during the game.
 * 
 * @arg appId
 * @text Game Application ID(AppID)
 * @desc If you have set "Game Application ID" parameter in "Plugin Manager", you can input "this" to get the currently set game application ID.
 * @type string
 * @default this
 * 
 * @arg switchesId
 * @text Switch ID
 * @desc In the case of event command "Conditional Branch", this parameter can be omitted.
 * @type switch
 * @default 0
 * 
 * 
 * @command NekoCommands Call_SteamGameOverlay
 * @text Call Steam Overlay
 * @desc Call "Steam Overlay" for the Steam platform in-game.
 * 
 * @arg options
 * @text Page Options
 * @desc The "Steam Overlay" paging option you want to display.
 * @type select
 * @default Friends
 * @option Friends
 * @value Friends
 * @option Community
 * @value Community
 * @option Players
 * @value Players
 * @option Settings
 * @value Settings
 * @option Official Game Group
 * @value OfficialGameGroup
 * @option Stats
 * @value Stats
 * @option Achievements
 * @value Achievements
 * 
 * 
 * @command NekoCommands GetCurrentState_SteamGameOverlay
 * @text Check Steam Overlay
 * @desc Check if "Steam Overlay" is currently enable in the game.
 * 
 * @arg switchesId
 * @text Switch ID
 * @desc In the case of event command "Conditional Branch", this parameter can be omitted.
 * @type switch
 * @default 0
 * 
 * 
 * @command NekoCommands GetCurrentState_SteamBigPictureMode
 * @text Check Big Picture Mode
 * @desc Check if "Big Picture Mode" is currently on in the game.
 * 
 * @arg switchesId
 * @text Switch ID
 * @desc In the case of event command "Conditional Branch", this parameter can be omitted.
 * @type switch
 * @default 0
 * 
 * 
 * @command NekoCommands GetCurrentState_SteamDeckMode
 * @text Check Steam Deck Gaming Mode
 * @desc Check if the game is currently in the "Gaming Mode" of the Steam Deck console.
 * 
 * @arg switchesId
 * @text Switch ID
 * @desc In the case of event command "Conditional Branch", this parameter can be omitted.
 * @type switch
 * @default 0
 * 
 * 
 * @command NekoCommands Call_SteamInGameWebURL
 * @text Call Web Page
 * @desc Call the set web page on the Steam client.
 * 
 * @arg webURL
 * @text Web URL
 * @desc Set the web page URL.
 * @type string
 * @default https://
 * 
 * 
 * @command NekoCommands BuyGamePage_SteamGameApp
 * @text Call Game Purchase Page
 * @desc Call your game purchase page in the Steam client, this feature can be used on occasions such as the Add to Wish List button option.
 * 
 * 
 * @command NekoCommands Unlock_SteamAchievement
 * @text Unlock Achievement
 * @desc Unlock the set Steam game achievement in the game.
 * 
 * @arg achievementId
 * @text Achievement ID
 * @desc The achievement ID you set on the Steamworks page.
 * @type string
 * 
 * @arg commonEventId
 * @text Common Event ID
 * @desc After you unlock this game achievement, call the Common Event of the setting, if you do not want to use the call Common Event, you can not enter this parameter.
 * @type common_event
 * @default 0
 * 
 * 
 * @command NekoCommands Get_SteamAchievement
 * @text Check Unlocked Achievement
 * @desc Check if the user has unlocked the set Steam game achievements in the game.
 * 
 * @arg achievementId
 * @text Achievement ID
 * @desc The achievement ID you set on the Steamworks page.
 * @type string
 * 
 * @arg switchesId
 * @text Switch ID
 * @desc ＊This features requires a "Switch ID" to be set for subsequent event.
 * @type switch
 * @default 0
 * 
 * 
 * @command NekoCommands Clear_SteamAchievement
 * @text Clear Achievement
 * @desc Clear the set Steam game achievement in the game.
 * 
 * @arg achievementId
 * @text Achievement ID
 * @desc The achievement ID you set on the Steamworks page.
 * @type string
 * 
 * 
 * @command NekoCommands Progress_SteamAchievement
 * @text Show Achievement Progress(?)
 * @desc Show in-game achievements for Steam games that have progress type. (Experimental?)
 * 
 * @arg achievementId
 * @text Achievement ID
 * @desc The achievement ID you set on the Steamworks page.
 * @type string
 * 
 * @arg currentValue
 * @text Current Value
 * @desc The current value of the progress of achievements.
 * @type number
 * @min 0
 * @default 0
 * 
 * @arg maxValue
 * @text Maximum Value
 * @desc The maximum value of achievement progress.
 * @type number
 * @min 0
 * @default 0
 * 
 * @arg switchesId
 * @text Switch ID
 * @desc In the case of event command "Conditional Branch", this parameter can be omitted.
 * @type switch
 * @default 0
 * 
 * 
 * @command NekoCommands GetCount_SteamDLC
 * @text Get Number of Downloadable Content
 * @desc Get Downloadable Content of this game the user has in the game.
 * 
 * @arg variablesId
 * @text Variable ID
 * @desc In the case of event command "Conditional Branch", this parameter can be omitted.
 * @type variable
 * @default 0
 * 
 * 
 * @command NekoCommands GetInstalled_SteamDLC
 * @text Check the Installed Downloadable Content
 * @desc Check in-game if the user has installed this game's Downloadable Content on the computer.
 * 
 * @arg dlc_app_id
 * @text Downloadable Content ID(DLCAppID)
 * @desc The Downloadable Content ID(DLCAppID) you set on the Steamworks page.
 * @type string
 * 
 * @arg switchesId
 * @text Switch ID
 * @desc In the case of event command "Conditional Branch", this parameter can be omitted.
 * @type switch
 * @default 0
 * 
 * 
 * @command NekoCommands Install_SteamDLC
 * @text Install Downloadable Content
 * @desc Install the Downloadable Content of this game in the game to your computer.
 * 
 * @arg dlc_app_id
 * @text Downloadable Content ID(DLCAppID)
 * @desc The Downloadable Content ID(DLCAppID) you set on the Steamworks page.
 * @type string
 * 
 * 
 * @command NekoCommands Uninstall_SteamDLC
 * @text Uninstall Downloadable Content
 * @desc Uninstall the Downloadable Content of this game.
 * 
 * @arg dlc_app_id
 * @text Downloadable Content ID(DLCAppID)
 * @desc The Downloadable Content ID(DLCAppID) you set on the Steamworks page.
 * @type string
 * 
 * 
 * @command NekoCommands GetCurrentGame_SteamLanguage
 * @text Get Game Language
 * @desc Get the user's language settings in the game application.
 * 
 * @arg variablesId
 * @text Variable ID
 * @desc In the case of event command "Conditional Branch", this parameter can be omitted.
 * @type variable
 * @default 0
 * 
 * 
 * @command NekoCommands GetCurrentUI_SteamLanguage
 * @text Get Steam Language
 * @desc Get the user's language settings on the Steam client.
 * 
 * @arg variablesId
 * @text Variable ID
 * @desc In the case of event command "Conditional Branch", this parameter can be omitted.
 * @type variable
 * @default 0
 * 
 * 
 * @command NekoCommands SetValue_SteamStats
 * @text Set Game Stats
 * @desc Set the value to the game stats in the game.
 * 
 * @arg statsName
 * @text Game Stats Name
 * @desc The Game stats name you set on the Steamworks page.
 * @type string
 * 
 * @arg statsValue
 * @text Current Value
 * @desc Enter the number.
 * @type number
 * @min 0
 * @default 0
 * 
 * @arg switchesId
 * @text Switch ID.
 * @desc In the case of event command "Conditional Branch", this parameter can be omitted.
 * @type switch
 * @default 0
 * 
 * 
 * @command NekoCommands GetValue_SteamStats
 * @text Get Game Stats
 * @desc Get the set game stats in the game.
 * 
 * @arg statsName
 * @text Game Stats Name
 * @desc The Game stats name you set on the Steamworks page.
 * @type string
 * 
 * @arg valueType
 * @text Value Type
 * @desc Set the value to the game stats in the game.
 * @type select
 * @default 2
 * @option Floating Point Number
 * @value 1
 * @option Number
 * @value 2
 * 
 * @arg variablesId
 * @text Variable ID
 * @desc In the case of event command "Conditional Branch", this parameter can be omitted.
 * @type variable
 * @default 0
 * 
 * 
 * @command NekoCommands StoreValues_SteamStats
 * @text Sync Game Stats
 * @desc Sync current game stats to the Steam platform server in-game.
 * 
 * 
 * @command NekoCommands CallBuyItem_SteamMicroTxn
 * @text Call Product Purchase
 * @desc Call the product's purchase page.
 * 
 * @arg productId
 * @text Product ID
 * @desc The "Product ID" you set in the "Microtransactions Product List" of the Plugin Manager.
 * @type string
 * 
 * 
 * @command NekoCommands GetBuyQuery_SteamMicroTxn
 * @text Get Transaction Status
 * @desc Get the status of your current transactions on the product in the game.
 * 
 * 
 * @command NekoCommands CallRefund_SteamMicroTxn
 * @text Call Product Refund
 * @desc Refund your currently purchased products in the game.
 * 
 * 
 * @command NekoCommands CallFinalBuy_SteamMicroTxn
 * @text Call Product Checkout
 * @desc Checkout the products you currently have in your shopping cart.
 * 
 * 
 * @command NekoCommands GetCurrentCount_SteamPlayers
 * @text Get the Number of Players
 * @desc Get the number of players who are currently playing the game in the game.
 * 
 * @arg variablesId
 * @text Variable ID
 * @desc ＊This features requires a "Variable ID" to be set for subsequent event.
 * @type variable
 * @default 0
 * 
 * 
 * @command NekoCommands GetSteamID_SteamPlayers
 * @text Get Steam ID
 * @desc Get the Steam ID of the current player in the game.
 * 
 * @arg variablesId
 * @text Variable ID
 * @desc In the case of event command "Conditional Branch", this parameter can be omitted.
 * @type variable
 * @default 0
 * 
 * 
 * @command NekoCommands GetPlayerName_SteamPlayers
 * @text Get Player Nickname
 * @desc Get the current player nickname in the game.
 * 
 * @arg steamId
 * @text Steam ID
 * @desc Set your current Steam ID.
 * @type number
 * @min 0
 * @default 0
 * 
 * @arg variablesId
 * @text Variable ID
 * @desc In the case of event command "Conditional Branch", this parameter can be omitted.
 * @type variable
 * @default 0
 * 
 * 
 * @command NekoCommands DelAllCloudData_SteamCloudSave
 * @text Delete Cloud Saves
 * @desc Clear all the game archives in the cloud server.
 * 
 * 
 * @command NekoCommands DeleteLeaderboard_SteamLeaderboard
 * @text Delete Leaderboard
 * @desc Leaderboard data deleted during gameplay.
 * 
 * @arg name
 * @text Leaderboard Name
 * @desc Set the name of the leaderboard to be deleted.
 * @type string
 * 
 * 
 * @command NekoCommands FindOrCreateLeaderboard_SteamLeaderboard
 * @text Find or Create Leaderboards
 * @desc Finds or creates leaderboard data in the game.
 * 
 * @arg name
 * @text Leaderboard Name
 * @desc Set the name of the leaderboard to find or create.
 * @type string
 * 
 * @arg createifnotfound
 * @text Create Leaderboard
 * @desc When this is turned on, if no existing leaderboard is found, the leaderboard will be created automatically.
 * @default true
 * @type boolean
 * @on Enable
 * @off Disable
 * 
 * @arg onlytrustedwrites
 * @text Write Leaderboard
 * @desc when this is turned on, the leaderboard will be created automatically when no existing leaderboard is found.
 * @default false
 * @type boolean
 * @on Enable
 * @off Disable
 * 
 * @arg onlyfriendsreads
 * @text Read Only by Friends
 * @desc when turned on, will accept only trusted data writes.
 * @default false
 * @type boolean
 * @on Enable
 * @off Disable
 * 
 * 
 * @command NekoCommands GetLeaderboardEntries_SteamLeaderboard
 * @text Get Leaderboard Entry
 * @desc To get the Leaderboard item data in the game, remember to call it once with the "Get Game Leaderboard" plugin command before using it.
 * 
 * @arg rangestart
 * @text Start Range
 * @desc Sets the starting position of the leaderboard item.
 * @type number
 * @min 0
 * @default 1
 * 
 * @arg rangeend
 * @text End Range
 * @desc Sets the starting position of the leaderboard item.
 * @type number
 * @min 0
 * @default 10
 * 
 * @arg datarequest
 * @text Data Request Method
 * @desc Set the data request method of the leaderboard,
 * @type select
 * @default RequestGlobal
 * @option Global
 * @value RequestGlobal
 * @option Around User
 * @value RequestAroundUser
 * @option Friends
 * @value RequestFriends
 * 
 * 
 * @command NekoCommands GetLeaderboardsForGame_SteamLeaderboard
 * @text Get Game Leaderboard
 * @desc Get on the game leaderboards.
 * 
 * @arg Id
 * @text Sequence ID
 * @desc Set the sequence ID of the leaderboard.
 * @type number
 * @min 0
 * @default 0
 * 
 * 
 * @command NekoCommands ResetLeaderboard_SteamLeaderboard
 * @text Reset Game Leaderboards
 * @desc To reset the game leaderboard in the game, remember to call it once with the "Get Game Leaderboard" plugin command before using it.
 * 
 * 
 * @command NekoCommands SetLeaderboardScore_SteamLeaderboard
 * @text Set Leaderboard Score
 * @desc Setting game leaderboard scores in the game, remember to call it once with the "Get Game Leaderboard" plugin command before using it.
 * 
 * @arg score
 * @text Score
 * @desc Set the score of the leaderboard.
 * @type number
 * @min 0
 * @default 0
 * 
 * @arg scoremethod
 * @text Score Principle
 * @desc Set the principle of updating the score.
 * @type select
 * @default ForceUpdate
 * @option Keep Best
 * @value KeepBest
 * @option Force Update
 * @value ForceUpdate
 * 
 * @arg scoreVariableID
 * @text Score Variable ID
 * @desc ID of the game variable storing the score. If set, it will override the Score setting.
 * @type variable
 * @default 0
 * 
 * 
 * @command NekoCommands CallLeaderboard_SteamLeaderboard
 * @text Call Game Leaderboard
 * @desc To call the game leaderboard in the game, remember to call it with the "Get Game Leaderboard" and "Get Leaderboard Entry" plugin commands before using it.
 * 
 * 
 * 
 * @param Steamworks Class
 * @text ◆ Steamworks Core
 * 
 * @param Steam AppID
 * @text Game Application ID
 * @desc Set the game applicatio ID(AppID) on Steam.
 * @type string
 * @parent Steamworks Class
 * @default 480
 * 
 * @param Steam API key
 * @text Steam API Key
 * @desc Set the API Key on Steam.
 * @type string
 * @parent Steamworks Class
 * @default 
 * 
 * @param Check BuyGame Boolean
 * @text Enable Steam Purchase
 * @desc Whether to enable Steam purchase verification.
 * @default true
 * @type boolean
 * @parent Steamworks Class
 * @on Enable
 * @off Disable
 * 
 * @param Check FullScreen
 * @text Enable Steam Deck UI Full Screen
 * @desc Whether to enable fullscreen display on the Steam Deck UI.
 * @default true
 * @type boolean
 * @parent Steamworks Class
 * @on Enable
 * @off Disable
 * 
 * @param Check Overlay Pause
 * @text Enable Steam Overlay pause feature
 * @desc Whether to enable the pause feature under Steam Overlay.
 * @default false
 * @type boolean
 * @parent Steamworks Class
 * @on Enable
 * @off Disable
 * 
 * @param Check Music Pause
 * @text Pause Music During Game Execution
 * @desc Whether to pause the game's original soundtrack music during game execution.
 * @default false
 * @type boolean
 * @parent Steamworks Class
 * @on Enable
 * @off Disable
 * 
 * 
 * @param MicroTxn Class
 * @text ◆ Microtransactions (Alpha)
 * 
 * @param SandBox Mode Boolean
 * @text Enable SandBox Mode
 * @desc Whether to enable sandbox mode for purchase testing.
 * @default true
 * @type boolean
 * @parent MicroTxn Class
 * @on Enable
 * @off Disable
 * 
 * @param Orderid Variable
 * @text Order Variables
 * @desc Set the variable ID to save the order number.
 * @type variable
 * @default 0
 * 
 * @param Transid Variable
 * @text Transaction Variables
 * @desc Set the variable ID to save the transaction number.
 * @type variable
 * @default 0
 * 
 * @param Result Variable
 * @text Result Variables
 * @desc Set the variable ID to save the transaction status.
 * @type variable
 * @default 0
 * 
 * @param MicroTxn Product List
 * @text Microtransactions Product List...
 * @desc Set a single product setting for Microtransactions.
 * @type struct<MicroTxnItem>[]
 * @parent MicroTxn Class
 * @default ["{\"BaseItem Class\":\"\",\"Item ID\":\"1\",\"Item Language\":\"en\",\"Item Currency\":\"USD\",\"Item Name\":\"10 Gold\",\"Item CartCount\":\"1\",\"Item Count\":\"1\",\"Item Amount\":\"1000\"}"]
 * 
 * 
 * @param Leaderboards Class
 * @text ◆ Leaderboard (Alpha)
 * 
 * @param Leaderboards Variable
 * @text Leaderboard Variables
 * @desc Set the variable ID to which you want to save the leaderboard.
 * @type variable
 * @default 0
 * 
 * @param LeaderboardsName Variable
 * @text Leaderboard Name Variable
 * @desc Set the variable ID to which you want to save the leaderboard title name.
 * @type variable
 * @default 0
 * 
 * 
 * @param Error Log Class
 * @text ◆ Error Log
 * 
 * @param Error BuyGame Title
 * @text Error Title(No games purchased)
 * @desc Set the error title to be displayed when you have not purchased the game.
 * @type string
 * @parent Error Log Class
 * @default No Games Purchased
 * 
 * @param Error BuyGame Message
 * @text Error Message(No games purchased)
 * @desc Set the error message to be displayed when you have not purchased the game.
 * @type string
 * @parent Error Log Class
 * @default You have not yet purchased this game on Steam.
 * 
 * @param Error BuyGame Button
 * @text BuyGame Button
 * @desc Set the name of the button you want to purchase.
 * @type string
 * @parent Error Log Class
 * @default Buy Game
 * 
 */
/*~struct~MicroTxnItem:
 * 
 * @param BaseItem Class
 * @text ◆ Basic
 * 
 * @param Item ID
 * @text Product ID
 * @desc Set the product ID.
 * @type number
 * @parent BaseItem Class
 * @default 1
 * @min 1
 * @max 4294967295
 * 
 * @param Item Language
 * @text Language Description
 * @desc Set the language option in which you want to show the product description.
 * @type select
 * @parent BaseItem Class
 * @default en
 * @option العربية
 * @value ar
 * @option български език
 * @value bg
 * @option 繁體中文
 * @value zh
 * @option čeština
 * @value cs
 * @option Dansk
 * @value da
 * @option Nederlands
 * @value nl
 * @option English
 * @value en
 * @option Suomi
 * @value fi
 * @option Français
 * @value fr
 * @option Deutsch
 * @value de
 * @option Ελληνικά
 * @value el
 * @option Magyar
 * @value hu
 * @option Italiano
 * @value it
 * @option 日本語
 * @value ja
 * @option 한국어
 * @value ko
 * @option Norsk
 * @value no
 * @option Polski
 * @value pl
 * @option Português
 * @value pt
 * @option Română
 * @value ro
 * @option Español-España
 * @value es
 * @option Svenska
 * @value sv
 * @option ไทย
 * @value th
 * @option Türkçe
 * @value tr
 * 
 * @param Item Currency
 * @text Product Currency
 * @desc Set the options for the currency you want to display.
 * @type select
 * @parent BaseItem Class
 * @default USD
 * @option United Arab Emirates Dirham
 * @value AED
 * @option Argentine Peso
 * @value ARS
 * @option Australian Dollars
 * @value AUD
 * @option Brazilian Reals
 * @value BRL
 * @option Canadian Dollars
 * @value CAD
 * @option Swiss Francs
 * @value CHF
 * @option Chilean Peso
 * @value CLP
 * @option Colombian Peso
 * @value COP
 * @option Costa Rican Colón
 * @value CRC
 * @option European Union Euro
 * @value EUR
 * @option United Kingdom Pound
 * @value GBP
 * @option Hong Kong Dollar
 * @value HKD
 * @option Israeli New Shekel
 * @value ILS
 * @option Indonesian Rupiah
 * @value IDR
 * @option Indian Rupee
 * @value INR
 * @option Japanese Yen
 * @value JPY
 * @option South Korean Won
 * @value KRW
 * @option Kuwaiti Dinar
 * @value KWD
 * @option Kazakhstani Tenge
 * @value KZT
 * @option Mexican Peso
 * @value MXN
 * @option Malaysian Ringgit
 * @value MYR
 * @option Norwegian Kron
 * @value NOK
 * @option New Zealand Dollar
 * @value NZD
 * @option Peruvian Sol
 * @value PEN
 * @option Philippine Peso
 * @value PHP
 * @option Polish Złoty
 * @value PLN
 * @option Qatari Riyal
 * @value QAR
 * @option Saudi Riyal
 * @value SAR
 * @option Singapore Dollar
 * @value SGD
 * @option Thai Baht
 * @value THB
 * @option Turkish Lira
 * @value TRY
 * @option New Taiwan Dollar
 * @value TWD
 * @option United States Dollar
 * @value USD
 * @option Uruguayan Peso
 * @value UYU
 * @option Vietnamese Dong
 * @value VND
 * @option South African Rand
 * @value ZAR
 * 
 * @param Item Name
 * @text Product Name
 * @desc Set the product name.
 * @type string
 * @parent BaseItem Class
 * @default Product01
 * 
 * @param Item CartCount
 * @text Product Cart Count
 * @desc Set the number of products to purchase.
 * @type number
 * @parent BaseItem Class
 * @default 1
 * @min 1
 * @max 4294967295
 * 
 * @param Item Count
 * @text Product Count
 * @desc Set the number of products.
 * @type number
 * @parent BaseItem Class
 * @default 1
 * @min 1
 * @max 32767
 * 
 * @param Item Amount
 * @text Product Amount
 * @desc Set the amount of the product in cents, for example, $1 equals 100 cents.
 * @type number
 * @parent BaseItem Class
 * @default 100
 * @min 100
 * @max 9223372036854775807
 * 
 */