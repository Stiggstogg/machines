import { Scene } from 'phaser';
import {Dancer} from './Dancer.ts';
import {RuleSet} from '../helper/types.ts';

// Human class
export class Human extends Dancer {

    // Constructor
    constructor(scene: Scene, x: number, y: number, ruleSet: RuleSet) {

        super(scene, x, y, 'human', ruleSet);

        this.dance('idle');

    }

}
