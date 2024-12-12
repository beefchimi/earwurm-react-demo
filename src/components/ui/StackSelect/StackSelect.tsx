import {useCallback, type ChangeEventHandler} from 'react';
import {clx} from 'beeftools';

import {
  AUDIO_LIB_KEYS,
  assertSoundId,
  type AudioLibKey,
} from '@src/store/earwurm.ts';
import styles from './SoundSelect.module.css';

interface SoundSelectProps {
  value?: AudioLibKey;
  disabled?: boolean;
  onChange: (value: AudioLibKey) => void;
}

const DEFAULT_VALUE = 'defaultLabel';

export function SoundSelect({
  value,
  disabled = false,
  onChange,
}: SoundSelectProps) {
  const handleChange: ChangeEventHandler<HTMLSelectElement> = useCallback(
    ({target}) => {
      const newValue = target.value;
      if (assertSoundId(newValue)) onChange(newValue);
    },
    [onChange],
  );

  const optionsMarkup = AUDIO_LIB_KEYS.map((id) => (
    <option key={id} value={id}>
      {id}
    </option>
  ));

  return (
    <div className={styles.SoundSelect}>
      <select
        id="SoundSelect"
        name="SoundSelect"
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
        htmlFor="SoundSelect"
        className={clx('visually-hidden', styles.FormLabel)}
      >
        Select Sound
      </label>
    </div>
  );
}
