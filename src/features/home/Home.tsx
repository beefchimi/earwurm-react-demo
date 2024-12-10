import {clx} from 'beeftools';

import {Text} from '@src/components/ui/Text/Text.tsx';
import styles from './Home.module.css';

export function Home() {
  return (
    <div className={styles.Home}>
      <div
        className={clx(styles.Card, {
          [styles.invert]: false,
        })}
      >
        <Text>Select a audio pattern from the navigation list.</Text>
      </div>
    </div>
  );
}
