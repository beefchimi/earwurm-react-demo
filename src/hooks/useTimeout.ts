import {useEffect, useRef} from 'react';

// Future features:
// 1. Execute immediately
// 2. Pause/resume vs stop

type TimeoutId = ReturnType<typeof setTimeout> | number;

interface TimeoutOptions {
  durationMs?: number;
  playing?: boolean;
}

export function useTimeout(
  callback: () => void,
  {durationMs = 0, playing = false}: TimeoutOptions,
) {
  const timeoutId = useRef<TimeoutId>(0);

  useEffect(() => {
    if (playing) {
      timeoutId.current = setTimeout(callback, durationMs);
    } else {
      clearTimeout(timeoutId.current);
    }

    return () => clearTimeout(timeoutId.current);
  }, [callback, durationMs, playing]);
}
