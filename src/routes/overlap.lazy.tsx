import {createLazyFileRoute} from '@tanstack/react-router';
import {Overlap} from '@src/features/overlap/Overlap.tsx';

export const Route = createLazyFileRoute('/overlap')({
  component: OverlapRoute,
});

export function OverlapRoute() {
  return <Overlap />;
}
