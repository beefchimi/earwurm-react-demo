import {clx} from 'beeftools';

import {useButtonSize} from '@src/hooks/useButtonSize.ts';

import {Button} from '@src/components/ui/Button/Button.tsx';
import {MaxStackText} from '@src/components/ui/MaxStackText/MaxStackText.tsx';
import {SoundSelect} from '@src/components/ui/SoundSelect/SoundSelect.tsx';
import {StackListAuto} from '@src/components/ui/StackList/StackListAuto.tsx';
import {Text} from '@src/components/ui/Text/Text.tsx';

import {useVisibility} from './useVisibility.ts';
import styles from './Visibility.module.css';

export function Visibility() {
  const buttonSize = useButtonSize();
  const {soundId, queue, maxReached, setSoundId, playSound} = useVisibility();

  return (
    <section className={clx('main-section', styles.Visibility)}>
      <Text>
        You can pause all audio coming from Earwurm when the window loses focus.
        This is generally a good pattern to prevent constant audio spamming
        while the user switches to another task.
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
