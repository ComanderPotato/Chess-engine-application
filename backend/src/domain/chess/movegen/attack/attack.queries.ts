import { Board } from "../../board/board.chess.js";
import { FULL_BOARD_MASK } from "../../board/board.constants.js";
import { Bitboard, Square } from "../../board/types.chess.js";
import { printBitboard } from "../../debug/printer.chess.js";
import { getEnemyColour, normaliseColour } from "../../piece/piece.chess.js";
import { PIECE_TYPES } from "../../piece/piece.constants.js";
import { PieceColour } from "../../piece/piece.types.js";
import { isBitSet64 } from "../../utils/bit.utils.js";
import {
  clearLSB,
  getLSBIndex,
  popCount,
  squareToBB,
} from "../../utils/bitboard.utils.js";
import { squareToCoord } from "../../utils/coord.utils.js";
import {
  generateBishopAttacks,
  generateDiagonalAttacks,
  generateOrthogonalAttacks,
  generateQueenAttacks,
  generateRookAttacks,
  generateSlidingAttack,
} from "./attack.generators.js";
import { generateDiagonalAttackMask } from "./attack.mask.js";
import {
  BETWEEN,
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
  const orthogonalSliders =
    board.getRooks(board.opponentColour) |
    board.getQueens(board.opponentColour);
  const diagonalSliders =
    board.getBishops(board.opponentColour) |
    board.getQueens(board.opponentColour);

  const activeKingSquare = board.getKingSquare(board.activeColour);
  let potentialOrthogonalPins =
    generateSlidingAttack(activeKingSquare, occupancy, ORTHOGONAL_TABLES) &
    board.friendlyOccupancy;
  let potentialDiagonalPins =
    generateSlidingAttack(activeKingSquare, occupancy, DIAGONAL_TABLES) &
    board.friendlyOccupancy;

  let pinnedPieces = 0n;
  while (potentialOrthogonalPins !== 0n) {
    const square = getLSBIndex(potentialOrthogonalPins)!;
    const bb = squareToBB(square);
    if (
      (generateSlidingAttack(
        activeKingSquare,
        occupancy & ~bb,
        ORTHOGONAL_TABLES,
      ) &
        orthogonalSliders) !==
      0n
    ) {
      pinnedPieces |= bb;
    }
    potentialOrthogonalPins = clearLSB(potentialOrthogonalPins);
  }
  while (potentialDiagonalPins !== 0n) {
    const square = getLSBIndex(potentialDiagonalPins)!;
    const bb = squareToBB(square);
    if (
      (generateSlidingAttack(
        activeKingSquare,
        occupancy & ~bb,
        DIAGONAL_TABLES,
      ) &
        diagonalSliders) !==
      0n
    ) {
      pinnedPieces |= bb;
    }
    potentialDiagonalPins = clearLSB(potentialDiagonalPins);
  }
  return pinnedPieces;
}

export function queryPinnedPiece(
  board: Board,
  occupancy: Bitboard,
): { diagonalPins: Bitboard; orthogonalPins: Bitboard } {
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

  return {
    diagonalPins: enemySlidingAttacks & diagonal & occupancy,
    orthogonalPins: enemySlidingAttacks & orthogonal & occupancy,
  };
  // return enemySlidingAttacks & (orthogonal | diagonal) & occupancy;
}
export function queryPinAttackers(board: Board, occupancy: Bitboard): Bitboard {
  const activeKingSquare = board.getKingSquare(board.activeColour);
  const enemyColour = board.opponentColour;
  const opponentBishops = board.getBishops(enemyColour);
  const opponentRooks = board.getRooks(enemyColour);
  const opponentQueens = board.getQueens(enemyColour);
  let orthogonal =
    generateSlidingAttack(activeKingSquare, occupancy, ORTHOGONAL_TABLES) &
    (opponentRooks | opponentQueens);

  let diagonal =
    generateSlidingAttack(activeKingSquare, occupancy, DIAGONAL_TABLES) &
    (opponentBishops | opponentQueens);
  return orthogonal | diagonal;
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
  printBitboard(enemySlidingAttacks);

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
export function filterPinnedPieceMovement(
  board: Board,
  square: Square | null,
): Bitboard {
  if (!square) return 0n;
  const activeKingSquare = board.getKingSquare(board.activeColour);
  const occupancy = board.occupancy;
  const pinned = squareToBB(square);
  let potentialOrthogonalPins =
    generateSlidingAttack(
      activeKingSquare,
      occupancy & ~pinned,
      ORTHOGONAL_TABLES,
    ) &
    (board.getRooks(board.opponentColour) |
      board.getQueens(board.opponentColour));
  let potentialDiagonalPins =
    generateSlidingAttack(
      activeKingSquare,
      occupancy & ~pinned,
      DIAGONAL_TABLES,
    ) &
    (board.getBishops(board.opponentColour) |
      board.getQueens(board.opponentColour));
  return BETWEEN[activeKingSquare]![
    getLSBIndex(potentialOrthogonalPins | potentialDiagonalPins)!
  ]!;
}

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
  );

  let diagonal = generateSlidingAttack(
    square,
    board.occupancy,
    DIAGONAL_TABLES,
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
// TODO: move to suitable file
export function isPiecePinnedV1(
  pinnedPieces: Bitboard,
  piece: Bitboard,
): boolean {
  return (pinnedPieces & piece) !== 0n;
}
export function isPiecePinnedV2(
  pinnedPieces: Bitboard,
  square: Square,
): boolean {
  return isBitSet64(pinnedPieces, square);
}
export function queryPinner(board: Board, pinnedPiece: Bitboard): Bitboard {
  const kingSquare = board.getKingSquare(board.activeColour);
  const occupancy = board.occupancy & ~pinnedPiece;

  let orthogonal =
    generateSlidingAttack(kingSquare, occupancy, ORTHOGONAL_TABLES) &
    (board.getRooks(getEnemyColour(board.activeColour)) |
      board.getQueens(getEnemyColour(board.activeColour)));

  let diagonal =
    generateSlidingAttack(kingSquare, occupancy, DIAGONAL_TABLES) &
    (board.getBishops(getEnemyColour(board.activeColour)) |
      board.getQueens(getEnemyColour(board.activeColour)));
  return orthogonal | diagonal;
}
export function numCheckers(attackedBy: Bitboard): number {
  return popCount(attackedBy);
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
export function isKingAttacked(
  board: Board,
  square: Square,
  active: PieceColour,
): boolean {
  const opponent = getEnemyColour(active);
  if (
    (PAWN_ATTACKS[normaliseColour(active)]![square]! &
      board.getPawns(opponent)) !==
    0n
  )
    return true;
  if ((KNIGHT_ATTACKS[square]! & board.getKnights(opponent)) !== 0n)
    return true;
  let queens = board.getQueens(opponent);
  let orthogonal = generateSlidingAttack(
    square,
    board.occupancy,
    ORTHOGONAL_TABLES,
  );
  if ((orthogonal & (board.getRooks(opponent) | queens)) !== 0n) return true;

  let diagonal = generateSlidingAttack(
    square,
    board.occupancy,
    DIAGONAL_TABLES,
  );
  if ((diagonal & (board.getBishops(opponent) | queens)) !== 0n) return true;
  return false;
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

  if (
    (PAWN_ATTACKS[normaliseColour(friendlyColour)]![square]! &
      board.getPawns(enemyColour)) !==
    0n
  )
    return true;
  // attacks |=
  //   PAWN_ATTACKS[normaliseColour(friendlyColour)]![square]! &
  //   (cache?.pawn ?? board.getBitboard(PIECE_TYPES.Pawn | enemyColour));
  //
  if ((KNIGHT_ATTACKS[square]! & board.getKnights(enemyColour)) !== 0n)
    return true;
  // attacks |=
  //   KNIGHT_ATTACKS[square]! &
  //   (cache?.knight ?? board.getBitboard(PIECE_TYPES.Knight | enemyColour));
  //
  let queens = board.getQueens(enemyColour);
  let orthogonal = generateSlidingAttack(
    square,
    board.occupancy,
    ORTHOGONAL_TABLES,
  );
  if ((orthogonal & (board.getRooks(enemyColour) | queens)) !== 0n) return true;

  let diagonal = generateSlidingAttack(
    square,
    board.occupancy,
    DIAGONAL_TABLES,
  );
  if ((diagonal & (board.getBishops(enemyColour) | queens)) !== 0n) return true;

  // attacks |=
  //   (diagonal &
  //     (cache?.bishop ?? board.getBitboard(PIECE_TYPES.Bishop | enemyColour))) |
  //   (orthogonal &
  //     (cache?.rook ?? board.getBitboard(PIECE_TYPES.Rook | enemyColour))) |
  //   ((diagonal | orthogonal) &
  //     (cache?.queen ?? board.getBitboard(PIECE_TYPES.Queen | enemyColour)));

  // attacks |=
  //   KING_ATTACKS[square]! &
  //   (cache?.king ?? board.getBitboard(PIECE_TYPES.King | enemyColour));

  return false;
  // return attacks !== 0n;
}
