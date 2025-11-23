import { addParticles } from './particles.js';

export function createImpactEffectBase(vis, position) {
    const list = [];
    for (let i = 0; i < 8; i++) {
        list.push({
            x: position.x,
            y: position.y,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 0.5) * 6,
            life: 20,
            color: '#FFD700',
            size: Math.random() * 2 + 1
        });
    }
    addParticles(vis, list);
}

export function createBloodEffectBase(vis, target) {
    const state = vis.findGladiatorState(target);
    if (!state) return;
    const list = [];
    for (let i = 0; i < 5; i++) {
        list.push({
            x: state.position.x,
            y: state.position.y,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            life: 30,
            color: '#8B0000',
            size: Math.random() * 3 + 1
        });
    }
    addParticles(vis, list);
}

export function createDeathEffectBase(vis, position) {
    const list = [];
    for (let i = 0; i < 15; i++) {
        list.push({
            x: position.x,
            y: position.y,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 8,
            life: 60,
            color: '#8B0000',
            size: Math.random() * 4 + 2
        });
    }
    addParticles(vis, list);
}

export function createSevereInjuryEffectBase(vis, position) {
    const list = [];
    for (let i = 0; i < 10; i++) {
        list.push({
            x: position.x,
            y: position.y,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 0.5) * 6,
            life: 40,
            color: '#DC143C',
            size: Math.random() * 3 + 1
        });
    }
    addParticles(vis, list);
}