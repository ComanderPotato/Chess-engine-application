export const BITBOARD_SHIFTS = {
  NW: 7n,
  NE: 9n,
  SE: 7n,
  SW: 9n,
  N: 8n,
  E: 1n,
  S: 8n,
  W: 1n,
} as const;

export const KNIGHT_SHIFTS = {
  // North
  N2W1: 15,
  N2E1: 17,

  // East
  N1E2: 10,
  S1E2: 6,

  // South
  S2E1: 15,
  S2W1: 17,

  // West
  N1W2: 6,
  S1W2: 10,
} as const;

export const KING_SHIFTS = BITBOARD_SHIFTS;

// export const BITBOARD_DIAGONAL_SHIFTS = {
//   NW: 7n,
//   NE: 9n,
//   SE: 7n,
//   SW: 9n,
// };
// export const BITBOARD_ORTHOGONAL_SHIFTS = {
//   N: 8n,
//   E: 1n,
//   S: 8n,
//   W: 1n,
// };

export const ALL_DIRECTIONS = [
  "N",
  "NE",
  "E",
  "SE",
  "S",
  "SW",
  "W",
  "NW",
] as const;

export type Direction = (typeof ALL_DIRECTIONS)[number];
export const ORTHOGONAL_DIRECTIONS = [
  "N",
  "E",
  "S",
  "W",
] as const satisfies readonly Direction[];
export type OrthogonalDirection = (typeof ORTHOGONAL_DIRECTIONS)[number];

export const DIAGONAL_DIRECTIONS = [
  "NW",
  "NE",
  "SW",
  "SE",
] as const satisfies readonly Direction[];
export type DiagonalDirection = (typeof DIAGONAL_DIRECTIONS)[number];

export const SQUARE_DIRECTIONS = {
  NW: 7,
  NE: 9,
  SE: -7,
  SW: -9,
  N: 8,
  E: 1,
  S: -8,
  W: -1,
};
