import { BitboardKey } from "../bitboard/bitboard.constants.js";
import { SQUARE_TO_BB } from "../board/board.constants.js";
import { Bitboard, Square } from "../board/types.chess.js";
import { Timer } from "../debug/timer.debug.js";
import { getColour, getType } from "../piece/piece.chess.js";
import { PIECE_COLOURS } from "../piece/piece.constants.js";
import { Piece } from "../piece/piece.types.js";
import { toSquare } from "./square.utils.js";

export let lsbTimer = 0;

export function bitboardToBigint(bb: Bitboard) {
  return BigInt(bb[0] >>> 0) | (BigInt(bb[1] >>> 0) << 32n);
}
export function bbToString([lo, hi]: Bitboard): string {
  const low = (lo >>> 0).toString(2);
  const high = hi !== 0 ? (hi >>> 0).toString(2) : "";

  return high + (hi !== 0 ? low.padStart(32, "0") : low);
}
export function createBitboard(lo: number = 0, hi: number = 0): Bitboard {
  return [lo >>> 0, hi >>> 0];
}
export function multiply(a: Bitboard, b: Bitboard): Bitboard {
  const loProduct = BigInt(a[0] >>> 0) * BigInt(b[1] >>> 0);

  const lo = Number(loProduct & 0xffffffffn) >>> 0;

  const hi =
    Number((loProduct >> 32n) & 0xffffffffn) +
    Math.imul(a[0], b[1]) +
    Math.imul(a[1], b[0]);

  return [lo, hi >>> 0];
}
// export function multiply(a: Bitboard, b: Bitboard): Bitboard {
//   const a0 = a[0] & 0xffff;
//   const a1 = a[0] >>> 16;
//   const b0 = b[0] & 0xffff;
//   const b1 = b[0] >>> 16;
//
//   const lowProduct = a0 * b0;
//   const middle = a1 * b0 + a0 * b1 + (lowProduct >>> 16);
//
//   const low = ((lowProduct & 0xffff) | ((middle & 0xffff) << 16)) >>> 0;
//
//   const high = (a[1] * b[0] + a[0] * b[1] + a1 * b1 + (middle >>> 16)) >>> 0;
//
//   return [low, high];
// }
export function equals(a: Bitboard, b: Bitboard): boolean {
  return a[0] === b[0] && a[1] === b[1];
}
export function AND(a: Bitboard, b: Bitboard): Bitboard {
  return [(a[0] & b[0]) >>> 0, (a[1] & b[1]) >>> 0];
}

export function OR(a: Bitboard, b: Bitboard): Bitboard {
  return [(a[0] | b[0]) >>> 0, (a[1] | b[1]) >>> 0];
}

export function XOR(a: Bitboard, b: Bitboard): Bitboard {
  return [(a[0] ^ b[0]) >>> 0, (a[1] ^ b[1]) >>> 0];
}

export function NOT([lo, hi]: Bitboard): Bitboard {
  return [~lo >>> 0, ~hi >>> 0];
}
export function leftShift([lo, hi]: Bitboard, n: number): Bitboard {
  if (n === 0) return [lo, hi];
  if (n >= 64) return [0, 0];
  if (n >= 32) return [0, (lo << (n - 32)) >>> 0];

  return [(lo << n) >>> 0, ((hi << n) | (lo >>> (32 - n))) >>> 0];
}
export function rightShift([lo, hi]: Bitboard, n: number): Bitboard {
  if (n === 0) return [lo, hi];
  if (n >= 64) return [0, 0];
  if (n >= 32) return [hi >>> (n - 32), 0];

  return [((lo >>> n) | (hi << (32 - n))) >>> 0, hi >>> n];
}
export function pieceToIndex(piece: Piece): number {
  return getType(piece) - 1 + (getColour(piece) >> 4) * 6;
}
export function bigintToBitboard(v: bigint): Bitboard {
  return [Number(v & 0xffffffffn), Number((v >> 32n) & 0xffffffffn)];
}
export function indexBB(n: number): 0 | 1 {
  return (n >>> 5) as 0 | 1;
}
export function offsetSquare(square: number): number {
  return square & 31;
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

// export function clearLSB(bb: Bitboard): Bitboard {
//   return bb & (bb - 1n);
// }

// export function getLSBIndex(bb: Bitboard): Square | null {
//   if (bb.low + bb.high === 0 || bb.low + bb.high >= 1 << 64) return null;
//   return toSquare(1);
//   // if (bb === 0n || bb >= 1n << 64n) return null;
//   // return toSquare(Math.log2(Number(bb & -bb)));
//   // const lsb = bb & -bb;
//   // const index = (lsb.toString(2).length - 1) as Square;
//   // return index;
// }
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

// const S = [1, 2, 4, 8, 16];
// const B = [0x55555555, 0x33333333, 0x0f0f0f0f, 0x00ff00ff, 0x0000ffff];
// export function popCount(bb: Bitboard): number {
//   let cLow = 0;
//   let cHigh = 0;
//   let low = bb[0];
//   let high = bb[1];
//
//   cLow = low - ((low >>> 1) & B[0]!);
//   cLow = ((cLow >>> S[1]!) & B[1]!) + (cLow & B[1]!);
//   cLow = ((cLow >>> S[2]!) + cLow) & B[2]!;
//   cLow = ((cLow >>> S[3]!) + cLow) & B[3]!;
//   cLow = ((cLow >>> S[4]!) + cLow) & B[4]!;
//
//   cHigh = high - ((high >>> 1) & B[0]!);
//   cHigh = ((cHigh >>> S[1]!) & B[1]!) + (cHigh & B[1]!);
//   cHigh = ((cHigh >>> S[2]!) + cHigh) & B[2]!;
//   cHigh = ((cHigh >>> S[3]!) + cHigh) & B[3]!;
//   cHigh = ((cHigh >>> S[4]!) + cHigh) & B[4]!;
//   return cLow + cHigh;
// }
export function clearLSB(bb: Bitboard): Bitboard {
  const idx = Number(bb[0] === 0);
  if (bb[idx] === 0) return bb;
  bb[idx] = bb[idx]! & (bb[idx]! - 1);
  return bb;
}
export function getLSBIndex(bb: Bitboard): Square | null {
  if (bb[0] === 0 && bb[1] === 0) return null;

  const idx = Number(bb[0] === 0);
  const lsb = bb[idx]! & -bb[idx]!;

  return (idx * 32 + 31 - Math.clz32(lsb)) as Square;
}
export function popCount(bb: Bitboard): number {
  let count = 0;

  bb = [...bb];
  while (!equals(bb, [0, 0])) {
    bb = clearLSB(bb);
    count++;
  }

  return count;
}
