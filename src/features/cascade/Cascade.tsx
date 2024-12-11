import {clx} from 'beeftools';

import {useButtonSize} from '@src/hooks/useButtonSize.ts';

import {Button} from '@src/components/ui/Button/Button.tsx';
import {SoundSelect} from '@src/components/ui/SoundSelect/SoundSelect.tsx';
import {StackListAuto} from '@src/components/ui/StackList/StackListAuto.tsx';
import {Text} from '@src/components/ui/Text/Text.tsx';

import {useCascade} from './useCascade.ts';
import styles from './Cascade.module.css';

export function Cascade() {
  const buttonSize = useButtonSize();
  const {soundId, queue, maxReached, volume, setSoundId, playSound} =
    useCascade();

  const volumeLabel = queue.length
    ? `Last Sound Volume: ${volume}`
    : 'No sounds are playing…';

  return (
    <section className={clx('main-section', styles.Cascade)}>
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

      <Text size="small" variant={maxReached ? 'danger' : 'normal'}>
        <strong>{volumeLabel}</strong>
      </Text>

      <StackListAuto items={queue} />
    </section>
  );
}
