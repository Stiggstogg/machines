import {Scene, GameObjects, Types, Input, Time} from 'phaser';
import gameOptions from "../helper/gameOptions";
import {Position} from '../helper/types.ts';
import {GeneralButton} from '../sprites/GeneralButton.ts';

export class MainMenu extends Scene
{
    private titleText1: GameObjects.Text;
    private titleText2: GameObjects.Text;
    private titlePosition: Position;
    private playButton: GeneralButton;
    private creditsButton: GeneralButton;
    private buttonPosition: Position;
    private buttonYDistance: number;

    constructor ()
    {
        super('MainMenu');
    }

    create()
    {

        // create title texts
        this.titlePosition = {
            x: this.scale.width * 0.5,
            y: this.scale.height * 0.1
        };
        const titleStartOffset = {
            x: this.scale.width,
            y: 0
        }
        const titleYDistance = this.scale.height * 0.08;

        this.titleText1 = this.add.text(this.titlePosition.x + titleStartOffset.x, this.titlePosition.y, "MACHINE", gameOptions.gameTitleTextStyle).setOrigin(0.5);
        this.titleText2 = this.add.text(this.titlePosition.x - titleStartOffset.x, this.titlePosition.y + titleYDistance, "DISCO", gameOptions.gameTitleTextStyle).setOrigin(0.5);

        // create buttons
        this.buttonPosition = {
            x: this.scale.width * 0.5,
            y: this.scale.height * 0.30
        };
        const buttonStartOffset = {
            x: 0,
            y: this.scale.height
        }
        this.buttonYDistance = this.scale.height * 0.1;

        this.playButton = this.add.existing(new GeneralButton(this, this.buttonPosition.x, this.buttonPosition.y + buttonStartOffset.y, 'PLAY', 'play'));
        this.creditsButton = this.add.existing(new GeneralButton(this, this.buttonPosition.x, this.buttonPosition.y + this.buttonYDistance + buttonStartOffset.y, 'Credits', 'credits'));

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
                from: 0,
                tween: {
                    targets: this.creditsButton,
                    y: this.buttonPosition.y + this.buttonYDistance,
                    ease: 'Cubic.easeOut',
                    duration: 500
                }
            },
        ];

        return this.add.timeline(timelineConfig);

    }

}
