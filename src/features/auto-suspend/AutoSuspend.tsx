import {clx} from 'beeftools';

import {useButtonSize} from '@src/hooks/useButtonSize.ts';

import {Button} from '@src/components/ui/Button/Button.tsx';
import {StackSelect} from '@src/components/ui/StackSelect/StackSelect.tsx';
import {StackListAuto} from '@src/components/ui/StackList/StackListAuto.tsx';
import {Text} from '@src/components/ui/Text/Text.tsx';

import {useAutoSuspend} from './useAutoSuspend.ts';
import styles from './AutoSuspend.module.css';

export function AutoSuspend() {
  const buttonSize = useButtonSize();
  const {stackId, queue, suspended, setStackId, playSound} = useAutoSuspend();

  const maxLabel = suspended
    ? 'Earwurm has been suspended!'
    : 'The AudioContext is currently running…';

  return (
    <section className={clx('main-section', styles.AutoSuspend)}>
      <Text>
        In the pursuit of maximum optimization, you can auto-suspend the Earwurm
        AudioContext by listening for state changes and setting a timeout.
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

      <Text size="small" variant={suspended ? 'danger' : 'normal'}>
        <strong>{maxLabel}</strong>
      </Text>

      <StackListAuto items={queue} />
    </section>
  );
}
