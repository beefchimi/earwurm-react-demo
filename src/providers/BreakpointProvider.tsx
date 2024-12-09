import {createContext, useContext, useMemo, type ReactNode} from 'react';

import {useMediaQuery} from '@pkg/hooks';
import {
  BREAKPOINT_ORDER,
  BREAKPOINT_QUERY_X,
  type BreakpointKey,
} from '@src/hooks/media-queries/breakpoints.ts';

export interface BreakpointState {
  onlyMobile: boolean;
  minPhablet: boolean;
  minTablet: boolean;
  minClassic: boolean;
  minHd: boolean;
  minDesktop: boolean;
  minWidescreen: boolean;
  minUltrawide: boolean;
  between: (
    min?: BreakpointKey | 'mobile',
    max?: BreakpointKey | 'infinite',
  ) => boolean;
}

export interface BreakpointProviderProps {
  children: ReactNode;
}

// TODO: The design of this Provider means that we re-render components
// even when they do not import a particular breakpoint value. To avoid
// this, each breakpoint needs to be its own context provider. Additionally,
// we cannot have a `between()` helper, as it would require all breakpoints
// to be in the same context and therefor cause unnecessary re-renders.
const BreakpointContext = createContext<BreakpointState | null>(null);

export function BreakpointProvider({children}: BreakpointProviderProps) {
  // We could include `prefersDark`, and rename our provider to
  // <MediaQueryProvider />... but checking for `color-scheme`
  // is likely to only ever happen once at the "theme" level.
  // const prefersDark = usePrefersDark();

  const minPhablet = useMediaQuery(BREAKPOINT_QUERY_X.phablet);
  const minTablet = useMediaQuery(BREAKPOINT_QUERY_X.tablet);
  const minClassic = useMediaQuery(BREAKPOINT_QUERY_X.classic);
  const minHd = useMediaQuery(BREAKPOINT_QUERY_X.hd);
  const minDesktop = useMediaQuery(BREAKPOINT_QUERY_X.desktop);
  const minWidescreen = useMediaQuery(BREAKPOINT_QUERY_X.widescreen);
  const minUltrawide = useMediaQuery(BREAKPOINT_QUERY_X.ultrawide);

  const value = useMemo(() => {
    // Must be kept in sync with the `useMediaQuery()` calls above.
    const queries = [
      minPhablet,
      minTablet,
      minClassic,
      minHd,
      minDesktop,
      minWidescreen,
      minUltrawide,
    ];

    // Debatable if we even want this helper, as it is just as
    // easy to do a condition like: `minPhablet && !minDesktop`.
    const between: BreakpointState['between'] = (
      min = 'mobile',
      max = 'infinite',
    ) => {
      const minMatch =
        min === 'mobile' ? true : queries[BREAKPOINT_ORDER.indexOf(min)];

      // The `max` value represents the breakpoint you want your
      // range to end BEFORE. Therefore, we check against `false`.
      const maxMatch =
        max === 'infinite'
          ? true
          : queries[BREAKPOINT_ORDER.indexOf(max)] === false;

      return minMatch && maxMatch;
    };

    return {
      onlyMobile: !minPhablet,
      minPhablet,
      minTablet,
      minClassic,
      minHd,
      minDesktop,
      minWidescreen,
      minUltrawide,
      between,
    };
  }, [
    minPhablet,
    minTablet,
    minClassic,
    minHd,
    minDesktop,
    minWidescreen,
    minUltrawide,
  ]);

  return (
    <BreakpointContext.Provider value={value}>
      {children}
    </BreakpointContext.Provider>
  );
}

// USAGE:
// All breakpoints are a `min-width` query. This allows you to do things like:
// 1. Am I at least `tablet` width?
//    - const {minTablet} = useBreakpoint();
// 2. Am I before `desktop` width?
//    - if (!minDesktop)
// 3. Am I at least `phablet` width, but before `desktop` width?
//    - if (between('phablet', 'desktop'))
//    - This is the equivalent of `minPhablet && !minDesktop`.

// eslint-disable-next-line react-refresh/only-export-components
export function useBreakpoint() {
  const context = useContext(BreakpointContext);

  if (!context) {
    throw new Error(
      'useBreakpoint() must be used within a <BreakpointProvider />',
    );
  }

  return context;
}
