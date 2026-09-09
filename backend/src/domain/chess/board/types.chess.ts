import { FILES, RANKS } from "./board.constants.js";

export type Bitboard = bigint;

export type ReadonlyBitboards = readonly Bitboard[];

export type Bit = bigint;

// export type Square = number;
export type Square = number & { readonly __brand: "Square" };

export type File = keyof typeof FILES;

export type Rank = keyof typeof RANKS;

export type CastlingRights = number;
export type EnPassant = Square | null;
