// import { PieceType } from "./piece.chess.js";

export const PIECE_TYPE_BITS = 3;
export const PIECE_COLOUR_BITS = 2;
export const PIECE_PROPERTIES_BITS = 3;

export const PIECE_TYPE_SHIFT = 0;
export const PIECE_COLOUR_SHIFT = PIECE_TYPE_SHIFT + PIECE_TYPE_BITS;
export const PIECE_PROPERTIES_SHIFT = PIECE_COLOUR_SHIFT + PIECE_COLOUR_BITS;

export const PIECE_TYPE_MASK = (1 << PIECE_TYPE_BITS) - 1;
export const PIECE_COLOUR_MASK =
  ((1 << PIECE_COLOUR_BITS) - 1) << PIECE_COLOUR_SHIFT;
export const PIECE_PROPERTIES_MASK =
  ((1 << PIECE_PROPERTIES_BITS) - 1) << PIECE_PROPERTIES_SHIFT;

export const MOVE_MASK =
  (1 << (PIECE_PROPERTIES_SHIFT + PIECE_PROPERTIES_BITS)) - 1;

export const PIECE_TYPES = {
  Empty: 0,
  Pawn: 1,
  Knight: 2,
  Bishop: 3,
  Rook: 4,
  Queen: 5,
  King: 6,
} as const;

export const PIECE_COLOURS = {
  White: 8,
  Black: 16,
} as const;

export const PIECE_PROPERTIES = {
  Sliding: 32,
  Orthogonal: 64,
  Diagonal: 128,
} as const;

export const NotationToPiece = {
  // _: PieceType.Empty,
  p: PIECE_TYPES.Pawn,
  n: PIECE_TYPES.Knight,
  b: PIECE_TYPES.Bishop,
  r: PIECE_TYPES.Rook,
  q: PIECE_TYPES.Queen,
  k: PIECE_TYPES.King,
} as const;

export const PieceToNotation = {
  [PIECE_TYPES.Empty]: "_",
  [PIECE_TYPES.Pawn]: "p",
  [PIECE_TYPES.Knight]: "n",
  [PIECE_TYPES.Bishop]: "b",
  [PIECE_TYPES.Rook]: "r",
  [PIECE_TYPES.Queen]: "q",
  [PIECE_TYPES.King]: "k",
} as const;
