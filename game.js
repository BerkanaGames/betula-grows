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

// Layout of the need bars at the top of the screen.
const NEED_GROUP_WIDTH = 10;
const NEED_ICON_TOP = 1;
const NEED_BAR_TOP = 7;
const NEED_BAR_LENGTH = 8;

// Game time runs 720 times faster than real time: a full life lasts 2 minutes.
// For testing, ?speed=N replaces it (?speed=1 is real time).
// Other speeds use their own save, so tests never touch the real Betula.
const NORMAL_SPEED = 720;
const speed = readSpeed();
const SAVE_KEY = speed === NORMAL_SPEED ? "betula-grows-v2" : "betula-grows-test";

// Saves from when the normal speed was real time would end hundreds of lives at once.
const OLD_SAVE_KEYS = ["betula-grows", "betula-grows-speed"];

const REDRAW_INTERVAL = 1000;

function readSpeed() {
  const value = Number(new URLSearchParams(window.location.search).get("speed"));
  return Number.isFinite(value) && value > 0 ? value : NORMAL_SPEED;
}

function removeOldSaves() {
  try {
    OLD_SAVE_KEYS.forEach((key) => localStorage.removeItem(key));
  } catch (error) {
    // Nothing to clean up if storage is not available.
  }
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

removeOldSaves();
let save = loadSave() || createNewSave(Date.now());
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

const canvas = document.getElementById("screen");
const context = canvas.getContext("2d");

canvas.width = SCREEN_COLUMNS * CELL_SIZE;
canvas.height = SCREEN_ROWS * CELL_SIZE;

// Builds an empty grid of LCD pixels, all off.
function createGrid(rows, columns) {
  const grid = [];
  for (let row = 0; row < rows; row++) {
    grid.push(new Array(columns).fill(false));
  }
  return grid;
}

function isInsideGrid(grid, row, column) {
  return row >= 0 && row < grid.length && column >= 0 && column < grid[0].length;
}

// Turns on the pixels of a sprite, with its top-left corner at (left, top).
function placeSprite(grid, sprite, left, top) {
  sprite.forEach((line, spriteRow) => {
    [...line].forEach((character, spriteColumn) => {
      const row = top + spriteRow;
      const column = left + spriteColumn;
      if (character === "#" && isInsideGrid(grid, row, column)) {
        grid[row][column] = true;
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

// Paints every LCD pixel on a canvas: dark if on, a faint "ghost" if off.
function drawGrid(drawingContext, grid) {
  const { canvas: target } = drawingContext;
  drawingContext.fillStyle = LCD_COLORS.background;
  drawingContext.fillRect(0, 0, target.width, target.height);

  const size = CELL_SIZE - CELL_GAP;
  grid.forEach((cells, row) => {
    cells.forEach((isOn, column) => {
      drawingContext.fillStyle = isOn ? LCD_COLORS.pixelOn : LCD_COLORS.pixelOff;
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

  placeNeedBars(screen, save.needs);
  placeGround(screen);
  placeSprite(screen, sprite, left, top);
  placeSprite(screen, face, left + stage.face.left, top + stage.face.top);
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

giftMessage.addEventListener("click", () => {
  save.newGifts = [];
  writeSave(save);
  showGiftMessage();
});

// The menu has two steps: the main list, and a confirmation before reset.
const menu = document.getElementById("menu");
const menuMain = document.getElementById("menu-main");
const menuConfirm = document.getElementById("menu-confirm");

function showMenuStep(step) {
  menuMain.hidden = step !== "main";
  menuConfirm.hidden = step !== "confirm";
}

function resetGame() {
  save = createNewSave(Date.now());
  writeSave(save);
  render();
  renderShelf();
  showGiftMessage();
}

document.getElementById("menu-button").addEventListener("click", () => {
  showMenuStep("main");
  menu.showModal();
});
document.getElementById("close-menu-button").addEventListener("click", () => menu.close());
document.getElementById("reset-button").addEventListener("click", () => showMenuStep("confirm"));
document.getElementById("cancel-reset-button").addEventListener("click", () => showMenuStep("main"));
document.getElementById("confirm-reset-button").addEventListener("click", () => {
  resetGame();
  menu.close();
});

// A tap on the dark area around the menu closes it.
menu.addEventListener("click", (event) => {
  if (event.target === menu) {
    menu.close();
  }
});

document.querySelectorAll("[data-need]").forEach((button) => {
  button.addEventListener("click", () => refillNeed(button.dataset.need));
});

// The interval only redraws the screen; the stage and needs always come from saved times.
render();
renderShelf();
showGiftMessage();
setInterval(render, REDRAW_INTERVAL);
document.addEventListener("visibilitychange", render);
