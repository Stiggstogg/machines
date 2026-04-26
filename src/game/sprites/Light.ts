import { GameObjects, Scene, Math as MathPhaser, Tweens, Time } from 'phaser';
import gameOptions from '../helper/gameOptions.ts';

// Light class
export class Light extends GameObjects.Sprite {

    private readonly left: boolean          // if this is true then it is the left light, otherwise the right
    private readonly rotationTween: Tweens.Tween
    private readonly rotationDirection: number;
    private isFlickering: boolean                // flag if the lights are flickering
    private flickerColorNumber: number;
    private flickerTimer?: Time.TimerEvent;

    // Constructor
    constructor(scene: Scene, x: number, y: number, left: boolean, bpm: number) {

        super(scene, x, y, 'light');
        this.left = left;
        this.isFlickering = false;
        this.flickerColorNumber = 0;

        // Position the origin to rotate around at the place were it is fixed to the holder and flip it if needed
        // set the rotation direction and speed
        const holderXPosition = 25;

        this.rotationDirection = 1;
        let rotationSpeed = bpm / 60 / 2;      // rotation speed of the left light (right light is half as fast); speed represents how many times the light moves up and down per second;

        if (this.left) {
            this.setOrigin(holderXPosition / this.displayWidth, 0.5);
        }
        else {
            this.setOrigin(1 - holderXPosition / this.displayWidth, 0.5);
            this.setFlipX(true);
            this.rotationDirection = -1;
            rotationSpeed = rotationSpeed / 2;
        }

        this.setRotation(MathPhaser.DegToRad(this.rotationDirection * 20));

        // create tween to move the lights up and down
        this.rotationTween = this.scene.tweens.add({
            targets: this,
            rotation: {
                from: MathPhaser.DegToRad(this.rotationDirection * 20),
                to: MathPhaser.DegToRad(this.rotationDirection * 75)
            },
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1,
            duration: 1000 / rotationSpeed
        });

        this.rotateLight();

    }

    // Change the light color
    color(colorNumber: number): void {

        this.setTint(gameOptions.lightColors[colorNumber]);

    }

    // Rotate the light up and down
    rotateLight() {

        this.rotationTween.play();

    }

    // stop light rotation
    rotateLightStop() {

        this.rotationTween.pause();

    }

    // start the flickering of the lights
    flickerStart(startColor: number) {

        // set the flickering flag
        this.isFlickering = true;

        // set the starting color
        this.flickerColorNumber = startColor;

        // prevent multiple flicker loops from running at the same time
        this.flickerTimer?.remove();

        this.flickerTimer = this.scene.time.addEvent({
            delay: 1 / (gameOptions.winDanceBPM / 60) * 1000,
            callback: this.flicker,
            callbackScope: this,
            loop: true
        });

        // initiate the first flicker
        this.flicker();

    }

    // flicker the lights (one time)
    flicker() {

        this.color(this.flickerColorNumber);

        // set the next color number
        if (this.flickerColorNumber < gameOptions.lightColors.length) {

            this.flickerColorNumber++;          // move to the next color number

        }
        else {

            this.flickerColorNumber = 0;        // reset the flicker color number

        }

    }

    // stop the flickering of the lights
    flickerStop() {

        this.isFlickering = false;

        this.flickerTimer?.remove();

        this.flickerTimer = undefined;

    }

    // put something into the spotlight
    putIntoSpotlightLow() {

        this.color(gameOptions.spotlightColor);

        let spotlightAngle = 40;

        if (!this.left) {
            spotlightAngle = 50;
        }

        this.setRotation(MathPhaser.DegToRad(this.rotationDirection * spotlightAngle));

    }

    // put something into the spotlight
    putIntoSpotlightHigh() {

        this.color(gameOptions.spotlightColor);

        let spotlightAngle = 30;

        if (!this.left) {
            spotlightAngle = 40;
        }

        this.setRotation(MathPhaser.DegToRad(this.rotationDirection * spotlightAngle));

    }

    // put both (human and robot into the spotlight) for the final game screen
    putIntoSpotlightBoth() {

        this.color(gameOptions.spotlightColor);

        let spotlightAngle = 55;

        if (!this.left) {
            spotlightAngle = 60;
        }

        this.setRotation(MathPhaser.DegToRad(this.rotationDirection * spotlightAngle));

    }

}
