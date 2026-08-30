/*:
 * @plugindesc N1.00 (Requires YEP_BattleAICore & DreamX_ITB) Fixes compatibility.
 * @author Think_Nathan
 
 * @help Fixes compatibility between DreamX_ITB and YEP_BattleAICore.
 
 * Reverts YEP_BattleAICore to its older behaviour.
 * This will result in worse performance, but (hopefully) no change
 * in functionality.
 
 * Intended for DreamX_ITB v1.19 and YEP_BattleAICore v1.10.
 * Future updates may obsolete this plugin.
 */
 
(function () {
 
  if (Yanfly.Param.CoreAIDynamic) {
    // Fix: Revert to old style of getNextSubject if using ITB
    var n_oldGetNextSubject = BattleManager.getNextSubject;
    BattleManager.getNextSubject = function () {
      if (BattleManager.isITB()) {
        this.updateAIPatterns();
        return Yanfly.CoreAI.BattleManager_getNextSubject.call(this);
      } else {
        n_oldGetNextSubject.call(this);
      }
    }
  };
 
})();