import { shiftLeft } from "../movegen/move/move.bitboard.js";
import { AND, bigintToBitboard, NOT, XOR } from "../utils/bitboard.utils.js";
import type { Bitboard, ReadonlyBitboards, Square } from "./types.chess.js";

export const COORD_SQUARE_MAP = {
  A1: 0 as Square,
  B1: 1 as Square,
  C1: 2 as Square,
  D1: 3 as Square,
  E1: 4 as Square,
  F1: 5 as Square,
  G1: 6 as Square,
  H1: 7 as Square,

  A2: 8 as Square,
  B2: 9 as Square,
  C2: 10 as Square,
  D2: 11 as Square,
  E2: 12 as Square,
  F2: 13 as Square,
  G2: 14 as Square,
  H2: 15 as Square,

  A3: 16 as Square,
  B3: 17 as Square,
  C3: 18 as Square,
  D3: 19 as Square,
  E3: 20 as Square,
  F3: 21 as Square,
  G3: 22 as Square,
  H3: 23 as Square,

  A4: 24 as Square,
  B4: 25 as Square,
  C4: 26 as Square,
  D4: 27 as Square,
  E4: 28 as Square,
  F4: 29 as Square,
  G4: 30 as Square,
  H4: 31 as Square,

  A5: 32 as Square,
  B5: 33 as Square,
  C5: 34 as Square,
  D5: 35 as Square,
  E5: 36 as Square,
  F5: 37 as Square,
  G5: 38 as Square,
  H5: 39 as Square,

  A6: 40 as Square,
  B6: 41 as Square,
  C6: 42 as Square,
  D6: 43 as Square,
  E6: 44 as Square,
  F6: 45 as Square,
  G6: 46 as Square,
  H6: 47 as Square,

  A7: 48 as Square,
  B7: 49 as Square,
  C7: 50 as Square,
  D7: 51 as Square,
  E7: 52 as Square,
  F7: 53 as Square,
  G7: 54 as Square,
  H7: 55 as Square,

  A8: 56 as Square,
  B8: 57 as Square,
  C8: 58 as Square,
  D8: 59 as Square,
  E8: 60 as Square,
  F8: 61 as Square,
  G8: 62 as Square,
  H8: 63 as Square,
} as const;
export const BOARD_DIMENSION = 8;
export const BOARD_SIZE = BOARD_DIMENSION * BOARD_DIMENSION;
export const RANK_SIZE = BOARD_DIMENSION;
export const FILE_SIZE = BOARD_DIMENSION;

export const LIGHT_SQUARE_PATTERN = 0xaan;
export const DARK_SQUARE_PATTERN = 0x55n;

export const SINGLE_FILE_MASK: Bitboard = bigintToBitboard(0x0101010101010101n);
export const SINGLE_RANK_MASK: Bitboard = bigintToBitboard(0xffn);

export const BOARD_MASK: Bitboard = bigintToBitboard(0xffffffffffffffffn);
export const EMPTY_BOARD_MASK: Bitboard = bigintToBitboard(0n);
export const FULL_BOARD_MASK: Bitboard = BOARD_MASK;

export const SQUARES: readonly Square[] = Array.from(
  { length: BOARD_SIZE },
  (_, square) => square as Square,
);
export const CASTLING_RIGHTS_MASK = Array(64).fill(0b1111);

CASTLING_RIGHTS_MASK[COORD_SQUARE_MAP.E1] = 0b1100;
CASTLING_RIGHTS_MASK[COORD_SQUARE_MAP.E8] = 0b0011;

CASTLING_RIGHTS_MASK[COORD_SQUARE_MAP.A1] = 0b1101;
CASTLING_RIGHTS_MASK[COORD_SQUARE_MAP.H1] = 0b1110;

CASTLING_RIGHTS_MASK[COORD_SQUARE_MAP.A8] = 0b0111;
CASTLING_RIGHTS_MASK[COORD_SQUARE_MAP.H8] = 0b1011;
export const FILES = {
  A: 0,
  B: 1,
  C: 2,
  D: 3,
  E: 4,
  F: 5,
  G: 6,
  H: 7,
} as const;

export const RANKS = {
  FIRST: 0,
  SECOND: 1,
  THIRD: 2,
  FOURTH: 3,
  FIFTH: 4,
  SIXTH: 5,
  SEVENTH: 6,
  EIGHTH: 7,
} as const;

export const SQUARE_TO_BIGINT = Array.from({ length: 64 }, (_, square) =>
  BigInt(square),
);
export const SQUARE_TO_BB: Bitboard[] = Array.from(
  { length: BOARD_SIZE },
  (_, square) => bigintToBitboard(1n << SQUARE_TO_BIGINT[square]!),
) as Bitboard[];
export const RANK_MASKS: ReadonlyBitboards = Array.from(
  { length: RANK_SIZE },
  (_, rank) => shiftLeft(SINGLE_RANK_MASK, rank * RANK_SIZE),
) as ReadonlyBitboards;

export const FILE_MASKS: ReadonlyBitboards = Array.from(
  { length: FILE_SIZE },
  (_, file) => shiftLeft(SINGLE_FILE_MASK, file),
) as ReadonlyBitboards;

export const NOT_A_FILE_MASK: Bitboard = AND(NOT(FILE_MASKS[0]!), BOARD_MASK);
export const NOT_H_FILE_MASK: Bitboard = AND(NOT(FILE_MASKS[7]!), BOARD_MASK);

export const NOT_AB_FILES_MASK: Bitboard = XOR(NOT_A_FILE_MASK, FILE_MASKS[1]!);
export const NOT_GH_FILES_MASK: Bitboard = XOR(NOT_H_FILE_MASK, FILE_MASKS[6]!);
export const FIRST_TO_LAST_RANK_BB = bigintToBitboard(
  SQUARE_TO_BIGINT[BOARD_DIMENSION * RANKS.EIGHTH]!,
);
export const FIRST_TO_LAST_RANK_SHIFT = BOARD_DIMENSION * RANKS.EIGHTH;
