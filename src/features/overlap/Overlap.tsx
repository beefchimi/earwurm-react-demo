import {clx} from 'beeftools';

import {useButtonSize} from '@src/hooks/useButtonSize.ts';

import {Button} from '@src/components/ui/Button/Button.tsx';
import {MaxStackText} from '@src/components/ui/MaxStackText/MaxStackText.tsx';
import {StackListAuto} from '@src/components/ui/StackList/StackListAuto.tsx';
import {StackSelect} from '@src/components/ui/StackSelect/StackSelect.tsx';
import {Text} from '@src/components/ui/Text/Text.tsx';

import {useOverlap} from './useOverlap.ts';
import styles from './Overlap.module.css';

export function Overlap() {
  const buttonSize = useButtonSize();
  const {stackId, queue, maxReached, setStackId, playSound} = useOverlap();

  return (
    <section className={clx('main-section', styles.Overlap)}>
      <Text>
        The simplest use of Earwurm is to allow Sounds from within a Stack to
        overlap.
      </Text>

      <StackSelect
        value={stackId}
        disabled={queue.length > 0}
        onChange={setStackId}
      />

      <Button
        label="Play Sound"
        aria-label="Play sound"
        variant="primary"
        size={buttonSize}
        disabled={!stackId}
        onClick={playSound}
      />

      <MaxStackText maxReached={maxReached} />
      <StackListAuto items={queue} />
    </section>
  );
}
