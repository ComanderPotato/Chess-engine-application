import {
  PIECE_COLOUR_MASK,
  PIECE_COLOUR_SHIFT,
  PIECE_COLOURS,
  PIECE_PROPERTIES,
  PIECE_TYPE_MASK,
} from "./piece.constants.js";
import type { Piece, PieceType, PieceColour } from "./piece.types.js";

export function isWhite(piece: Piece): boolean {
  return (piece & PIECE_COLOURS.White) !== 0;
}
export function isBlack(piece: Piece): boolean {
  return (piece & PIECE_COLOURS.Black) !== 0;
}
export function getEnemyColour(piece: Piece): PieceColour {
  return ((PIECE_COLOUR_MASK & piece) ^ PIECE_COLOUR_MASK) as PieceColour;
}
export function isSlidingPiece(piece: Piece): boolean {
  return (piece & PIECE_PROPERTIES.Sliding) !== 0;
}
export function hasDiagonalMovement(piece: Piece): boolean {
  return (piece & PIECE_PROPERTIES.Diagonal) !== 0;
}
export function hasOrthogonalMovement(piece: Piece): boolean {
  return (piece & PIECE_PROPERTIES.Orthogonal) !== 0;
}
export function isType(piece: Piece, expectedType: PieceType): boolean {
  return (piece & PIECE_TYPE_MASK) === expectedType;
}
export function isColour(piece: Piece, expectedColour: PieceColour): boolean {
  return (piece & PIECE_COLOUR_MASK) === expectedColour;
}
export function getType(piece: Piece): PieceType {
  return (piece & PIECE_TYPE_MASK) as PieceType;
}
export function getColour(piece: Piece): PieceColour {
  return (piece & PIECE_COLOUR_MASK) as PieceColour;
}
export function normaliseColour(piece: PieceColour): number {
  return ((piece & PIECE_COLOUR_MASK) >> PIECE_COLOUR_SHIFT) - 1;
}
