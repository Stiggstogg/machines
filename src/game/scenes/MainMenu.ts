import {Scene, GameObjects, Time} from 'phaser';
import gameOptions from "../helper/gameOptions";
import {Position} from '../helper/types.ts';
import {GeneralButton} from '../sprites/GeneralButton.ts';
import {Human} from '../sprites/Human.ts';
import {Light} from '../sprites/Light.ts';
import {createDiscoBallParticles} from '../helper/DiscoBall.ts';
import {getAudio} from '../helper/GetAudio.ts';
import {confettiParticles, finalConfettiParticles} from '../helper/Confetti.ts';

export class MainMenu extends Scene
{
    private titleText1: GameObjects.Text;
    private titleText2: GameObjects.Text;
    private titlePosition: Position;
    private titleStartOffset: Position;
    private playButton: GeneralButton;
    private creditsButton: GeneralButton;
    private buttonPosition: Position;
    private buttonYDistance: number;
    private buttonStartOffset: Position;
    private human: Human;

    constructor ()
    {
        super('MainMenu');
    }

    create()
    {

        // get and play the menu music (if it is not already playing)
        const menuMusic = getAudio(this, 'menu');

        if (!menuMusic.isPlaying) {
            menuMusic.play({volume: 1, loop: true});        // set its volume to 1, as it might have been muted before
        }

        // add disco ball particle emitter
        createDiscoBallParticles(this);

        // add floor
        const floor = this.add.sprite(0, this.scale.height,'floor');
        floor.setOrigin(0, 1);

        // add human
        this.human = this.add.existing(new Human(this, this.scale.width * 0.5, this.scale.height * 0.9, [], gameOptions.menuDanceBPM));
        this.human.dance('menu');

        // add holder and lights
        const holderXPosition = 0.1;    // holder position from nearest edge
        const holderYPosition = 0.35;    // holder position
        const holderYOffset = -0.05;     // the right holder is a bit higher up compared to the other
        const holderMountPosition = {x: 16, y: 52};     // position where on the holder the light is mounted, the origin of this image will be set to this coordinate

        const leftHolder = this.add.image(this.scale.width * holderXPosition, this.scale.height * holderYPosition, 'holder');
        leftHolder.setOrigin(holderMountPosition.x / leftHolder.displayWidth, holderMountPosition.y / leftHolder.displayHeight);
        const rightHolder = this.add.image(this.scale.width * (1 - holderXPosition), this.scale.height * (holderYPosition + holderYOffset),'holder');
        rightHolder.setFlipX(true);
        rightHolder.setOrigin(1 - holderMountPosition.x / leftHolder.displayWidth, holderMountPosition.y / leftHolder.displayHeight);

        const lightLeft = this.add.existing(new Light(this, leftHolder.x, leftHolder.y, true, gameOptions.menuDanceBPM));
        const lightRight = this.add.existing(new Light(this, rightHolder.x, rightHolder.y, false, gameOptions.menuDanceBPM));

        lightLeft.color(0);
        lightRight.color(1);

        // create title texts
        this.titlePosition = {
            x: this.scale.width * 0.5,
            y: this.scale.height * 0.1
        };
        this.titleStartOffset = {
            x: this.scale.width,
            y: 0
        }
        const titleYDistance = this.scale.height * 0.08;

        this.titleText1 = this.add.text(this.titlePosition.x + this.titleStartOffset.x, this.titlePosition.y, "MACHINE", gameOptions.gameTitleTextStyle).setOrigin(0.5);
        this.titleText2 = this.add.text(this.titlePosition.x - this.titleStartOffset.x, this.titlePosition.y + titleYDistance, "DISCO", gameOptions.gameTitleTextStyle).setOrigin(0.5);
        this.titleText1.setColor(gameOptions.gameTitleColors[0]);
        this.titleText2.setColor(gameOptions.gameTitleColors[1]);

        let titleColorCounter = 1;

        this.time.addEvent({
            startAt: 0,
            delay: 1 / (gameOptions.menuDanceBPM / 60) * 4 * 1000,
            loop: true,
            callback: () => {

                this.titleText1.setColor(gameOptions.gameTitleColors[titleColorCounter]);

                if (titleColorCounter == 1) {
                    titleColorCounter = 0;
                } else {
                    titleColorCounter = 1
                }

                this.titleText2.setColor(gameOptions.gameTitleColors[titleColorCounter]);

            }
        });

        // create buttons
        this.buttonPosition = {
            x: this.scale.width * 0.5,
            y: this.scale.height * 0.30
        };
        this.buttonStartOffset = {
            x: 0,
            y: this.scale.height
        }
        this.buttonYDistance = this.scale.height * 0.1;

        this.playButton = this.add.existing(new GeneralButton(this, this.buttonPosition.x, this.buttonPosition.y + this.buttonStartOffset.y, 'PLAY', 'play'));
        this.creditsButton = this.add.existing(new GeneralButton(this, this.buttonPosition.x, this.buttonPosition.y + this.buttonYDistance + this.buttonStartOffset.y, 'Credits', 'credits'));

        // add event listeners for the buttons
        this.events.once('click-play', () => {

            this.disableAllButtons();

            this.getOutroTimeline().play();

            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.nextScene('Intro');
            });

        });

        this.events.once('click-credits', () => {

            this.disableAllButtons();

            this.getOutroTimeline().play();

            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.nextScene('Credits');
            });

        });

        // get timeline for intro and play it
        this.getIntroTimeline().play();

    }

    // get the timeline for the intro animations
    getIntroTimeline():Time.Timeline {

        // create the timeline configuration
        let timelineConfig: Phaser.Types.Time.TimelineEventConfig[] = [
            {
                at: 0,
                run: () => {
                    this.cameras.main.fadeIn(500);
                }
            },
            {
                from: 500,
                tween: {
                    targets: [this.titleText1, this.titleText2],
                    x: this.titlePosition.x,
                    ease: 'Back.easeOut',
                    duration: 700
                }
            },
            {
                from: 500,
                tween: {
                    targets: this.playButton,
                    y: this.buttonPosition.y,
                    ease: 'Cubic.easeOut',
                    duration: 500
                }
            },
            {
                from: 100,
                tween: {
                    targets: this.creditsButton,
                    y: this.buttonPosition.y + this.buttonYDistance,
                    ease: 'Cubic.easeOut',
                    duration: 500
                }
            }
        ];

        return this.add.timeline(timelineConfig);

    }

    // get the timeline for the outro animations
    getOutroTimeline():Time.Timeline {

        // create the timeline configuration
        let timelineConfig: Phaser.Types.Time.TimelineEventConfig[] = [
            {
                at: 100,
                tween: {
                    targets: this.creditsButton,
                    y: this.buttonPosition.y + this.buttonYDistance + this.buttonStartOffset.y,
                    ease: 'Cubic.easeOut',
                    duration: 500
                }
            },
            {
                from: 100,
                tween: {
                    targets: this.playButton,
                    y: this.buttonPosition.y + this.buttonStartOffset.y,
                    ease: 'Cubic.easeOut',
                    duration: 500
                }
            },
            {
                from: 100,
                tween: {
                    targets: this.titleText1,
                    x: this.titlePosition.x + this.titleStartOffset.x,
                    ease: 'Cubic.easeIn',
                    duration: 500
                }
            },
            {
                from: 0,
                tween: {
                    targets: this.titleText2,
                    x: this.titlePosition.x - this.titleStartOffset.x,
                    ease: 'Cubic.easeIn',
                    duration: 500
                }
            },
            {
                at: 0,
                run: () => {
                    this.cameras.main.fadeOut(500);
                }
            },
        ];

        return this.add.timeline(timelineConfig);

    }

    // disable all buttons (usually when one of the buttons ins pressed)
    disableAllButtons() {

        this.playButton.disableInteractive();
        this.creditsButton.disableInteractive();

    }

    // go to the next scene
    nextScene(sceneKey: string) {

        // turn off all events
        this.events.off('click-play');
        this.events.off('click-credits');

        // go to the next scene
        this.scene.start(sceneKey);

    }


}
