import { Battle } from './battle.js';
import { BattleManager } from './manager.js';

// Expose to global scope so existing code (game.js, UI) keeps working
window.Battle = Battle;
window.BattleManager = BattleManager;

// For backward compatibility: if code expects BattleManager.prototype.getBattleReward on the prototype
// ensure the method exists on the prototype (already present), but attach if needed.
if (!BattleManager.prototype.getBattleReward) {
    BattleManager.prototype.getBattleReward = function(difficulty, type) {
        const rewards = {
            'easy': { gold: 100, reputation: 5 },
            'medium': { gold: 250, reputation: 15 },
            'hard': { gold: 500, reputation: 30 },
            'legendary': { gold: 1000, reputation: 60 }
        };
        return rewards[difficulty][type];
    };
}