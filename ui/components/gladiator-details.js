class GladiatorDetailsUI {
    constructor(uiManager) {
        this.uiManager = uiManager;
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
}

