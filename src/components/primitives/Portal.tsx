import {createPortal} from 'react-dom';

export interface PortalProps {
  children?: Parameters<typeof createPortal>[0];
  target?: Parameters<typeof createPortal>[1];
}

export function Portal({children, target}: PortalProps) {
  const fragment = <>{children}</>;
  const safeTarget = target ?? document.body;

  return createPortal(fragment, safeTarget);
}
