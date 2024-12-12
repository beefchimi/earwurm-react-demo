import {clx} from 'beeftools';

import {useButtonSize} from '@src/hooks/useButtonSize.ts';

import {Button} from '@src/components/ui/Button/Button.tsx';
import {MaxStackText} from '@src/components/ui/MaxStackText/MaxStackText.tsx';
import {StackSelect} from '@src/components/ui/StackSelect/StackSelect.tsx';
import {StackListAuto} from '@src/components/ui/StackList/StackListAuto.tsx';
import {Text} from '@src/components/ui/Text/Text.tsx';

import {useQueued} from './useQueued.ts';
import styles from './Queued.module.css';

export function Queued() {
  const buttonSize = useButtonSize();
  const {stackId, queue, maxReached, setStackId, queueSound} = useQueued();

  return (
    <section className={clx('main-section', styles.Queued)}>
      <Text>
        In addition to restricting a Sound to never overlap other Sounds within
        the same Stack, we can also queue Sounds to play one after another.
      </Text>

      <StackSelect
        value={stackId}
        disabled={queue.length > 0}
        onChange={setStackId}
      />

      <Button
        label="Queue + Play Sound"
        aria-label="Queue another sound and play when ready"
        variant="primary"
        size={buttonSize}
        disabled={!stackId || maxReached}
        onClick={queueSound}
      />

      <MaxStackText maxReached={maxReached} />
      <StackListAuto items={queue} />
    </section>
  );
}
