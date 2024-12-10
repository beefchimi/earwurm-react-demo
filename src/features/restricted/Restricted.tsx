import {useCallback, useEffect, useState} from 'react';
import {tokens, type Stack, type StackEventMap} from 'earwurm';
import {clx} from 'beeftools';

import {earwurmManager, type AudioLibKey} from '@src/store/earwurm.ts';
import {useButtonSize} from '@src/hooks/useButtonSize.ts';

import {Button} from '@src/components/ui/Button/Button.tsx';
import {SoundSelect} from '@src/components/ui/SoundSelect/SoundSelect.tsx';
import {StackList} from '@src/components/ui/StackList/StackList.tsx';
import {Text} from '@src/components/ui/Text/Text.tsx';

import styles from './Restricted.module.css';

export function Restricted() {
  const [stack, setStack] = useState<Stack>();
  const [soundId, setSoundId] = useState<AudioLibKey>();
  const [queue, setQueue] = useState<string[]>([]);
  const [maxReached, setMaxReached] = useState(false);

  const buttonSize = useButtonSize();

  function handlePlaySound() {
    // NOTE: The addition of `queue.length` is the only change
    // over the <Overlap /> example. There are other ways to achieve
    // this same result, such as: listening for `sound.end` events,
    // listening for `stack.state` events, and more.
    if (!stack || queue.length) return;

    stack
      .prepare()
      .then((sound) => sound.play())
      .catch(() => console.error('Failed to play sound'));
  }

  const handleQueueChange: StackEventMap['queue'] = useCallback((newKeys) => {
    setQueue(newKeys);
    setMaxReached(newKeys.length >= tokens.maxStackSize);
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

  const stackItems = queue.length
    ? queue.map((item) => <StackList.Item key={item} label={`Item: ${item}`} />)
    : null;

  const maxLabel = maxReached
    ? 'Max stack size reached!'
    : 'Stack max has not yet been reached…';

  return (
    <section className={clx('main-section', styles.Restricted)}>
      <Text>
        Earwurm provides various different ways to determine if a sound is
        playing. In this example, we simply restrict subsequent sounds until the
        Stack queue is empty.
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
