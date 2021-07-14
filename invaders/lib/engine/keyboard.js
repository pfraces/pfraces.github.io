let pressedKeys = [];
const keyBindings = {};

export const addKeyBinding = function (key, listener) {
  if (!keyBindings[key]) {
    keyBindings[key] = [];
  }

  keyBindings[key].push(listener);
};

export const applyKeyBindings = function () {
  pressedKeys
    .filter(function (pressedKey) {
      return keyBindings[pressedKey];
    })
    .flatMap(function (pressedKey) {
      return keyBindings[pressedKey];
    })
    .forEach(function (listener) {
      listener();
    });
};

export const resetPressedKeys = function () {
  pressedKeys = [];
};

export const listenKeyboard = function () {
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
};
