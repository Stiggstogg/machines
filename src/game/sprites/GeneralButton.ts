import { GameObjects, Scene } from 'phaser';
import gameOptions from '../helper/gameOptions.ts';

// General button class
export class GeneralButton extends GameObjects.Container {

    private readonly image: GameObjects.Image;
    private readonly text: GameObjects.Text;
    private readonly id: string;

    // Constructor
    constructor(scene: Scene, x: number, y: number, text: string, id: string) {

        super(scene, x, y);
        this.image = new GameObjects.Image(scene, 0, 0, 'squareButton');
        this.text = new GameObjects.Text(scene, 0, 3, text, gameOptions.buttonTextStyle).setOrigin(0.5);
        this.id = id;

        this.add([this.image, this.text]);

        // interactive
        this.setSize(this.image.width, this.image.height);
        this.setInteractive();
        this.on('pointerdown', () => {
            this.click();
        });

    }

    // Action that should happen when the button is clicked
    click(): void {
        this.scene.events.emit('click-' + this.id);
        // this.scene.sound.play('click');          // TODO: add click sound
    }

    // Change the button text
    changeText(text: string) {

        this.text.setText(text);

    }

}
