import {GameObjects, Math as MathPhaser} from 'phaser';
import gameOptions from '../helper/gameOptions.ts';

// the meter which keeps track and shows the suspicion value
export default class Meter extends GameObjects.Container {

    private value: number;
    private readonly indicator: GameObjects.Rectangle;
    private readonly readingHeight: number;

    // Constructor
    constructor(scene: Phaser.Scene, x: number, y: number) {

        super(scene, x, y);
        this.value = 0;

        // create the scale housing and calculate the positions of the meter reading window
        const meterHousing = new GameObjects.Image(scene, 0, 0, 'meter');
        const readingOffsetY = meterHousing.displayHeight / 2 - 40;          // y position where the reading window starts
        this.readingHeight = 352;           // height of the reading window
        const readingWidth = 20;           // width of the reading window

        // create the background of the reading
        const meterBackground = new GameObjects.Rectangle(scene, 0, readingOffsetY, readingWidth, this.readingHeight, 0x663931);
        meterBackground.setOrigin(0.5, 1);

        // create the indicator
        this.indicator = new GameObjects.Rectangle(scene, 0, readingOffsetY, readingWidth, this.readingHeight, 0xff0000); // 0xdf7126);
        this.indicator.setOrigin(0.5, 0);
        this.indicator.setRotation(Math.PI);        // needs to be rotated otherwise it fills up from the top down

        // create the mini robot
        const miniRobot = new GameObjects.Image(scene, 0, - meterHousing.displayHeight / 2 - 15, 'miniRobot').setOrigin(0.5, 1);

        // add both images to the container
        this.add([meterBackground, this.indicator, meterHousing, miniRobot]);

        // set the indicator
        this.setIndicator();

    }

    // calculate and set the indicator to the right position based on the value
    setIndicator() {

        // set the indicator rectangle width accoring to the value
        this.indicator.height = (this.value / gameOptions.meterParameters.maximum * this.readingHeight);

    }

    // set the value based on if the dance move is correct or wrong
    setValue(isCorrect: boolean) {

        if (isCorrect) {
            this.value = MathPhaser.Clamp(this.value + gameOptions.meterParameters.correctFactor, 0, gameOptions.meterParameters.maximum);        // calculate the new value
        }
        else {
            this.value = MathPhaser.Clamp(this.value + gameOptions.meterParameters.wrongFactor, 0, gameOptions.meterParameters.maximum);        // calculate the new valuegameOptions.meterParameters.wrongFactor
        }

        this.setIndicator();

        // return the 'meterFull' event if the meter is full
        if (this.value >= gameOptions.meterParameters.maximum) {
            this.scene.events.emit('meterFull');
        }

    }

}