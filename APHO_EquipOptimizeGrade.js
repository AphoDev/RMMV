//==========================================
// APHO_EquipOptimizeGrade.js
//==========================================
/*:
* @title Equip Optimize Grade
* @author Apho
* @plugindesc v1.1 Allows the 'Optimize' command in the equip menu to utilize a grading system defined by the developer.
*
* @param Ungraded equip ruling
* @type select
* @option Use default grade
* @value 0
* @option Use stat totals (Default RMMV rules)
* @value 1
* @option Use item price
* @value 2
* @desc Ruling for optimizing equips when no grade is defined.
* @default 0
*
* @param Default grade
* @type number
* @min -999
* @desc If 'use default grade' ruling is selected, ungraded equips will have this grade.
* @default 0
*
* @help
* This plugin changes the way optimize works, by allowing the developer to set
* grades for equipment.
* Higher grades will be prioritized over lower ones when optimizing equipment.
* If multiple equips have the same grade, the one with a lower ID will be
* prioritized.
* 
* Set grades with the notetag <grade:n>
* 'n' must be a number greater than -1000. Decimals may be used.
* 
* If you have multiple slots for the same equip type (added via plugins like
* YEP_EquipCore), and you do not want the same item to be equipped twice, use
* the notetag <unique>
*
* If a grade is not specified, optimize will follow the ruling set by the plugin
* parameter 'ungraded equip ruling'.
* 0 - Use the value set in the 'default grade' parameter.
* 1 - Use stat totals, just like vanilla RMMV.
* 2 - Use the item's price.
*
* If using anything other than default grade, it is highly recommended to
* either grade all equips of a specific equipment type, or none.
*
* TERMS OF USE
* - Free for commercial and non-commercial use, as long as I get a free copy
*   of the game.
* - Edits allowed for personal use.
* - Do not repost or claim as your own, even if edited.
* 
* VERSION HISTORY
* v1.1 - 2022/8/1 - Optimize code.
* v1.0 - 2022/8/1 - Initial release.
*/
var parameters = PluginManager.parameters('APHO_EquipOptimizeGrade');
var UngradedRuling = parseInt(parameters['Ungraded equip ruling']);
var DefaultGrade = parseFloat(parameters['Default grade']);
Game_Actor.prototype.calcEquipItemPerformance = function(item)
{
	if(item.meta.unique)
	{
		var who = this.actorId();
		var what = item.id;
		if(item.wtypeId && $gameActors.actor(who).hasWeapon($dataWeapons[what]))
		{
			return -1000;
		}
		else if(item.atypeId && $gameActors.actor(who).hasArmor($dataArmors[what]))
		{
			return -1000;
		}
	}
	if(item.meta.grade)
	{
		return parseFloat(item.meta.grade);
	}
	else
	{
		switch(UngradedRuling)
		{
			case 0:
				return DefaultGrade;
				break;
			case 1:
				return item.params.reduce(function(a, b){return a + b;});
				break;
			case 2:
				return item.price;
				break;
		}
	}	
}