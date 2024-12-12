import {useCallback, useEffect, useState} from 'react';
import {tokens, type Stack, type StackEventMap} from 'earwurm';
import {clamp, roundNumber} from 'beeftools';

import {earwurmManager, type AudioLibKey} from '@src/store/earwurm.ts';

function calcVolume(queueLength = 0) {
  const minVolume = 0.1;
  const maxVolume = 1;

  const maxSteps = tokens.maxStackSize - 1;
  const adjustedQueueLength = clamp(0, queueLength - 1, maxSteps);

  const volumeRange = maxVolume - minVolume;
  const offset = (adjustedQueueLength / maxSteps) * volumeRange;

  return roundNumber(maxVolume - offset, 2);
}

export function useCascade() {
  const [stack, setStack] = useState<Stack>();
  const [stackId, setStackId] = useState<AudioLibKey>();
  const [queue, setQueue] = useState<string[]>([]);
  const [maxReached, setMaxReached] = useState(false);

  const [volume, setVolume] = useState(1);

  const playSound = useCallback(() => {
    stack
      ?.prepare()
      .then((sound) => {
        // NOTE: Set volume on Sound upon creation.
        // These allows `volume` to be unchanged for that specific
        // Sound across its lifecycle.
        sound.volume = volume;
        sound.play();
      })
      .catch(console.error);
  }, [stack, volume]);

  const handleQueueChange: StackEventMap['queue'] = useCallback((newKeys) => {
    setVolume(calcVolume(newKeys.length));
    setQueue(newKeys);
    setMaxReached(newKeys.length >= tokens.maxStackSize);
  }, []);

  useEffect(() => {
    setStack(stackId ? earwurmManager.get(stackId) : undefined);
  }, [stackId]);

  useEffect(() => {
    stack?.on('queue', handleQueueChange);
    return () => stack?.off('queue', handleQueueChange);
  }, [stack, handleQueueChange]);

  return {
    // State values
    stack,
    stackId,
    queue,
    maxReached,
    volume,
    // Setters
    setStackId,
    // Handlers
    playSound,
  };
}
