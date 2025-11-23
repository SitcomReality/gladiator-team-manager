export function drawArenaBase(vis) {
    const ctx = vis.ctx;
    ctx.clearRect(0, 0, vis.canvas.width, vis.canvas.height);

    const gradient = ctx.createLinearGradient(0, 0, 0, vis.canvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(0.7, '#F4A460');
    gradient.addColorStop(1, '#8B4513');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, vis.canvas.width, vis.canvas.height);

    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(400, 200, 180, 0, Math.PI * 2);
    ctx.stroke();

    vis.gladiatorStates.forEach(state => {
        drawGladiatorBase(vis, state);
    });
}

export function drawGladiatorBase(vis, state) {
    const ctx = vis.ctx;
    const pos = state.position;

    if (!state.alive) {
        ctx.fillStyle = '#696969';
        ctx.fillRect(pos.x - 15, pos.y + 10, 30, 8);
        return;
    }

    ctx.fillStyle = state.color;
    ctx.fillRect(pos.x - 10, pos.y - 20, 20, 30);

    ctx.fillStyle = '#F4C2A1';
    ctx.beginPath();
    ctx.arc(pos.x, pos.y - 25, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#C0C0C0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (state.isPlayer) {
        ctx.moveTo(pos.x - 15, pos.y - 10);
        ctx.lineTo(pos.x - 25, pos.y - 15);
    } else {
        ctx.moveTo(pos.x + 15, pos.y - 10);
        ctx.lineTo(pos.x + 25, pos.y - 15);
    }
    ctx.stroke();

    const healthBarWidth = 30;
    const healthBarHeight = 4;
    const healthPercent = state.health / state.maxHealth;

    ctx.fillStyle = '#8B0000';
    ctx.fillRect(pos.x - healthBarWidth/2, pos.y - 35, healthBarWidth, healthBarHeight);

    ctx.fillStyle = healthPercent > 0.5 ? '#32CD32' : healthPercent > 0.25 ? '#FFD700' : '#DC143C';
    ctx.fillRect(pos.x - healthBarWidth/2, pos.y - 35, healthBarWidth * healthPercent, healthBarHeight);

    ctx.fillStyle = '#000';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(state.gladiator.name.split(' ')[0], pos.x, pos.y + 25);
}

