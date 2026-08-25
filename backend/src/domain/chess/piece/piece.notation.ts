import {
  PIECE_COLOURS,
  PieceToNotation,
  NotationToPiece,
} from "./piece.constants.js";
import { getType, isWhite } from "./piece.chess.js";
import { LowercaseNotation, Piece, PieceNotation } from "./piece.types.js";

export function pieceToNotation(piece: Piece): string {
  const pieceType = getType(piece);
  const symbol = PieceToNotation[pieceType];
  return isWhite(piece) ? symbol.toUpperCase() : symbol;
}
export function notationToPiece(notation: PieceNotation): Piece {
  // if (!isValidNotation(notation))
  //   throw new Error(`${notation} is not valid piece notation`);
  const colour =
    notation === notation.toLowerCase()
      ? PIECE_COLOURS.Black
      : PIECE_COLOURS.White;
  return NotationToPiece[notation.toLowerCase() as LowercaseNotation] | colour;
}

export function isValidNotation(char: string): char is PieceNotation {
  return char.toLowerCase() in NotationToPiece;
}
// export function convertToSymbol(piece: number): string {
//   const pieceType = piece & TYPE_MASK;
//   const pieceLetter: string = PieceToSymbol[pieceType]!;
//   return Piece.isWhite(piece) ? pieceLetter.toUpperCase() : pieceLetter;
// }
