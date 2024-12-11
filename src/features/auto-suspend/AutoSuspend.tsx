import {clx} from 'beeftools';

import {useButtonSize} from '@src/hooks/useButtonSize.ts';

import {Button} from '@src/components/ui/Button/Button.tsx';
import {SoundSelect} from '@src/components/ui/SoundSelect/SoundSelect.tsx';
import {StackListAuto} from '@src/components/ui/StackList/StackListAuto.tsx';
import {Text} from '@src/components/ui/Text/Text.tsx';

import {useAutoSuspend} from './useAutoSuspend.ts';
import styles from './AutoSuspend.module.css';

export function AutoSuspend() {
  const buttonSize = useButtonSize();
  const {soundId, queue, suspended, setSoundId, playSound} = useAutoSuspend();

  const maxLabel = suspended
    ? 'Earwurm has been suspended!'
    : 'The AudioContext is currently running…';

  return (
    <section className={clx('main-section', styles.AutoSuspend)}>
      <Text>
        In the pursuit of maximum optimization, you can auto-suspend the Earwurm
        AudioContext by listening for state changes and setting a timeout.
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

      <Text size="small" variant={suspended ? 'danger' : 'normal'}>
        <strong>{maxLabel}</strong>
      </Text>

      <StackListAuto items={queue} />
    </section>
  );
}
