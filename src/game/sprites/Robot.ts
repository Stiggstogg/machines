import { Scene } from 'phaser';
import {Dancer} from './Dancer.ts';
import {SongSection, Pattern, RuleSet} from '../helper/types.ts';

// Robot class
export class Robot extends Dancer {

    // Constructor
    constructor(scene: Scene, x: number, y: number, ruleSet: RuleSet) {

        super(scene, x, y, 'robot', ruleSet);

        this.dance('idle');

    }
    
    // dance based on the rule set and the current pattern and combinations
    danceAccordingToRules(currentPattern: Pattern) {

        // get the dance key
        const danceKey = this.getExpectedDanceKey(currentPattern);

        // apply the dance key
        this.dance(danceKey);

    }

}
