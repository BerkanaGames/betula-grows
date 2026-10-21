// Betula Grows — a tiny virtual pet on an LCD screen.

// The LCD is a grid of big "pixels". Each LCD pixel is drawn as a square
// of CELL_SIZE canvas pixels, with a small gap so the grid shows, like a real LCD.
const SCREEN_COLUMNS = 32;
const SCREEN_ROWS = 32;
const CELL_SIZE = 10;
const CELL_GAP = 1;

const LCD_COLORS = {
  background: "#c4cfa1",
  pixelOn: "#1f2a1a",
  pixelOff: "rgba(31, 42, 26, 0.07)",
};

// The row where the ground line is drawn.
const GROUND_ROW = 27;

// Sprites are small grids: "#" is a pixel that is on, "." is off.
// The last row of each sprite is empty and sits on the ground line.
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
    "....#.#..#.#....",
    "....#......#....",
    "....#..##..#....",
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
    "....#.#..#.#....",
    "....#......#....",
    "....#..##..#....",
    ".....######.....",
    "................",
  ],
  sapling: [
    "................",
    "......####......",
    "....##....##....",
    "...#........#...",
    "..#..........#..",
    "..#..#....#..#..",
    "..#..........#..",
    "..#...#..#...#..",
    "...#...##...#...",
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
    "#.....#......#.....#",
    "#..................#",
    "#......#....#......#",
    ".#......####......#.",
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

const HOUR = 60 * 60 * 1000;
const LIFE_DURATION = 24 * HOUR;

// Each stage starts at a given age of Betula's life.
const STAGES = [
  { name: "seed", startsAt: 0 },
  { name: "sprout", startsAt: 2 * HOUR },
  { name: "sapling", startsAt: 6 * HOUR },
  { name: "birch", startsAt: 12 * HOUR },
];

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

// Betula's age in game time, always calculated from the saved start time.
function getAge(save, now) {
  return (now - save.lifeStartTime) * speed;
}

// When a life is over, a new one starts right where the old one ended.
// This also catches up on lives that ended while the game was closed.
function startNewLivesIfNeeded(save, now) {
  const livesEnded = Math.floor(getAge(save, now) / LIFE_DURATION);
  if (livesEnded > 0) {
    save.lifeStartTime += (livesEnded * LIFE_DURATION) / speed;
    writeSave(save);
  }
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
  writeSave(save);
}

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

// Turns on the pixels of a sprite, with its top-left corner at (left, top).
function placeSprite(screen, sprite, left, top) {
  sprite.forEach((line, spriteRow) => {
    [...line].forEach((character, spriteColumn) => {
      const row = top + spriteRow;
      const column = left + spriteColumn;
      const isInside = row >= 0 && row < SCREEN_ROWS && column >= 0 && column < SCREEN_COLUMNS;
      if (character === "#" && isInside) {
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

  const stage = getStage(getAge(save, now));
  const sprite = SPRITES[stage.name];
  const screen = createEmptyScreen();

  // Center the sprite and let its last empty row sit on the ground line.
  const left = Math.floor((SCREEN_COLUMNS - sprite[0].length) / 2);
  const top = GROUND_ROW - sprite.length + 1;

  placeGround(screen);
  placeSprite(screen, sprite, left, top);
  drawScreen(screen);
}

// The interval only redraws the screen; the stage always comes from the saved time.
render();
setInterval(render, REDRAW_INTERVAL);
document.addEventListener("visibilitychange", render);
