import { BOARD_SIZE } from "@/domain/chess/board/board.constants.js";
import {
  Bitboard,
  ReadonlyBitboards,
} from "@/domain/chess/board/types.chess.js";
import { PIECE_PROPERTIES } from "@/domain/chess/piece/piece.constants.js";
import * as Attacks from "./attack.precompute.js";
import {
  ORTHOGONAL_MAGICS_PRECOMPUTE,
  ORTHOGONAL_SHIFTS_PRECOMPUTE,
} from "../magic/orthogonal.magic.js";
import {
  DIAGONAL_MAGICS_PRECOMPUTE,
  DIAGONAL_SHIFTS_PRECOMPUTE,
} from "../magic/diagonal.magic.js";
// import { shiftRight } from "../move/move.bitboard.js";
// import {
//   blackDoublePush,
//   blackSinglePush,
//   whiteDoublePush,
//   whiteSinglePush,
// } from "../move/move.generator.js";

export interface SlidingTables {
  MASKS: Bitboard[];
  SHIFTS: readonly number[];
  MAGICS: ReadonlyBitboards;
  ATTACKS: Bitboard[][];
}

export const [WHITE_PAWN_ATTACKS, BLACK_PAWN_ATTACKS] =
  Attacks.precomputePawnAttackMasks();

// ===== Pawn attacks =====
export const PAWN_ATTACKS = Attacks.precomputePawnAttackMasks();

// ===== Knight attacks =====
export const KNIGHT_ATTACKS = Attacks.precomputeKnightAttackMasks();

// export const PAWN_CONFIG = [
//   {
//     attacks: WHITE_PAWN_ATTACKS,
//     singlePush: whiteSinglePush,
//     doublePush: whiteDoublePush,
//     shiftDirection: shiftRight,
//   },
//   {
//     attacks: WHITE_PAWN_ATTACKS,
//     singlePush: blackSinglePush,
//     doublePush: blackDoublePush,
//     shiftDirection: shiftRight,
//   },
// ];

// ===== Bishop / Queen attacks =====
const DIAGONAL_MASKS: Bitboard[] = Attacks.precomputeDiagonalAttackMasks();
export const DIAGONAL_TABLES: SlidingTables = {
  MASKS: DIAGONAL_MASKS,
  SHIFTS: DIAGONAL_SHIFTS_PRECOMPUTE,
  MAGICS: DIAGONAL_MAGICS_PRECOMPUTE,
  ATTACKS: Attacks.precomputeSlidingAttackTables(
    DIAGONAL_MASKS,
    DIAGONAL_SHIFTS_PRECOMPUTE,
    DIAGONAL_MAGICS_PRECOMPUTE,
    PIECE_PROPERTIES.Diagonal,
  ),
};

// ===== Rook / Queen attacks =====
const ORTHOGONAL_MASKS: Bitboard[] = Attacks.precomputeOrthogonalAttackMasks();
export const ORTHOGONAL_TABLES: SlidingTables = {
  MASKS: ORTHOGONAL_MASKS,
  SHIFTS: ORTHOGONAL_SHIFTS_PRECOMPUTE,
  MAGICS: ORTHOGONAL_MAGICS_PRECOMPUTE,
  ATTACKS: Attacks.precomputeSlidingAttackTables(
    ORTHOGONAL_MASKS,
    ORTHOGONAL_SHIFTS_PRECOMPUTE,
    ORTHOGONAL_MAGICS_PRECOMPUTE,
    PIECE_PROPERTIES.Orthogonal,
  ),
};

// ===== King attacks =====
export const KING_ATTACKS: readonly Bitboard[] =
  Attacks.precomputeKingAttackMasks();

export const BETWEEN = Array.from(
  { length: BOARD_SIZE },
  () => new Array<Bitboard>(BOARD_SIZE),
);

// contains the entire rank/file/diagonal passing through both squares
export const LINE = Array.from(
  { length: BOARD_SIZE },
  () => new Array<Bitboard>(BOARD_SIZE),
);
