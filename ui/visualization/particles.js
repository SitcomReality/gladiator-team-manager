export function updateParticlesBase(vis) {
    vis.particles = vis.particles.filter(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life--;
        return particle.life > 0;
    });
}

export function drawParticlesBase(vis) {
    const ctx = vis.ctx;
    vis.particles.forEach(particle => {
        ctx.globalAlpha = particle.life / 60;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
    });
    vis.ctx.globalAlpha = 1;
}

export function addParticles(vis, list) {
    vis.particles.push(...list);
}

