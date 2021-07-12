export const store = function (init) {
  let state = init();
  const listeners = [];
  let canEmitChanges = true;

  const onStateChange = function (listener) {
    listeners.push(listener);
  };

  const getState = function (selector) {
    return selector(state);
  };

  const emitStateChanges = function () {
    canEmitChanges = false;

    listeners.forEach(function (listener) {
      listener(state);
    });

    canEmitChanges = true;
  };

  const setState = function (update) {
    state = update(state);

    if (canEmitChanges) {
      emitStateChanges();
    }
  };

  const resetState = function () {
    state = init();
  };

  const withState = function (component) {
    return function (props) {
      return component({ state, ...props });
    };
  };

  return { onStateChange, getState, setState, resetState, withState };
};
