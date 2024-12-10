import {useEffect, useState} from 'react';
import {clx} from 'beeftools';
import {Link} from '@tanstack/react-router';

import {sitemap} from '@src/utilities/sitemap.ts';
import {useMinTablet} from '@src/hooks/media-queries/useMinMedia.ts';
import {Button} from '@src/components/ui/Button/Button.tsx';

import styles from './SiteNav.module.css';

export function SiteNav() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const minTablet = useMinTablet();
  const beforeTablet = !minTablet;

  function toggleMobileMenu() {
    setShowMobileMenu((current) => !current);
  }

  useEffect(() => {
    if (minTablet) {
      setShowMobileMenu(false);
    }
  }, [minTablet]);

  const mobileAction = minTablet ? null : (
    <Button
      label="Menu"
      ariaLabel="Toggle the site navigation"
      variant="background"
      outline
      onClick={toggleMobileMenu}
    />
  );

  return (
    <nav className={styles.SiteNav}>
      {mobileAction}

      <ul
        className={clx(styles.List, {
          [styles.mobileList]: beforeTablet,
          [styles.showMobileMenu]: showMobileMenu,
        })}
      >
        {sitemap.map(({route, title}) => (
          <li key={title} className={styles.Item}>
            <Link
              to={route}
              className={clx('button-basic', styles.Link)}
              activeProps={{
                className: styles.active,
              }}
              activeOptions={route === '/' ? {exact: true} : undefined}
            >
              {title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
