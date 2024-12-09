import {useCallback, useEffect, useRef, useState} from 'react';
import {useInterval} from '@src/hooks/useInterval.ts';

import type {ConwayOptions} from './conway.types.ts';
import {
  DEFAULT_LIFESPAN,
  extractLivingCells,
  generateSeed,
  generateGrid,
  getNextGenGrid,
  giveCellLife,
  sizeClamp,
  validateSeed,
  // Re-exported
  calcCellLifeProgress,
  cellIsAlive,
  getCellKey,
  normalizeSeedOrCell,
} from './conway.utils.ts';

// Future ideas:
// 1. Seed complexity (allow for "little life" vs "lots of life").
//    - Could represent this as "difficulty".
// 2. Improved `GameState`:
// type GameState = 'pending' | 'running' | 'paused' | 'success' | 'extinction';

export function useConway({
  seed,
  singleAxisSize = 20,
  tickMs = 1000,
  maxLifespan = DEFAULT_LIFESPAN,
}: ConwayOptions = {}) {
  const isValidSeedRef = useRef(true);
  const safeSize = sizeClamp(singleAxisSize);

  // TODO: Consider condensing this into a single `GameState` type.
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [extinction, setExtinction] = useState(false);

  const [generation, setGeneration] = useState(0);

  const getSeed = useCallback(
    (seedSize = safeSize, giveLife = false) => {
      return generateSeed(seedSize, giveLife);
    },
    [safeSize],
  );

  const generateInternalSeed = useCallback(() => {
    return seed?.length ? seed.map(giveCellLife) : generateSeed(safeSize, true);
  }, [seed, safeSize]);

  const [livingCells, setLivingCells] = useState(generateInternalSeed());
  const [grid, setGrid] = useState(generateGrid(safeSize, livingCells));

  // TODO: Return this to the user so they can retain
  // the winning "seed".
  const firstGenCellsRef = useRef(livingCells);

  const advanceGeneration = useCallback(() => {
    const nextGen = generation + 1;
    const nextGrid = getNextGenGrid(grid, nextGen, singleAxisSize, maxLifespan);
    const nextLivingCells = extractLivingCells(nextGrid);

    setGrid(nextGrid);
    setLivingCells(nextLivingCells);
    setGeneration(nextGen);
  }, [singleAxisSize, maxLifespan, generation, grid]);

  const resetGameRef = useRef(() => {
    // Using a `ref` so that we do not need to declare
    // this function as a dependency of `useEffect()`.
    setStarted(false);
    setPlaying(false);
    setExtinction(false);
    setGeneration(0);

    const newSeed = generateInternalSeed();
    firstGenCellsRef.current = newSeed;

    setLivingCells(newSeed);
    setGrid(generateGrid(safeSize, newSeed));
  });

  const startGame = useCallback(() => {
    if (!isValidSeedRef.current) {
      console.warn(
        'The game cannot be started because the user-provided `seed` is incompatible with the game parameters.',
      );
      return;
    }

    setStarted(true);
    setPlaying(true);
  }, []);

  const resumeGame = useCallback(() => {
    if (started) setPlaying(true);
  }, [started]);

  const pauseGame = useCallback(() => setPlaying(false), []);

  useInterval(advanceGeneration, {durationMs: tickMs, playing});

  useEffect(() => {
    if (livingCells.length <= 0) {
      setPlaying(false);
      setExtinction(true);
    }
  }, [livingCells]);

  useEffect(() => {
    // If any incoming props change, reset the game.
    resetGameRef.current();
  }, [seed, singleAxisSize, tickMs, maxLifespan]);

  useEffect(() => {
    if (generation > 0 || started) {
      isValidSeedRef.current = true;
      return;
    }

    isValidSeedRef.current = validateSeed(livingCells, safeSize);

    if (!isValidSeedRef.current) {
      console.error(
        'The user-provided seed is incompatible with the grid size.',
      );
    }
  }, [started, generation, livingCells, safeSize]);

  return {
    grid,
    size: safeSize,
    maxLifespan,
    started,
    playing,
    extinction,
    generation,
    // Helpers
    isValidSeed: isValidSeedRef.current,
    calcCellLifeProgress,
    cellIsAlive,
    getCellKey,
    normalizeSeedOrCell,
    // Actions
    getSeed,
    advanceGeneration,
    startGame,
    resumeGame,
    pauseGame,
    stopGame: resetGameRef.current,
  };
}
