import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {

        // show logo
        this.add.image(this.scale.width/2, this.scale.height/2, 'logo').setScale(1, 1); // logo is already preloaded in 'Boot' scene

        // text
        this.add.text(this.scale.width/2, this.scale.height * 0.20, 'CLOWNGAMING', {fontSize: '70px', color: '#fbf236', fontStyle: 'bold', resolution: 2}).setOrigin(0.5);
        this.add.text(this.scale.width/2, this.scale.height * 0.75, 'Loading...', {fontSize: '40px', color: '#fbf236', fontStyle: 'bold', resolution: 2}).setOrigin(0.5);

        // progress bar parameters
        const barWidth = this.scale.width * 0.7;           // progress bar width
        const barHeight = barWidth * 0.1;                       // progress bar height
        const barPosition = {
            x: this.scale.width / 2 - barWidth / 2,                // progress bar x coordinate (origin is 0, 0)
            y: this.scale.height * 0.8 - barHeight / 2             // progress bar y coordinate (origin is 0, 0)
        };

        // progress bar background
        this.add.rectangle(barPosition.x, barPosition.y, barWidth, barHeight, 0x5b6ee1).setOrigin(0);

        // progress bar
        const bar = this.add.rectangle(barPosition.x, barPosition.y, 0, barHeight, 0xfbf236).setOrigin(0);

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
        this.load.image('floor', 'images/floor.png');
        this.load.image('holder', 'images/holder.png');
        this.load.image('light', 'images/light.png');
        this.load.image('meter', 'images/meter.png');
        this.load.image('miniRobot', 'images/miniRobot.png');
        this.load.image('mask', 'images/mask.png');
        this.load.image('particle', 'images/particle.png');
        this.load.image('particle2', 'images/particle2.png');

        // spritesheets
        this.load.spritesheet('roundButtons', 'images/roundButtons.png', {frameWidth: 110, margin: 3, spacing: 3});
        this.load.spritesheet('squareButton', 'images/squareButton.png', {frameWidth: 231, frameHeight: 64, margin: 3, spacing: 3});

        // spritesheets (aseprite format)
        this.load.aseprite('human', 'images/human.png', 'images/human.json');
        this.load.aseprite('robot', 'images/robot.png', 'images/robot.json');

        // audio
        this.load.audio('menu', 'music/Menu.mp3');
        this.load.audio('win', 'music/Win.mp3');
        this.load.audio('lose', 'music/Lose.mp3');

        // audio soundeffects
        this.load.audioSprite('soundeffects', 'music/Soundeffects.json', 'music/Soundeffects.mp3');

        // audio: Albums
        this.load.audioSprite('album1', 'music/Album1.json', 'music/Album1.mp3');
        this.load.audioSprite('album2', 'music/Album2.json', 'music/Album2.mp3');
        this.load.audioSprite('album3', 'music/Album3.json', 'music/Album3.mp3');
        this.load.audioSprite('album4', 'music/Album4.json', 'music/Album4.mp3');
        this.load.audioSprite('album5', 'music/Album5.json', 'music/Album5.mp3');

        // audio: Songs
        this.load.json('song1-observe', 'music/Song1-observe.json');
        this.load.json('song1-dance', 'music/Song1-dance.json');
        this.load.json('song2-observe', 'music/Song2-observe.json');
        this.load.json('song2-dance', 'music/Song2-dance.json');
        this.load.json('song3-observe', 'music/Song3-observe.json');
        this.load.json('song3-dance', 'music/Song3-dance.json');
        this.load.json('song4-observe', 'music/Song4-observe.json');
        this.load.json('song4-dance', 'music/Song4-dance.json');
        this.load.json('song5-observe', 'music/Song5-observe.json');
        this.load.json('song5-dance', 'music/Song5-dance.json');

        // levels
        this.load.json('level1', 'levels/level1.json');
        this.load.json('level2', 'levels/level2.json');
        this.load.json('level3', 'levels/level3.json');
        this.load.json('level4', 'levels/level4.json');
        this.load.json('level5', 'levels/level5.json');

        // fonts
        this.load.font('Asimovian', 'fonts/Asimovian-Regular.ttf' , 'truetype');
        this.load.font('Monoton', 'fonts/Monoton-Regular.ttf' , 'truetype');

    }

    create ()
    {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        // Create aseprite animations
        this.anims.createFromAseprite('human');
        this.anims.createFromAseprite('robot');

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('MainMenu');

    }
}
