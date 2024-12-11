import {useCallback, useEffect, useState} from 'react';
import {
  tokens,
  type ManagerEventMap,
  type Stack,
  type StackEventMap,
} from 'earwurm';

import {earwurmManager, type AudioLibKey} from '@src/store/earwurm.ts';
import {useTimeout} from '@src/hooks/useTimeout.ts';

const SUSPEND_AFTER_MS = 4000;

export function useAutoSuspend() {
  const [stack, setStack] = useState<Stack>();
  const [soundId, setSoundId] = useState<AudioLibKey>();
  const [queue, setQueue] = useState<string[]>([]);
  const [maxReached, setMaxReached] = useState(false);

  const [playing, setPlaying] = useState(earwurmManager.playing);
  const [suspended, setSuspended] = useState(
    earwurmManager.state === 'suspended',
  );

  const playSound = useCallback(() => {
    stack
      ?.prepare()
      .then((sound) => sound.play())
      .catch(console.error);
  }, [stack]);

  const handleStateChange: ManagerEventMap['state'] = useCallback((state) => {
    setSuspended(state === 'suspended');
  }, []);

  const handlePlayChange: ManagerEventMap['play'] = useCallback((active) => {
    setPlaying(active);
  }, []);

  const handleQueueChange: StackEventMap['queue'] = useCallback((newKeys) => {
    setQueue(newKeys);
    setMaxReached(newKeys.length >= tokens.maxStackSize);
  }, []);

  useEffect(() => {
    setStack(soundId ? earwurmManager.get(soundId) : undefined);
  }, [soundId]);

  useEffect(() => {
    earwurmManager.on('state', handleStateChange);
    return () => earwurmManager.off('state', handleStateChange);
  }, [handleStateChange]);

  useEffect(() => {
    earwurmManager.on('play', handlePlayChange);
    return () => earwurmManager.off('play', handlePlayChange);
  }, [handlePlayChange]);

  useEffect(() => {
    stack?.on('queue', handleQueueChange);
    return () => stack?.off('queue', handleQueueChange);
  }, [stack, handleQueueChange]);

  useTimeout(() => earwurmManager.suspend(), {
    durationMs: SUSPEND_AFTER_MS,
    playing: !playing,
  });

  return {
    // State values
    stack,
    soundId,
    queue,
    maxReached,
    playing,
    suspended,
    // Setters
    setSoundId,
    // Handlers
    playSound,
  };
}
