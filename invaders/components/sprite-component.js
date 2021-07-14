import { h } from '../lib/engine/engine.js';
import { settings } from '../settings.js';

export const spriteComponent = function ({ className, x, y }) {
  const { cellSize } = settings.grid;

  return h(`div.${className}`, {
    style: {
      width: cellSize,
      height: cellSize,
      left: `calc(${x} * ${cellSize})`,
      top: `calc(${y} * ${cellSize})`
    }
  });
};
