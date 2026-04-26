import {Scene, GameObjects, Time} from 'phaser';
import gameOptions from "../helper/gameOptions";
import {Position} from '../helper/types.ts';
import {GeneralButton} from '../sprites/GeneralButton.ts';
import {Light} from '../sprites/Light.ts';
import {createDiscoBallParticles} from '../helper/DiscoBall.ts';

export class Credits extends Scene
{
    private titleText: GameObjects.Text;
    private titlePosition: Position;
    private titleStartOffset: Position;
    private creditsTitles: GameObjects.Text[];
    private creditsDescriptions: GameObjects.Text[];
    private backButton: GeneralButton;
    private buttonPosition: Position;
    private buttonStartOffset: Position;

    constructor ()
    {
        super('Credits');
    }

    create()
    {

        // add disco ball particle emitter
        createDiscoBallParticles(this);

        // add floor
        const floor = this.add.sprite(0, this.scale.height * 0.8,'floor');
        floor.setOrigin(0, 0);

        // add credits text
        const creditsTextGapY = this.scale.height * 0.02;

        const creditsTitlesTexts = [
            'Special thanks to my support and inspiration at home!\n' +
            'Thanks to my play testers.',
            'Code:',
            'Graphics:',
            'Music:',
            'Sound effects:',
            'Framework:',
            'Tools:'
        ];

        const creditsDescriptionsTexts = [
            '',
            'Home made typescript spaghetti code',
            'Hand-drawn by me',
            'Original compositions played on my synthesizers',
            'Played on my synthesizers',
            'Phaser 4',
            'vite.js, Webstorm, Aseprite and Reaper'
        ]

        this.creditsTitles = [];
        this.creditsDescriptions = [];

        let positionY = this.scale.height * 0.22;

        for (let i = 0; i < creditsTitlesTexts.length; i++) {

            if (i > 0) {
                let lastTitle = this.creditsTitles[i-1];
                let lastDescription = this.creditsDescriptions[i-1];
                positionY = lastTitle.y + Math.max(lastTitle.displayHeight, lastDescription.displayHeight) + creditsTextGapY;
            }

            let titleText = this.add.text(this.scale.width * 0.02, 0, creditsTitlesTexts[i], gameOptions.smallTextStyle).setOrigin(0, 0);
            let descriptionText = this.add.text(this.scale.width * 0.37, 0, creditsDescriptionsTexts[i], gameOptions.smallTextStyle).setOrigin(0, 0);
            titleText.setWordWrapWidth(this.scale.width * 0.96).setAlpha(0).setY(positionY);
            descriptionText.setWordWrapWidth(this.scale.width * 0.53).setAlpha(0).setY(positionY);

            this.creditsTitles.push(titleText);
            this.creditsDescriptions.push(descriptionText);

        }

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

        this.titleText = this.add.text(this.titlePosition.x + this.titleStartOffset.x, this.titlePosition.y, "CREDITS", gameOptions.titleTextStyle).setOrigin(0.5);

        // create buttons
        this.buttonPosition = {
            x: this.scale.width * 0.5,
            y: this.scale.height * 0.94
        };
        this.buttonStartOffset = {
            x: 0,
            y: 0.2 * this.scale.height
        }

        this.backButton = this.add.existing(new GeneralButton(this, this.buttonPosition.x, this.buttonPosition.y + this.buttonStartOffset.y, 'Back', 'back'));

        // add event listeners for the button
        this.events.once('click-back', () => {

            this.backButton.disableInteractive();

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
                    targets: [...this.creditsTitles, ...this.creditsDescriptions],
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
                    targets: [...this.creditsTitles, ...this.creditsDescriptions],
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
                at: 400,
                run: () => {
                    this.cameras.main.fadeOut(500);
                }
            },
        ];

        return this.add.timeline(timelineConfig);

    }


}
