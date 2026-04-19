// CONFIGURABLE GAME OPTIONS
// changing these values will affect gameplay

// Phaser imports
import type { Types } from 'phaser';
import {MeterParameters} from './types.ts';

type GameOptions = {
    readonly gameTitle: string;
    readonly dancerAnimFrameRate: number;
    readonly textStyles: ReadonlyArray<Readonly<Types.GameObjects.Text.TextStyle>>;
    readonly lightColors: number[];
    readonly danceKeysForButtons: string[];
    readonly meterParameters: MeterParameters;
};

const gameOptions: GameOptions = {
    gameTitle: 'My Game',
    dancerAnimFrameRate: 5,
    lightColors: [
        0x000000,
        0x5b6ee1,
        0xfbf236,
        0xdf7126
    ],
    textStyles: [
        {
            fontFamily: 'Orbitron',
            fontSize: '100px',
            color: '#FFE500',
            fontStyle: 'bold'
        }
    ],
    danceKeysForButtons: [          // TODO: Add here the proper dance keys as soon as they are defined
        'idle',
        'dance',
        'dance'
    ],
    meterParameters: {
        maximum: 100,           // maximum value when
        wrongFactor: 0.6,       // how much the meter value increases per frame if the human dances wrongly
        correctFactor: -0.2,    // how much the meter value increases (negative -> decrease) per frame if the human dances correctly
    }
};

export default gameOptions;