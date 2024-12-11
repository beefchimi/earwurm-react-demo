import {clx} from 'beeftools';

import {useButtonSize} from '@src/hooks/useButtonSize.ts';

import {Button} from '@src/components/ui/Button/Button.tsx';
import {MaxStackText} from '@src/components/ui/MaxStackText/MaxStackText.tsx';
import {SoundSelect} from '@src/components/ui/SoundSelect/SoundSelect.tsx';
import {StackListAuto} from '@src/components/ui/StackList/StackListAuto.tsx';
import {Text} from '@src/components/ui/Text/Text.tsx';

import {useOverlap} from './useOverlap.ts';
import styles from './Overlap.module.css';

export function Overlap() {
  const buttonSize = useButtonSize();
  const {soundId, queue, maxReached, setSoundId, playSound} = useOverlap();

  return (
    <section className={clx('main-section', styles.Overlap)}>
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
        onClick={playSound}
      />

      <MaxStackText maxReached={maxReached} />
      <StackListAuto items={queue} />
    </section>
  );
}
