import {useEffect, forwardRef, type ForwardedRef} from 'react';
import {useTransitionState} from 'react-transition-state';
import {clx, vrx} from 'beeftools';

import {
  CommonAction,
  type CommonActionProps,
  type EitherElement,
} from '@src/components/primitives/CommonAction/CommonAction.tsx';
import {Spinner} from '@src/components/primitives/Spinner/Spinner.tsx';

import styles from './Button.module.css';

type CommonActionSubset = Omit<CommonActionProps, 'children' | 'className'>;

// TODO: Consider the following...
// 1. A `connectedAction` for an attached "button".
// 2. A `size` prop that is separate from mobile breakpoints.
// 3. Compound components for easier `children` composition.

/*
<Button>
  <Button.Icon src="arrow-up" />
  <Button.Label>Label</Button.Label>
  <Button.Icon src="plus" />
</Button>

<ButtonConnected>
  <Button>
    <Button.Label>Label</Button.Label>
  </Button>

  <Button>
    <Button.Icon src="arrow-down" />
  </Button>
</ButtonConnected>
*/

export interface ButtonProps extends CommonActionSubset {
  label: string | number;
  variant?:
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'foreground'
    | 'background'
    | 'danger';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  outline?: boolean;
}

function ButtonComponent(
  {
    label,
    variant = 'secondary',
    size = 'small',
    disabled = false,
    loading = false,
    outline = false,
    ...commonProps
  }: ButtonProps,
  ref: ForwardedRef<EitherElement>,
) {
  const [{status, isMounted}, toggle] = useTransitionState({
    // TODO: This needs to align with our `--speed` values.
    timeout: 240,
    initialEntered: true,
    mountOnEnter: true,
    unmountOnExit: true,
    preEnter: true,
  });

  useEffect(() => {
    toggle(loading);
  }, [loading, toggle]);

  const loadingMarkup =
    loading && isMounted ? (
      <div
        className={clx('position-cover', styles.SpinnerWrapper, {
          [styles[status]]: Boolean(status),
        })}
      >
        <Spinner />
      </div>
    ) : null;

  return (
    <CommonAction
      ref={ref}
      className={clx('button-basic', styles.Button, {
        [vrx('variant', variant, styles)]: Boolean(variant),
        [vrx('size', size, styles)]: Boolean(size),
        [styles.loading]: loading,
        [styles.outline]: outline,
      })}
      disabled={disabled || loading}
      {...commonProps}
    >
      <div className={styles.LabelWrapper}>
        <span className={styles.Label}>{label}</span>
      </div>

      {loadingMarkup}
    </CommonAction>
  );
}

export const Button = forwardRef(ButtonComponent);
