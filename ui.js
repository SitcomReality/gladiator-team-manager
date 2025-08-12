class UIManager {
    constructor(game) {
        this.game = game;
        this.selectedGladiators = [];
        this.selectedBattle = null;
        this.battleVisualization = null;
        this.initializeEventListeners();
    }
    
    initializeEventListeners() {
        // Recruit button
        document.getElementById('recruit-btn').addEventListener('click', () => {
            this.game.recruitGladiator();
            this.updateDisplay();
        });
        
        // Battle buttons will be added dynamically
        this.setupBattleOptions();
        
        // Continue button (after battle)
        document.getElementById('continue-btn').addEventListener('click', () => {
            this.hideBattleResults();
            this.showBattleSelection();
        });
    }
    
    updateDisplay() {
        this.updateResources();
        this.updateGladiatorRoster();
        this.updateMedicalBay();
        this.updateBattleOptions();
    }
    
    updateResources() {
        document.getElementById('gold').textContent = this.game.gold;
        document.getElementById('reputation').textContent = this.game.reputation;
    }
    
    updateGladiatorRoster() {
        const roster = document.getElementById('gladiator-roster');
        roster.innerHTML = '';
        
        this.game.gladiatorManager.gladiators.forEach(gladiator => {
            const card = this.createGladiatorCard(gladiator);
            roster.appendChild(card);
        });
    }
    
    createGladiatorCard(gladiator) {
        const card = document.createElement('div');
        card.className = `gladiator-card ${gladiator.isAlive ? (gladiator.isAvailable ? '' : 'injured') : 'dead'}`;
        card.dataset.gladiatorId = gladiator.id;
        
        const statusIcon = gladiator.isAlive ? (gladiator.isAvailable ? '⚔️' : '🤕') : '💀';
        const healthPercent = (gladiator.health / gladiator.maxHealth) * 100;
        const staminaPercent = (gladiator.stamina / gladiator.maxStamina) * 100;
        
        card.innerHTML = `
            <div class="gladiator-name">${statusIcon} ${gladiator.name}</div>
            <div class="gladiator-class">${gladiator.class.name} • Level ${gladiator.level}</div>
            
            <div class="stats">
                <div class="stat">
                    <span>💪 STR</span>
                    <span>${gladiator.strength}</span>
                </div>
                <div class="stat">
                    <span>🏃 AGI</span>
                    <span>${gladiator.agility}</span>
                </div>
                <div class="stat">
                    <span>🛡️ END</span>
                    <span>${gladiator.endurance}</span>
                </div>
                <div class="stat">
                    <span>🎯 SKL</span>
                    <span>${gladiator.skill}</span>
                </div>
            </div>
            
            <div class="health-bar">
                <div class="health-fill" style="width: ${healthPercent}%"></div>
            </div>
            <small>Health: ${gladiator.health}/${gladiator.maxHealth}</small>
            
            <div class="stamina-bar">
                <div class="stamina-fill" style="width: ${staminaPercent}%"></div>
            </div>
            <small>Stamina: ${gladiator.stamina}/${gladiator.maxStamina}</small>
            
            <div style="margin-top: 0.5rem;">
                <small>Record: ${gladiator.wins}W - ${gladiator.losses}L</small>
            </div>
        `;
        
        card.addEventListener('click', () => this.selectGladiator(gladiator.id));
        
        return card;
    }
    
    selectGladiator(gladiatorId) {
        const gladiator = this.game.gladiatorManager.getGladiatorById(gladiatorId);
        this.showGladiatorDetails(gladiator);
        
        // Update visual selection
        document.querySelectorAll('.gladiator-card').forEach(card => {
            card.classList.remove('selected');
        });
        document.querySelector(`[data-gladiator-id="${gladiatorId}"]`).classList.add('selected');
    }
    
    showGladiatorDetails(gladiator) {
        const details = document.getElementById('gladiator-details');
        
        let injuryList = '';
        if (gladiator.injuries.length > 0) {
            injuryList = `
                <h4>Injuries:</h4>
                <ul class="injury-list">
                    ${gladiator.injuries.map(injury => `<li>${injury.name} - ${injury.effect}</li>`).join('')}
                </ul>
            `;
        }
        
        let prostheticOptions = '';
        const prosthetics = gladiator.getProstheticOptions();
        if (prosthetics.length > 0) {
            prostheticOptions = `
                <h4>Available Prosthetics:</h4>
                ${prosthetics.map(pros => `
                    <div class="prosthetic-option" onclick="game.installProsthetic('${gladiator.id}', ${JSON.stringify(pros).replace(/"/g, '&quot;')})">
                        ${pros.name} - ${pros.cost}g
                        <br><small>${pros.type === 'weapon' ? 'Combat' : 'Mobility'} enhancement</small>
                    </div>
                `).join('')}
            `;
        }
        
        details.innerHTML = `
            <h3>${gladiator.name}</h3>
            <p><strong>Class:</strong> ${gladiator.class.name}</p>
            <p><strong>Weapon:</strong> ${gladiator.equipment.weapon}</p>
            <p><strong>Level:</strong> ${gladiator.level} (${gladiator.experience} XP)</p>
            <p><strong>Status:</strong> ${gladiator.isAlive ? (gladiator.isAvailable ? 'Ready' : 'Injured/Recovering') : 'Dead'}</p>
            
            <h4>Combat Stats:</h4>
            <p>Attack Power: ${gladiator.getAttackPower()}</p>
            <p>Defense Power: ${gladiator.getDefensePower()}</p>
            <p>Speed: ${gladiator.getSpeed()}</p>
            
            ${injuryList}
            ${prostheticOptions}
        `;
    }
    
    updateMedicalBay() {
        const medicalBay = document.getElementById('medical-bay');
        const injured = this.game.gladiatorManager.getInjuredGladiators();
        
        if (injured.length === 0) {
            medicalBay.innerHTML = '<p>No injured gladiators</p>';
            return;
        }
        
        medicalBay.innerHTML = `
            <h4>Injured Gladiators (${injured.length})</h4>
            ${injured.map(gladiator => `
                <div style="margin-bottom: 1rem; padding: 0.5rem; background: rgba(220,20,60,0.1); border-radius: 5px;">
                    <strong>${gladiator.name}</strong>
                    <ul class="injury-list">
                        ${gladiator.injuries.map(injury => 
                            `<li>${injury.name} ${injury.healTime > 0 ? `(${injury.healTime} days)` : '(Permanent)'}</li>`
                        ).join('')}
                    </ul>
                </div>
            `).join('')}
            <button class="btn secondary" onclick="game.restAllGladiators()">Rest All (+1 Day)</button>
        `;
    }
    
    setupBattleOptions() {
        const battleOptions = document.getElementById('battle-options');
        
        this.game.battleManager.availableBattles.forEach(battle => {
            const option = document.createElement('div');
            option.className = 'battle-option';
            option.innerHTML = `
                <div class="battle-difficulty ${battle.difficulty}">${battle.difficulty.toUpperCase()}: ${battle.name}</div>
                <p>${battle.description}</p>
                <div class="battle-rewards">
                    <span>💰 ${this.game.battleManager.getBattleReward(battle.difficulty, 'gold')} Gold</span>
                    <span>⭐ ${this.game.battleManager.getBattleReward(battle.difficulty, 'reputation')} Reputation</span>
                </div>
                <small>Requires ${battle.requirements.minGladiators}-${battle.requirements.maxGladiators} gladiators</small>
            `;
            
            option.addEventListener('click', () => this.selectBattle(battle));
            battleOptions.appendChild(option);
        });
    }
    
    updateBattleOptions() {
        // Update availability based on gladiator count
        const available = this.game.gladiatorManager.getAvailableGladiators().length;
        
        document.querySelectorAll('.battle-option').forEach((option, index) => {
            const battle = this.game.battleManager.availableBattles[index];
            const canEnter = available >= battle.requirements.minGladiators;
            
            option.style.opacity = canEnter ? '1' : '0.5';
            option.style.cursor = canEnter ? 'pointer' : 'not-allowed';
        });
    }
    
    selectBattle(battle) {
        const available = this.game.gladiatorManager.getAvailableGladiators();
        if (available.length < battle.requirements.minGladiators) {
            alert(`You need at least ${battle.requirements.minGladiators} available gladiators for this battle!`);
            return;
        }
        
        this.selectedBattle = battle;
        this.showBattleSetup();
    }
    
    showBattleSetup() {
        document.getElementById('battle-selection').style.display = 'none';
        document.getElementById('battle-setup').style.display = 'block';
        
        const teamSelection = document.getElementById('team-selection');
        const available = this.game.gladiatorManager.getAvailableGladiators();
        
        teamSelection.innerHTML = `
            <p>Select gladiators for <strong>${this.selectedBattle.name}</strong></p>
            <p>Required: ${this.selectedBattle.requirements.minGladiators}-${this.selectedBattle.requirements.maxGladiators} gladiators</p>
            <div id="team-roster"></div>
        `;
        
        const roster = document.getElementById('team-roster');
        available.forEach(gladiator => {
            const card = document.createElement('div');
            card.className = 'gladiator-card';
            card.dataset.gladiatorId = gladiator.id;
            card.innerHTML = `
                <div class="gladiator-name">${gladiator.name}</div>
                <div class="gladiator-class">${gladiator.class.name}</div>
                <small>ATK: ${gladiator.getAttackPower()} | DEF: ${gladiator.getDefensePower()} | SPD: ${gladiator.getSpeed()}</small>
            `;
            
            card.addEventListener('click', () => this.toggleGladiatorForBattle(gladiator.id));
            roster.appendChild(card);
        });
        
        // Setup battle control buttons
        document.getElementById('start-battle-btn').onclick = () => this.startBattle();
        document.getElementById('cancel-battle-btn').onclick = () => this.cancelBattle();
        
        this.selectedGladiators = [];
    }
    
    toggleGladiatorForBattle(gladiatorId) {
        const index = this.selectedGladiators.indexOf(gladiatorId);
        const card = document.querySelector(`#team-roster [data-gladiator-id="${gladiatorId}"]`);
        
        if (index === -1) {
            // Add to team
            if (this.selectedGladiators.length < this.selectedBattle.requirements.maxGladiators) {
                this.selectedGladiators.push(gladiatorId);
                card.classList.add('selected');
            } else {
                alert(`Maximum ${this.selectedBattle.requirements.maxGladiators} gladiators allowed!`);
            }
        } else {
            // Remove from team
            this.selectedGladiators.splice(index, 1);
            card.classList.remove('selected');
        }
        
        // Update start button
        const canStart = this.selectedGladiators.length >= this.selectedBattle.requirements.minGladiators;
        document.getElementById('start-battle-btn').disabled = !canStart;
    }
    
    startBattle() {
        if (this.selectedGladiators.length < this.selectedBattle.requirements.minGladiators) {
            alert(`Select at least ${this.selectedBattle.requirements.minGladiators} gladiators!`);
            return;
        }
        
        const team = this.selectedGladiators.map(id => this.game.gladiatorManager.getGladiatorById(id));
        this.game.startBattle(this.selectedBattle, team);
    }
    
    cancelBattle() {
        this.selectedBattle = null;
        this.selectedGladiators = [];
        this.hideBattleSetup();
        this.showBattleSelection();
    }
    
    showBattleSelection() {
        document.getElementById('battle-selection').style.display = 'block';
        document.getElementById('battle-setup').style.display = 'none';
        document.getElementById('battle-results').style.display = 'none';
    }
    
    hideBattleSetup() {
        document.getElementById('battle-setup').style.display = 'none';
    }
    
    showBattleResults(battle, results) {
        document.getElementById('battle-selection').style.display = 'none';
        document.getElementById('battle-setup').style.display = 'none';
        document.getElementById('battle-results').style.display = 'block';
        
        // Initialize battle visualization
        this.battleVisualization = new BattleVisualization('battle-canvas', battle);
        this.battleVisualization.playBattle();
        
        const resultsContent = document.getElementById('results-content');
        
        let outcomeClass = results.victory ? 'victory' : 'defeat';
        let outcomeText = results.victory ? '🏆 VICTORY!' : '💀 DEFEAT!';
        
        let casualtiesText = '';
        if (results.casualties.length > 0) {
            casualtiesText = `
                <div style="color: #DC143C; margin: 1rem 0;">
                    <strong>Casualties:</strong>
                    <ul>${results.casualties.map(g => `<li>${g.name}</li>`).join('')}</ul>
                </div>
            `;
        }
        
        let injuriesText = '';
        if (results.injuries.length > 0) {
            injuriesText = `
                <div style="color: #FF8C00; margin: 1rem 0;">
                    <strong>New Injuries:</strong>
                    <ul>${results.injuries.map(entry => 
                        `<li>${entry.gladiator.name}: ${entry.newInjuries.map(i => i.name).join(', ')}</li>`
                    ).join('')}</ul>
                </div>
            `;
        }
        
        resultsContent.innerHTML = `
            <div class="battle-log">
                ${battle.log.join('<br>')}
            </div>
            
            <div style="text-align: center; margin: 1rem 0;">
                <h3 class="${outcomeClass}">${outcomeText}</h3>
            </div>
            
            ${casualtiesText}
            ${injuriesText}
            
            <div style="background: rgba(255,215,0,0.1); padding: 1rem; border-radius: 5px; margin: 1rem 0;">
                <strong>Rewards:</strong>
                <div>💰 ${results.goldEarned} Gold</div>
                <div>⭐ ${results.reputationGained} Reputation</div>
                <div>📈 ${results.experienceGained} Experience (per surviving gladiator)</div>
            </div>
        `;
    }
    
    hideBattleResults() {
        document.getElementById('battle-results').style.display = 'none';
    }
}

class BattleVisualization {
    constructor(canvasId, battle) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.battle = battle;
        this.eventIndex = 0;
        this.animationSpeed = 1000; // ms between events
        
        // Set canvas dimensions
        this.canvas.width = 800;
        this.canvas.height = 400;
        
        // Battle positions
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
        
        // Player positions (left side)
        for (let i = 0; i < playerCount; i++) {
            this.playerPositions.push({
                x: 150,
                y: 100 + (i * 60),
                originalY: 100 + (i * 60)
            });
        }
        
        // Enemy positions (right side) 
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
            return; // Battle visualization complete
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
            // Draw attack line
            this.ctx.strokeStyle = '#FF4500';
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.moveTo(attackerState.position.x, attackerState.position.y);
            this.ctx.lineTo(targetState.position.x, targetState.position.y);
            this.ctx.stroke();
            
            // Create impact effect
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
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw arena background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(0.7, '#F4A460');
        gradient.addColorStop(1, '#8B4513');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw arena circle
        this.ctx.strokeStyle = '#654321';
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.arc(400, 200, 180, 0, Math.PI * 2);
        this.ctx.stroke();
        
        // Draw gladiators
        this.gladiatorStates.forEach(state => {
            this.drawGladiator(state);
        });
    }
    
    drawGladiator(state) {
        const pos = state.position;
        
        if (!state.alive) {
            // Draw dead gladiator
            this.ctx.fillStyle = '#696969';
            this.ctx.fillRect(pos.x - 15, pos.y + 10, 30, 8);
            return;
        }
        
        // Draw gladiator body
        this.ctx.fillStyle = state.color;
        this.ctx.fillRect(pos.x - 10, pos.y - 20, 20, 30);
        
        // Draw head
        this.ctx.fillStyle = '#F4C2A1';
        this.ctx.beginPath();
        this.ctx.arc(pos.x, pos.y - 25, 8, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw weapon
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
        
        // Draw health bar
        const healthBarWidth = 30;
        const healthBarHeight = 4;
        const healthPercent = state.health / state.maxHealth;
        
        this.ctx.fillStyle = '#8B0000';
        this.ctx.fillRect(pos.x - healthBarWidth/2, pos.y - 35, healthBarWidth, healthBarHeight);
        
        this.ctx.fillStyle = healthPercent > 0.5 ? '#32CD32' : healthPercent > 0.25 ? '#FFD700' : '#DC143C';
        this.ctx.fillRect(pos.x - healthBarWidth/2, pos.y - 35, healthBarWidth * healthPercent, healthBarHeight);
        
        // Draw name
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