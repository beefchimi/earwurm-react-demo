import {clx} from 'beeftools';
import {createLazyFileRoute} from '@tanstack/react-router';

import {AccordionTest} from '@src/components/ui/Accordion/AccordionTest.tsx';
import {ButtonTest} from '@src/components/ui/Button/ButtonTest.tsx';

import styles from './HomePage.module.css';

export const Route = createLazyFileRoute('/')({
  component: Index,
});

function Index() {
  return (
    <div className={styles.HomePage}>
      <div
        className={clx(styles.Card, {
          [styles.invert]: false,
        })}
      >
        <AccordionTest />
      </div>

      <div
        className={clx(styles.Card, {
          [styles.invert]: false,
        })}
      >
        <ButtonTest />
      </div>
    </div>
  );
}
