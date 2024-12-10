import {useMemo} from 'react';

import {useBreakpoint} from '@src/providers/BreakpointProvider.tsx';
import {type ButtonProps} from '@src/components/ui/Button/Button.tsx';

export function useButtonSize() {
  const {minTablet, minDesktop} = useBreakpoint();

  const buttonSize: ButtonProps['size'] = useMemo(() => {
    if (minDesktop) return 'large';
    if (minTablet) return 'medium';
    return 'small';
  }, [minTablet, minDesktop]);

  return buttonSize;
}
