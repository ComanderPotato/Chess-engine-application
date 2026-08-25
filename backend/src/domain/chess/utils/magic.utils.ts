import { BOARD_MASK } from "../board/board.constants.js";
import { Bitboard } from "../board/types.chess.js";

export function computeIndex(
  blockerMask: Bitboard,
  magic: Bitboard,
  shift: number,
): number {
  return Number(((blockerMask * magic) & BOARD_MASK) >> BigInt(shift));
}

function random64(): bigint {
  return (
    (BigInt(Math.floor(Math.random() * 0x100000000)) << 32n) |
    BigInt(Math.floor(Math.random() * 0x100000000))
  );
}
export function randomMagic(): bigint {
  return random64() & random64() & random64();
}
