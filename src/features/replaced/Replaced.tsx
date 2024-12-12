import {clx} from 'beeftools';

import {useButtonSize} from '@src/hooks/useButtonSize.ts';

import {Button} from '@src/components/ui/Button/Button.tsx';
import {MaxStackText} from '@src/components/ui/MaxStackText/MaxStackText.tsx';
import {StackSelect} from '@src/components/ui/StackSelect/StackSelect.tsx';
import {StackListAuto} from '@src/components/ui/StackList/StackListAuto.tsx';
import {Text} from '@src/components/ui/Text/Text.tsx';

import {useReplaced} from './useReplaced.ts';
import styles from './Replaced.module.css';

export function Replaced() {
  const buttonSize = useButtonSize();
  const {stackId, queue, maxReached, setStackId, playSound} = useReplaced();

  return (
    <section className={clx('main-section', styles.Replaced)}>
      <Text>
        Combining the techniques of Overlap and Restricted, we can stop the
        previously invoked Sound and replace it with a new one.
      </Text>

      <StackSelect
        value={stackId}
        disabled={queue.length > 0}
        onChange={setStackId}
      />

      <Button
        label="Play Sound"
        aria-label="Play sound and stop any previously placing sounds"
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
