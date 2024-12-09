import {createLazyFileRoute} from '@tanstack/react-router';
import {AutoSuspend} from '@src/features/auto-suspend/AutoSuspend.tsx';

export const Route = createLazyFileRoute('/auto-suspend')({
  component: AutoSuspendRoute,
});

export function AutoSuspendRoute() {
  return <AutoSuspend />;
}
