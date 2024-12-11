import type {ReactNode} from 'react';
import {clx} from 'beeftools';

import styles from './StackList.module.css';

export interface StackItemProps {
  label: string | number;
  empty?: boolean;
}

export interface StackListProps {
  children?: ReactNode;
}

function StackItem({label, empty = false}: StackItemProps) {
  return (
    <li className={clx(styles.StackItem, {[styles.empty]: empty})}>
      <p className={styles.StackLabel}>{label}</p>
    </li>
  );
}

export function StackList({children}: StackListProps) {
  return <ul className={styles.StackList}>{children}</ul>;
}

StackList.Item = StackItem;
