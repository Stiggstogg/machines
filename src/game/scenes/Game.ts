import {GameObjects, Scene} from 'phaser';
import {Human} from '../sprites/Human.ts';
import {Robot} from '../sprites/Robot.ts';
import {Light} from '../sprites/Light.ts';
import {MusicLightPlayer} from '../helper/MusicLightPlayer.ts';
import {GameSceneData, RuleSet, UIPositions} from '../helper/types.ts';
import {DanceButton} from '../sprites/DanceButton.ts';
import Meter from '../sprites/Meter.ts';
import {GameState} from '../helper/enums.ts';
import gameOptions from '../helper/gameOptions.ts';
import {GeneralButton} from '../sprites/GeneralButton.ts';

export class Game extends Scene
{
    // state and level specific data
    private state: GameState;
    private level: number;
    private levelKey: string;
    private ruleSet: RuleSet;
    private hint: string;
    private timeValue: string;
    private bpm: number;

    // main scene objects
    private floor: GameObjects.Sprite;
    private human: Human;
    private robot: Robot;
    private lightLeft: Light;
    private lightRight: Light;
    private musicLightPlayer: MusicLightPlayer;

    // text
    private timeText: GameObjects.Text;
    private instructionTextTop1: GameObjects.Text;
    private instructionTextTop2: GameObjects.Text;
    private countdownText: GameObjects.Text;
    private hintText: GameObjects.Text;
    private instructionTextBottom: GameObjects.Text;

    // UI elements
    private positionsUI: UIPositions;
    private danceButtons: DanceButton[];
    private letsgoButton: GeneralButton;
    private meter: Meter;

    
    constructor ()
    {
        super({key: 'Game'});
    }

    init(data: GameSceneData) {

        this.level = data.level;
        this.levelKey = 'level' + this.level.toString();

    }

    create ()
    {

        // set the game state to OBSERVE
        this.state = GameState.OBSERVE;

        // get all the data from the level
        this.ruleSet = this.cache.json.get(this.levelKey).level.ruleSet as RuleSet;
        this.timeValue = this.cache.json.get(this.levelKey).level.time as string;
        this.hint = this.cache.json.get(this.levelKey).level.hint as string;
        this.bpm = Number(this.cache.json.get(this.levelKey).level.bpm as string);

        // define FINAL positions for objects in the scene
        const middle = 0.5 * this.scale.width;

        this.positionsUI = {
            humanRobot: {x: middle, y: 0.77 * this.scale.height},
            time: {x: middle, y: 0.01 * this.scale.height},
            instructionTop1: {x: middle, y: 0.09 * this.scale.height},
            instructionTop2: {x: middle, y: 0.14 * this.scale.height},
            hint: {x: middle, y: 0.20 * this.scale.height},
            countdown: {x: middle, y: 0.14 * this.scale.height},
            instructionBottom: {x: middle, y: 0.83 * this.scale.height},
            letsgo: {x: middle, y: 0.93 * this.scale.height},
            danceButtons: {x: this.scale.width * 0.167, y: this.scale.height * 0.93},
            meter: {x: this.scale.width * 0.92, y: this.scale.height * 0.6},
            startOffset: {x: this.scale.width, y: 0.2 * this.scale.height},         // offset to the final position and the position from / to where the tween is coming / going
        };

        // place basic objects
        this.floor = this.add.sprite(0, this.scale.height,'floor');     // add floor
        this.floor.setOrigin(0, 1);

        // add holder for lights
        const holderXPosition = 0.10;    // holder position from nearest edge
        const holderYPosition = 0.27;    // holder position from
        const holderYOffset = -0.05;     // the right holder is a bit higher up compared to the other
        const holderMountPosition = {x: 16, y: 52};     // position where on the holder the light is mounted, the origin of this image will be set to this coordinate

        const leftHolder = this.add.image(this.scale.width * holderXPosition, this.scale.height * holderYPosition, 'holder');
        leftHolder.setOrigin(holderMountPosition.x / leftHolder.displayWidth, holderMountPosition.y / leftHolder.displayHeight);
        const rightHolder = this.add.image(this.scale.width * (1 - holderXPosition), this.scale.height * (holderYPosition + holderYOffset),'holder');
        rightHolder.setFlipX(true);
        rightHolder.setOrigin(1 - holderMountPosition.x / leftHolder.displayWidth, holderMountPosition.y / leftHolder.displayHeight);

        // add lights
        this.lightLeft = this.add.existing(new Light(this, leftHolder.x, leftHolder.y, true, this.bpm));
        this.lightRight = this.add.existing(new Light(this, rightHolder.x, rightHolder.y, false, this.bpm));

        // start the OBSERVE part
        this.startObserve();


        // play song
        this.musicLightPlayer = new MusicLightPlayer(this, [this.lightLeft, this.lightRight]);
        this.musicLightPlayer.loadSong('song1');
        this.musicLightPlayer.playSong();

    }

    // Update function for the game loop.
    update(_time: number, _delta: number): void {       // remove underscore if time and delta is needed

        if (this.state === GameState.OBSERVE) {
            this.robot.danceAccordingToRules(this.musicLightPlayer.getCurrentPattern());
        }

        // check if the human uses the correct dance
        if (this.state === GameState.DANCE) {
            if (this.human.isHumanDancingCorrectly(this.musicLightPlayer.getCurrentPattern())) {
                this.meter.setValue(true);
            }
            else {
                this.meter.setValue(false);
            }
        }

    }

    // Start the observe part
    startObserve() {

        // add robot
        this.robot = this.add.existing(new Robot(this, this.positionsUI.humanRobot.x, this.positionsUI.humanRobot.y, this.ruleSet, this.bpm));

        // add texts
        this.timeText = this.add.text(this.positionsUI.time.x, this.positionsUI.time.y - this.positionsUI.startOffset.y, this.timeValue, gameOptions.clockTextStyle).setOrigin(0.5, 0);
        this.instructionTextTop1 = this.add.text(this.positionsUI.instructionTop1.x + this.positionsUI.startOffset.x, this.positionsUI.instructionTop1.y, 'Watch the Robot Dance', gameOptions.instructionTextStyle).setOrigin(0.5, 0);
        this.instructionTextTop2 = this.add.text(this.positionsUI.instructionTop2.x - this.positionsUI.startOffset.x, this.positionsUI.instructionTop2.y, 'Find the Dance Pattern', gameOptions.instructionTextStyle).setOrigin(0.5, 0);
        this.hintText = this.add.text(this.positionsUI.hint.x, this.positionsUI.hint.y, this.hint, gameOptions.hintTextStyle).setOrigin(0.5, 0).setAlpha(0);
        this.instructionTextBottom = this.add.text(this.positionsUI.instructionBottom.x, this.positionsUI.instructionBottom.y + this.positionsUI.startOffset.y, 'Are You Ready to Dance?', gameOptions.instructionTextStyle).setOrigin(0.5, 0);

        // add button
        this.letsgoButton = this.add.existing(new GeneralButton(this, this.positionsUI.letsgo.x, this.positionsUI.letsgo.y + this.positionsUI.startOffset.y, 'Let\'s GO!', 'letsgo'));
        this.events.once('click-letsgo', () => {
            this.startDance();
        });

        // timeline for the tweens
        this.add.timeline([
            {
                at: 0,
                tween: {
                    targets: this.timeText,
                    y: this.positionsUI.time.y,
                    ease: 'Cubic.easeOut',
                    duration: 500
                }
            },
            {
                from: 300,
                tween: {
                    targets: [this.instructionTextTop1, this.instructionTextTop2],
                    x: this.positionsUI.instructionTop1.x,
                    ease: 'Back.easeOut',
                    duration: 700
                }
            },
            {
                from: 400,
                tween: {
                    targets: [this.hintText],
                    alpha: 1,
                    duration: 500
                }
            },
            {
                from: 1300,
                tween: {
                    targets: this.instructionTextBottom,
                    y: this.positionsUI.instructionBottom.y,
                    ease: 'Cubic.easeOut',
                    duration: 500
                }
            },
            {
                from: 0,
                tween: {
                    targets: this.letsgoButton,
                    y: this.positionsUI.letsgo.y,
                    ease: 'Cubic.easeOut',
                    duration: 500
                }
            },

        ]).play();

    }

    startDance() {

        // change the game state (to the transition from OBSERVE to DANCE)
        this.state = GameState.OBSERVE_TRANSITION;

        // create and add human
        this.human = this.add.existing(new Human(this, this.positionsUI.humanRobot.x - this.positionsUI.startOffset.x, this.positionsUI.humanRobot.y, this.ruleSet, this.bpm));

        // create and add buttons and meter
        this.danceButtons = [];

        for (let i = 0; i < 3; i++) {
            const button = this.add.existing(new DanceButton(this, this.positionsUI.danceButtons.x + i * this.scale.width * 0.333, this.positionsUI.danceButtons.y + this.positionsUI.startOffset.y, i));
            this.danceButtons.push(button);
        }

        // add event listeners for buttons
        this.events.on('danceButtonClicked', (danceKey: string) => {
            this.human.dance(danceKey);
        })

        // add the meter
        this.meter = this.add.existing(new Meter(this, this.positionsUI.meter.x + this.positionsUI.startOffset.x, this.positionsUI.meter.y));

        // add countdown
        this.countdownText = this.add.text(this.positionsUI.countdown.x, this.positionsUI.countdown.y, '4', gameOptions.instructionTextStyle).setScale(0);

        // timeline for the tweens
        this.add.timeline([
            {                                                                           // Move all UI elements from the OBSERVE part out
                at: 0,
                tween: {
                    targets: this.timeText,
                    y: this.positionsUI.time.y - this.positionsUI.startOffset.y,
                    ease: 'Cubic.easeIn',
                    duration: 500
                }
            },
            {
                from: 0,
                tween: {
                    targets: this.instructionTextTop1,
                    x: this.positionsUI.instructionTop1.x + this.positionsUI.startOffset.x,
                    ease: 'Back.easeIn',
                    duration: 700
                }
            },
            {
                from: 0,
                tween: {
                    targets: this.instructionTextTop2,
                    x: this.positionsUI.instructionTop2.x - this.positionsUI.startOffset.x,
                    ease: 'Back.easeIn',
                    duration: 700
                }
            },
            {
                from: 0,
                tween: {
                    targets: [this.hintText],
                    alpha: 0,
                    duration: 500
                }
            },
            {
                from: 0,
                tween: {
                    targets: this.instructionTextBottom,
                    y: this.positionsUI.instructionBottom.y + this.positionsUI.startOffset.y,
                    ease: 'Cubic.easeIn',
                    duration: 500
                }
            },
            {
                from: 0,
                tween: {
                    targets: this.letsgoButton,
                    y: this.positionsUI.letsgo.y + this.positionsUI.startOffset.y,
                    ease: 'Cubic.easeIn',
                    duration: 500
                }
            },
            {                                                                               // move robot out
                from: 1000,
                tween: {
                    targets: this.robot,
                    x: this.positionsUI.humanRobot.x + this.positionsUI.startOffset.x,
                    duration: 2000
                },
                run: () => {                                                          // change to the in/out dance pattern
                    this.robot.dance('inout');
                    this.human.dance('inout');
                }
            },
            {
                from: 0,                                                                   // move human in
                tween: {
                    targets: this.human,
                    x: this.positionsUI.humanRobot.x,
                    duration: 2000
                }
            },
            {
                from: 2000,
                run: () => {
                    this.musicLightPlayer.loadSong('song2');                        // TODO: this is currently static, replace with a dynamic key
                    this.events.once('newSongSection', () => {                  // Show the countdown when the
                        this.startCountDown();
                    });
                }
            }
        ]).play();

    }

    startCountDown() {

        // create the countdown tween
        const tweenCountdown = this.tweens.add({
            targets: this.countdownText,
            duration: 1000 / (this.bpm / 60) * 2,
            scale: 1,
            ease: 'Cubic.Out',
            paused: false,
            onStart: () => {

                // get number
                const countNumber: number = Number(this.countdownText.text);
            },
            onComplete: () => {

                // get number
                const countNumber: number = Number(this.countdownText.text);

                if (countNumber > 0) {
                    this.countdownText.setText((countNumber - 1).toString());
                    tweenCountdown.play();
                }
                else {

                    // destroy the countdown
                    this.countdownText.destroy();

                }

            }
        });

    }
}
