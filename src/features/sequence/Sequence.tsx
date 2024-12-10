import {useCallback, useEffect, useState} from 'react';
import {type ManagerEventMap, type Sound} from 'earwurm';
import {clx} from 'beeftools';

import {earwurmManager, type AudioLibKey} from '@src/store/earwurm.ts';
import {useButtonSize} from '@src/hooks/useButtonSize.ts';

import {Button} from '@src/components/ui/Button/Button.tsx';
import {StackList} from '@src/components/ui/StackList/StackList.tsx';
import {Text} from '@src/components/ui/Text/Text.tsx';

import styles from './Sequence.module.css';

const SEQUENCE_LIB: AudioLibKey[] = [
  'click',
  'coin',
  'confirm',
  'droplet',
  'pop',
  'rip',
  'slap',
  'twist',
];

export function Sequence() {
  const [playing, setPlaying] = useState(earwurmManager.playing);
  const [sequencing, setSequencing] = useState(false);
  const [queue, setQueue] = useState<Sound[]>([]);

  const buttonSize = useButtonSize();

  const soundInSequence = useCallback(
    (id: AudioLibKey) => queue.some((sound) => sound.id.startsWith(id)),
    [queue],
  );

  function pushToQueue(sound: Sound) {
    setQueue((prev) => [...prev, sound]);
  }

  function handleAddToSequence(id: AudioLibKey) {
    const stack = earwurmManager.get(id);

    stack
      ?.prepare()
      .then(pushToQueue)
      .catch(() => console.error('Failed to prepare sound'));
  }

  const handlePlayChange: ManagerEventMap['play'] = useCallback((active) => {
    setPlaying(active);
  }, []);

  const handlePlaySequence = useCallback(() => {
    setSequencing(true);
  }, []);

  useEffect(() => {
    if (!playing) {
      setQueue((current) => current.slice(1));
    }
  }, [playing]);

  useEffect(() => {
    if (sequencing && queue.length) {
      queue[0].play();
    }

    if (sequencing && !queue.length) {
      setSequencing(false);
    }
  }, [sequencing, queue]);

  useEffect(() => {
    earwurmManager.on('play', handlePlayChange);

    return () => {
      earwurmManager.off('play', handlePlayChange);
    };
  }, [handlePlayChange]);

  const actionItems = SEQUENCE_LIB.map((id) => {
    const inSequence = soundInSequence(id);

    return (
      <li key={`Action-${id}`} className={styles.ActionItem}>
        <Button
          label={`Add: ${id}`}
          aria-label="Add this sound to the sequence"
          size="small"
          variant={inSequence ? 'tertiary' : 'primary'}
          disabled={inSequence || sequencing}
          outline
          onClick={() => handleAddToSequence(id)}
        />
      </li>
    );
  });

  const queueItems = queue.length
    ? queue.map((sound) => (
        <StackList.Item key={`Queue-${sound.id}`} label={`Item: ${sound.id}`} />
      ))
    : null;

  const queueLabel = queue.length
    ? 'Waiting to initialize sequence!'
    : 'Nothing added to the queue…';

  return (
    <section className={clx('main-section', styles.Sequence)}>
      <Text>
        Similar to queueing up a Sound to play from within a single Stack, we
        can queue up different Sounds to play in sequence.
      </Text>

      <ul className={styles.ActionList}>{actionItems}</ul>

      <Button
        label="Play Sequence"
        aria-label="Play all queued sounds in sequence"
        variant="primary"
        size={buttonSize}
        disabled={sequencing || !queue.length}
        onClick={handlePlaySequence}
      />

      <Text size="small">
        <strong>{queueLabel}</strong>
      </Text>

      <StackList>{queueItems}</StackList>
    </section>
  );
}
