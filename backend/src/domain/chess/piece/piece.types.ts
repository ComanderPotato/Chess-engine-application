import {
  PIECE_COLOURS,
  PIECE_PROPERTIES,
  PIECE_TYPES,
  NotationToPiece,
} from "./piece.constants.js";

export type PieceType = (typeof PIECE_TYPES)[keyof typeof PIECE_TYPES];
export type PieceColour = (typeof PIECE_COLOURS)[keyof typeof PIECE_COLOURS];
export type PieceProperty =
  (typeof PIECE_PROPERTIES)[keyof typeof PIECE_PROPERTIES];
export type Piece = number;
// export type Piece = number & { readonly __brand: "Square" };

export type LowercaseNotation = keyof typeof NotationToPiece;
export type PieceNotation = LowercaseNotation | Uppercase<LowercaseNotation>;
