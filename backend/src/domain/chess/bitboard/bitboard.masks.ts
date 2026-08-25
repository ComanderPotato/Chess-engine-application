import { BOARD_MASK } from "../board/board.constants.js";
import { Bitboard } from "../board/types.chess.js";
import {
  generateFileMask,
  generateRankMask,
  generateLightSquaresMask,
} from "./bitboard.generators.js";

export const EDGE_MASK: Bitboard =
  generateFileMask(0) |
  generateFileMask(7) |
  generateRankMask(0) |
  generateRankMask(7);

export const CORNER_MASK: Bitboard =
  EDGE_MASK ^
  generateFileMask(0) ^
  generateFileMask(7) ^
  generateRankMask(0) ^
  generateRankMask(7);

export const NOT_EDGE_MASK: Bitboard = ~EDGE_MASK & BOARD_MASK;
export const NOT_CORNER_MASK: Bitboard = ~CORNER_MASK & EDGE_MASK;

export const STARTING_BLACK_PIECES_MASK: Bitboard = generateRankMask(6, 7);
export const STARTING_WHITE_PIECES_MASK: Bitboard = generateRankMask(0, 1);

export const STARTING_BLACK_PAWNS_MASK: Bitboard = generateRankMask(6);
export const STARTING_WHITE_PAWNS_MASK: Bitboard = generateRankMask(1);

export const WHITE_PAWN_PROMOTION_RANK_MASK: Bitboard = generateRankMask(7);
export const BLACK_PAWN_PROMOTION_RANK_MASK: Bitboard = generateRankMask(0);

export const LIGHT_SQUARES_MASK: Bitboard = generateLightSquaresMask();
export const DARK_SQUARES_MASK: Bitboard = ~LIGHT_SQUARES_MASK & BOARD_MASK;
