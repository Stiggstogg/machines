import { GameObjects, Scene } from 'phaser';
import gameOptions from '../helper/gameOptions.ts';

// Light class
export class Light extends GameObjects.Sprite {

    private readonly lightColors: number[];

    // Constructor
    constructor(scene: Scene, x: number, y: number) {

        super(scene, x, y, 'light');
        this.lightColors = gameOptions.lightColors;

    }

    // Change the light color
    color(colorNumber: number): void {

        this.setTint(this.lightColors[colorNumber]);

    }

}
