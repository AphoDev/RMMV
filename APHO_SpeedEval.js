//==========================================
// APHO_SpeedEval.js
//==========================================
/*:
* @title Speed Eval
* @author Apho
* @plugindesc v1.2 Allows the use of ​​​​​formulas to adjust the invocation speed of skills and items, and adjusting base speed formula.
* 
* @param Base speed
* @desc Formula to determine base speed.
* @default agi
* @help
*
* This plugin allows the developer to use evals to adjust the invocation speed
* of skills and items.
* To do so, use the following notetags in your skills/items:
*
* <speed>
* //Code goes here; perform operations on 'speed'.
* </speed>
*
* The code will be run after all the default speed calculations.
* You can use 'a' to reference the user.
* 
* EXAMPLES:
* <speed>
* speed += a.atk;
* </speed>
* This will increase the invocation speed by the user's Attack.
*
* <speed>
* speed = 0;
* </speed>
* This will set the invocation speed to 0, ignoring Agility or the invocation
* speed set in the editor.
*
* The base speed can also be adjusted from the plugin parameter 'Base speed'.
* By default, RMMV has some random variance added to base speed.
* This plugin's default settings will remove the random variance.
*
* TERMS OF USE
* - Free for commercial and non-commercial use, as long as I get a free copy
*   of the game.
* - Edits allowed for personal use.
* - Do not repost or claim as your own, even if edited.
* 
* VERSION HISTORY
* v1.2 - 2023/6/1 - Fixed a bug that caused incompatibility issues with other turn order display plugins.
* v1.1 - 2022/9/10 - Optimized code to improve compatibility with other plugins.
* v1.0 - 2022/9/9 - Initial release.
*/
var Apho = Apho || {};
Apho.SpeedEvalParams = PluginManager.parameters('APHO_SpeedEval');
Apho.SpeedEvalParams.BaseSpeed = Apho.SpeedEvalParams['Base speed'];

const AphoDataBaseLoaded = DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded = function()
{
    AphoDataBaseLoaded.call(this);
    if (!AphoDataBaseLoaded.call(this)) return false;
    if (!Apho.SpeedEvalLoaded)
    {
        Apho.CheckSpeedEval($dataSkills);
        Apho.CheckSpeedEval($dataItems);
        Apho.SpeedEvalLoaded = true;
    }
    return true;
};

Apho.CheckSpeedEval = function(group)
{
    const SpeedEvalOpen = '<speed>';
    const SpeedEvalClose = '</speed>';
    for (var n = 1; n < group.length; n++)
    {
        var obj = group[n];
        var NoteData = obj.note.split(/[\r\n]+/);
        var ReadSpeedEval = false;
        obj.SpeedEval = '';
        for (var i = 0; i < NoteData.length; i++)
        {
            var line = NoteData[i];
            if (line.match(SpeedEvalOpen))
            {
                ReadSpeedEval = true;
            }
            else if (line.match(SpeedEvalClose))
            {
                ReadSpeedEval = false;
            }
            else if (ReadSpeedEval == true)
            {
                obj.SpeedEval = obj.SpeedEval + line + '\n';
            }
        }
    }
};

Game_Action.prototype.speed = function()
{
    var agi = this.subject().agi;
    var speed = eval(Apho.SpeedEvalParams.BaseSpeed);
    if (this.item())
    {
        speed += this.item().speed;
    }
    if (this.isAttack())
    {
        speed += this.subject().attackSpeed();
    }
    if(this.item() && this.item().SpeedEval)
    {
        var a = this.subject();
        eval(this.item().SpeedEval);
    }
    return speed;
};

