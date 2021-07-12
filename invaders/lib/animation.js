import { invoke } from './fp.js';

const animations = [];
let isAnimationRunning = false;

export const runAnimation = function () {
  isAnimationRunning = true;
};

export const stopAnimation = function () {
  isAnimationRunning = false;
};

export const addAnimation = function ({ name, velocity, update }) {
  animations.push({
    name,
    velocity,
    update,
    timeLeft: velocity(),
    colliders: []
  });
};

export const getAnimation = function (name) {
  return animations.find(function (animation) {
    return animation.name === name;
  });
};

export const applyAnimations = function (elapsed) {
  if (!isAnimationRunning) {
    return;
  }

  animations.forEach(function (animation) {
    animation.timeLeft -= elapsed;

    if (animation.timeLeft <= 0) {
      animation.update();
      animation.colliders.forEach(invoke);
      animation.timeLeft += animation.velocity();
    }
  });
};
