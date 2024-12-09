import {clamp} from 'beeftools';

import styles from './Spinner.module.css';

export interface SpinnerProps {
  size?: number;
  ariaLabel?: string;
}

export function Spinner({size = 16, ariaLabel = 'Loading…'}: SpinnerProps) {
  const safeSize = clamp(10, size, 200);

  // If using `rem` units:
  // const remSize = safeSize / 10;
  // style={{fontSize: `${safeSize}rem`}}

  // TODO: Using `data-spinner` attribute as a selector pattern
  // for other components to leverage.
  return (
    <div
      className={styles.Spinner}
      style={{fontSize: safeSize}}
      data-spinner="simple"
    >
      <div className={styles.Icon} />
      <p className="visually-hidden">{ariaLabel}</p>
    </div>
  );
}
