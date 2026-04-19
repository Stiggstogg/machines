// Phaser import
import { AUTO, Game, Scale } from 'phaser';

// scene imports
import { Boot } from './scenes/Boot';
import { Preloader } from './scenes/Preloader';
import { MainMenu } from './scenes/MainMenu';
import {Game as MainGame} from './scenes/Game';
import { GameOver } from './scenes/GameOver';

// other imports
import gameOptions from './helper/gameOptions';

// define here game width and game height
const gameWidth = 488;
const gameHeight = 1024;

//  Find out more information about the Game Config at:
//  https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Phaser.Types.Core.GameConfig = {
    title: gameOptions.gameTitle,
    type: AUTO,
    width: gameWidth,
    height: gameHeight,
    parent: 'game-container',
    backgroundColor: '#3f3f74',
    scale: {
        mode: Scale.FIT,
        autoCenter: Scale.CENTER_BOTH,
        max: {
            width: gameWidth * 1.5,
            height: gameHeight * 1.5
        }
    },
    scene: [
        Boot,
        Preloader,
        MainMenu,
        MainGame,
        GameOver
    ]
};

const StartGame = (parent: string) => {

    return new Game({ ...config, parent });

}

export default StartGame;
