import { GameObjects, Scene } from 'phaser';
import gameOptions from '../helper/gameOptions.ts';

// Light class
export class Light extends GameObjects.Sprite {

    private readonly left: boolean          // if this is true then it is the left light, otherwise the right

    // Constructor
    constructor(scene: Scene, x: number, y: number, left: boolean) {

        super(scene, x, y, 'light');
        this.left = left;

        // Position the origin to rotate around at the place were it is fixed to the holder and flip it if needed
        const holderXPosition = 25;

        if (this.left) {
            this.setOrigin(holderXPosition / this.displayWidth, 0.5);
        }
        else {
            this.setOrigin(1 - holderXPosition / this.displayWidth, 0.5);
            this.setFlipX(true);
        }

        //this.setRotation(Math.PI / 4);    // TODO: Add rotation


    }

    // Change the light color
    color(colorNumber: number): void {

        this.setTint(gameOptions.lightColors[colorNumber]);

    }

}
