import {type Dispatch, type SetStateAction, useState} from 'react';

import {useIsoEffect} from '../useIsoEffect.ts';
import {
  applyScrollStyles,
  resetScrollStyles,
  guessScrollbarWidthVertical,
  guessScrollbarWidthHorizontal,
} from './utilities.ts';
import type {ScrollLockOptions} from './types.ts';

// TODO: Not sure why this explicit type is needed.
type ScrollLockReturn = [
  state: boolean,
  dispatch: Dispatch<SetStateAction<boolean>>,
];

// NOTE: Original PR for this hook
// https://github.com/beefchimi/react-hooks/pull/47
export function useScrollLock(
  options: ScrollLockOptions = {},
): ScrollLockReturn {
  const [scrollingLocked, setScrollLock] = useState(false);

  // Using optional chaining on `document` in case this is SSR.
  const {
    target = document?.body,
    scrollAxis = 'vertical',
    scrollbarOffset,
    onLock,
    onUnlock,
  } = options;

  // If no `target` is passed, we assume the scrollable element
  // is the `documentElement`. In this case, we do not want to
  // pass the "fallback" `document.body`.
  const scrollbarTarget = options?.target ? target : undefined;

  useIsoEffect(() => {
    if (!scrollingLocked || !target) return;

    // Capture the original values to restore later.
    const {overflow, paddingRight, paddingBottom} = target.style;

    // An explicitly passed `scrollbarOffset` could be `0`,
    // so we will accept that value if passed.
    const scrollbarWidth = scrollbarOffset ?? {
      vertical: guessScrollbarWidthVertical(scrollbarTarget),
      horizontal: guessScrollbarWidthHorizontal(scrollbarTarget),
    };

    const captured = applyScrollStyles({
      target,
      scrollAxis,
      scrollbarWidth,
    });

    onLock?.(captured);

    return () => {
      resetScrollStyles({target, overflow, paddingRight, paddingBottom});
      onUnlock?.();
    };
  }, [scrollingLocked, target, scrollAxis, scrollbarOffset, onLock, onUnlock]);

  return [scrollingLocked, setScrollLock];
}
