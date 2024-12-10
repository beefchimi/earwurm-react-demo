import type {ReactNode} from 'react';
import styles from './StackList.module.css';

export interface StackItemProps {
  label: string | number;
}

export interface StackListProps {
  children?: ReactNode;
}

function StackItem({label}: StackItemProps) {
  return (
    <li className={styles.StackItem}>
      <p className={styles.StackLabel}>{label}</p>
    </li>
  );
}

export function StackList({children}: StackListProps) {
  return (
    <ul className={styles.StackList}>
      {children ?? <StackItem label="Stack Queue is empty" />}
    </ul>
  );
}

StackList.Item = StackItem;
