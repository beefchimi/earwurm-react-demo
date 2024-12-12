import {useCallback, useEffect, useState} from 'react';
import {tokens, type Stack, type StackEventMap} from 'earwurm';

import {earwurmManager, type AudioLibKey} from '@src/store/earwurm.ts';

/*
Alternatively, if your <Button /> components accept async functions,
you can use async/await.

async function handlePlaySoundAlt() {
  const sound = await stack?.prepare();
  sound?.play();
}
*/

export function useOverlap() {
  const [stack, setStack] = useState<Stack>();
  const [stackId, setStackId] = useState<AudioLibKey>();
  const [queue, setQueue] = useState<string[]>([]);
  const [maxReached, setMaxReached] = useState(false);

  const playSound = useCallback(() => {
    stack
      ?.prepare()
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
