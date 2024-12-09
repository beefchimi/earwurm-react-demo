import {
  type ButtonHTMLAttributes,
  type FocusEventHandler,
  type ForwardedRef,
  forwardRef,
  type MouseEventHandler,
  type PointerEventHandler,
  type ReactNode,
} from 'react';
import {clx} from 'beeftools';

// TODO: You can use any router library you like.
// import {Link} from 'react-router-dom';

import styles from './CommonAction.module.css';

export type EitherElement = HTMLAnchorElement | HTMLButtonElement;
type EitherPointer = PointerEventHandler<EitherElement>;
type ButtonFocus = FocusEventHandler<HTMLButtonElement>;
type ButtonClick = MouseEventHandler<HTMLButtonElement>;

export interface CommonActionBaseProps {
  children: ReactNode;
  id?: string;
  title?: string;
  className?: string;
  disabled?: boolean;
  pressed?: boolean;
  onPointerEnter?: EitherPointer;
  onPointerLeave?: EitherPointer;
  onPointerDown?: EitherPointer;
  onPointerUp?: EitherPointer;
}

export interface CommonActionLinkProps {
  // Consider supporting `LinkProps['to']`.
  url?: string;
  external?: boolean;
}

export interface CommonActionButtonProps {
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
  ariaLabel?: string;
  onBlur?: ButtonFocus;
  onFocus?: ButtonFocus;
  onClick?: ButtonClick;
}

// It is important to understand the prop heirarchy for this component.
// Link props take precedence and will lead to `<a href />` markup.
// Button specific props will not be shared with the `<a />` tag.
export type CommonActionProps = CommonActionBaseProps &
  CommonActionLinkProps &
  CommonActionButtonProps;

function CommonActionComponent(
  {
    children,
    id,
    title,
    className = '',
    disabled = false,
    pressed = false,
    onPointerEnter,
    onPointerLeave,
    onPointerDown,
    onPointerUp,
    // Link props
    url,
    external = false,
    // Button props
    type = 'button',
    ariaLabel,
    onBlur,
    onFocus,
    onClick,
  }: CommonActionProps,
  ref: ForwardedRef<EitherElement>,
) {
  const isDisabled = disabled ? true : undefined;
  const isPressed = pressed ? true : undefined;

  const globalProps = {
    id,
    title,
    'aria-label': ariaLabel,
    onPointerEnter,
    onPointerLeave,
    onPointerDown,
    onPointerUp,
  };

  if (url?.length) {
    const sharedLinkProps = {
      ...globalProps,
      ref: ref as ForwardedRef<HTMLAnchorElement>,
      className: clx(styles.PrimitiveLink, className),
      'data-link-disabled': isDisabled,
      'data-link-pressed': isPressed,
    };

    if (external) {
      return (
        <a
          href={url}
          {...sharedLinkProps}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      );
    } else {
      // TODO: To be used with a routing library like react-router-dom.
      /*
      return (
        <Link to={url} {...sharedLinkProps}>
          {children}
        </Link>
      );
      */

      return (
        <a href={url} {...sharedLinkProps}>
          {children}
        </a>
      );
    }
  }

  // Used to provide a unique state on the <button /> that is
  // separate from `disabled` but otherwise non-interactive.
  const hasInteraction = Boolean(onBlur ?? onFocus ?? onClick ?? onPointerDown);

  return (
    <button
      {...globalProps}
      ref={ref as ForwardedRef<HTMLButtonElement>}
      type={type}
      className={clx(styles.PrimitiveButton, className)}
      disabled={isDisabled}
      aria-pressed={isPressed}
      data-button-static={hasInteraction ? undefined : true}
      onBlur={onBlur}
      onFocus={onFocus}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export const CommonAction = forwardRef(CommonActionComponent);
