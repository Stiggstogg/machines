import { Scene, Sound } from 'phaser';

// get a specific audio sound by checking first if it already exists. In case it does not exist it is created first
export function getAudio(scene: Scene, key: string): Sound.BaseSound {

    let audio: Sound.BaseSound;

    if (!scene.sound.get(key)) {
        audio = scene.sound.add(key);    // create it if it does not exist
    } else {
        audio = scene.sound.get(key);
    }

    return audio;
}

// get a specific audio sound by checking first if it already exists. In case it does not exist it is created first
export function getAudioSprite(scene: Scene, key: string): Sound.BaseSound {

    let audio: Sound.BaseSound;

    if (!scene.sound.get(key)) {
        audio = scene.sound.addAudioSprite(key);    // create it if it does not exist
    } else {
        audio = scene.sound.get(key);
    }

    return audio;
}