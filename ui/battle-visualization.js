import { drawArenaBase, drawGladiatorBase } from './visualization/draw.js';
import { updateParticlesBase, drawParticlesBase, addParticles } from './visualization/particles.js';
import { createImpactEffectBase, createBloodEffectBase, createDeathEffectBase, createSevereInjuryEffectBase } from './visualization/effects.js';

export class BattleVisualization {
    constructor(canvasId, battle) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) throw new Error('Canvas not found: ' + canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.battle = battle;
        this.particles = [];
        this.gladiatorStates = [];
        this.time = 0;
        this.eventIndex = 0;
        this.running = false;

        this.setupStates();
        this.resizeCanvasToDisplay();
        window.addEventListener('resize', () => this.resizeCanvasToDisplay());
    }

    setupStates() {
        // Map teams to positions around arena
        const w = this.canvas.width;
        const h = this.canvas.height;
        const centerX = w / 2;
        const centerY = h / 2;
        const radius = Math.min(w, h) * 0.35;

        const all = [
            ...this.battle.playerTeam.map(g => ({ gladiator: g, isPlayer: true })),
            ...this.battle.enemyTeam.map(g => ({ gladiator: g, isPlayer: false }))
        ];

        this.gladiatorStates = all.map((entry, i) => {
            const angle = (i / all.length) * Math.PI * 2 - Math.PI / 2;
            return {
                gladiator: entry.gladiator,
                isPlayer: entry.isPlayer,
                alive: entry.gladiator.isAlive,
                health: entry.gladiator.health,
                maxHealth: entry.gladiator.maxHealth,
                position: {
                    x: centerX + Math.cos(angle) * radius,
                    y: centerY + Math.sin(angle) * radius
                },
                color: entry.isPlayer ? '#FFDAB9' : '#C0C0C0'
            };
        });
    }

    resizeCanvasToDisplay() {
        // Keep drawing resolution crisp
        const rect = this.canvas.getBoundingClientRect();
        const ratio = window.devicePixelRatio || 1;
        this.canvas.width = Math.max(300, Math.floor(rect.width * ratio));
        this.canvas.height = Math.max(150, Math.floor(rect.height * ratio));
        this.ctx.scale(ratio, ratio);
    }

    findGladiatorState(gladiator) {
        return this.gladiatorStates.find(s => s.gladiator === gladiator || s.gladiator.id === gladiator.id);
    }

    playBattle() {
        this.running = true;
        this.time = 0;
        this.eventIndex = 0;
        // copy initial healths
        this.gladiatorStates.forEach(s => {
            s.health = s.gladiator.health;
            s.maxHealth = s.gladiator.maxHealth;
            s.alive = s.gladiator.isAlive;
        });
        requestAnimationFrame(() => this.frame());
    }

    stop() {
        this.running = false;
    }

    frame() {
        if (!this.running) return;
        this.time += 16;
        this.processEvents();
        this.updateParticles();
        this.draw();

        requestAnimationFrame(() => this.frame());
    }

    processEvents() {
        // play events in sequence with small delays
        const events = this.battle.visualEvents || [];
        while (this.eventIndex < events.length) {
            const ev = events[this.eventIndex];
            // Simple throttling: consume one event per ~120ms of time to pace visuals
            const shouldConsume = this.time / 120 >= this.eventIndex;
            if (!shouldConsume) break;

            this.handleEvent(ev);
            this.eventIndex++;
        }
    }

    handleEvent(ev) {
        if (!ev) return;
        if (ev.type === 'battle_start') {
            // small flare for each gladiator
            this.gladiatorStates.forEach(s => {
                addParticles(this, [{
                    x: s.position.x,
                    y: s.position.y - 10,
                    vx: (Math.random()-0.5)*1,
                    vy: -Math.random()*1.5,
                    life: 30,
                    color: '#FFD700',
                    size: 2
                }]);
            });
        } else if (ev.type === 'attack_hit') {
            const at = this.findGladiatorState(ev.attacker);
            const tg = this.findGladiatorState(ev.target);
            if (tg) {
                // reduce health visually
                tg.health = Math.max(0, tg.health - ev.damage);
                createBloodEffectBase(this, ev.target);
                createImpactEffectBase(this, tg.position);
            }
        } else if (ev.type === 'attack_miss') {
            const tg = this.findGladiatorState(ev.target);
            if (tg) {
                createImpactEffectBase(this, tg.position);
            }
        } else if (ev.type === 'death') {
            const dead = this.findGladiatorState(ev.gladiator);
            if (dead) {
                dead.alive = false;
                createDeathEffectBase(this, dead.position);
            }
        } else if (ev.type === 'severe_injury') {
            const s = this.findGladiatorState(ev.gladiator);
            if (s) {
                createSevereInjuryEffectBase(this, s.position);
                s.alive = true;
            }
        } else if (ev.type === 'injury') {
            const s = this.findGladiatorState(ev.gladiator);
            if (s) createBloodEffectBase(this, ev.gladiator);
        }
    }

    updateParticles() {
        updateParticlesBase(this);
    }

    draw() {
        // clear and draw arena and gladiators
        drawArenaBase({ canvas: this.canvas, ctx: this.ctx, gladiatorStates: this.gladiatorStates });

        // draw particles on top
        drawParticlesBase(this);

        // draw small overlays for each gladiator to ensure name/health is shown with current values
        this.gladiatorStates.forEach(state => {
            // health sync if underlying gladiator has changed
            state.health = Math.max(0, state.gladiator.health);
            state.alive = state.gladiator.isAlive;
            // draw a subtle circle highlight if recently damaged
            if (state.health / state.maxHealth < 0.5 && state.alive) {
                this.ctx.strokeStyle = 'rgba(255,0,0,0.15)';
                this.ctx.lineWidth = 3;
                this.ctx.beginPath();
                this.ctx.arc(state.position.x, state.position.y - 10, 22, 0, Math.PI * 2);
                this.ctx.stroke();
            }
        });
    }
}

// Attach to window for existing non-module code to access
if (typeof window !== 'undefined') {
    window.BattleVisualization = BattleVisualization;
}

export default BattleVisualization;