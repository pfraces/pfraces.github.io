import {
  addKeyBinding,
  applyKeyBindings,
  resetPressedKeys,
  listenKeyboard
} from './keyboard.js';
import { loadSound, playSound, pauseSound } from './sound.js';
import {
  runAnimation,
  stopAnimation,
  addAnimation,
  applyAnimations,
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
  load: loadSound,
  play: playSound,
  stop: pauseSound
};

export const animation = {
  run: runAnimation,
  stop: stopAnimation,
  add: addAnimation,
  reset: resetAnimations
};

export const collider = {
  add: addCollider
};

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
