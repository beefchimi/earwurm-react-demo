import {useEffect, type ReactNode} from 'react';
import {
  useTransitionState,
  type TransitionStatus,
} from 'react-transition-state';
import {clx} from 'beeftools';

import {useKeyPress, useScrollLock} from '@pkg/hooks';
import styles from './Overlay.module.css';

export interface OverlayProps {
  children?: ReactNode;
  open?: boolean;
  onClose?: () => void;
}

interface OverlayPrimitiveProps
  extends Pick<OverlayProps, 'children' | 'onClose'> {
  animationState?: TransitionStatus;
}

function OverlayPrimitive({
  children,
  animationState = 'unmounted',
  onClose,
}: OverlayPrimitiveProps) {
  const [_scrollingLocked, setScrollLock] = useScrollLock();

  useEffect(() => {
    setScrollLock(true);

    return () => {
      setScrollLock(false);
    };
  }, [setScrollLock]);

  return (
    <div
      className={clx(styles.Overlay, {
        [styles[animationState]]: Boolean(animationState),
      })}
      onClick={onClose}
    >
      {children}
    </div>
  );
}

export function Overlay({children, open = false, onClose}: OverlayProps) {
  const [{status, isMounted}, toggle] = useTransitionState({
    // TODO: This needs to align with our `--speed` values.
    timeout: 480,
    mountOnEnter: true,
    unmountOnExit: true,
    preEnter: true,
  });

  function handleClose() {
    toggle(false);
    onClose?.();
  }

  useEffect(() => {
    toggle(open);

    return () => {
      toggle(false);
    };
  }, [open, toggle]);

  // TODO: This will NOT get called if an <iframe /> (YouTube embed)
  // has focus... not sure if we can resolve this, but we may want
  // to consider an explicit `Close` button within the <Overlay />.
  useKeyPress(['Escape'], handleClose, {disabled: !open});

  return isMounted ? (
    <OverlayPrimitive animationState={status} onClose={handleClose}>
      {children}
    </OverlayPrimitive>
  ) : null;
}
