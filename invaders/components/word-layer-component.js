import { h } from '../lib/engine/engine.js';
import { spriteComponent } from './sprite-component.js';

const invaderComponent = function ({ type, x, y }) {
  return spriteComponent({ className: `invader-${type}`, x, y });
};

const mysteryShipComponent = function ({ x, y }) {
  return spriteComponent({ className: 'mystery-ship', x, y });
};

const defenderComponent = function ({ x, y }) {
  return spriteComponent({ className: 'defender', x, y });
};

const projectileComponent = function ({ x, y }) {
  return spriteComponent({ className: 'projectile', x, y });
};

const explosionComponent = function ({ x, y }) {
  return spriteComponent({ className: 'explosion', x, y });
};

export const worldLayerComponent = function ({
  invaders,
  projectiles,
  explosions,
  defender,
  mysteryShip
}) {
  return h('div.world-layer', [
    ...invaders.map(invaderComponent),
    ...projectiles.map(projectileComponent),
    ...explosions.map(explosionComponent),
    defender && defenderComponent(defender),
    mysteryShip && mysteryShipComponent(mysteryShip)
  ]);
};
