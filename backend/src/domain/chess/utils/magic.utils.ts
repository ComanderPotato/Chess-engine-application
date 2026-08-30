import { BOARD_MASK } from "../board/board.constants.js";
import { Bitboard } from "../board/types.chess.js";
import crypto from "crypto";

export function computeIndex(
  blockerMask: Bitboard,
  magic: Bitboard,
  shift: number,
): number {
  blockerMask *= magic;
  blockerMask &= BOARD_MASK;
  blockerMask >>= BigInt(shift);
  return Number(blockerMask);
}

function random64(): bigint {
  crypto.randomBytes;
  return (
    (BigInt(Math.floor(Math.random() * 0x100000000)) << 32n) |
    BigInt(Math.floor(Math.random() * 0x100000000))
  );
}
export function randomMagic(): bigint {
  return random64() & random64() & random64();
}
export function randomBigint() {
  let u1: bigint, u2: bigint, u3: bigint, u4: bigint;
  u1 = random64() & 0xffffn;
  u2 = random64() & 0xffffn;
  u3 = random64() & 0xffffn;
  u4 = random64() & 0xffffn;
  return u1 | (u2 << 16n) | (u3 << 32n) | (u4 << 48n);
}
export function randomSparseBigint() {
  return randomBigint() & randomBigint() & randomBigint();
}
