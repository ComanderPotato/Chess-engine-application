import { NOT_EDGE_MASK } from "../bitboard/bitboard.masks.js";
import {
  BOARD_SIZE,
  FILE_MASKS,
  FILES,
  RANK_MASKS,
  RANKS,
} from "../board/board.constants.js";
import { Bitboard, File, Rank, Square } from "../board/types.chess.js";
import {
  SQUARE_DIRECTIONS,
  Direction,
} from "../movegen/move/move.directions.js";

export function toSquare(value: number): Square {
  if (!isValidSquare(value)) {
    throw new Error(`Invalid square: ${value}`);
  }

  return value as Square;
}

// Classification
export function isOnSameFile(a: Square, b: Square): boolean {
  return toFile((a ^ b) as Square) === 0;
}
export function isOnSameRank(a: Square, b: Square): boolean {
  return toRank(a) - toRank(b) === 0;
}
export function isOnSameDiagonal(a: Square, b: Square): boolean {
  return toFile(toSquare(b - a)) === toRank(b) - toRank(a);
}
export function isOnAFile(square: Square): boolean {
  return isSquareOnFile(square, "A");
}
export function isOnHFile(square: Square): boolean {
  return isSquareOnFile(square, "H");
}
export function isOnFirstRank(square: Square): boolean {
  return isSquareOnRank(square, "FIRST");
}
export function isOnEighthRank(square: Square): boolean {
  return isSquareOnRank(square, "EIGHTH");
}
export function isSquareOnFile(square: Square, file: File): boolean {
  return toFile(square) === FILES[file];
}
export function isSquareOnRank(square: Square, rank: Rank): boolean {
  return toRank(square) === RANKS[rank];
}

export function isEdge(square: Square): boolean {
  const rank = toRank(square);
  const file = toFile(square);
  return (
    rank === RANKS.FIRST ||
    rank === RANKS.EIGHTH ||
    file === FILES.A ||
    file === FILES.H
  );
}
export function isCorner(square: Square): boolean {
  const rank = toRank(square);
  const file = toFile(square);
  return (
    (rank === RANKS.FIRST || rank === RANKS.EIGHTH) &&
    (file === FILES.A || file === FILES.H)
  );
}
export function hasHorizontalWrapping(
  from: Square,
  direction: Direction,
): boolean {
  const offset = SQUARE_DIRECTIONS[direction];
  const to = from + offset;
  if (!isValidSquare(to)) return true;

  const fileDiff = Math.abs(toFile(to) - toFile(from));

  if (
    offset === 1 ||
    offset === -1 ||
    offset === 7 ||
    offset === -7 ||
    offset === 9 ||
    offset === -9
  ) {
    return fileDiff !== 1;
  }

  return fileDiff !== 0;
}

// Distance
export function fileDistance(a: Square, b: Square): number {
  return Math.abs(toFile(a) - toFile(b));
}
export function rankDistance(a: Square, b: Square): number {
  return Math.abs(toRank(a) - toRank(b));
}

// Conversion
export function toFile(square: Square): number {
  return square & 7;
}
export function toRank(square: Square): number {
  return square >> 3;
}
export function fileRankToSquare(file: number, rank: number): Square {
  // return BOARD_DIMENSION * rank + file;
  return toSquare((rank << 3) + file);
}

// Validation
// export function isSquare(value: number): value is Square {
//   return isValidSquare(value);
// }
export function isValidSquare(value: number): value is Square {
  return value >= 0 && value < BOARD_SIZE;
}
export function isValidDirection(from: Square, direction: Direction): boolean {
  const to = from + SQUARE_DIRECTIONS[direction];
  return isValidSquare(to) && !hasHorizontalWrapping(from, direction);
}

// Extraction
export function getEdge(square: Square): Bitboard {
  if (isEdge(square)) {
    const rank = toRank(square);
    const file = toFile(square);
    return rank === 0 || rank === 7 ? RANK_MASKS[rank]! : FILE_MASKS[file]!;
  }
  return NOT_EDGE_MASK;
}
