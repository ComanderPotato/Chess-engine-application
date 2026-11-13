import { SQUARE_TO_BIGINT } from "../board/board.constants.js";
import { Bitboard, Square } from "../board/types.chess.js";
import { indexBB, offsetSquare, squareToBB } from "./bitboard.utils.js";
import { toSquare } from "./square.utils.js";

export type Int = bigint | number;
export type Bit = bigint;

function narrowInt(value: Int): bigint {
  if (typeof value === "number") return BigInt(value >>> 0);
  return value;
}

export function isBitSet32(value: number, n: number): boolean {
  return ((value >> n) & 1) !== 0;
}
// export function isBitSet64(value: Bitboard, n: number): boolean {
//   return ((value >> SQUARE_TO_BIGINT[n]!) & 1n) !== 0n;
// }
export function setBit32(value: number, n: number): number {
  return value | (1 << n);
}
// export function setBit64(value: Bitboard, n: number): Bitboard {
//   return value | squareToBB(toSquare(n));
// }
export function clearBit32(value: number, n: number): number {
  return value & ~(1 << n);
}
// export function clearBit64(value: Bitboard, n: number): Bitboard {
//   return value & ~squareToBB(toSquare(n));
// }

export function toBinary(value: bigint, bits: number = 8): string {
  value = narrowInt(value);
  const binary = value.toString(2);
  return binary.padStart(bits, "0");
}
export function isBitSet(bb: Bitboard, n: number): boolean {
  const idx = indexBB(n);
  n = offsetSquare(n);
  return (bb[idx] & (1 << n)) !== 0;
}
export function clearBit(bb: Bitboard, n: number): Bitboard {
  const idx = indexBB(n);
  n = offsetSquare(n);
  bb[idx] &= ~(1 << n);
  return bb;
}
export function setBit(bb: Bitboard, n: number): Bitboard {
  const idx = indexBB(n);
  n = offsetSquare(n);
  bb[idx] |= 1 << n;
  return bb;
}
