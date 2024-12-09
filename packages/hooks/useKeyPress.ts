import {useCallback, useRef} from 'react';
import type {GlobalEventTarget} from 'beeftools';

import {useIsoEffect} from './useIsoEffect.ts';

// TODO: Could consider using an array of event types:
// https://github.com/beefchimi/react-hooks/issues/21
export type KeyPressEventType = 'keydown' | 'keypress' | 'keyup';
export type KeyPressCallback = (event: KeyboardEvent) => void;
export type KeyPressInput = string[];

// TODO: Consider a `preferKeyCode` boolean option:
// https://github.com/beefchimi/react-hooks/issues/24
export interface KeyPressOptions {
  eventType?: KeyPressEventType;
  target?: GlobalEventTarget;
  disabled?: boolean;
}

export function useKeyPress(
  keys: KeyPressInput,
  callback: KeyPressCallback,
  options: KeyPressOptions = {},
) {
  const {eventType = 'keydown', target = document, disabled = false} = options;

  const callbackRef = useRef(callback);

  const handleCallback: KeyPressCallback = useCallback(
    (event) => {
      const requiredKeysEngaged = keys.some((key) => event.key === key);

      if (requiredKeysEngaged) {
        callbackRef.current?.(event);
      }
    },
    [keys],
  );

  useIsoEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useIsoEffect(() => {
    if (!disabled && target) {
      target.addEventListener(eventType, handleCallback as EventListener);
    }

    return () => {
      target?.removeEventListener(eventType, handleCallback as EventListener);
    };
  }, [eventType, target, disabled]);
}
