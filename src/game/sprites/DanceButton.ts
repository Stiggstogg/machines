import { GameObjects, Scene, Tweens, Filters } from 'phaser';
import gameOptions from '../helper/gameOptions.ts';
import {getAudioSprite} from '../helper/GetAudio.ts';

// Button class
export class DanceButton extends GameObjects.Sprite {

    private readonly danceKey: string
    private readonly glowTween: Tweens.Tween
    private readonly glow: Filters.Glow

    // Constructor
    constructor(scene: Scene, x: number, y: number, buttonNr: number, bpm: number) {

        super(scene, x, y, 'roundButtons', buttonNr);
        this.danceKey = gameOptions.danceKeysForButtons[buttonNr];
        this.setInteractive();

        this.on('pointerdown', () => {
            this.buttonClicked();
        });

        // add glow and tween
        this.enableFilters();
        this.glow = this.filters!.internal.addGlow();
        this.glow.setPaddingOverride(null);                 // allow the filter to expand its padding (so it can be bigger than the image size

        this.glow.outerStrength = 0;

        this.glowTween = this.scene.tweens.add({                // glow tween
            targets: this.glow,
            outerStrength: 20,
            yoyo: true,
            loop: -1,
            ease: 'sine.inout',
            duration: 1 / (bpm / 60 * 2) * 1000,
            paused: true
        });

        this.stopGlow();

    }

    private buttonClicked() {

        getAudioSprite(this.scene, 'soundeffects').play("click");

        this.scene.events.emit('click-dance', this.danceKey);

    }

    public startGlow() {

        if (!this.glowTween.isPlaying()) {
            this.glowTween.play();
        }

    }

    public stopGlow() {

        if (this.glowTween.isPlaying()) {
            this.glowTween.pause();
            this.glow.outerStrength = 0;    // remove glow completely
        }

    }

}
