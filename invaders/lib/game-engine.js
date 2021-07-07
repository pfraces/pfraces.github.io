import { init, styleModule } from '../_snowpack/pkg/snabbdom.js';
export { h } from '../_snowpack/pkg/snabbdom.js';

const patch = init([styleModule]);

// ----------
// Animations
// ----------

const animations = [];
let isAnimationRunning = false;

const runAnimation = function () {
  isAnimationRunning = true;
};

const stopAnimation = function () {
  isAnimationRunning = false;
};

const addAnimation = function (animation) {
  animations.push({
    ...animation,
    timeLeft: animation.velocity()
  });
};

const applyAnimations = function (elapsed) {
  if (!isAnimationRunning) {
    return;
  }

  animations.forEach(function (animation) {
    animation.timeLeft -= elapsed;

    if (animation.timeLeft <= 0) {
      animation.update();
      animation.timeLeft += animation.velocity();
    }
  });
};

export const animation = {
  run: runAnimation,
  stop: stopAnimation,
  add: addAnimation
};

// ---------
// Colliders
// ---------

const colliders = [];

const addCollider = function (collider) {
  colliders.push(collider);
};

const applyColliders = function () {
  colliders.forEach(function (collider) {
    collider();
  });
};

export const collider = {
  add: addCollider
};

// ---------
// Game loop
// ---------

export const mount = function (root, component) {
  let vnode = component();
  let timestamp = 0;

  const gameLoop = function (newTimestamp) {
    const elapsed = newTimestamp - timestamp;

    if (timestamp > 0) {
      applyAnimations(elapsed);
      applyColliders();
    }

    const newVnode = component();
    patch(vnode, newVnode);

    vnode = newVnode;
    timestamp = newTimestamp;
    requestAnimationFrame(gameLoop);
  };

  patch(root, vnode);
  requestAnimationFrame(gameLoop);
};
