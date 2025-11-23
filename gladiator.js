class Gladiator {
    constructor(name = null) {
        this.id = Math.random().toString(36).substr(2, 9);
        this.name = name || this.generateName();
        this.class = this.generateClass();
        
        // Core stats (1-100)
        this.strength = this.randomStat(40, 80);
        this.agility = this.randomStat(40, 80);
        this.endurance = this.randomStat(40, 80);
        this.skill = this.randomStat(40, 80);
        
        // Combat stats
        this.health = 100;
        this.maxHealth = 100;
        this.stamina = 100;
        this.maxStamina = 100;
        this.experience = 0;
        this.level = 1;
        
        // Status
        this.injuries = [];
        this.isAlive = true;
        this.isAvailable = true; // not injured/recovering
        
        // Equipment and prosthetics
        this.equipment = {
            weapon: this.getDefaultWeapon(),
            armor: 'Basic Leather',
            prosthetics: []
        };
        
        // Performance tracking
        this.wins = 0;
        this.losses = 0;
        this.totalDamageDealt = 0;
        this.totalDamageTaken = 0;
    }
    
    generateName() {
        const firstNames = [
            'Marcus', 'Lucius', 'Gaius', 'Quintus', 'Titus', 'Maximus', 'Brutus', 'Caesar',
            'Spartacus', 'Crixus', 'Oenomaus', 'Gannicus', 'Varro', 'Barca', 'Doctore',
            'Flamma', 'Carpophorus', 'Priscus', 'Verus', 'Attilius'
        ];
        
        const lastNames = [
            'the Fierce', 'the Bold', 'Iron Fist', 'Blood Eagle', 'Storm Bringer',
            'Bone Crusher', 'the Relentless', 'Death Dealer', 'the Mighty', 'Sand Walker',
            'the Gladiator', 'the Champion', 'Beast Slayer', 'the Unconquered', 'the Brave'
        ];
        
        return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
    }
    
    generateClass() {
        const classes = [
            { name: 'Retiarius', weapon: 'Net and Trident', strengths: ['agility', 'skill'] },
            { name: 'Murmillo', weapon: 'Gladius and Shield', strengths: ['strength', 'endurance'] },
            { name: 'Thraex', weapon: 'Curved Sword', strengths: ['agility', 'strength'] },
            { name: 'Secutor', weapon: 'Sword and Shield', strengths: ['endurance', 'skill'] },
            { name: 'Hoplomachus', weapon: 'Spear and Shield', strengths: ['skill', 'agility'] },
            { name: 'Dimachaerus', weapon: 'Dual Swords', strengths: ['agility', 'skill'] }
        ];
        
        return classes[Math.floor(Math.random() * classes.length)];
    }
    
    getDefaultWeapon() {
        return this.class.weapon;
    }
    
    randomStat(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    // Combat effectiveness calculation
    getAttackPower() {
        let base = (this.strength * 0.4 + this.skill * 0.6);
        
        // Class bonuses
        if (this.class.strengths.includes('strength')) base *= 1.2;
        if (this.class.strengths.includes('skill')) base *= 1.1;
        
        // Injury penalties
        const armInjuries = this.injuries.filter(i => i.type === 'arm' || i.type === 'hand').length;
        base *= Math.max(0.3, 1 - (armInjuries * 0.3));
        
        // Prosthetic bonuses
        this.equipment.prosthetics.forEach(pros => {
            if (pros.type === 'weapon') base *= pros.modifier;
        });
        
        return Math.max(1, Math.floor(base));
    }
    
    getDefensePower() {
        let base = (this.agility * 0.5 + this.endurance * 0.5);
        
        // Class bonuses
        if (this.class.strengths.includes('agility')) base *= 1.2;
        if (this.class.strengths.includes('endurance')) base *= 1.1;
        
        // Injury penalties
        const legInjuries = this.injuries.filter(i => i.type === 'leg' || i.type === 'foot').length;
        base *= Math.max(0.4, 1 - (legInjuries * 0.25));
        
        return Math.max(1, Math.floor(base));
    }
    
    getSpeed() {
        let base = this.agility;
        
        const legInjuries = this.injuries.filter(i => i.type === 'leg' || i.type === 'foot').length;
        base *= Math.max(0.2, 1 - (legInjuries * 0.4));
        
        return Math.max(1, Math.floor(base));
    }
    
    // Take damage and potentially get injured
    takeDamage(amount) {
        this.health -= amount;
        this.totalDamageTaken += amount;
        
        if (this.health <= 0) {
            this.health = 0;
            // Chance of death vs severe injury
            if (Math.random() < 0.3) {
                this.isAlive = false;
                return { died: true };
            } else {
                // Severe injury instead of death
                const severeInjury = this.generateSevereInjury();
                this.injuries.push(severeInjury);
                this.health = 1; // Barely alive
                this.isAvailable = false;
                return { severeInjury: severeInjury };
            }
        }
        
        // Chance of injury on significant damage
        if (amount > 15 && Math.random() < 0.2) {
            const injury = this.generateInjury();
            this.injuries.push(injury);
            return { injury: injury };
        }
        
        return {};
    }
    
    generateInjury() {
        const injuries = [
            { type: 'cut', name: 'Deep Cut', severity: 'minor', healTime: 2, effect: 'Reduces all stats by 5%' },
            { type: 'bruise', name: 'Heavy Bruising', severity: 'minor', healTime: 1, effect: 'Reduces stamina by 10%' },
            { type: 'sprain', name: 'Sprained Joint', severity: 'moderate', healTime: 3, effect: 'Reduces agility by 15%' },
            { type: 'fracture', name: 'Bone Fracture', severity: 'serious', healTime: 5, effect: 'Reduces strength by 20%' }
        ];
        
        return injuries[Math.floor(Math.random() * injuries.length)];
    }
    
    generateSevereInjury() {
        const severeInjuries = [
            { type: 'arm', name: 'Lost Arm', severity: 'permanent', healTime: 0, effect: 'Lost limb - can be replaced with prosthetic' },
            { type: 'hand', name: 'Lost Hand', severity: 'permanent', healTime: 0, effect: 'Lost limb - can be replaced with prosthetic' },
            { type: 'leg', name: 'Lost Leg', severity: 'permanent', healTime: 0, effect: 'Lost limb - can be replaced with prosthetic' },
            { type: 'foot', name: 'Lost Foot', severity: 'permanent', healTime: 0, effect: 'Lost limb - can be replaced with prosthetic' },
            { type: 'eye', name: 'Lost Eye', severity: 'permanent', healTime: 0, effect: 'Permanent vision impairment - reduces skill by 30%' }
        ];
        
        return severeInjuries[Math.floor(Math.random() * severeInjuries.length)];
    }
    
    // Heal over time
    rest() {
        if (!this.isAlive) return;
        
        // Heal health
        this.health = Math.min(this.maxHealth, this.health + 10);
        
        // Heal temporary injuries
        this.injuries = this.injuries.filter(injury => {
            if (injury.severity === 'permanent') return true;
            
            injury.healTime--;
            return injury.healTime > 0;
        });
        
        // Check if available again
        this.isAvailable = this.injuries.filter(i => i.severity !== 'permanent' || i.healTime > 0).length === 0 && this.health > 20;
        
        // Restore stamina
        this.stamina = this.maxStamina;
    }
    
    // Gain experience and potentially level up
    gainExperience(amount) {
        this.experience += amount;
        const newLevel = Math.floor(this.experience / 100) + 1;
        
        if (newLevel > this.level) {
            this.levelUp();
            this.level = newLevel;
            return true;
        }
        return false;
    }
    
    levelUp() {
        // Increase random stats
        this.strength = Math.min(100, this.strength + Math.floor(Math.random() * 5) + 1);
        this.agility = Math.min(100, this.agility + Math.floor(Math.random() * 5) + 1);
        this.endurance = Math.min(100, this.endurance + Math.floor(Math.random() * 5) + 1);
        this.skill = Math.min(100, this.skill + Math.floor(Math.random() * 5) + 1);
        
        // Increase max health
        this.maxHealth += Math.floor(Math.random() * 10) + 5;
        this.health = this.maxHealth;
    }
    
    // Get cost for prosthetics
    getProstheticOptions() {
        const lostLimbs = this.injuries.filter(i => i.severity === 'permanent' && (i.type === 'arm' || i.type === 'hand' || i.type === 'leg' || i.type === 'foot'));
        
        const options = [];
        lostLimbs.forEach(limb => {
            if (limb.type === 'arm' || limb.type === 'hand') {
                options.push(
                    { name: 'Iron Hook', cost: 200, type: 'weapon', modifier: 1.1, limbType: limb.type },
                    { name: 'Spear Arm', cost: 400, type: 'weapon', modifier: 1.3, limbType: limb.type },
                    { name: 'Flaming Torch Arm', cost: 600, type: 'weapon', modifier: 1.5, limbType: limb.type }
                );
            } else if (limb.type === 'leg' || limb.type === 'foot') {
                options.push(
                    { name: 'Wooden Peg', cost: 150, type: 'mobility', modifier: 0.8, limbType: limb.type },
                    { name: 'Iron Leg', cost: 350, type: 'mobility', modifier: 0.9, limbType: limb.type },
                    { name: 'Spring Leg', cost: 500, type: 'mobility', modifier: 1.1, limbType: limb.type }
                );
            }
        });
        
        return options;
    }
    
    installProsthetic(prosthetic) {
        this.equipment.prosthetics.push(prosthetic);
        // Remove the injury that the prosthetic replaces
        this.injuries = this.injuries.filter(i => !(i.severity === 'permanent' && i.type === prosthetic.limbType));
        this.isAvailable = true;
    }
}

// Gladiator name generator and management
class GladiatorManager {
    constructor() {
        this.gladiators = [];
        this.nextId = 1;
    }
    
    recruitGladiator(name = null) {
        const gladiator = new Gladiator(name);
        this.gladiators.push(gladiator);
        return gladiator;
    }
    
    getAvailableGladiators() {
        return this.gladiators.filter(g => g.isAlive && g.isAvailable);
    }
    
    getInjuredGladiators() {
        return this.gladiators.filter(g => g.isAlive && !g.isAvailable);
    }
    
    getDeadGladiators() {
        return this.gladiators.filter(g => !g.isAlive);
    }
    
    restAll() {
        this.gladiators.forEach(g => g.rest());
    }
    
    getGladiatorById(id) {
        return this.gladiators.find(g => g.id === id);
    }
}

