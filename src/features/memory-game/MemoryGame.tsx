import {clx} from 'beeftools';

import {useMemoryGame} from './useMemoryGame.ts';
import styles from './MemoryGame.module.css';

interface MemoryItemProps {
  image: string;
  flipping?: boolean;
  flipped?: boolean;
  onFlip: () => void;
}

function MemoryItem({
  image,
  flipping = false,
  flipped = false,
  onFlip,
}: MemoryItemProps) {
  return (
    <li
      className={clx(styles.Card, {
        [styles.flipping]: flipping,
        [styles.flipped]: flipped,
      })}
    >
      <button
        type="button"
        className={clx('button-basic', styles.Action)}
        onClick={onFlip}
      >
        {flipping || flipped ? (
          <img src={image} className={clx('media-cover', styles.Image)} />
        ) : (
          <div className={styles.Placeholder} />
        )}
      </button>
    </li>
  );
}

export interface MemoryGameProps {
  images: string[];
}

export function MemoryGame({images = []}: MemoryGameProps) {
  const {
    state,
    difficulty,
    shuffled,
    error,
    turns,
    maxTurns,
    isFlipping,
    isFlipped,
    handleFlip,
  } = useMemoryGame(images);

  return (
    <div className={styles.MemoryGame}>
      <ul className={styles.Stats}>
        <li className={styles.StatItem}>
          <p>
            <strong>State:</strong> {state}
          </p>
        </li>
        <li className={styles.StatItem}>
          <p>
            <strong>Difficulty:</strong> {difficulty}
          </p>
        </li>
        <li className={styles.StatItem}>
          <p>
            <strong>Turns:</strong> {turns}
          </p>
        </li>
        <li className={styles.StatItem}>
          <p>
            <strong>Max turns:</strong> {maxTurns}
          </p>
        </li>
      </ul>

      {error ? (
        <div className={styles.Error}>
          <p>{error}</p>
        </div>
      ) : (
        <ul className={styles.List}>
          {shuffled.map((image, index) => (
            <MemoryItem
              key={`${image}-${index}`}
              image={image}
              flipping={isFlipping(image, index)}
              flipped={isFlipped(image)}
              onFlip={() => handleFlip(image, index)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
