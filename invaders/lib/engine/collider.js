import { getAnimation } from './animation.js';

export const addCollider = function ({ animations, respond }) {
  animations.map(getAnimation).forEach(function ({ colliders }) {
    colliders.push({ respond });
  });
};
