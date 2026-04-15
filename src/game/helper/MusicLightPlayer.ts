import {PatternCombination, Song} from './types.ts';
import {Light} from '../sprites/Light.ts';

export class MusicLightPlayer {

    private readonly scene: Phaser.Scene
    private song: Song
    private patternTracker: number              // tracks which pattern should be played
    private currentAudio: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound
    private readonly lights: Light[];
    private currentPatternCombination: PatternCombination;

    // Constructor
    constructor(scene: Phaser.Scene, lights: Light[]) {

        this.scene = scene;
        this.patternTracker = 0;
        this.lights = lights;

    }

    // load a new song
    loadSong(songKey: string) {

        // stop the current audio in case it exists
        this.currentAudio?.stop();

        // get the raw json data for the song
        this.song = this.scene.cache.json.get(songKey).song;

        // set the tracker back to the beginning
        this.patternTracker = 0;

    }

    // play a full song
    playSong() {

        // stop the current audio in case it exists
        this.currentAudio?.stop();

        // set the current pattern and its combinations
        this.setPatternCombination();

        // set the light colors
        for (let i = 0; i < this.lights.length; i++) {
            this.lights[i].color(Number(this.currentPatternCombination.lightColors[i]));
        }

        // create the audio object
        this.currentAudio = this.scene.sound.addAudioSprite(this.currentPatternCombination.patternKey);

        this.currentAudio.play(this.currentPatternCombination.markerName);

        this.currentAudio.once('complete', () => {

            if (this.patternTracker < this.song.length -1) {       // continue with the next pattern when the song is not finished yet
                this.patternTracker++;
                this.playSong();
            }
            else {
                this.patternTracker = 0;
            }
        })

    }

    // set the current pattern and combinations
    setPatternCombination() {

        // set the pattern and marker keys
        this.currentPatternCombination = {
            patternKey: this.song[this.patternTracker].patternKey,
            markerName: this.song[this.patternTracker].markerName,
            lightColors: [],
            lightsInSync: false
        }

        // set the light color numbers
        let inSync = true;

        for (let i = 0; i < this.lights.length; i++) {
            this.currentPatternCombination.lightColors.push(this.song[this.patternTracker].lightColors[i]);

            if (i > 0 && this.currentPatternCombination.lightColors[i] !== this.currentPatternCombination.lightColors[i-1]) {
                inSync = false;
            }

        }
        
    }

    // get current pattern and combinations
    getCurrentPatternCombination(): PatternCombination {
        return this.currentPatternCombination;
    }

}