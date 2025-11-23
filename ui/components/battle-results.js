class BattleResultsUI {
    constructor(uiManager) {
        this.uiManager = uiManager;
    }
    
    showBattleResults(battle, results) {
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
}

