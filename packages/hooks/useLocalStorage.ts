import {useCallback, useEffect, useSyncExternalStore} from 'react';
import type {AnyObj, Fn} from 'beeftools';

// Adapted from:
// https://usehooks.com/uselocalstorage

type AcceptedTypes = string | number | boolean | AnyObj;
type AcceptedFn = (arg: AnyObj) => AcceptedTypes;

type LocalStorageValue = AcceptedTypes | AcceptedTypes[] | AcceptedFn;
type ServerSnapshotFn = Parameters<typeof useSyncExternalStore>[2];

type LocalStorageReturn = [
  state: LocalStorageValue,
  setter: (value: LocalStorageValue) => void,
];

function dispatchStorageEvent(key: string, newValue?: string | null) {
  window.dispatchEvent(new StorageEvent('storage', {key, newValue}));
}

function parseStore(store: unknown) {
  return JSON.parse(store as string) as AnyObj;
}

function setLocalStorageItem(key: string, value: LocalStorageValue) {
  const stringifiedValue = JSON.stringify(value);

  window.localStorage.setItem(key, stringifiedValue);
  dispatchStorageEvent(key, stringifiedValue);
}

function removeLocalStorageItem(key: string) {
  window.localStorage.removeItem(key);
  dispatchStorageEvent(key, null);
}

function getLocalStorageItem(key: string) {
  return window.localStorage.getItem(key);
}

const getLocalStorageServerSnapshot: ServerSnapshotFn = () => {
  throw Error('useLocalStorage is a client-only hook');
};

function useLocalStorageSubscribe(callback: Fn) {
  window.addEventListener('storage', callback);

  return () => {
    window.removeEventListener('storage', callback);
  };
}

// TODO: Fix this to accept a `generic` / infer the correct type from `initialValue`.
// For now, I prefer using the `TypedStorage` class.
export function useLocalStorage(key: string, initialValue: LocalStorageValue) {
  const getSnapshot = () => getLocalStorageItem(key);

  const store = useSyncExternalStore(
    useLocalStorageSubscribe,
    getSnapshot,
    getLocalStorageServerSnapshot,
  );

  // Handles both `set` and `remove`. By passing `undefined` or `null`,
  // `removeLocalStorageItem` is called on the provided `key`.
  const setState = useCallback(
    (value: LocalStorageValue) => {
      try {
        const isFn = typeof value === 'function';
        const parsed = isFn ? parseStore(store) : undefined;
        const nextState = parsed ?? value;

        if (nextState === undefined || nextState === null) {
          removeLocalStorageItem(key);
        } else {
          setLocalStorageItem(key, nextState);
        }
      } catch (error) {
        console.warn(error);
      }
    },
    [key, store],
  );

  useEffect(() => {
    if (
      getLocalStorageItem(key) === null &&
      typeof initialValue !== 'undefined'
    ) {
      setLocalStorageItem(key, initialValue);
    }
  }, [key, initialValue]);

  const finalValue = store ? parseStore(store) : initialValue;
  const finalTuple: LocalStorageReturn = [finalValue, setState];

  return finalTuple;
}
