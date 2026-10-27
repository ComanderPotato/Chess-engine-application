import { createBitboardFromCoords } from "#/factories/bitboard.factory.js";
import { RANK_MASKS, RANKS } from "@/domain/chess/board/board.constants.js";
import { COORD_SQUARE_MAP } from "./square.fixtures.js";

export const STARTING_WHITE_PAWN_ATTACKS =
  RANK_MASKS[RANKS.THIRD]! | RANK_MASKS[RANKS.FOURTH]!;
export const STARTING_BLACK_PAWN_ATTACKS =
  RANK_MASKS[RANKS.FIFTH]! | RANK_MASKS[RANKS.SIXTH]!;

export const STARTING_WHITE_KNIGHT_ATTACKS = createBitboardFromCoords([
  COORD_SQUARE_MAP.A3,
  COORD_SQUARE_MAP.C3,
  COORD_SQUARE_MAP.F3,
  COORD_SQUARE_MAP.H3,
]);
export const STARTING_BLACK_KNIGHT_ATTACKS = createBitboardFromCoords([
  COORD_SQUARE_MAP.A6,
  COORD_SQUARE_MAP.C6,
  COORD_SQUARE_MAP.F6,
  COORD_SQUARE_MAP.H6,
]);
