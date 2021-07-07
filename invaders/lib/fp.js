export const noop = function () {};

export const constant = function (value) {
  return function () {
    return value;
  };
};
