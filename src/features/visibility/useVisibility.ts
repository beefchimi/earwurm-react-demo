import {useCallback, useEffect, useState} from 'react';
import {tokens, type Stack, type StackEventMap} from 'earwurm';

import {
  earwurmManager,
  // quickPlay,
  type AudioLibKey,
} from '@src/store/earwurm.ts';

export function useVisibility() {
  const [stack, setStack] = useState<Stack>();
  const [soundId, setSoundId] = useState<AudioLibKey>();
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

    if (document.hidden && earwurmManager.state === 'interrupted') {
      console.log('Unique case for iOS devices');
    }

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
