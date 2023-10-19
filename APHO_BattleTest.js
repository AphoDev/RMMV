//==========================================
// APHO_BattleTest.js
//==========================================
/*:
* @title Battle Test
* @author Apho
* @plugindesc v1.0 Provides various features to help with battle testing.
*
* @param BattleTestInitCode
* @text Battle Test Initialise Code
* @desc Code to run whenever a battle test starts. This runs after the default functions.
* @type note
* @default ""
*
* @param OverridesetupBattleTestItems
* @text Override setupBattleTestItems?
* @desc Override the default setupBattleTestItems function which gives the max number of all items?
* @type boolean
* @default false
*
* @param ExcludeItemPrefix
* @parent OverridesetupBattleTestItems
* @text Exclude Item Prefix
* @desc Items whose names start with this are never given during battle test. Leave blank to not exclude anything.
* @type string
* @default
*
* @param RegularItemQty
* @parent OverridesetupBattleTestItems
* @text Regular Item Quantity
* @desc Quantity of each regular item that will be given at the start of a battle test. This is an eval.
* @type string
* @default this.maxItems(item)
*
* @param KeyItemQty
* @parent OverridesetupBattleTestItems
* @text Key Item Quantity
* @desc Quantity of each key item that will be given at the start of a battle test. This is an eval.
* @type string
* @default 0
*
* @param HiddenItemAQty
* @parent OverridesetupBattleTestItems
* @text Hidden Item A Quantity
* @desc Quantity of each hidden item A that will be given at the start of a battle test. This is an eval.
* @type string
* @default 0
*
* @param HiddenItemBQty
* @parent OverridesetupBattleTestItems
* @text Hidden Item B Quantity
* @desc Quantity of each hidden item B that will be given at the start of a battle test. This is an eval.
* @type string
* @default 0
*
* @param HpRate
* @text HP Rate
* @desc Starting HP rate of the party during battle test.
* @type number
* @decimals 10
* @max 1
* @min 0
* @default 1
* 
* @param MpRate
* @text MP Rate
* @desc Starting MP rate of the party during battle test.
* @type number
* @decimals 10
* @max 1
* @min 0
* @default 1
*
* @param TpBonus
* @text TP Bonus
* @desc Grant a flat bonus (or penalty) to TP at the start of battle test. Requires 'Preserve TP'.
* @type number
* @min -999999
* @default 0
* 
* @param DetailedLog
* @text Detailed Log
* @desc Displays detailed information about the battle in the console.
* @type boolean
* @default true
*
* @param ValueDisplay
* @parent DetailedLog
* @text Value Display
* @desc How should values in the log be displayed as?
* @type select
* @option Decimal
* @value 0
* @option Percentage
* @value 1
* @default 1
*
* @param Decimals
* @parent DetailedLog
* @text Decimals
* @desc How many decimal places should values in the log be rounded to? Set to -1 for no rounding.
* @type number
* @min -1
* @default -1
*
* @param EscapeRate
* @parent DetailedLog
* @text Escape Rate
* @desc Show the current escape success rate. This is shown as a decimal, where 1.0 = 100%.
* @type boolean
* @default true
*
* @param PartyAvgHP
* @parent DetailedLog
* @text Party Average HP
* @desc Show the average HP% of party members. Dead members count as having 0%.
* @type boolean
* @default true
*
* @param PartyAvgMP
* @parent DetailedLog
* @text Party Average MP
* @desc Show the average MP% of party members. Members with 0 max MP count as having 0%.
* @type boolean
* @default true
*
* @param PartyAvgTP
* @parent DetailedLog
* @text Party Average TP
* @desc Show the average TP% of party members.
* @type boolean
* @default true

* @param TroopAvgHP
* @parent DetailedLog
* @text Troop Average HP
* @desc Show the average HP% of enemy troop members. Dead members count as having 0%.
* @type boolean
* @default true
*
* @param TroopAvgMP
* @parent DetailedLog
* @text Troop Average MP
* @desc Show the average MP% of enemy troop members. Members with 0 max MP count as having 0%.
* @type boolean
* @default true
*
* @param TroopAvgTP
* @parent DetailedLog
* @text Troop Average TP
* @desc Show the average TP% of enemy troop members.
* @type boolean
* @default true
*
* @param CloseAfterBattleTest
* @text Close after battle test
* @desc Close the game after a battle test ends?
* @type boolean
* @default true
*
* @help
* Battle Test Initialise Code:
* Allows for running custom code upon starting a battle test.
* 
* Override setupBattleTestItems:
* Allows for overriding the default function that gives the max amount of items.
* If enabled, you may exclude items, as well as specify the quantity based on
* type. (regular item, key item, etc)
* Evals may also be used. Use 'item' to refer to the item.
*
* HP Rate, MP Rate, TP Bonus:
* Set the starting HP/MP Rate of the party during battle test.
* HP/MP Rate must be a value from 0 to 1, where 1 is full HP/MP.
* TP Bonus is a flat value added to starting TP. Can be negative.
* Requires 'Preserve TP'.
*
* Detailed Log:
* Allows for logging details of the battle to the console (F8).
* Unlike the other features, this also works during regular test play battles.
* This log will be updated at the end of each turn / battle.
* You may have the values displayed either as a decimal (where 1.0 = 100%), or
* as a percentage, as well as specify which values will be logged and number of
* decimal places rounded to.
*
* Close after battle test:
* By default, the game will close itself after a battle test.
* You may optionally choose to not close the game.
* This might be useful if you wish to review the logs at the end of battle.
* Note that doing so requires overriding BattleManager.updateBattleEnd
* whenever in a battle test.
*
* NOTES
* - Since this plugin is purely for testing purposes, it can be removed or
* disabled prior to deployment.
* - If using YEP_BattleEngineCore.js, place this plugin above it in the Plugin
* Manager.
* 
* TERMS OF USE
* - Edits allowed for personal use.
* - Do not repost or claim as your own, even if edited.
* 
* VERSION HISTORY
* v1.0 - 2023/10/19 - Initial release.
*/
(function(){
    var parameters = PluginManager.parameters('APHO_BattleTest');
    const GameParty_setupBattleTest = Game_Party.prototype.setupBattleTest;
    Game_Party.prototype.setupBattleTest = function()
    {
        GameParty_setupBattleTest.call(this);
        let HpRate = parseFloat(parameters['HpRate']);
        let MpRate = parseFloat(parameters['MpRate']);
        let TpBonus = parseInt(parameters['TpBonus']);
        $gameParty.members().forEach(function(member) {
            if(HpRate < 1)member.setHp(Math.round(member.mhp * HpRate));
            if(MpRate < 1)member.setMp(Math.round(member.mmp * MpRate));
            if(TpBonus != 0)member.gainTp(TpBonus);
        });
        eval(JSON.parse(parameters['BattleTestInitCode']));
    };
    const Game_Party_setupBattleTestItems = Game_Party.prototype.setupBattleTestItems;
    Game_Party.prototype.setupBattleTestItems = function()
    {
        if(!parameters['OverridesetupBattleTestItems'])
        {
            Game_Party_setupBattleTestItems.call(this);
        }
        else
        {
            let ExcludeItemPrefix = parameters['ExcludeItemPrefix'];
            let NeedsExclude = ExcludeItemPrefix && (ExcludeItemPrefix.length > 0);
            $dataItems.forEach(function(item) {
                if (item && item.name.length > 0 && (!NeedsExclude || !item.name.startsWith(ExcludeItemPrefix)))
                {
                    switch(item.itypeId)
                    {
                        case 1:
                            this.gainItem(item, eval(parameters['RegularItemQty']));
                            break;
                        case 2:
                            this.gainItem(item, eval(parameters['KeyItemQty']));
                            break;
                        case 3:
                            this.gainItem(item, eval(parameters['HiddenItemAQty']));
                            break;
                        case 4:
                            this.gainItem(item, eval(parameters['HiddenItemBQty']));
                            break;
                    }
                }
            }, this);
        }
    }
    //DETAILED LOGGING
    var DetailedLog = JSON.parse(parameters['DetailedLog']);
    if(DetailedLog)
    {
        //setting up functions and stuff
        var ValueDisplay = parseInt(parameters['ValueDisplay']);
        var Decimals = parseInt(parameters['Decimals']);
        function round(n)
        {
            if(ValueDisplay == 0)
            {
                if(Decimals == -1)
                {
                    return n;
                }
                else
                {
                    return n.toFixed(Decimals);
                }
            }
            else if(ValueDisplay == 1)
            {
                n *= 100;
                if(Decimals == -1)
                {
                    return n + "%";
                }
                else
                {
                    return n.toFixed(Decimals) + "%";
                }
            }
        }
        var NeedsEscapeRate = JSON.parse(parameters['EscapeRate']);
        function EscapeRate()
        {
            if(NeedsEscapeRate)
            {
                console.log("Escape Rate: " + round(BattleManager._escapeRatio));
            }
        }
        var NeedsPartyAvgHP = JSON.parse(parameters['PartyAvgHP']);
        function PartyAvgHP()
        {
            if(NeedsPartyAvgHP)
            {
                let total = 0, average = 0;
                $gameParty.members().forEach(function(member){
                    total += member.hpRate();
                });
                average = total / $gameParty.members().length
                console.log("Party HP: " + round(average));
            }
        }
        var NeedsPartyAvgMP = JSON.parse(parameters['PartyAvgMP']);
        function PartyAvgMP()
        {
            if(NeedsPartyAvgMP)
            {
                let total = 0, average = 0;
                $gameParty.members().forEach(function(member){
                    total += member.mpRate();
                });
                average = total / $gameParty.members().length
                console.log("Party MP: " + round(average));
            }
        }
        var NeedsPartyAvgTP = JSON.parse(parameters['PartyAvgTP']);
        function PartyAvgTP()
        {
            if(NeedsPartyAvgTP)
            {
                let total = 0, average = 0;
                $gameParty.members().forEach(function(member){
                    total += member.tpRate();
                });
                average = total / $gameParty.members().length
                console.log("Party TP: " + round(average));
            }
        }
        var NeedsTroopAvgHP = JSON.parse(parameters['TroopAvgHP']);
        function TroopAvgHP()
        {
            if(NeedsTroopAvgHP)
            {
                let total = 0, average = 0;
                $gameTroop.members().forEach(function(member){
                    total += member.hpRate();
                });
                average = total / $gameTroop.members().length
                console.log("Enemy Troop HP: " + round(average));
            }
        }
        var NeedsTroopAvgMP = JSON.parse(parameters['TroopAvgMP']);
        function TroopAvgMP()
        {
            if(NeedsTroopAvgMP)
            {
                let total = 0, average = 0;
                $gameTroop.members().forEach(function(member){
                    total += member.mpRate();
                });
                average = total / $gameTroop.members().length
                console.log("Enemy Troop MP: " + round(average));
            }
        }
        var NeedsTroopAvgTP = JSON.parse(parameters['TroopAvgTP']);
        function TroopAvgTP()
        {
            if(NeedsTroopAvgTP)
            {
                let total = 0, average = 0;
                $gameTroop.members().forEach(function(member){
                    total += member.tpRate();
                });
                average = total / $gameTroop.members().length
                console.log("Enemy Troop TP: " + round(average));
            }
        }
        //actual logging
        const BattleManager_startBattle = BattleManager.startBattle
        BattleManager.startBattle = function()
        {
            BattleManager_startBattle.call(this);
            console.log("==BATTLE START!==");
            EscapeRate();
            PartyAvgTP();
            TroopAvgTP();
        }
        const BattleManager_endTurn = BattleManager.endTurn;
        BattleManager.endTurn = function()
        {
            BattleManager_endTurn.call(this);
            console.log("==TURN " + $gameTroop.turnCount() + " END==");
            EscapeRate();
            PartyAvgHP();
            PartyAvgMP();
            PartyAvgTP();
            TroopAvgHP();
            TroopAvgMP();
            TroopAvgTP();
        }
        const BattleManager_processVictory = BattleManager.processVictory;
        BattleManager.processVictory = function()
        {
            BattleManager_processVictory.call(this);
            console.log("==VICTORY (TURN " + $gameTroop.turnCount() + ")==");
            EscapeRate();
            PartyAvgHP();
            PartyAvgMP();
            PartyAvgTP();
            TroopAvgHP();
            TroopAvgMP();
            TroopAvgTP();
        }
        if(NeedsEscapeRate)
        {
            const BattleManager_processEscape = BattleManager.processEscape;
            BattleManager.processEscape = function()
            {
                let OriginalEscapeRate = round(BattleManager._escapeRatio);
                let EscapeSuccess = BattleManager_processEscape.call(this);
                if(EscapeSuccess)
                {
                    console.log("==ESCAPED (TURN " + ($gameTroop.turnCount() + 1) + ")==");
                    EscapeRate();
                    PartyAvgHP();
                    PartyAvgMP();
                    PartyAvgTP();
                    TroopAvgHP();
                    TroopAvgMP();
                    TroopAvgTP();
                }else
                {
                    console.log("==ESCAPE FAILED==\nEscape Rate: " + OriginalEscapeRate + " → " + round(BattleManager._escapeRatio));
                }
            }
        }
        const BattleManager_processAbort = BattleManager.processAbort;
        BattleManager.processAbort = function()
        {
            BattleManager_processAbort.call(this);
            console.log("==ABORTED (TURN " + $gameTroop.turnCount() + ")==");
            EscapeRate();
            PartyAvgHP();
            PartyAvgMP();
            PartyAvgTP();
            TroopAvgHP();
            TroopAvgMP();
            TroopAvgTP();
        }
        const BattleManager_processDefeat = BattleManager.processDefeat;
        BattleManager.processDefeat = function()
        {
            BattleManager_processDefeat.call(this);
            console.log("==DEFEATED (TURN " + $gameTroop.turnCount() + ")==");
            EscapeRate();
            PartyAvgHP();
            PartyAvgMP();
            PartyAvgTP();
            TroopAvgHP();
            TroopAvgMP();
            TroopAvgTP();
        }
    }
    //Don't close the game after battleTest
    var CloseAfterBattleTest = JSON.parse(parameters['CloseAfterBattleTest']);
    if(!CloseAfterBattleTest)
    {
        const BattleManager_updateBattleEnd = BattleManager.updateBattleEnd;
        BattleManager.updateBattleEnd = function()
        {
            if (!this.isBattleTest()) BattleManager_updateBattleEnd.call(this);
        };
    }
})();