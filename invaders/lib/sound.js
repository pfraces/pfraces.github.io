const sounds = {};

export const loadSound = function ({ name, url, volume = 1 }) {
  const sound = new Audio(url);
  sound.volume = volume;
  sounds[name] = sound;
};

export const playSound = function (name) {
  const sound = sounds[name];
  sound.currentTime = 0;
  sound.play();
};
