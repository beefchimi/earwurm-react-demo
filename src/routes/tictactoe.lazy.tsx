import {createLazyFileRoute} from '@tanstack/react-router';
import {TicTacToe} from '@src/features/tictactoe/TicTacToe.tsx';

export const Route = createLazyFileRoute('/tictactoe')({
  component: TicTacToeRoute,
});

function TicTacToeRoute() {
  return <TicTacToe />;
}
