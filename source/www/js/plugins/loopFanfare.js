// LoopVictoryMusic.js
// Created on 9/24/2018

/*:
* @plugindesc This plugin is meant to loop the victory
* music until the player returns to the map.
* @author Yethwhinger
*
* @help This plugin causes the victory music after a
* battle to continue looping until the player has
* returned to the map scene.
*/

//----------------------------
// Changes to BattleManager
//----------------------------

BattleManager.playVictoryMe = function () {
    AudioManager.playMeLoop($gameSystem.victoryMe());
};

BattleManager.processVictory = function () {
    $gameParty.removeBattleStates();
    $gameParty.performVictory();
    this.playVictoryMe();
    this.makeRewards();
    this.displayVictoryMessage();
    this.displayRewards();
    this.gainRewards();
    this.endBattle(0);
};

BattleManager.updateBattleEnd = function () {
    if (this.isBattleTest()) {
        AudioManager.stopBgm();
        SceneManager.exit();
    } else if (!this._escaped && $gameParty.isAllDead()) {
        if (this._canLose) {
            $gameParty.reviveBattleMembers();
            SceneManager.pop();
        } else {
            SceneManager.goto(Scene_Gameover);
        }
    } else if (!this._escaped) {
        this.replayBgmAndBgs();
        SceneManager.pop();
    } else {
        SceneManager.pop();
    }
    this._phase = null;
};

//----------------------------
// Changes to AudioManager
//----------------------------

AudioManager.playMeLoop = function (me, pos) {
    if (this.isCurrentBgm(me)) {
        this.updateBgmParameters(me);
    } else {
        this.stopBgm();
        if (me.name) {
            this._bgmBuffer = this.createBuffer('me', me.name);
            this.updateBgmParameters(me);
            if (!this._meBuffer) {
                this._bgmBuffer.play(true, pos || 0);
            }
        }
    }
    this.updateCurrentBgm(me, pos);
};