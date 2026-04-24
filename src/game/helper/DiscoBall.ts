import { Scene } from 'phaser';

export function createDiscoBallParticles(scene: Scene) {
    const discoBall = scene.add.particles(0, scene.scale.height * -0.1, 'particle', {
        lifespan: 10000,
        advance: 10000,
        scale: 0.25,
        tint: 0x639bff,
        y: {min: 0, max: scene.scale.height * 0.9},
        quantity: 0.5,
        moveToX: scene.scale.width,
        speedX: 50,
    });

    scene.add.tween({
        targets: discoBall,
        y: 0,
        ease: 'Cubic.easeInOut',
        duration: 4000,
        yoyo: true,
        repeat: -1
    });

    return discoBall;
}