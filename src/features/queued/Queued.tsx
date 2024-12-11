import {clx} from 'beeftools';

import {useButtonSize} from '@src/hooks/useButtonSize.ts';

import {Button} from '@src/components/ui/Button/Button.tsx';
import {MaxStackText} from '@src/components/ui/MaxStackText/MaxStackText.tsx';
import {SoundSelect} from '@src/components/ui/SoundSelect/SoundSelect.tsx';
import {StackListAuto} from '@src/components/ui/StackList/StackListAuto.tsx';
import {Text} from '@src/components/ui/Text/Text.tsx';

import {useQueued} from './useQueued.ts';
import styles from './Queued.module.css';

export function Queued() {
  const buttonSize = useButtonSize();
  const {soundId, queue, maxReached, setSoundId, queueSound} = useQueued();

  return (
    <section className={clx('main-section', styles.Queued)}>
      <Text>
        In addition to restricting a Sound to never overlap other Sounds within
        the same Stack, we can also queue Sounds to play one after another.
      </Text>

      <SoundSelect
        value={soundId}
        disabled={queue.length > 0}
        onChange={setSoundId}
      />

      <Button
        label="Queue + Play Sound"
        aria-label="Queue another sound and play when ready"
        variant="primary"
        size={buttonSize}
        disabled={!soundId}
        onClick={queueSound}
      />

      <MaxStackText maxReached={maxReached} />
      <StackListAuto items={queue} />
    </section>
  );
}
