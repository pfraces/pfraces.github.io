export const store = function (init) {
  let state = init();

  const getState = function (selector) {
    return selector(state);
  };

  const setState = function (update) {
    state = update(state);
  };

  const resetState = function () {
    state = init();
  };

  const withState = function (component) {
    return function (props) {
      return component({ state, ...props });
    };
  };

  return { getState, setState, resetState, withState };
};
