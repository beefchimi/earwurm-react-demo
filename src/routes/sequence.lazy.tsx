import {createLazyFileRoute} from '@tanstack/react-router';
import {Sequence} from '@src/features/sequence/Sequence.tsx';

export const Route = createLazyFileRoute('/sequence')({
  component: SequenceRoute,
});

function SequenceRoute() {
  return <Sequence />;
}
