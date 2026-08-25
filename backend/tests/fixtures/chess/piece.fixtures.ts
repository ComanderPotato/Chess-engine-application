import {
  PIECE_TYPES,
  PIECE_COLOURS,
  PIECE_PROPERTIES,
} from "@/domain/chess/piece/piece.constants.js";

export const SLIDING_PIECE = PIECE_TYPES.Empty | PIECE_PROPERTIES.Sliding;
export const DIAGONAL_PIECE = PIECE_TYPES.Empty | PIECE_PROPERTIES.Diagonal;
export const ORTHOGONAL_PIECE = PIECE_TYPES.Empty | PIECE_PROPERTIES.Orthogonal;

export const QUEEN_PIECE =
  PIECE_TYPES.Queen | DIAGONAL_PIECE | ORTHOGONAL_PIECE | SLIDING_PIECE;

export const ROOK_PIECE = PIECE_TYPES.Rook | ORTHOGONAL_PIECE | SLIDING_PIECE;

export const BISHOP_PIECE = PIECE_TYPES.Bishop | DIAGONAL_PIECE | SLIDING_PIECE;

export const WHITE_PIECES = [
  PIECE_TYPES.Pawn | PIECE_COLOURS.White,
  PIECE_TYPES.Knight | PIECE_COLOURS.White,
  BISHOP_PIECE | PIECE_COLOURS.White,
  ROOK_PIECE | PIECE_COLOURS.White,
  QUEEN_PIECE | PIECE_COLOURS.White,
  PIECE_TYPES.King | PIECE_COLOURS.White,
];
export const BLACK_PIECES = [
  PIECE_TYPES.Pawn | PIECE_COLOURS.Black,
  PIECE_TYPES.Knight | PIECE_COLOURS.Black,
  BISHOP_PIECE | PIECE_COLOURS.Black,
  ROOK_PIECE | PIECE_COLOURS.Black,
  QUEEN_PIECE | PIECE_COLOURS.Black,
  PIECE_TYPES.King | PIECE_COLOURS.Black,
];

export const ALL_PIECES = [...WHITE_PIECES, ...BLACK_PIECES];
export const TYPE_MASK = 0b111 as const;
export const COLOUR_MASK = 0b11000 as const;

export const EXPECTED_PIECE_FORMATS = [
  { type: PIECE_TYPES.Pawn, name: "Pawn" },
  { type: PIECE_TYPES.Knight, name: "Knight" },
  { type: PIECE_TYPES.Bishop, name: "Bishop" },
  { type: PIECE_TYPES.Rook, name: "Rook" },
  { type: PIECE_TYPES.Queen, name: "Queen" },
  { type: PIECE_TYPES.King, name: "King" },
];
export const EXPECTED_COLOUR_FORMATS = [
  { colour: PIECE_COLOURS.White, name: "White" },
  { colour: PIECE_COLOURS.Black, name: "Black" },
];

export const EXPECTED_NOTATIONS = [
  { type: PIECE_TYPES.Pawn, notation: "p" },
  { type: PIECE_TYPES.Knight, notation: "n" },
  { type: PIECE_TYPES.Bishop, notation: "b" },
  { type: PIECE_TYPES.Rook, notation: "r" },
  { type: PIECE_TYPES.Queen, notation: "q" },
  { type: PIECE_TYPES.King, notation: "k" },
];
