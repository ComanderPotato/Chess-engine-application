// import { Bitboard } from "./board/types.chess.js";
// import { shiftNorth } from "./utils/bitboard.utils.js";
//
// export const BOARD_DIMENSION = 8;
// export const BOARD_SIZE = BOARD_DIMENSION * BOARD_DIMENSION;
// export const RANK_SIZE = BOARD_DIMENSION;
// export const FILE_SIZE = BOARD_DIMENSION;
//
// export const STARTING_FEN =
//   "rnbqkbnr/pppppppp/8/nrnnnnnn/8/6p1/PPPPPPPP/RNBQKBNR";
// // export const STARTING_FEN = "1r6/5pp1/R1R4p/1r1pP3/2pkQPP1/1P5P/8/2K5";
//
// export const BOARD_MASK: Bitboard = 0xffffffffffffffffn as const;
//
// export const LIGHT_SQUARE_PATTERN = 0xaan as const;
// export const DARK_SQUARE_PATTERn = 0x55n as const;

// Masks and Ranks
// export const RANK_MASKS = Array.from(
//   { length: RANK_SIZE },
//   (_, rank) => 0xffn << BigInt(rank * 8),
// ) as readonly Bitboard[];
//
// export const FILE_MASKS = Array.from(
//   { length: FILE_SIZE },
//   (_, file) => 0x0101010101010101n << BigInt(file),
// ) as readonly Bitboard[];
//
// // Generators
// function generateFileMask(start: number, end: number = start): Bitboard {
//   if (start < 0 || end >= FILE_SIZE || start > end)
//     throw new Error("Start or end index invalid");
//   let mask = 0n;
//   for (let i = start; i <= end; i++) {
//     mask |= FILE_MASKS[i]!;
//   }
//   return mask;
// }
// function generateRankMask(start: number, end: number = start): Bitboard {
//   if (start < 0 || end >= FILE_SIZE || start > end)
//     throw new Error("Start or end index invalid");
//   let mask = 0n;
//   for (let i = start; i <= end; i++) {
//     mask |= RANK_MASKS[i]!;
//   }
//   return mask;
// }
// function generateLightSquaresMask(): Bitboard {
//   let mask = 0n;
//   for (let rank = 0; rank < 8; rank += 2) {
//     mask |=
//       (shiftNorth(LIGHT_SQUARE_PATTERN) | DARK_SQUARE_PATTERn) <<
//       (8n * BigInt(rank));
//   }
//   return mask;
// }

// export const FULL_BOARD_MASK = BOARD_MASK;
// export const EMPTY_BOARD_MASK = 0n;
//
// export const EDGE_MASK =
//   generateFileMask(0) |
//   generateFileMask(7) |
//   generateRankMask(0) |
//   generateRankMask(7);
//
// export const CORNER_MASK =
//   EDGE_MASK ^
//   generateFileMask(0) ^
//   generateFileMask(7) ^
//   generateRankMask(0) ^
//   generateRankMask(7);
//
// export const NOT_EDGE_MASK = ~EDGE_MASK & BOARD_MASK;
// export const NOT_CORNER_MASK = ~CORNER_MASK & EDGE_MASK;
//
// export const NOT_A_FILE_MASK = ~generateFileMask(0) & BOARD_MASK;
// export const NOT_H_FILE_MASK = ~generateFileMask(7) & BOARD_MASK;
//
// export const NOT_AB_FILES_MASK = ~generateFileMask(0, 1) & BOARD_MASK;
// export const NOT_GH_FILES_MASK = ~generateFileMask(6, 7) & BOARD_MASK;
//
// export const STARTING_BLACK_PIECES_MASK = generateRankMask(6, 7);
// export const STARTING_WHITE_PIECES_MASK = generateRankMask(0, 1);
//
// export const STARTING_BLACK_PAWNS_MASK = generateRankMask(6);
// export const STARTING_WHITE_PAWNS_MASK = generateRankMask(1);
//
// export const WHITE_PAWN_PROMOTION_RANK_MASK = generateRankMask(7);
// export const BLACK_PAWN_PROMOTION_RANK_MASK = generateRankMask(0);
//
// export const LIGHT_SQUARES_MASK = generateLightSquaresMask();
// export const DARK_SQUARES_MASK = ~LIGHT_SQUARES_MASK & BOARD_MASK;
//
// Piece Move Offsets
// export const KNIGHT_OFFSETS = {
//   // North
//   NNW: 15n,
//   NNE: 17n,
//
//   // East
//   NEE: 10n,
//   SEE: -6n,
//
//   // South
//   SSE: -15n,
//   SSW: -17n,
//
//   // West
//   NWW: 6n,
//   SWW: -10n,
// };
//
// export const KING_OFFSETS = {
//   // Shift right
//   NW: 7n,
//   N: 8n,
//   NE: 9n,
//   E: 1n,
//
//   // Shift left
//   W: 1n,
//   SW: 9n,
//   S: 8n,
//   SE: 7n,
// };
//
// export const BIT_DIRECTIONS = {
//   NW: 7n,
//   NE: 9n,
//   SE: 7n,
//   SW: 9n,
//   N: 8n,
//   E: 1n,
//   S: 8n,
//   W: 1n,
// };
// export const DIAGONAL_DIRECTIONS = {
//   NW: 7n,
//   NE: 9n,
//   SE: 7n,
//   SW: 9n,
// };
// export const ORTHOGONAL_DIRECTIONS = {
//   N: 8n,
//   E: 1n,
//   S: 8n,
//   W: 1n,
// };
//
// export const SQUARE_DIRECTIONS = {
//   NW: 7,
//   NE: 9,
//   SE: -7,
//   SW: -9,
//   N: 8,
//   E: 1,
//   S: -8,
//   W: -1,
// };
// export const PAWN_ATTACK_OFFSETS = DIAGONAL_DIRECTIONS;
