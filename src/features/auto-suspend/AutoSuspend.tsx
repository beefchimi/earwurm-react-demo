import {useCallback, useEffect, useState} from 'react';
import {type ManagerEventMap, type Stack, type StackEventMap} from 'earwurm';
import {clx} from 'beeftools';

import {earwurmManager, type AudioLibKey} from '@src/store/earwurm.ts';
import {useButtonSize} from '@src/hooks/useButtonSize.ts';
import {useTimeout} from '@src/hooks/useTimeout.ts';

import {Button} from '@src/components/ui/Button/Button.tsx';
import {SoundSelect} from '@src/components/ui/SoundSelect/SoundSelect.tsx';
import {StackList} from '@src/components/ui/StackList/StackList.tsx';
import {Text} from '@src/components/ui/Text/Text.tsx';

import styles from './AutoSuspend.module.css';

const SUSPEND_AFTER_MS = 4000;

export function AutoSuspend() {
  const [stack, setStack] = useState<Stack>();
  const [soundId, setSoundId] = useState<AudioLibKey>();
  const [queue, setQueue] = useState<string[]>([]);

  const [playing, setPlaying] = useState(earwurmManager.playing);
  const [suspended, setSuspended] = useState(
    earwurmManager.state === 'suspended',
  );

  const buttonSize = useButtonSize();

  function handlePlaySound() {
    if (!stack) return;

    stack
      .prepare()
      .then((sound) => sound.play())
      .catch(console.error);
  }

  const handleStateChange: ManagerEventMap['state'] = useCallback((state) => {
    setSuspended(state === 'suspended');
  }, []);

  const handlePlayChange: ManagerEventMap['play'] = useCallback((active) => {
    setPlaying(active);
  }, []);

  const handleQueueChange: StackEventMap['queue'] = useCallback((newKeys) => {
    setQueue(newKeys);
  }, []);

  useEffect(() => {
    setStack(soundId ? earwurmManager.get(soundId) : undefined);
  }, [soundId]);

  useEffect(() => {
    stack?.on('queue', handleQueueChange);

    return () => {
      stack?.off('queue', handleQueueChange);
    };
  }, [stack, handleQueueChange]);

  useEffect(() => {
    earwurmManager.on('state', handleStateChange);

    return () => {
      earwurmManager.off('state', handleStateChange);
    };
  }, [handleStateChange]);

  useEffect(() => {
    earwurmManager.on('play', handlePlayChange);

    return () => {
      earwurmManager.off('play', handlePlayChange);
    };
  }, [handlePlayChange]);

  useTimeout(() => earwurmManager.suspend(), {
    durationMs: SUSPEND_AFTER_MS,
    playing: !playing,
  });

  const stackItems = queue.length
    ? queue.map((item) => <StackList.Item key={item} label={`Item: ${item}`} />)
    : null;

  const maxLabel = suspended
    ? 'Earwurm has been suspended!'
    : 'The AudioContext is currently running…';

  return (
    <section className={clx('main-section', styles.AutoSuspend)}>
      <Text>
        In the pursuit of maximum optimization, you can auto-suspend the Earwurm
        AudioContext by listening for state changes and setting a timeout.
      </Text>

      <SoundSelect
        value={soundId}
        disabled={queue.length > 0}
        onChange={setSoundId}
      />

      <Button
        label="Play Sound"
        aria-label="Play sound"
        variant="primary"
        size={buttonSize}
        disabled={!soundId}
        onClick={handlePlaySound}
      />

      <Text size="small" variant={suspended ? 'danger' : 'normal'}>
        <strong>{maxLabel}</strong>
      </Text>

      <StackList>{stackItems}</StackList>
    </section>
  );
}
