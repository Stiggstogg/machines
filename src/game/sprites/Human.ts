import { Scene } from 'phaser';
import {Dancer} from './Dancer.ts';
import {Pattern, RuleSet} from '../helper/types.ts';

// Human class
export class Human extends Dancer {

    // Constructor
    constructor(scene: Scene, x: number, y: number, ruleSet: RuleSet) {

        super(scene, x, y, 'human', ruleSet);

        this.dance('idle');

    }

    // get the currently active dance key
    private getCurrentDanceKey(): string | undefined {

        if (this.anims.isPlaying) {
            const animationKey = this.anims.getName();      // the full animation key (including the animation prefix "human-" and "robot-"
            return animationKey.split('-')[1];
        }
        else {
            return undefined // return undefined in case no animation is playing
        }

    }

    // check if the human dances according to the rules
    isHumanDancingCorrectly(currentPattern: Pattern): boolean {
        return this.getCurrentDanceKey() === this.getExpectedDanceKey(currentPattern);
    }

}
