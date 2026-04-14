// CONFIGURABLE GAME OPTIONS
// changing these values will affect gameplay

// Phaser imports
import type { Types } from 'phaser';

type GameOptions = {
    readonly gameTitle: string;
    readonly gameWidth: number;
    readonly gameHeight: number;
    readonly textStyles: ReadonlyArray<Readonly<Types.GameObjects.Text.TextStyle>>;
};

const gameOptions: GameOptions = {
    gameTitle: 'My Game',
    gameWidth: 1024,
    gameHeight: 488,
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