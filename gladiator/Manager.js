import { Gladiator } from './Gladiator.js';

export class GladiatorManager {
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

