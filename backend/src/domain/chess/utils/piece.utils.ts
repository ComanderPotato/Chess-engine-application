// import { Piece, PieceToSymbol } from "../board/piece.chess.js";

// import {
//   PieceColour,
//   PieceProperty,
//   PieceType,
//   TYPE_MASK,
//   COLOUR_MASK,
//   Piece,
// } from "../piece/piece.chess.js";
//
// export function isWhite(piece: Piece): boolean {
//   return (piece & PieceColour.White) !== 0;
// }
// export function isBlack(piece: Piece): boolean {
//   return (piece & PieceColour.Black) !== 0;
// }
// export function isSlidingPiece(piece: Piece): boolean {
//   return (piece & PieceProperty.Sliding) !== 0;
// }
// export function hasDiagonalMovement(piece: Piece): boolean {
//   return (piece & PieceProperty.Diagonal) !== 0;
// }
// export function hasOrthogonalMovement(piece: Piece): boolean {
//   return (piece & PieceProperty.Orthogonal) !== 0;
// }
// export function isType(piece: Piece, expectedType: PieceType): boolean {
//   return (piece & TYPE_MASK) === (expectedType & TYPE_MASK);
// }
// export function isColour(piece: Piece, expectedColour: PieceColour): boolean {
//   return (piece & COLOUR_MASK) === (expectedColour & COLOUR_MASK);
// }
// export function getType(piece: Piece): PieceType {
//   return (piece & TYPE_MASK) as PieceType;
// }
// export function getColour(piece: Piece): PieceColour {
//   return (piece & COLOUR_MASK) as PieceColour;
// }
// class Piece {
//   public static None: PieceEncoding = PieceType.None;
//   public static Pawn: PieceEncoding = PieceType.Pawn;
//   public static Knight: PieceEncoding = PieceType.Knight;
//   public static Bishop: PieceEncoding =
//     PieceType.Bishop | PieceProperties.Sliding | PieceProperties.Diagonal;
//   public static Rook: PieceEncoding =
//     PieceType.Rook | PieceProperties.Sliding | PieceProperties.Orthogonal;
//   public static Queen: PieceEncoding =
//     PieceType.Queen |
//     PieceProperties.Sliding |
//     PieceProperties.Diagonal |
//     PieceProperties.Orthogonal;
//   public static King: PieceEncoding = PieceType.King;
//   public static White: PieceEncoding = PieceColour.White;
//   public static Black: PieceEncoding = PieceColour.Black;
//
//   public static TYPE_MASK = 0b111;
//   public static COLOUR_MASK = 0b11000;
//   public static PROPERTY_MASK = 0b11100000;
//   // PieceProperties.Sliding |
//   // PieceProperties.Diagonal |
//   // PieceProperties.Orthogonal;
//
//   public static isWhite(piece: PieceEncoding): boolean {
//     return (piece & PieceColour.White) !== 0;
//   }
//   public static isBlack(piece: PieceEncoding): boolean {
//     return (piece & PieceColour.Black) !== 0;
//   }
//   public static isSlidingPiece(piece: PieceEncoding): boolean {
//     return (piece & Piece.PROPERTY_MASK) !== 0;
//   }
//   public static hasDiagonalMovement(piece: PieceEncoding): boolean {
//     return (piece & PieceProperties.Diagonal) !== 0;
//   }
//   public static hasOrthogonalMovement(piece: PieceEncoding): boolean {
//     return (piece & PieceProperties.Orthogonal) !== 0;
//   }
//   public static isType(piece: PieceEncoding, expectedType: PieceType) {
//     return (piece & Piece.TYPE_MASK) === (expectedType & Piece.TYPE_MASK);
//   }
//   public static isColour(piece: PieceEncoding, expectedColour: PieceColour) {
//     return (piece & Piece.COLOUR_MASK) === (expectedColour & Piece.COLOUR_MASK);
//   }
//   public static getType(piece: PieceEncoding): PieceType {
//     return piece & Piece.TYPE_MASK;
//   }
//   public static getColour(piece: PieceEncoding): PieceColour {
//     return piece & Piece.COLOUR_MASK;
//   }
// }
//
// const a = Piece.Bishop | Piece.White;
// Piece.getType(Piece.Bishop | Piece.White) === Piece.Bishop;
// enum PieceType {
//   None,
//   Pawn,
//   Knight,
//   Bishop,
//   Rook,
//   Queen,
//   King,
// }
// enum PieceColour {
//   White = 8,
//   Black = 16,
// }
// const COLOUR_MASK = 0b11000;
// const WHITE = 0b01000;
// const TYPE_MASK = 0b00111;
// type Piece = number;
//
// function isWhite(piece: Piece): boolean {
//   return (piece & PieceColour.White) !== 0;
// }
// function isBlack(piece: Piece): boolean {
//   return (piece & PieceColour.Black) !== 0;
// }
//
// function isSlidingPiece(piece: Piece): boolean {
//   return (piece & (PieceType.Bishop ^ PieceType.Rook ^ PieceType.Queen)) !== 0;
// }
//
// export function indexToPiece(index: number): number {
//   if (index < 0 || index > 11) {
//     throw new Error("Invalid piece index");
//   }
//   const colour = index >= 6 ? PieceColour.Black : PieceColour.White;
//   const pieceType = (index % 6) + 1;
//
//   return pieceType | colour;
// }
// function getPieceType(piece: Piece): number {
//   return (piece | COLOUR_MASK) & ~COLOUR_MASK;
// }
// function getPieceColour(piece: Piece): number {
//   return (piece | TYPE_MASK) & ~TYPE_MASK;
// }
//
// export function pieceToIndex(piece: Piece): number {
//   return getPieceType(piece) - 1 + (getPieceColour(piece) >> 4) * 6;
// }
//
// export function convertPieceToString(piece: number) {
//   const pieceType = piece & TYPE_MASK;
//   const pieceLetter = PieceToSymbol[pieceType]!;
//   const colour = isWhite(piece) ? "White" : "Black";
//   switch (pieceLetter) {
//     case "p":
//       return `${colour} Pawn`;
//     case "k":
//       return `${colour} King`;
//     case "n":
//       return `${colour} Knight`;
//     case "q":
//       return `${colour} Queen`;
//     case "r":
//       return `${colour} Rook`;
//     case "b":
//       return `${colour} Bishop`;
//   }
//
// }
