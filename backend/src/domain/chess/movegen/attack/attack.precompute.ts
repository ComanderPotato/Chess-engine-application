// On startup functions
import { BOARD_SIZE, SQUARES } from "@/domain/chess/board/board.constants.js";
import {
  Bitboard,
  ReadonlyBitboards,
} from "@/domain/chess/board/types.chess.js";
import { Piece } from "@/domain/chess/piece/piece.types.js";
import {
  getRelevantBlockerSquares,
  generateBlockerConfigs,
} from "./attack.blocker.js";
import {
  generateOrthogonalAttackMask,
  generateDiagonalAttackMask,
  generateKnightAttackMask,
  generateKingAttackMask,
  generateWhitePawnAttackMask,
  generateBlackPawnAttackMask,
} from "./attack.mask.js";
import { computeIndex } from "../../utils/magic.utils.js";
import { walkRay, walkSlidingRays } from "./attack.rays.js";
import {
  isOnSameFile,
  isOnSameRank,
  isOnSameDiagonal,
  toRank,
  toFile,
} from "../../utils/square.utils.js";
import { Direction } from "../move/move.directions.js";
import { squareToBB } from "../../utils/bitboard.utils.js";

// ==== Pawn attack masks ====
export function precomputePawnAttackMasks(): [
  white: readonly Bitboard[],
  black: readonly Bitboard[],
] {
  const whiteAttackTable = new Array<Bitboard>(BOARD_SIZE);
  const blackAttackTable = new Array<Bitboard>(BOARD_SIZE);
  for (const square of SQUARES) {
    whiteAttackTable[square] = generateWhitePawnAttackMask(square);
    blackAttackTable[square] = generateBlackPawnAttackMask(square);
  }
  return [whiteAttackTable, blackAttackTable];
}

// ==== Knight attack masks ====
export function precomputeKnightAttackMasks(): ReadonlyBitboards {
  const attackTable = new Array<Bitboard>(BOARD_SIZE);
  for (const square of SQUARES) {
    attackTable[square] = generateKnightAttackMask(square);
  }
  return attackTable;
}

// ==== Bishop / Queen attack masks ====
export function precomputeDiagonalAttackMasks(): Bitboard[] {
  const maskTable: Bitboard[] = new Array(BOARD_SIZE);
  for (const square of SQUARES) {
    maskTable[square] = generateDiagonalAttackMask(square);
  }
  return maskTable;
}

// ==== Rook / Queen attack masks ====
export function precomputeOrthogonalAttackMasks(): Bitboard[] {
  const maskTable: Bitboard[] = new Array(BOARD_SIZE);
  for (const square of SQUARES) {
    maskTable[square] = generateOrthogonalAttackMask(square);
  }
  return maskTable;
}

// ==== King attack masks ====
export function precomputeKingAttackMasks(): ReadonlyBitboards {
  const attackTable = new Array<Bitboard>(BOARD_SIZE);
  for (const square of SQUARES) {
    attackTable[square] = generateKingAttackMask(square);
  }
  return attackTable;
}

// Magic bitboard precomputation
export function precomputeSlidingAttackTables(
  masks: ReadonlyBitboards,
  shifts: readonly number[],
  magics: ReadonlyBitboards,
  piece: Piece,
) {
  const attackTable: Bitboard[][] = new Array(BOARD_SIZE);
  for (const square of SQUARES) {
    const mask = masks[square]!;
    const magic = magics[square]!;
    const shift = shifts[square]!;
    const relevantBits = getRelevantBlockerSquares(mask);
    const blockers = generateBlockerConfigs(relevantBits);

    attackTable[square] = new Array(blockers.length);
    for (const blockerMask of blockers) {
      const index = computeIndex(blockerMask, magic, shift);
      // if (attackTable[square]![index] !== undefined) {
      //   throw new Error(`Magic collision on square ${square}: index ${index}`);
      // }
      attackTable[square]![index] = walkSlidingRays(square, piece, blockerMask);
    }
  }
  return attackTable;
}

export function precomputeBetweenRays(): Bitboard[][] {
  const BETWEEN = Array.from(
    { length: BOARD_SIZE },
    () => new Array<Bitboard>(BOARD_SIZE),
  );
  for (const from of SQUARES) {
    for (const to of SQUARES) {
      if (from === to) {
        BETWEEN[from]![to] = 0n;
        continue;
      }
      const onSameFile = isOnSameFile(from, to);
      const onSameRank = isOnSameRank(from, to);
      const onSameDiagonal = isOnSameDiagonal(from, to);
      if (!onSameFile && !onSameRank && !onSameDiagonal) {
        BETWEEN[from]![to] = 0n;
        continue;
      }

      const isKingSquareLess = from < to;
      const isLowerRank = toRank(from) > toRank(to);
      const isLowerFile = toFile(from) > toFile(to);
      let direction: Direction;

      if (onSameFile) {
        direction = isKingSquareLess ? "N" : "S";
      } else if (onSameRank) {
        direction = isKingSquareLess ? "E" : "W";
      } else if (onSameDiagonal) {
        if (isLowerRank) {
          direction = isLowerFile ? "SW" : "SE";
        } else {
          direction = isLowerFile ? "NW" : "NE";
        }
      }
      const bb = squareToBB(to);
      BETWEEN[from]![to] = walkRay(from, direction!, bb);
    }
  }
  return BETWEEN;
}
