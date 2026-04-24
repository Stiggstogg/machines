import {Scene, GameObjects, Time} from 'phaser';
import gameOptions from "../helper/gameOptions";
import {Position} from '../helper/types.ts';
import {GeneralButton} from '../sprites/GeneralButton.ts';
import {Human} from '../sprites/Human.ts';

export class Intro extends Scene
{
    private titleText: GameObjects.Text;
    private titlePosition: Position;
    private titleStartOffset: Position;
    private introText: GameObjects.Text;
    private goButton: GeneralButton;
    private buttonPosition: Position;
    private buttonStartOffset: Position;
    private human: Human;
    private mask: GameObjects.Sprite;

    constructor ()
    {
        super('Intro');
    }

    create()
    {

        // add floor
        const floor = this.add.sprite(0, this.scale.height * 0.8,'floor');
        floor.setOrigin(0, 0);

        // add human
        this.human = this.add.existing(new Human(this, this.scale.width * 0.5, this.scale.height * 0.9, [], gameOptions.menuDanceBPM));
        this.human.showFrame('dress', 0);

        // add mask
        this.mask = this.add.sprite(this.human.x + 5, this.human.y - this.scale.height, 'mask');
        this.mask.setOrigin(0.5, 1);

        // add intro text
        const creditsTextY = this.scale.height * 0.150;

        this.introText = this.add.text(this.scale.width * 0.05, creditsTextY, '', gameOptions.smallTextStyle).setOrigin(0, 0);
        this.introText.setWordWrapWidth(this.scale.width * 0.9);

        this.introText.setText(
            'The year is 2036. The machines rule the world.\n' +
            'Every night, they party at the robot-only MACHINE DISCO.\n' +
            'You are an old disco machine who desperately wants in. So tonight, you throw on a questionable robot disguise and sneak through the door...\n' +
            'Robots have very specific dance patterns, and they do not appreciate freestyle!\n' +
            'OBSERVE the robots, learn their pattern, then DANCE LIKE A ROBOT.\n' +
            'Mess up too often, and you’ll be caught!\n\n'  +
            'Can you get through all ' + gameOptions.maxLevel + ' songs?'
        );

        this.introText.setAlpha(0);

        // create title texts
        this.titlePosition = {
            x: this.scale.width * 0.5,
            y: this.scale.height * 0.1
        };
        this.titleStartOffset = {
            x: this.scale.width,
            y: 0
        }

        this.titleText = this.add.text(this.titlePosition.x + this.titleStartOffset.x, this.titlePosition.y, "INTRO", gameOptions.gameTitleTextStyle).setOrigin(0.5);

        // create buttons
        this.buttonPosition = {
            x: this.scale.width * 0.5,
            y: this.scale.height * 0.94
        };
        this.buttonStartOffset = {
            x: 0,
            y: this.scale.height * 0.2
        }

        this.goButton = this.add.existing(new GeneralButton(this, this.buttonPosition.x, this.buttonPosition.y + this.buttonStartOffset.y, 'Let\'s GO!', 'go'));

        // add event listeners for the button
        this.events.once('click-go', () => {

            this.goButton.disableInteractive();     // disable the button

            this.getOutroTimeline().play();

            this.cameras.main.once('camerafadeoutcomplete', () => {

                // stop all audio
                this.sound.stopAll();

                this.scene.start('Game', {level: 1});
            });

        })

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
                    targets: this.titleText,
                    x: this.titlePosition.x,
                    ease: 'Back.easeOut',
                    duration: 700
                }
            },
            {
                from: 500,
                tween: {
                    targets: this.goButton,
                    y: this.buttonPosition.y,
                    ease: 'Cubic.easeOut',
                    duration: 500
                }
            },
            {
                from: 0,
                tween: {
                    targets: this.introText,
                    alpha: 1,
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
                at: 0,
                tween: {
                    targets: this.goButton,
                    y: this.buttonPosition.y + this.buttonStartOffset.y,
                    ease: 'Cubic.easeOut',
                    duration: 500
                }
            },
            {
                from: 0,
                tween: {
                    targets: this.introText,
                    alpha: 0,
                    duration: 500
                }
            },
            {
                from: 1000,
                run: () => {
                    this.human.showFrame('dress', 1);
                }
            },
            {
                from: 1000,
                run: () => {
                    this.human.showFrame('dress', 2);
                }
            },
            {
                from: 1000,
                tween: {
                    targets: this.mask,
                    y: this.human.y - 354,
                    ease: 'Cubic.easeOut',
                    duration: 1000
                }
            },
            {
                from: 1000,
                run: () => {
                    this.mask.setVisible(false);
                    this.human.showFrame('dress', 3);
                }
            },
            {
                from: 100,
                tween: {
                    targets: this.titleText,
                    x: this.titlePosition.x + this.titleStartOffset.x,
                    ease: 'Cubic.easeIn',
                    duration: 500
                }
            },
            {
                from: 500,
                run: () => {
                    this.cameras.main.fadeOut(500);
                }
            },
            {                                                           // fade out music
                from: 0,
                tween: {
                    targets: this.sound.get('menu'),
                    volume: 0,
                    duration: 500
                }
            }
        ];

        return this.add.timeline(timelineConfig);

    }


}
