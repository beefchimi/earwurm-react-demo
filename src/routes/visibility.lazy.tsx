import {createLazyFileRoute} from '@tanstack/react-router';
import {Visibility} from '@src/features/visibility/Visibility.tsx';

export const Route = createLazyFileRoute('/visibility')({
  component: VisibilityRoute,
});

export function VisibilityRoute() {
  return <Visibility />;
}
