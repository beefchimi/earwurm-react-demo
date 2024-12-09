import {type ReactNode} from 'react';

import {DisplayText} from '@src/components/ui/DisplayText/DisplayText.tsx';

import {SiteNav} from './parts/SiteNav.tsx';
import styles from './Header.module.css';

export interface HeaderProps {
  children?: ReactNode;
}

export function Header({children}: HeaderProps) {
  return (
    <header id="Page-Header" className={styles.Header}>
      <div className={styles.Layout}>
        <DisplayText truncate>Section: Header</DisplayText>
        <SiteNav />
      </div>

      {children}
    </header>
  );
}
