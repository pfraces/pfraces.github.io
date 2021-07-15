const animations = [];
let isAnimationRunning = false;

export const addAnimation = function ({ id, velocity, update }) {
  animations.push({
    id,
    velocity,
    update,
    timeLeft: velocity(),
    colliders: []
  });
};

export const getAnimation = function (id) {
  return animations.find(function (animation) {
    return animation.id === id;
  });
};

export const applyAnimations = function (delta) {
  if (!isAnimationRunning) {
    return;
  }

  animations.forEach(function (animation) {
    animation.timeLeft -= delta;

    if (animation.timeLeft <= 0) {
      animation.update();

      animation.colliders.forEach(function (collider) {
        collider.respond();
      });

      animation.timeLeft += animation.velocity();
    }
  });
};

export const runAnimation = function () {
  isAnimationRunning = true;
};

export const stopAnimation = function () {
  isAnimationRunning = false;
};

export const resetAnimations = function () {
  animations.forEach(function (animation) {
    animation.timeLeft = animation.velocity();
  });
};
