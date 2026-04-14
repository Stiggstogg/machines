import { Scene } from 'phaser';

import { Sponge } from '../sprites/Sponge'
import gameOptions from "../helper/gameOptions";

export class Game extends Scene
{
    private sponge: Sponge;

    constructor ()
    {
        super('Game');
    }

    create ()
    {
        // sprite
        this.sponge = this.add.existing(new Sponge(this, 100, 100));

        // Instruction / press key text
        this.add.text(gameOptions.gameWidth / 2, gameOptions.gameHeight - 46,
            'Use arrow keys or W, A, S, D to move Sponge Bob around\n' +
            'Click with the mouse on it to finish the game', {
                font: '20px Arial',
                color: '#27ff00'
            }).setOrigin(0.5);

        // Add keyboard inputs
        this.addKeys();
    }

    // Update function for the game loop.
    update(_time: number, _delta: number): void {       // remove underscore if time and delta is needed


    }

    // Add keyboard input to the scene.
    addKeys(): void {

        // up and down keys (moving the selection of the entries)
        this.input.keyboard!.addKey('Down').on('down', function(this: Game) { this.sponge.move('down') }, this);
        this.input.keyboard!.addKey('S').on('down', function(this: Game) { this.sponge.move('down') }, this);
        this.input.keyboard!.addKey('Up').on('down', function(this: Game) { this.sponge.move('up') }, this);
        this.input.keyboard!.addKey('W').on('down', function(this: Game) { this.sponge.move('up') }, this);
        this.input.keyboard!.addKey('Left').on('down', function(this: Game) { this.sponge.move('left') }, this);
        this.input.keyboard!.addKey('A').on('down', function(this: Game) { this.sponge.move('left') }, this);
        this.input.keyboard!.addKey('Right').on('down', function(this: Game) { this.sponge.move('right') }, this);
        this.input.keyboard!.addKey('D').on('down', function(this: Game) { this.sponge.move('right') }, this);

        // enter and space key (confirming a selection)
        this.input.keyboard!.addKey('Enter').on('down', function(this: Game) { this.spaceEnterKey() }, this);
        this.input.keyboard!.addKey('Space').on('down', function(this: Game) { this.spaceEnterKey() }, this);

    }

    // Action which happens when the enter or space key is pressed.
    spaceEnterKey(): void {

        console.log('Space or Enter key pressed!');

    }

}
