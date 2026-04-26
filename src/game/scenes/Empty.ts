import {Scene, Math as MathPhaser} from 'phaser';
import gameOptions from "../helper/gameOptions";
import {Light} from '../sprites/Light.ts';
import {createDiscoBallParticles} from '../helper/DiscoBall.ts';

// this is an empty scene which is used for screenshots on itch.io
export class Empty extends Scene
{

    constructor ()
    {
        super('Empty');
    }

    create() {

        // add disco ball particle emitter
        createDiscoBallParticles(this);

        // add floor
        const floor = this.add.sprite(0, this.scale.height, 'floor');
        floor.setOrigin(0, 1);

        // add holder and lights
        const holderXPosition = 0.1;    // holder position from nearest edge
        const holderYPosition = 0.35;    // holder position
        const holderYOffset = -0.05;     // the right holder is a bit higher up compared to the other
        const holderMountPosition = {x: 16, y: 52};     // position where on the holder the light is mounted, the origin of this image will be set to this coordinate

        const leftHolder = this.add.image(this.scale.width * holderXPosition, this.scale.height * holderYPosition, 'holder');
        leftHolder.setOrigin(holderMountPosition.x / leftHolder.displayWidth, holderMountPosition.y / leftHolder.displayHeight);
        const rightHolder = this.add.image(this.scale.width * (1 - holderXPosition), this.scale.height * (holderYPosition + holderYOffset), 'holder');
        rightHolder.setFlipX(true);
        rightHolder.setOrigin(1 - holderMountPosition.x / leftHolder.displayWidth, holderMountPosition.y / leftHolder.displayHeight);

        const lightLeft = this.add.existing(new Light(this, leftHolder.x, leftHolder.y, true, gameOptions.menuDanceBPM));
        const lightRight = this.add.existing(new Light(this, rightHolder.x, rightHolder.y, false, gameOptions.menuDanceBPM));

        lightLeft.color(0);
        lightRight.color(1);

        lightLeft.rotateLightStop();
        lightRight.rotateLightStop();

        lightLeft.setRotation(MathPhaser.DegToRad(40));
        lightRight.setRotation((MathPhaser.DegToRad(-50)));

    }


}
