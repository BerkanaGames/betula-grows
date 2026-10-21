# Betula Grows

## What it is
A tiny virtual-pet game in the spirit of the original Tamagotchi. You look after Betula, a small birch tree, through a 24-hour life. This is a learning project: simple and working beats polished. It will not be released in app stores.

## Look
- Pixel art drawn in code: each sprite is a small grid (about 16×16) of on/off pixels, drawn on a canvas.
- Classic LCD look: greenish screen with dark pixels, like a real Tamagotchi.
- One screen, portrait, mobile-first, big touch-friendly buttons.

## Life cycle (24 hours of real time)
| Stage   | Duration | Starts at |
|---------|----------|-----------|
| Seed    | 2 h      | 0 h       |
| Sprout  | 4 h      | 2 h       |
| Sapling | 6 h      | 6 h       |
| Birch   | 12 h     | 12 h      |
- Growth depends only on time, also while the game is closed. Always calculate it from saved timestamps, never from a running timer.
- At 24 h Betula leaves a gift, her life ends and she becomes a seed again. A new life starts.

## Needs
- Three needs: water, sun and company. Each goes from 100 to 0.
- Each need drops by itself over time (about 4 hours from full to empty), also while the game is closed.
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
- Speed mode: if the URL contains ?speed=N, time runs N times faster (?speed=720 makes a full life last 2 minutes). It is never active without the parameter.

## Tech
- Plain HTML, CSS and JavaScript: index.html, style.css and game.js. Split into more files only if needed.
- Hosted on GitHub Pages at berkanagames.com/betula-grows.

## Out of scope for now
- A merge mini-game to create water and sunlight (maybe later).
- Sound, accounts, ads and app stores.
