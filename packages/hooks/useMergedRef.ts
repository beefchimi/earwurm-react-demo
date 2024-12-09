import {
  useCallback,
  type LegacyRef,
  type MutableRefObject,
  type RefCallback,
} from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRef<T = any> = MutableRefObject<T> | LegacyRef<T> | undefined | null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mergeRefs<T = any>(...refs: AnyRef<T>[]): RefCallback<T> {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref != null) {
        (ref as MutableRefObject<T | null>).current = value;
      }
    });
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useMergedRef<T = any>(refs: AnyRef<T>[]) {
  // TODO: This hook probably is not worth using, as it is not
  // properly memoizing the refs.
  return useCallback(() => mergeRefs(...refs), [refs]);
}
