class BattleSetupUI {
    constructor(uiManager) {
        this.uiManager = uiManager;
    }

    showBattleSetup(battle) {
        document.getElementById('battle-selection').style.display = 'none';
        document.getElementById('battle-setup').style.display = 'block';

        const teamSelection = document.getElementById('team-selection');
        const available = this.uiManager.game.gladiatorManager.getAvailableGladiators();

        teamSelection.innerHTML = `
            <p>Select gladiators for <strong>${battle.name}</strong></p>
            <p>Required: ${battle.requirements.minGladiators}-${battle.requirements.maxGladiators} gladiators</p>
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

        document.getElementById('start-battle-btn').onclick = () => this.uiManager.startBattle();
        document.getElementById('cancel-battle-btn').onclick = () => this.cancelBattle();

        this.uiManager.selectedGladiators = [];
    }

    toggleGladiatorForBattle(gladiatorId) {
        const index = this.uiManager.selectedGladiators.indexOf(gladiatorId);
        const card = document.querySelector(`#team-roster [data-gladiator-id="${gladiatorId}"]`);

        if (index === -1) {
            if (this.uiManager.selectedGladiators.length < this.uiManager.selectedBattle.requirements.maxGladiators) {
                this.uiManager.selectedGladiators.push(gladiatorId);
                card.classList.add('selected');
            } else {
                alert(`Maximum ${this.uiManager.selectedBattle.requirements.maxGladiators} gladiators allowed!`);
            }
        } else {
            this.uiManager.selectedGladiators.splice(index, 1);
            card.classList.remove('selected');
        }

        const canStart = this.uiManager.selectedGladiators.length >= this.uiManager.selectedBattle.requirements.minGladiators;
        document.getElementById('start-battle-btn').disabled = !canStart;
    }

    cancelBattle() {
        this.uiManager.selectedBattle = null;
        this.uiManager.selectedGladiators = [];
        this.uiManager.showBattleSelection();
    }
}