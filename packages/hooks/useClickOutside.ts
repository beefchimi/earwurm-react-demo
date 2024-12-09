import {useCallback, useRef} from 'react';
import {useIsoEffect} from './useIsoEffect.ts';

export type ClickOutsideCallback = (event: PointerEvent) => void;
export type ClickOutsideExclusion = (HTMLElement | null | undefined)[];

export interface ClickOutsideOptions {
  disabled?: boolean;
  exclude?: ClickOutsideExclusion;
}

export function useClickOutside(
  element: HTMLElement | null | undefined,
  callback: ClickOutsideCallback,
  options: ClickOutsideOptions = {},
) {
  const {disabled = false, exclude = []} = options;

  const elementRef = useRef(element);
  const callbackRef = useRef(callback);

  const handleCallback = useCallback(
    (event: PointerEvent) => {
      const element = elementRef.current;

      // TODO: Unsure why I require the final typecast for
      // `as HTMLElement` when that condition must already be `true`.
      if (
        element &&
        event.target instanceof HTMLElement &&
        !element.contains(event.target) &&
        !exclude.some((item) => item?.contains(event.target as HTMLElement))
      ) {
        callbackRef.current(event);
      }
    },
    [exclude],
  );

  useIsoEffect(() => {
    elementRef.current = element;
    callbackRef.current = callback;
  }, [callback, element]);

  useIsoEffect(() => {
    const target = element?.ownerDocument;
    const listenerOptions = {capture: true};

    if (!disabled && target) {
      target.addEventListener(
        'click',
        handleCallback as EventListener,
        listenerOptions,
      );
    }

    return () => {
      target?.removeEventListener(
        'click',
        handleCallback as EventListener,
        listenerOptions,
      );
    };
  }, [disabled]);
}
