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
- The Sun and Water icons refill sun and water. Company goes up with the Heart icon (see Version 1.1).
- Betula never dies from neglect: when a need is low, she looks sad or wilted.
- Care matters: the better Betula was cared for during her life, the higher the chance of a rare gift.

## Gifts
- One gift at the end of each life.
- A pool of about 8 gifts drawn in pixel art (for example acorn, feather, mushroom, pebble, flower, snail shell, butterfly, star). Most are common, a few are rare.
- Gifts go to a collection, shown in the menu (see Version 1.1), and are kept forever, across lives.

## Saving
- Save everything in the browser with localStorage: life start time, needs, last update time, the collection and the sound setting.
- A reset option inside a small menu, with a confirmation step.

## Testing
- Speed mode: if the URL contains ?speed=N, time runs N times faster (?speed=720 makes a full life last 2 minutes). It is never active without the parameter.
- Test speeds use their own save, so tests never touch the real Betula.

## Tech
- Plain HTML, CSS and JavaScript: index.html, style.css and game.js. Split into more files only if needed.
- Hosted on GitHub Pages at berkanagames.com/betula-grows.

## Out of scope for now
- A merge mini-game to create water and sunlight (maybe later).
- Accounts, ads and app stores.

## Version 1.1

### Life
- Back to the 24-hour life described in "Life cycle". The ?speed=N test mode stays.
- Old saves: if a save from an older version is found, start a new life but keep the gift collection.

### Screen layout
- Classic Tamagotchi layout inside the LCD screen: 4 pixel-art icons on top, 4 at the bottom, Betula in the middle.
- Top row, left to right: Menu (three lines), Sun, Water, Heart.
- Bottom row, left to right: Lamp, Broom, Spray, Attention.
- Two ways to use the icons, both always active:
  - Tap an icon directly.
  - Three buttons below the screen: Select (moves the highlight to the next icon), OK (uses the highlighted icon), Back (closes menus or cancels).
- The Attention icon is not a button: it lights up when Betula needs something.

### Icons
- Menu: opens over Betula. Shows stats (age, current stage, lives lived, gifts collected), the gift collection, a sound on/off option and the reset option (with confirmation).
- Sun: refills the sun need. Does nothing at night, because Betula is sleeping.
- Water: refills the water need.
- Heart: opens the left-or-right mini-game.
- Lamp: turns the light on and off.
- Broom: sweeps the fallen leaves.
- Spray: removes pests.

### Day and night
- Day is from 6:00 to 21:00 and night from 21:00 to 6:00, in the player's local time.
- At night with the light off, Betula sleeps (closed eyes and "Zzz") and her needs drop more slowly.
- At night with the light on, she can't sleep and gets grumpy.
- Test parameter: ?hour=N forces the hour (for example ?hour=22) so night can be tested at any time.

### Fallen leaves
- Dry leaves appear around Betula over time, also while the game is closed, up to a few on screen.
- The Broom clears them. If too many pile up, Betula gets sad.

### Pests
- Pests appear at random, more often when Betula is poorly cared for.
- While she has pests, her needs drop faster. The Spray removes them.

### Mini-game: left or right
- Opened with the Heart icon. A bird appears on the left or on the right and the player guesses which side. 5 rounds.
- Winning raises the company need.

### Sounds
- 8-bit sounds generated in code with the Web Audio API. No audio files.
- Sounds for: tapping an icon, sun and water, growing up, receiving a gift, winning or losing the mini-game, and the attention alert.
- Sound can be turned off in the menu, and the choice is saved.
- Browsers only allow sound after the first tap, so start the audio then.

### Animations
- 2-frame flip animations, Tamagotchi style:
  - Idle: gentle sway in the wind.
  - Happy jump after sun, water or company.
  - Sleeping: closed eyes and "Zzz".
  - Growth transition when moving to the next stage.
  - Gift reveal at the end of a life.
- Each feature gets its own animation and sound in the same session where it is built.

### Session plan
1. New screen layout: 24-hour life back (keeping gifts), 8 pixel icons, the three buttons, and Sun, Water and Heart working with the existing actions.
2. Menu (stats, gifts, sound on/off, reset), Attention icon and the sound system.
3. Day and night: Lamp, sleeping, slower needs at night, ?hour=N.
4. Fallen leaves with the Broom, and pests with the Spray.
5. Left-or-right mini-game.
6. General animations, testing on iPhone and Android, and release of version 1.1.

- Every session ends with a published version on GitHub Pages, even if version 1.1 is not finished.
