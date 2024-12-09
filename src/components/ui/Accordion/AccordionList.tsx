import type {ReactNode} from 'react';
import styles from './AccordionList.module.css';

export interface AccordionListProps {
  children: ReactNode;
}

export function AccordionList({children}: AccordionListProps) {
  return <ul className={styles.AccordionList}>{children}</ul>;
}

interface AccordionItemProps {
  children: ReactNode;
}

function AccordionItem({children}: AccordionItemProps) {
  return <li className={styles.AccordionItem}>{children}</li>;
}

// Attached sub-components.
AccordionList.Item = AccordionItem;
