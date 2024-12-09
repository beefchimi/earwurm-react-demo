import {assertInteger, arrayOfLength, clamp} from 'beeftools';
import type {
  ConwayPosition,
  ConwayNormalizedCell,
  ConwayCell,
  ConwaySeed,
  ConwayGrid,
} from './conway.types.ts';

export const DEFAULT_LIFESPAN = 100;
const SINGLE_AXIS_SIZE_LIMIT = [10, 100];

///
/// Helpers

export function calcCellLifeProgress(age = 0, maxLifespan = DEFAULT_LIFESPAN) {
  return age < 0 || maxLifespan <= 0
    ? 0
    : clamp(0, Math.round((age / maxLifespan) * 100), 100);
}

export function cellIsAlive(
  cell: ConwayPosition | ConwayCell,
): cell is ConwayCell {
  return (
    !Array.isArray(cell) &&
    assertInteger(cell.birthgen) &&
    assertInteger(cell.age)
  );
}

export function getCellKey(cell: ConwayPosition | ConwayCell) {
  const [x, y, birthgen, age] = normalizeSeedOrCell(cell);

  const position = `[${x}/${y}]`;
  const hasAgeData = assertInteger(birthgen) && assertInteger(age);

  return hasAgeData ? `${position}-(${birthgen}/${age})` : position;
}

export function normalizeSeedOrCell(
  cell: ConwayPosition | ConwayCell,
): ConwayNormalizedCell {
  if (!cellIsAlive(cell)) return cell;

  const {
    position: [x, y],
    birthgen,
    age,
  } = cell;
  return [x, y, birthgen, age];
}

///
/// Methods

export function sizeClamp(singleAxisSize = 0) {
  const [min, max] = SINGLE_AXIS_SIZE_LIMIT;
  return clamp(min, singleAxisSize, max);
}

export function giveCellLife(
  position: ConwayPosition,
  birthgen = 0,
): ConwayCell {
  return {position, birthgen, age: 0};
}

export function extractLivingCells(grid: ConwayGrid = []) {
  return grid.filter(cellIsAlive);
}

function matchPosition(first: ConwayPosition, second: ConwayPosition) {
  return first[0] === second[0] && first[1] === second[1];
}

function matchCellToPosition(
  cell: ConwayPosition | ConwayCell,
  collection: ConwayGrid = [],
) {
  const [x, y] = normalizeSeedOrCell(cell);

  const hasMatch = collection.some((compare) => {
    const [compareX, compareY] = normalizeSeedOrCell(compare);
    return matchPosition([x, y], [compareX, compareY]);
  });

  return hasMatch;
}

function getSeedSizeMinMax(singleAxisSize = SINGLE_AXIS_SIZE_LIMIT[0]) {
  const gridArea = Math.pow(singleAxisSize, 2);
  const min = Math.round(gridArea / 5);
  const max = Math.round(gridArea / 3);

  return [min, max];
}

export function generateSeed(
  singleAxisSize = SINGLE_AXIS_SIZE_LIMIT[0],
  giveLife = false,
) {
  const getRandomPosition = (max: number) => {
    const randomValue = Math.floor(Math.random() * max) + 1;
    return clamp(1, randomValue, max);
  };

  const livingCount = getSeedSizeMinMax(singleAxisSize)[0];

  const livingCells = arrayOfLength(livingCount).reduce<ConwayGrid>(
    (collection, _current) => {
      let x = getRandomPosition(singleAxisSize);
      let y = getRandomPosition(singleAxisSize);

      // Re-assign `x` and `y` if they are already in the collection.
      while (matchCellToPosition([x, y], collection)) {
        x = getRandomPosition(singleAxisSize);
        y = getRandomPosition(singleAxisSize);
      }

      const newCell: ConwayPosition | ConwayCell = giveLife
        ? giveCellLife([x, y])
        : [x, y];

      collection.push(newCell);

      return collection;
    },
    [],
  );

  return livingCells;
}

export function generateGrid(
  singleAxisSize = SINGLE_AXIS_SIZE_LIMIT[0],
  livingCells: ConwayGrid = [],
): ConwayGrid {
  const cellsCount = Math.pow(singleAxisSize, 2);

  return arrayOfLength(cellsCount).map((index) => {
    // Avoid `0` coordinates and always start at `1`.
    const x = (index % singleAxisSize) + 1;
    const y = Math.floor(index / singleAxisSize) + 1;

    const position: ConwayPosition = [x, y];
    const isAlive = matchCellToPosition([x, y], livingCells);

    return isAlive ? giveCellLife(position) : position;
  });
}

function validateGridPosition(
  cell: ConwayPosition | ConwayCell,
  singleAxisSize = SINGLE_AXIS_SIZE_LIMIT[0],
) {
  const [x, y] = normalizeSeedOrCell(cell);
  return x > 0 && y > 0 && x <= singleAxisSize && y <= singleAxisSize;
}

export function validateSeed(
  seed: ConwaySeed | ConwayGrid = [],
  singleAxisSize = SINGLE_AXIS_SIZE_LIMIT[0],
) {
  const withinGrid = seed.every((cell) =>
    validateGridPosition(cell, singleAxisSize),
  );

  const [min, max] = getSeedSizeMinMax(singleAxisSize);
  const withinRange = seed.length >= min && seed.length <= max;

  return withinGrid && withinRange;
}

function getLivingNeighbors(
  [x, y]: ConwayPosition,
  grid: ConwayGrid,
  singleAxisSize = SINGLE_AXIS_SIZE_LIMIT[0],
) {
  // Going clockwise from top-left.
  const initialScan: ConwaySeed = [
    [x - 1, y - 1],
    [x, y - 1],
    [x + 1, y - 1],

    [x + 1, y],
    [x + 1, y + 1],

    [x, y + 1],
    [x - 1, y + 1],

    [x - 1, y],
  ];

  // TODO: If ever we implement the `wrapAround` feature, we will need
  // to update this to convert `0` coordinates to the `min/max` edge value.
  const filteredScan = initialScan.filter((cell) => {
    return validateGridPosition(cell, singleAxisSize);
  });

  return filteredScan.filter((cell) => matchCellToPosition(cell, grid));
}

export function getNextGenGrid(
  grid: ConwayGrid,
  generation = 0,
  singleAxisSize = SINGLE_AXIS_SIZE_LIMIT[0],
  maxLifespan = DEFAULT_LIFESPAN,
): ConwayGrid {
  const livingCells = extractLivingCells(grid);

  // RULES: https://beltoforion.de/en/game_of_life/
  // 1. A live cell dies if it has fewer than two live neighbors.
  // 2. A live cell with two or three live neighbors lives on to the next generation.
  // 3. A live cell with more than three live neighbors dies.
  // 4. A dead cell will be brought back to live if it has exactly three live neighbors.
  return grid.map((cell) => {
    const [x, y, birthgen, age] = normalizeSeedOrCell(cell);
    const position: ConwayPosition = [x, y];

    const neighborsCount = getLivingNeighbors(
      position,
      livingCells,
      singleAxisSize,
    ).length;

    const currentlyAlive = birthgen !== undefined && age !== undefined;

    // Will be born
    if (!currentlyAlive && neighborsCount === 3) {
      return giveCellLife(position, generation);
    }

    // Will remain dead
    if (!currentlyAlive && neighborsCount !== 3) {
      return position;
    }

    const newAge = currentlyAlive ? generation - birthgen : undefined;

    const couldSurvive =
      currentlyAlive && (neighborsCount === 2 || neighborsCount === 3);

    const willSurvive =
      couldSurvive && assertInteger(newAge) && newAge < maxLifespan;

    // TODO: Push to a `cemetery` collection in condition of "will die".
    return willSurvive ? {position, birthgen, age: newAge} : position;
  });
}
