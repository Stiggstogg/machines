import {Scene} from 'phaser';
import {Human} from '../sprites/Human.ts';
import {Robot} from '../sprites/Robot.ts';
import {Light} from '../sprites/Light.ts';
import {MusicLightPlayer} from '../helper/MusicLightPlayer.ts';
import {RuleSet} from '../helper/types.ts';
import {Button} from '../sprites/Button.ts';
import Meter from '../sprites/Meter.ts';

export class Game extends Scene
{
    
    private human: Human;
    private robot: Robot;
    private light1: Light;
    private light2: Light;
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

        // get the rule set for this level
        this.ruleSet = this.cache.json.get('level1').level.ruleSet as RuleSet;

        // add human and robot
        this.human = this.add.existing(new Human(this, this.scale.width * 0.1, this.scale.height / 2, this.ruleSet));
        this.robot = this.add.existing(new Robot(this, this.scale.width * 0.4, this.scale.height / 2, this.ruleSet));

        // add lights
        this.light1 = this.add.existing(new Light(this, this.scale.width * 0.05, this.scale.height * 0.2));
        this.light2 = this.add.existing(new Light(this, this.scale.width * 0.45, this.scale.height * 0.2));

        // add buttons
        this.buttons = [];

        for (let i = 0; i < 5; i++) {
            const button = this.add.existing(new Button(this, 100 + i * 100, 400, i));
            this.buttons.push(button);
        }

        // add event listeners for buttons
        this.events.on('danceButtonClicked', (danceKey: string) => {
            this.human.dance(danceKey);
        })

        // add the meter
        this.meter = this.add.existing(new Meter(this, this.scale.width * 0.25, this.scale.height * 0.1));

        // play song
        this.musicLightPlayer = new MusicLightPlayer(this, [this.light1, this.light2]);
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
