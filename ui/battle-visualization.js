import { drawArenaBase, drawGladiatorBase } from './visualization/draw.js';
import { updateParticlesBase, drawParticlesBase, addParticles } from './visualization/particles.js';
import { createImpactEffectBase, createBloodEffectBase, createDeathEffectBase, createSevereInjuryEffectBase } from './visualization/effects.js';

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
                createBloodEffectBase(this, event.target);
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
                createBloodEffectBase(this, event.gladiator);
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
                createImpactEffectBase(this, targetState.position);
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
            createDeathEffectBase(this, state.position);
        }
    }

    animateSevereInjury(gladiator) {
        const state = this.findGladiatorState(gladiator);
        if (state) {
            state.animationState = 'injured';
            createSevereInjuryEffectBase(this, state.position);
        }
    }

    findGladiatorState(gladiator) {
        return this.gladiatorStates.get(gladiator.id);
    }

    updateDisplay() {
        this.drawArena();
        updateParticlesBase(this);
        drawParticlesBase(this);
    }

    drawArena() {
        drawArenaBase(this);
    }
}

window.BattleVisualization = BattleVisualization;
export default BattleVisualization;