import {
  Bitboard,
  ReadonlyBitboards,
  Square,
} from "../../board/types.chess.js";
import { getEnemyColour, isWhite } from "../../piece/piece.chess.js";
import { PieceColour } from "../../piece/piece.types.js";
import { Board } from "../../board/board.chess.js";
import { clearBit } from "../../utils/bit.utils.js";
import {
  AND,
  equals,
  getLSBIndex,
  NOT,
  OR,
  squareToBB,
} from "../../utils/bitboard.utils.js";
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
import {
  NOT_A_FILE_MASK,
  NOT_H_FILE_MASK,
} from "../../board/board.constants.js";
import { printBitboard } from "../../debug/printer.chess.js";

export function generatePawnAttacks(board: Board, side: PieceColour): Bitboard {
  let pawnBoard = board.getBitboard(PIECE_TYPES.Pawn | side);
  const shiftDirection = isWhite(side) ? shiftLeft : shiftRight;
  const a = isWhite(side) ? NOT_A_FILE_MASK : NOT_H_FILE_MASK;
  const b = isWhite(side) ? NOT_H_FILE_MASK : NOT_A_FILE_MASK;
  // const enPassant: Bitboard = board.enPassant
  //   ? squareToBB(board.enPassant)
  //   : [0, 0];
  const enPassant: Bitboard = [0, 0];
  return OR(
    OR(
      shiftDirection(AND(pawnBoard, a), 7),
      shiftDirection(AND(pawnBoard, b), 9),
    ),
    enPassant,
  );
}
export function generateKnightAttacks(
  knightBoard: Bitboard,
  activeOccupancy: Bitboard,
) {
  return generateTableAttacks(knightBoard, activeOccupancy, KNIGHT_ATTACKS);
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
  return OR(
    generateOrthogonalAttacks([...queenBoard], occupancy),
    generateDiagonalAttacks([...queenBoard], occupancy),
  );
}
export function generateKingAttacks(
  kingBoard: Bitboard,
  activeOccupancy: Bitboard,
) {
  return generateTableAttacks(kingBoard, activeOccupancy, KING_ATTACKS);
}

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
function generateSlidingAttacks(
  pieceBoard: Bitboard,
  occupancy: Bitboard,
  tables: SlidingTables,
): Bitboard {
  let attackMask: Bitboard = [0, 0];
  while (!equals(pieceBoard, [0, 0])) {
    const square = getLSBIndex(pieceBoard)!;
    pieceBoard = clearBit(pieceBoard, square);

    attackMask = OR(
      attackMask,
      generateSlidingAttack(square, occupancy, tables),
    );
  }
  return attackMask;
}
export function generateSlidingAttack(
  square: Square,
  occupancy: Bitboard,
  tables: SlidingTables,
) {
  const blockerConfig = AND(tables.MASKS[square]!, occupancy);
  const index = computeIndex(
    blockerConfig,
    tables.MAGICS[square]!,
    tables.SHIFTS[square]!,
  );
  const attacks = tables.ATTACKS[square]![index]!;
  return attacks;
}
export function generateTableAttack(square: Square, table: ReadonlyBitboards) {
  return table[square]!;
}
function generateTableAttacks(
  pieceBoard: Bitboard,
  activeOccupancy: Bitboard,
  table: ReadonlyBitboards,
) {
  let attackMask: Bitboard = [0, 0];
  while (!equals(pieceBoard, [0, 0])) {
    const square = getLSBIndex(pieceBoard)!;
    pieceBoard = clearBit(pieceBoard, square);

    attackMask = OR(
      attackMask,
      AND(generateTableAttack(square, table), NOT(activeOccupancy)),
    );
  }
  return attackMask;
}
export function generateAttacks(
  board: Board,
  side: PieceColour = board.activeColour,
  occupancy: Bitboard = board.occupancy,
  activeOccupancy: Bitboard = board.getFriendlyOccupancyFor(side),
): Bitboard {
  let attacks: Bitboard = [0, 0];
  attacks = OR(attacks, generatePawnAttacks(board, side));

  attacks = OR(
    attacks,
    generateKnightAttacks(board.getKnights(side), activeOccupancy),
  );
  attacks = OR(
    attacks,
    generateBishopAttacks(board.getBishops(side), occupancy),
  );
  attacks = OR(attacks, generateRookAttacks(board.getRooks(side), occupancy));
  attacks = OR(attacks, generateQueenAttacks(board.getQueens(side), occupancy));
  attacks = OR(
    attacks,
    generateKingAttacks(board.getKing(side), activeOccupancy),
  );
  return attacks;
}
export function generateFriendlyAttacks(
  board: Board,
  occupancy: Bitboard = board.occupancy,
  friendlyOccupancy: Bitboard = board.activeOccupancy,
): Bitboard {
  return generateAttacks(
    board,
    board.activeColour,
    occupancy,
    friendlyOccupancy,
  );
}
export function generateEnemyAttacks(
  board: Board,
  occupancy: Bitboard = board.occupancy,
  opponentOccupancy: Bitboard = board.enemyOccupancy,
): Bitboard {
  const side = getEnemyColour(board.activeColour);
  return generateAttacks(board, side, occupancy, [0, 0]);
}
