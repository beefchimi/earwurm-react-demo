import {clx} from 'beeftools';

import {useButtonSize} from '@src/hooks/useButtonSize.ts';

import {Button} from '@src/components/ui/Button/Button.tsx';
import {MaxStackText} from '@src/components/ui/MaxStackText/MaxStackText.tsx';
import {StackSelect} from '@src/components/ui/StackSelect/StackSelect.tsx';
import {StackListAuto} from '@src/components/ui/StackList/StackListAuto.tsx';
import {Text} from '@src/components/ui/Text/Text.tsx';

import {useRestricted} from './useRestricted.ts';
import styles from './Restricted.module.css';

export function Restricted() {
  const buttonSize = useButtonSize();
  const {stackId, queue, maxReached, setStackId, playSound} = useRestricted();

  return (
    <section className={clx('main-section', styles.Restricted)}>
      <Text>
        Earwurm provides various different ways to determine if a sound is
        playing. In this example, we simply restrict subsequent sounds until the
        Stack queue is empty.
      </Text>

      <StackSelect
        value={stackId}
        disabled={queue.length > 0}
        onChange={setStackId}
      />

      <Button
        label="Play Sound"
        aria-label="Play sound only when the queue is empty"
        variant="primary"
        size={buttonSize}
        disabled={!stackId}
        loading={queue.length > 0}
        onClick={playSound}
      />

      <MaxStackText maxReached={maxReached} />
      <StackListAuto items={queue} />
    </section>
  );
}
