import {type CSSProperties} from 'react';
import {clx} from 'beeftools';

import styles from './Conway.module.css';

export interface ConwayItemProps {
  label?: string;
  lifeProgress?: number;
}

export function ConwayItem({label, lifeProgress}: ConwayItemProps) {
  const isAlive = lifeProgress !== undefined;
  const positionLabel = label ? label.split('-')[0] : undefined;
  const dateLabel = label && isAlive ? label.split('-')[1] : undefined;

  return (
    <li
      className={clx(styles.Item, {[styles.living]: isAlive})}
      style={
        {
          '--conway-cell-life-progress': lifeProgress,
        } as CSSProperties
      }
    >
      {positionLabel ? <p>{positionLabel}</p> : null}
      {dateLabel ? <p>{dateLabel}</p> : null}
    </li>
  );
}
