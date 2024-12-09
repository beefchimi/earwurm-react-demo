import {useState, type CSSProperties} from 'react';
import {clx} from 'beeftools';

import {Button} from '@src/components/ui/Button/Button.tsx';

import {ConwayItem} from './ConwayItem.tsx';
import {useConway} from './useConway.ts';
import type {ConwaySeed} from './conway.types.ts';

import styles from './Conway.module.css';

export function Conway() {
  const [customSeed, setCustomSeed] = useState<ConwaySeed | undefined>();

  const {
    grid,
    size,
    maxLifespan,
    started,
    playing,
    extinction,
    generation,
    // Helpers
    isValidSeed,
    calcCellLifeProgress,
    cellIsAlive,
    getCellKey,
    // Actions
    getSeed,
    startGame,
    resumeGame,
    pauseGame,
    stopGame,
  } = useConway({
    seed: customSeed,
    singleAxisSize: 24,
    tickMs: 60,
    // maxLifespan: 60,
  });

  function handleGenerateSeed() {
    // TODO: Avoid this typecast.
    const newSeed = getSeed();
    setCustomSeed(newSeed as ConwaySeed);
  }

  const itemsMarkup = grid.map((cell, index) => {
    const key = getCellKey(cell);

    return (
      <ConwayItem
        key={key}
        label={cellIsAlive(cell) ? `${index}` : undefined}
        lifeProgress={
          cellIsAlive(cell)
            ? calcCellLifeProgress(cell.age, maxLifespan)
            : undefined
        }
      />
    );
  });

  const gridStyles = {
    '--conway-col-count': size,
  } as CSSProperties;

  const playAction = started ? null : (
    <li className={styles.ControlItem}>
      <Button
        label="Start Game"
        ariaLabel="Start the game"
        variant="primary"
        disabled={!isValidSeed}
        onClick={startGame}
      />
    </li>
  );

  const stopAction =
    started && !extinction ? (
      <li className={styles.ControlItem}>
        <Button
          label="Stop"
          ariaLabel="Stop the game"
          variant="danger"
          onClick={stopGame}
        />
      </li>
    ) : null;

  const pauseAction =
    started && playing && !extinction ? (
      <Button
        label="Pause"
        ariaLabel="Pause the game"
        variant="background"
        outline
        onClick={pauseGame}
      />
    ) : null;

  const resumeAction =
    started && !playing && !extinction ? (
      <Button
        label="Resume"
        ariaLabel="Resume the game"
        variant="background"
        outline
        onClick={resumeGame}
      />
    ) : null;

  const regenerateAction =
    !started && !extinction ? (
      <Button
        label="Regenerate seed"
        ariaLabel="Regenerate the seed"
        variant="background"
        outline
        onClick={handleGenerateSeed}
      />
    ) : null;

  const retryAction = extinction ? (
    <Button
      label="Retry"
      ariaLabel="Reboot the game"
      variant="danger"
      onClick={stopGame}
    />
  ) : null;

  const extinctionText = extinction ? (
    <p className={styles.Text}>
      <strong>Extinction!</strong> We have reached the end of civilization.
    </p>
  ) : null;

  return (
    <div className={styles.Conway}>
      <ul
        className={clx(styles.Grid, {
          [styles.started]: started,
        })}
        style={gridStyles}
      >
        {itemsMarkup}
      </ul>

      <p className={styles.Text}>
        <strong>Generation:</strong> {generation}
      </p>

      <ul className={styles.Controls}>
        {playAction ?? stopAction}
        {pauseAction ?? resumeAction}
        {regenerateAction}
        {retryAction}
      </ul>

      {extinctionText}
    </div>
  );
}
