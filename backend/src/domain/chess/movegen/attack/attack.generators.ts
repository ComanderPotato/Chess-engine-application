import {
  Bitboard,
  ReadonlyBitboards,
  Square,
} from "@/domain/chess/board/types.chess.js";
import { getEnemyColour, isWhite } from "@/domain/chess/piece/piece.chess.js";
import { PieceColour } from "@/domain/chess/piece/piece.types.js";
import { Board } from "../../board/board.chess.js";
import { clearBit64 } from "../../utils/bit.utils.js";
import { getLSBIndex } from "../../utils/bitboard.utils.js";
import { PIECE_TYPES } from "../../piece/piece.constants.js";
import {
  DIAGONAL_TABLES,
  KING_ATTACKS,
  KNIGHT_ATTACKS,
  ORTHOGONAL_TABLES,
  SlidingTables,
} from "./attack.tables.js";
import { computeIndex } from "../../utils/magic.utils.js";
import { shiftLeft, shiftRight } from "../move/move.bitboard.js";

export function generatePawnAttacks(board: Board, side: PieceColour): Bitboard {
  let pawnBoard = board.getBitboard(PIECE_TYPES.Pawn | side);
  const shiftDirection = isWhite(side) ? shiftRight : shiftLeft;
  const enPassant = board.enPassant ? 1n << BigInt(board.enPassant) : 0n;
  return (
    shiftDirection(pawnBoard, 7) | shiftDirection(pawnBoard, 9) | enPassant
  );
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

function generateDiagonalAttacks(
  pieceBoard: Bitboard,
  occpancy: Bitboard,
): Bitboard {
  return generateSlidingAttacks(pieceBoard, occpancy, DIAGONAL_TABLES);
}
function generateOrthogonalAttacks(
  pieceBoard: Bitboard,
  occupancy: Bitboard,
): Bitboard {
  return generateSlidingAttacks(pieceBoard, occupancy, ORTHOGONAL_TABLES);
}
function generateSlidingAttacks(
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
export function generateTableAttack(
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
