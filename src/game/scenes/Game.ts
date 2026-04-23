import {GameObjects, Math as MathPhaser, Scene, Time} from 'phaser';
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
import ProgressBar from '../sprites/ProgressBar.ts';

export class Game extends Scene
{
    // state- and level-specific data
    private state: GameState;
    private level: number;
    private levelKey: string;
    private ruleSet: RuleSet;
    private hint: string;
    private bpm: number;
    private robotSong: string;
    private humanSong: string;

    // main scene objects
    private floor: GameObjects.Sprite;
    private progressBar: ProgressBar;
    private human: Human;
    private robot: Robot;
    private lightLeft: Light;
    private lightRight: Light;
    private musicLightPlayer: MusicLightPlayer;

    // text
    private titleText: GameObjects.Text;
    private instructionTextTop1: GameObjects.Text;
    private instructionTextTop2: GameObjects.Text;
    private countdownText: GameObjects.Text;
    private hintText: GameObjects.Text;
    private instructionTextBottom: GameObjects.Text;

    // UI elements
    private positionsUI: UIPositions;
    private danceButtons: DanceButton[];
    private okButton: GeneralButton;
    private yesButton: GeneralButton;
    private noButton: GeneralButton;
    private meter: Meter;

    
    constructor ()
    {
        super({key: 'Game'});
    }

    init(data: GameSceneData) {

        this.level = data.level;
        this.levelKey = 'level' + this.level.toString();

    }

    create () {

        // set the game state to OBSERVE
        this.state = GameState.OBSERVE;

        // get all the data from the level
        this.ruleSet = this.cache.json.get(this.levelKey).level.ruleSet as RuleSet;
        this.hint = this.cache.json.get(this.levelKey).level.hint as string;
        this.bpm = Number(this.cache.json.get(this.levelKey).level.bpm as string);
        this.robotSong = this.cache.json.get(this.levelKey).level.robotSong as string;
        this.humanSong = this.cache.json.get(this.levelKey).level.humanSong as string;

        // define FINAL positions for objects in the scene
        const middle = 0.5 * this.scale.width;
        const buttonY = 0.93 * this.scale.height;

        this.positionsUI = {
            humanRobot: {x: middle, y: 0.77 * this.scale.height},
            title: {x: middle, y: 0.025 * this.scale.height},
            instructionTop1: {x: middle, y: 0.09 * this.scale.height},
            instructionTop2: {x: middle, y: 0.14 * this.scale.height},
            hint: {x: middle, y: 0.20 * this.scale.height},
            countdown: {x: middle, y: 0.14 * this.scale.height},
            instructionBottom: {x: middle, y: 0.83 * this.scale.height},
            ok: {x: middle, y:buttonY},
            yes: {x: this.scale.width * 0.25, y: buttonY},
            no: {x: this.scale.width * 0.75, y: buttonY},
            danceButtons: {x: this.scale.width * 0.167, y: this.scale.height * 0.93},
            meter: {x: this.scale.width * 0.92, y: this.scale.height * 0.6},
            startOffset: {x: this.scale.width, y: 0.2 * this.scale.height},         // offset to the final position and the position from / to where the tween is coming / going
        };

        // place basic objects
        this.floor = this.add.sprite(0, this.scale.height,'floor');     // add floor
        this.floor.setOrigin(0, 1);
        this.progressBar = this.add.existing(new ProgressBar(this, this.scale.width * 0.5, this.scale.height * 0.02));

        // add holder for lights
        const holderXPosition = 0.10;    // holder position from nearest edge
        const holderYPosition = 0.27;    // holder position
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

        // setup the music player
        this.musicLightPlayer = new MusicLightPlayer(this, [this.lightLeft, this.lightRight], this.progressBar, this.bpm);

        // add the lose and win condition event listeners
        this.events.once('meterFull', () => {

            this.startLose();
            console.log('meterFull');

        });

        this.events.once('humanSongOver', () =>{

            this.startWin();
            console.log('humanSongOver');

        });

        // start the OBSERVE part
        this.startObserve();

    }

    // Update function for the game loop.
    update(_time: number, _delta: number): void {       // remove underscore if time and delta is needed

        // update the progress bar if the state is OBSERVE, OBSERVE_TRANSITION, DANCE
        if (this.state == GameState.OBSERVE || GameState.OBSERVE_TRANSITION || GameState.DANCE) {
            this.progressBar.update();
        }

        if (this.state === GameState.OBSERVE) {
            this.robot.danceAccordingToRules(this.musicLightPlayer.getCurrentPattern());
        }

        // check if the human uses the correct dance and set the meter
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

        // start the robot song
        this.musicLightPlayer.loadSong(this.robotSong, false);
        this.musicLightPlayer.playSong();

        // add robot
        this.robot = this.add.existing(new Robot(this, this.positionsUI.humanRobot.x, this.positionsUI.humanRobot.y, this.ruleSet, this.bpm));

        // add texts
        this.titleText = this.add.text(this.positionsUI.title.x, this.positionsUI.title.y - this.positionsUI.startOffset.y, 'Song ' + this.level + '/' + gameOptions.maxLevel, gameOptions.titleTextStyle).setOrigin(0.5, 0);
        this.instructionTextTop1 = this.add.text(this.positionsUI.instructionTop1.x + this.positionsUI.startOffset.x, this.positionsUI.instructionTop1.y, 'Watch the Robot Dance', gameOptions.instructionTextStyle).setOrigin(0.5, 0);
        this.instructionTextTop2 = this.add.text(this.positionsUI.instructionTop2.x - this.positionsUI.startOffset.x, this.positionsUI.instructionTop2.y, 'Find the Dance Pattern', gameOptions.instructionTextStyle).setOrigin(0.5, 0);
        this.hintText = this.add.text(this.positionsUI.hint.x, this.positionsUI.hint.y, this.hint, gameOptions.hintTextStyle).setOrigin(0.5, 0).setAlpha(0);
        this.instructionTextBottom = this.add.text(this.positionsUI.instructionBottom.x, this.positionsUI.instructionBottom.y + this.positionsUI.startOffset.y, 'Are You Ready to Dance?', gameOptions.instructionTextStyle).setOrigin(0.5, 0);

        // add button
        this.okButton = this.add.existing(new GeneralButton(this, this.positionsUI.ok.x, this.positionsUI.ok.y + this.positionsUI.startOffset.y, 'Let\'s GO!', 'ok'));
        this.events.once('click-ok', () => {
            this.startDance();
        });

        // create the yes / no buttons (not used in this scene but in later scenes)
        this.yesButton = this.add.existing(new GeneralButton(this, this.positionsUI.yes.x, this.positionsUI.yes.y + this.positionsUI.startOffset.y, 'Yes!', 'yes'));
        this.noButton = this.add.existing(new GeneralButton(this, this.positionsUI.no.x, this.positionsUI.no.y + this.positionsUI.startOffset.y, 'No', 'no'));

        // timeline for the tweens
        this.add.timeline([
            {
                at: 0,
                tween: {
                    targets: this.titleText,
                    y: this.positionsUI.title.y,
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
                    targets: this.okButton,
                    y: this.positionsUI.ok.y,
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
        this.meter = this.add.existing(new Meter(this, this.positionsUI.meter.x + this.positionsUI.startOffset.x / 5, this.positionsUI.meter.y));

        // add countdown
        this.countdownText = this.add.text(this.positionsUI.countdown.x, this.positionsUI.countdown.y, '4', gameOptions.instructionTextStyle).setScale(0).setOrigin(0.5, 0);

        // timeline for the tweens
        this.add.timeline([
            {                                                                           // Move all UI elements from the OBSERVE part out
                at: 0,
                tween: {
                    targets: this.titleText,
                    y: this.positionsUI.title.y - this.positionsUI.startOffset.y,
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
                    targets: this.okButton,
                    y: this.positionsUI.ok.y + this.positionsUI.startOffset.y,
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

                    // set the new song (it will start to play as soon as the current section is finished
                    this.musicLightPlayer.loadSong(this.humanSong, true);

                    // set the "Are you ready?" text
                    this.instructionTextTop1.setText('Are You Ready?');

                    // let the human do the idle dance
                    this.human.dance('idle');

                    // bring in the buttons and meter
                    this.tweens.add({
                        targets: this.danceButtons,
                        y: this.positionsUI.danceButtons.y,
                        ease: 'Cubic.easeIn',
                        duration: 500
                    });

                    this.tweens.add({
                        targets: this.meter,
                        x: this.positionsUI.meter.x,
                        ease: 'Cubic.easeIn',
                        duration: 500
                    });

                    // Show the countdown when the new section starts
                    this.events.once('newSongSection', () => {

                        this.startCountDown();

                        // switch to the "DANCE" state as soon as the next song section starts
                        this.events.once('newSongSection', () => {

                            // remove the "Are you ready?" text (by moving it out screen)
                            this.instructionTextTop1.setX(this.positionsUI.instructionTop1.x + this.positionsUI.startOffset.x);

                            // change to the dance state
                            this.state = GameState.DANCE;           // switch to the "DANCE" game state

                        });

                    });

                },
                tween: {
                    targets: this.instructionTextTop1,
                    x: {
                        from: this.positionsUI.instructionTop1.x + this.positionsUI.startOffset.x,
                        to: this.positionsUI.instructionTop1.x,
                        ease: 'Back.easeOut',
                        duration: 700
                    },
                    ease: 'Back.easeIn',
                    duration: 700
                }
            }
        ]).play();

    }

    startWin() {

        // change to the WIN state
        this.state = GameState.WIN;

        // start the human and robot win dance animation
        this.human.danceWin();
        this.robot.danceWin();

        // play the win music
        const winAudio = this.sound.add('win', {
            loop: true
        }).play();

        // Stop the light rotation and flicker the two lights
        this.lightLeft.rotateLightStop();
        this.lightRight.rotateLightStop();
        this.lightLeft.flickerStart(0);
        this.lightRight.flickerStart(2);

        // do different things based on if it is the last level or not
        if (this.level < gameOptions.maxLevel) {

            // run the timeline to remove and add objects
            this.getDanceEndTimeline(
                'You Danced Like a Robot!',
                'Nobody Got Suspicious',
                'Ready for the next Song?',
                false
            ).play();

            // add the event listener for the "Yes" button
            this.events.once('click-yes', () => {
                this.startNextScene(false);
            });

            this.events.once('click-no', () => {
                this.startNextScene(true);
            });

        }
        else {

            this.okButton.changeText('OK');

            // run the timeline to remove and add objects
            this.getDanceEndTimeline(
                'You Made It!',
                'You Are One of Them!',
                'It Is Time to Rest',
                true
            ).play();

            // add the event listener for the "OK" button
            this.events.once('click-ok', () => {
                this.startNextScene(true);
            });
        }

    }

    startLose() {

        // change to the LISE state
        this.state = GameState.LOSE;

        // add camera shake
        this.cameras.main.shake(200);

        // start the human and robot lose animation
        this.getKickoutTimeline().play();

        // stop the musicLightPlayer and play the lose music
        this.musicLightPlayer.stopSong();

        this.sound.add('win', {         // TODO: Replace this with the 'lose' sound as soon as it is available
            loop: true
        }).play();

        // Stop the light rotation and put the human into the spotlight
        this.lightLeft.rotateLightStop();
        this.lightRight.rotateLightStop();
        this.lightLeft.putIntoSpotlight();
        this.lightRight.putIntoSpotlight();

        // run the timeline to remove and add objects
        this.getDanceEndTimeline(
            'You Got Caught!',
            'Wrong Dance Used',
            'Try Again?',
            false
        ).play();

        // add the event listener for the "Yes" button
        this.events.once('click-yes', () => {
            this.startNextScene(false);
        });

        this.events.once('click-no', () => {
            this.startNextScene(true);
        });

    }

    // move all objects out and fade out into next scene
    startNextScene(toMenu: boolean) {

        // fade out the scene
        this.cameras.main.fade(500);

        // fade out win/lose audio
        let winLoseAudio = undefined;

        if (this.sound.get('win')) {
            winLoseAudio = this.sound.get('win');
        }
        else {
            winLoseAudio = this.sound.get('lose');
        }

        this.add.tween({
            targets: winLoseAudio,
            volume: 0,
            duration: 500
        });

        // change to the next scene when the camera fade out is complete
        this.cameras.main.once('camerafadeoutcomplete', () => {

            // stop all audio
            this.sound.stopAll();

            if (toMenu) {
                this.scene.start('MainMenu');
            }
            else {
                if (this.state === GameState.WIN) {
                    console.log('next level');      // TODO: finalize this as soon as more levels are available
                    this.scene.start('Game', {level: this.level}); // TODO: add here the next level as soon as more levels are available
                } else {
                    console.log('same level');      // finalize this as soon as more levels are available
                    this.scene.start('Game', {level: this.level});
                }
            }

        });

        // move all objects out using a timeline
        this.add.timeline([
            {
                at: 0,
                tween: {
                    targets: this.titleText,
                    y: this.positionsUI.title.y - this.positionsUI.startOffset.y,
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
                    targets: [this.okButton,this.yesButton, this.noButton],
                    y: this.positionsUI.ok.y + this.positionsUI.startOffset.y,
                    ease: 'Cubic.easeIn',
                    duration: 500
                },
                run: () => {

                    // disable all buttons
                    this.okButton.disableInteractive();
                    this.yesButton.disableInteractive();
                    this.noButton.disableInteractive();
                }
            },
        ]).play();

    }

    // start the countdown
    startCountDown() {

        // create the countdown tween
        const tweenCountdown = this.tweens.add({
            targets: this.countdownText,
            duration: 1000 / (this.bpm / 60) * 2,
            scale: {
                from: 0,
                to: 1
            },
            ease: 'Expo.Out',
            paused: false,
            onComplete: () => {

                // get number
                const countNumber: number = Number(this.countdownText.text);

                if (!isNaN(countNumber)) {

                    if (countNumber === 1) {

                        this.countdownText.setText('DANCE!');

                    }
                    else {
                        this.countdownText.setText((countNumber - 1).toString());
                    }

                    tweenCountdown.play();
                }
                else {

                    // destroy the countdown
                    this.countdownText.destroy();

                }

            }
        });

    }

    // get the timeline for the things which should happen when the DANCE is over (because you won (any and last level) or because you lost)
    getDanceEndTimeline(instructionTextTop1: string, instructionTextTop2: string, instructionTextBottom: string, lastLevel: boolean): Time.Timeline {

        // create the timeline steps to move all parts which are not needed anymore out
        let timelineConfig: Phaser.Types.Time.TimelineEventConfig[] = [
            {                                                                           // move meter out and remove progress bar
                at: 0,
                tween: {
                    targets: this.meter,
                    x: this.positionsUI.meter.x + this.positionsUI.startOffset.x / 5,
                    ease: 'Cubic.easeOut',
                    duration: 500
                },
                run: () => {
                    this.progressBar.destroy();                                         // remove progress bar
                }
            },
            {                                                                           // move dance buttons out
                from: 0,
                tween: {
                    targets: this.danceButtons,
                    y: this.positionsUI.danceButtons.y + this.positionsUI.startOffset.y,
                    ease: 'Cubic.easeOut',
                    duration: 500
                }
            }];

        // move all the general UI elements (independent of if it was a win or loss)
        timelineConfig.push(...[
            {                                                                           // move title in
                from: 0,
                tween: {
                    targets: this.titleText,
                    y: this.positionsUI.title.y,
                    ease: 'Cubic.easeOut',
                    duration: 500
                }
            },
            {                                                                           // move instruction texts in
                from: 300,
                run: () => {
                    this.instructionTextTop1.setText(instructionTextTop1);
                    this.instructionTextTop2.setText(instructionTextTop2);
                },
                tween: {
                    targets: [this.instructionTextTop1, this.instructionTextTop2],
                    x: this.positionsUI.instructionTop1.x,
                    ease: 'Back.easeOut',
                    duration: 700
                }
            },
            {                                                                           // move question text in
                from: 300,
                tween: {
                    targets: this.instructionTextBottom,
                    y: this.positionsUI.instructionBottom.y,
                    ease: 'Cubic.easeOut',
                    duration: 500
                },
                run: () => {
                    this.instructionTextBottom.setText(instructionTextBottom)
                }
            }
            ]);


        // add specifics depending on if it is the last level or not
        if (!lastLevel) {

            timelineConfig.push(...[
                {                                                                           // move in yes or no buttons
                    from: 0,
                    tween: {
                        targets: [this.yesButton, this.noButton],
                        y: this.positionsUI.yes.y,
                        ease: 'Cubic.easeOut',
                        duration: 500
                    }
                }
            ]);

        }
        else {
            timelineConfig.push(...[
                {                                                                           // move in ok buttons
                    from: 0,
                    tween: {
                        targets: [this.okButton],
                        y: this.positionsUI.yes.y,
                        ease: 'Cubic.easeOut',
                        duration: 500
                    }
                },
                {                                                                           // move human to the right
                    at: 0,
                    tween: {
                        targets: this.human,
                        x: this.scale.width * 0.25,
                        duration: 1000
                    }
                },                                                                          // move in robot
                {
                    from: 0,
                    tween: {
                        targets: this.robot,
                        x: this.scale.width * 0.75,
                        duration: 1000
                    }
                }
            ]);
        }

        return this.add.timeline(timelineConfig);

    }

    // get the timeline for the kickout (when loosing)
    getKickoutTimeline():Time.Timeline {

        // create the timeline configuration
        let timelineConfig: Phaser.Types.Time.TimelineEventConfig[] = [
            {
                at: 0,
                run: () => {
                    this.human.showFrame('lose', 0);
                }
            },
            {
                from: 0,
                tween: {
                    targets: this.robot,
                    x: this.scale.width * 0.75,
                    duration: 500
                },
                run: () => {
                    this.robot.showFrame('lose', 0);
                }
            },
            {
                from: 500,
                run: () => {
                    this.robot.showFrame('lose', 1);
                    this.robot.showFrame('lose', 1);
                }
            },
            {
                from: 500,
                tween: {
                    targets: this.human,
                    rotation: MathPhaser.DegToRad(360),
                    duration: 300,
                    repeat: -1
                },
                run: () => {
                    this.human.changeOriginY(0.5);
                    this.robot.showFrame('lose', 2);
                }
            },
            {
                from: 0,
                tween: {
                    targets: this.human,
                    x: this.positionsUI.humanRobot.x - this.positionsUI.startOffset.x,
                    y: this.scale.height * 0.3,
                    scale: 0,
                    duration: 1000
                }
            },
            {
                from: 1000,
                tween: {
                    targets: this.robot,
                    x: this.scale.width * 0.5,
                    duration: 300
                },
                run: () => {
                    this.robot.danceLose();
                }
            }
            ];



        return this.add.timeline(timelineConfig);


    }
}
