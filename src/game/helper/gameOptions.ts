// CONFIGURABLE GAME OPTIONS
// changing these values will affect gameplay

// Phaser imports
import type {Types} from 'phaser';
import {MeterParameters} from './types.ts';

type GameOptions = {
    readonly gameTitle: string;
    readonly lightColors: number[];
    readonly danceKeysForButtons: string[];
    readonly meterParameters: MeterParameters;
    readonly clockTextStyle: Types.GameObjects.Text.TextStyle;
    readonly instructionTextStyle: Types.GameObjects.Text.TextStyle;
    readonly hintTextStyle: Types.GameObjects.Text.TextStyle;
    readonly buttonTextStyle: Types.GameObjects.Text.TextStyle;
};

const gameOptions: GameOptions = {
    gameTitle: 'My Game',
    lightColors: [
        0x000000,
        0x5b6ee1,
        0xfbf236,
        0xdf7126
    ],
    clockTextStyle:
        {
            fontFamily: 'Bitcount',
            fontSize: '70px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        },
    instructionTextStyle:
        {
            fontFamily: 'Asimovian',
            fontSize: '40px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        },
    hintTextStyle:
        {
            fontFamily: 'Asimovian',
            fontSize: '28px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        },
    buttonTextStyle:
        {
            fontFamily: 'Asimovian',
            fontSize: '40px',
            color: '#000000',
            stroke: '#ffffff',
            strokeThickness: 4,
        },
    danceKeysForButtons: [
        'dance1',
        'idle',
        'dance2'
    ],
    meterParameters: {
        maximum: 100,           // maximum value when
        wrongFactor: 0.6,       // how much the meter value increases per frame if the human dances wrongly
        correctFactor: -0.2,    // how much the meter value increases (negative -> decrease) per frame if the human dances correctly
    }
};

export default gameOptions;