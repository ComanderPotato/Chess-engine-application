import {
  FILE_MASKS,
  RANK_MASKS,
  LIGHT_SQUARE_PATTERN,
  DARK_SQUARE_PATTERN,
} from "../board/board.constants.js";
import { ReadonlyBitboards, Bitboard } from "../board/types.chess.js";
import { shiftNorth } from "../movegen/move/move.bitboard.js";

function generateMask(
  table: ReadonlyBitboards,
  start: number,
  end: number,
): Bitboard {
  if (start < 0 || end >= table.length || start > end)
    throw new Error("Start or end index invalid");

  let mask = 0n;
  for (let i = start; i <= end; i++) {
    mask |= table[i]!;
  }
  return mask;
}
export function generateFileMask(start: number, end: number = start): Bitboard {
  return generateMask(FILE_MASKS, start, end);
}
export function generateRankMask(start: number, end: number = start): Bitboard {
  return generateMask(RANK_MASKS, start, end);
}
export function generateLightSquaresMask(): Bitboard {
  let mask = 0n;
  for (let rank = 0; rank < 8; rank += 2) {
    mask |=
      (shiftNorth(LIGHT_SQUARE_PATTERN) | DARK_SQUARE_PATTERN) <<
      (8n * BigInt(rank));
  }
  return mask;
}
