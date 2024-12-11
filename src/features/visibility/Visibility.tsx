import {useCallback, useEffect, useState} from 'react';
import {tokens, type Stack, type StackEventMap} from 'earwurm';
import {clx} from 'beeftools';

import {
  earwurmManager,
  // quickPlay,
  type AudioLibKey,
} from '@src/store/earwurm.ts';
import {useButtonSize} from '@src/hooks/useButtonSize.ts';

import {Button} from '@src/components/ui/Button/Button.tsx';
import {SoundSelect} from '@src/components/ui/SoundSelect/SoundSelect.tsx';
import {StackList} from '@src/components/ui/StackList/StackList.tsx';
import {Text} from '@src/components/ui/Text/Text.tsx';

import styles from './Visibility.module.css';

export function Visibility() {
  const [stack, setStack] = useState<Stack>();
  const [soundId, setSoundId] = useState<AudioLibKey>();
  const [queue, setQueue] = useState<string[]>([]);
  const [maxReached, setMaxReached] = useState(false);

  const buttonSize = useButtonSize();

  function handlePlaySound() {
    if (!stack) return;

    stack
      .prepare()
      .then((sound) => sound.play())
      .catch(console.error);
  }

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
    return () =>
      document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [handleVisibilityChange]);

  useEffect(() => {
    setStack(soundId ? earwurmManager.get(soundId) : undefined);
  }, [soundId]);

  useEffect(() => {
    stack?.on('queue', handleQueueChange);
    return () => stack?.off('queue', handleQueueChange);
  }, [stack, handleQueueChange]);

  const stackItems = queue.length
    ? queue.map((item) => <StackList.Item key={item} label={`Item: ${item}`} />)
    : null;

  const maxLabel = maxReached
    ? 'Max stack size reached!'
    : 'Stack max has not yet been reached…';

  return (
    <section className={clx('main-section', styles.Visibility)}>
      <Text>
        You can pause all audio coming from Earwurm when the window loses focus.
        This is generally a good pattern to prevent constant audio spamming
        while the user switches to another task.
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

      <Text size="small" variant={maxReached ? 'danger' : 'normal'}>
        <strong>{maxLabel}</strong>
      </Text>

      <StackList>{stackItems}</StackList>
    </section>
  );
}
