import {createLazyFileRoute} from '@tanstack/react-router';
import {Queued} from '@src/features/queued/Queued.tsx';

export const Route = createLazyFileRoute('/queued')({
  component: QueuedRoute,
});

function QueuedRoute() {
  return <Queued />;
}
