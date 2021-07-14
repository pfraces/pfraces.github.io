import { h } from '../lib/engine/engine.js';
import { lcdComponent } from './lcd-component.js';

const scoreComponent = function ({ score }) {
  return h('div.score', [lcdComponent({ number: score })]);
};
export const statsLayerComponent = function ({ score }) {
  return h('div.stats-layer', [scoreComponent({ score })]);
};
