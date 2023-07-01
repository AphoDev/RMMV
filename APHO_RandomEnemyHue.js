//==========================================
// APHO_RandomEnemyHue.js
//==========================================
/*:
* @title Random Enemy Hue
* @author Apho
* @plugindesc v1.0 Allows for randomising enemy hues.
*
* @param UseDefaultHue
* @text Use default hue? 
* @type boolean
* @desc Use the default hue adjustments specified in this plugin for enemies without a valid notetag?
* @default true
*
* @param DefaultHueMin
* @text Default minimum hue
* @type number
* @desc Default minimum hue adjustment for enemies. This is additive to whatever is specified in-editor.
* @min -360
* @default -15
* 
* @param DefaultHueMax
* @text Default maximum hue
* @type number
* @desc Default maximum hue adjustment for enemies. This is additive to whatever is specified in-editor.
* @min -360
* @default 15
*
* @param UseSaveHue
* @text Keep hue on transform?
* @type boolean
* @desc When using Enemy Transform, should enemies keep their previous hue adjustment?
* @default true
*
* @help
* This plugin allows for randomising enemy hues.
* If 'use default hue' is checked, a default hue adjustment will be applied at 
* random to all enemies, based on the values defined in the plugin parameters.
* This is additive to whatever you have set in-editor.
*
* Additionally, the following notetags may be used in enemy noteboxes:
*
* <minhue:x>
* <maxhue:x>
* This sets the minimum/maximum hue adjustment of the enemy to be x.
* If only one is used, the other is assumed to be the default value specified in
* the plugin parameters.
* Maxhue must be higher than minhue. Negative numbers may be used.
* These values replace the defaults specified in the plugin parameters and are
* additive to the value defined in-editor.
*
* <randomhue>
* This sets the hue adjustment to be completely random.
* (i.e. all the possible hue variations from 0 - 359)
*
* <nohue>
* This sets the enemy to not have a hue adjustment, ignoring the defaults
* specified in the plugin parameters. (In-editor hue adjustments still apply)
*
* <defaulthue>
* If 'use default hue' is set to false, this notetag will override it for that
* enemy and use the default hue range specified in the plugin parameters.
* 
* <keephue>
* This makes the enemy keep the hue adjustment of the previous form after
* transforming, overriding the plugin setting. Use it on the transformed enemy.
*
* <rerollhue>
* This makes the enemy reroll the hue adjustment after transforming, overriding
* the plugin setting. Use it on the transformed enemy.
* This does not copy the notetags from the previous enemy; you will need to add
* them to the transformed enemy as well if you want to re-use the same settings.
*
* TERMS OF USE
* - Free for commercial and non-commercial use, as long as I get a free copy
*   of the game.
* - Edits allowed for personal use.
* - Do not repost or claim as your own, even if edited.
* 
* VERSION HISTORY
* v1.0 - 2023/7/1 - Initial release.
*/
(function(){
    var parameters = PluginManager.parameters('APHO_RandomEnemyHue');
    var UseDefaultHue = JSON.parse(parameters['UseDefaultHue']);
    var DefaultHueMin = parseInt(parameters['DefaultHueMin']);
    var DefaultHueMax = parseInt(parameters['DefaultHueMax']);
    var DefaultHueRange = Math.max(DefaultHueMax - DefaultHueMin, 0);
    var UseSaveHue = JSON.parse(parameters['UseSaveHue']);
    Sprite_Enemy.prototype.updateBitmap = function() {
        Sprite_Battler.prototype.updateBitmap.call(this);
        var name = this._enemy.battlerName();
        var hue = this._enemy.battlerHue();
        if (this._battlerName !== name || this._battlerHue !== hue || (this._id && this._id !== this._enemy.enemy().id)) {
            this._id = this._enemy.enemy().id
            this._battlerName = name;
            this._battlerHue = hue;
            if(this._savedHue && ((UseSaveHue && !this._enemy.enemy().meta.rerollhue) || this._enemy.enemy().meta.keephue))
            {
                this.loadBitmap(name, hue + this._savedHue);
            }else if(this._enemy.enemy().meta.minhue || this._enemy.enemy().meta.maxhue)
            {
                let HueMin = this._enemy.enemy().meta.minhue ? parseInt(this._enemy.enemy().meta.minhue) : DefaultHueMin
                let HueMax = this._enemy.enemy().meta.maxhue ? parseInt(this._enemy.enemy().meta.maxhue) : DefaultHueMax
                let HueRange = Math.max(HueMax - HueMin, 0)
                this._savedHue =  HueMin + Math.randomInt(HueRange)
                this.loadBitmap(name, hue + this._savedHue);
                
            }else if(this._enemy.enemy().meta.randomhue)
            {
                this._savedHue = Math.randomInt(360);
                this.loadBitmap(name, hue + this._savedHue);
            }else if((UseDefaultHue && !this._enemy.enemy().meta.nohue) || this._enemy.enemy().meta.defaulthue)
            {
                this._savedHue = DefaultHueMin + Math.randomInt(DefaultHueRange);
                this.loadBitmap(name, hue + this._savedHue);
            }else
            {
                this.loadBitmap(name, hue);
            }
            this.initVisibility();
        }
    };
})();