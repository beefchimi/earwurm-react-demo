import {createLazyFileRoute} from '@tanstack/react-router';
import {Home} from '@src/features/home/Home.tsx';

export const Route = createLazyFileRoute('/')({
  component: IndexRoute,
});

function IndexRoute() {
  return <Home />;
}
