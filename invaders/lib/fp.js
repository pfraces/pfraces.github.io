export const constant = function (value) {
  return function () {
    return value;
  };
};

export const invoke = function (f) {
  f();
};
