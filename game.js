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

// Sprites are 16×16 grids: "#" is a pixel that is on, "." is off.
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
};

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
  const screen = createEmptyScreen();
  const sprite = SPRITES.seed;

  // Center the sprite and let its last empty row sit on the ground line.
  const left = Math.floor((SCREEN_COLUMNS - sprite[0].length) / 2);
  const top = GROUND_ROW - sprite.length + 1;

  placeGround(screen);
  placeSprite(screen, sprite, left, top);
  drawScreen(screen);
}

render();
