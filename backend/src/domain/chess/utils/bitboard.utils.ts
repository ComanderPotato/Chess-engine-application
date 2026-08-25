import { BOARD_SIZE } from "../board/board.constants.js";
import { Bitboard, Square } from "../board/types.chess.js";
import { getColour, getType } from "../piece/piece.chess.js";
import { PIECE_COLOURS } from "../piece/piece.constants.js";
import { Piece } from "../piece/piece.types.js";
import { isBitSet64 } from "./bit.utils.js";

export function pieceToIndex(piece: Piece): number {
  return getType(piece) - 1 + (getColour(piece) >> 4) * 6;
}

export function indexToPiece(index: number): Piece {
  if (index < 0 || index > 11) {
    throw new Error("Invalid piece index");
  }
  const colour = index >= 6 ? PIECE_COLOURS.Black : PIECE_COLOURS.White;
  const pieceType = (index % 6) + 1;

  return pieceType | colour;
}

export function clearLSB(bb: Bitboard): Bitboard {
  return bb & (bb - 1n);
}
export function getLSBIndex(bb: Bitboard): Square | null {
  if (bb === 0n) return null;
  for (let bit = 0; bit < BOARD_SIZE; bit++) {
    if (isBitSet64(bb, bit)) return bit as Square;
  }
  return null;
}
export function popCount(bb: Bitboard): number {
  let count = 0;

  while (bb !== 0n) {
    bb = clearLSB(bb);
    count++;
  }

  return count;
}
