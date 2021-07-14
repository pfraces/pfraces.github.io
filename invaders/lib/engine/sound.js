const sounds = {};

export const loadSound = function ({ name, url, volume = 1 }) {
  const sound = new Audio(url);
  sound.volume = volume;
  sounds[name] = sound;
};

export const playSound = function (name, options = {}) {
  const defaults = { currentTime: 0, loop: false };
  const settings = { ...defaults, ...options };

  const sound = sounds[name];
  sound.currentTime = settings.currentTime;
  sound.loop = settings.loop;
  sound.play();
};

export const pauseSound = function (name) {
  sounds[name].pause();
};
