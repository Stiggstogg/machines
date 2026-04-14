import { GameObjects, Input, Scene } from 'phaser';

// Sprite class
export class Sponge extends GameObjects.Sprite {

    private readonly speed: number;

    // Constructor
    constructor(scene: Scene, x: number, y: number) {

        super(scene, x, y, 'sponge');
        this.setInteractive();

        this.on('pointerdown', this.click);

        this.speed = 10;     // movement speed of the sprite

    }

    // Action which should happen when the sprite is clicked
    click(_pointer: Input.Pointer): void {               // remove underscore if pointer is used
        console.log('Spongebob Squarepants was clicked!');
        this.scene.scene.start('GameOver');
    }

    // Move the sprite
    move(direction: 'up' | 'down' | 'left' | 'right'): void {

        switch(direction) {
            case 'up':                   // movement up
                this.y -= this.speed;
                break;
            case 'down':                 // movement down
                this.y += this.speed;
                break;
            case 'left':                 // movement left
                this.x -= this.speed;
                break;
            default:                     // movement right (by default)
                this.x += this.speed;
                break;
        }

    }

}
