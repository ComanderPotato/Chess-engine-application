import { Bitboard, Square } from "../board/types.chess.js";
import { getColour, getType } from "../piece/piece.chess.js";
import { PIECE_COLOURS } from "../piece/piece.constants.js";
import { Piece } from "../piece/piece.types.js";

export let lsbTimer = 0;
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
  if (bb === 0n || bb >= 1n << 64n) return null;
  const lsb = bb & -bb;
  const index = (lsb.toString(2).length - 1) as Square;
  return index;
}
// export function getLSBIndex(bb: Bitboard): Square | null {
//   if (bb === 0n) return null;
//   const timer = performance.now();
//   for (let bit = 0; bit < BOARD_SIZE; bit++) {
//     if (isBitSet64(bb, bit)) {
//       lsbTimer += performance.now() - timer;
//       return bit as Square;
//     }
//   }
//   lsbTimer += performance.now() - timer;
//   return null;
// }
export function popCount(bb: Bitboard): number {
  let count = 0;

  while (bb !== 0n) {
    bb = clearLSB(bb);
    count++;
  }

  return count;
}
