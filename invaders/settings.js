export const settings = {
  theme: {
    fontSize: '20px'
  },
  grid: {
    cellSize: '32px',
    cols: 17,
    rows: 17
  },
  scene: {
    invaderCols: 11,
    invaderRows: 5
  },
  score: {
    mysteryShip: 100,
    invaderType: {
      alfa: 30,
      beta: 20,
      gamma: 10
    }
  },
  mysteryShip: {
    velocity: 250,
    spawnVelocity: 15000
  },
  invader: {
    minVelocity: 50,
    incrementVelocity: 15
  },
  defender: {
    velocity: 50
  },
  projectile: {
    velocity: 50,
    maxConcurrency: 1,
    cooldown: 0
  }
};
