class UIManager {
    constructor(game) {
        this.game = game;
        this.selectedGladiators = [];
        this.selectedBattle = null;
        this.battleVisualization = null;

        // Initialize component managers
        this.rosterUI = new GladiatorRosterUI(this);
        this.battleSelectionUI = new BattleSelectionUI(this);
        this.battleSetupUI = new BattleSetupUI(this);
        this.gladiatorDetailsUI = new GladiatorDetailsUI(this);
        this.medicalBayUI = new MedicalBayUI(this);
        this.battleResultsUI = new BattleResultsUI(this);

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.getElementById('recruit-btn').addEventListener('click', () => {
            this.game.recruitGladiator();
            this.updateDisplay();
        });

        this.battleSelectionUI.setupBattleOptions();

        document.getElementById('continue-btn').addEventListener('click', () => {
            this.hideBattleResults();
            this.showBattleSelection();
        });
    }

    updateDisplay() {
        this.updateResources();
        this.rosterUI.updateGladiatorRoster();
        this.medicalBayUI.updateMedicalBay();
        this.battleSelectionUI.updateBattleOptions();
    }

    updateResources() {
        document.getElementById('gold').textContent = this.game.gold;
        document.getElementById('reputation').textContent = this.game.reputation;
    }

    selectGladiator(gladiatorId) {
        const gladiator = this.game.gladiatorManager.getGladiatorById(gladiatorId);
        this.gladiatorDetailsUI.showGladiatorDetails(gladiator);

        document.querySelectorAll('.gladiator-card').forEach(card => {
            card.classList.remove('selected');
        });
        document.querySelector(`[data-gladiator-id="${gladiatorId}"]`).classList.add('selected');
    }

    selectBattle(battle) {
        const available = this.game.gladiatorManager.getAvailableGladiators();
        if (available.length < battle.requirements.minGladiators) {
            alert(`You need at least ${battle.requirements.minGladiators} available gladiators for this battle!`);
            return;
        }

        this.selectedBattle = battle;
        this.battleSetupUI.showBattleSetup(battle);
    }

    showBattleSelection() {
        document.getElementById('battle-selection').style.display = 'block';
        document.getElementById('battle-setup').style.display = 'none';
        document.getElementById('battle-results').style.display = 'none';
    }

    startBattle() {
        if (this.selectedGladiators.length < this.selectedBattle.requirements.minGladiators) {
            alert(`Select at least ${this.selectedBattle.requirements.minGladiators} gladiators!`);
            return;
        }

        const team = this.selectedGladiators.map(id => this.game.gladiatorManager.getGladiatorById(id));
        this.game.startBattle(this.selectedBattle, team);
    }

    showBattleResults(battle, results) {
        document.getElementById('battle-selection').style.display = 'none';
        document.getElementById('battle-setup').style.display = 'none';
        document.getElementById('battle-results').style.display = 'block';

        this.battleVisualization = new BattleVisualization('battle-canvas', battle);
        this.battleVisualization.playBattle();

        this.battleResultsUI.showBattleResults(battle, results);
    }

    hideBattleResults() {
        document.getElementById('battle-results').style.display = 'none';
    }
}