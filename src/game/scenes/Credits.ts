import {Scene, GameObjects, Time} from 'phaser';
import gameOptions from "../helper/gameOptions";
import {Position} from '../helper/types.ts';
import {GeneralButton} from '../sprites/GeneralButton.ts';
import {Light} from '../sprites/Light.ts';

export class Credits extends Scene
{
    private titleText: GameObjects.Text;
    private titlePosition: Position;
    private titleStartOffset: Position;
    private creditsTitles: GameObjects.Text;
    private creditsTexts: GameObjects.Text;
    private backButton: GeneralButton;
    private buttonPosition: Position;
    private buttonStartOffset: Position;

    constructor ()
    {
        super('Credits');
    }

    create()
    {

        // add floor
        const floor = this.add.sprite(0, this.scale.height * 0.8,'floor');
        floor.setOrigin(0, 0);

        // add credits text
        const creditsTextY = this.scale.height * 0.30;

        this.creditsTitles = this.add.text(this.scale.width * 0.05, creditsTextY, '', gameOptions.smallTextStyle).setOrigin(0, 0);
        this.creditsTexts = this.add.text(this.scale.width * 0.35, creditsTextY, '', gameOptions.smallTextStyle).setOrigin(0, 0);

        this.creditsTitles.setText(
            'Special thanks to my support and inspiration\nat home!\n' +
            'Thanks to my play testers.\n\n' +
            'Code:\n\n\n' +
            'Graphics:\n\n' +
            'Music:\n\n\n' +
            'Sound effects:\n\n' +
            'Framework:\n\n' +
            'Tools:\n\n\n'
        );

        this.creditsTexts.setText(
            '\n\n' +
            '\n\n' +
            'Home made typescript spaghetti\ncode\n\n' +
            'Hand drawn by me\n\n' +
            'Original compositions played on\nmy instruments\n\n' +
            'Played on my instruments\n\n' +
            'Phaser 4\n\n' +
            'vite.js, Webstorm, Aseprite\nand Reaper\n'
        );

        this.creditsTitles.setAlpha(0);
        this.creditsTexts.setAlpha(0);

        // add holder and lights
        const holderXPosition = 0.1;    // holder position from nearest edge
        const holderYPosition = 0.15;    // holder position
        const holderMountPosition = {x: 16, y: 52};     // position where on the holder the light is mounted, the origin of this image will be set to this coordinate

        const leftHolder = this.add.image(this.scale.width * holderXPosition, this.scale.height * holderYPosition, 'holder');
        leftHolder.setOrigin(holderMountPosition.x / leftHolder.displayWidth, holderMountPosition.y / leftHolder.displayHeight);
        const rightHolder = this.add.image(this.scale.width * (1 - holderXPosition), this.scale.height * (holderYPosition),'holder');
        rightHolder.setFlipX(true);
        rightHolder.setOrigin(1 - holderMountPosition.x / leftHolder.displayWidth, holderMountPosition.y / leftHolder.displayHeight);

        const lightLeft = this.add.existing(new Light(this, leftHolder.x, leftHolder.y, true, gameOptions.menuDanceBPM));
        const lightRight = this.add.existing(new Light(this, rightHolder.x, rightHolder.y, false, gameOptions.menuDanceBPM));

        lightLeft.color(2);
        lightRight.color(3);

        // create title texts
        this.titlePosition = {
            x: this.scale.width * 0.5,
            y: this.scale.height * 0.1
        };
        this.titleStartOffset = {
            x: this.scale.width,
            y: 0
        }

        this.titleText = this.add.text(this.titlePosition.x + this.titleStartOffset.x, this.titlePosition.y, "CREDITS", gameOptions.gameTitleTextStyle).setOrigin(0.5);

        // create buttons
        this.buttonPosition = {
            x: this.scale.width * 0.5,
            y: this.scale.height * 0.94
        };
        this.buttonStartOffset = {
            x: 0,
            y: this.scale.height
        }

        this.backButton = this.add.existing(new GeneralButton(this, this.buttonPosition.x, this.buttonPosition.y + this.buttonStartOffset.y, 'Back', 'back'));

        // add event listeners for the button
        this.events.once('click-back', () => {

            this.getOutroTimeline().play();

            this.cameras.main.once('camerafadeoutcomplete', () => {
               this.scene.start('MainMenu');
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
                    targets: this.backButton,
                    y: this.buttonPosition.y,
                    ease: 'Cubic.easeOut',
                    duration: 500
                }
            },
            {
                from: 0,
                tween: {
                    targets: [this.creditsTexts, this.creditsTitles],
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
                    targets: this.backButton,
                    y: this.buttonPosition.y + this.buttonStartOffset.y,
                    ease: 'Cubic.easeOut',
                    duration: 500
                }
            },
            {
                from: 0,
                tween: {
                    targets: [this.creditsTexts, this.creditsTitles],
                    alpha: 0,
                    duration: 500
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
                at: 0,
                run: () => {
                    this.cameras.main.fadeOut(500);
                }
            },
        ];

        return this.add.timeline(timelineConfig);

    }


}
