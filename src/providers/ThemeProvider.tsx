import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';

import {TypedStorage} from '@pkg/classes';
import {usePrefersDark} from '@src/hooks/media-queries/usePrefersDark.ts';

export type AppTheme = 'light' | 'dark';

export interface AppThemeState {
  theme: AppTheme;
  setTheme: Dispatch<SetStateAction<AppTheme>>;
  toggleTheme: () => void;
}

export interface ThemeProviderProps {
  children: ReactNode;
}

const themeStorage = new TypedStorage<{theme: AppTheme}>();
const ThemeContext = createContext<AppThemeState | null>(null);

export function ThemeProvider({children}: ThemeProviderProps) {
  const prefersDark = usePrefersDark();

  const [theme, setTheme] = useState<AppTheme>(() => {
    const fromStorage = themeStorage.getItem('theme');
    if (fromStorage) return fromStorage;

    return prefersDark ? 'dark' : 'light';
  });

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'));
  }, []);

  // Does this really need to be memoized?
  const value = useMemo(
    () => ({theme, setTheme, toggleTheme}),
    [theme, toggleTheme],
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    themeStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme() must be used within a <ThemeProvider />');
  }

  return context;
}
