import { COORD_SQUARE_MAP } from "#/fixtures/chess/square.fixtures.js";
import type {
  Bit,
  Bitboard,
  ReadonlyBitboards,
  Square,
} from "./types.chess.js";

export const BOARD_DIMENSION = 8;
export const BOARD_SIZE = BOARD_DIMENSION * BOARD_DIMENSION;
export const RANK_SIZE = BOARD_DIMENSION;
export const FILE_SIZE = BOARD_DIMENSION;

export const LIGHT_SQUARE_PATTERN = 0xaan;
export const DARK_SQUARE_PATTERN = 0x55n;

export const SINGLE_FILE_MASK: Bitboard = 0x0101010101010101n;
export const SINGLE_RANK_MASK: Bitboard = 0xffn;

export const BOARD_MASK: Bitboard = 0xffffffffffffffffn as const;
export const EMPTY_BOARD_MASK: Bitboard = 0n;
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
  (_, square) => 1n << SQUARE_TO_BIGINT[square]!,
) as Bitboard[];
export const RANK_MASKS: ReadonlyBitboards = Array.from(
  { length: RANK_SIZE },
  (_, rank) => SINGLE_RANK_MASK << BigInt(rank * RANK_SIZE),
) as ReadonlyBitboards;

export const FILE_MASKS: ReadonlyBitboards = Array.from(
  { length: FILE_SIZE },
  (_, file) => SINGLE_FILE_MASK << BigInt(file),
) as ReadonlyBitboards;

export const NOT_A_FILE_MASK: Bitboard = ~FILE_MASKS[0]! & BOARD_MASK;
export const NOT_H_FILE_MASK: Bitboard = ~FILE_MASKS[7]! & BOARD_MASK;

export const NOT_AB_FILES_MASK: Bitboard = NOT_A_FILE_MASK ^ FILE_MASKS[1]!;
export const NOT_GH_FILES_MASK: Bitboard = NOT_H_FILE_MASK ^ FILE_MASKS[6]!;
export const FIRST_TO_LAST_RANK_BB =
  SQUARE_TO_BIGINT[BOARD_DIMENSION * RANKS.EIGHTH]!;
