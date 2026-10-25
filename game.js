// Betula Grows — a tiny virtual pet on an LCD screen.

// The LCD is a grid of big "pixels". Each LCD pixel is drawn as a square
// of CELL_SIZE canvas pixels, with a small gap so the grid shows, like a real LCD.
const SCREEN_COLUMNS = 48;
const SCREEN_ROWS = 48;
const CELL_SIZE = 10;
const CELL_GAP = 1;

// Each LCD pixel is off, dim (icons that are not highlighted) or on.
const PIXEL = { off: 0, dim: 1, on: 2 };

const LCD_COLORS = {
  background: "#c4cfa1",
  pixelOn: "#1f2a1a",
  pixelDim: "rgba(31, 42, 26, 0.3)",
  pixelOff: "rgba(31, 42, 26, 0.07)",
};

// The row where the ground line is drawn.
const GROUND_ROW = 37;

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

// The 8 icons inside the LCD, as 5×5 sprites: 4 on top and 4 at the bottom, left to right.
// Attention is not a button: it only lights up when Betula needs something.
const SCREEN_ICONS = [
  {
    name: "menu",
    selectable: true,
    sprite: [
      "#####",
      ".....",
      "#####",
      ".....",
      "#####",
    ],
  },
  {
    name: "sun",
    selectable: true,
    sprite: [
      "#.#.#",
      ".###.",
      "#####",
      ".###.",
      "#.#.#",
    ],
  },
  {
    name: "water",
    selectable: true,
    sprite: [
      "..#..",
      ".###.",
      "#####",
      "#####",
      ".###.",
    ],
  },
  {
    name: "heart",
    selectable: true,
    sprite: [
      ".#.#.",
      "#####",
      "#####",
      ".###.",
      "..#..",
    ],
  },
  {
    name: "lamp",
    selectable: true,
    sprite: [
      ".###.",
      "#...#",
      ".#.#.",
      ".###.",
      ".###.",
    ],
  },
  {
    name: "broom",
    selectable: true,
    sprite: [
      "....#",
      "...#.",
      ".##..",
      "###..",
      "#.#..",
    ],
  },
  {
    name: "spray",
    selectable: true,
    sprite: [
      "###.#",
      ".#...",
      "###.#",
      "###..",
      "###..",
    ],
  },
  {
    name: "attention",
    selectable: false,
    sprite: [
      "..#..",
      "..#..",
      "..#..",
      ".....",
      "..#..",
    ],
  },
];

// Sun, Water and Heart each refill one need.
const ICON_NEEDS = { sun: "sun", water: "water", heart: "company" };

// A 3×5 pixel font for text inside the screen. Each character is its 5 rows, separated by commas.
const FONT_ROWS = {
  A: "###,#.#,###,#.#,#.#",
  B: "##.,#.#,##.,#.#,##.",
  C: "###,#..,#..,#..,###",
  D: "##.,#.#,#.#,#.#,##.",
  E: "###,#..,##.,#..,###",
  F: "###,#..,##.,#..,#..",
  G: "###,#..,#.#,#.#,###",
  H: "#.#,#.#,###,#.#,#.#",
  I: "###,.#.,.#.,.#.,###",
  J: "..#,..#,..#,#.#,###",
  K: "#.#,#.#,##.,#.#,#.#",
  L: "#..,#..,#..,#..,###",
  M: "#.#,###,###,#.#,#.#",
  N: "##.,#.#,#.#,#.#,#.#",
  O: "###,#.#,#.#,#.#,###",
  P: "###,#.#,###,#..,#..",
  Q: "###,#.#,#.#,###,..#",
  R: "##.,#.#,##.,#.#,#.#",
  S: "###,#..,###,..#,###",
  T: "###,.#.,.#.,.#.,.#.",
  U: "#.#,#.#,#.#,#.#,###",
  V: "#.#,#.#,#.#,#.#,.#.",
  W: "#.#,#.#,###,###,#.#",
  X: "#.#,#.#,.#.,#.#,#.#",
  Y: "#.#,#.#,.#.,.#.,.#.",
  Z: "###,..#,.#.,#..,###",
  0: "###,#.#,#.#,#.#,###",
  1: ".#.,##.,.#.,.#.,###",
  2: "###,..#,###,#..,###",
  3: "###,..#,.##,..#,###",
  4: "#.#,#.#,###,..#,..#",
  5: "###,#..,###,..#,###",
  6: "###,#..,###,#.#,###",
  7: "###,..#,..#,..#,..#",
  8: "###,#.#,###,#.#,###",
  9: "###,#.#,###,..#,###",
  "?": "###,..#,.##,...,.#.",
  "!": ".#.,.#.,.#.,...,.#.",
  " ": "...,...,...,...,...",
};
const FONT = Object.fromEntries(
  Object.entries(FONT_ROWS).map(([character, rows]) => [character, rows.split(",")])
);
const LETTER_WIDTH = 3;
const LETTER_HEIGHT = 5;
const LETTER_SPACING = 1;

const ARROW_SPRITES = {
  left: ["..#", ".##", "###", ".##", "..#"],
  right: ["#..", "##.", "###", "##.", "#.."],
};

// The menu is drawn in the screen in place of Betula, as pages browsed with the arrows.
// The first page shows the needs; the reset page is always the last one,
// so new pages go between them.
const MENU_PAGES = ["needs", "reset"];
const MENU_TOP = 9;
const MENU_BOTTOM = 38;
const MENU_ARROW_TOP = 19;
const MENU_ARROW_TAP_WIDTH = 7;
const MENU_DOTS_ROW = 34;

// Needs page: one row per need, with its icon and a bar that shows its level.
const NEEDS_PAGE_ROWS = [
  { need: "sun", icon: "sun" },
  { need: "water", icon: "water" },
  { need: "company", icon: "heart" },
];
const NEEDS_PAGE_TOP = 12;
const NEEDS_PAGE_ROW_SPACING = 7;
const NEEDS_PAGE_ICON_LEFT = 9;
const NEEDS_PAGE_BAR_LEFT = 17;
const NEEDS_PAGE_BAR_WIDTH = 22;
const NEEDS_PAGE_BAR_HEIGHT = 5;

// Reset page: one button, then a question with NO and YES.
const RESET_BUTTON_TOP = 17;
const RESET_QUESTION_TOP = 14;
const RESET_ANSWERS_TOP = 23;
const RESET_ANSWERS_GAP = 6;

// Buttons drawn in the screen get this much empty space around their text.
const SCREEN_BUTTON_PADDING_X = 3;
const SCREEN_BUTTON_PADDING_Y = 2;

// The gifts Betula can leave at the end of a life, drawn as 8×8 sprites.
const GIFTS = [
  {
    name: "pebble",
    label: "a pebble",
    rare: false,
    sprite: [
      "........",
      "........",
      "..####..",
      ".#....#.",
      "#..#...#",
      "#......#",
      ".######.",
      "........",
    ],
  },
  {
    name: "acorn",
    label: "an acorn",
    rare: false,
    sprite: [
      "...##...",
      ".######.",
      "########",
      ".#....#.",
      ".#....#.",
      "..#..#..",
      "...##...",
      "........",
    ],
  },
  {
    name: "feather",
    label: "a feather",
    rare: false,
    sprite: [
      "......##",
      ".....#.#",
      "....#.#.",
      "...#.#..",
      "..#.#...",
      ".#.#....",
      ".##.....",
      "#.......",
    ],
  },
  {
    name: "mushroom",
    label: "a mushroom",
    rare: false,
    sprite: [
      "..####..",
      ".#.##.#.",
      "#......#",
      "########",
      "..#..#..",
      "..#..#..",
      "..####..",
      "........",
    ],
  },
  {
    name: "flower",
    label: "a flower",
    rare: false,
    sprite: [
      "...#....",
      "..#.#...",
      ".#.#.#..",
      "..#.#...",
      "...#....",
      "...#.#..",
      "...##...",
      "...#....",
    ],
  },
  {
    name: "snail-shell",
    label: "a snail shell",
    rare: true,
    sprite: [
      "..####..",
      ".#....#.",
      "#..##..#",
      "#.#..#.#",
      "#.#.##.#",
      "#..#...#",
      ".#....#.",
      "..####..",
    ],
  },
  {
    name: "butterfly",
    label: "a butterfly",
    rare: true,
    sprite: [
      "........",
      "##....##",
      "#.#..#.#",
      "#..##..#",
      ".#.##.#.",
      "#..##..#",
      "#.#..#.#",
      "##....##",
    ],
  },
  {
    name: "star",
    label: "a star",
    rare: true,
    sprite: [
      "...##...",
      "...##...",
      "########",
      ".######.",
      "..####..",
      ".##..##.",
      ".#....#.",
      "........",
    ],
  },
];

// Shown on the shelf for gifts that have not been found yet.
const UNKNOWN_GIFT_SPRITE = [
  "..####..",
  ".#....#.",
  "......#.",
  ".....#..",
  "....#...",
  "....#...",
  "........",
  "....#...",
];

// The chance of a rare gift grows with the care score (0 to 100).
const RARE_CHANCE_NO_CARE = 0.05;
const RARE_CHANCE_FULL_CARE = 0.5;

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

// Layout of the icon rows: 4 slots of 12 columns each, with the icon in the middle of its slot.
const ICONS_PER_ROW = 4;
const ICON_SLOT_WIDTH = 12;
const ICONS_LEFT = 4;
const TOP_ICONS_TOP = 2;
const BOTTOM_ICONS_TOP = 41;

// Taps above this row hit the top icons; taps below the ground hit the bottom icons.
const TOP_ICONS_TAP_LIMIT = 9;

// Betula lives in real time. Speed mode for testing: ?speed=720 makes a full life last 2 minutes.
// Test speeds use their own save, so tests never touch the real Betula.
const NORMAL_SPEED = 1;
const speed = readSpeed();
const SAVE_KEY = speed === NORMAL_SPEED ? "betula-grows-v3" : "betula-grows-test";

// Saves from older versions: their life is replaced by a new one, but their gifts are kept.
const OLD_SAVE_KEYS = ["betula-grows", "betula-grows-v2"];
const OLD_TEST_SAVE_KEY = "betula-grows-speed";

const REDRAW_INTERVAL = 1000;

function readSpeed() {
  const value = Number(new URLSearchParams(window.location.search).get("speed"));
  return Number.isFinite(value) && value > 0 ? value : NORMAL_SPEED;
}

// Gathers the gift collections of older saves into one, then removes those saves.
function collectOldGifts() {
  const collection = {};
  OLD_SAVE_KEYS.forEach((key) => {
    try {
      const oldSave = JSON.parse(localStorage.getItem(key));
      Object.entries((oldSave && oldSave.collection) || {}).forEach(([name, count]) => {
        collection[name] = (collection[name] || 0) + count;
      });
      localStorage.removeItem(key);
    } catch (error) {
      // A broken or unreadable old save has no gifts to keep.
    }
  });
  try {
    localStorage.removeItem(OLD_TEST_SAVE_KEY);
  } catch (error) {
    // Nothing to clean up if storage is not available.
  }
  return collection;
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

// When a life is over, Betula leaves a gift and a new life starts right where
// the old one ended, with all needs full. This also catches up on lives that
// ended while the game was closed. Returns how many gifts were left.
function finishEndedLives(save, now) {
  let giftsLeft = 0;
  while (getAge(save, now) >= LIFE_DURATION) {
    const lifeEndTime = save.lifeStartTime + LIFE_DURATION / speed;
    updateNeeds(save, lifeEndTime);

    const gift = pickGift(getCareScore(save));
    save.collection[gift.name] = (save.collection[gift.name] || 0) + 1;
    save.newGifts.push(gift.name);
    giftsLeft++;

    save.lifeStartTime = lifeEndTime;
    save.needs = createFullNeeds();
    save.lastUpdateTime = lifeEndTime;
    save.careTotal = 0;
  }
  return giftsLeft;
}

// Lowers every need by the game time passed since the last update,
// and adds the care given in that time to the life's care total.
function updateNeeds(save, now) {
  const elapsed = Math.max(0, (now - save.lastUpdateTime) * speed);
  const dropPerMillisecond = NEED_FULL / NEED_EMPTY_DURATION;
  let careGiven = 0;

  NEEDS.forEach((need) => {
    const start = save.needs[need];
    const timeUntilEmpty = start / dropPerMillisecond;
    const end = Math.max(0, start - elapsed * dropPerMillisecond);

    // The need drops in a straight line and then stays at 0,
    // so the care given is the area under that line.
    if (elapsed <= timeUntilEmpty) {
      careGiven += ((start + end) / 2) * elapsed;
    } else {
      careGiven += (start / 2) * timeUntilEmpty;
    }
    save.needs[need] = end;
  });

  save.careTotal += careGiven / NEEDS.length;
  save.lastUpdateTime = now;
}

// The average level of all needs over a whole life, from 0 to 100.
function getCareScore(save) {
  return Math.min(NEED_FULL, save.careTotal / LIFE_DURATION);
}

function pickGift(careScore) {
  const care = careScore / NEED_FULL;
  const rareChance = RARE_CHANCE_NO_CARE + (RARE_CHANCE_FULL_CARE - RARE_CHANCE_NO_CARE) * care;
  const isRare = Math.random() < rareChance;
  const pool = GIFTS.filter((gift) => gift.rare === isRare);
  return pool[Math.floor(Math.random() * pool.length)];
}

function findGift(name) {
  return GIFTS.find((gift) => gift.name === name);
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

// A brand-new game: a seed with full needs and an empty collection.
function createNewSave(now) {
  return {
    lifeStartTime: now,
    needs: createFullNeeds(),
    lastUpdateTime: now,
    careTotal: 0,
    collection: {},
    newGifts: [],
  };
}

let save = loadSave();
if (!save) {
  save = createNewSave(Date.now());
  // Only the real game takes over old gifts; test speeds leave old saves alone.
  if (speed === NORMAL_SPEED) {
    save.collection = collectOldGifts();
  }
}
// Saves from older versions of the game get the parts they are missing.
if (!save.needs) {
  save.needs = createFullNeeds();
  save.lastUpdateTime = Date.now();
}
if (save.careTotal === undefined) {
  save.careTotal = 0;
}
if (!save.collection) {
  save.collection = {};
}
if (!save.newGifts) {
  save.newGifts = [];
}
writeSave(save);

// The icon that Select moves and OK uses; null when nothing is highlighted.
let highlightedIcon = null;

// The menu is not saved: it is always closed when the game opens.
const menuState = { isOpen: false, page: 0, isConfirmingReset: false, resetChoice: "no" };

// Areas of the screen that can be tapped while the menu is open, rebuilt on every redraw.
let menuTapTargets = [];

const canvas = document.getElementById("screen");
const context = canvas.getContext("2d");

canvas.width = SCREEN_COLUMNS * CELL_SIZE;
canvas.height = SCREEN_ROWS * CELL_SIZE;

// Builds an empty grid of LCD pixels, all off.
function createGrid(rows, columns) {
  const grid = [];
  for (let row = 0; row < rows; row++) {
    grid.push(new Array(columns).fill(PIXEL.off));
  }
  return grid;
}

function isInsideGrid(grid, row, column) {
  return row >= 0 && row < grid.length && column >= 0 && column < grid[0].length;
}

// Lights the pixels of a sprite, with its top-left corner at (left, top).
function placeSprite(grid, sprite, left, top, value = PIXEL.on) {
  sprite.forEach((line, spriteRow) => {
    [...line].forEach((character, spriteColumn) => {
      const row = top + spriteRow;
      const column = left + spriteColumn;
      if (character === "#" && isInsideGrid(grid, row, column)) {
        grid[row][column] = value;
      }
    });
  });
}

function placeGround(screen) {
  for (let column = 2; column < SCREEN_COLUMNS - 2; column++) {
    screen[GROUND_ROW][column] = PIXEL.on;
  }
}

function getIconPosition(index) {
  const slot = index % ICONS_PER_ROW;
  return {
    left: ICONS_LEFT + slot * ICON_SLOT_WIDTH,
    top: index < ICONS_PER_ROW ? TOP_ICONS_TOP : BOTTOM_ICONS_TOP,
  };
}

// Like a real Tamagotchi, icons are dim and only the highlighted one is dark.
function placeIcons(screen) {
  SCREEN_ICONS.forEach((icon, index) => {
    const { left, top } = getIconPosition(index);
    const isHighlighted = index === highlightedIcon;
    placeSprite(screen, icon.sprite, left, top, isHighlighted ? PIXEL.on : PIXEL.dim);
  });
}

function findScreenIcon(name) {
  return SCREEN_ICONS.find((icon) => icon.name === name);
}

function placeRectangle(grid, left, top, width, height, value) {
  for (let row = top; row < top + height; row++) {
    for (let column = left; column < left + width; column++) {
      if (isInsideGrid(grid, row, column)) {
        grid[row][column] = value;
      }
    }
  }
}

function placeOutline(grid, left, top, width, height, value) {
  placeRectangle(grid, left, top, width, 1, value);
  placeRectangle(grid, left, top + height - 1, width, 1, value);
  placeRectangle(grid, left, top, 1, height, value);
  placeRectangle(grid, left + width - 1, top, 1, height, value);
}

function getTextWidth(text) {
  return text.length * (LETTER_WIDTH + LETTER_SPACING) - LETTER_SPACING;
}

function placeText(grid, text, left, top, value = PIXEL.on) {
  [...text].forEach((character, index) => {
    placeSprite(grid, FONT[character], left + index * (LETTER_WIDTH + LETTER_SPACING), top, value);
  });
}

// The left column that centers something of this width on the screen.
function getCenteredLeft(width) {
  return Math.floor((SCREEN_COLUMNS - width) / 2);
}

function getScreenButtonWidth(text) {
  return getTextWidth(text) + 2 * SCREEN_BUTTON_PADDING_X;
}

// A tappable button with text: an outline, or filled with light text when highlighted.
function placeScreenButton(grid, text, left, top, isHighlighted, action) {
  const width = getScreenButtonWidth(text);
  const height = LETTER_HEIGHT + 2 * SCREEN_BUTTON_PADDING_Y;
  const textLeft = left + SCREEN_BUTTON_PADDING_X;
  const textTop = top + SCREEN_BUTTON_PADDING_Y;

  if (isHighlighted) {
    placeRectangle(grid, left, top, width, height, PIXEL.on);
    placeText(grid, text, textLeft, textTop, PIXEL.off);
  } else {
    placeOutline(grid, left, top, width, height, PIXEL.on);
    placeText(grid, text, textLeft, textTop);
  }
  menuTapTargets.push({ left, top, width, height, action });
}

function placeMenu(screen) {
  menuTapTargets = [];
  const page = MENU_PAGES[menuState.page];
  if (page === "needs") {
    placeNeedsPage(screen);
  } else if (page === "reset") {
    placeResetPage(screen);
  }

  // While the reset question is shown, only NO and YES can be used.
  if (!menuState.isConfirmingReset) {
    placeMenuArrows(screen);
    placePageDots(screen);
  }
}

function placeMenuArrows(screen) {
  const rightArrowLeft = SCREEN_COLUMNS - 1 - ARROW_SPRITES.right[0].length;
  placeSprite(screen, ARROW_SPRITES.left, 1, MENU_ARROW_TOP);
  placeSprite(screen, ARROW_SPRITES.right, rightArrowLeft, MENU_ARROW_TOP);

  // Each arrow can be tapped anywhere along its side of the menu.
  const height = MENU_BOTTOM - MENU_TOP;
  menuTapTargets.push({
    left: 0,
    top: MENU_TOP,
    width: MENU_ARROW_TAP_WIDTH,
    height,
    action: () => changeMenuPage(-1),
  });
  menuTapTargets.push({
    left: SCREEN_COLUMNS - MENU_ARROW_TAP_WIDTH,
    top: MENU_TOP,
    width: MENU_ARROW_TAP_WIDTH,
    height,
    action: () => changeMenuPage(1),
  });
}

// One small square per page: dark for the current page, dim for the others.
function placePageDots(screen) {
  const dotSize = 2;
  const dotSpacing = 4;
  const totalWidth = MENU_PAGES.length * dotSpacing - (dotSpacing - dotSize);
  const left = getCenteredLeft(totalWidth);
  MENU_PAGES.forEach((page, index) => {
    const value = index === menuState.page ? PIXEL.on : PIXEL.dim;
    placeRectangle(screen, left + index * dotSpacing, MENU_DOTS_ROW, dotSize, dotSize, value);
  });
}

function placeNeedsPage(screen) {
  NEEDS_PAGE_ROWS.forEach(({ need, icon }, index) => {
    const top = NEEDS_PAGE_TOP + index * NEEDS_PAGE_ROW_SPACING;
    placeSprite(screen, findScreenIcon(icon).sprite, NEEDS_PAGE_ICON_LEFT, top);

    placeOutline(screen, NEEDS_PAGE_BAR_LEFT, top, NEEDS_PAGE_BAR_WIDTH, NEEDS_PAGE_BAR_HEIGHT, PIXEL.on);
    const innerWidth = NEEDS_PAGE_BAR_WIDTH - 2;
    const filledWidth = Math.ceil((save.needs[need] / NEED_FULL) * innerWidth);
    placeRectangle(screen, NEEDS_PAGE_BAR_LEFT + 1, top + 1, filledWidth, NEEDS_PAGE_BAR_HEIGHT - 2, PIXEL.on);
  });
}

function placeResetPage(screen) {
  if (!menuState.isConfirmingReset) {
    const width = getScreenButtonWidth("RESET");
    placeScreenButton(screen, "RESET", getCenteredLeft(width), RESET_BUTTON_TOP, true, startResetQuestion);
    return;
  }

  const question = "ERASE ALL?";
  placeText(screen, question, getCenteredLeft(getTextWidth(question)), RESET_QUESTION_TOP);

  const noWidth = getScreenButtonWidth("NO");
  const yesWidth = getScreenButtonWidth("YES");
  const noLeft = getCenteredLeft(noWidth + RESET_ANSWERS_GAP + yesWidth);
  const yesLeft = noLeft + noWidth + RESET_ANSWERS_GAP;
  placeScreenButton(screen, "NO", noLeft, RESET_ANSWERS_TOP, menuState.resetChoice === "no", () =>
    answerResetQuestion("no")
  );
  placeScreenButton(screen, "YES", yesLeft, RESET_ANSWERS_TOP, menuState.resetChoice === "yes", () =>
    answerResetQuestion("yes")
  );
}

// Paints every LCD pixel on a canvas: dark if on, half-dark if dim, a faint "ghost" if off.
function drawGrid(drawingContext, grid) {
  const { canvas: target } = drawingContext;
  drawingContext.fillStyle = LCD_COLORS.background;
  drawingContext.fillRect(0, 0, target.width, target.height);

  const colors = [LCD_COLORS.pixelOff, LCD_COLORS.pixelDim, LCD_COLORS.pixelOn];
  const size = CELL_SIZE - CELL_GAP;
  grid.forEach((cells, row) => {
    cells.forEach((value, column) => {
      drawingContext.fillStyle = colors[value];
      drawingContext.fillRect(column * CELL_SIZE, row * CELL_SIZE, size, size);
    });
  });
}

function render() {
  const now = Date.now();
  const giftsLeft = finishEndedLives(save, now);
  updateNeeds(save, now);
  writeSave(save);

  if (giftsLeft > 0) {
    renderShelf();
    showGiftMessage();
  }

  const stage = getStage(getAge(save, now));
  const sprite = SPRITES[stage.name];
  const mood = isSad(save.needs) ? "sad" : "happy";
  const face = FACES[stage.face.size][mood];
  const screen = createGrid(SCREEN_ROWS, SCREEN_COLUMNS);

  // Center the sprite and let its last empty row sit on the ground line.
  const left = Math.floor((SCREEN_COLUMNS - sprite[0].length) / 2);
  const top = GROUND_ROW - sprite.length + 1;

  placeIcons(screen);
  if (menuState.isOpen) {
    placeMenu(screen);
  } else {
    placeGround(screen);
    placeSprite(screen, sprite, left, top);
    placeSprite(screen, face, left + stage.face.left, top + stage.face.top);
  }
  drawGrid(context, screen);
}

// Each shelf slot is a tiny LCD with a 1-pixel border around the 8×8 gift.
const SHELF_SLOT_SIZE = 10;
const shelf = document.getElementById("shelf");

function renderShelf() {
  shelf.replaceChildren();

  GIFTS.forEach((gift) => {
    const count = save.collection[gift.name] || 0;
    const isFound = count > 0;

    const slot = document.createElement("div");
    slot.className = "shelf-slot";
    slot.classList.toggle("rare", gift.rare && isFound);
    slot.classList.toggle("missing", !isFound);
    slot.setAttribute("role", "img");
    slot.setAttribute("aria-label", isFound ? `${gift.name.replace("-", " ")}, ${count}` : "Not found yet");

    const slotCanvas = document.createElement("canvas");
    slotCanvas.className = "shelf-canvas";
    slotCanvas.width = SHELF_SLOT_SIZE * CELL_SIZE;
    slotCanvas.height = SHELF_SLOT_SIZE * CELL_SIZE;

    const grid = createGrid(SHELF_SLOT_SIZE, SHELF_SLOT_SIZE);
    placeSprite(grid, isFound ? gift.sprite : UNKNOWN_GIFT_SPRITE, 1, 1);
    drawGrid(slotCanvas.getContext("2d"), grid);
    slot.append(slotCanvas);

    if (count > 1) {
      const badge = document.createElement("span");
      badge.className = "shelf-count";
      badge.textContent = `×${count}`;
      slot.append(badge);
    }

    shelf.append(slot);
  });
}

// The message stays until it is tapped, also after closing the game.
const giftMessage = document.getElementById("gift-message");

function showGiftMessage() {
  if (save.newGifts.length === 0) {
    giftMessage.hidden = true;
    return;
  }

  if (save.newGifts.length === 1) {
    const gift = findGift(save.newGifts[0]);
    giftMessage.textContent = `Betula left you ${gift.label}!${gift.rare ? " ★ Rare!" : ""}`;
  } else {
    giftMessage.textContent = `Betula left you ${save.newGifts.length} gifts while you were away!`;
  }
  giftMessage.hidden = false;
}

function dismissGiftMessage() {
  save.newGifts = [];
  writeSave(save);
  showGiftMessage();
}

giftMessage.addEventListener("click", dismissGiftMessage);

function openMenu() {
  menuState.isOpen = true;
  menuState.page = 0;
  menuState.isConfirmingReset = false;
}

function closeMenu() {
  menuState.isOpen = false;
  menuState.isConfirmingReset = false;
}

// Moves one page left (-1) or right (+1), going round from the last page to the first.
function changeMenuPage(step) {
  menuState.page = (menuState.page + step + MENU_PAGES.length) % MENU_PAGES.length;
}

// NO is chosen at first, so nothing is erased by accident.
function startResetQuestion() {
  menuState.isConfirmingReset = true;
  menuState.resetChoice = "no";
}

function answerResetQuestion(choice) {
  if (choice === "yes") {
    resetGame();
  } else {
    menuState.isConfirmingReset = false;
  }
}

function resetGame() {
  save = createNewSave(Date.now());
  writeSave(save);
  closeMenu();
  highlightedIcon = null;
  renderShelf();
  showGiftMessage();
}

// Highlights an icon and does what it does. Icons without an action yet only get highlighted.
// Menu opens and closes the menu; any other icon closes it first.
function useIcon(index) {
  const icon = SCREEN_ICONS[index];
  if (!icon.selectable) {
    return;
  }
  highlightedIcon = index;

  if (icon.name === "menu") {
    if (menuState.isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
    render();
    return;
  }

  closeMenu();
  const need = ICON_NEEDS[icon.name];
  if (need) {
    refillNeed(need);
  } else {
    render();
  }
}

// Moves the highlight to the next icon that can be used, skipping Attention.
function selectNextIcon() {
  let next = highlightedIcon;
  do {
    next = next === null ? 0 : (next + 1) % SCREEN_ICONS.length;
  } while (!SCREEN_ICONS[next].selectable);
  highlightedIcon = next;
}

// In the menu, Select turns the page, or switches between NO and YES.
function pressSelect() {
  if (!menuState.isOpen) {
    selectNextIcon();
  } else if (menuState.isConfirmingReset) {
    menuState.resetChoice = menuState.resetChoice === "no" ? "yes" : "no";
  } else {
    changeMenuPage(1);
  }
  render();
}

// In the menu, OK presses the button on the page, or answers the reset question.
function pressOk() {
  if (!menuState.isOpen) {
    if (highlightedIcon !== null) {
      useIcon(highlightedIcon);
    }
    return;
  }
  if (menuState.isConfirmingReset) {
    answerResetQuestion(menuState.resetChoice);
  } else if (MENU_PAGES[menuState.page] === "reset") {
    startResetQuestion();
  }
  render();
}

// Back answers NO to the reset question, closes the menu, or clears the highlight.
function pressBack() {
  if (menuState.isConfirmingReset) {
    menuState.isConfirmingReset = false;
  } else if (menuState.isOpen) {
    closeMenu();
  } else {
    highlightedIcon = null;
    if (save.newGifts.length > 0) {
      dismissGiftMessage();
    }
  }
  render();
}

// Converts a tap on the canvas into a position on the LCD grid.
function getTappedCell(event) {
  return {
    column: (event.offsetX / canvas.clientWidth) * SCREEN_COLUMNS,
    row: (event.offsetY / canvas.clientHeight) * SCREEN_ROWS,
  };
}

// Finds which icon is under a tap, or null if the tap is between the two icon rows.
function findTappedIcon({ column, row }) {
  let firstIndex;
  if (row < TOP_ICONS_TAP_LIMIT) {
    firstIndex = 0;
  } else if (row > GROUND_ROW) {
    firstIndex = ICONS_PER_ROW;
  } else {
    return null;
  }

  const slot = Math.floor(column / ICON_SLOT_WIDTH);
  return firstIndex + Math.min(ICONS_PER_ROW - 1, Math.max(0, slot));
}

function findMenuTapTarget({ column, row }) {
  return menuTapTargets.find(
    (target) =>
      column >= target.left &&
      column < target.left + target.width &&
      row >= target.top &&
      row < target.top + target.height
  );
}

canvas.addEventListener("click", (event) => {
  const cell = getTappedCell(event);
  const index = findTappedIcon(cell);
  if (index !== null) {
    useIcon(index);
    return;
  }

  if (menuState.isOpen) {
    const target = findMenuTapTarget(cell);
    if (target) {
      target.action();
      render();
    }
  }
});

document.getElementById("select-button").addEventListener("click", pressSelect);
document.getElementById("ok-button").addEventListener("click", pressOk);
document.getElementById("back-button").addEventListener("click", pressBack);

// The interval only redraws the screen; the stage and needs always come from saved times.
render();
renderShelf();
showGiftMessage();
setInterval(render, REDRAW_INTERVAL);
document.addEventListener("visibilitychange", render);
