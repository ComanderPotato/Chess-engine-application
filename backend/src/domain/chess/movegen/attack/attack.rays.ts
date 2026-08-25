import { Square, Bitboard } from "../../board/types.chess.js";
import {
  hasDiagonalMovement,
  hasOrthogonalMovement,
} from "../../piece/piece.chess.js";
import { Piece } from "../../piece/piece.types.js";
import { setBit64, isBitSet64 } from "../../utils/bit.utils.js";
import { isValidDirection } from "../../utils/square.utils.js";
import {
  DIAGONAL_DIRECTIONS,
  Direction,
  ORTHOGONAL_DIRECTIONS,
  SQUARE_DIRECTIONS,
} from "../move/move.directions.js";

/*
 * ============= attack.ray ===============
 * Responsible for computing masks by walking the
 * ray until it either hits an invalid square (board
 * limits or by wrapping horizontally) or is met
 * by a blocker, which is just a set bit on a secondary
 * bitboard.
 */

export function walkRay(
  square: Square,
  direction: Direction,
  blockerMask: Bitboard = 0n,
): Bitboard {
  let mask = 0n;
  while (isValidDirection(square, direction)) {
    square = (square + SQUARE_DIRECTIONS[direction]) as Square;
    mask = setBit64(mask, square);
    if (isBitSet64(blockerMask, square)) break;
  }
  return mask;
}
export function walkOrthogonalRays(
  square: Square,
  blockerMask: Bitboard = 0n,
): Bitboard {
  let mask = 0n;
  for (const direction of ORTHOGONAL_DIRECTIONS) {
    mask |= walkRay(square, direction, blockerMask);
  }
  return mask;
}

export function walkDiagonalRays(
  square: Square,
  blockerMask: Bitboard = 0n,
): Bitboard {
  let mask = 0n;
  for (const direction of DIAGONAL_DIRECTIONS) {
    mask |= walkRay(square, direction, blockerMask);
  }
  return mask;
}
export function walkSlidingRays(
  square: Square,
  piece: Piece,
  blockerMask: Bitboard = 0n,
) {
  let mask = 0n;
  if (hasOrthogonalMovement(piece))
    mask |= walkOrthogonalRays(square, blockerMask);
  if (hasDiagonalMovement(piece)) mask |= walkDiagonalRays(square, blockerMask);
  return mask;
}
