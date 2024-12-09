import {createLazyFileRoute} from '@tanstack/react-router';
import {Asynchronous} from '@src/features/asynchronous/Asynchronous.tsx';

export const Route = createLazyFileRoute('/asynchronous')({
  component: AsynchronousRoute,
});

function AsynchronousRoute() {
  return <Asynchronous />;
}
