// Betula Grows — a tiny virtual pet on an LCD screen.

// The LCD is a grid of big "pixels". Each LCD pixel is drawn as a square
// of CELL_SIZE canvas pixels, with a small gap so the grid shows, like a real LCD.
const SCREEN_COLUMNS = 32;
const SCREEN_ROWS = 38;
const CELL_SIZE = 10;
const CELL_GAP = 1;

const LCD_COLORS = {
  background: "#c4cfa1",
  pixelOn: "#1f2a1a",
  pixelOff: "rgba(31, 42, 26, 0.07)",
};

// The row where the ground line is drawn.
const GROUND_ROW = 35;

// Sprites are small grids: "#" is a pixel that is on, "." is off.
// The last row of each stage sprite is empty and sits on the ground line.
// Stage sprites have no face: the face is drawn on top, so it can change mood.
const SPRITES = {
  seed: [
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    ".......##.......",
    "......#..#......",
    ".....#....#.....",
    "....#......#....",
    "....#......#....",
    "....#......#....",
    "....#......#....",
    ".....#....#.....",
    "......####......",
    "................",
  ],
  sprout: [
    "................",
    "................",
    "...###....###...",
    "..#...#..#...#..",
    "..#....##....#..",
    "...###.##.###...",
    ".......##.......",
    ".......##.......",
    "......####......",
    ".....#....#.....",
    "....#......#....",
    "....#......#....",
    "....#......#....",
    "....#......#....",
    ".....######.....",
    "................",
  ],
  sapling: [
    "................",
    "......####......",
    "....##....##....",
    "...#........#...",
    "..#..........#..",
    "..#..........#..",
    "..#..........#..",
    "..#..........#..",
    "...#........#...",
    "....##....##....",
    "......####......",
    "......#..#......",
    "......#.##......",
    "......#..#......",
    "......#..#......",
    "......##.#......",
    "......#..#......",
    ".....#....#.....",
    "................",
  ],
  birch: [
    "......########......",
    "....##........##....",
    "...#............#...",
    "..#..............#..",
    ".#................#.",
    ".#................#.",
    "#..................#",
    "#..................#",
    "#..................#",
    "#..................#",
    ".#................#.",
    ".#................#.",
    "..#..............#..",
    "...##...#..#...##...",
    ".....###....###.....",
    "........#..#........",
    "........#.##........",
    "........#..#........",
    "........##.#........",
    "........#..#........",
    "........#..#........",
    "........#.##........",
    "........#..#........",
    ".......#....#.......",
    "......#......#......",
    "....................",
  ],
};

// Faces in two sizes: small for the seed and sprout, large for the trees.
const FACES = {
  small: {
    happy: [
      "#..#",
      "....",
      "#..#",
      ".##.",
    ],
    sad: [
      "#..#",
      "....",
      ".##.",
      "#..#",
    ],
  },
  large: {
    happy: [
      "#......#",
      "........",
      ".#....#.",
      "..####..",
    ],
    sad: [
      "#......#",
      "........",
      "..####..",
      ".#....#.",
    ],
  },
};

// 5×5 icons shown above each need bar.
const NEED_ICONS = {
  water: [
    "..#..",
    ".###.",
    "#####",
    "#####",
    ".###.",
  ],
  sun: [
    "#.#.#",
    ".###.",
    "#####",
    ".###.",
    "#.#.#",
  ],
  company: [
    ".#.#.",
    "#####",
    "#####",
    ".###.",
    "..#..",
  ],
};

const HOUR = 60 * 60 * 1000;
const LIFE_DURATION = 24 * HOUR;

// Each stage starts at a given age of Betula's life.
// The face position is measured from the top-left corner of the stage sprite.
const STAGES = [
  { name: "seed", startsAt: 0, face: { size: "small", left: 6, top: 9 } },
  { name: "sprout", startsAt: 2 * HOUR, face: { size: "small", left: 6, top: 10 } },
  { name: "sapling", startsAt: 6 * HOUR, face: { size: "large", left: 4, top: 5 } },
  { name: "birch", startsAt: 12 * HOUR, face: { size: "large", left: 6, top: 7 } },
];

// Each need goes from 100 to 0 in NEED_EMPTY_DURATION.
const NEEDS = ["water", "sun", "company"];
const NEED_FULL = 100;
const NEED_EMPTY_DURATION = 4 * HOUR;
const SAD_THRESHOLD = 30;

// Layout of the need bars at the top of the screen.
const NEED_GROUP_WIDTH = 10;
const NEED_ICON_TOP = 1;
const NEED_BAR_TOP = 7;
const NEED_BAR_LENGTH = 8;

// Speed mode for testing: ?speed=720 makes a full life last 2 minutes.
// It uses its own save, so tests never touch the real Betula.
const speed = readSpeed();
const SAVE_KEY = speed === 1 ? "betula-grows" : "betula-grows-speed";

const REDRAW_INTERVAL = 1000;

function readSpeed() {
  const value = Number(new URLSearchParams(window.location.search).get("speed"));
  return Number.isFinite(value) && value > 0 ? value : 1;
}

function loadSave() {
  try {
    return JSON.parse(localStorage.getItem(SAVE_KEY)) || null;
  } catch (error) {
    return null;
  }
}

function writeSave(save) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(save));
  } catch (error) {
    // Saving can fail in private browsing; the game still runs for this visit.
  }
}

function createFullNeeds() {
  const needs = {};
  NEEDS.forEach((need) => {
    needs[need] = NEED_FULL;
  });
  return needs;
}

// Betula's age in game time, always calculated from the saved start time.
function getAge(save, now) {
  return (now - save.lifeStartTime) * speed;
}

// When a life is over, a new one starts right where the old one ended,
// with all needs full. This also catches up on lives that ended while the game was closed.
function startNewLivesIfNeeded(save, now) {
  const livesEnded = Math.floor(getAge(save, now) / LIFE_DURATION);
  if (livesEnded > 0) {
    save.lifeStartTime += (livesEnded * LIFE_DURATION) / speed;
    save.needs = createFullNeeds();
    save.lastUpdateTime = save.lifeStartTime;
  }
}

// Lowers every need by the game time passed since the last update.
function updateNeeds(save, now) {
  const elapsed = (now - save.lastUpdateTime) * speed;
  const drop = (elapsed / NEED_EMPTY_DURATION) * NEED_FULL;
  NEEDS.forEach((need) => {
    save.needs[need] = Math.max(0, save.needs[need] - drop);
  });
  save.lastUpdateTime = now;
}

function refillNeed(need) {
  updateNeeds(save, Date.now());
  save.needs[need] = NEED_FULL;
  writeSave(save);
  render();
}

function isSad(needs) {
  return NEEDS.some((need) => needs[need] < SAD_THRESHOLD);
}

function getStage(age) {
  let current = STAGES[0];
  for (const stage of STAGES) {
    if (age >= stage.startsAt) {
      current = stage;
    }
  }
  return current;
}

let save = loadSave();
if (!save) {
  save = { lifeStartTime: Date.now() };
}
// Saves from before the needs existed start with all needs full.
if (!save.needs) {
  save.needs = createFullNeeds();
  save.lastUpdateTime = Date.now();
}
writeSave(save);

const canvas = document.getElementById("screen");
const context = canvas.getContext("2d");

canvas.width = SCREEN_COLUMNS * CELL_SIZE;
canvas.height = SCREEN_ROWS * CELL_SIZE;

// Builds an empty grid of LCD pixels, all off.
function createEmptyScreen() {
  const screen = [];
  for (let row = 0; row < SCREEN_ROWS; row++) {
    screen.push(new Array(SCREEN_COLUMNS).fill(false));
  }
  return screen;
}

function isOnScreen(row, column) {
  return row >= 0 && row < SCREEN_ROWS && column >= 0 && column < SCREEN_COLUMNS;
}

// Turns on the pixels of a sprite, with its top-left corner at (left, top).
function placeSprite(screen, sprite, left, top) {
  sprite.forEach((line, spriteRow) => {
    [...line].forEach((character, spriteColumn) => {
      const row = top + spriteRow;
      const column = left + spriteColumn;
      if (character === "#" && isOnScreen(row, column)) {
        screen[row][column] = true;
      }
    });
  });
}

function placeGround(screen) {
  for (let column = 2; column < SCREEN_COLUMNS - 2; column++) {
    screen[GROUND_ROW][column] = true;
  }
}

// Each need gets an icon with a bar below it that empties as the need drops.
function placeNeedBars(screen, needs) {
  NEEDS.forEach((need, index) => {
    const groupLeft = 1 + index * NEED_GROUP_WIDTH;
    placeSprite(screen, NEED_ICONS[need], groupLeft + 2, NEED_ICON_TOP);

    const filledLength = Math.ceil((needs[need] / NEED_FULL) * NEED_BAR_LENGTH);
    for (let i = 0; i < filledLength; i++) {
      screen[NEED_BAR_TOP][groupLeft + i] = true;
    }
  });
}

// Paints every LCD pixel on the canvas: dark if on, a faint "ghost" if off.
function drawScreen(screen) {
  context.fillStyle = LCD_COLORS.background;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const size = CELL_SIZE - CELL_GAP;
  screen.forEach((cells, row) => {
    cells.forEach((isOn, column) => {
      context.fillStyle = isOn ? LCD_COLORS.pixelOn : LCD_COLORS.pixelOff;
      context.fillRect(column * CELL_SIZE, row * CELL_SIZE, size, size);
    });
  });
}

function render() {
  const now = Date.now();
  startNewLivesIfNeeded(save, now);
  updateNeeds(save, now);
  writeSave(save);

  const stage = getStage(getAge(save, now));
  const sprite = SPRITES[stage.name];
  const mood = isSad(save.needs) ? "sad" : "happy";
  const face = FACES[stage.face.size][mood];
  const screen = createEmptyScreen();

  // Center the sprite and let its last empty row sit on the ground line.
  const left = Math.floor((SCREEN_COLUMNS - sprite[0].length) / 2);
  const top = GROUND_ROW - sprite.length + 1;

  placeNeedBars(screen, save.needs);
  placeGround(screen);
  placeSprite(screen, sprite, left, top);
  placeSprite(screen, face, left + stage.face.left, top + stage.face.top);
  drawScreen(screen);
}

document.querySelectorAll("[data-need]").forEach((button) => {
  button.addEventListener("click", () => refillNeed(button.dataset.need));
});

// The interval only redraws the screen; the stage and needs always come from saved times.
render();
setInterval(render, REDRAW_INTERVAL);
document.addEventListener("visibilitychange", render);
