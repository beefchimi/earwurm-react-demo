import {clx} from 'beeftools';

import {useButtonSize} from '@src/hooks/useButtonSize.ts';

import {Button} from '@src/components/ui/Button/Button.tsx';
import {MaxStackText} from '@src/components/ui/MaxStackText/MaxStackText.tsx';
import {SoundSelect} from '@src/components/ui/SoundSelect/SoundSelect.tsx';
import {StackListAuto} from '@src/components/ui/StackList/StackListAuto.tsx';
import {Text} from '@src/components/ui/Text/Text.tsx';

import {useRestricted} from './useRestricted.ts';
import styles from './Restricted.module.css';

export function Restricted() {
  const buttonSize = useButtonSize();
  const {soundId, queue, maxReached, setSoundId, playSound} = useRestricted();

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
        aria-label="Play sound only when the queue is empty"
        variant="primary"
        size={buttonSize}
        disabled={!soundId}
        loading={queue.length > 0}
        onClick={playSound}
      />

      <MaxStackText maxReached={maxReached} />
      <StackListAuto items={queue} />
    </section>
  );
}
