import {useMediaQuery} from '@pkg/hooks';

export function usePrefersDark() {
  return useMediaQuery('(prefers-color-scheme: dark)');
}
