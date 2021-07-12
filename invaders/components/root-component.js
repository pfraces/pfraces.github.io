import { h } from '../lib/game-engine.js';
import { layoutComponent } from './layout-component.js';

export const rootComponent = function ({ state }) {
  return h('div.root', [layoutComponent({ state })]);
};
