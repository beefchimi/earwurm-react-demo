import {useState} from 'react';
import {supportDom, supportMatchMedia} from 'beeftools';

import {useIsoEffect} from './useIsoEffect.ts';

export interface MediaQueryOptions {
  // The default value to return if the hook is being
  // run on the server (default is `false`).
  defaultValue?: boolean;
  // If `true` (default), the hook will initialize reading the
  // media query. In SSR, you should set it to `false`,
  // returning `options.defaultValue` or `false` initially.
  initializeWithValue?: boolean;
}

const IS_CLIENT = supportDom() && supportMatchMedia();

export function useMediaQuery(query = '', options?: MediaQueryOptions) {
  const defaultValue = options?.defaultValue ?? false;
  const initializeWithValue = options?.initializeWithValue ?? true;

  function getMatches(query = '') {
    return IS_CLIENT ? window.matchMedia(query).matches : defaultValue;
  }

  const [matches, setMatches] = useState(() => {
    return initializeWithValue ? getMatches(query) : defaultValue;
  });

  // Handles the change event of the media query.
  function handleChange() {
    setMatches(getMatches(query));
  }

  useIsoEffect(() => {
    const matchMedia = window.matchMedia(query);

    // Triggered at the first client-side load and if query changes.
    handleChange();

    matchMedia.addEventListener('change', handleChange);

    return () => {
      matchMedia.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
}
