import { getAnimation } from './animation.js';

export const addCollider = function ({ animations: animationNames, respond }) {
  animationNames.map(getAnimation).forEach(function ({ colliders }) {
    colliders.push(respond);
  });
};
