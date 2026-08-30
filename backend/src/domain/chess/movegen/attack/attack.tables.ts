import { BOARD_SIZE } from "@/domain/chess/board/board.constants.js";
import {
  Bitboard,
  ReadonlyBitboards,
} from "@/domain/chess/board/types.chess.js";
import { PIECE_PROPERTIES } from "@/domain/chess/piece/piece.constants.js";
import * as AttackPrecompute from "./attack.precompute.js";
import {
  ROOK_MAGICS_PRECOMPUTE,
  ROOK_SHIFTS_PRECOMPUTE,
} from "../magic/rook.magic.js";
import {
  BISHOP_MAGICS_PRECOMPUTE,
  BISHOP_SHIFTS_PRECOMPUTE,
} from "../magic/bishop.magic.js";

export interface SlidingTables {
  MASKS: Bitboard[];
  SHIFTS: readonly number[];
  MAGICS: ReadonlyBitboards;
  ATTACKS: Bitboard[][];
}

export const [WHITE_PAWN_ATTACKS, BLACK_PAWN_ATTACKS] =
  AttackPrecompute.precomputePawnAttackMasks();

// ===== Pawn attacks =====
export const PAWN_ATTACKS = AttackPrecompute.precomputePawnAttackMasks();

// ===== Knight attacks =====
export const KNIGHT_ATTACKS = AttackPrecompute.precomputeKnightAttackMasks();

// ===== Bishop / Queen attacks =====
const DIAGONAL_MASKS: Bitboard[] =
  AttackPrecompute.precomputeDiagonalAttackMasks();
export const DIAGONAL_TABLES: SlidingTables = {
  MASKS: DIAGONAL_MASKS,
  SHIFTS: BISHOP_SHIFTS_PRECOMPUTE,
  MAGICS: BISHOP_MAGICS_PRECOMPUTE,
  ATTACKS: AttackPrecompute.precomputeSlidingAttackTables(
    DIAGONAL_MASKS,
    BISHOP_SHIFTS_PRECOMPUTE,
    BISHOP_MAGICS_PRECOMPUTE,
    PIECE_PROPERTIES.Diagonal,
  ),
};

// ===== Rook / Queen attacks =====
const ORTHOGONAL_MASKS: Bitboard[] =
  AttackPrecompute.precomputeOrthogonalAttackMasks();
export const ORTHOGONAL_TABLES: SlidingTables = {
  MASKS: ORTHOGONAL_MASKS,
  SHIFTS: ROOK_SHIFTS_PRECOMPUTE,
  MAGICS: ROOK_MAGICS_PRECOMPUTE,
  ATTACKS: AttackPrecompute.precomputeSlidingAttackTables(
    ORTHOGONAL_MASKS,
    ROOK_SHIFTS_PRECOMPUTE,
    ROOK_MAGICS_PRECOMPUTE,
    PIECE_PROPERTIES.Orthogonal,
  ),
};

// ===== King attacks =====
export const KING_ATTACKS: readonly Bitboard[] =
  AttackPrecompute.precomputeKingAttackMasks();

export const BETWEEN = Array.from(
  { length: BOARD_SIZE },
  () => new Array<Bitboard>(BOARD_SIZE),
);

// contains the entire rank/file/diagonal passing through both squares
export const LINE = Array.from(
  { length: BOARD_SIZE },
  () => new Array<Bitboard>(BOARD_SIZE),
);
