//==========================================
// APHO_SkillSeal.js
//==========================================
/*:
* @title Skill Seal
* @author Apho
* @plugindesc v1.0 Allows for more control over sealing skills.
*
* @param ExcludeFromSeal
* @text Exclude from Sealing
* @type string
* @desc List of skills that should be excluded from sealing. Separate values with a comma. See notes for more details.
* @default 1,2
*
* @param ExcludeFromEval
* @parent ExcludeFromSeal
* @text Exclude from <sealeval>
* @type boolean
* @desc Also exclude from <sealeval>?
* @default true
*
* @help
* Allows for more control over sealing skills. Additionally, sealed skills may
* be unsealed, allowing them to be used as per normal.
*
* The following notetags are available:
* Skill notetags:
* <sealed>
* The skill will always be sealed by default, and may only be used if another
* effect unseals it.
*
* Skills, Actors, Classes, Enemies, & States notetags:
* <nullseal>
* Nullifies all 'seal skill' or 'seal skill type' effects.
* For skills, affects only that skill; otherwise, affects all user's skills.
*
* Actors, Classes, Enemies, & States notetags:
* <sealp>, <sealm>, <sealc>
* Seals all physical, magical, or certain hit skills.
* Excludes skills in the list specified in the plugin parameters.
*
* <sealtag:x>
* Seals all skills with the notetag <x>. Separate multiple tags with a comma.
*
* <sealeval>
* //code
* </sealeval>
* Evaluates code to determine if skills should be sealed.
* You may use 'skill' for the skill object, 'a' for the skill's user, or
* excludelist for the exclude list defined in the plugin parameters.
* Must evaluate to either true (sealed) or false (not sealed).
* 
* EXAMPLES:
* <sealeval>
* skill.id % 2 == 0
* </sealeval>
* This will seal all skills with an ID divisible by 2 (even ID skills).
* Odd ID skills will still be usable.
*
* <sealeval>
* a.hpRate() < 0.5
* </sealeval>
* This will seal all skills while the user's HP is below 50%.
*
* <sealeval>
* !excludelist.includes(skill.id)
* </sealeval>
* If excludelist is not excluded from seal eval, this will seal all skills
* except those in the excludelist.
*
* <unseal:x>
* Unseals skill ID x. Separate multiple values with a comma.
*
* <unsealtype:x>
* Unseals all skills of skill type x. x is the number of the skill type.
* Separate multiple values with a comma.
*
* <unsealp>, <unsealm,>, <unsealc>
* Unseals all physical, magical, or certain hit skills.
*
* <unsealtag:x>
* Unseals all skills with the notetag <x>. Separate multiple tags with a comma.
*
* <unsealeval>
* //code
* </unsealeval>
* Evaluates code to determine if skills should be unsealed.
* You may use 'skill' for the skill object, 'a' for the skill's user, or
* excludelist for the exclude list defined in the plugin parameters.
* Must evaluate to either true (unsealed) or false (not unsealed).
*
* NOTES
* - Unsealing takes priority over sealing.
* - 'Exclude from Sealing' applies only to sealp/m/c, as well as <sealeval>
* if specified in plugin parameters. You can still seal the skills via the
* default 'seal skill/skill type' functionality or by using any of the other
* sealing notetags.
*
* TERMS OF USE
* - Free for commercial and non-commercial use, as long as I get a free copy
*   of the game.
* - Edits allowed for personal use.
* - Do not repost or claim as your own, even if edited.
* 
* VERSION HISTORY
* v1.0 - 2023/07/18 - Initial release.
*/
(function(){
    var parameters = PluginManager.parameters('APHO_SkillSeal');
    var ExcludeFromSeal = parameters['ExcludeFromSeal'].split(",").map(Number);
    var ExcludeFromEval = JSON.parse(parameters['ExcludeFromEval']);
    CheckSealEval = function(notetag, skill, a)
    {
        let excludelist = ExcludeFromSeal;
        if(ExcludeFromEval && excludelist.includes(skill.id)) return false;
        const SealEvalOpen = '<sealeval>';
        const SealEvalClose = '</sealeval>';
        let ReadSealEval = false;
        let SealEvalInfo = "";
        for (var n = 0; n < notetag.length; n++)
        {
            let NoteData = notetag.split(/[\r\n]+/);
            let line = NoteData[n];
            if (line && line.match(SealEvalOpen))
            {
                ReadSealEval = true;
            }
            else if (line && line.match(SealEvalClose))
            {
                ReadSealEval = false;
            }
            else if (ReadSealEval == true)
            {
                SealEvalInfo += line + '\n';
            }
        }
        return eval(SealEvalInfo)
    };
    CheckUnsealEval = function(notetag, skill, a)
    {
        let excludelist = ExcludeFromSeal;
        const UnsealEvalOpen = '<unsealeval>';
        const UnsealEvalClose = '</unsealeval>';
        let ReadUnsealEval = false;
        let UnsealEvalInfo = "";
        for (var n = 0; n < notetag.length; n++)
        {
            let NoteData = notetag.split(/[\r\n]+/);
            let line = NoteData[n];
            if (line && line.match(UnsealEvalOpen))
            {
                ReadUnsealEval = true;
            }
            else if (line && line.match(UnsealEvalClose))
            {
                ReadUnsealEval = false;
            }
            else if (ReadUnsealEval == true)
            {
                UnsealEvalInfo += line + '\n';
            }
        }
        return eval(UnsealEvalInfo)
    };
    const Game_BattlerBase_meetsSkillConditions = Game_BattlerBase.prototype.meetsSkillConditions;
    Game_BattlerBase.prototype.meetsSkillConditions = function(skill) {
        let seal = skill.meta.sealed || false;
        if(this.isEnemy())
        {
            if((this.enemy().meta.sealp && skill.hitType == 1) || (this.enemy().meta.sealm && skill.hitType == 2) || (this.enemy().meta.sealc && skill.hitType == 0))
            {
                if(!ExcludeFromSeal.includes(skill.id)) seal = true;
            }
            if(this.enemy().meta.sealtag)
            {
                let TagsToSeal = this.enemy().meta.sealtag.split(",");
                for(var n1 = 0; n1 < TagsToSeal.length; n1++)
                {
                    if(TagsToSeal[n1] in skill.meta)
                    {
                        seal = true;
                        break;
                    }
                }
            }
            if(this.enemy().meta.sealeval && !seal) seal = CheckSealEval(this.enemy().note, skill, this);
        }else if(this.isActor())
        {
            if((this.actor().meta.sealp && skill.hitType == 1) || (this.actor().meta.sealm && skill.hitType == 2) || (this.actor().meta.sealc && skill.hitType == 0))
            {
                if(!ExcludeFromSeal.includes(skill.id)) seal = true;
            }
            if(($dataClasses[this._classId].meta.sealp && skill.hitType == 1) || ($dataClasses[this._classId].meta.sealm && skill.hitType == 2) || ($dataClasses[this._classId].meta.sealc && skill.hitType == 0))
            {
                if(!ExcludeFromSeal.includes(skill.id)) seal = true;
            }
            if(this.actor().meta.sealtag)
            {
                let TagsToSeal = this.actor().meta.sealtag.split(",");
                for(var n1 = 0; n1 < TagsToSeal.length; n1++)
                {
                    if(TagsToSeal[n1] in skill.meta)
                    {
                        seal = true;
                        break;
                    }
                }
            }
            if($dataClasses[this._classId].meta.sealtag)
            {
                let TagsToSeal = $dataClasses[this._classId].meta.sealtag.split(",");
                for(var n1 = 0; n1 < TagsToSeal.length; n1++)
                {
                    if(TagsToSeal[n1] in skill.meta)
                    {
                        seal = true;
                        break;
                    }
                }
            }
            if(this.actor().meta.sealeval && !seal) seal = CheckSealEval(this.actor().note, skill, this);
            if($dataClasses[this._classId].meta.sealeval && !seal) seal = CheckSealEval($dataClasses[this._classId].note, skill, this);
        }
        if(!seal)
        {
            for(var n = 0; n < this.states().length; n++)
            {
                if((this.states()[n].meta.sealp && skill.hitType == 1) || (this.states()[n].meta.sealm && skill.hitType == 2) || (this.states()[n].meta.sealc && skill.hitType == 0))
                {
                    if(!ExcludeFromSeal.includes(skill.id))
                    {
                        seal = true;
                        break;
                    }
                }
                if(this.states()[n].meta.sealtag)
                {
                    let TagsToSeal = this.states()[n].meta.sealtag.split(",");
                    for(var n1 = 0; n1 < TagsToSeal.length; n1++)
                    {
                        if(TagsToSeal[n1] in skill.meta)
                        {
                            seal = true;
                            break;
                        }
                        if(seal) break;
                    }
                }
                if(this.states()[n].meta.sealeval && !seal)
                {
                    seal = CheckSealEval(this.states()[n].note, skill, this);
                    if(seal) break;
                }
            }
        }
        if(!Game_BattlerBase_meetsSkillConditions.call(this, skill) || seal)
        {
            let unseal = skill.meta.nullseal || false;
            if(this.isEnemy())
            {
                if(this.enemy().meta.nullseal || (this.enemy().meta.unsealp && skill.hitType == 1) || (this.enemy().meta.unsealm && skill.hitType == 2) || (this.enemy().meta.unsealc && skill.hitType == 0)) unseal = true;
                if(this.enemy().meta.unseal)
                {
                    let SkillsToUnseal = this.enemy().meta.unseal.split(",");
                    for(var n1 = 0; n1 < SkillsToUnseal.length; n1++)
                    {
                        if(SkillsToUnseal[n1] == skill.id)
                        {
                            unseal = true;
                            break;
                        }
                    }
                }
                if(this.enemy().meta.unsealtype)
                {
                    let TypesToUnseal = this.enemy().meta.unsealtype.split(",");
                    for(var n1 = 0; n1 < TypesToUnseal.length; n1++)
                    {
                        if(TypesToUnseal[n1] == skill.stypeId)
                        {
                            unseal = true;
                            break;
                        }
                    }
                }
                if(this.enemy().meta.unsealtag)
                {
                    let TagsToUnseal = this.enemy().meta.unsealtag.split(",");
                    for(var n1 = 0; n1 < TagsToUnseal.length; n1++)
                    {
                        if(TagsToUnseal[n1] in skill.meta)
                        {
                            unseal = true;
                            break;
                        }
                    }
                }
                if(this.enemy().meta.unsealeval && !unseal) unseal = CheckUnsealEval(this.enemy().note, skill, this);
            }else if(this.isActor())
            {
                if(this.actor().meta.nullseal || $dataClasses[this._classId].meta.nullseal) unseal = true;
                if(skill.hitType == 1 && (this.actor().meta.unsealp || $dataClasses[this._classId].meta.unsealp)) unseal = true;
                if(skill.hitType == 2 && (this.actor().meta.unsealm || $dataClasses[this._classId].meta.unsealm)) unseal = true;
                if(skill.hitType == 0 && (this.actor().meta.unsealc || $dataClasses[this._classId].meta.unsealc)) unseal = true;
                if(this.actor().meta.unseal)
                {
                    let SkillsToUnseal = this.actor().meta.unseal.split(",");
                    for(var n1 = 0; n1 < SkillsToUnseal.length; n1++)
                    {
                        if(SkillsToUnseal[n1] == skill.id)
                        {
                            unseal = true;
                            break;
                        }
                    }
                }
                if($dataClasses[this._classId].meta.unseal)
                {
                    let SkillsToUnseal = $dataClasses[this._classId].meta.unseal.split(",");
                    for(var n1 = 0; n1 < SkillsToUnseal.length; n1++)
                    {
                        if(SkillsToUnseal[n1] == skill.id)
                        {
                            unseal = true;
                            break;
                        }
                    }
                }
                if(this.actor().meta.unsealtype)
                {
                    let TypesToUnseal = this.actor().meta.unsealtype.split(",");
                    for(var n1 = 0; n1 < TypesToUnseal.length; n1++)
                    {
                        if(TypesToUnseal[n1] == skill.stypeId)
                        {
                            unseal = true;
                            break;
                        }
                    }
                }
                if($dataClasses[this._classId].meta.unsealtype)
                {
                    let TypesToUnseal = $dataClasses[this._classId].meta.unsealtype.split(",");
                    for(var n1 = 0; n1 < TypesToUnseal.length; n1++)
                    {
                        if(TypesToUnseal[n1] == skill.id)
                        {
                            unseal = true;
                            break;
                        }
                    }
                }
                if(this.actor().meta.unsealtag)
                {
                    let TagsToUnseal = this.actor().meta.unsealtag.split(",");
                    for(var n1 = 0; n1 < TagsToUnseal.length; n1++)
                    {
                        if(TagsToUnseal[n1] in skill.meta)
                        {
                            unseal = true;
                            break;
                        }
                    }
                }
                if($dataClasses[this._classId].meta.unsealtag)
                {
                    let TagsToUnseal = $dataClasses[this._classId].meta.unsealtag.split(",");
                    for(var n1 = 0; n1 < TagsToUnseal.length; n1++)
                    {
                        if(TagsToUnseal[n1] in skill.meta)
                        {
                            unseal = true;
                            break;
                        }
                    }
                }
                if(this.actor().meta.unsealeval && !unseal) unseal = CheckUnsealEval(this.actor().note, skill, this);
                if($dataClasses[this._classId].meta.unseal && !unseal) unseal = CheckUnsealEval($dataClasses[this._classId].note, skill, this);
            }
            if(!unseal)
            {
                for(var n = 0; n < this.states().length; n++)
                {
                    if((this.states()[n].meta.nullseal) || (this.states()[n].meta.unsealp && skill.hitType == 1) || (this.states()[n].meta.unsealm && skill.hitType == 2) || (this.states()[n].meta.unsealc && skill.hitType == 0))
                    {
                        unseal = true;
                        break;
                    }
                    if(this.states()[n].meta.unseal)
                    {
                        let SkillsToUnseal = this.states()[n].meta.unseal.split(",");
                        for(var n1 = 0; n1 < SkillsToUnseal.length; n1++)
                        {
                            if(SkillsToUnseal[n1] == skill.id)
                            {
                                unseal = true;
                                break;
                            }
                        }
                        if(unseal) break;
                    }
                    if(this.states()[n].meta.unsealtype)
                    {
                        let TypesToUnseal = this.states()[n].meta.unsealtype.split(",");
                        for(var n1 = 0; n1 < TypesToUnseal.length; n1++)
                        {
                            if(TypesToUnseal[n1] == skill.stypeId)
                            {
                                unseal = true;
                                break;
                            }
                        }
                        if(unseal) break;
                    }
                    if(this.states()[n].meta.unsealtag)
                    {
                        let TagsToUnseal = this.states()[n].meta.unsealtag.split(",");
                        for(var n1 = 0; n1 < TagsToUnseal.length; n1++)
                        {
                            if(TagsToUnseal[n1] in skill.meta)
                            {
                                unseal = true;
                                break;
                            }
                        }
                        if(unseal) break;
                    }
                    if(this.states()[n].meta.unsealeval && !unseal)
                    {
                        unseal = CheckUnsealEval(this.states()[n].note, skill, this);
                        if(unseal) break;
                    }
                }
            }
            if(!unseal)
            {
                return false;
            }else if((this.meetsUsableItemConditions(skill) &&
            this.isSkillWtypeOk(skill) && this.canPaySkillCost(skill)))
            {
                return true;
            }
        }
        return Game_BattlerBase_meetsSkillConditions.call(this, skill);
    };
})();