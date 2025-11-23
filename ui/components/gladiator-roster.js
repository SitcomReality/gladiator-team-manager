class GladiatorRosterUI {
    constructor(uiManager) {
        this.uiManager = uiManager;
    }
    
    updateGladiatorRoster() {
        const roster = document.getElementById('gladiator-roster');
        roster.innerHTML = '';
        
        this.uiManager.game.gladiatorManager.gladiators.forEach(gladiator => {
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
        
        card.addEventListener('click', () => this.uiManager.selectGladiator(gladiator.id));
        
        return card;
    }
}

