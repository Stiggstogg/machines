import {Scene} from 'phaser';

export type ConfettiSide = 'left' | 'right';

// shoots confetti from the bottom left or right corner
export function confettiParticles(scene: Scene, side: ConfettiSide = 'left') {
    const isLeft = side === 'left';
    const startX = isLeft ? 0 : scene.scale.width;
    const startY = scene.scale.height;
    const emitter = scene.add.particles(startX, startY, 'particle', {
        lifespan: { min: 1800, max: 3200 },
        speed: { min: 800, max: 1200 },
        angle: isLeft ? { min: 270, max: 350 } : { min: 190, max: 270 },
        gravityY: 1000,
        scale: 0.5,
        tint: [0x639bff, 0xfbf236, 0x99e550, 0xd77bba, 0xffffff],
        emitting: false,
    });

    return emitter;
}

// creates confetti which comes from the top of the screen
export function finalConfettiParticles(scene: Scene) {
    return scene.add.particles(0, 0, 'particle2', {
        lifespan: { min: 7000, max: 10000 },
        frequency: 120,
        quantity: 10,
        scale: { min: 0.7, max: 1.1 },
        tint: [0x639bff, 0xfbf236, 0x99e550, 0xd77bba, 0xffffff],
        x: { min: 0, max: scene.scale.width },
        y: { min: -120, max: -20 },
        speedX: { min: -35, max: 35 },
        speedY: { min: 60, max: 120 },
        rotate: { start: 0, end: 2160, random: true },
        gravityY: 35,
        accelerationX: { min: -8, max: 8 },
        emitting: false
    });
}
