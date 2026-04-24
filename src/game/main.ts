// Phaser import
import { AUTO, Game, Scale } from 'phaser';

// scene imports
import { Boot } from './scenes/Boot';
import { Preloader } from './scenes/Preloader';
import { MainMenu } from './scenes/MainMenu';
import {Credits} from './scenes/Credits.ts';
import {Intro} from './scenes/Intro.ts';
import {Game as MainGame} from './scenes/Game';

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
        Credits,
        Intro,
        MainGame
    ]
};

const StartGame = (parent: string) => {

    return new Game({ ...config, parent });

}

export default StartGame;
