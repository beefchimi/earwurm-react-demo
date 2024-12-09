import {useMediaQuery} from '@pkg/hooks';
import {BREAKPOINT_QUERY_X} from './breakpoints.ts';

// These hooks are useful when there is no global "breakpoint provider".
// While we do offer a <BreakpointProvider />, it is not always recommended.
// The current implementation of `useBreakpoint()` causes re-renders when
// any breakpoint changes, even if it is not used by the component. Something
// like a `zustand` global store would be preferrable.

export function useMinPhablet() {
  return useMediaQuery(BREAKPOINT_QUERY_X.phablet);
}

export function useMinTablet() {
  return useMediaQuery(BREAKPOINT_QUERY_X.tablet);
}

export function useMinClassic() {
  return useMediaQuery(BREAKPOINT_QUERY_X.classic);
}

export function useMinHd() {
  return useMediaQuery(BREAKPOINT_QUERY_X.hd);
}

export function useMinDesktop() {
  return useMediaQuery(BREAKPOINT_QUERY_X.desktop);
}

export function useMinWidescreen() {
  return useMediaQuery(BREAKPOINT_QUERY_X.widescreen);
}

export function useMinUltrawide() {
  return useMediaQuery(BREAKPOINT_QUERY_X.ultrawide);
}
