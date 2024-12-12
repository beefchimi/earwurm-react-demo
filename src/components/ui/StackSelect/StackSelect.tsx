import {useCallback, type ChangeEventHandler} from 'react';
import {clx} from 'beeftools';

import {
  AUDIO_LIB_KEYS,
  assertStackId,
  type AudioLibKey,
} from '@src/store/earwurm.ts';
import styles from './StackSelect.module.css';

interface StackSelectProps {
  value?: AudioLibKey;
  disabled?: boolean;
  onChange: (value: AudioLibKey) => void;
}

const DEFAULT_VALUE = 'defaultLabel';

export function StackSelect({
  value,
  disabled = false,
  onChange,
}: StackSelectProps) {
  const handleChange: ChangeEventHandler<HTMLSelectElement> = useCallback(
    ({target}) => {
      const newValue = target.value;
      if (assertStackId(newValue)) onChange(newValue);
    },
    [onChange],
  );

  const optionsMarkup = AUDIO_LIB_KEYS.map((id) => (
    <option key={id} value={id}>
      {id}
    </option>
  ));

  return (
    <div className={styles.StackSelect}>
      <select
        id="StackSelect"
        name="StackSelect"
        className={styles.FormSelect}
        disabled={disabled}
        value={value ?? DEFAULT_VALUE}
        onChange={handleChange}
      >
        <option value={DEFAULT_VALUE} disabled>
          Select a sound asset…
        </option>
        {optionsMarkup}
      </select>

      <label
        htmlFor="StackSelect"
        className={clx('visually-hidden', styles.FormLabel)}
      >
        Select Stack
      </label>
    </div>
  );
}
