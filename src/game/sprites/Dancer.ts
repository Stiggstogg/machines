import { GameObjects, Scene } from 'phaser';
import gameOptions from '../helper/gameOptions.ts';
import {Pattern, RuleSet} from '../helper/types.ts';

// Dancer class which is extended by the Human and Robot class
export class Dancer extends GameObjects.Sprite {

    private readonly frameRate: number;
    private readonly animationPrefix: string;
    protected ruleSet: RuleSet;

    // Constructor
    constructor(scene: Scene, x: number, y: number, key: string, ruleSet: RuleSet, bpm: number) {

        super(scene, x, y, key);

        this.frameRate = bpm / 60 * 2;       // converts the bpm to the right dance speed
        this.animationPrefix = key + '-';
        this.ruleSet = ruleSet;

        this.setOrigin(0.5, 1);     // set origin to bottom

    }

    // Change the dance animation
    dance(danceKey: string): void {

        const animationKey = this.animationPrefix + danceKey;    // to make the animations globally unique, a prefix was added for the human and the robot

        if (this.anims.getName() !== animationKey || !this.anims.isPlaying) {
            this.play({key: animationKey, frameRate: this.frameRate, repeat: -1});
        }

    }

    // do the win dance
    danceWin() {

        const animationKey = this.animationPrefix + 'win';

        this.play({
            key: animationKey,
            frameRate: gameOptions.winDanceBPM / 60 * 2,
            repeat: -1
        });

    }

    // do the lose dance
    danceLose() {

        const animationKey = this.animationPrefix + 'idle';

        this.play({
            key: animationKey,
            frameRate: gameOptions.loseDanceBPM / 60 * 2,
            repeat: -1
        });

    }

    // show a specific frame of a specific animation
    showFrame(targetAnimation: string, frameNumber: number) {

        // stop any running animations
        this.stop();

        // derive the animation key
        const animationKey = this.animationPrefix + targetAnimation;

        // get the full lose animation
        const animation = this.scene.anims.get(animationKey);

        // set the frame to the specified number of the lose animation
        this.setFrame(animation.frames[frameNumber].textureFrame);

    }

    // Get the expected dance key based on the current pattern and the rule set
    getExpectedDanceKey(currentPattern: Pattern): string {

        // iterate through each rule in the rule set
        for (const rule of this.ruleSet) {

            let matches = true;

            // check album name if not null
            if (rule.albumName !== null && rule.albumName !== currentPattern.albumName) {
                matches = false;
            }

            // check track name if not null
            if (matches && rule.trackName !== null && rule.trackName !== currentPattern.trackName) {
                matches = false;
            }

            // check lightsInSync if not null
            if (matches && rule.lightsInSync !== null && rule.lightsInSync !== currentPattern.lightsInSync) {
                matches = false;
            }

            // check lightColors if not null
            for (let i = 0; i < rule.lightColors.length; i++) {
                if (matches && rule.lightColors[i] !== null && rule.lightColors[i] !== currentPattern.lightColors[i]) {
                    matches = false;
                    break;
                }
            }

            // if all non-null properties match, return the dance key (this will directly return the key if a rule fits,
            // this means that rules higher up in the hierarchy have priority
            if (matches) {
                return rule.danceKey;
            }
        }

        // if no rule matched, return idle animation
        return 'idle'

    }

    // change origin of Y without changing the position
    changeOriginY(newOriginY: number) {

        // adjust position
        const changeY = newOriginY - this.originY;
        this.setY(this.y + changeY * this.displayHeight);

        // set the new
        this.setOrigin(this.originX, newOriginY);

    }


}
