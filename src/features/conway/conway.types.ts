export type ConwayPosition = [x: number, y: number];

export interface ConwayCell {
  position: ConwayPosition;
  birthgen: number;
  age: number;
}

export type ConwayNormalizedCell =
  | ConwayPosition
  | [...ConwayPosition, birthgen: number, age: number];

export type ConwaySeed = ConwayPosition[];
export type ConwayGrid = (ConwayPosition | ConwayCell)[];

export interface ConwayGrave extends ConwayCell {
  deathgen: number;
}

export type ConwayCemetery = ConwayGrave[];

export interface ConwayOptions {
  seed?: ConwaySeed;
  singleAxisSize?: number;
  tickMs?: number;
  maxLifespan?: number;
  // TODO: Consider these future features.
  // wrapAround?: boolean;
}
