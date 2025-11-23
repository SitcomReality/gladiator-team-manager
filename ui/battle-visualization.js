class BattleVisualization {
    constructor(canvasId, battle) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.battle = battle;
        this.eventIndex = 0;
        this.animationSpeed = 1000;

        this.canvas.width = 800;
        this.canvas.height = 400;

        this.playerPositions = [];
        this.enemyPositions = [];
        this.setupPositions();

        this.gladiatorStates = new Map();
        this.setupGladiatorStates();

        this.particles = [];
    }

    setupPositions() {
        const playerCount = this.battle.playerTeam.length;
        const enemyCount = this.battle.enemyTeam.length;

        for (let i = 0; i < playerCount; i++) {
            this.playerPositions.push({
                x: 150,
                y: 100 + (i * 60),
                originalY: 100 + (i * 60)
            });
        }

        for (let i = 0; i < enemyCount; i++) {
            this.enemyPositions.push({
                x: 650,
                y: 100 + (i * 60),
                originalY: 100 + (i * 60)
            });
        }
    }

    setupGladiatorStates() {
        this.battle.playerTeam.forEach((gladiator, index) => {
            this.gladiatorStates.set(gladiator.id, {
                gladiator: gladiator,
                position: this.playerPositions[index],
                isPlayer: true,
                alive: true,
                health: gladiator.maxHealth,
                maxHealth: gladiator.maxHealth,
                color: this.getGladiatorColor(gladiator),
                animationState: 'idle'
            });
        });

        this.battle.enemyTeam.forEach((gladiator, index) => {
            this.gladiatorStates.set(gladiator.id, {
                gladiator: gladiator,
                position: this.enemyPositions[index],
                isPlayer: false,
                alive: true,
                health: gladiator.maxHealth,
                maxHealth: gladiator.maxHealth,
                color: '#8B0000',
                animationState: 'idle'
            });
        });
    }

    getGladiatorColor(gladiator) {
        const colors = {
            'Retiarius': '#4169E1',
            'Murmillo': '#DAA520',
            'Thraex': '#DC143C',
            'Secutor': '#32CD32',
            'Hoplomachus': '#8A2BE2',
            'Dimachaerus': '#FF8C00'
        };
        return colors[gladiator.class.name] || '#4682B4';
    }

    playBattle() {
        this.drawArena();
        this.eventIndex = 0;
        this.processNextEvent();
    }

    processNextEvent() {
        if (this.eventIndex >= this.battle.visualEvents.length) {
            return;
        }

        const event = this.battle.visualEvents[this.eventIndex];
        this.handleEvent(event);
        this.eventIndex++;

        setTimeout(() => {
            this.processNextEvent();
        }, this.animationSpeed);
    }

    handleEvent(event) {
        switch (event.type) {
            case 'battle_start':
                this.drawArena();
                break;
            case 'attack_hit':
                this.animateAttack(event);
                this.updateGladiatorHealth(event.target, event.damage);
                this.createBloodEffect(event.target);
                break;
            case 'attack_miss':
                this.animateAttack(event);
                break;
            case 'death':
                this.animateDeath(event.gladiator);
                break;
            case 'severe_injury':
                this.animateSevereInjury(event.gladiator);
                break;
            case 'injury':
                this.createInjuryEffect(event.gladiator);
                break;
        }

        this.updateDisplay();
    }

    animateAttack(event) {
        const attackerState = this.findGladiatorState(event.attacker);
        const targetState = this.findGladiatorState(event.target);

        if (attackerState && targetState) {
            this.ctx.strokeStyle = '#FF4500';
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.moveTo(attackerState.position.x, attackerState.position.y);
            this.ctx.lineTo(targetState.position.x, targetState.position.y);
            this.ctx.stroke();

            if (event.type === 'attack_hit') {
                this.createImpactEffect(targetState.position);
            }
        }
    }

    updateGladiatorHealth(target, damage) {
        const state = this.findGladiatorState(target);
        if (state) {
            state.health = Math.max(0, state.health - damage);
            if (state.health === 0) {
                state.alive = false;
            }
        }
    }

    animateDeath(gladiator) {
        const state = this.findGladiatorState(gladiator);
        if (state) {
            state.alive = false;
            state.animationState = 'dead';
            this.createDeathEffect(state.position);
        }
    }

    animateSevereInjury(gladiator) {
        const state = this.findGladiatorState(gladiator);
        if (state) {
            state.animationState = 'injured';
            this.createSevereInjuryEffect(state.position);
        }
    }

    createBloodEffect(target) {
        const state = this.findGladiatorState(target);
        if (state) {
            for (let i = 0; i < 5; i++) {
                this.particles.push({
                    x: state.position.x,
                    y: state.position.y,
                    vx: (Math.random() - 0.5) * 4,
                    vy: (Math.random() - 0.5) * 4,
                    life: 30,
                    color: '#8B0000',
                    size: Math.random() * 3 + 1
                });
            }
        }
    }

    createImpactEffect(position) {
        for (let i = 0; i < 8; i++) {
            this.particles.push({
                x: position.x,
                y: position.y,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                life: 20,
                color: '#FFD700',
                size: Math.random() * 2 + 1
            });
        }
    }

    createDeathEffect(position) {
        for (let i = 0; i < 15; i++) {
            this.particles.push({
                x: position.x,
                y: position.y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                life: 60,
                color: '#8B0000',
                size: Math.random() * 4 + 2
            });
        }
    }

    createSevereInjuryEffect(position) {
        for (let i = 0; i < 10; i++) {
            this.particles.push({
                x: position.x,
                y: position.y,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                life: 40,
                color: '#DC143C',
                size: Math.random() * 3 + 1
            });
        }
    }

    createInjuryEffect(gladiator) {
        const state = this.findGladiatorState(gladiator);
        if (state) {
            this.createBloodEffect(gladiator);
        }
    }

    findGladiatorState(gladiator) {
        return this.gladiatorStates.get(gladiator.id);
    }

    updateDisplay() {
        this.drawArena();
        this.updateParticles();
        this.drawParticles();
    }

    drawArena() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(0.7, '#F4A460');
        gradient.addColorStop(1, '#8B4513');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.strokeStyle = '#654321';
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.arc(400, 200, 180, 0, Math.PI * 2);
        this.ctx.stroke();

        this.gladiatorStates.forEach(state => {
            this.drawGladiator(state);
        });
    }

    drawGladiator(state) {
        const pos = state.position;

        if (!state.alive) {
            this.ctx.fillStyle = '#696969';
            this.ctx.fillRect(pos.x - 15, pos.y + 10, 30, 8);
            return;
        }

        this.ctx.fillStyle = state.color;
        this.ctx.fillRect(pos.x - 10, pos.y - 20, 20, 30);

        this.ctx.fillStyle = '#F4C2A1';
        this.ctx.beginPath();
        this.ctx.arc(pos.x, pos.y - 25, 8, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.strokeStyle = '#C0C0C0';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        if (state.isPlayer) {
            this.ctx.moveTo(pos.x - 15, pos.y - 10);
            this.ctx.lineTo(pos.x - 25, pos.y - 15);
        } else {
            this.ctx.moveTo(pos.x + 15, pos.y - 10);
            this.ctx.lineTo(pos.x + 25, pos.y - 15);
        }
        this.ctx.stroke();

        const healthBarWidth = 30;
        const healthBarHeight = 4;
        const healthPercent = state.health / state.maxHealth;

        this.ctx.fillStyle = '#8B0000';
        this.ctx.fillRect(pos.x - healthBarWidth/2, pos.y - 35, healthBarWidth, healthBarHeight);

        this.ctx.fillStyle = healthPercent > 0.5 ? '#32CD32' : healthPercent > 0.25 ? '#FFD700' : '#DC143C';
        this.ctx.fillRect(pos.x - healthBarWidth/2, pos.y - 35, healthBarWidth * healthPercent, healthBarHeight);

        this.ctx.fillStyle = '#000';
        this.ctx.font = '10px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(state.gladiator.name.split(' ')[0], pos.x, pos.y + 25);
    }

    updateParticles() {
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life--;
            return particle.life > 0;
        });
    }

    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.globalAlpha = particle.life / 60;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
        this.ctx.globalAlpha = 1;
    }
}