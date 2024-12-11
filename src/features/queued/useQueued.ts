import {useCallback, useEffect, useState} from 'react';
import {tokens, type Stack, type StackEventMap} from 'earwurm';

import {earwurmManager, type AudioLibKey} from '@src/store/earwurm.ts';

export function useQueued() {
  const [stack, setStack] = useState<Stack>();
  const [soundId, setSoundId] = useState<AudioLibKey>();
  const [queue, setQueue] = useState<string[]>([]);
  const [maxReached, setMaxReached] = useState(false);

  const queueSound = useCallback(() => {
    // NOTE: Prevent increasing the queue if we have already
    // reached the maximum stack size.
    if (!stack || maxReached) return;

    // NOTE: Notice that we are not calling `sound.play()`.
    // Simply "preparing" the Sound adds it to the `queue`.
    // We can then listen to `queue` changes and call
    // play upon each new Sound.
    stack
      .prepare()
      .then((sound) => console.log('Sound added to queue', sound.id))
      .catch(console.error);
  }, [stack, maxReached]);

  const handleQueueChange: StackEventMap['queue'] = useCallback((newKeys) => {
    setQueue(newKeys);
    setMaxReached(newKeys.length >= tokens.maxStackSize);
  }, []);

  useEffect(() => {
    // NOTE: Every time the `queue` changes, we grab the first item
    // and `play` it. Once the Sound has ended, the `queue` changes
    // and we repeat the cycle.
    const firstInQueue = queue[0];

    if (stack && firstInQueue) {
      const firstSound = stack.get(queue[0]);
      if (firstSound?.state === 'created') firstSound.play();
    }
  }, [stack, queue]);

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
    queueSound,
  };
}
