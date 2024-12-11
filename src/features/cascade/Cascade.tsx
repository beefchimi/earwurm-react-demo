import {useCallback, useEffect, useState} from 'react';
import {tokens, type Stack, type StackEventMap} from 'earwurm';
import {clamp, clx, roundNumber} from 'beeftools';

import {earwurmManager, type AudioLibKey} from '@src/store/earwurm.ts';
import {useButtonSize} from '@src/hooks/useButtonSize.ts';

import {Button} from '@src/components/ui/Button/Button.tsx';
import {SoundSelect} from '@src/components/ui/SoundSelect/SoundSelect.tsx';
import {StackList} from '@src/components/ui/StackList/StackList.tsx';
import {Text} from '@src/components/ui/Text/Text.tsx';

import styles from './Cascade.module.css';

function calcVolume(queueLength = 0) {
  const minVolume = 0.1;
  const maxVolume = 1;

  const maxSteps = tokens.maxStackSize - 1;
  const adjustedQueueLength = clamp(0, queueLength - 1, maxSteps);

  const volumeRange = maxVolume - minVolume;
  const offset = (adjustedQueueLength / maxSteps) * volumeRange;

  return roundNumber(maxVolume - offset, 2);
}

export function Cascade() {
  const [stack, setStack] = useState<Stack>();
  const [soundId, setSoundId] = useState<AudioLibKey>();
  const [queue, setQueue] = useState<string[]>([]);
  const [volume, setVolume] = useState(1);

  const buttonSize = useButtonSize();

  function handlePlaySound() {
    if (!stack) return;

    stack
      .prepare()
      .then((sound) => {
        sound.volume = volume;
        sound.play();
      })
      .catch(console.error);
  }

  const handleQueueChange: StackEventMap['queue'] = useCallback((newKeys) => {
    setVolume(calcVolume(newKeys.length));
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

  const stackItems = queue.length
    ? queue.map((item) => <StackList.Item key={item} label={`Item: ${item}`} />)
    : null;

  const volumeLabel = `Last Sound Volume: ${volume}`;

  return (
    <section className={clx('main-section', styles.Cascade)}>
      <Text>
        The simplest use of Earwurm is to allow Sounds from within a Stack to
        overlap.
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

      <Text size="small">
        <strong>{volumeLabel}</strong>
      </Text>

      <StackList>{stackItems}</StackList>
    </section>
  );
}
