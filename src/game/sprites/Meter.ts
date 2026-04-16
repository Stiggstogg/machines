import {GameObjects} from 'phaser';
import gameOptions from '../helper/gameOptions.ts';

// the meter which keeps track and shows the suspicion value
export default class Meter extends GameObjects.Container {

    private value: number;
    private meterScale: GameObjects.Image;
    private meterIndicator: GameObjects.Image;

    // Constructor
    constructor(scene: Phaser.Scene, x: number, y: number) {

        super(scene, x, y);
        this.value = 0;

        // create the scale and add it to the container
        this.meterScale = new GameObjects.Image(scene, 0, 0, 'meterScale');
        this.meterIndicator = new GameObjects.Image(scene, 0, 0, 'meterIndicator');

        // add both images to the container
        this.add([this.meterScale, this.meterIndicator]);

        // set the indicator
        this.setIndicator();

    }

    // calculate and set the indicator to the right position based on the value
    setIndicator() {

        // parameters for the scale image
        const scaleWidthFull = this.meterScale.displayWidth;
        const scaleOutlineWidth = 2;                                           // Update this value in case the image changes
        const indicatorWidth = this.meterIndicator.displayWidth;
        const scaleWidth = scaleWidthFull - 2 * scaleOutlineWidth - indicatorWidth;

        this.meterIndicator.setX(- scaleWidthFull / 2 + scaleOutlineWidth + indicatorWidth / 2 + this.value / gameOptions.meterParameters.maximum * scaleWidth);

    }

    // set the value based on if the dance move is correct or wrong
    setValue(isCorrect: boolean) {

        if (isCorrect) {
            this.value += gameOptions.meterParameters.correctFactor
        }
        else {
            this.value += gameOptions.meterParameters.wrongFactor
        }

        if (this.value > 100) {
            this.value = 100;
        }
        else if (this.value < 0) {
            this.value = 0;
        }

        this.setIndicator();

    }

}