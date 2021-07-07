export const store = function (init) {
  let state = init();
  const listeners = [];

  const onStateChange = function (listener) {
    listeners.push(listener);
  };

  const getState = function (selector) {
    return selector(state);
  };

  const setState = function (update) {
    state = update(state);

    listeners.forEach(function (listener) {
      listener(state);
    });
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
