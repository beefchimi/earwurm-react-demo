import {useCallback, useEffect, useState} from 'react';
import {tokens, type Stack, type StackEventMap} from 'earwurm';

import {earwurmManager, type AudioLibKey} from '@src/store/earwurm.ts';

export function useReplaced() {
  const [stack, setStack] = useState<Stack>();
  const [stackId, setStackId] = useState<AudioLibKey>();
  const [queue, setQueue] = useState<string[]>([]);
  const [maxReached, setMaxReached] = useState(false);

  const playSound = useCallback(() => {
    if (!stack) return;

    // If a sound is at the top of the queue and playing,
    // stop it before proceeding with the next sound.
    const existingSound = stack.get(stack.keys[0]);
    if (existingSound && stack.playing) existingSound.stop();

    stack
      .prepare()
      .then((sound) => sound.play())
      .catch(console.error);
  }, [stack]);

  const handleQueueChange: StackEventMap['queue'] = useCallback((newKeys) => {
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
    // Setters
    setStackId,
    // Handlers
    playSound,
  };
}
