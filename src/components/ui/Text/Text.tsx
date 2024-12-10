import type {ReactNode} from 'react';
import {clx, vrx} from 'beeftools';

import styles from './Text.module.css';

export interface TextProps {
  // Consider restricting this to `string | number`.
  children: ReactNode;
  variant?: 'normal' | 'danger';
  size?: 'small' | 'medium';
  truncate?: boolean;
}

export function Text({
  children,
  variant = 'normal',
  size = 'medium',
  truncate = false,
}: TextProps) {
  return (
    <p
      className={clx(styles.Text, {
        [vrx('variant', variant, styles)]: Boolean(variant),
        [vrx('size', size, styles)]: Boolean(size),
        truncate: truncate,
      })}
    >
      {children}
    </p>
  );
}
