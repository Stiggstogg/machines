import { Scene } from 'phaser';
import gameOptions from "../helper/gameOptions";

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {

        // show logo
        this.add.image(gameOptions.gameWidth/2, gameOptions.gameHeight/2, 'logo').setScale(1, 1); // logo is already preloaded in 'Boot' scene

        // text
        this.add.text(gameOptions.gameWidth/2, gameOptions.gameHeight * 0.20, 'CLOWNGAMING', {fontSize: '70px', color: '#FFFF00', fontStyle: 'bold'}).setOrigin(0.5);
        this.add.text(gameOptions.gameWidth/2, gameOptions.gameHeight * 0.73, 'Loading', {fontSize: '30px', color: '#27FF00'}).setOrigin(0.5);

        // progress bar parameters
        const barWidth = gameOptions.gameWidth * 0.3;           // progress bar width
        const barHeight = barWidth * 0.1;                       // progress bar height
        const barPosition = {
            x: gameOptions.gameWidth / 2 - barWidth / 2,                // progress bar x coordinate (origin is 0, 0)
            y: gameOptions.gameHeight * 0.8 - barHeight / 2             // progress bar y coordinate (origin is 0, 0)
        };

        // progress bar background
        this.add.rectangle(barPosition.x, barPosition.y, barWidth, barHeight, 0xf5f5f5).setOrigin(0);

        // progress bar
        const bar = this.add.rectangle(barPosition.x, barPosition.y, 0, barHeight, 0x27ff00).setOrigin(0);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress: number) => {

            //  Update the progress bar make it bigger based on the progress
            bar.width = progress * barWidth;

        });
    }

    preload ()
    {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('./assets/');

        // images
        this.load.image('sponge', 'images/sponge.jpeg');

        // audio
        //this.load.audio('miss', 'assets/audio/Pew.mp3');
    }

    create ()
    {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        //this.scene.start('MainMenu');
        this.scene.start('Game');       // TODO: Remove and change here again to the main menu, this is only for faster developement

    }
}
