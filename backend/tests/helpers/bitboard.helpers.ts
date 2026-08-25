import { Bitboard, Square } from "@/domain/chess/board/types.chess.js";
import { printBitboard } from "@/domain/chess/debug/printer.chess.js";
import {
  Direction,
  SQUARE_DIRECTIONS,
} from "@/domain/chess/movegen/move/move.directions.js";
import { PIECE_COLOURS as PieceColourConstants } from "@/domain/chess/piece/piece.constants.js";
import { PieceColour } from "@/domain/chess/piece/piece.types.js";
import { isBitSet64 } from "@/domain/chess/utils/bit.utils.js";
import { squareToCoord } from "@/domain/chess/utils/coord.utils.js";
import { isValidDirection } from "@/domain/chess/utils/square.utils.js";
import { expect } from "vitest";

export function assertRay(
  square: Square,
  ray: bigint,
  direction: Direction,
  expectSet: boolean = true,
  blocker: Bitboard = 0n,
): void {
  while (isValidDirection(square, direction)) {
    square = (square + SQUARE_DIRECTIONS[direction]) as Square;
    if (isBitSet64(blocker, square)) break;
    expect(((ray >> BigInt(square)) & 1n) !== 0n).toBe(expectSet);
  }
}

export function assertMagic(
  square: Square,
  mask: Bitboard,
  direction: Direction,
  blocker: Bitboard,
) {
  let passedBlocker = false;
  while (isValidDirection(square, direction)) {
    square = (square + SQUARE_DIRECTIONS[direction]) as Square;
    expect(isBitSet64(mask, square)).toBe(!passedBlocker);
    if (!passedBlocker && isBitSet64(blocker, square)) passedBlocker = true;
  }
}
