<Custom Establish Effect>
// If you want to use a knockdown state, put that state ID instead of 0
var knockDownState = 0;
// Max number of bonus actions per round
var maxBonusActions = 10;
// Check to see if a damaging skill was a critical hit
if (target.result().critical && value > 0) {
 // If the number of bonus actions is less than the max
 if (user._bonusTurn < maxBonusActions) {
  // If a knockdown state is set, and the target is not inflicted with it
  if (!knockDownState || !target.isStateAffected(knockDownState)) {
   // Give the user an extra action
   user.addITBActions(1);
   BattleManager.addBattler(user);
   // Keep track of their bonus turns
   user._bonusTurn += 1;
  }
 }
 // If a knockdown state is set, inflict the target with it
 if (knockDownState) target.addState(knockDownState);
};
</Custom Establish Effect>
<Custom Battle Effect>
 this._bonusTurn = 0;
</Custom Battle Effect>
<Custom Turn Start Effect>
 this._bonusTurn = 0;
</Custom Turn Start Effect>