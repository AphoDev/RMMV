//==========================================
// APHO_DamageCore.js
//==========================================
/*:
* @title Damage Core
* @author Apho
* @plugindesc v1.0 Allows for more control over damage and stuff.
*
* @param NoDamageSound
* @text No Damage Sound
* @type file
* @dir audio/se
* @desc Sound Effect to play when dealing 0 damage.
* @default Reflection
*
* @param NoDamageVolume
* @parent NoDamageSound
* @text Volume
* @type number
* @desc Volume of the 'no damage' sound.
* @default 90
*
* @param NoDamagePitchMin
* @parent NoDamageSound
* @text Minimum pitch
* @type number
* @desc Minimum pitch of the 'no damage' sound.
* @default 115
*
* @param NoDamagePitchMax
* @parent NoDamageSound
* @text Maximum pitch
* @type number
* @desc Maximum pitch of the 'no damage' sound.
* @default 125

* @param NoHealSound
* @text No Heal Sound
* @type file
* @dir audio/se
* @desc Sound Effect to play when healing for 0 HP.
* @default Down2
*
* @param NoHealVolume
* @parent NoHealSound
* @text Volume
* @type number
* @desc Volume of the 'no heal' sound.
* @default 90
*
* @param NoHealPitchMin
* @parent NoHealSound
* @text Minimum pitch
* @type number
* @desc Minimum pitch of the 'no heal' sound.
* @default 75
*
* @param NoHealPitchMax
* @parent NoHealSound
* @text Maximum pitch
* @type number
* @desc Maximum pitch of the 'no Heal' sound.
* @default 85
*
* @param NoHealSoundMenu
* @parent NoHealSound
* @text Menu Sound
* @type boolean
* @desc Play the sound effect when heal is used from the menu screen?
* @default true
*
* @param ForceVarianceRuling
* @text Force Variance Ruling
* @type select
* @option Cancel each other out (normal variance rates apply)
* @value 0
* @option Always force min
* @value 1
* @option Always force max
* @value 2
* @desc How should variance be handled if user has both 'forceminvariance' and 'forcemaxvariance'?
* @default 0
*
* @param NoVarianceRuling
* @parent ForceVarianceRuling
* @text No Variance Ruling
* @type select
* @option Don't override
* @value 0
* @option Override both
* @value 1
* @option Override min only
* @value 2
* @option Override max only
* @value 3
* @desc Should 'forcenovariance' be allowed to override 'forceminvariance'/'forcemaxvariance'?
* @default 1
*
* @help
* Allows for more control over damage and stuff.
* A sound effect can be played when an attack hits for 0 damage, or a heal heals
* for 0 hp.
* A min/max pitch may also be specified, which will be selected at random.
* Also, the following notetags are available:
* Skills, Items, Actors, Classes, Enemies, & States notetags:
* <adaptive>
* Calculates damage using higher of target's physical or magical damage rate.
* For Actors, Classes, Enemies, or States, causes all of user's attacks and
* skills to become adaptive.
*
* <adaptiveeval>
* //code
* </adaptiveeval>
* Evaluates code to determine if the attack should be adaptive.
* Must return either true (adaptive) or false (not adaptive).
* You may use 'a' for the attacker, 'b' for the defender, and 'item' for the
* skill/item Object.
*
* <piercing:x>, <ppiercing:x>, <mpiercing:x>
* Ignores a percentage of target's damage reduction. x must be a value between
* 0 and 1.
* 'piercing' applies to both PDR and MDR, while 'ppiercing' and 'mpiercing'
* apply only to PDR and MDR respectively.
* For Actors, Classes, Enemies, or States, causes all of user's attacks and
skills to have x piercing, overriding any skill or item notetags.
* Notetag priority from highest to lowest is as follows:
* States, Classes (for actors), Enemies/Actors
*
* EXAMPLE
* <piercing:0.4>
* If a physical skill with this notetag is used against a target with 80%
* Physical Damage Rate, the calculation is as follows:
* Original damage reduction = 100% - 80% = 20%
* 0.4 / 40% of the damage reduction is ignored.
* Target still has 20% * (1 - 0.4) = 12% damage reduction.
* Final Physical Damage Rate = 100% - 12% = 88%
*
* <piercingeval>
* //code
* </piercingeval>
* Evaluates code to determine piercing. Must return a value between 0 and 1.
* You may also use <ppiercingeval> for physical piercing, or <mpiercingeval>
* for magical piercing.
* You may use 'a' for the attacker, 'b' for the defender, and 'item' for the
* skill/item Object.
* Values below 0 are treated as 0. 
*
* EXAMPLE
* <mpiercingeval>
* (a.agi - b.agi) * 0.01
* </mpiercingeval>
* This would give 1% magical piercing per AGI the user has more than the target.
* If the target has more AGI, piercing will be 0.
*
* <nullguard>
* Bypasses guard. Damage will be calculated as though target was not guarding.
* For Actors, Classes, Enemies, or States, causes all of user's attacks and
* skills to bypass guard.
*
* Actors, Classes, Enemies, & States notetags:
* <piercingplus:x>, <ppiercingplus:x>, <mpiercingplus:x>
* Adds x bonus piercing amount to all of the user's attacks and skills.
*
* <piercingmult:x>, <ppiercingmult:x>, <mpiercingmult:x>
* Multiplies user's piercing effects by x.
* This is calculated after piercingplus.
* No effect if piercing is 0.
*
* <nulladaptive>
* Protects the user from adaptive effects.
* Damage will be calculated based on attacker's skill's default Hit Type.
*
* <nullpiercing>, <nullppiercing>, <nullmpiercing>
* Protects the user from piercing effects.
* Damage will be calculated as though attacker had no piercing.
*
* <forceminvariance>, <forcemaxvariance>
* The user will always roll the min/max value for skills and items that have
* variance. If both these notetags are present, the ruling defined in the plugin
* parameters is applied.
*
* <forcenovariance>
* The user will not have any variance for all their skills and items.
* If the user has 'forceminvariance' and/or 'forcemaxvariance', the ruling
* defined in the plugin parameters is applied.
*
* TERMS OF USE
* - Free for commercial and non-commercial use, as long as I get a free copy
*   of the game.
* - Edits allowed for personal use.
* - Do not repost or claim as your own, even if edited.
* 
* VERSION HISTORY
* v1.1 - 2023/7/20 - Added adaptive eval and piercing eval notetags.
* v1.0 - 2023/7/13 - Initial release.
*/
(function(){
    var parameters = PluginManager.parameters('APHO_DamageCore');
    var Imported_YEP_DamageCore = $plugins.filter(function(p) { return p.name === 'YEP_DamageCore' && p.status === true; }).length > 0
    CheckAdaptiveEval = function(notetag, a, b, item)
    {
        const AdaptiveEvalOpen = '<adaptiveeval>';
        const AdaptiveEvalClose = '</adaptiveeval>';
        let ReadAdaptiveEval = false;
        let AdaptiveEvalInfo = "";
        for (var n = 0; n < notetag.length; n++)
        {
            let NoteData = notetag.split(/[\r\n]+/);
            let line = NoteData[n];
            if (line && line.match(AdaptiveEvalOpen))
            {
                ReadAdaptiveEval = true;
            }
            else if (line && line.match(AdaptiveEvalClose))
            {
                ReadAdaptiveEval = false;
            }
            else if (ReadAdaptiveEval == true)
            {
                AdaptiveEvalInfo += line + '\n';
            }
        }
        return eval(AdaptiveEvalInfo)
    };
    CheckPiercingEval = function(notetag, a, b, item)
    {
        const PiercingEvalOpen = '<piercingeval>';
        const PiercingEvalClose = '</piercingeval>';
        let ReadPiercingEval = false;
        let PiercingEvalInfo = "";
        for (var n = 0; n < notetag.length; n++)
        {
            let NoteData = notetag.split(/[\r\n]+/);
            let line = NoteData[n];
            if (line && line.match(PiercingEvalOpen))
            {
                ReadPiercingEval = true;
            }
            else if (line && line.match(PiercingEvalClose))
            {
                ReadPiercingEval = false;
            }
            else if (ReadPiercingEval == true)
            {
                PiercingEvalInfo += line + '\n';
            }
        }
        return Math.max(0, eval(PiercingEvalInfo))
    };
    CheckPPiercingEval = function(notetag, a, b, item)
    {
        const PPiercingEvalOpen = '<ppiercingeval>';
        const PPiercingEvalClose = '</ppiercingeval>';
        let ReadPPiercingEval = false;
        let PPiercingEvalInfo = "";
        for (var n = 0; n < notetag.length; n++)
        {
            let NoteData = notetag.split(/[\r\n]+/);
            let line = NoteData[n];
            if (line && line.match(PPiercingEvalOpen))
            {
                ReadPPiercingEval = true;
            }
            else if (line && line.match(PPiercingEvalClose))
            {
                ReadPPiercingEval = false;
            }
            else if (ReadPPiercingEval == true)
            {
                PPiercingEvalInfo += line + '\n';
            }
        }
        return Math.max(0, eval(PPiercingEvalInfo))
    };
    CheckMPiercingEval = function(notetag, a, b, item)
    {
        const MPiercingEvalOpen = '<mpiercingeval>';
        const MPiercingEvalClose = '</mpiercingeval>';
        let ReadMPiercingEval = false;
        let MPiercingEvalInfo = "";
        for (var n = 0; n < notetag.length; n++)
        {
            let NoteData = notetag.split(/[\r\n]+/);
            let line = NoteData[n];
            if (line && line.match(MPiercingEvalOpen))
            {
                ReadMPiercingEval = true;
            }
            else if (line && line.match(MPiercingEvalClose))
            {
                ReadMPiercingEval = false;
            }
            else if (ReadMPiercingEval == true)
            {
                MPiercingEvalInfo += line + '\n';
            }
        }
        return Math.max(0, eval(MPiercingEvalInfo))
    };
    const Game_Action_makeDamageValue = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function(target, critical) {
        var item = this.item();
        let a = this.subject();
        let adaptive;
        if(item.meta.adaptiveeval) adaptive = CheckAdaptiveEval(item.note, a, target, item);
        adaptive = item.meta.adaptive;
        let piercing = parseFloat(item.meta.piercing) || 0;
        if(item.meta.piercingeval) piercing = CheckPiercingEval(item.note, a, target, item);
        let ppiercing = parseFloat(item.meta.ppiercing) || 0;
        if(piercing) ppiercing = Math.max(piercing, ppiercing);
        if(item.meta.ppiercingeval) ppiercing = CheckPPiercingEval(item.note, a, target, item);
        let mpiercing = parseFloat(item.meta.mpiercing) || 0;
        if(piercing) mpiercing = Math.max(piercing, mpiercing);
        if(item.meta.mpiercingeval) mpiercing = CheckMPiercingEval(item.note, a, target, item);
        let nullguard = item.meta.nullguard;
        if(a.isEnemy())
        {
            if(a.enemy().meta.adaptiveeval) adaptive = CheckAdaptiveEval(a.enemy().note, a, target, item);
            if(a.enemy().meta.adaptive) adaptive = true;
            if(a.enemy().meta.ppiercing) ppiercing = parseFloat(a.enemy().meta.ppiercing);
            if(a.enemy().meta.mpiercing) mpiercing = parseFloat(a.enemy().meta.mpiercing);
            if(a.enemy().meta.piercing)
            {
                ppiercing = parseFloat(a.enemy().meta.piercing);
                mpiercing = parseFloat(a.enemy().meta.piercing);
            }
            if(a.enemy().meta.ppiercingeval) ppiercing = CheckPPiercingEval(a.enemy().note, a, target, item);
            if(a.enemy().meta.mpiercingeval) mpiercing = CheckMPiercingEval(a.enemy().note, a, target, item);
            if(a.enemy().meta.piercingeval)
            {
                ppiercing = CheckPiercingEval(a.enemy().note, a, target, item);
                mpiercing = CheckPiercingEval(a.enemy().note, a, target, item);
            }
            if(a.enemy().meta.ppiercingplus) ppiercing += parseFloat(a.enemy().meta.ppiercingplus);
            if(a.enemy().meta.mpiercingplus) mpiercing += parseFloat(a.enemy().meta.mpiercingplus);
            if(a.enemy().meta.piercingplus)
            {
                ppiercing += parseFloat(a.enemy().meta.piercingplus);
                mpiercing += parseFloat(a.enemy().meta.piercingplus);
            }
            if(a.enemy().meta.ppiercingmult) ppiercing *= parseFloat(a.enemy().meta.ppiercingmult);
            if(a.enemy().meta.mpiercingmult) mpiercing *= parseFloat(a.enemy().meta.mpiercingmult);
            if(a.enemy().meta.piercingmult)
            {
                ppiercing *= parseFloat(a.enemy().meta.piercingmult);
                mpiercing *= parseFloat(a.enemy().meta.piercingmult);
            }
            if(a.enemy().meta.nullguard) nullguard = true;
        }else if(a.isActor())
        {
            if(a.actor().meta.adaptiveeval) adaptive = CheckAdaptiveEval(a.actor().note, a, target, item);
            if($dataClasses[a._classId].meta.adaptiveeval) adaptive = CheckAdaptiveEval($dataClasses[a._classId].note, a, target, item);
            if(a.actor().meta.adaptive || $dataClasses[a._classId].meta.adaptive) adaptive = true;
            if(a.actor().meta.ppiercing) ppiercing = parseFloat(a.actor().meta.ppiercing);
            if(a.actor().meta.mpiercing) mpiercing = parseFloat(a.actor().meta.mpiercing);
            if(a.actor().meta.piercing)
            {
                ppiercing = parseFloat(a.actor().meta.piercing);
                mpiercing = parseFloat(a.actor().meta.piercing);
            }
            if(a.actor().meta.ppiercingeval) ppiercing = CheckPPiercingEval(a.actor().note, a, target, item);
            if(a.actor().meta.mpiercingeval) mpiercing = CheckMPiercingEval(a.actor().note, a, target, item);
            if(a.actor().meta.piercingeval)
            {
                ppiercing = CheckPiercingEval(a.actor().note, a, target, item);
                mpiercing = CheckPiercingEval(a.actor().note, a, target, item);
            }
            if($dataClasses[a._classId].meta.ppiercing) ppiercing = parseFloat($dataClasses[a._classId].meta.ppiercing);
            if($dataClasses[a._classId].meta.mpiercing) mpiercing = parseFloat($dataClasses[a._classId].meta.mpiercing);
            if($dataClasses[a._classId].meta.piercing)
            {
                ppiercing = parseFloat($dataClasses[a._classId].meta.piercing);
                mpiercing = parseFloat($dataClasses[a._classId].meta.piercing);
            }
            if($dataClasses[a._classId].meta.ppiercingeval) ppiercing = CheckPPiercingEval($dataClasses[a._classId].note, a, target, item);
            if($dataClasses[a._classId].meta.mpiercingeval) mpiercing = CheckMPiercingEval($dataClasses[a._classId].note, a, target, item);
            if($dataClasses[a._classId].meta.piercingeval)
            {
                ppiercing = CheckPiercingEval($dataClasses[a._classId].note, a, target, item);
                mpiercing = CheckPiercingEval($dataClasses[a._classId].note, a, target, item);
            }
            if(a.actor().meta.ppiercingplus) ppiercing += parseFloat(a.actor().meta.ppiercingplus);
            if(a.actor().meta.mpiercingplus) mpiercing += parseFloat(a.actor().meta.mpiercingplus);
            if(a.actor().meta.piercingplus)
            {
                ppiercing += parseFloat(a.actor().meta.piercingplus);
                mpiercing += parseFloat(a.actor().meta.piercingplus);
            }
            if($dataClasses[a._classId].meta.ppiercingplus) ppiercing += parseFloat($dataClasses[a._classId].meta.ppiercingplus);
            if($dataClasses[a._classId].meta.mpiercingplus) mpiercing += parseFloat($dataClasses[a._classId].meta.mpiercingplus);
            if($dataClasses[a._classId].meta.piercingplus)
            {
                ppiercing += parseFloat($dataClasses[a._classId].meta.piercingplus);
                mpiercing += parseFloat($dataClasses[a._classId].meta.piercingplus);
            }
            if(a.actor().meta.ppiercingmult) ppiercing *= parseFloat(a.actor().meta.ppiercingmult);
            if(a.actor().meta.mpiercingmult) mpiercing *= parseFloat(a.actor().meta.mpiercingmult);
            if(a.actor().meta.piercingmult)
            {
                ppiercing *= parseFloat(a.actor().meta.piercingmult);
                mpiercing *= parseFloat(a.actor().meta.piercingmult);
            }
            if($dataClasses[a._classId].meta.ppiercingmult) ppiercing *= parseFloat($dataClasses[a._classId].meta.ppiercingmult);
            if($dataClasses[a._classId].meta.mpiercingmult) mpiercing *= parseFloat($dataClasses[a._classId].meta.mpiercingmult);
            if($dataClasses[a._classId].meta.piercingmult)
            {
                ppiercing *= parseFloat($dataClasses[a._classId].meta.piercingmult);
                mpiercing *= parseFloat($dataClasses[a._classId].meta.piercingmult);
            }
            if(a.actor().meta.nullguard || $dataClasses[a._classId].meta.nullguard) nullguard = true;
        }
        for(var n = 0; n < a.states().length; n++)
        {
            if(a.states()[n].meta.adaptiveeval) adaptive = CheckAdaptiveEval(a.states()[n].note, a, target, item);
            if(a.states()[n].meta.adaptive) adaptive = true;
            if(a.states()[n].meta.piercing)
            {
                ppiercing = parseFloat(a.states()[n].meta.piercing);
                mpiercing = parseFloat(a.states()[n].meta.piercing)
            }
            if(a.states()[n].meta.ppiercingeval) ppiercing = CheckPPiercingEval(a.states()[n].note, a, target, item);
            if(a.states()[n].meta.mpiercingeval) mpiercing = CheckMPiercingEval(a.states()[n].note, a, target, item);
            if(a.states()[n].meta.piercingeval)
            {
                ppiercing = CheckPiercingEval(a.states()[n].note, a, target, item);
                mpiercing = CheckPiercingEval(a.states()[n].note, a, target, item);
            }
            if(a.states()[n].meta.ppiercingplus) ppiercing += parseFloat(a.states()[n].meta.ppiercingplus);
            if(a.states()[n].meta.mpiercingplus) mpiercing += parseFloat(a.states()[n].meta.mpiercingplus);
            if(a.states()[n].meta.piercingplus)
            {
                ppiercing += parseFloat(a.states()[n].meta.piercingplus);
                mpiercing += parseFloat(a.states()[n].meta.piercingplus);
            }
            if(a.states()[n].meta.ppiercingmult) ppiercing *= parseFloat(a.states()[n].meta.ppiercingmult);
            if(a.states()[n].meta.mpiercingmult) mpiercing *= parseFloat(a.states()[n].meta.mpiercingmult);
            if(a.states()[n].meta.piercingmult)
            {
                ppiercing *= parseFloat(a.states()[n].meta.piercingmult);
                mpiercing *= parseFloat(a.states()[n].meta.piercingmult);
            }
            if(a.states()[n].meta.nullguard) nullguard = true;
        }
        if(target.isEnemy())
        {
            if(target.enemy().meta.nulladaptive) adaptive = false;
            if(target.enemy().meta.nullppiercing) ppiercing = 0;
            if(target.enemy().meta.nullmpiercing) mpiercing = 0;
            if(target.enemy().meta.nullpiercing)
            {
                ppiercing = 0;
                mpiercing = 0;
            }
        }else if (target.isActor())
        {
            if(target.actor().meta.nulladaptive) adaptive = false;
            if(target.actor().meta.nullppiercing) ppiercing = 0;
            if(target.actor().meta.nullmpiercing) mpiercing = 0;
            if(target.actor().meta.nullpiercing)
            {
                ppiercing = 0;
                mpiercing = 0;
            }
        }
        for(var n = 0; n < target.states().length; n++)
        {
            if(target.states()[n].meta.nulladaptive) adaptive = false;
            if(target.states()[n].meta.nullppiercing) ppiercing = 0;
            if(target.states()[n].meta.nullmpiercing) mpiercing = 0;
            if(target.states()[n].meta.nullpiercing)
            {
                ppiercing = 0;
                mpiercing = 0;
            }
        }
        if(!adaptive && (!ppiercing || ppiercing <= 0) && (!mpiercing || mpiercing <= 0) && !nullguard)
        {
            value = Game_Action_makeDamageValue.call(this, target, critical);
            return value;
        }else
        {
            if(Imported_YEP_DamageCore)
            {
                var baseDamage = this.evalDamageFormula(target);
                baseDamage = this.modifyBaseDamage(value, baseDamage, target);
                baseDamage *= this.calcElementRate(target);
                critical = this.modifyCritical(critical, baseDamage, target);
                target.result().critical = critical;
                var value = baseDamage;
                if(critical)
                {
                    value = this.applyCriticalRate(value, baseDamage, target);
                }
            }else
            {
                var baseValue = this.evalDamageFormula(target);
                var value = baseValue * this.calcElementRate(target);
            }
            function CalcPhysDmg(value)
            {
                if (ppiercing && target.pdr < 1)
                {
                    let dr = (1 - target.pdr) * (1 - Math.min(ppiercing, 1));
                    value *= 1 - dr;
                }else
                {
                    value *= target.pdr;
                }
                if(Imported_YEP_DamageCore) value = Game_Action.prototype.applyFlatPhysical.call(this, value, baseDamage, target);
                return value;
            }
            function CalcMagDmg(value)
            {
                if (mpiercing && target.mdr < 1)
                {
                    let dr = (1 - target.mdr) * (1 - Math.min(mpiercing, 1));
                    value *= 1 - dr;
                }else
                {
                    value *= target.mdr;
                }
                if(Imported_YEP_DamageCore) value = Game_Action.prototype.applyFlatMagical.call(this, value, baseDamage, target);
                return value;
            }
            if (this.isPhysical() && !adaptive) {
                value = CalcPhysDmg(value);
            }else if (this.isMagical( )&& !adaptive) {
                value = CalcMagDmg(value);
            }
            else if(adaptive)
            {
                let pvalue = CalcPhysDmg(value);
                let mvalue = CalcMagDmg(value);
                value = Math.max(pvalue, mvalue);
            }
            if(Imported_YEP_DamageCore)
            {
                if (baseDamage > 0) {
                    value = this.applyFlatDamage(value, baseDamage, target);
                }
                if (baseDamage < 0) {
                    value = this.applyFlatHeal(value, baseDamage, target);
                }
                if (critical) {
                    value = this.applyFlatCritical(value, baseDamage, target);
                }
            }else
            {
                if (baseValue < 0) {
                value *= target.rec;
                }
                if (critical) {
                    value = this.applyCritical(value, target);
                }
            }
            value = this.applyVariance(value, item.damage.variance);
            if(!nullguard) value = this.applyGuard(value, target);
            if(Imported_YEP_DamageCore) value = this.applyFlatGlobal(value, baseDamage, target);
            value = Math.round(value);
            if(Imported_YEP_DamageCore) value = this.applyMinimumDamage(value, baseDamage, target);
            return value;
        }
    };
    var ForceVarianceRuling = parseInt(parameters['ForceVarianceRuling']);
    var NoVarianceRuling = parseInt(parameters['NoVarianceRuling']);
    const Game_Action_applyVariance = Game_Action.prototype.applyVariance;
    Game_Action.prototype.applyVariance = function(damage, variance)
    {
        let a = this.subject();
        let forceminvariance = false;
        let forcemaxvariance = false;
        let forcenovariance = false;
        let NeedsForceVariance = false;
        if(a.isEnemy())
        {
            if(a.enemy().meta.forceminvariance) forceminvariance = true;
            if(a.enemy().meta.forcemaxvariance) forcemaxvariance = true;
            if(a.enemy().meta.forcenovariance) forcenovariance = true;
        }else if(a.isActor())
        {
            if(a.actor().meta.forceminvariance || $dataClasses[a._classId].meta.forceminvariance) forceminvariance = true;
            if(a.actor().meta.forcemaxvariance || $dataClasses[a._classId].meta.forcemaxvariance) forcemaxvariance = true;
            if(a.actor().meta.forcenovariance || $dataClasses[a._classId].meta.forcenovariance) forcenovariance = true;
        }
        for(var n = 0; n < a.states().length; n++)
        {
            if(a.states()[n].meta.forceminvariance) forceminvariance = true;
            if(a.states()[n].meta.forcemaxvariance) forcemaxvariance = true;
            if(a.states()[n].meta.forcenovariance) forcenovariance = true;
        }
        if(forcenovariance)
        {
            switch(NoVarianceRuling)
            {
                case 0:
                if(!forceminvariance && !forcemaxvariance) return damage;
                    break;
                case 1:
                    return damage;
                    break;
                case 2:
                    if(!forcemaxvariance)
                    {
                        return damage;
                    }else if(forceminvariance)
                    {
                        forceminvariance = false;
                    }
                    break;
                case 3:
                    if(!forceminvariance)
                    {
                        return damage;
                    }else if(forcemaxvariance)
                    {
                        forcemaxvariance = false;
                    }
                    break;
            }
        }
        if(ForceVarianceRuling == 0)
        {
            if(forceminvariance ^ forcemaxvariance) NeedsForceVariance = true;
        }else
        {
            if(forceminvariance || forcemaxvariance) NeedsForceVariance = true;
        }
        if(NeedsForceVariance)
        {
            var amp = Math.floor(Math.max(Math.abs(damage) * variance / 100, 0));
            var v;
            if((ForceVarianceRuling == 0 && forceminvariance) ||
            (ForceVarianceRuling == 1 && forceminvariance) ||
            (ForceVarianceRuling == 2 && forceminvariance && !forceminvariance))
            {
                v = amp * -1;
            }
            if((ForceVarianceRuling == 0 && forcemaxvariance) ||
            (ForceVarianceRuling == 2 && forcemaxvariance) ||
            (ForceVarianceRuling == 1 && forcemaxvariance && !forceminvariance))
            {
                v = amp;
            }
            return damage >= 0 ? damage + v : damage - v;
        }else
        {
            damage = Game_Action_applyVariance.call(this, damage, variance);
            return damage;
        }
    }
    var NoDamageSound = parameters['NoDamageSound'];
    var NoDamageVolume = parseInt(parameters['NoDamageVolume']);
    var NoDamagePitchMin = parseInt(parameters['NoDamagePitchMin']);
    var NoDamagePitchRange = Math.max(parseInt(parameters['NoDamagePitchMax']) - NoDamagePitchMin, 0);
    var NoHealSound = parameters['NoHealSound'];
    var NoHealVolume = parseInt(parameters['NoHealVolume']);
    var NoHealPitchMin = parseInt(parameters['NoHealPitchMin']);
    var NoHealPitchRange = Math.max(parseInt(parameters['NoHealPitchMax']) - NoHealPitchMin, 0);
    var NoHealSoundMenu = JSON.parse(parameters['NoHealSoundMenu']);
    const Game_Action_apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function(target){
        Game_Action_apply.call(this, target);
        var result = target.result()
        if(this.isHpEffect() && result.hpDamage == 0 && result.isHit())
        {
            if(this.isRecover())
            {
                if(NoHealSound && ($gameParty.inBattle() || NoHealSoundMenu))
                {
                    let Pitch = NoHealPitchMin + Math.randomInt(NoHealPitchRange + 1);
                    AudioManager.playSe({name: NoHealSound, volume: NoHealVolume, pitch: Pitch, pan: 0});
                }
            }else
            {
                if(NoDamageSound && $gameParty.inBattle())
                {
                    let Pitch = NoDamagePitchMin + Math.randomInt(NoDamagePitchRange + 1);
                    AudioManager.playSe({name: NoDamageSound, volume: NoDamageVolume, pitch: Pitch, pan: 0});
                }
            }
        }
    }
})();