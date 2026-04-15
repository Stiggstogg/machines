// CONFIGURABLE GAME OPTIONS
// changing these values will affect gameplay

// Phaser imports
import type { Types } from 'phaser';

type GameOptions = {
    readonly gameTitle: string;
    readonly dancerAnimFrameRate: number;
    readonly textStyles: ReadonlyArray<Readonly<Types.GameObjects.Text.TextStyle>>;
    readonly lightColors: number[];
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
    ]
};

export default gameOptions;