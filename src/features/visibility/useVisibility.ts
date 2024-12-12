import {useCallback, useEffect, useState} from 'react';
import {tokens, type Stack, type StackEventMap} from 'earwurm';

import {
  earwurmManager,
  // quickPlay,
  type AudioLibKey,
} from '@src/store/earwurm.ts';

export function useVisibility() {
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

  const handleVisibilityChange = useCallback(() => {
    if (document.hidden) {
      earwurmManager.suspend();
    } else {
      earwurmManager.resume();
    }

    /*
    A common use case for this is restoring audio on a
    mobile device that has gone to sleep.

    if (document.hidden && earwurmManager.state === 'interrupted') {
      earwurmManager.resume();
    }
    */

    // To more easily demonstate the visibility change, we can play
    // unique Sounds when toggling document visibility.
    // quickPlay(document.hidden ? 'death' : 'coin').catch(console.error);
  }, []);

  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [handleVisibilityChange]);

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
