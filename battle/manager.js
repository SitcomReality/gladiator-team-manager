export class BattleManager {
    constructor() {
        this.availableBattles = this.generateBattles();
        this.completedBattles = [];
    }

    generateBattles() {
        return [
            {
                id: 'training',
                name: 'Training Match',
                difficulty: 'easy',
                description: 'A simple bout against fellow trainees',
                requirements: { minGladiators: 1, maxGladiators: 3 }
            },
            {
                id: 'citizen_show',
                name: 'Citizen Entertainment',
                difficulty: 'medium',  
                description: 'Put on a show for the Roman citizens',
                requirements: { minGladiators: 2, maxGladiators: 4 }
            },
            {
                id: 'noble_exhibition',
                name: 'Noble Exhibition',
                difficulty: 'hard',
                description: 'Fight before the Roman nobility',
                requirements: { minGladiators: 3, maxGladiators: 5 }
            },
            {
                id: 'imperial_games',
                name: 'Imperial Games',
                difficulty: 'legendary',
                description: 'The ultimate test - fight before Caesar himself!',
                requirements: { minGladiators: 4, maxGladiators: 6 }
            }
        ];
    }

    getBattleById(id) {
        return this.availableBattles.find(b => b.id === id);
    }

    canEnterBattle(battle, selectedGladiators) {
        const req = battle.requirements;
        const available = selectedGladiators.filter(g => g.isAlive && g.isAvailable);

        return available.length >= req.minGladiators && available.length <= req.maxGladiators;
    }

    getBattleReward(difficulty, type) {
        const rewards = {
            'easy': { gold: 100, reputation: 5 },
            'medium': { gold: 250, reputation: 15 },
            'hard': { gold: 500, reputation: 30 },
            'legendary': { gold: 1000, reputation: 60 }
        };

        return rewards[difficulty][type];
    }
}