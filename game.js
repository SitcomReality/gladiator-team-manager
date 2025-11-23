class GladiatorGame {
    constructor() {
        this.gold = 500;
        this.reputation = 0;
        this.day = 1;
        
        this.gladiatorManager = new GladiatorManager();
        this.battleManager = new BattleManager();
        this.ui = new UIManager(this);
        
        // Start with a few gladiators
        this.gladiatorManager.recruitGladiator();
        this.gladiatorManager.recruitGladiator();
        this.gladiatorManager.recruitGladiator();
        
        this.ui.updateDisplay();
    }
    
    recruitGladiator() {
        if (this.gold >= 100) {
            this.gold -= 100;
            this.gladiatorManager.recruitGladiator();
            this.ui.updateDisplay();
        } else {
            alert('Not enough gold! Recruiting costs 100 gold.');
        }
    }
    
    startBattle(battleConfig, selectedGladiators) {
        const battle = new Battle(battleConfig.difficulty, selectedGladiators);
        const results = battle.simulate();
        
        // Apply results
        this.gold += results.goldEarned;
        this.reputation += results.reputationGained;
        
        // Show results
        this.ui.showBattleResults(battle, results);
        this.ui.updateDisplay();
    }
    
    installProsthetic(gladiatorId, prostheticData) {
        const gladiator = this.gladiatorManager.getGladiatorById(gladiatorId);
        
        if (this.gold >= prostheticData.cost) {
            this.gold -= prostheticData.cost;
            gladiator.installProsthetic(prostheticData);
            
            alert(`Installed ${prostheticData.name} for ${gladiator.name}!`);
            this.ui.updateDisplay();
        } else {
            alert(`Not enough gold! ${prostheticData.name} costs ${prostheticData.cost} gold.`);
        }
    }
    
    restAllGladiators() {
        this.gladiatorManager.restAll();
        this.day++;
        alert(`Day ${this.day}: All gladiators have rested and recovered.`);
        this.ui.updateDisplay();
    }
}

// Add global helper method for prosthetic installation
window.installProsthetic = function(gladiatorId, prostheticData) {
    game.installProsthetic(gladiatorId, prostheticData);
};

// Initialize game
window.addEventListener('DOMContentLoaded', () => {
    window.game = new GladiatorGame();
});

// Add battle manager helper methods
// (Removed redundant prototype patch that could run before BattleManager is defined)

