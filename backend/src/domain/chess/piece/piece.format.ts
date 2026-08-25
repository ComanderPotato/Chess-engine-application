import { getType, isWhite } from "./piece.chess.js";
import { PieceToNotation } from "./piece.constants.js";
import { Piece } from "./piece.types.js";

export function pieceToString(piece: Piece): string {
  const pieceType = getType(piece);
  const pieceLetter: string = PieceToNotation[pieceType]!;
  const colour = isWhite(piece) ? "White" : "Black";
  switch (pieceLetter) {
    case "p":
      return `${colour} Pawn`;
    case "k":
      return `${colour} King`;
    case "n":
      return `${colour} Knight`;
    case "q":
      return `${colour} Queen`;
    case "r":
      return `${colour} Rook`;
    case "b":
      return `${colour} Bishop`;
  }
  return "";
}
