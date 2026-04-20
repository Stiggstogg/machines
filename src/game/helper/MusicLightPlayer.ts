import {Pattern, Song} from './types.ts';
import {Light} from '../sprites/Light.ts';

export class MusicLightPlayer {

    private readonly scene: Phaser.Scene
    private song: Song
    private sectionTracker: number              // tracks which section should be played
    private currentAudio: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound
    private readonly lights: Light[];
    private currentPattern: Pattern;

    // Constructor
    constructor(scene: Phaser.Scene, lights: Light[]) {

        this.scene = scene;
        this.sectionTracker = 0;
        this.lights = lights;

    }

    // load a new song
    loadSong(songKey: string) {

        // get the raw json data for the song
        this.song = this.scene.cache.json.get(songKey).song;

        // set the tracker back to the beginning
        this.sectionTracker = 0;

    }

    // play a full song
    playSong() {

        // emit an event to the scene, so that the scene knows when a new section starts
        this.scene.events.emit('newSongSection');

        // stop the current audio in case it exists
        this.currentAudio?.stop();

        // set the current pattern
        this.setPattern();

        // set the light colors
        for (let i = 0; i < this.lights.length; i++) {
            this.lights[i].color(Number(this.currentPattern.lightColors[i]));
        }

        // create the audio object
        this.currentAudio = this.scene.sound.addAudioSprite(this.currentPattern.albumName);

        this.currentAudio.play(this.currentPattern.trackName);

        this.currentAudio.once('complete', () => {

            if (this.sectionTracker < this.song.length -1) {       // go to the next section or start from beginning
                this.sectionTracker++;
            }
            else {
                this.sectionTracker = 0;
            }

            this.playSong();
        })

    }

    // set the current pattern
    setPattern() {

        // set the names and initialize the other properties
        this.currentPattern = {
            albumName: this.song[this.sectionTracker].albumName,
            trackName: this.song[this.sectionTracker].trackName,
            lightColors: [],
            lightsInSync: false
        }

        // set the light color numbers and check if the lights are in sync
        let inSync = true;

        for (let i = 0; i < this.lights.length; i++) {
            this.currentPattern.lightColors.push(this.song[this.sectionTracker].lightColors[i]);

            if (i > 0 && inSync && this.currentPattern.lightColors[i] !== this.currentPattern.lightColors[i-1]) {
                inSync = false;
            }

        }

        this.currentPattern.lightsInSync = inSync;
        
    }

    // get current pattern
    getCurrentPattern(): Pattern {
        return this.currentPattern;
    }

}