import {clx} from 'beeftools';

import {type AudioLibKey} from '@src/store/earwurm.ts';
import {useButtonSize} from '@src/hooks/useButtonSize.ts';

import {Button} from '@src/components/ui/Button/Button.tsx';
import {StackListAuto} from '@src/components/ui/StackList/StackListAuto.tsx';
import {Text} from '@src/components/ui/Text/Text.tsx';

import {useSequence} from './useSequence.ts';
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
  const buttonSize = useButtonSize();
  const {sequencing, queue, soundInSequence, addToSequence, playSequence} =
    useSequence();

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
          onClick={() => addToSequence(id)}
        />
      </li>
    );
  });

  const normalLabel = queue.length
    ? 'Waiting to initialize sequence…'
    : 'Nothing added to the queue.';

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
        disabled={!queue.length}
        loading={sequencing}
        onClick={playSequence}
      />

      <Text size="small" variant={sequencing ? 'danger' : 'normal'}>
        <strong>{sequencing ? 'Playing sequence!' : normalLabel}</strong>
      </Text>

      <StackListAuto items={queue.map(({id}) => id)} />
    </section>
  );
}
