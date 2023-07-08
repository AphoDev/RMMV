//==========================================
// APHO_RandomTitleScreen.js
//==========================================
/*:
* @title Random Title Screen
* @author Apho
* @plugindesc v1.0 Allows for customising and randomising various aspects of the Title Screen
* 
* @param UseTitle
* @text Use Title? 
* @type boolean
* @desc Use the title features provided by this plugin?
* @default true
*
* @param TitleList
* @parent UseTitle
* @text Title List
* @type string[]
* @desc Pool of strings that will be used for the title.
*
* @param TitleY
* @parent UseTitle
* @text Title y position
* @type string
* @desc Y position of the title. This is an eval.
(Default: Graphics.height / 4)
* @default Graphics.height / (3.5 + Math.random())
* 
* @param TitleFontSize
* @parent UseTitle
* @text Title Font Size
* @type string
* @desc Font size of the title. This is an eval. (Default: 72)
* @default 67 + Math.randomInt(11)
* 
* @param TitleFontOutlineWidth
* @parent UseTitle
* @text Title Font Outline Width
* @type string
* @desc Outline width of the title. This is an eval. (Default: 8)
* @default 7 + Math.randomInt(3)
*
* @param TitleFontColourList
* @parent UseTitle
* @text Title Font Colour List
* @type string[]
* @require 1
* @desc Pool of colours that will be used for the title.
* @default ["#FFFFFF", "#FFF0F5", "#F0FFF0", "#F0FFFF"]
*
* @param TitleOutlineColourList
* @parent UseTitle
* @text Title Outline Colour List
* @type string[]
* @require 1
* @desc Pool of colours that will be used for the title's outline.
* @default ["'black'", "#36454F"]
*
* @param TitleFontList
* @parent UseTitle
* @text Title Font List
* @type string[]
* @require 1
* @desc Pool of fonts that will be used for the title. This will require another plugin to preload fonts other than GameFont.
* @default ["GameFont"]
*
* @param UseSubtitle
* @text Use Subtitle? 
* @type boolean
* @desc Add a subtitle below your title?
* @default false
*
* @param SubtitleList
* @parent UseSubtitle
* @text Subtitle List
* @type string[]
* @desc Pool of strings that will be used for the subtitle.
*
* @param SubtitleSpacing
* @parent UseSubtitle
* @text Title-subtitle spacing
* @type string
* @desc The spacing between the subtitle and title.
* @default -5 - Math.randomInt(5)
*
* @param SubtitleFontSize
* @parent UseSubtitle
* @text Subtitle Font Size
* @type string
* @desc Font size of the subtitle. This is an eval. For title size, use this._gameTitleSprite.bitmap.fontSize
* @default Math.round(this._gameTitleSprite.bitmap.fontSize * (0.45 + Math.random() * 0.1))
* 
* @param SubtitleFontOutlineWidth
* @parent UseSubtitle
* @text Subtitle Font Outline Width
* @type string
* @desc Outline width of the subtitle. This is an eval. For title outline width, use this._gameTitleSprite.bitmap.outlineWidth
* @default 4 + Math.randomInt(3)
*
* @param UseTitleFontColour
* @parent UseSubtitle
* @text Use Title's Font Colour?
* @type boolean
* @desc Use the same font colour as the title? Otherwise, draw from below pool.
* @default false
*
* @param SubtitleFontColourList
* @parent UseSubtitle
* @text Subtitle Font Colour List
* @type string[]
* @require 1
* @desc Pool of colours that will be used for the subtitle.
* @default ["#FFFFFF", "#FFF0F5", "#F0FFF0", "#F0FFFF"]
* 
* @param UseTitleOutlineColour
* @parent UseSubtitle
* @text Use Title's Outline Colour?
* @type boolean
* @desc Use the same outline colour as the title? Otherwise, draw from below pool.
* @default false
*
* @param SubtitleOutlineColourList
* @parent UseSubtitle
* @text Subtitle Outline Colour List
* @type string[]
* @require 1
* @desc Pool of colours that will be used for the subtitle's outline.
* @default ["'black'", "#36454F"]
*
* @param UseTitleFont
* @parent UseSubtitle
* @text Use Title's Font?
* @type boolean
* @desc Use the same font as the title? Otherwise, draw from below pool.
* @default false
*
* @param SubtitleFontList
* @parent UseSubtitle
* @text Subtitle Font List
* @type string[]
* @require 1
* @desc Pool of fonts that will be used for the subtitle. This will require another plugin to preload fonts other than GameFont.
* @default ["GameFont"]
* 
* @param BGTitles1List
* @text Titles1 List (Background)
* @type file[]
* @dir img/titles1
* @desc Pool of title1 images for the title screen. This will be drawn in the background.
*
* @param BGTitles1HueMin
* @parent BGTitles1List
* @text Minimum hue
* @type number
* @desc Minimum hue adjustment for the title1 background image.
* @min -360
* @default -15
* 
* @param BGTitles1HueMax
* @parent BGTitles1List
* @text Maximum hue
* @type number
* @desc Maximum hue adjustment for the title1 background image.
* @min -360
* @default 15
* 
* @param BGTitles1RerollFreq
* @parent BGTitles1List
* @text Reroll Frequency
* @type select
* @option Once only
* @value 0
* @option After game
* @value 1
* @option Always
* @value 2
* @desc How often should titles1 (background) be rerolled?
* @default 2
*
* @param BGTitles2List
* @text Titles2 List (Background)
* @type file[]
* @dir img/titles2
* @desc Pool of title2 images for the title screen. This will be drawn in the background.
*
* @param BGTitles2HueMin
* @parent BGTitles2List
* @text Minimum hue
* @type number
* @desc Minimum hue adjustment for the title2 image.
* @min -360
* @default -180
* 
* @param BGTitles2HueMax
* @parent BGTitles2List
* @text Maximum hue
* @type number
* @desc Maximum hue adjustment for the title2 image.
* @min -360
* @default 180
*
* @param BGTitles2RerollFreq
* @parent BGTitles2List
* @text Reroll Frequency
* @type select
* @option Once only
* @value 0
* @option After game
* @value 1
* @option Always
* @value 2
* @desc How often should titles2 (background) be rerolled?
* @default 2
*
* @param FGTitles2List
* @text Titles2 List (Foreground)
* @type file[]
* @dir img/titles2
* @desc Pool of title2 images for the title screen. This will be drawn in the foreground.
*
* @param FGTitles2HueMin
* @parent FGTitles2List
* @text Minimum hue
* @type number
* @desc Minimum hue adjustment for the title2 image.
* @min -360
* @default -180
* 
* @param FGTitles2HueMax
* @parent FGTitles2List
* @text Maximum hue
* @type number
* @desc Maximum hue adjustment for the title2 image.
* @min -360
* @default 180
*
* @param FGTitles2RerollFreq
* @parent FGTitles2List
* @text Reroll Frequency
* @type select
* @option Once only
* @value 0
* @option After game
* @value 1
* @option Always
* @value 2
* @desc How often should titles2 (foreground) be rerolled?
* @default 2
*
* @param TitleBGMList
* @text Title BGM List
* @type file[]
* @dir audio/bgm
* @desc Pool of BGMs for the title screen.
*
* @param TitleBGMVolume
* @parent TitleBGMList
* @text Volume
* @type number
* @desc Volume of the title BGM.
* @default 90
*
* @param TitleBGMPitchMin
* @parent TitleBGMList
* @text Minimum pitch
* @type number
* @desc Minimum pitch of the title BGM.
* @default 100
* 
* @param TitleBGMPitchMax
* @parent TitleBGMList
* @text Maximum pitch
* @type number
* @desc Maximum pitch of the title BGM.
* @default 110
*
* @param TitleBGMRerollFreq
* @parent TitleBGMList
* @text Reroll Frequency
* @type select
* @option Once only
* @value 0
* @option After game
* @value 1
* @option Always
* @value 2
* @desc How often should the BGM be rerolled?
* @default 1
*
* @param TitleBGSList
* @text Title BGS List
* @type file[]
* @dir audio/bgs
* @desc Pool of BGSs for the title screen.
*
* @param TitleBGSVolume
* @parent TitleBGSList
* @text Volume
* @type number
* @desc Volume of the title BGS.
* @default 30
*
* @param TitleBGSPitchMin
* @parent TitleBGSList
* @text Minimum pitch
* @type number
* @desc Minimum pitch of the title BGS.
* @default 100
* 
* @param TitleBGSPitchMax
* @parent TitleBGSList
* @text Maximum pitch
* @type number
* @desc Maximum pitch of the title BGS.
* @default 110
*
* @param TitleBGSRerollFreq
* @parent TitleBGSList
* @text Reroll Frequency
* @type select
* @option Once only
* @value 0
* @option After game
* @value 1
* @option Always
* @value 2
* @desc How often should the BGS be rerolled?
* @default 2
*
* @help
* Adjust the parameters as you see fit.
* Most of them should be pretty self-explanatory, but there are a few new
* features added by this plugin.
*
* Subtitle
* Allows for an optional subtitle to be placed beneath your title.
* To use this, you must have "Draw Game Title" enabled.
* The subtitle may either copy the title's colours, or draw from its own pool.
*
* Hue min/max
* Allows for setting a minimum and maximum hue adjustment that will be applied
* at random to the title1/title2 image.
*
* Titles2 (Foreground)
* By default, MV draws titles1 and titles2 images on the background layer.
* This allows you to draw another image from titles2 on the foreground layer, in
* addition to the default background titles2 image.
*
* Title BGS
* Allows you to include an optional BGS to play alongside the title BGM.
*
* Pitch min/max
* Allows for setting a minimum and maximum pitch that will be applied at random
* to the BGM/BGS
* 
* Reroll Frequency
* This allows you to determine how often the images or BGM/BGS will be rerolled.
* Once only - Roll once, upon booting up the game.
* (restarting the game via F5 also counts as booting up the game)
* After game - Reroll after entering and exiting a playthrough
* (i.e. game over / game end / return to title)
* Always - Reroll every time the title screen is entered
* (i.e. after adjusting options from the title screen, or if you have custom
* scenes accessible from the title)
*
* TERMS OF USE
* - Free for commercial and non-commercial use, as long as I get a free copy
*   of the game.
* - Edits allowed for personal use.
* - Do not repost or claim as your own, even if edited.
* 
* VERSION HISTORY
* v1.0 - 2023/7/8 - Initial release.
*/
(function(){
    var parameters = PluginManager.parameters('APHO_RandomTitleScreen');
    var TitleOutlineColourList = JSON.parse(parameters['TitleOutlineColourList']);
    var TitleFontColourList = JSON.parse(parameters['TitleFontColourList']);
    var TitleFontList = JSON.parse(parameters['TitleFontList']);
    var UseTitle = JSON.parse(parameters['UseTitle']);
    if(UseTitle)
    {
        if(parameters['TitleList'] != '' && parameters['TitleList'] != '[]')var TitleList = JSON.parse(parameters['TitleList']);
    }
    var UseSubtitle = JSON.parse(parameters['UseSubtitle']);
    if(UseSubtitle)
    {
        var UseTitleFontColour = JSON.parse(parameters['UseTitleFontColour']);
        if(!UseTitleFontColour)var SubtitleFontColourList = JSON.parse(parameters['SubtitleFontColourList']);
        var UseTitleOutlineColour = JSON.parse(parameters['UseTitleOutlineColour']);
        if(!UseTitleOutlineColour)var SubtitleOutlineColourList = JSON.parse(parameters['SubtitleOutlineColourList']);
        var UseTitleFont = JSON.parse(parameters['UseTitleFont']);
        if(!UseTitleFont)var SubtitleFontList = JSON.parse(parameters['SubtitleFontList']);
        var SubtitleList = JSON.parse(parameters['SubtitleList']);
    }
    if(UseTitle || UseSubtitle)
    {
        Scene_Title.prototype.drawGameTitle = function() {
            var x = 20;
            var maxWidth = Graphics.width - x * 2;
            if(UseTitle)
            {
                var y = Function("return " + parameters['TitleY'])();
                var text = TitleList ? TitleList[Math.randomInt(TitleList.length)] : $dataSystem.gameTitle;
                this._gameTitleSprite.bitmap.textColor = TitleFontColourList[Math.randomInt(TitleFontColourList.length)];
                this._gameTitleSprite.bitmap.outlineColor = TitleOutlineColourList[Math.randomInt(TitleOutlineColourList.length)];
                this._gameTitleSprite.bitmap.outlineWidth = eval(parameters['TitleFontOutlineWidth']);
                this._gameTitleSprite.bitmap.fontSize = eval(parameters['TitleFontSize']);
                this._gameTitleSprite.bitmap.fontFace = TitleFontList[Math.randomInt(TitleFontList.length)];
            }else
            {
                var y = Graphics.height / 4;
                var text = $dataSystem.gameTitle;
                this._gameTitleSprite.bitmap.outlineColor = 'black';
                this._gameTitleSprite.bitmap.outlineWidth = 8;
                this._gameTitleSprite.bitmap.fontSize = 72;
                this._gameTitleSprite.bitmap.drawText(text, x, y, maxWidth, 48, 'center');
            }
            this._gameTitleSprite.bitmap.drawText(text, x, y, maxWidth, 48, 'center');
            if(UseSubtitle)
            {
                this._Subtitle = new Sprite(new Bitmap(Graphics.width, Graphics.height))
                this.addChild(this._Subtitle);
                this._Subtitle.bitmap.fontSize = eval(parameters['SubtitleFontSize']);
                this._Subtitle.bitmap.outlineWidth = eval(parameters['SubtitleFontOutlineWidth']);
                this._Subtitle.bitmap.textColor = UseTitleFontColour ? this._gameTitleSprite.bitmap.textColor : SubtitleFontColourList[Math.randomInt(SubtitleFontColourList.length)];
                this._Subtitle.bitmap.outlineColor = UseTitleOutlineColour ? this._gameTitleSprite.bitmap.outlineColor : SubtitleOutlineColourList[Math.randomInt(SubtitleOutlineColourList.length)];
                this._Subtitle.bitmap.fontFace = UseTitleFont ? this._gameTitleSprite.bitmap.fontFace : SubtitleFontList[Math.randomInt(SubtitleFontList.length)];
                let SubtitleY = y + this._gameTitleSprite.bitmap.fontSize + Function("return " + parameters['SubtitleSpacing'])();
                this._Subtitle.bitmap.drawText(SubtitleList[Math.randomInt(SubtitleList.length)], x, SubtitleY, maxWidth, 48,'center');
            }
        };
    }
    if(parameters['BGTitles1List'] != '' && parameters['BGTitles1List'] != '[]')
    {
        var BGTitles1List = JSON.parse(parameters['BGTitles1List']);
        var BGTitles1HueRange = Math.max(parseInt(parameters['BGTitles1HueMax']) - parseInt(parameters['BGTitles1HueMin']), 0);
        var BGTitles1Hue, BGTitles1;
        function RerollBGTitles1(){
            BGTitles1Hue = parseInt(parameters['BGTitles1HueMin']) + Math.randomInt(BGTitles1HueRange + 1);
            BGTitles1 = BGTitles1List[Math.randomInt(BGTitles1List.length)];
        }
        RerollBGTitles1();
        var BGTitles1RerollFreq = parseInt(parameters['BGTitles1RerollFreq']);
        if(BGTitles1RerollFreq == 1)
        {
            const GameEnd_commandToTitle = Scene_GameEnd.prototype.commandToTitle;
            Scene_GameEnd.prototype.commandToTitle = function(){
                RerollBGTitles1();
                GameEnd_commandToTitle.call(this);
            }
            const Scene_Gameover_gotoTitle = Scene_Gameover.prototype.gotoTitle;
            Scene_Gameover.prototype.gotoTitle = function(){
                RerollBGTitles1();
                Scene_Gameover_gotoTitle.call(this);
            }
            const Game_Interpreter_command354 = Game_Interpreter.prototype.command354;
            Game_Interpreter.prototype.command354 = function(){
                RerollBGTitles1();
                Game_Interpreter_command354.call(this);
            }
        }
    }
    if(parameters['BGTitles2List'] != '' && parameters['BGTitles2List'] != '[]')
    {
        var BGTitles2List = JSON.parse(parameters['BGTitles2List']);
        var BGTitles2HueRange = Math.max(parseInt(parameters['BGTitles2HueMax']) - parseInt(parameters['BGTitles2HueMin']), 0);
        var BGTitles2Hue, BGTitles2;
        function RerollBGTitles2(){
            BGTitles2Hue = parseInt(parameters['BGTitles2HueMin']) + Math.randomInt(BGTitles2HueRange + 1);
            BGTitles2 = BGTitles2List[Math.randomInt(BGTitles2List.length)];
        }
        RerollBGTitles2();
        var BGTitles2RerollFreq = parseInt(parameters['BGTitles2RerollFreq']);
        if(BGTitles2RerollFreq == 1)
        {
            const GameEnd_commandToTitle = Scene_GameEnd.prototype.commandToTitle;
            Scene_GameEnd.prototype.commandToTitle = function(){
                RerollBGTitles2();
                GameEnd_commandToTitle.call(this);
            }
            const Scene_Gameover_gotoTitle = Scene_Gameover.prototype.gotoTitle;
            Scene_Gameover.prototype.gotoTitle = function(){
                RerollBGTitles2();
                Scene_Gameover_gotoTitle.call(this);
            }
            const Game_Interpreter_command354 = Game_Interpreter.prototype.command354;
            Game_Interpreter.prototype.command354 = function(){
                RerollBGTitles2();
                Game_Interpreter_command354.call(this);
            }
        }
    }
    Scene_Title.prototype.createBackground = function() {
        if(BGTitles1)
        {
            if(BGTitles1RerollFreq == 2)RerollBGTitles1();
            this._backSprite1 = new Sprite(ImageManager.loadBitmap('img/titles1/', BGTitles1, BGTitles1Hue, false));
        }else
        {
            this._backSprite1 = new Sprite(ImageManager.loadTitle1($dataSystem.title1Name));
        }
        if(BGTitles2)
        {
            if(BGTitles2RerollFreq == 2)RerollBGTitles2();
            this._backSprite2 = new Sprite(ImageManager.loadBitmap('img/titles2/', BGTitles2, BGTitles2Hue, false));
        }else
        {
            this._backSprite2 = new Sprite(ImageManager.loadTitle2($dataSystem.title2Name));
        }
        this.addChild(this._backSprite1);
        this.addChild(this._backSprite2);
    };
    if(parameters['FGTitles2List'] != '' && parameters['FGTitles2List'] != '[]')
    {
        var FGTitles2List = JSON.parse(parameters['FGTitles2List']);
        var FGTitles2HueRange = Math.max(parseInt(parameters['FGTitles2HueMax']) - parseInt(parameters['FGTitles2HueMin']), 0);
        var FGTitles2Hue, FGTitles2;
        function RerollFGTitles2(){
            FGTitles2Hue = parseInt(parameters['FGTitles2HueMin']) + Math.randomInt(FGTitles2HueRange + 1);
            FGTitles2 = FGTitles2List[Math.randomInt(FGTitles2List.length)];
        }
        RerollFGTitles2();
        var FGTitles2RerollFreq = parseInt(parameters['FGTitles2RerollFreq']);
        if(FGTitles2RerollFreq == 1)
        {
            const GameEnd_commandToTitle = Scene_GameEnd.prototype.commandToTitle;
            Scene_GameEnd.prototype.commandToTitle = function(){
                RerollFGTitles2();
                GameEnd_commandToTitle.call(this);
            }
            const Scene_Gameover_gotoTitle = Scene_Gameover.prototype.gotoTitle;
            Scene_Gameover.prototype.gotoTitle = function(){
                RerollFGTitles2();
                Scene_Gameover_gotoTitle.call(this);
            }
            const Game_Interpreter_command354 = Game_Interpreter.prototype.command354;
            Game_Interpreter.prototype.command354 = function(){
                RerollFGTitles2();
                Game_Interpreter_command354.call(this);
            }
        }
        const Scene_Title_createForeground = Scene_Title.prototype.createForeground;
        Scene_Title.prototype.createForeground = function(){
            if(FGTitles2RerollFreq == 2)RerollFGTitles2();
            this._backSprite = new Sprite(ImageManager.loadBitmap('img/titles2/', FGTitles2, FGTitles2Hue, false));
            this.addChild(this._backSprite);
            Scene_Title_createForeground.call(this);
        }  
    }
    if(parameters['TitleBGMList'] != '' && parameters['TitleBGMList'] != '[]')
    {
        var TitleBGMList = JSON.parse(parameters['TitleBGMList']);
        var TitleBGMVolume = parseInt(parameters['TitleBGMVolume']);
        var TitleBGMPitchRange = Math.max(parseInt(parameters['TitleBGMPitchMax']) - parseInt(parameters['TitleBGMPitchMin']), 0);
        var TitleBGM;
        function RerollTitleBGM(){
            let Pitch = parseInt(parameters['TitleBGMPitchMin']) + Math.randomInt(TitleBGMPitchRange + 1);
            TitleBGM = 
            {
                name: TitleBGMList[Math.randomInt(TitleBGMList.length)],
                volume: TitleBGMVolume,
                pitch: Pitch,
                pan: 0
            }
        }
        RerollTitleBGM();
        var TitleBGMRerollFreq = parseInt(parameters['TitleBGMRerollFreq']);
        if(TitleBGMRerollFreq == 1)
        {
            const GameEnd_commandToTitle = Scene_GameEnd.prototype.commandToTitle;
            Scene_GameEnd.prototype.commandToTitle = function(){
                RerollTitleBGM();
                GameEnd_commandToTitle.call(this);
            }
            const Scene_Gameover_gotoTitle = Scene_Gameover.prototype.gotoTitle;
            Scene_Gameover.prototype.gotoTitle = function(){
                RerollTitleBGM();
                Scene_Gameover_gotoTitle.call(this);
            }
            const Game_Interpreter_command354 = Game_Interpreter.prototype.command354;
            Game_Interpreter.prototype.command354 = function(){
                RerollTitleBGM();
                Game_Interpreter_command354.call(this);
            }
        }
    }
    if(parameters['TitleBGSList'] != '' && parameters['TitleBGSList'] != '[]')
    {
        var TitleBGSList = JSON.parse(parameters['TitleBGSList']);
        var TitleBGSVolume = parseInt(parameters['TitleBGSVolume']);
        var TitleBGSPitchRange = Math.max(parseInt(parameters['TitleBGSPitchMax']) - parseInt(parameters['TitleBGSPitchMin']), 0);
        var TitleBGS;
        function RerollTitleBGS(){
            let Pitch = parseInt(parameters['TitleBGSPitchMin']) + Math.randomInt(TitleBGSPitchRange + 1);
            TitleBGS = 
            {
                name: TitleBGSList[Math.randomInt(TitleBGSList.length)],
                volume: TitleBGSVolume,
                pitch: Pitch,
                pan: 0
            }
        }
        RerollTitleBGS();
        var TitleBGSRerollFreq = parseInt(parameters['TitleBGSRerollFreq']);
        if(TitleBGSRerollFreq == 1)
        {
            const GameEnd_commandToTitle = Scene_GameEnd.prototype.commandToTitle;
            Scene_GameEnd.prototype.commandToTitle = function(){
                RerollTitleBGS();
                GameEnd_commandToTitle.call(this);
            }
            const Scene_Gameover_gotoTitle = Scene_Gameover.prototype.gotoTitle;
            Scene_Gameover.prototype.gotoTitle = function(){
                RerollTitleBGS();
                Scene_Gameover_gotoTitle.call(this);
            }
            const Game_Interpreter_command354 = Game_Interpreter.prototype.command354;
            Game_Interpreter.prototype.command354 = function(){
                RerollTitleBGS();
                Game_Interpreter_command354.call(this);
            }
        }
    }
    if(TitleBGM || TitleBGS)
    {
        Scene_Title.prototype.playTitleMusic = function() {
            if(TitleBGMRerollFreq == 2)RerollTitleBGM();
            if(TitleBGSRerollFreq == 2)RerollTitleBGS();
            TitleBGM ? AudioManager.playBgm(TitleBGM) : AudioManager.playBgm($dataSystem.titleBgm);
            TitleBGS ? AudioManager.playBgs(TitleBGS) : AudioManager.stopBgs();
            AudioManager.stopMe();
        };
    }
})();