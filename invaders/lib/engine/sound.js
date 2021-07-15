const sounds = {};

export const addSound = function ({ id, url, ...options }) {
  const defaults = { volume: 1, loop: false };
  const settings = { ...defaults, ...options };

  const sound = new Audio(url);
  sound.volume = settings.volume;
  sound.loop = settings.loop;

  sounds[id] = sound;
};

export const playSound = function (id) {
  const sound = sounds[id];
  sound.currentTime = 0;
  sound.play();
};

export const stopSound = function (id) {
  const sound = sounds[id];
  sound.pause();
};
