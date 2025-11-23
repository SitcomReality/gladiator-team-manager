class BattleSelectionUI {
    constructor(uiManager) {
        this.uiManager = uiManager;
    }

    setupBattleOptions() {
        const battleOptions = document.getElementById('battle-options');

        this.uiManager.game.battleManager.availableBattles.forEach(battle => {
            const option = document.createElement('div');
            option.className = 'battle-option';
            option.innerHTML = `
                <div class="battle-difficulty ${battle.difficulty}">${battle.difficulty.toUpperCase()}: ${battle.name}</div>
                <p>${battle.description}</p>
                <div class="battle-rewards">
                    <span> ${this.uiManager.game.battleManager.getBattleReward(battle.difficulty, 'gold')} Gold</span>
                    <span> ${this.uiManager.game.battleManager.getBattleReward(battle.difficulty, 'reputation')} Reputation</span>
                </div>
                <small>Requires ${battle.requirements.minGladiators}-${battle.requirements.maxGladiators} gladiators</small>
            `;

            option.addEventListener('click', () => this.uiManager.selectBattle(battle));
            battleOptions.appendChild(option);
        });
    }

    updateBattleOptions() {
        const available = this.uiManager.game.gladiatorManager.getAvailableGladiators().length;

        document.querySelectorAll('.battle-option').forEach((option, index) => {
            const battle = this.uiManager.game.battleManager.availableBattles[index];
            const canEnter = available >= battle.requirements.minGladiators;

            option.style.opacity = canEnter ? '1' : '0.5';
            option.style.cursor = canEnter ? 'pointer' : 'not-allowed';
        });
    }
}