import {useEffect, useRef} from 'react';
import {useIsoEffect} from './useIsoEffect.ts';

export type DocumentEventName = keyof DocumentEventMap;
export type DocumentEventFn = (
  event: DocumentEventMap[DocumentEventName],
) => void;

export function useDocumentEvent(
  eventName: DocumentEventName,
  callback: DocumentEventFn,
  options?: boolean | AddEventListenerOptions,
) {
  const callbackRef = useRef(callback);

  useIsoEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!document?.addEventListener) return;

    const listener: DocumentEventFn = (event) => {
      callbackRef.current(event);
    };

    document.addEventListener(eventName, listener, options);

    return () => {
      document.removeEventListener(eventName, listener, options);
    };
  }, [eventName, options]);
}
