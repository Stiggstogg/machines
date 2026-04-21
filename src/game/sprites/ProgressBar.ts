import {GameObjects, Math as MathPhaser} from 'phaser';

// this is the song progress bar
export default class ProgressBar extends GameObjects.Container {

    private readonly progressCircle: GameObjects.Arc;
    private readonly progressLine: GameObjects.Rectangle;
    private readonly lineLength: number;
    private songLength: number;
    private songStartTime: number

    // Constructor
    constructor(scene: Phaser.Scene, x: number, y: number) {

        super(scene, x, y);

        this.songLength = 0;
        this.songStartTime = 0;

        // create white line
        this.lineLength = this.scene.scale.width * 0.92;
        const lineY = 0;
        const lineWidth = 8;
        const lineColor = 0xffffff;
        const elapsedlineColor = 0xd95763;

        const whiteLine = this.scene.add.rectangle(0, lineY, this.lineLength, lineWidth, lineColor);    // use a rectangle as a line, as it is easier to work with these objects

        // create circles at the end of the lines to round it up
        const lineCircle1 = this.scene.add.circle(-this.lineLength / 2, 0, lineWidth / 2, elapsedlineColor);
        const lineCircle2 = this.scene.add.circle(this.lineLength / 2, 0, lineWidth / 2, lineColor);

        // create progress circle
        this.progressCircle = this.scene.add.circle(0, 0, lineWidth, elapsedlineColor);

        // create progress line (full scale) and then scale it down
        this.progressLine = this.scene.add.rectangle(-this.lineLength / 2, lineY, this.lineLength, lineWidth, elapsedlineColor).setOrigin(0, 0.5);
        this.progressLine.setScale(0, 1);

        // add both images to the container
        this.add([whiteLine, lineCircle1, lineCircle2, this.progressLine, this.progressCircle]);

    }

    // start progress bar
    start(songLength: number) {

        // set the song length
        this.songLength = songLength * 1000;

        // reset the song start time
        this.songStartTime = Date.now();

    }

    update() {

        // scale the progress line and move the progress circle according to the current progress
        if (this.songStartTime === 0) {
            return;
        }

        const elapsed = Date.now() - this.songStartTime;            // calculate the elapsed time since the song started
        const progress = MathPhaser.Clamp(elapsed / this.songLength, 0, 1);        // calculate the progress

        this.progressLine.setScale(progress, 1);                        // scale the progress line
        this.progressCircle.x = -this.lineLength / 2 + this.lineLength * progress;      // move the progress circle

    }
}