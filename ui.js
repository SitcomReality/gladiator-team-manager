class UIManager {
    constructor(game) {
        this.game = game;
        this.selectedGladiators = [];
        this.selectedBattle = null;
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

