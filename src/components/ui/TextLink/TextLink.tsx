import type {ReactNode} from 'react';
import {clx} from 'beeftools';

import {
  CommonAction,
  type CommonActionProps,
} from '@src/components/primitives/CommonAction/CommonAction.tsx';
import styles from './TextLink.module.css';

export interface TextLinkProps
  extends Pick<
    CommonActionProps,
    | 'id'
    | 'title'
    | 'ariaLabel'
    | 'disabled'
    | 'pressed'
    | 'url'
    | 'external'
    | 'onClick'
  > {
  // Consider restricting this to `string | number`.
  children: ReactNode;
}

export function TextLink({children, ...commonProps}: TextLinkProps) {
  return (
    <CommonAction
      className={clx(
        commonProps.onClick ? 'button-basic' : undefined,
        'link-basic',
        styles.TextLink
      )}
      {...commonProps}
    >
      {children}
    </CommonAction>
  );
}
