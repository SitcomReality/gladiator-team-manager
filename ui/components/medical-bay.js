class MedicalBayUI {
    constructor(uiManager) {
        this.uiManager = uiManager;
    }
    
    updateMedicalBay() {
        const medicalBay = document.getElementById('medical-bay');
        const injured = this.uiManager.game.gladiatorManager.getInjuredGladiators();
        
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
}

