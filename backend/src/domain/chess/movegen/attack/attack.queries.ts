import { Board } from "../../board/board.chess.js";
import { FULL_BOARD_MASK } from "../../board/board.constants.js";
import { Bitboard, Square } from "../../board/types.chess.js";
import { printBitboard } from "../../debug/printer.chess.js";
import { getEnemyColour, normaliseColour } from "../../piece/piece.chess.js";
import { PIECE_TYPES } from "../../piece/piece.constants.js";
import { PieceColour } from "../../piece/piece.types.js";
import { clearLSB, popCount } from "../../utils/bitboard.utils.js";
import {
  generateBishopAttacks,
  generateQueenAttacks,
  generateRookAttacks,
  generateSlidingAttack,
  generateSlidingAttacks,
} from "./attack.generators.js";
import {
  DIAGONAL_TABLES,
  KING_ATTACKS,
  KNIGHT_ATTACKS,
  ORTHOGONAL_TABLES,
  PAWN_ATTACKS,
} from "./attack.tables.js";

export interface EnemyBitboards {
  pawn: Bitboard;
  knight: Bitboard;
  bishop: Bitboard;
  rook: Bitboard;
  queen: Bitboard;
  king: Bitboard;
}
export function cacheEnemyBitboards(board: Board): EnemyBitboards {
  const enemyColour = getEnemyColour(board.activeColour);
  return {
    pawn: board.getBitboard(PIECE_TYPES.Pawn | enemyColour),
    knight: board.getBitboard(PIECE_TYPES.Knight | enemyColour),
    bishop: board.getBitboard(PIECE_TYPES.Bishop | enemyColour),
    rook: board.getBitboard(PIECE_TYPES.Rook | enemyColour),
    queen: board.getBitboard(PIECE_TYPES.Queen | enemyColour),
    king: board.getBitboard(PIECE_TYPES.King | enemyColour),
  };
}

export function queryPinnedPieces(board: Board, occupancy: Bitboard): Bitboard {
  let enemySlidingAttacks = 0n;
  const enemyColour = board.opponentColour;
  enemySlidingAttacks |= generateBishopAttacks(
    board.getBishops(enemyColour),
    occupancy,
  );
  enemySlidingAttacks |= generateRookAttacks(
    board.getRooks(enemyColour),
    occupancy,
  );
  enemySlidingAttacks |= generateQueenAttacks(
    board.getQueens(enemyColour),
    occupancy,
  );

  //
  const activeKingSquare = board.getKingSquare(board.activeColour);
  let orthogonal = generateSlidingAttack(
    activeKingSquare,
    0n,
    ORTHOGONAL_TABLES,
  );

  let diagonal = generateSlidingAttack(activeKingSquare, 0n, DIAGONAL_TABLES);

  return enemySlidingAttacks & (orthogonal | diagonal) & occupancy;
}
export function queryPinnedRays(board: Board, occupancy: Bitboard): Bitboard {
  let enemySlidingAttacks = 0n;
  const enemyColour = board.opponentColour;
  const opponentBishops = board.getBishops(enemyColour);
  enemySlidingAttacks |=
    generateBishopAttacks(opponentBishops, occupancy) | opponentBishops;

  const opponentRooks = board.getRooks(enemyColour);
  enemySlidingAttacks |=
    generateRookAttacks(opponentRooks, occupancy) | opponentRooks;
  const opponentQueens = board.getQueens(enemyColour);
  enemySlidingAttacks |=
    generateQueenAttacks(opponentQueens, occupancy) | opponentQueens;

  const activeKingSquare = board.getKingSquare(board.activeColour);
  let orthogonal = generateSlidingAttack(
    activeKingSquare,
    occupancy,
    ORTHOGONAL_TABLES,
  );

  let diagonal = generateSlidingAttack(
    activeKingSquare,
    occupancy,
    DIAGONAL_TABLES,
  );

  return enemySlidingAttacks & (orthogonal | diagonal) & occupancy;
}
// export function isSquareAttacked(
//   board: Board,
//   square: Square,
//   enemyColour: PieceColour,
//   cache?: EnemyBitboards,
// ): boolean {
//   // const friendlyColour = getEnemyColour(enemyColour);
//
//   if (
//     (PAWN_ATTACKS[normaliseColour(board.activeColour)]![square]! &
//       (cache?.pawn ?? board.getBitboard(PIECE_TYPES.Pawn | enemyColour))) !==
//     0n
//   ) {
//     return true;
//   }
//
//   if (
//     (KNIGHT_ATTACKS[square]! &
//       (cache?.knight ??
//         board.getBitboard(PIECE_TYPES.Knight | enemyColour))) !==
//     0n
//   ) {
//     return true;
//   }
//
//   const diagonal = generateSlidingAttack(board, square, DIAGONAL_TABLES);
//
//   if (
//     (diagonal &
//       ((cache?.bishop ?? board.getBitboard(PIECE_TYPES.Bishop | enemyColour)) |
//         (cache?.queen ??
//           board.getBitboard(PIECE_TYPES.Queen | enemyColour)))) !==
//     0n
//   ) {
//     return true;
//   }
//
//   const orthogonal = generateSlidingAttack(board, square, ORTHOGONAL_TABLES);
//
//   if (
//     (orthogonal &
//       ((cache?.rook ?? board.getBitboard(PIECE_TYPES.Rook | enemyColour)) |
//         (cache?.queen ??
//           board.getBitboard(PIECE_TYPES.Queen | enemyColour)))) !==
//     0n
//   ) {
//     return true;
//   }
//
//   if (
//     (KING_ATTACKS[square]! &
//       (cache?.king ?? board.getBitboard(PIECE_TYPES.King | enemyColour))) !==
//     0n
//   ) {
//     return true;
//   }
//
//   return false;
// }
export function generateAttackRaysOnSquare(
  board: Board,
  square: Square,
  enemyColour: PieceColour,
  pinnedPieces: Bitboard = 0n,
): Bitboard {
  let orthogonal = generateSlidingAttack(
    square,
    board.occupancy,
    ORTHOGONAL_TABLES,
    // pinnedPieces,
  );

  let diagonal = generateSlidingAttack(
    square,
    board.occupancy,
    DIAGONAL_TABLES,
    // pinnedPieces,
  );

  return diagonal | orthogonal;
}
export function generateAttacksOnSquare(
  board: Board,
  square: Square,
  enemyColour: PieceColour,
  // pinnedPieces: Bitboard,
): Bitboard {
  const friendlyColour = getEnemyColour(enemyColour);
  let attacks = 0n;

  attacks |=
    PAWN_ATTACKS[normaliseColour(friendlyColour)]![square]! &
    board.getBitboard(PIECE_TYPES.Pawn | enemyColour);

  attacks |=
    KNIGHT_ATTACKS[square]! &
    board.getBitboard(PIECE_TYPES.Knight | enemyColour);

  let orthogonal = generateSlidingAttack(
    square,
    board.occupancy,
    ORTHOGONAL_TABLES,
    // pinnedPieces,
  );

  let diagonal = generateSlidingAttack(
    square,
    board.occupancy,
    DIAGONAL_TABLES,
    // pinnedPieces,
  );

  attacks |=
    (diagonal & board.getBitboard(PIECE_TYPES.Bishop | enemyColour)) |
    (orthogonal & board.getBitboard(PIECE_TYPES.Rook | enemyColour)) |
    ((diagonal | orthogonal) &
      board.getBitboard(PIECE_TYPES.Queen | enemyColour));

  attacks |=
    KING_ATTACKS[square]! & board.getBitboard(PIECE_TYPES.King | enemyColour);

  return attacks;
}
export function getChecksOnKing(board: Board, side: PieceColour): number {
  const kingSquare = board.getKingSquare(side);
  let attackers = generateAttacksOnSquare(
    board,
    kingSquare,
    getEnemyColour(side),
  );
  return popCount(attackers);
}
export function isSquareAttacked(
  board: Board,
  square: Square,
  enemyColour: PieceColour,
  cache?: EnemyBitboards,
): boolean {
  // if (!isBitSet64(board.occupancy, square)) return false;
  const friendlyColour = getEnemyColour(enemyColour);
  let attacks = 0n;

  attacks |=
    PAWN_ATTACKS[normaliseColour(friendlyColour)]![square]! &
    (cache?.pawn ?? board.getBitboard(PIECE_TYPES.Pawn | enemyColour));

  attacks |=
    KNIGHT_ATTACKS[square]! &
    (cache?.knight ?? board.getBitboard(PIECE_TYPES.Knight | enemyColour));

  let orthogonal = generateSlidingAttack(
    square,
    board.occupancy,
    ORTHOGONAL_TABLES,
  );

  let diagonal = generateSlidingAttack(
    square,
    board.occupancy,
    DIAGONAL_TABLES,
  );

  attacks |=
    (diagonal &
      (cache?.bishop ?? board.getBitboard(PIECE_TYPES.Bishop | enemyColour))) |
    (orthogonal &
      (cache?.rook ?? board.getBitboard(PIECE_TYPES.Rook | enemyColour))) |
    ((diagonal | orthogonal) &
      (cache?.queen ?? board.getBitboard(PIECE_TYPES.Queen | enemyColour)));

  attacks |=
    KING_ATTACKS[square]! &
    (cache?.king ?? board.getBitboard(PIECE_TYPES.King | enemyColour));

  return attacks !== 0n;
}
