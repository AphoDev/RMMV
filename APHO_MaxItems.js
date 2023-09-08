//==========================================
// APHO_MaxItems.js
//==========================================
/*:
* @title Max Items
* @author Apho
* @plugindesc v1.0 Allows for more control over the maximum number of items that may be carried, as well as displaying information about them in the inventory.
*
* @param DefaultMax
* @text Default Max.
* @type string
* @desc Default maximum carrying quantity. This is an eval.
* @default 99
*
* @param Override_drawItemNumber
* @text Override drawItemNumber?
* @type boolean
* @desc Override the default drawItemNumber function and use a custom one?
* @default true
*
* @param ItemNumberPrefix
* @parent Override_drawItemNumber
* @text Item Number Prefix
* @type string
* @desc Stuff shown before the number of items owned.
* @default :
*
* @param PrefixPositionMode
* @parent ItemNumberPrefix
* @text Prefix Position Mode
* @type select
* @option Automatic
* @value 0
* @option Manual
* @value 1
* @desc Positioning of the prefix.
* @default 0
*
* @param PrefixPosition
* @parent ItemNumberPrefix
* @text Prefix Position
* @desc Prefix is fixed at this location. (Manual mode only)
* @type string
* @default width - this.textWidth('00')
*
* @param DrawItemMax
* @parent Override_drawItemNumber
* @text Draw Item Max?
* @desc Append the max carrying quantity to the owned quantity in the inventory by default?
* @type boolean
* @default false
* 
* @param DrawItemMaxPrefix
* @parent DrawItemMax
* @text Draw Item Max Prefix
* @desc Stuff to show before the max carrying quantity.
* @type string
* @default /
*
* @param DrawItemMaxSuffix
* @parent DrawItemMax
* @text Draw Item Max Suffix
* @desc Stuff to show after the max carrying quantity.
* @type string
* @default
*
* @param DrawItemMax_AutoHidePrefix
* @parent DrawItemMax
* @text Auto Hide Number Prefix
* @desc Automatically hide the number prefix whenever max carrying quantity is drawn?
* @type boolean
* @default true
*
* @param ItemNumberColour
* @parent Override_drawItemNumber
* @text Item Number Colour
* @desc Colour of the item number. This is an eval.
* @type string
* @default $gameParty.numItems(item) >= $gameParty.maxItems(item) ? "#FF0000" : "#FFFFFF"
*
* @param HighNumberOverride
* @parent Override_drawItemNumber
* @text High Number Override
* @desc Override the item number with a string upon exceeding specified value?
* @type boolean
* @default false
*
* @param HighNumberOverrideThreshold
* @parent HighNumberOverride
* @text High Number Override Threshold
* @desc The item number will be replaced if it exceeds this value.
* @type number
* @default 99
*
* @param HighNumberOverrideString
* @parent HighNumberOverride
* @text High Number Override
* @desc String that will replace the item number upon exceeding the threshold.
* @type string
* @default 99+
*
* @param HighNumberOverride_AutoHidePrefix
* @parent HighNumberOverride
* @text Auto Hide Number Prefix
* @desc Automatically hide the number prefix for high numbers?
* @type boolean
* @default false
*
* @param NumberWidth
* @text Number Width
* @desc Amount of space that should be reserved for the item number. Leave blank for default.
* @type string
* @default this.textWidth('000')
*
* @help
* Allows for more control over the maximum number of items that may be carried.
* You may also customise how that information will be displayed to the player.
*
* PLUGIN PARAMETERS
* Most of the parameters should be self-explanatory, but there's a few that
* probably warrant some extra explanation.
* Override_drawItemNumber:
* By default, in RMMV, the quantity of items is displayed as follows:
* (Item Name)          :xx
* where the position of the ':' is fixed, regardless of the number of digits
* in the quantity.
* This may result in overlapping with the ':' if the quantity owned is 3 or
* more digits long.
* To avoid this, this plugin provides an option to override the default
* drawItemNumber function with a customisable one.
* This is required for any customisation of the item number.
*
* PrefixPositionMode:
* This allows you to choose how the position of the prefix is determined.
* Automatic - Prefix is automatically placed behind the number.
* Manual - Prefix location is manually set.
* 
* NOTETAGS
* The following notetags are available for items, weapons, and armours:
* <max:x>
* Specifies the maximum carrying quantity of that item. x must be a value
* greater than 0.
* 
* <maxeval>
* //code
* </maxeval>
* Evaluates code to determine the maximum carrying quantity of that item.
* Must return a value greater than 0.
* 
* <showitemmax>
* <hideitemmax>
* Overrides the default setting and shows or hides the max carrying quantity.
*
* <hidenumberprefix>
* Hides the prefix for the item number.
* 
* <hidenumber>
* Hides the number. Nothing will be drawn.
*
* <numbercolour>
* //code
* </numbercolour>
* Overrides the default setting and evaluates code to determine the number
* colour.
*
* NOTES
* - When using a formula to determine maximum carrying quantity, if the value is
*   reduced mid-game and the player had more than they can carry, the player
*   does not lose the excess; however they will be unable to obtain more.
* - If a max quantity has not been specified, and the default formula in this
*   plugin evaluates to 0 or undefined, RMMV's original default applies.
*   (99, may be changed by other plugins)   
* - If you are using YEP_CoreEngine, or any plugin that changes the default
*   item limit, place this plugin below them in the plugin manager.
* 
* TERMS OF USE
* - Free for commercial and non-commercial use, as long as I get a free copy
*   of the game.
* - Edits allowed for personal use.
* - Do not repost or claim as your own, even if edited.
* 
* VERSION HISTORY
* v1.0 - 2023/09/08 - Initial release.
*/
(function(){
    var parameters = PluginManager.parameters('APHO_MaxItems');
    CheckMaxEval = function(notetag, item)
    {
        const MaxEvalOpen = '<maxeval>';
        const MaxEvalClose = '</maxeval>';
        let ReadMaxEval = false;
        let MaxEvalInfo = "";
        for (var n = 0; n < notetag.length; n++)
        {
            let NoteData = notetag.split(/[\r\n]+/);
            let line = NoteData[n];
            if (line && line.match(MaxEvalOpen))
            {
                ReadMaxEval = true;
            }
            else if (line && line.match(MaxEvalClose))
            {
                ReadMaxEval = false;
            }
            else if (ReadMaxEval == true)
            {
                MaxEvalInfo += line + '\n';
            }
        }
        return eval(MaxEvalInfo)
    };
    const Game_Party_maxItems = Game_Party.prototype.maxItems;
    Game_Party.prototype.maxItems = function(item) {
        if(CheckMaxEval(item.note, item) && CheckMaxEval(item.note, item) > 0)
        {
            return CheckMaxEval(item.note, item);
        }
        else if(item.meta.max)
        {
            return item.meta.max;
        }
        else
        {
            return Function("return " + parameters['DefaultMax'])() || Game_Party_maxItems.call(this, item);
        }
    }
    const Game_Party_gainItem = Game_Party.prototype.gainItem;
    Game_Party.prototype.gainItem = function(item, amount, includeEquip) {
        if($gameParty.numItems(item) <= this.maxItems(item))
        {
            Game_Party_gainItem.call(this, item, amount, includeEquip);
        }
        else
        {
            var container = this.itemContainer(item);
            if (container) {
                var lastNumber = this.numItems(item);
                var newNumber = lastNumber + amount;
                container[item.id] = newNumber.clamp(0, $gameParty.numItems(item));
                if (container[item.id] === 0) {
                    delete container[item.id];
                }
                if (includeEquip && newNumber < 0) {
                    this.discardMembersEquip(item, -newNumber);
                }
                $gameMap.requestRefresh();
            }
        }
    };
    var Override_drawItemNumber = JSON.parse(parameters['Override_drawItemNumber']);
    if(Override_drawItemNumber)
    {
        CheckColourEval = function(notetag, item)
        {
            const ColourEvalOpen = '<numbercolour>';
            const ColourEvalClose = '</numbercolour>';
            let ReadColourEval = false;
            let ColourEvalInfo = "";
            for (var n = 0; n < notetag.length; n++)
            {
                let NoteData = notetag.split(/[\r\n]+/);
                let line = NoteData[n];
                if (line && line.match(ColourEvalOpen))
                {
                    ReadColourEval = true;
                }
                else if (line && line.match(ColourEvalClose))
                {
                    ReadColourEval = false;
                }
                else if (ReadColourEval == true)
                {
                    ColourEvalInfo += line + '\n';
                }
            }
            return eval(ColourEvalInfo)
        };
        var ItemNumberPrefix = String(parameters['ItemNumberPrefix']);
        var PrefixPositionMode = parseInt(parameters['PrefixPositionMode']);
        var DrawItemMax = JSON.parse(parameters['DrawItemMax']);
        var DrawItemMaxPrefix = String(parameters['DrawItemMaxPrefix']);
        var DrawItemMaxSuffix = String(parameters['DrawItemMaxSuffix']);
        var DrawItemMax_AutoHidePrefix = JSON.parse(parameters['DrawItemMax_AutoHidePrefix']);
        var HighNumberOverride = JSON.parse(parameters['HighNumberOverride']);
        var HighNumberOverrideThreshold = parseInt(parameters['HighNumberOverrideThreshold']);
        var HighNumberOverrideString = String(parameters['HighNumberOverrideString']);
        var HighNumberOverride_AutoHidePrefix = JSON.parse(parameters['HighNumberOverride_AutoHidePrefix']);
        Window_ItemList.prototype.drawItemNumber = function(item, x, y, width) {
            if(item.meta.numbercolour)
            {
                this.changeTextColor(CheckColourEval(item.note, item));
            }
            else
            {
                this.changeTextColor(eval(parameters['ItemNumberColour']));
            }
            if (this.needsNumber() && !item.meta.hidenumber) {
                let TextToDraw = $gameParty.numItems(item);
                let NeedsDrawItemMax = (DrawItemMax || item.meta.showitemmax) && !item.meta.hideitemmax;
                let NeedsNumPrefix = !item.meta.hidenumberprefix
                if(HighNumberOverride && $gameParty.numItems(item) > HighNumberOverrideThreshold)
                {
                    TextToDraw = HighNumberOverrideString;
                    if(NeedsNumPrefix && HighNumberOverride_AutoHidePrefix)
                    {
                        NeedsNumPrefix = false;
                    }
                }
                if(NeedsNumPrefix && DrawItemMax_AutoHidePrefix && NeedsDrawItemMax)
                {
                    NeedsNumPrefix = false;
                }
                if(NeedsNumPrefix)
                {
                    switch(PrefixPositionMode)
                    {
                        case 0:
                            TextToDraw = ItemNumberPrefix + TextToDraw;
                        break;
                        case 1:
                            this.drawText(ItemNumberPrefix, x, y, eval(parameters['PrefixPosition']), 'right');
                        break;
                    }
                }
                if(NeedsDrawItemMax)
                {
                    TextToDraw = TextToDraw + DrawItemMaxPrefix + $gameParty.maxItems(item) + DrawItemMaxSuffix;
                }
                this.drawText(TextToDraw, x, y, width, 'right');
            }
        };
    }
    const Window_ItemList_numberWidth = Window_ItemList.prototype.numberWidth;
    var NumberWidth = parameters['NumberWidth'];
    Window_ItemList.prototype.numberWidth = function() {
        if(NumberWidth)
        {
            return eval(NumberWidth)
        }
        else
        {
            return Window_ItemList_numberWidth.call(this);
        }
    };
})();