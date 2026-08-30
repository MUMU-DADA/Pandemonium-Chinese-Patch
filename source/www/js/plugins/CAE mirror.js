/*:
 * @target MV
 * @plugindesc No animation mirroring.
 * @author Caethyril
 * @url https://forums.rpgmakerweb.com/threads/163831/
 * @help Free to use and/or modify for any project, no credit required.
 */
// Usual anim setup except always `mirror = false`.
void (function(alias) {
  Sprite_Animation.prototype.setup = function(target, animation, mirror, delay) {
    alias.call(this, target, animation, false, delay);
  };
})(Sprite_Animation.prototype.setup);