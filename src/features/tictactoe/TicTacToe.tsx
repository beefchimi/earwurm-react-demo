import {useState} from 'react';
import {arrayOfLength, clx} from 'beeftools';

import styles from './TicTacToe.module.css';

type Player = 'X' | 'O';
type Cell = Player | undefined;
type Grid = Cell[];

const SIZE = 3;
const CELLS = Math.pow(SIZE, 2);

const INITIAL_CELLS: Grid = arrayOfLength(CELLS).map(() => undefined);

// TODO: Breaks if we change the `size`.
const MATCHES = [
  // Rows
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // Columns
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // Diagonals
  [0, 4, 8],
  [2, 4, 6],
];

export function TicTacToe() {
  const [grid, setGrid] = useState(INITIAL_CELLS);
  const [player, setPlayer] = useState<Player>('X');
  const [winningPlayer, setWinningPlayer] = useState<Player | undefined>();

  function handleReset() {
    setGrid(INITIAL_CELLS);
    setPlayer('X');
    setWinningPlayer(undefined);
  }

  function handleCellClick(clickedIndex: number) {
    const newGrid = grid.map((cell, cellIndex) =>
      cellIndex === clickedIndex ? player : cell,
    );

    setGrid(newGrid);

    /*
    const isDraw = MATCHES.every(([first, second, third]) => {
      const thing = grid[first]

      const disqualified = match.includes('X') && match.includes('O');
      return disqualified;
    });

    console.log('early isDraw', isDraw);
    */

    const isWinner = MATCHES.some((match) =>
      match.every((index) => newGrid[index] === player),
    );

    if (isWinner) {
      setWinningPlayer(player);
      return;
    }

    setPlayer((currentPlayer) => (currentPlayer === 'X' ? 'O' : 'X'));
  }

  const isDraw = grid.every((cell) => cell !== undefined) && !winningPlayer;
  const gameState = isDraw
    ? 'draw'
    : winningPlayer
      ? `Player ${winningPlayer} won`
      : 'playing';

  return (
    <div className={styles.TicTacToe}>
      <ul className={styles.Grid}>
        {grid.map((cell, index) => {
          const isDisabled =
            Boolean(winningPlayer) || Boolean(cell && grid.includes(cell));

          return (
            <li key={`Cell-${index}`} className={styles.Cell}>
              <button
                type="button"
                className={clx('button-basic', styles.CellAction)}
                disabled={isDisabled}
                onClick={() => handleCellClick(index)}
              >
                <span className={styles.Marker}>{cell}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className={styles.Info}>
        <p className={styles.Text}>
          <strong>Current player:</strong> {player}
        </p>

        <p className={styles.Text}>
          <strong>Game state:</strong> {gameState}
        </p>

        <button
          type="button"
          className={clx('button-basic', styles.Button)}
          onClick={handleReset}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
