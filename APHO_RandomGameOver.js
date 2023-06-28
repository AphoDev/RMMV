//==========================================
// APHO_RandomGameOver.js
//==========================================
/*:
* @title Random Game Over
* @author Apho
* @plugindesc v1.0 Allows for randomising the defeat ME, Game Over image, and Game Over ME, and having hue and pitch variances for them.
*
* @param DefeatMEList
* @text Defeat ME List
* @type file[]
* @dir audio/me
* @require 1
* @desc Pool of MEs for when the player falls in battle.
* @default ["Defeat1", "Defeat2"]
*
* @param DefeatVolume
* @text Defeat volume
* @type number
* @desc Volume of the Defeat ME.
* @default 90
*
* @param DefeatPitchMin
* @text Defeat minimum pitch
* @type number
* @desc Minimum pitch of the Defeat ME.
* @default 100
* 
* @param DefeatPitchMax
* @text Defeat maximum pitch
* @type number
* @desc Maximum pitch of the Defeat ME.
* @default 120
* 
* @param ImageList
* @text Game Over image list
* @type file[]
* @dir img/gameover
* @require 1
* @desc Pool of images for the Game Over screen.
* 
* @param HueMin
* @text Minimum hue
* @type number
* @desc Minimum hue adjustment for the gameover image.
* @min -360
* @default -180
* 
* @param HueMax
* @text Maximum hue
* @type number
* @desc Maximum hue adjustment for the gameover image.
* @min -360
* @default 180
*
* @param GameOverMEList
* @text Game Over ME List
* @type file[]
* @dir audio/me
* @require 1
* @desc Pool of MEs for the Game Over screen.
* @default ["GameOver1", "GameOver2"]
*
* @param GameOverVolume
* @text Game Over volume
* @type number
* @desc Volume of the Game Over ME.
* @default 90
*
* @param GameOverPitchMin
* @text Game Over minimum pitch
* @type number
* @desc Minimum pitch of the Game Over ME.
* @default 100
* 
* @param GameOverPitchMax
* @text Game Over maximum pitch
* @type number
* @desc Maximum pitch of the Game Over ME.
* @default 120
*
* @help
* This plugin allows the developer to randomise the defeat ME, Game Over image,
* and Game Over ME.
* Hue and pitch variances may also be set.
* You will need to create a 'gameover' folder in your img directory for the
* gameover images.
* 
* TERMS OF USE
* - Free for commercial and non-commercial use, as long as I get a free copy
*   of the game.
* - Edits allowed for personal use.
* - Do not repost or claim as your own, even if edited.
* 
* VERSION HISTORY
* v1.0 - 2023/6/28 - Initial release.
*/
(function(){
    var parameters = PluginManager.parameters('APHO_RandomGameOver');
    var ImageList = JSON.parse(parameters['ImageList']);
    var HueRange = Math.max(parseInt(parameters['HueMax']) - parseInt(parameters['HueMin']), 0);
    var DefeatMEList = JSON.parse(parameters['DefeatMEList']);
    var DefeatPitchRange = Math.max(parseInt(parameters['DefeatPitchMax']) - parseInt(parameters['DefeatPitchMin']), 0);
    var DefeatVolume = parseInt(parameters['DefeatVolume']);
    var GameOverMEList = JSON.parse(parameters['GameOverMEList']);
    var GameOverPitchRange = Math.max(parseInt(parameters['GameOverPitchMax']) - parseInt(parameters['GameOverPitchMin']), 0);
    var GameOverVolume = parseInt(parameters['GameOverVolume']);
    BattleManager.playDefeatMe = function()
    {
        let Pitch = parseInt(parameters['DefeatPitchMin']) + Math.randomInt(DefeatPitchRange + 1);
        let ME = 
        {
            name: DefeatMEList[Math.randomInt(DefeatMEList.length)],
            volume: DefeatVolume,
            pitch: Pitch,
            pan: 0
        }
        AudioManager.playMe(ME);
    };
    Scene_Gameover.prototype.createBackground = function()
    {
        let Hue = parseInt(parameters['HueMin']) + Math.randomInt(HueRange + 1);
        let Image = ImageList[Math.randomInt(ImageList.length)];
        this._backSprite = new Sprite(ImageManager.loadBitmap('img/gameover/', Image, Hue, false));
        this.addChild(this._backSprite);
    };
    Scene_Gameover.prototype.playGameoverMusic = function()
    {
        AudioManager.stopBgm();
        AudioManager.stopBgs();
        let Pitch = parseInt(parameters['GameOverPitchMin']) + Math.randomInt(GameOverPitchRange + 1);
        let ME = 
        {
            name: GameOverMEList[Math.randomInt(GameOverMEList.length)],
            volume: GameOverVolume,
            pitch: Pitch,
            pan: 0
        }
        AudioManager.playMe(ME);
    };
})();