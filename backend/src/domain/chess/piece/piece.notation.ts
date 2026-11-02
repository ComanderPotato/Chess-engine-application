import {
  PIECE_COLOURS,
  PieceToNotation,
  NotationToPiece,
  NotationToProperty,
  PieceToProperty,
} from "./piece.constants.js";
import { getType, isWhite } from "./piece.chess.js";
import {
  LowercaseNotation,
  Piece,
  PieceNotation,
  PieceProperty,
} from "./piece.types.js";

export function pieceToNotation(piece: Piece): string {
  const pieceType = getType(piece);
  const symbol = PieceToNotation[pieceType];
  return isWhite(piece) ? symbol.toUpperCase() : symbol;
}
export function notationToPiece(notation: PieceNotation): Piece {
  const lowerCaseNotation = notation.toLowerCase();
  const colour =
    notation === lowerCaseNotation ? PIECE_COLOURS.Black : PIECE_COLOURS.White;
  return (
    NotationToPiece[lowerCaseNotation as LowercaseNotation] |
    colour |
    NotationToProperty[lowerCaseNotation as LowercaseNotation]
  );
}
export function pieceToProperty(piece: Piece): PieceProperty {
  const pieceType = getType(piece);
  return PieceToProperty[pieceType] as PieceProperty;
}

export function isValidNotation(char: string): char is PieceNotation {
  return char.toLowerCase() in NotationToPiece;
}
// export function convertToSymbol(piece: number): string {
//   const pieceType = piece & TYPE_MASK;
//   const pieceLetter: string = PieceToSymbol[pieceType]!;
//   return Piece.isWhite(piece) ? pieceLetter.toUpperCase() : pieceLetter;
// }
