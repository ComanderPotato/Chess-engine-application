import {
  EDGE_MASK,
  NOT_CORNER_MASK,
  NOT_EDGE_MASK,
} from "@/domain/chess/bitboard/bitboard.masks.js";
import {
  BOARD_MASK,
  FILE_MASKS,
  NOT_A_FILE_MASK,
  NOT_AB_FILES_MASK,
  NOT_GH_FILES_MASK,
  NOT_H_FILE_MASK,
  RANK_MASKS,
} from "@/domain/chess/board/board.constants.js";
import { Square, Bitboard } from "@/domain/chess/board/types.chess.js";
import {
  hasOrthogonalMovement,
  hasDiagonalMovement,
} from "@/domain/chess/piece/piece.chess.js";
import { Piece } from "@/domain/chess/piece/piece.types.js";
import {
  isCorner,
  getEdge,
  toFile,
  toRank,
} from "@/domain/chess/utils/square.utils.js";
import { walkDiagonalRays } from "./attack.rays.js";
import {
  shiftNorthWest,
  shiftNorthEast,
  shiftSouthEast,
  shiftSouthWest,
  shiftEast,
  shiftNorth,
  shiftSouth,
  shiftWest,
} from "../move/move.bitboard.js";
import { KNIGHT_SHIFTS } from "../move/move.directions.js";
import {
  AND,
  leftShift,
  NOT,
  OR,
  rightShift,
  squareToBB,
  XOR,
} from "../../utils/bitboard.utils.js";

/*
 * ============= attack.mask ===============
 * Responsible for computing attack masks for each
 * piece at a given square. Primarily used in pre-
 * computation to minimise overhead. For sliding pieces
 * edge squares are not included to mitigate computation
 * for magic bitboards.
 */

export function generateOrthogonalAttackMask(square: Square): Bitboard {
  const mask = isCorner(square)
    ? NOT_CORNER_MASK
    : OR(AND(getEdge(square), NOT_CORNER_MASK), NOT_EDGE_MASK);

  return AND(
    XOR(
      squareToBB(square),
      OR(FILE_MASKS[toFile(square)]!, RANK_MASKS[toRank(square)]!),
    ),
    mask,
  );
}
export function generateDiagonalAttackMask(square: Square): Bitboard {
  return AND(walkDiagonalRays(square), NOT(EDGE_MASK));
}

export function generateSlidingAttackMask(
  square: Square,
  piece: Piece,
): Bitboard {
  let mask: Bitboard = [0, 0];
  if (hasOrthogonalMovement(piece))
    mask = OR(mask, generateOrthogonalAttackMask(square));
  if (hasDiagonalMovement(piece))
    mask = OR(mask, generateDiagonalAttackMask(square));
  return mask;
}

export function generateWhitePawnAttackMask(square: Square): Bitboard {
  const bit = squareToBB(square);
  return OR(shiftNorthWest(bit), shiftNorthEast(bit));
}
export function generateBlackPawnAttackMask(square: Square): Bitboard {
  const bit = squareToBB(square);
  return OR(shiftSouthWest(bit), shiftSouthEast(bit));
}

export function generateKnightAttackMask(square: Square): Bitboard {
  const bit = squareToBB(square);

  return AND(
    OR(
      OR(
        OR(
          leftShift(AND(bit, NOT_A_FILE_MASK), KNIGHT_SHIFTS.N2W1),
          leftShift(AND(bit, NOT_H_FILE_MASK), KNIGHT_SHIFTS.N2E1),
        ),
        OR(
          leftShift(AND(bit, NOT_GH_FILES_MASK), KNIGHT_SHIFTS.N1E2),
          rightShift(AND(bit, NOT_GH_FILES_MASK), KNIGHT_SHIFTS.S1E2),
        ),
      ),
      OR(
        OR(
          rightShift(AND(bit, NOT_A_FILE_MASK), KNIGHT_SHIFTS.S2W1),
          rightShift(AND(bit, NOT_H_FILE_MASK), KNIGHT_SHIFTS.S2E1),
        ),
        OR(
          leftShift(AND(bit, NOT_AB_FILES_MASK), KNIGHT_SHIFTS.N1W2),
          rightShift(AND(bit, NOT_AB_FILES_MASK), KNIGHT_SHIFTS.S1W2),
        ),
      ),
    ),
    BOARD_MASK,
  );
}

// export function generateKnightAttackMask(square: Square): Bitboard {
//   const bit = squareToBB(square);
//
//   AND(bit, NOT_A_FILE_MASK)
//   return (
//     // North
//     (((bit & NOT_A_FILE_MASK) << KNIGHT_SHIFTS.N2W1) |
//       ((bit & NOT_H_FILE_MASK) << KNIGHT_SHIFTS.N2E1) |
//       // East
//       ((bit & NOT_GH_FILES_MASK) << KNIGHT_SHIFTS.N1E2) |
//       ((bit & NOT_GH_FILES_MASK) >> KNIGHT_SHIFTS.S1E2) |
//       // South
//       ((bit & NOT_A_FILE_MASK) >> KNIGHT_SHIFTS.S2W1) |
//       ((bit & NOT_H_FILE_MASK) >> KNIGHT_SHIFTS.S2E1) |
//       // West
//       ((bit & NOT_AB_FILES_MASK) << KNIGHT_SHIFTS.N1W2) |
//       ((bit & NOT_AB_FILES_MASK) >> KNIGHT_SHIFTS.S1W2)) &
//     BOARD_MASK
//   );
// }
export function generateKingAttackMask(square: Square): Bitboard {
  const bit = squareToBB(square);

  return AND(
    OR(
      OR(
        OR(shiftNorthWest(bit), shiftNorth(bit)),
        OR(shiftNorthEast(bit), shiftWest(bit)),
      ),
      OR(
        OR(shiftEast(bit), shiftSouthWest(bit)),
        OR(shiftSouth(bit), shiftSouthEast(bit)),
      ),
    ),
    BOARD_MASK,
  );
}
