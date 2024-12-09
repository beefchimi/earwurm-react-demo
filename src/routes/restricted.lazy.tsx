import {createLazyFileRoute} from '@tanstack/react-router';
import {Restricted} from '@src/features/restricted/Restricted.tsx';

export const Route = createLazyFileRoute('/restricted')({
  component: RestrictedRoute,
});

function RestrictedRoute() {
  return <Restricted />;
}
