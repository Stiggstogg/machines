import {Pattern, Song} from './types.ts';
import {Light} from '../sprites/Light.ts';
import ProgressBar from '../sprites/ProgressBar.ts';
import gameOptions from './gameOptions.ts';

export class MusicLightPlayer {

    private readonly scene: Phaser.Scene
    private song: Song                          // song which is currently playing
    private sectionTracker: number              // tracks which section should be played
    private currentAudio: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound
    private readonly lights: Light[];
    private currentPattern: Pattern;
    private progressBar: ProgressBar;
    private bpm: number;
    private isHumanSong: boolean;
    private loop: number;                       // tells how many loops of this song were already played

    // Constructor
    constructor(scene: Phaser.Scene, lights: Light[], progressBar: ProgressBar, bpm: number) {

        this.scene = scene;
        this.sectionTracker = 0;
        this.lights = lights;
        this.progressBar = progressBar;
        this.bpm = bpm;
        this.isHumanSong = false;
        this.loop = 0;

    }

    // load a new song
    loadSong(songKey: string, isHumanSong: boolean) {

        // set the song type
        this.isHumanSong = isHumanSong;

        // get the raw json data for the song
        this.song = this.scene.cache.json.get(songKey).song;

        // set the tracker back to the beginning
        this.sectionTracker = 0;

        // reset the loop
        this.loop = -1;         // starts at -1, which means that nothing at all was played yet

    }

    // play a full song
    playSong() {

        // emit an event to the scene, so that the scene knows when a new section starts
        this.scene.events.emit('newSongSection');

        // if this is a new song or a new loop of a song reset the progress bar and increase the loop counter
        if (this.sectionTracker == 0) {
            this.progressBar.start(this.song.length * gameOptions.barsPerTrack * 4 / (this.bpm / 60));   // song length = // number of sections * number of bars * beats per bar / beats per second

            // increase the loop counter
            this.loop++;

        }

        // stop the current audio in case it exists
        this.currentAudio?.stop();

        // check if this would be the second playthrough of the human song. If yes, stop the player.
        if (this.isHumanSong && this.loop > 0) {

            // emit an event that can be used to check if the game is finished (in the DANCE state)
            this.scene.events.emit('humanSongOver');

            return;

        }

        // set the current pattern
        this.setPattern();

        // set the light colors
        for (let i = 0; i < this.lights.length; i++) {
            this.lights[i].color(Number(this.currentPattern.lightColors[i]));
        }

        // create the audio object
        this.currentAudio = this.scene.sound.addAudioSprite(this.currentPattern.albumName);

        this.currentAudio.play(this.currentPattern.trackName);

        // advance the section tracker to the next track (go to the next section or start from beginning)
        if (this.sectionTracker < this.song.length -1) {
            this.sectionTracker++;
        }
        else {
            this.sectionTracker = 0;
        }

        // as soon as the current section is complete, start the next one
        this.currentAudio.once('complete', () => {
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

    // immediately stop the current song and prevent that a new one is started
    stopSong() {

        // remove the event listener to start the next section
        this.currentAudio.off('complete');

        // turn of the current audio
        this.currentAudio.stop();

    }
    // get current pattern
    getCurrentPattern(): Pattern {
        return this.currentPattern;
    }

}
