//==========================================
// APHO_RandomCriticalAnimation.js
//==========================================
/*:
* @title Random Critical Animation
* @author Apho
* @plugindesc v1.0 Allows for playing a random animation when landing a crit.
*
* @param AnimList
* @text Animation List
* @type string
* @desc Pool of animation IDs to play on crit. Separate values with a comma.
* 
* @param MirrorAnim
* @text Mirror Animations
* @type select
* @option Never mirror
* @value 0
* @option Mirror if target is actor
* @value 1
* @option Mirror randomly
* @value 2
* @desc When should critical animations be mirrored?
* @default 0
*
* @param AnimDelay
* @text Animation Delay
* @type number
* @desc Delay before the animation is played, in frames.
* @default 0
*
* @param HealAnim
* @text Crit Heal Animations
* @type select
* @option No animation
* @value 0
* @option Same as regular crits
* @value 1
* @option Use custom pool (defined below)
* @value 2
* @desc Should critical heals have an animation?
* @default 2
*
* @param HealAnimList
* @text Animation List (Heal)
* @type string
* @desc Pool of animation IDs to use for a crit heal. Separate values with a comma.
*
* @help
* Allows for playing a random animation on the target when landing a crit.
* Critical heals may optionally have their own animation pool.
*
* TERMS OF USE
* - Free for commercial and non-commercial use, as long as I get a free copy
*   of the game.
* - Edits allowed for personal use.
* - Do not repost or claim as your own, even if edited.
* 
* VERSION HISTORY
* v1.0 - 2023/7/10 - Initial release.
*/
(function(){
    var parameters = PluginManager.parameters('APHO_RandomCriticalAnimation');
    var AnimList = parameters['AnimList'].split(",").map(Number);
    var MirrorAnim = parseInt(parameters['MirrorAnim']);
    var AnimDelay = parseInt(parameters['AnimDelay']);
    var HealAnim = parseInt(parameters['HealAnim']);
    var HealAnimList = parameters['HealAnimList'].split(",").map(Number);
    const Game_Action_apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function(target){
        Game_Action_apply.call(this, target);
        if(target.result().critical && $gameParty.inBattle())
        {
            let AnimToPlay = 0;
            if(!this.isRecover() || HealAnim == 1)
            {
                AnimToPlay = AnimList[Math.randomInt(AnimList.length)] 
            }else if(this.isRecover() && HealAnim == 2)
            {
                AnimToPlay = HealAnimList[Math.randomInt(HealAnimList.length)]
            }
            if(AnimToPlay > 0)
            {
                let Mirror;
                switch(MirrorAnim)
                {
                    case 0:
                        Mirror = target.isActor();
                        break;
                    case 1:
                        Mirror = false;
                        break;
                    case 2:
                        Mirror = Math.random() < 0.5;
                        break;
                }
                target.startAnimation(AnimToPlay, Mirror, AnimDelay); 
            }
        }
    }
})();