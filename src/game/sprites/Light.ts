import { GameObjects, Scene, Math as MathPhaser, Tweens } from 'phaser';
import gameOptions from '../helper/gameOptions.ts';

// Light class
export class Light extends GameObjects.Sprite {

    private readonly left: boolean          // if this is true then it is the left light, otherwise the right
    private readonly rotationTween: Tweens.Tween

    // Constructor
    constructor(scene: Scene, x: number, y: number, left: boolean, bpm: number) {

        super(scene, x, y, 'light');
        this.left = left;

        // Position the origin to rotate around at the place were it is fixed to the holder and flip it if needed
        // set the rotation direction and speed
        const holderXPosition = 25;

        let rotationDirection = 1;
        let rotationSpeed = bpm / 60 / 2;      // rotation speed of the left light (right light is half as fast); speed represents how many times the light moves up and down per second;

        if (this.left) {
            this.setOrigin(holderXPosition / this.displayWidth, 0.5);
        }
        else {
            this.setOrigin(1 - holderXPosition / this.displayWidth, 0.5);
            this.setFlipX(true);
            rotationDirection = -1;
            rotationSpeed = rotationSpeed / 2;
        }

        this.setRotation(MathPhaser.DegToRad(rotationDirection * 20));

        // create tween to move the lights up and down
        this.rotationTween = this.scene.tweens.add({
            targets: this,
            rotation: {
                from: MathPhaser.DegToRad(rotationDirection * 20),
                to: MathPhaser.DegToRad(rotationDirection * 75)
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

}
