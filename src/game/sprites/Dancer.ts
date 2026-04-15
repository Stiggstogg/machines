import { GameObjects, Scene } from 'phaser';
import gameOptions from '../helper/gameOptions.ts';
import {RuleSet} from '../helper/types.ts';

// Dancer class which is extended by the Human and Robot class
export class Dancer extends GameObjects.Sprite {

    private readonly frameRate: number;
    private readonly animationPrefix: string;
    protected ruleSet: RuleSet;

    // Constructor
    constructor(scene: Scene, x: number, y: number, key: string, ruleSet: RuleSet) {

        super(scene, x, y, key);

        this.frameRate = gameOptions.dancerAnimFrameRate;
        this.animationPrefix = key + '-';
        this.ruleSet = ruleSet;

    }

    // Change the dance animation
    dance(animation: string): void {

        let animationKey = this.animationPrefix + animation;

        if (this.anims.getName() !== animationKey || !this.anims.isPlaying) {
            this.play({key: animationKey, frameRate: this.frameRate, repeat: -1});
        }

    }

}
