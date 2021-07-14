import { h } from '../lib/engine/engine.js';
import { settings } from '../settings.js';
import { worldLayerComponent } from './word-layer-component.js';
import { statsLayerComponent } from './stats-layer-component.js';
import { menuLayerComponent } from './menu-layer-component.js';

const canvasComponent = function ({ state }) {
  const { cellSize, cols, rows } = settings.grid;
  const { fontSize } = settings.theme;

  const {
    currentMenu,
    score,
    invaders,
    projectiles,
    explosions,
    defender,
    mysteryShip
  } = state;

  return h(
    'div.canvas',
    {
      style: {
        fontSize,
        width: `calc(${cellSize} * ${cols})`,
        height: `calc(${cellSize} * ${rows})`
      }
    },
    [
      worldLayerComponent({
        invaders,
        projectiles,
        explosions,
        defender,
        mysteryShip
      }),
      statsLayerComponent({ score }),
      menuLayerComponent({ currentMenu })
    ]
  );
};

const containerComponent = function ({ state }) {
  return h('div.container', [canvasComponent({ state })]);
};

export const layoutComponent = function ({ state }) {
  return h('div.layout', [containerComponent({ state })]);
};
