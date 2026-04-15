import { Scene } from 'phaser';
import {Dancer} from './Dancer.ts';
import {Pattern, PatternCombination, RuleSet} from '../helper/types.ts';

// Robot class
export class Robot extends Dancer {

    // Constructor
    constructor(scene: Scene, x: number, y: number, ruleSet: RuleSet) {

        super(scene, x, y, 'robot', ruleSet);

        this.dance('idle');

    }
    
    // dance based on the rule set and the current pattern and combinations
    danceRules(currentPatternCombination: PatternCombination) {

        // iterate through each rule in the rule set
        for (const rule of this.ruleSet) {

            let matches = true;

            // check patternKey if not null
            if (rule.patternKey !== null && rule.patternKey !== currentPatternCombination.patternKey) {
                matches = false;
            }

            // check markerName if not null
            if (matches && rule.markerName !== null && rule.markerName !== currentPatternCombination.markerName) {
                matches = false;
            }

            // check lightsInSync if not null
            if (matches && rule.lightsInSync !== null && rule.lightsInSync !== currentPatternCombination.lightsInSync) {
                matches = false;
            }

            // check lightColors if not null
            if (matches && rule.lightColors !== null) {
                if (rule.lightColors.length !== currentPatternCombination.lightColors.length) {
                    matches = false;
                } else {
                    for (let i = 0; i < rule.lightColors.length; i++) {
                        if (rule.lightColors[i] !== null && rule.lightColors[i] !== currentPatternCombination.lightColors[i]) {
                            matches = false;
                            break;
                        }
                    }
                }
            }

            // if all non-null properties match, apply the dance and return
            if (matches) {
                this.dance(rule.danceKey);
                return;
            }
        }

        // if no rule matched, apply idle animation
        this.dance('idle');

    }

}
