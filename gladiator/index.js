import { Gladiator } from './Gladiator.js';
import { GladiatorManager } from './Manager.js';

// Expose to global scope for use by existing plain scripts (game.js, UI components)
window.Gladiator = Gladiator;
window.GladiatorManager = GladiatorManager;