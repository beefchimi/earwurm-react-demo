import {createLazyFileRoute} from '@tanstack/react-router';
import {Replaced} from '@src/features/replaced/Replaced.tsx';

export const Route = createLazyFileRoute('/replaced')({
  component: ReplacedRoute,
});

function ReplacedRoute() {
  return <Replaced />;
}
