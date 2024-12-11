import {useCallback, useEffect, useState} from 'react';
import {tokens, type Stack, type StackEventMap} from 'earwurm';

import {earwurmManager, type AudioLibKey} from '@src/store/earwurm.ts';

export function useRestricted() {
  const [stack, setStack] = useState<Stack>();
  const [soundId, setSoundId] = useState<AudioLibKey>();
  const [queue, setQueue] = useState<string[]>([]);
  const [maxReached, setMaxReached] = useState(false);

  const playSound = useCallback(() => {
    // NOTE: The addition of `queue.length` is the only change
    // over the <Overlap /> example. There are other ways to achieve
    // this same result, such as:
    // 1. Listening for `sound.end` events.
    // 2. Listening for `stack.state` events.
    // 3. and more...
    if (!stack || queue.length) return;

    stack
      .prepare()
      .then((sound) => sound.play())
      .catch(console.error);
  }, [stack, queue]);

  const handleQueueChange: StackEventMap['queue'] = useCallback((newKeys) => {
    setQueue(newKeys);
    setMaxReached(newKeys.length >= tokens.maxStackSize);
  }, []);

  useEffect(() => {
    setStack(soundId ? earwurmManager.get(soundId) : undefined);
  }, [soundId]);

  useEffect(() => {
    stack?.on('queue', handleQueueChange);
    return () => stack?.off('queue', handleQueueChange);
  }, [stack, handleQueueChange]);

  return {
    // State values
    stack,
    soundId,
    queue,
    maxReached,
    // Setters
    setSoundId,
    // Handlers
    playSound,
  };
}
