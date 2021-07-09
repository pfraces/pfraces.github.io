import { mount, h, keyboard, animation, collider } from './lib/game-engine.js';
import { store } from './lib/store.js';
import { constant } from './lib/fp.js';

// -----
// Enums
// -----

const menu = {
  none: 'none',
  controls: 'controls',
  pause: 'pause',
  youwin: 'youwin',
  gameover: 'gameover'
};

// --------
// Settings
// --------

const settings = {
  fontSize: '20px',
  cellSize: '32px',
  gridCols: 17,
  gridRows: 17,
  invaderCols: 11,
  invaderRows: 5,
  invadersMinVelocity: 50,
  invadersIncrementVelocity: 15,
  defenderVelocity: 50,
  projectilesVelocity: 50,
  maxConcurrentProjectiles: 1
};

// -----
// Store
// -----

const invaderType = function (row) {
  if (row === 0) {
    return 'alfa';
  }

  if (row <= 2) {
    return 'beta';
  }

  return 'gamma';
};

const initInvaders = function () {
  const { gridCols, invaderCols, invaderRows } = settings;
  const invaderOffsetX = (gridCols - invaderCols) / 2;
  const invaderOffsetY = 1;

  return [...Array(invaderRows)]
    .map(function (row, rowIndex) {
      return [...Array(invaderCols)].map(function (col, colIndex) {
        return {
          type: invaderType(rowIndex),
          x: colIndex + invaderOffsetX,
          y: rowIndex + invaderOffsetY
        };
      });
    })
    .flat();
};

const gameState = store(function () {
  const { gridCols, gridRows } = settings;
  const colEnd = gridRows - 1;

  return {
    currentMenu: menu.controls,
    defender: {
      x: Math.ceil(gridCols / 2) - 1,
      y: colEnd
    },
    defenderDirection: 0,
    projectiles: [],
    explosions: [],
    invaders: initInvaders(),
    invadersDirection: 1
  };
});

const { onStateChange, getState, setState, resetState, withState } = gameState;

// ------------
// Key Bindings
// ------------

const play = function () {
  keyboard.reset();

  setState(function (state) {
    return {
      ...state,
      currentMenu: menu.none
    };
  });
};

const pause = function () {
  keyboard.reset();

  setState(function (state) {
    return {
      ...state,
      currentMenu: menu.pause
    };
  });
};

const reset = function () {
  keyboard.reset();
  resetState();
};

const moveDefenderLeft = function () {
  setState(function (state) {
    return {
      ...state,
      defenderDirection: -1
    };
  });
};

const moveDefenderRight = function () {
  setState(function (state) {
    return {
      ...state,
      defenderDirection: 1
    };
  });
};

const fire = function () {
  const { maxConcurrentProjectiles } = settings;

  setState(function (state) {
    const { projectiles } = state;

    const newProjectile = {
      x: state.defender.x,
      y: state.defender.y - 1
    };

    const projectileOverlap = projectiles.find(function (projectile) {
      return newProjectile.y === projectile.y;
    });

    if (projectileOverlap || projectiles.length === maxConcurrentProjectiles) {
      return state;
    }

    return {
      ...state,
      projectiles: [...projectiles, newProjectile]
    };
  });
};

const onMenu = function (menuId, action) {
  return function () {
    const idMatches = getState(function ({ currentMenu }) {
      return currentMenu === menuId;
    });

    if (idMatches) {
      action();
    }
  };
};

keyboard.bind('ArrowLeft', onMenu(menu.none, moveDefenderLeft));
keyboard.bind('ArrowRight', onMenu(menu.none, moveDefenderRight));
keyboard.bind('Space', onMenu(menu.none, fire));
keyboard.bind('Escape', onMenu(menu.none, pause));

keyboard.bind('Space', onMenu(menu.controls, play));
keyboard.bind('Space', onMenu(menu.pause, play));
keyboard.bind('Escape', onMenu(menu.youwin, reset));
keyboard.bind('Escape', onMenu(menu.gameover, reset));

// ----------
// Animations
// ----------

const defenderAnimation = {
  velocity: constant(settings.defenderVelocity),
  update: function () {
    setState(function (state) {
      return {
        ...state,
        defender: {
          ...state.defender,
          x: state.defender.x + state.defenderDirection
        },
        defenderDirection: 0
      };
    });
  }
};

const invadersVelocity = function () {
  const { invadersMinVelocity, invadersIncrementVelocity } = settings;

  return getState(function (state) {
    const invadersLength = state.invaders.length;
    return invadersMinVelocity + invadersLength * invadersIncrementVelocity;
  });
};

const invadersAnimation = {
  velocity: invadersVelocity,
  update: function () {
    setState(function (state) {
      return {
        ...state,
        invaders: state.invaders.map(function (invader) {
          return {
            ...invader,
            x: invader.x + state.invadersDirection
          };
        })
      };
    });
  }
};

const projectilesAnimation = {
  velocity: constant(settings.projectilesVelocity),
  update: function () {
    setState(function (state) {
      return {
        ...state,
        projectiles: state.projectiles.map(function (projectile) {
          return {
            ...projectile,
            y: projectile.y - 1
          };
        })
      };
    });
  }
};

const explosionsAnimation = {
  velocity: invadersVelocity,
  update: function () {
    setState(function (state) {
      return {
        ...state,
        explosions: []
      };
    });
  }
};

animation.add(defenderAnimation);
animation.add(invadersAnimation);
animation.add(projectilesAnimation);
animation.add(explosionsAnimation);

// ---------
// Colliders
// ---------

const defenderOutOfBoundsCollider = function () {
  const { gridCols } = settings;
  const rowStart = 0;
  const rowEnd = gridCols - 1;

  setState(function (state) {
    let x = state.defender.x;

    if (x < rowStart) {
      x = rowStart;
    }

    if (x > rowEnd) {
      x = rowEnd;
    }

    return {
      ...state,
      defender: {
        ...state.defender,
        x
      }
    };
  });
};

const invadersOutOfBoundsCollider = function () {
  const { gridCols } = settings;
  const rowStart = 0;
  const rowEnd = gridCols - 1;

  setState(function (state) {
    if (!state.invaders.length) {
      return state;
    }

    const leftMostInvader = state.invaders.reduce(function (acc, invader) {
      return invader.x < acc.x ? invader : acc;
    });

    const rightMostInvader = state.invaders.reduce(function (acc, invader) {
      return invader.x > acc.x ? invader : acc;
    });

    let invadersDirection = state.invadersDirection;
    let invaders = state.invaders;

    if (rightMostInvader.x > rowEnd || leftMostInvader.x < rowStart) {
      invadersDirection *= -1;

      invaders = invaders.map(function (invader) {
        return {
          ...invader,
          x: invader.x + invadersDirection,
          y: invader.y + 1
        };
      });
    }

    return {
      ...state,
      invadersDirection,
      invaders
    };
  });
};

const invadersLandingCollider = function () {
  setState(function (state) {
    const { gridRows } = settings;
    const colEnd = gridRows - 1;

    const invaderLanded = state.invaders.some(function (invader) {
      return invader.y === colEnd;
    });

    let currentMenu = state.currentMenu;

    if (invaderLanded) {
      currentMenu = menu.gameover;
    }

    return {
      ...state,
      currentMenu
    };
  });
};

const projectileLostCollider = function () {
  setState(function (state) {
    return {
      ...state,
      projectiles: state.projectiles.filter(function (projectile) {
        return projectile.y >= 0;
      })
    };
  });
};

const projectileHitCollider = function () {
  setState(function (state) {
    const collisions = [];

    state.projectiles.forEach(function (projectile) {
      const collidedInvader = state.invaders.find(function (invader) {
        return invader.x === projectile.x && invader.y === projectile.y;
      });

      if (collidedInvader) {
        collisions.push({
          x: collidedInvader.x,
          y: collidedInvader.y
        });
      }
    });

    const projectiles = state.projectiles.filter(function (projectile) {
      return !collisions.find(function (collision) {
        return projectile.x === collision.x && projectile.y === collision.y;
      });
    });

    const invaders = state.invaders.filter(function (invader) {
      return !collisions.find(function (collision) {
        return invader.x === collision.x && invader.y === collision.y;
      });
    });

    let currentMenu = state.currentMenu;

    if (!invaders.length) {
      currentMenu = menu.youwin;
    }

    return {
      ...state,
      currentMenu,
      projectiles,
      explosions: [...state.explosions, ...collisions],
      invaders
    };
  });
};

collider.add(defenderOutOfBoundsCollider);
collider.add(invadersOutOfBoundsCollider);
collider.add(invadersLandingCollider);
collider.add(projectileLostCollider);
collider.add(projectileHitCollider);

// ---------------
// State listeners
// ---------------

onStateChange(function ({ currentMenu }) {
  const action = currentMenu === menu.none ? 'run' : 'stop';
  animation[action]();
});

// ----------
// Components
// ----------

const spriteComponent = function ({ className, x, y }) {
  const { cellSize } = settings;

  return h(`div.${className}`, {
    style: {
      width: cellSize,
      height: cellSize,
      left: `calc(${x} * ${cellSize})`,
      top: `calc(${y} * ${cellSize})`
    }
  });
};

const invaderComponent = function ({ type, x, y }) {
  return spriteComponent({ className: `invader-${type}`, x, y });
};

const defenderComponent = function ({ x, y }) {
  return spriteComponent({ className: 'defender', x, y });
};

const projectileComponent = function ({ x, y }) {
  return spriteComponent({ className: 'projectile', x, y });
};

const explosionComponent = function ({ x, y }) {
  return spriteComponent({ className: 'explosion', x, y });
};

const worldLayerComponent = function ({
  invaders,
  projectiles,
  explosions,
  defender
}) {
  return h('div.world-layer', [
    ...invaders.map(invaderComponent),
    ...projectiles.map(projectileComponent),
    ...explosions.map(explosionComponent),
    defenderComponent(defender)
  ]);
};

const menuTitleComponent = function () {
  const { fontSize } = settings;

  return h(
    'pre.menu-title',
    {
      style: {
        fontSize: `calc(${fontSize} * 0.75)`
      }
    },
    [
      '    ____                     __              ',
      '   /  _/___ _   ______ _____/ /__  __________',
      '   / // __ \\ | / / __ `/ __  / _ \\/ ___/ ___/',
      ' _/ // / / / |/ / /_/ / /_/ /  __/ /  (__  ) ',
      '/___/_/ /_/|___/\\__,_/\\__,_/\\___/_/  /____/  '
    ].join('\n')
  );
};

const menuContentControlsComponent = function () {
  return h('div.menu-content', [
    h('p', 'CONTROLS'),
    h('ul', [
      h('li', 'LEFT / RIGHT: Move defender'),
      h('li', 'SPACEBAR: Fire'),
      h('li', 'ESCAPE: Pause')
    ]),
    h('p', 'Press SPACEBAR to start')
  ]);
};

const menuContentPauseComponent = function () {
  return h('div.menu-content', [
    h('p', 'PAUSED'),
    h('p', 'Press SPACEBAR to resume')
  ]);
};

const menuContentYouWinComponent = function () {
  return h('div.menu-content', [
    h('p', 'YOU WIN!'),
    h('p', 'Press ESCAPE to restart')
  ]);
};

const menuContentGameOverComponent = function () {
  return h('div.menu-content', [
    h('p', 'GAME OVER'),
    h('p', 'Press ESCAPE to restart')
  ]);
};

const menuLayerComponent = function ({ currentMenu }) {
  if (currentMenu === menu.none) {
    return null;
  }

  let menuContentComponent = constant(null);

  if (currentMenu === menu.controls) {
    menuContentComponent = menuContentControlsComponent;
  }

  if (currentMenu === menu.pause) {
    menuContentComponent = menuContentPauseComponent;
  }

  if (currentMenu === menu.youwin) {
    menuContentComponent = menuContentYouWinComponent;
  }

  if (currentMenu === menu.gameover) {
    menuContentComponent = menuContentGameOverComponent;
  }

  return h('div.menu-layer', [menuTitleComponent(), menuContentComponent()]);
};

const canvasComponent = function ({ state }) {
  const { fontSize, cellSize, gridCols, gridRows } = settings;
  const { currentMenu, invaders, projectiles, explosions, defender } = state;

  return h(
    'div.canvas',
    {
      style: {
        fontSize,
        width: `calc(${cellSize} * ${gridCols})`,
        height: `calc(${cellSize} * ${gridRows})`
      }
    },
    [
      worldLayerComponent({ invaders, projectiles, explosions, defender }),
      menuLayerComponent({ currentMenu })
    ]
  );
};

const containerComponent = function ({ state }) {
  return h('div.container', [canvasComponent({ state })]);
};

const rootComponent = function ({ state }) {
  return h('div.root', [containerComponent({ state })]);
};

// ----
// Init
// ----

mount(document.getElementById('root'), withState(rootComponent));
