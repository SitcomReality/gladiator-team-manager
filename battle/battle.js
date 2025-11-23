export class Battle {
    constructor(difficulty, playerTeam, enemyTeam = null) {
        this.difficulty = difficulty;
        this.playerTeam = [...playerTeam];
        this.enemyTeam = enemyTeam || this.generateEnemyTeam();
        this.log = [];
        this.visualEvents = []; 
        this.rewards = this.calculateRewards();
        this.round = 0;
        this.maxRounds = 20;
    }

    generateEnemyTeam() {
        const difficulties = {
            'easy': { count: 2, statRange: [30, 60] },
            'medium': { count: 3, statRange: [50, 75] },
            'hard': { count: 4, statRange: [65, 85] },
            'legendary': { count: 5, statRange: [75, 95] }
        };

        const config = difficulties[this.difficulty];
        const enemies = [];

        for (let i = 0; i < config.count; i++) {
            const enemy = new Gladiator();
            enemy.strength = this.randomInRange(config.statRange[0], config.statRange[1]);
            enemy.agility = this.randomInRange(config.statRange[0], config.statRange[1]);
            enemy.endurance = this.randomInRange(config.statRange[0], config.statRange[1]);
            enemy.skill = this.randomInRange(config.statRange[0], config.statRange[1]);
            enemy.name = `${enemy.name} (Enemy)`;
            enemies.push(enemy);
        }

        return enemies;
    }

    randomInRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    calculateRewards() {
        const baseRewards = {
            'easy': { gold: 100, reputation: 5 },
            'medium': { gold: 250, reputation: 15 },
            'hard': { gold: 500, reputation: 30 },
            'legendary': { gold: 1000, reputation: 60 }
        };

        return baseRewards[this.difficulty];
    }

    simulate() {
        this.log.push(` The battle begins! ${this.playerTeam.length} gladiators enter the arena!`);
        this.log.push(`Facing ${this.enemyTeam.length} opponents in ${this.difficulty} combat.`);
        this.log.push('');

        this.visualEvents.push({
            type: 'battle_start',
            playerTeam: this.playerTeam.map(g => ({...g})),
            enemyTeam: this.enemyTeam.map(g => ({...g})),
            timestamp: Date.now()
        });

        let playerAlive = this.playerTeam.filter(g => g.health > 0);
        let enemyAlive = this.enemyTeam.filter(g => g.health > 0);

        while (playerAlive.length > 0 && enemyAlive.length > 0 && this.round < this.maxRounds) {
            this.round++;
            this.log.push(`--- Round ${this.round} ---`);

            const allFighters = [...playerAlive, ...enemyAlive].map(fighter => ({
                fighter,
                initiative: fighter.getSpeed() + Math.random() * 20,
                isPlayer: this.playerTeam.includes(fighter)
            }));

            allFighters.sort((a, b) => b.initiative - a.initiative);

            for (const combatant of allFighters) {
                if (combatant.fighter.health <= 0) continue;

                const targets = combatant.isPlayer ? 
                    enemyAlive.filter(e => e.health > 0) : 
                    playerAlive.filter(p => p.health > 0);

                if (targets.length === 0) break;

                const target = targets[Math.floor(Math.random() * targets.length)];
                this.executeAttack(combatant.fighter, target, combatant.isPlayer);

                playerAlive = this.playerTeam.filter(g => g.health > 0);
                enemyAlive = this.enemyTeam.filter(g => g.health > 0);

                if (playerAlive.length === 0 || enemyAlive.length === 0) break;
            }

            this.log.push('');
        }

        const playerWins = enemyAlive.length === 0;
        const results = this.calculateResults(playerWins);

        this.log.push('='.repeat(50));
        if (playerWins) {
            this.log.push(' VICTORY! Your gladiators emerge triumphant!');
            this.log.push(`Rewards: ${results.goldEarned} gold, ${results.reputationGained} reputation`);
        } else {
            this.log.push(' DEFEAT! Your gladiators have fallen...');
            this.log.push('The crowd shows no mercy for the defeated.');
        }

        return results;
    }

    executeAttack(attacker, target, isPlayerAttacking) {
        const attackPower = attacker.getAttackPower();
        const defensePower = target.getDefensePower();

        const hitChance = Math.max(0.1, Math.min(0.95, (attackPower / (attackPower + defensePower)) * 0.8 + 0.2));

        if (Math.random() < hitChance) {
            const baseDamage = Math.max(1, attackPower - (defensePower * 0.3));
            const damage = Math.floor(baseDamage * (0.8 + Math.random() * 0.4));

            const result = target.takeDamage(damage);
            attacker.totalDamageDealt += damage;

            this.visualEvents.push({
                type: 'attack_hit',
                attacker: attacker,
                target: target,
                damage: damage,
                result: result,
                isPlayerAttacking: isPlayerAttacking,
                timestamp: Date.now()
            });

            let attackMessage = ` ${attacker.name} strikes ${target.name} for ${damage} damage!`;

            if (result.died) {
                attackMessage += ` ${target.name} has fallen!`;
                this.log.push(`${attackMessage}`);
                this.visualEvents.push({
                    type: 'death',
                    gladiator: target,
                    timestamp: Date.now()
                });
            } else if (result.severeInjury) {
                attackMessage += ` Severe injury: ${result.severeInjury.name}!`;
                this.log.push(`${attackMessage}`);
                this.visualEvents.push({
                    type: 'severe_injury',
                    gladiator: target,
                    injury: result.severeInjury,
                    timestamp: Date.now()
                });
            } else if (result.injury) {
                attackMessage += ` Injury: ${result.injury.name}!`;
                this.log.push(`${attackMessage}`);
                this.visualEvents.push({
                    type: 'injury',
                    gladiator: target,
                    injury: result.injury,
                    timestamp: Date.now()
                });
            } else {
                this.log.push(attackMessage);
            }
        } else {
            this.log.push(`${attacker.name} attacks ${target.name} but misses!`);

            this.visualEvents.push({
                type: 'attack_miss',
                attacker: attacker,
                target: target,
                isPlayerAttacking: isPlayerAttacking,
                timestamp: Date.now()
            });
        }

        attacker.stamina = Math.max(0, attacker.stamina - 10);
    }

    calculateResults(playerWins) {
        const results = {
            victory: playerWins,
            goldEarned: 0,
            reputationGained: 0,
            experienceGained: 20,
            casualties: [],
            injuries: []
        };

        if (playerWins) {
            results.goldEarned = this.rewards.gold;
            results.reputationGained = this.rewards.reputation;
            results.experienceGained *= 2;
        } else {
            results.goldEarned = Math.floor(this.rewards.gold * 0.2);
        }

        this.playerTeam.forEach(gladiator => {
            if (!gladiator.isAlive) {
                results.casualties.push(gladiator);
            } else if (gladiator.injuries.length > 0) {
                results.injuries.push({
                    gladiator: gladiator,
                    newInjuries: gladiator.injuries.filter(i => i.healTime !== undefined)
                });
            }

            if (gladiator.isAlive) {
                gladiator.gainExperience(results.experienceGained);
                if (playerWins) {
                    gladiator.wins++;
                } else {
                    gladiator.losses++;
                }
            }
        });

        return results;
    }
}