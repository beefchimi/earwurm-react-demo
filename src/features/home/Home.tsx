import {clx} from 'beeftools';

import styles from './Home.module.css';

export function Home() {
  return (
    <div className={styles.Home}>
      <div
        className={clx(styles.Card, {
          [styles.invert]: false,
        })}
      >
        <p>Select a audio pattern from the navigation list.</p>
      </div>
    </div>
  );
}
