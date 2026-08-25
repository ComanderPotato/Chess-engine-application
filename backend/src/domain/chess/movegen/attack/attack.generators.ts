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
import { clearBit64 } from "../../utils/bit.utils.js";
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

// Piece generators
export function generatePawnAttacks(board: Board, side: PieceColour): Bitboard {
  let pawnBoard = board.getBitboard(PIECE_TYPES.Pawn | side);
  let attackMask = 0n;

  const attackTable = isWhite(side) ? WHITE_PAWN_ATTACKS : BLACK_PAWN_ATTACKS;
  while (pawnBoard !== 0n) {
    const square = getLSBIndex(pawnBoard)!;
    pawnBoard = clearBit64(pawnBoard, square);
    attackMask |= attackTable[square]! & board.getEnemyOccupancyFor(side);
  }
  return attackMask;
}
export function generateKnightAttacks(board: Board, side: PieceColour) {
  return generateTableAttacks(board, PIECE_TYPES.Knight | side, KNIGHT_ATTACKS);
}
export function generateBishopAttacks(
  board: Board,
  side: PieceColour,
): Bitboard {
  return generateDiagonalAttacks(board, PIECE_TYPES.Bishop | side);
}
export function generateRookAttacks(board: Board, side: PieceColour): Bitboard {
  return generateOrthogonalAttacks(board, PIECE_TYPES.Rook | side);
}
export function generateQueenAttacks(
  board: Board,
  side: PieceColour,
): Bitboard {
  const piece = PIECE_TYPES.Queen | side;
  return (
    generateOrthogonalAttacks(board, piece) |
    generateDiagonalAttacks(board, piece)
  );
}
export function generateKingAttacks(board: Board, side: PieceColour) {
  return generateTableAttacks(board, PIECE_TYPES.King | side, KING_ATTACKS);
}

// Sliding generators
export function generateDiagonalAttacks(board: Board, piece: Piece): Bitboard {
  return generateSlidingAttacks(board, piece, DIAGONAL_TABLES);
}
export function generateOrthogonalAttacks(
  board: Board,
  piece: Piece,
): Bitboard {
  return generateSlidingAttacks(board, piece, ORTHOGONAL_TABLES);
}
export function generateSlidingAttacks(
  board: Board,
  piece: Piece,
  tables: SlidingTables,
): Bitboard {
  let pieceBoard = board.getBitboard(piece);

  let attackMask = 0n;
  while (pieceBoard !== 0n) {
    const square = getLSBIndex(pieceBoard)!;
    pieceBoard = clearBit64(pieceBoard, square);

    attackMask |= generateSlidingAttack(board, square, tables);
  }
  return attackMask;
}
export function generateSlidingAttack(
  board: Board,
  square: Square,
  tables: SlidingTables,
) {
  const blockerConfig = tables.MASKS[square]! & board.occupancy;
  const index = computeIndex(
    blockerConfig,
    tables.MAGICS[square]!,
    tables.SHIFTS[square]!,
  );
  const attacks = tables.ATTACKS[square]![index]!;
  return attacks;
}
function generateTableAttack(
  board: Board,
  square: Square,
  table: ReadonlyBitboards,
) {
  return table[square]! & ~board.friendlyOccupancy;
}
function generateTableAttacks(
  board: Board,
  piece: Piece,
  table: ReadonlyBitboards,
) {
  let pieceBoard = board.getBitboard(piece);
  let attackMask = 0n;
  const friendlyOccupancy = board.getFriendlyOccupancyFor(getColour(piece));
  while (pieceBoard !== 0n) {
    const square = getLSBIndex(pieceBoard)!;
    pieceBoard = clearBit64(pieceBoard, square);
    attackMask |= generateTableAttack(board, square, table);
    attackMask |= table[square]! & ~friendlyOccupancy;
  }
  return attackMask;
}
export function generateAttacks(board: Board, side: PieceColour): Bitboard {
  let attacks = 0n;
  attacks |= generatePawnAttacks(board, side);
  attacks |= generateKnightAttacks(board, side);
  attacks |= generateBishopAttacks(board, side);
  attacks |= generateRookAttacks(board, side);
  attacks |= generateQueenAttacks(board, side);
  attacks |= generateKingAttacks(board, side);
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
  let attacks = 0n;
  attacks |=
    KNIGHT_ATTACKS[board.getWhiteKingSquare()]! &
    board.getBitboard(PIECE_TYPES.Knight | board.activeColour);

  const diagonalAttacks = generateSlidingAttack(
    board,
    board.getWhiteKingSquare(),
    DIAGONAL_TABLES,
  );
  const orthogonalAttacks = generateSlidingAttack(
    board,
    board.getWhiteKingSquare(),
    ORTHOGONAL_TABLES,
  );
  attacks |=
    diagonalAttacks &
    board.getBitboard(PIECE_TYPES.Bishop | board.activeColour);

  attacks |=
    orthogonalAttacks &
    board.getBitboard(PIECE_TYPES.Rook | board.activeColour);

  attacks |=
    (diagonalAttacks | orthogonalAttacks) &
    board.getBitboard(PIECE_TYPES.Queen | board.activeColour);

  return popCount(attacks);
}
