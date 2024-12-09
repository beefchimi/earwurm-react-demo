import {useMemo, type ReactNode} from 'react';
import {useLocation} from '@tanstack/react-router';

import {sitemap} from '@src/utilities/sitemap.ts';
import {DisplayText} from '@src/components/ui/DisplayText/DisplayText.tsx';

import styles from './Main.module.css';

export interface MainProps {
  children?: ReactNode;
}

const FALLBACK_TITLE = 'Section: Main';

export function Main({children}: MainProps) {
  const {pathname} = useLocation();

  const pageTitle = useMemo(() => {
    const matchedRoute = sitemap.find(({route}) => route === pathname);
    return matchedRoute?.title ?? FALLBACK_TITLE;
  }, [pathname]);

  return (
    <main id="Page-Main" className={styles.Main}>
      <DisplayText size="h2">{pageTitle}</DisplayText>
      {children}
    </main>
  );
}
