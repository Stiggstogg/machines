import { GameObjects, Scene, Sound } from 'phaser';
import gameOptions from '../helper/gameOptions.ts';
import {getAudio, getAudioSprite} from '../helper/GetAudio.ts';

// General button class
export class GeneralButton extends GameObjects.Container {

    private readonly image: GameObjects.Image;
    private readonly text: GameObjects.Text;
    private readonly id: string;
    private readonly soundEffects: Sound.BaseSound;

    // Constructor
    constructor(scene: Scene, x: number, y: number, text: string, id: string, color?: 'red' | 'green') {

        super(scene, x, y);

        let frame = 0;
        if (color === 'green') {
            frame = 1;
        }
        else if (color === 'red') {
            frame = 2;
        }

        this.image = new GameObjects.Image(scene, 0, 0, 'squareButton', frame);
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

        this.scene.add.tween({
            targets: this,
            scale: 1.1,
            yoyo: true,
            duration: 100,
            ease: 'Quart.easeOut'
        });

        getAudioSprite(this.scene, 'soundeffects').play("click");

        this.scene.events.emit('click-' + this.id);
    }

    // Change the button text
    changeText(text: string) {

        this.text.setText(text);

    }

}
