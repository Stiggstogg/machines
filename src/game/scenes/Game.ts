import {Scene} from 'phaser';
import {Human} from '../sprites/Human.ts';
import {Robot} from '../sprites/Robot.ts';
import {Light} from '../sprites/Light.ts';
import {MusicLightPlayer} from '../helper/MusicLightPlayer.ts';
import {Rule, RuleSet} from '../helper/types.ts';

export class Game extends Scene
{
    
    private human: Human;
    private robot: Robot;
    private light1: Light;
    private light2: Light;
    private ruleSet: RuleSet;
    private musicLightPlayer: MusicLightPlayer;
    
    constructor ()
    {
        super('Game');
    }

    create ()
    {

        // get the rule set for this level
        this.ruleSet = this.cache.json.get('level1').level.ruleSet as RuleSet;

        // add human and robot
        this.human = this.add.existing(new Human(this, this.scale.width * 0.3, this.scale.height / 2, this.ruleSet));
        this.robot = this.add.existing(new Robot(this, this.scale.width * 0.7, this.scale.height / 2, this.ruleSet));

        // add lights
        this.light1 = this.add.existing(new Light(this, this.scale.width * 0.25, this.scale.height * 0.2));
        this.light2 = this.add.existing(new Light(this, this.scale.width * 0.75, this.scale.height * 0.2));

        // play song
        this.musicLightPlayer = new MusicLightPlayer(this, [this.light1, this.light2]);
        this.musicLightPlayer.loadSong('song1');
        this.musicLightPlayer.playSong();

    }

    // Update function for the game loop.
    update(_time: number, _delta: number): void {       // remove underscore if time and delta is needed

        this.robot.danceRules(this.musicLightPlayer.getCurrentPatternCombination());

    }

}
