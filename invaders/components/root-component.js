import { h } from '../lib/engine/engine.js';
import { layoutComponent } from './layout-component.js';

export const rootComponent = function ({ state }) {
  return h('div.root', [layoutComponent({ state })]);
};
