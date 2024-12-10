import {createLazyFileRoute} from '@tanstack/react-router';
import {Cascade} from '@src/features/cascade/Cascade.tsx';

export const Route = createLazyFileRoute('/cascade')({
  component: CascadeRoute,
});

function CascadeRoute() {
  return <Cascade />;
}
