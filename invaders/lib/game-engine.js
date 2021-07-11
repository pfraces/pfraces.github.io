import { init, styleModule } from '../_snowpack/pkg/snabbdom.js';
import { invoke } from './fp.js';

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

    keyBindings[key].forEach(invoke);
  });
};

export const keyboard = {
  bind: addKeyBinding,
  reset: resetPressedKeys
};

// ------
// Sounds
// ------

const sounds = {};

const loadSound = function ({ name, url, volume = 1 }) {
  const sound = new Audio(url);
  sound.volume = volume;
  sounds[name] = sound;
};

const playSound = function (name) {
  const sound = sounds[name];
  sound.currentTime = 0;
  sound.play();
};

export const sound = {
  load: loadSound,
  play: playSound
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

const addAnimation = function ({ name, velocity, update }) {
  animations.push({
    name,
    velocity,
    update,
    timeLeft: velocity(),
    colliders: []
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
      animation.colliders.forEach(invoke);
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

const addCollider = function ({ animations: animationNames, response }) {
  animationNames
    .map(function (animationName) {
      return animations.find(function ({ name }) {
        return name === animationName;
      });
    })
    .forEach(function ({ colliders }) {
      colliders.push(response);
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
