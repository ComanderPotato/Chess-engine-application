import { SQUARE_TO_BB } from "../board/board.constants.js";
import { Bitboard, Square } from "../board/types.chess.js";
import { Timer } from "../debug/timer.debug.js";
import { getColour, getType } from "../piece/piece.chess.js";
import { PIECE_COLOURS } from "../piece/piece.constants.js";
import { Piece } from "../piece/piece.types.js";
import { toSquare } from "./square.utils.js";

export let lsbTimer = 0;
export function pieceToIndex(piece: Piece): number {
  return getType(piece) - 1 + (getColour(piece) >> 4) * 6;
}

export function squareToBB(square: Square): Bitboard {
  return SQUARE_TO_BB[square]!;
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
  return toSquare(Math.log2(Number(bb & -bb)));
  // const lsb = bb & -bb;
  // const index = (lsb.toString(2).length - 1) as Square;
  // return index;
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

const S = [1n, 2n, 4n, 8n, 16n];
const b = [0x55555555n, 0x33333333n, 0x0f0f0f0fn, 0x00ff00ffn, 0x0000ffffn];
const popCountTimer = new Timer("Pop count");
export function popCountV2(v: Bitboard): number {
  popCountTimer.startTimer();
  let cLow = 0n;
  let cHigh = 0n;
  let low = v;
  let high = v >> 32n;

  cLow = low - ((low >> 1n) & b[0]!);
  cLow = ((cLow >> S[1]!) & b[1]!) + (cLow & b[1]!);
  cLow = ((cLow >> S[2]!) + cLow) & b[2]!;
  cLow = ((cLow >> S[3]!) + cLow) & b[3]!;
  cLow = ((cLow >> S[4]!) + cLow) & b[4]!;

  cHigh = high - ((high >> 1n) & b[0]!);
  cHigh = ((cHigh >> S[1]!) & b[1]!) + (cHigh & b[1]!);
  cHigh = ((cHigh >> S[2]!) + cHigh) & b[2]!;
  cHigh = ((cHigh >> S[3]!) + cHigh) & b[3]!;
  cHigh = ((cHigh >> S[4]!) + cHigh) & b[4]!;
  popCountTimer.stopTimer();
  return Number(cLow + cHigh);
}
export function popCount(bb: Bitboard): number {
  popCountTimer.startTimer();
  let count = 0;

  while (bb !== 0n) {
    bb = clearLSB(bb);
    count++;
  }

  popCountTimer.stopTimer();
  return count;
}
