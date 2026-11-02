import { Bitboard, Square } from "../board/types.chess.js";
import { squareToBB } from "./bitboard.utils.js";
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
export function isBitSet64(value: Bitboard, n: number): boolean {
  return ((value >> BigInt(n)) & 1n) !== 0n;
}
export function setBit32(value: number, n: number): number {
  return value | (1 << n);
}
export function setBit64(value: Bitboard, n: number): Bitboard {
  return value | squareToBB(toSquare(n));
}
export function clearBit32(value: number, n: number): number {
  return value & ~(1 << n);
}
export function clearBit64(value: Bitboard, n: number): Bitboard {
  return value & ~squareToBB(toSquare(n));
}

export function toBinary(value: bigint, bits: number = 8): string {
  value = narrowInt(value);
  const binary = value.toString(2);
  return binary.padStart(bits, "0");
}
