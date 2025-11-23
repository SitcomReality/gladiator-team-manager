export function drawArenaBase(vis) {
    const ctx = vis.ctx;
    ctx.clearRect(0, 0, vis.canvas.width, vis.canvas.height);

    // Draw Sand
    const gradient = ctx.createRadialGradient(
        vis.canvas.width/2, vis.canvas.height/2, 50,
        vis.canvas.width/2, vis.canvas.height/2, 500
    );
    gradient.addColorStop(0, '#e6c288'); // Sunlit sand
    gradient.addColorStop(1, '#c19a6b'); // Darker sand edges
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, vis.canvas.width, vis.canvas.height);

    // Draw Arena Boundary (Stone wall)
    ctx.strokeStyle = '#5c4033';
    ctx.lineWidth = 10;
    ctx.beginPath();
    // Slightly flattened circle for perspective
    ctx.ellipse(vis.canvas.width/2, vis.canvas.height/2 + 20, 280, 220, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Draw Blood stains (static for now, but good to add if persistent)
    // For now just shadows for gladiators
    
    vis.gladiatorStates.forEach(state => {
        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.beginPath();
        ctx.ellipse(state.position.x, state.position.y + 5, 15, 8, 0, 0, Math.PI*2);
        ctx.fill();

        drawGladiatorBase(vis, state);
    });
}

export function drawGladiatorBase(vis, state) {
    const ctx = vis.ctx;
    const pos = state.position;

    if (!state.alive) {
        // Dead body
        ctx.fillStyle = '#4a4a4a';
        ctx.translate(pos.x, pos.y + 10);
        ctx.rotate(Math.PI / 2);
        ctx.fillRect(-15, -8, 30, 16);
        ctx.rotate(-Math.PI / 2);
        ctx.translate(-pos.x, -(pos.y + 10));
        return;
    }

    // Gladiator body
    ctx.fillStyle = state.isPlayer ? '#800000' : '#2F4F4F'; // Red team vs Slate team
    ctx.fillRect(pos.x - 10, pos.y - 20, 20, 30);

    // Head
    ctx.fillStyle = '#E0AC69'; // Skin tone
    ctx.beginPath();
    ctx.arc(pos.x, pos.y - 25, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Helmet/Hair
    ctx.fillStyle = state.isPlayer ? '#D4AF37' : '#A9A9A9'; // Gold helmet vs Iron helmet
    ctx.beginPath();
    ctx.arc(pos.x, pos.y - 27, 8, Math.PI, 0);
    ctx.fill();

    // Weapon arm
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.beginPath();
    if (state.isPlayer) {
        ctx.moveTo(pos.x - 10, pos.y - 15);
        ctx.lineTo(pos.x - 25, pos.y - 10);
    } else {
        ctx.moveTo(pos.x + 10, pos.y - 15);
        ctx.lineTo(pos.x + 25, pos.y - 10);
    }
    ctx.stroke();

    // Health Bar overhead
    const healthBarWidth = 32;
    const healthBarHeight = 5;
    const healthPercent = Math.max(0, state.health / state.maxHealth);

    // Health bar background
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(pos.x - healthBarWidth/2, pos.y - 45, healthBarWidth, healthBarHeight);

    // Health bar fill
    ctx.fillStyle = healthPercent > 0.5 ? '#32CD32' : healthPercent > 0.25 ? '#FFD700' : '#DC143C';
    ctx.fillRect(pos.x - healthBarWidth/2 + 1, pos.y - 44, (healthBarWidth-2) * healthPercent, healthBarHeight-2);

    // Name tag
    ctx.fillStyle = '#000';
    ctx.font = 'bold 11px Lato';
    ctx.textAlign = 'center';
    ctx.fillText(state.gladiator.name.split(' ')[0], pos.x, pos.y + 25);
}

