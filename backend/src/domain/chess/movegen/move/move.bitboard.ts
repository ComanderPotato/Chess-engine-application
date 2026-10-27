import {
  NOT_A_FILE_MASK,
  NOT_H_FILE_MASK,
  BOARD_MASK,
} from "../../board/board.constants.js";

import { Bitboard } from "../../board/types.chess.js";

export function shiftSouth(bb: Bitboard): Bitboard {
  return bb >> 8n;
}
export function shiftNorth(bb: Bitboard): Bitboard {
  return (bb << 8n) & BOARD_MASK;
}
export function shiftSouthEast(bb: Bitboard): Bitboard {
  return (bb & NOT_H_FILE_MASK) >> 7n;
}
export function shiftSouthWest(bb: Bitboard): Bitboard {
  return (bb & NOT_A_FILE_MASK) >> 9n;
}
export function shiftNorthEast(bb: Bitboard): Bitboard {
  return ((bb & NOT_H_FILE_MASK) << 9n) & BOARD_MASK;
}
export function shiftNorthWest(bb: Bitboard): Bitboard {
  return ((bb & NOT_A_FILE_MASK) << 7n) & BOARD_MASK;
}
export function shiftEast(bb: Bitboard): Bitboard {
  return ((bb & NOT_H_FILE_MASK) << 1n) & BOARD_MASK;
}
export function shiftWest(bb: Bitboard): Bitboard {
  return (bb & NOT_A_FILE_MASK) >> 1n;
}
export function shiftRight(
  bb: Bitboard,
  n: number,
  mask: Bitboard = BOARD_MASK,
): Bitboard {
  return ((bb & mask) << BigInt(n)) & BOARD_MASK;
}
export function shiftLeft(
  bb: Bitboard,
  n: number,
  mask: Bitboard = BOARD_MASK,
): Bitboard {
  return (bb & mask) >> BigInt(n);
}
// export function shiftRight(bb: Bitboard, n: number) {
//   return bb << BigInt(n);
// }
// export function shiftLeft(bb: Bitboard, n: number) {
//   return bb >> BigInt(n);
// }
