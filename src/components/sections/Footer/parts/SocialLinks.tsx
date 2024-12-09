import {clx} from 'beeftools';

import SvgSocialLinkedIn from '@src/assets/svg/social-linkedin.svg?react';
import SvgSocialX from '@src/assets/svg/social-x.svg?react';
import SvgSocialYouTube from '@src/assets/svg/social-youtube.svg?react';

import styles from './SocialLinks.module.css';

export function SocialLinks() {
  return (
    <ul className={styles.SocialLinks}>
      <li className={styles.SocialLinkItem}>
        <a
          className={clx('button-basic', styles.SocialLinkAction)}
          href="#"
          title="Subscribe to my YouTube channel"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className={clx('icon-wrapper', styles.SocialIconWrapper)}>
            <SvgSocialYouTube />
          </div>
        </a>
      </li>

      <li className={styles.SocialLinkItem}>
        <a
          className={clx('button-basic', styles.SocialLinkAction)}
          href="#"
          title="Follow me on X"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className={clx('icon-wrapper', styles.SocialIconWrapper)}>
            <SvgSocialX />
          </div>
        </a>
      </li>

      <li className={styles.SocialLinkItem}>
        <a
          className={clx('button-basic', styles.SocialLinkAction)}
          href="#"
          title="Hire me on LinkedIn"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className={clx('icon-wrapper', styles.SocialIconWrapper)}>
            <SvgSocialLinkedIn />
          </div>
        </a>
      </li>
    </ul>
  );
}
