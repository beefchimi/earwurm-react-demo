import {useEffect, useRef} from 'react';

export function useUnmount(callback: () => void) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(
    () => () => {
      callbackRef.current();
    },
    [],
  );
}
