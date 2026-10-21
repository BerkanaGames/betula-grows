# Betula Grows

## What it is
A tiny virtual-pet game in the spirit of the original Tamagotchi. You look after Betula, a small birch tree, through a 24-hour game life that lasts 2 minutes of real time. This is a learning project: simple and working beats polished. It will not be released in app stores.

## Look
- Pixel art drawn in code: each sprite is a small grid (about 16×16) of on/off pixels, drawn on a canvas.
- Classic LCD look: greenish screen with dark pixels, like a real Tamagotchi.
- One screen, portrait, mobile-first, big touch-friendly buttons.

## Life cycle (24 game hours = 2 real minutes)
Game time runs 720 times faster than real time.

| Stage   | Duration (game) | Duration (real) | Starts at (game) |
|---------|-----------------|-----------------|------------------|
| Seed    | 2 h             | 10 s            | 0 h              |
| Sprout  | 4 h             | 20 s            | 2 h              |
| Sapling | 6 h             | 30 s            | 6 h              |
| Birch   | 12 h            | 60 s            | 12 h             |
- Growth depends only on time, also while the game is closed. Always calculate it from saved timestamps, never from a running timer.
- At 24 h Betula leaves a gift, her life ends and she becomes a seed again. A new life starts.

## Needs
- Three needs: water, sun and company. Each goes from 100 to 0.
- Each need drops by itself over time (4 game hours, 20 real seconds, from full to empty), also while the game is closed.
- One button per need refills it.
- Betula never dies from neglect: when a need is low, she looks sad or wilted.
- Care matters: the better Betula was cared for during her life, the higher the chance of a rare gift.

## Gifts
- One gift at the end of each life.
- A pool of about 8 gifts drawn in pixel art (for example acorn, feather, mushroom, pebble, flower, snail shell, butterfly, star). Most are common, a few are rare.
- Gifts go to a collection shelf visible on screen and are kept forever, across lives.

## Saving
- Save everything in the browser with localStorage: life start time, needs, last update time and the collection.
- A reset option inside a small menu, with a confirmation step.

## Testing
- Speed override: if the URL contains ?speed=N, game time runs N times faster than real time instead of the normal 720 (?speed=1 is real time, ?speed=7200 makes a full life last 12 seconds).
- Any speed other than the normal one uses its own test save, so tests never touch the real Betula.

## Tech
- Plain HTML, CSS and JavaScript: index.html, style.css and game.js. Split into more files only if needed.
- Hosted on GitHub Pages at berkanagames.com/betula-grows.

## Out of scope for now
- A merge mini-game to create water and sunlight (maybe later).
- Sound, accounts, ads and app stores.
