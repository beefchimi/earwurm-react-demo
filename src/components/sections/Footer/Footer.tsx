import {DisplayText} from '@src/components/ui/DisplayText/DisplayText.tsx';
import {TextLink} from '@src/components/ui/TextLink/TextLink.tsx';

import {ActionsDemo} from './parts/ActionsDemo.tsx';
import {SocialLinks} from './parts/SocialLinks.tsx';

import styles from './Footer.module.css';

const CURRENT_YEAR = new Date().getFullYear();

export function Footer() {
  return (
    <footer id="Page-Footer" className={styles.Footer}>
      <DisplayText size="h6">Section: Footer</DisplayText>

      <div className={styles.Layout}>
        <p className={styles.LegalText}>
          {CURRENT_YEAR}{' '}
          <TextLink
            ariaLabel="Come to my house"
            url="https://dulmage.me/"
            external
          >
            Dulmage Inc.
          </TextLink>{' '}
          All rights reserved.
        </p>

        <ActionsDemo />
        <SocialLinks />
      </div>
    </footer>
  );
}
