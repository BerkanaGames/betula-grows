// Left or right — a mini-game for Betula Grows.
//
// Every mini-game is an object with the same four functions, so the main game can run any of them:
//   start(tools, now)          Begins a game and returns its state.
//   press(state, side, now)    The player chose "left" or "right".
//   draw(state, screen, now)   Draws the game on the LCD grid.
//   getResult(state, now)      Returns null while playing, then { won, score, total } once it is over.
//
// A mini-game never touches the main game directly. It only uses the tools it is given in start():
//   placeSprite, placeText, getTextWidth, getCenteredLeft, playNotes, random, PIXEL,
//   and area ({ top, bottom, columns }), the part of the screen it may draw in.
// The main game opens it, passes the taps and buttons, and gives the reward when it ends.
//
// This game: a bird appears on the left or on the right, and the player guesses the side
// before it shows up. 5 rounds; 3 or more right answers win.

const LEFT_OR_RIGHT = (() => {
  const ROUNDS = 5;
  const ROUNDS_TO_WIN = 3;
  const REVEAL_DURATION = 900;
  const SCORE_DURATION = 2200;
  const BIRD_FRAME_INTERVAL = 150;

  // A small bird flapping its wings: two frames that take turns.
  const BIRD_FRAMES = [
    [
      "#.....#",
      "##...##",
      ".#####.",
      "..###..",
      "..#.#..",
    ],
    [
      ".......",
      "..###..",
      "#######",
      "#.###.#",
      "..#.#..",
    ],
  ];

  const ARROWS = {
    left: ["..#", ".##", "###", ".##", "..#"],
    right: ["#..", "##.", "###", "##.", "#.."],
  };

  // Short melodies as [frequency in Hz, duration in seconds]; a frequency of 0 is a pause.
  const NOTES = {
    right: [[988, 0.06], [1319, 0.1]],
    wrong: [[330, 0.08], [262, 0.14]],
    win: [[523, 0.1], [659, 0.1], [784, 0.1], [1047, 0.1], [1319, 0.3]],
    lose: [[392, 0.12], [330, 0.12], [262, 0.25]],
  };

  function start(tools, now) {
    return {
      tools,
      round: 1,
      score: 0,
      phase: "choose",
      phaseStart: now,
      guess: null,
      birdSide: null,
      isOver: false,
    };
  }

  // The reveal and the final score last a moment, then the game moves on by itself.
  function advance(state, now) {
    const elapsed = now - state.phaseStart;
    if (state.phase === "reveal" && elapsed >= REVEAL_DURATION) {
      if (state.round < ROUNDS) {
        state.round++;
        state.phase = "choose";
      } else {
        state.phase = "score";
        state.tools.playNotes(state.score >= ROUNDS_TO_WIN ? NOTES.win : NOTES.lose);
      }
      state.phaseStart = now;
    } else if (state.phase === "score" && elapsed >= SCORE_DURATION) {
      state.isOver = true;
    }
  }

  function press(state, side, now) {
    advance(state, now);
    if (state.phase === "choose") {
      state.guess = side;
      state.birdSide = state.tools.random() < 0.5 ? "left" : "right";
      const isRight = state.guess === state.birdSide;
      if (isRight) {
        state.score++;
      }
      state.tools.playNotes(isRight ? NOTES.right : NOTES.wrong);
      state.phase = "reveal";
      state.phaseStart = now;
    } else if (state.phase === "score") {
      // A tap on the final score ends the game without waiting.
      state.isOver = true;
    }
  }

  function placeCenteredText(state, screen, text, top) {
    const { placeText, getTextWidth, getCenteredLeft } = state.tools;
    placeText(screen, text, getCenteredLeft(getTextWidth(text)), top);
  }

  function draw(state, screen, now) {
    advance(state, now);
    const { placeSprite, area } = state.tools;
    const top = area.top;

    if (state.phase === "score") {
      placeCenteredText(state, screen, `${state.score}/${ROUNDS}`, top + 8);
      placeCenteredText(state, screen, state.score >= ROUNDS_TO_WIN ? "YOU WIN!" : "NICE TRY", top + 16);
      return;
    }

    placeCenteredText(state, screen, `${state.round}/${ROUNDS}`, top + 2);

    if (state.phase === "choose") {
      placeCenteredText(state, screen, "LEFT OR", top + 11);
      placeCenteredText(state, screen, "RIGHT?", top + 17);
      placeSprite(screen, ARROWS.left, 1, top + 14);
      placeSprite(screen, ARROWS.right, area.columns - 4, top + 14);
      return;
    }

    // Reveal: the bird flaps on its side, with the answer below.
    const bird = BIRD_FRAMES[Math.floor(now / BIRD_FRAME_INTERVAL) % BIRD_FRAMES.length];
    const birdLeft = state.birdSide === "left" ? 6 : area.columns - 6 - bird[0].length;
    placeSprite(screen, bird, birdLeft, top + 11);
    placeCenteredText(state, screen, state.guess === state.birdSide ? "YES!" : "NO", top + 20);
  }

  function getResult(state, now) {
    advance(state, now);
    if (!state.isOver) {
      return null;
    }
    return { won: state.score >= ROUNDS_TO_WIN, score: state.score, total: ROUNDS };
  }

  return { name: "left-or-right", start, press, draw, getResult };
})();
