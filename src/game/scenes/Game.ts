import {GameObjects, Scene} from 'phaser';
import {Human} from '../sprites/Human.ts';
import {Robot} from '../sprites/Robot.ts';
import {Light} from '../sprites/Light.ts';
import {MusicLightPlayer} from '../helper/MusicLightPlayer.ts';
import {RuleSet} from '../helper/types.ts';
import {Button} from '../sprites/Button.ts';
import Meter from '../sprites/Meter.ts';

export class Game extends Scene
{
    
    private floor: GameObjects.Sprite;
    private human: Human;
    private robot: Robot;
    private lightLeft: Light;
    private lightRight: Light;
    private ruleSet: RuleSet;
    private musicLightPlayer: MusicLightPlayer;
    private buttons: Button[];
    private meter: Meter;
    
    constructor ()
    {
        super('Game');
    }

    create ()
    {

        // set background color
        this.cameras.main.setBackgroundColor(0x3f3f74);

        // add floor
        this.floor = this.add.sprite(0, this.scale.height,'floor');
        this.floor.setOrigin(0, 1);

        // get the rule set for this level
        this.ruleSet = this.cache.json.get('level1').level.ruleSet as RuleSet;

        // add human and robot
        const danceYPosition = 0.77;
        this.human = this.add.existing(new Human(this, this.scale.width * -0.5, this.scale.height * danceYPosition, this.ruleSet));
        this.robot = this.add.existing(new Robot(this, this.scale.width * 0.5, this.scale.height * danceYPosition, this.ruleSet));

        // add holder for lights
        const holderXPosition = 0.10;    // holder position from nearest edge
        const holderYPosition = 0.15;    // holder position from
        const holderYOffset = -0.05;     // the right holder is a bit higher up compared to the other
        const holderMountPosition = {x: 16, y: 52};     // position where on the holder the light is mounted, the origin of this image will be set to this coordinate

        // add holder for lights
        const leftHolder = this.add.image(this.scale.width * holderXPosition, this.scale.height * holderYPosition, 'holder');
        leftHolder.setOrigin(holderMountPosition.x / leftHolder.displayWidth, holderMountPosition.y / leftHolder.displayHeight);
        const rightHolder = this.add.image(this.scale.width * (1 - holderXPosition), this.scale.height * (holderYPosition + holderYOffset),'holder');
        rightHolder.setFlipX(true);
        rightHolder.setOrigin(1 - holderMountPosition.x / leftHolder.displayWidth, holderMountPosition.y / leftHolder.displayHeight);

        // add lights
        this.lightLeft = this.add.existing(new Light(this, leftHolder.x, leftHolder.y, true));
        this.lightRight = this.add.existing(new Light(this, rightHolder.x, rightHolder.y, false));

        // add buttons
        this.buttons = [];

        for (let i = 0; i < 3; i++) {
            const button = this.add.existing(new Button(this, this.scale.width * 0.167 + i * this.scale.width * 0.333, this.scale.height * 0.93, i));
            this.buttons.push(button);
        }

        // add event listeners for buttons
        this.events.on('danceButtonClicked', (danceKey: string) => {
            this.human.dance(danceKey);
        })

        // add the meter
        this.meter = this.add.existing(new Meter(this, this.scale.width * 0.92, this.scale.height * 0.5));

        // play song
        this.musicLightPlayer = new MusicLightPlayer(this, [this.lightLeft, this.lightRight]);
        this.musicLightPlayer.loadSong('song1');
        this.musicLightPlayer.playSong();

    }

    // Update function for the game loop.
    update(_time: number, _delta: number): void {       // remove underscore if time and delta is needed

        this.robot.danceAccordingToRules(this.musicLightPlayer.getCurrentPattern());

        // check if the human uses the correct dance
        if (this.human.isHumanDancingCorrectly(this.musicLightPlayer.getCurrentPattern())) {
            this.meter.setValue(true);
        }
        else {
            this.meter.setValue(false);
        }

    }

}
