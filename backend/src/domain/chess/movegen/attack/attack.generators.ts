import {
  Bitboard,
  ReadonlyBitboards,
  Square,
} from "@/domain/chess/board/types.chess.js";
import {
  getColour,
  getEnemyColour,
  isWhite,
} from "@/domain/chess/piece/piece.chess.js";
import { Piece, PieceColour } from "@/domain/chess/piece/piece.types.js";
import { Board } from "../../board/board.chess.js";
import { Bit, clearBit64 } from "../../utils/bit.utils.js";
import { getLSBIndex, popCount } from "../../utils/bitboard.utils.js";
import { PIECE_TYPES } from "../../piece/piece.constants.js";
import {
  BLACK_PAWN_ATTACKS,
  DIAGONAL_TABLES,
  KING_ATTACKS,
  KNIGHT_ATTACKS,
  ORTHOGONAL_TABLES,
  SlidingTables,
  WHITE_PAWN_ATTACKS,
} from "./attack.tables.js";
import { computeIndex } from "../../utils/magic.utils.js";
import { shiftLeft, shiftRight } from "../move/move.bitboard.js";

// Piece generators
export function generatePawnAttacks(board: Board, side: PieceColour): Bitboard {
  let pawnBoard = board.getBitboard(PIECE_TYPES.Pawn | side);
  const shiftDirection = isWhite(side) ? shiftRight : shiftLeft;
  const enPassant = board.enPassant ? 1n << BigInt(board.enPassant) : 0n;
  return (
    shiftDirection(pawnBoard, 7) | shiftDirection(pawnBoard, 9) | enPassant
  );
  // let attackMask = 0n;
  //
  // const attackTable = isWhite(side) ? WHITE_PAWN_ATTACKS : BLACK_PAWN_ATTACKS;
  // while (pawnBoard !== 0n) {
  //   const square = getLSBIndex(pawnBoard)!;
  //   pawnBoard = clearBit64(pawnBoard, square);
  //   attackMask |= attackTable[square]!;
  //   if (board.enPassant) {
  //     attackMask |= attackTable[square]! & (1n << BigInt(board.enPassant));
  //   }
  // }
  // return attackMask;
}
export function generateKnightAttacks(
  knightBoard: Bitboard,
  occupancy: Bitboard,
) {
  return generateTableAttacks(knightBoard, occupancy, KNIGHT_ATTACKS);
}
export function generateBishopAttacks(
  bishopBoard: Bitboard,
  occupancy: Bitboard,
): Bitboard {
  return generateDiagonalAttacks(bishopBoard, occupancy);
}
export function generateRookAttacks(
  rookBoard: Bitboard,
  occupancy: Bitboard,
): Bitboard {
  return generateOrthogonalAttacks(rookBoard, occupancy);
}
export function generateQueenAttacks(
  queenBoard: Bitboard,
  occupancy: Bitboard,
): Bitboard {
  return (
    generateOrthogonalAttacks(queenBoard, occupancy) |
    generateDiagonalAttacks(queenBoard, occupancy)
  );
}
export function generateKingAttacks(kingBoard: Bitboard, occupancy: Bitboard) {
  return generateTableAttacks(kingBoard, occupancy, KING_ATTACKS);
}

// Sliding generators
export function generateDiagonalAttacks(
  pieceBoard: Bitboard,
  occpancy: Bitboard,
): Bitboard {
  return generateSlidingAttacks(pieceBoard, occpancy, DIAGONAL_TABLES);
}
export function generateOrthogonalAttacks(
  pieceBoard: Bitboard,
  occupancy: Bitboard,
): Bitboard {
  return generateSlidingAttacks(pieceBoard, occupancy, ORTHOGONAL_TABLES);
}
export function generateSlidingAttacks(
  pieceBoard: Bitboard,
  occupancy: Bitboard,
  tables: SlidingTables,
): Bitboard {
  let attackMask = 0n;
  while (pieceBoard !== 0n) {
    const square = getLSBIndex(pieceBoard)!;
    pieceBoard = clearBit64(pieceBoard, square);

    attackMask |= generateSlidingAttack(square, occupancy, tables);
  }
  return attackMask;
}
export function generateSlidingAttack(
  square: Square,
  occupancy: Bitboard,
  tables: SlidingTables,
) {
  const blockerConfig = tables.MASKS[square]! & occupancy;
  const index = computeIndex(
    blockerConfig,
    tables.MAGICS[square]!,
    tables.SHIFTS[square]!,
  );
  const attacks = tables.ATTACKS[square]![index]!;
  return attacks;
}
function generateTableAttack(
  square: Square,
  activeOccupancy: Bitboard,
  table: ReadonlyBitboards,
) {
  return table[square]! & ~activeOccupancy;
}
function generateTableAttacks(
  pieceBoard: Bitboard,
  occupancy: Bitboard,
  table: ReadonlyBitboards,
) {
  let attackMask = 0n;
  while (pieceBoard !== 0n) {
    const square = getLSBIndex(pieceBoard)!;
    pieceBoard = clearBit64(pieceBoard, square);
    attackMask |= generateTableAttack(square, occupancy, table);
    attackMask |= table[square]! & ~occupancy;
  }
  return attackMask;
}
export function generateAttacks(board: Board, side: PieceColour): Bitboard {
  let attacks = 0n;
  const occupancy = board.activeOccupancy;
  attacks |= generatePawnAttacks(board, side);
  attacks |= generateKnightAttacks(board.getKnights(), occupancy);
  attacks |= generateBishopAttacks(board.getBishops(), occupancy);
  attacks |= generateRookAttacks(board.getRooks(), occupancy);
  attacks |= generateQueenAttacks(board.getQueens(), occupancy);
  attacks |= generateKingAttacks(board.getKing(), occupancy);
  return attacks;
}
export function generateFriendlyAttacks(board: Board): Bitboard {
  return generateAttacks(board, board.activeColour);
}
export function generateEnemyAttacks(board: Board): Bitboard {
  const side = getEnemyColour(board.activeColour);
  return generateAttacks(board, getEnemyColour(board.activeColour));
}

function getCheckCountOnKing(board: Board, square: Square) {
  // let attacks = 0n;
  // attacks |=
  //   KNIGHT_ATTACKS[board.getWhiteKingSquare()]! &
  //   board.getBitboard(PIECE_TYPES.Knight | board.activeColour);
  //
  // const diagonalAttacks = generateSlidingAttack(
  //   board,
  //   board.getWhiteKingSquare(),
  //   DIAGONAL_TABLES,
  // );
  // const orthogonalAttacks = generateSlidingAttack(
  //   board,
  //   board.getWhiteKingSquare(),
  //   ORTHOGONAL_TABLES,
  // );
  // attacks |=
  //   diagonalAttacks &
  //   board.getBitboard(PIECE_TYPES.Bishop | board.activeColour);
  //
  // attacks |=
  //   orthogonalAttacks &
  //   board.getBitboard(PIECE_TYPES.Rook | board.activeColour);
  //
  // attacks |=
  //   (diagonalAttacks | orthogonalAttacks) &
  //   board.getBitboard(PIECE_TYPES.Queen | board.activeColour);
  //
  // return popCount(attacks);
}
