import {useCallback, useEffect, useMemo, useState} from 'react';
import {arrayDedupe, arrayShuffle, clamp} from 'beeftools';

type MemoryImages = string[];

type MemoryTuple = [first: string] | [first: string, second: string];
type MemoryFlipped = [] | MemoryTuple;

type MemoryGameDifficulty = 'easy' | 'medium' | 'hard';
type MemoryGameState =
  | 'idle'
  | 'flipping'
  | 'pendingMatch'
  | 'pendingReject'
  | 'success'
  | 'failed';

const GAME_MIN = 4;
const GAME_MAX = 8;

function calcMaxTurns(
  uniqueImageCount = GAME_MIN,
  difficulty: MemoryGameDifficulty = 'easy',
) {
  const clamped = clamp(GAME_MIN, uniqueImageCount, GAME_MAX);

  switch (difficulty) {
    case 'easy':
      return clamped * 10;
    case 'medium':
      return clamped * 8;
    case 'hard':
      return clamped * 6;
  }
}

function getImageId(src: string, index: number) {
  return `${src}-${index}`;
}

function getImageFromId(value: string) {
  return value.replace(/-\d*$/, '');
}

// TODO: Account for changed props mid-game.
export function useMemoryGame(
  images: MemoryImages = [],
  difficulty: MemoryGameDifficulty = 'easy',
) {
  const [state, setState] = useState<MemoryGameState>('idle');
  const [turns, setTurns] = useState(0);

  const [progress, setProgress] = useState<MemoryImages>([]);
  const [flipped, setFlipped] = useState<MemoryFlipped>([]);

  const shuffled = useMemo(() => {
    const deduped = arrayDedupe(images);
    const sliced = deduped.slice(0, GAME_MAX);
    const cloned = [...sliced, ...sliced];

    return arrayShuffle(cloned);
  }, [images]);

  const dedupedSize = shuffled.length / 2;
  const error =
    dedupedSize < GAME_MIN
      ? `MemoryGame requires between ${GAME_MIN} and ${GAME_MAX} unique images.`
      : undefined;

  const maxTurns = useMemo(() => {
    return calcMaxTurns(dedupedSize, difficulty);
  }, [dedupedSize, difficulty]);

  const isFlipping = useCallback(
    (src: string, index: number) => {
      const id = getImageId(src, index);
      return flipped.length ? flipped.includes(id) : false;
    },
    [flipped],
  );

  const isFlipped = useCallback(
    (src: string) => progress.includes(src),
    [progress],
  );

  const handleFlip = useCallback(
    (src: string, index: number) => {
      if (
        (state === 'idle' || state === 'flipping') &&
        flipped.length < 2 &&
        shuffled.includes(src) &&
        !error
      ) {
        const id = getImageId(src, index);
        // TODO: How to avoid this typecast?
        setFlipped((prev) => [...prev, id] as MemoryFlipped);
      }
    },
    [state, flipped, shuffled, error],
  );

  useEffect(() => {
    const matched = state === 'pendingMatch';
    const rejected = state === 'pendingReject';

    if (flipped.length && (matched || rejected)) {
      setTimeout(() => {
        setState('idle');
        setTurns((prev) => prev + 1);
        setFlipped([]);

        if (matched) {
          setProgress((prev) => {
            const src = getImageFromId(flipped[0]);
            return [...prev, src];
          });
        }
      }, 1000);
    }
  }, [state, flipped]);

  useEffect(() => {
    if (progress.length === dedupedSize) {
      // TODO: Make sure we hit this state.
      setState('success');
    } else if (turns >= maxTurns) {
      setState('failed');
    }
  }, [difficulty, turns, maxTurns, progress, dedupedSize]);

  useEffect(() => {
    // && state !== 'success'
    if (flipped.length === 0) {
      setState('idle');
    }

    if (flipped.length === 1) {
      setState('flipping');
    }

    if (flipped.length === 2) {
      setState(() => {
        const first = getImageFromId(flipped[0]);
        const second = getImageFromId(flipped[1]);
        return first === second ? 'pendingMatch' : 'pendingReject';
      });
    }
  }, [flipped]);

  return {
    state,
    difficulty,
    shuffled,
    error,
    turns,
    maxTurns,
    isFlipping,
    isFlipped,
    handleFlip,
  };
}
