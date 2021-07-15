import {
  addKeyBinding,
  applyKeyBindings,
  resetPressedKeys,
  listenKeyboard
} from './keyboard.js';
import { addSound, playSound, stopSound } from './sound.js';
import {
  addAnimation,
  applyAnimations,
  runAnimation,
  stopAnimation,
  resetAnimations
} from './animation.js';
import { addCollider } from './collider.js';
import { patch } from './vdom.js';

export { h } from './vdom.js';

export const keyboard = {
  bind: addKeyBinding,
  reset: resetPressedKeys,
  listen: listenKeyboard
};

export const sound = {
  add: addSound,
  play: playSound,
  stop: stopSound
};

export const animation = {
  add: addAnimation,
  run: runAnimation,
  stop: stopAnimation,
  reset: resetAnimations
};

export const collider = {
  add: addCollider
};

export const mount = function (root, component) {
  let vnode = component();
  let timestamp = 0;

  const gameLoop = function (newTimestamp) {
    const delta = newTimestamp - timestamp;

    if (timestamp > 0) {
      applyKeyBindings();
      applyAnimations(delta);
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
