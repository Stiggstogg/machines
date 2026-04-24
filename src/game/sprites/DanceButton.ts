import { GameObjects, Scene } from 'phaser';
import gameOptions from '../helper/gameOptions.ts';

// Button class
export class DanceButton extends GameObjects.Sprite {

    private readonly danceKey: string

    // Constructor
    constructor(scene: Scene, x: number, y: number, buttonNr: number) {

        super(scene, x, y, 'roundButtons', buttonNr);
        this.danceKey = gameOptions.danceKeysForButtons[buttonNr];
        this.setInteractive();

        this.on('pointerdown', () => {
            this.buttonClicked();
        });

    }

    private buttonClicked() {

        this.scene.events.emit('click-dance', this.danceKey);

    }

}
