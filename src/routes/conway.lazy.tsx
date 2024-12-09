import {createLazyFileRoute} from '@tanstack/react-router';
import {Conway} from '@src/features/conway/Conway.tsx';

export const Route = createLazyFileRoute('/conway')({
  component: ConwayRoute,
});

function ConwayRoute() {
  return <Conway />;
}
