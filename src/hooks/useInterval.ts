import {useEffect, useRef} from 'react';

// Future features:
// 1. Execute immediately
// 2. Pause/resume vs stop

type IntervalId = ReturnType<typeof setInterval> | number;

interface IntervalOptions {
  durationMs?: number;
  playing?: boolean;
}

export function useInterval(
  callback: () => void,
  {durationMs = 0, playing = false}: IntervalOptions,
) {
  const intervalId = useRef<IntervalId>(0);

  useEffect(() => {
    if (playing) {
      intervalId.current = setInterval(callback, durationMs);
    } else {
      clearInterval(intervalId.current);
    }

    return () => clearInterval(intervalId.current);
  }, [callback, durationMs, playing]);
}
