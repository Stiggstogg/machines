import { Scene } from 'phaser';

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
