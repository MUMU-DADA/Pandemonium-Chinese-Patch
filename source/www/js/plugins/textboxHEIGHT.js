Window_Message.protoype.updatePlacement = function() {
const goldWindow = this._goldWindow;
this.positionType = $gameMessage.positionType();
this.y = 360;


Window_Message.protoype.updatePlacement = function() {
const ww = Graphics.boxWidth;
const wh = 360;
const wx = (Graphics.boxWidth - ww) / 2;
const wy = 0;
return new Rectangle(wx, wy, ww, wh);
};