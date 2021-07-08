import { init, styleModule } from '../_snowpack/pkg/snabbdom.js';
export { h } from '../_snowpack/pkg/snabbdom.js';

const patch = init([styleModule]);

// ------------
// Key Bindings
// ------------

let pressedKeys = [];
const keyBindings = {};

document.addEventListener('keydown', function ({ code }) {
  const index = pressedKeys.indexOf(code);

  if (index === -1) {
    pressedKeys.push(code);
  }
});

document.addEventListener('keyup', function ({ code }) {
  const index = pressedKeys.indexOf(code);
  pressedKeys.splice(index, 1);
});

const resetPressedKeys = function () {
  pressedKeys = [];
};

const addKeyBinding = function (key, listener) {
  if (!keyBindings[key]) {
    keyBindings[key] = [];
  }

  keyBindings[key].push(listener);
};

const applyKeyBindings = function () {
  pressedKeys.forEach(function (key) {
    if (!keyBindings[key]) {
      return;
    }

    keyBindings[key].forEach(function (listener) {
      listener();
    });
  });
};

export const keyboard = {
  bind: addKeyBinding,
  reset: resetPressedKeys
};

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
    timeLeft: animation.velocity(),
    updated: false
  });
};

const applyAnimations = function (elapsed) {
  if (!isAnimationRunning) {
    return;
  }

  animations.forEach(function (animation) {
    animation.timeLeft -= elapsed;
    animation.updated = false;

    if (animation.timeLeft <= 0) {
      animation.update();
      animation.timeLeft += animation.velocity();
      animation.updated = true;
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
      applyKeyBindings();
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
