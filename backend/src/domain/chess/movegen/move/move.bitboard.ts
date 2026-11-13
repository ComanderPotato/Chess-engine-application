import {
  NOT_A_FILE_MASK,
  NOT_H_FILE_MASK,
  BOARD_MASK,
  SQUARE_TO_BIGINT,
} from "../../board/board.constants.js";

import { Bitboard } from "../../board/types.chess.js";
import { AND } from "../../utils/bitboard.utils.js";

export function shiftSouth(bb: Bitboard): Bitboard {
  return shiftRight(bb, 8);
}
export function shiftNorth(bb: Bitboard): Bitboard {
  return AND(shiftLeft(bb, 8), BOARD_MASK);
}
export function shiftSouthEast(bb: Bitboard): Bitboard {
  return shiftRight(AND(bb, NOT_H_FILE_MASK), 7);
}
export function shiftSouthWest(bb: Bitboard): Bitboard {
  return shiftRight(AND(bb, NOT_A_FILE_MASK), 9);
}
export function shiftNorthEast(bb: Bitboard): Bitboard {
  return AND(shiftLeft(AND(bb, NOT_H_FILE_MASK), 9), BOARD_MASK);
}
export function shiftNorthWest(bb: Bitboard): Bitboard {
  return AND(shiftLeft(AND(bb, NOT_A_FILE_MASK), 7), BOARD_MASK);
}
export function shiftEast(bb: Bitboard): Bitboard {
  return AND(shiftLeft(AND(bb, NOT_H_FILE_MASK), 1), BOARD_MASK);
}
export function shiftWest(bb: Bitboard): Bitboard {
  return shiftRight(AND(bb, NOT_A_FILE_MASK), 1);
}
// export function shiftRight(
//   bb: Bitboard,
//   n: number,
//   mask: Bitboard = BOARD_MASK,
// ): Bitboard {
//   return;
//   return AND(shiftLeft(AND(bb, mask), n), BOARD_MASK);
// }
export function shiftLeft([lo, hi]: Bitboard, n: number): Bitboard {
  if (n === 0) return [lo, hi];
  if (n >= 64) return [0, 0];
  if (n >= 32) return [0, (lo << (n - 32)) >>> 0];

  return [(lo << n) >>> 0, ((hi << n) | (lo >>> (32 - n))) >>> 0];
}
export function shiftRight([lo, hi]: Bitboard, n: number): Bitboard {
  if (n === 0) return [lo, hi];
  if (n >= 64) return [0, 0];
  if (n >= 32) return [hi >>> (n - 32), 0];

  return [((lo >>> n) | (hi << (32 - n))) >>> 0, hi >>> n];
}
// export function shiftLeft(
//   bb: Bitboard,
//   n: number,
//   mask: Bitboard = BOARD_MASK,
// ): Bitboard {
//   return shiftRight(AND(bb, mask), n);
// }
// export function shiftRight(bb: Bitboard, n: number) {
//   return bb << BigInt(n);
// }
// export function shiftLeft(bb: Bitboard, n: number) {
//   return bb >> BigInt(n);
// }
