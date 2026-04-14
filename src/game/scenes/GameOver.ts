import { Scene } from 'phaser';
import gameOptions from "../helper/gameOptions";

export class GameOver extends Scene
{

    constructor ()
    {
        super('GameOver');
    }

    create ()
    {

        // Game over text
        this.add.text(gameOptions.gameWidth / 2, gameOptions.gameHeight * 0.5, 'GAME OVER', {
            fontFamily: 'Arial',
            fontSize: '70px',
            color: '#FFFF00',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(gameOptions.gameWidth / 2, gameOptions.gameHeight - 46,
            'Click anywhere to go back to the menu.', {
                font: '20px Arial',
                color: '#27ff00'
            }).setOrigin(0.5);

        // change to menu on click
        this.input.once('pointerdown', () => {

            this.scene.start('MainMenu');

        });
    }
}
