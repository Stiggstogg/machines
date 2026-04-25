// CONFIGURABLE GAME OPTIONS
// changing these values will affect gameplay

// Phaser imports
import type {Types} from 'phaser';
import {MeterParameters} from './types.ts';

type GameOptions = {
    readonly gameTitle: string;
    readonly maxLevel: number;
    readonly gameTitleColors: string[];
    readonly lightColors: number[];
    readonly spotlightColor: number;
    readonly danceKeysForButtons: string[];
    readonly meterParameters: MeterParameters;
    readonly barsPerTrack: number;
    readonly menuDanceBPM: number;
    readonly winDanceBPM: number;
    readonly loseDanceBPM: number;

    readonly gameTitleTextStyle: Types.GameObjects.Text.TextStyle;
    readonly titleTextStyle: Types.GameObjects.Text.TextStyle;
    readonly instructionTextStyle: Types.GameObjects.Text.TextStyle;
    readonly hintTextStyle: Types.GameObjects.Text.TextStyle;
    readonly smallTextStyle: Types.GameObjects.Text.TextStyle;
    readonly buttonTextStyle: Types.GameObjects.Text.TextStyle;
};

const gameOptions: GameOptions = {
    gameTitle: 'MACHINE DISCO',
    maxLevel: 3,
    gameTitleColors: [
        '#fbf236',
        '#99e550'
    ],
    lightColors: [
        0xffffff,
        0x5b6ee1,
        0xfbf236,
        0xdf7126
    ],
    spotlightColor: 0xfbf236,           // color of the spotlight when you lose
    danceKeysForButtons: [
        'dance1',
        'idle',
        'dance2'
    ],
    meterParameters: {
        maximum: 100,           // maximum value when
        wrongFactor: 0.6,       // how much the meter value increases per frame if the human dances wrongly
        correctFactor: -0.2,    // how much the meter value increases (negative -> decrease) per frame if the human dances correctly
    },
    barsPerTrack: 2,            // how many bars does each track on an album have
    menuDanceBPM: 160,           // bpm of the menu music
    winDanceBPM: 160,           // bpm of the win dance
    loseDanceBPM: 80,          // bpm of the lose dance

    gameTitleTextStyle:
        {
            fontFamily: 'Monoton',
            fontSize: '60px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 10
        },
    titleTextStyle:
        {
            fontFamily: 'Monoton',
            fontSize: '60px',
            color: '#fbf236',
            stroke: '#000000',
            strokeThickness: 4
        },
    instructionTextStyle:
        {
            fontFamily: 'Asimovian',
            fontSize: '40px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4,
            align: 'center'
        },
    hintTextStyle:
        {
            fontFamily: 'Asimovian',
            fontSize: '28px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        },
    smallTextStyle:
        {
            fontFamily: 'Asimovian',
            fontSize: '24px',
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
            strokeThickness: 4
        },
};

export default gameOptions;