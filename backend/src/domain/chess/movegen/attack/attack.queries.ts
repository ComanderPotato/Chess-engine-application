import { Board } from "../../board/board.chess.js";
import {
  FILE_MASKS,
  RANK_MASKS,
  RANK_SIZE,
  SQUARE_TO_BB,
} from "../../board/board.constants.js";
import { Bitboard, Square } from "../../board/types.chess.js";
import { printBitboard } from "../../debug/printer.chess.js";
import { getEnemyColour, normaliseColour } from "../../piece/piece.chess.js";
import { PIECE_TYPES } from "../../piece/piece.constants.js";
import { PieceColour } from "../../piece/piece.types.js";
import {
  AND,
  clearLSB,
  equals,
  getLSBIndex,
  NOT,
  OR,
  popCount,
  squareToBB,
} from "../../utils/bitboard.utils.js";
import { toFile, toRank } from "../../utils/square.utils.js";
import { MoveCache } from "../move/move.cache.js";
import {
  blackSinglePush,
  PAWN_PUSH_GENERATORS,
} from "../move/move.generator.js";
import {
  generateBishopAttacks,
  generateQueenAttacks,
  generateRookAttacks,
  generateSlidingAttack,
} from "./attack.generators.js";
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
  const activeKingSquare = board.getKingSquare(board.activeColour);

  const en: Bitboard = board.enPassant
    ? SQUARE_TO_BB[board.enPassant]!
    : [0, 0];
  const a = AND(board.occupancy, NOT(en));
  let kingOrthogonalAttacks = generateSlidingAttack(
    activeKingSquare,
    occupancy,
    ORTHOGONAL_TABLES,
  );
  let kingDiagonalAttacks = generateSlidingAttack(
    activeKingSquare,
    occupancy,
    DIAGONAL_TABLES,
  );

  let potentialOrthogonalPins = AND(
    kingOrthogonalAttacks,
    board.getFriendlyOccupancyFor(board.activeColour),
  );

  let potentialDiagonalPins = AND(
    kingDiagonalAttacks,
    board.getFriendlyOccupancyFor(board.activeColour),
  );

  let checkedOrthogonal = AND(
    kingOrthogonalAttacks,
    board.getEnemyOccupancyFor(board.activeColour),
  );

  let checkedDiagonal = AND(
    kingDiagonalAttacks,
    board.getEnemyOccupancyFor(board.activeColour),
  );

  const orthogonalSliders = AND(
    OR(
      board.getRooks(board.opponentColour),
      board.getQueens(board.opponentColour),
    ),
    NOT(checkedOrthogonal),
  );
  const diagonalSliders = AND(
    OR(
      board.getBishops(board.opponentColour),
      board.getQueens(board.opponentColour),
    ),
    NOT(checkedDiagonal),
  );
  let pinnedPieces: Bitboard = [0, 0];
  while (!equals(potentialOrthogonalPins, [0, 0])) {
    const square = getLSBIndex(potentialOrthogonalPins)!;
    const bb = squareToBB(square);
    if (
      !equals(
        AND(
          generateSlidingAttack(
            activeKingSquare,
            AND(occupancy, NOT(bb)),
            ORTHOGONAL_TABLES,
          ),
          orthogonalSliders,
        ),
        [0, 0],
      )
    ) {
      pinnedPieces = OR(pinnedPieces, bb);
      // pinnedPieces |= bb;
    }
    potentialOrthogonalPins = clearLSB(potentialOrthogonalPins);
  }
  while (!equals(potentialDiagonalPins, [0, 0])) {
    const square = getLSBIndex(potentialDiagonalPins)!;
    const bb = squareToBB(square);
    if (
      !equals(
        AND(
          generateSlidingAttack(
            activeKingSquare,
            AND(occupancy, NOT(bb)),
            DIAGONAL_TABLES,
          ),
          diagonalSliders,
        ),
        [0, 0],
      )
    ) {
      pinnedPieces = OR(pinnedPieces, bb);
      // pinnedPieces |= bb;
    }
    potentialDiagonalPins = clearLSB(potentialDiagonalPins);
  }
  return pinnedPieces;
}

// export function queryPinnedPiece(
//   board: Board,
//   occupancy: Bitboard,
// ): { diagonalPins: Bitboard; orthogonalPins: Bitboard } {
//   let enemySlidingAttacks: Bitboard= [0, 0];
//   const enemyColour = board.opponentColour;
//   enemySlidingAttacks = OR(
//     enemySlidingAttacks,
//     generateBishopAttacks(board.getBishops(enemyColour), occupancy),
//   );
//   enemySlidingAttacks |= generateRookAttacks(
//     board.getRooks(enemyColour),
//     occupancy,
//   );
//   enemySlidingAttacks |= generateQueenAttacks(
//     board.getQueens(enemyColour),
//     occupancy,
//   );
//
//   //
//   const activeKingSquare = board.getKingSquare(board.activeColour);
//   let orthogonal = generateSlidingAttack(
//     activeKingSquare,
//     0n,
//     ORTHOGONAL_TABLES,
//   );
//
//   let diagonal = generateSlidingAttack(activeKingSquare, 0n, DIAGONAL_TABLES);
//
//   return {
//     diagonalPins: enemySlidingAttacks & diagonal & occupancy,
//     orthogonalPins: enemySlidingAttacks & orthogonal & occupancy,
//   };
//   // return enemySlidingAttacks & (orthogonal | diagonal) & occupancy;
// }
// export function queryPinAttackers(board: Board, occupancy: Bitboard): Bitboard {
//   const activeKingSquare = board.getKingSquare(board.activeColour);
//   const enemyColour = board.opponentColour;
//   const opponentBishops = board.getBishops(enemyColour);
//   const opponentRooks = board.getRooks(enemyColour);
//   const opponentQueens = board.getQueens(enemyColour);
//   let orthogonal =
//     generateSlidingAttack(activeKingSquare, occupancy, ORTHOGONAL_TABLES) &
//     (opponentRooks | opponentQueens);
//
//   let diagonal =
//     generateSlidingAttack(activeKingSquare, occupancy, DIAGONAL_TABLES) &
//     (opponentBishops | opponentQueens);
//   return orthogonal | diagonal;
// }
export function queryPinnedRays(board: Board, occupancy: Bitboard): Bitboard {
  let enemySlidingAttacks: Bitboard = [0, 0];
  const enemyColour = board.opponentColour;
  const opponentBishops = board.getBishops(enemyColour);
  enemySlidingAttacks = OR(
    enemySlidingAttacks,
    OR(generateBishopAttacks(opponentBishops, occupancy), opponentBishops),
  );

  const opponentRooks = board.getRooks(enemyColour);
  enemySlidingAttacks = OR(
    enemySlidingAttacks,
    OR(generateRookAttacks(opponentRooks, occupancy), opponentRooks),
  );
  const opponentQueens = board.getQueens(enemyColour);
  enemySlidingAttacks = OR(
    enemySlidingAttacks,
    OR(generateQueenAttacks(opponentQueens, occupancy), opponentQueens),
  );

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

  return AND(AND(enemySlidingAttacks, OR(orthogonal, diagonal)), occupancy);
}
export function filterEnpassant(
  board: Board,
  targetSquares: Bitboard,
): Bitboard {
  if (!board.enPassant) return [0, 0];

  const enPassant = squareToBB(board.enPassant);
  const enemyColour = getEnemyColour(board.activeColour);
  const attacking = AND(
    PAWN_ATTACKS[normaliseColour(enemyColour)]![board.enPassant]!,
    board.getPawns(board.activeColour),
  );
  const numAttackers = popCount(attacking);
  // if (numAttackers !== 1) return OR(targetSquares, enPassant);
  if (numAttackers !== 1) return enPassant;
  const gnr = PAWN_PUSH_GENERATORS[normaliseColour(enemyColour)]![0]!;
  const captured = gnr(squareToBB(board.enPassant), board.occupancy);

  const kingSquare = board.getKingSquare(board.activeColour);
  const orthogonal = AND(
    generateSlidingAttack(
      board.getKingSquare(board.activeColour),
      AND(board.occupancy, NOT(OR(captured, attacking))),
      ORTHOGONAL_TABLES,
    ),
    RANK_MASKS[toRank(kingSquare)]!,
  );
  if (
    !equals(
      AND(
        orthogonal,
        OR(board.getRooks(enemyColour), board.getQueens(enemyColour)),
      ),
      [0, 0],
    )
  ) {
    return [0, 0];
    // return AND(targetSquares, NOT(squareToBB(board.enPassant)));
  }
  return enPassant;
  // return OR(targetSquares, enPassant);
}
export function isSquareAttacked(
  board: Board,
  square: Square,
  enemyColour: PieceColour,
  cache?: EnemyBitboards,
): boolean {
  const friendlyColour = getEnemyColour(enemyColour);

  if (
    !equals(
      AND(
        PAWN_ATTACKS[normaliseColour(friendlyColour)]![square]!,
        board.getPawns(enemyColour),
      ),
      [0, 0],
    )
  ) {
    return true;
  }
  // if (
  //   (PAWN_ATTACKS[normaliseColour(board.activeColour)]![square]! &
  //     (cache?.pawn ?? board.getBitboard(PIECE_TYPES.Pawn | enemyColour))) !==
  //   0n
  // ) {
  //   return true;
  // }

  if (
    !equals(AND(KNIGHT_ATTACKS[square]!, board.getKnights(enemyColour)), [0, 0])
  ) {
    return true;
  }

  const diagonal = generateSlidingAttack(
    square,
    board.occupancy,
    DIAGONAL_TABLES,
  );

  if (
    !equals(
      AND(
        diagonal,
        OR(board.getBishops(enemyColour), board.getQueens(enemyColour)),
      ),
      [0, 0],
    )
  ) {
    return true;
  }

  const orthogonal = generateSlidingAttack(
    square,
    board.occupancy,
    ORTHOGONAL_TABLES,
  );

  if (
    !equals(
      AND(
        orthogonal,
        OR(board.getRooks(enemyColour), board.getQueens(enemyColour)),
      ),
      [0, 0],
    )
  ) {
    return true;
  }

  if (!equals(AND(KING_ATTACKS[square]!, board.getKing(enemyColour)), [0, 0])) {
    return true;
  }

  return false;
}
export function filterPinnedPieceMovement(
  board: Board,
  checkers: Bitboard,
  square: Square | null,
): Bitboard {
  if (!square) return [0, 0];
  const activeKingSquare = board.getKingSquare(board.activeColour);
  const pinned = squareToBB(square);
  const occupancy = board.occupancy;
  let potentialOrthogonalPins = AND(
    generateSlidingAttack(
      activeKingSquare,
      AND(occupancy, NOT(pinned)),
      ORTHOGONAL_TABLES,
    ),
    OR(
      board.getRooks(board.opponentColour),
      board.getQueens(board.opponentColour),
    ),
  );

  let potentialDiagonalPins = AND(
    generateSlidingAttack(
      activeKingSquare,
      AND(occupancy, NOT(pinned)),
      DIAGONAL_TABLES,
    ),
    OR(
      board.getBishops(board.opponentColour),

      board.getQueens(board.opponentColour),
    ),
  );

  return BETWEEN[activeKingSquare]![
    getLSBIndex(
      AND(OR(potentialOrthogonalPins, potentialDiagonalPins), NOT(checkers)),
    )!
  ]!;
}

// export function generateAttackRaysOnSquare(
//   board: Board,
//   square: Square,
//   enemyColour: PieceColour,
//   pinnedPieces: Bitboard = 0n,
// ): Bitboard {
//   let orthogonal = generateSlidingAttack(
//     square,
//     board.occupancy,
//     ORTHOGONAL_TABLES,
//     // pinnedPieces,
//   );
//
//   let diagonal = generateSlidingAttack(
//     square,
//     board.occupancy,
//     DIAGONAL_TABLES,
//     // pinnedPieces,
//   );
//
//   return diagonal | orthogonal;
// }
export function generateAttacksOnSquare(
  board: Board,
  square: Square,
  enemyColour: PieceColour,
): Bitboard {
  const friendlyColour = getEnemyColour(enemyColour);
  let attacks: Bitboard = [0, 0];

  attacks = OR(
    attacks,
    AND(
      PAWN_ATTACKS[normaliseColour(friendlyColour)]![square]!,
      board.getBitboard(PIECE_TYPES.Pawn | enemyColour),
    ),
  );

  attacks = OR(
    attacks,
    AND(
      KNIGHT_ATTACKS[square]!,
      board.getBitboard(PIECE_TYPES.Knight | enemyColour),
    ),
  );

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

  attacks = OR(
    attacks,
    OR(
      OR(
        AND(diagonal, board.getBitboard(PIECE_TYPES.Bishop | enemyColour)),
        AND(orthogonal, board.getBitboard(PIECE_TYPES.Rook | enemyColour)),
      ),
      AND(
        OR(diagonal, orthogonal),
        board.getBitboard(PIECE_TYPES.Queen | enemyColour),
      ),
    ),
  );

  attacks = OR(
    attacks,
    AND(
      KING_ATTACKS[square]!,
      board.getBitboard(PIECE_TYPES.King | enemyColour),
    ),
  );

  return attacks;
}
// TODO: move to suitable file
// export function isPiecePinnedV1(
//   pinnedPieces: Bitboard,
//   piece: Bitboard,
// ): boolean {
//   return (pinnedPieces & piece) !== 0n;
// }
// export function isPiecePinnedV2(
//   pinnedPieces: Bitboard,
//   square: Square,
// ): boolean {
//   return isBitSet64(pinnedPieces, square);
// }
// export function queryPinner(board: Board, pinnedPiece: Bitboard): Bitboard {
//   const kingSquare = board.getKingSquare(board.activeColour);
//   const occupancy = board.occupancy & ~pinnedPiece;
//
//   let orthogonal =
//     generateSlidingAttack(kingSquare, occupancy, ORTHOGONAL_TABLES) &
//     (board.getRooks(getEnemyColour(board.activeColour)) |
//       board.getQueens(getEnemyColour(board.activeColour)));
//
//   let diagonal =
//     generateSlidingAttack(kingSquare, occupancy, DIAGONAL_TABLES) &
//     (board.getBishops(getEnemyColour(board.activeColour)) |
//       board.getQueens(getEnemyColour(board.activeColour)));
//   return orthogonal | diagonal;
// }
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
// export function isKingAttacked(
//   board: Board,
//   square: Square,
//   active: PieceColour,
// ): boolean {
//   const opponent = getEnemyColour(active);
//   if (
//     (PAWN_ATTACKS[normaliseColour(active)]![square]! &
//       board.getPawns(opponent)) !==
//     0n
//   )
//     return true;
//   if ((KNIGHT_ATTACKS[square]! & board.getKnights(opponent)) !== 0n)
//     return true;
//   let queens = board.getQueens(opponent);
//   let orthogonal = generateSlidingAttack(
//     square,
//     board.occupancy,
//     ORTHOGONAL_TABLES,
//   );
//   if ((orthogonal & (board.getRooks(opponent) | queens)) !== 0n) return true;
//
//   let diagonal = generateSlidingAttack(
//     square,
//     board.occupancy,
//     DIAGONAL_TABLES,
//   );
//   if ((diagonal & (board.getBishops(opponent) | queens)) !== 0n) return true;
//   return false;
// }
// export function isSquareAttacked(
//   board: Board,
//   square: Square,
//   enemyColour: PieceColour,
//   cache?: EnemyBitboards,
// ): boolean {
//   // if (!isBitSet64(board.occupancy, square)) return false;
//   const friendlyColour = getEnemyColour(enemyColour);
//   let attacks = 0n;
//
//   if (
//     (PAWN_ATTACKS[normaliseColour(friendlyColour)]![square]! &
//       board.getPawns(enemyColour)) !==
//     0n
//   )
//     return true;
//   // attacks |=
//   //   PAWN_ATTACKS[normaliseColour(friendlyColour)]![square]! &
//   //   (cache?.pawn ?? board.getBitboard(PIECE_TYPES.Pawn | enemyColour));
//   //
//   if ((KNIGHT_ATTACKS[square]! & board.getKnights(enemyColour)) !== 0n)
//     return true;
//   // attacks |=
//   //   KNIGHT_ATTACKS[square]! &
//   //   (cache?.knight ?? board.getBitboard(PIECE_TYPES.Knight | enemyColour));
//   //
//   let queens = board.getQueens(enemyColour);
//   let orthogonal = generateSlidingAttack(
//     square,
//     board.occupancy,
//     ORTHOGONAL_TABLES,
//   );
//   if ((orthogonal & (board.getRooks(enemyColour) | queens)) !== 0n) return true;
//
//   let diagonal = generateSlidingAttack(
//     square,
//     board.occupancy,
//     DIAGONAL_TABLES,
//   );
//   if ((diagonal & (board.getBishops(enemyColour) | queens)) !== 0n) return true;
//
//   // attacks |=
//   //   (diagonal &
//   //     (cache?.bishop ?? board.getBitboard(PIECE_TYPES.Bishop | enemyColour))) |
//   //   (orthogonal &
//   //     (cache?.rook ?? board.getBitboard(PIECE_TYPES.Rook | enemyColour))) |
//   //   ((diagonal | orthogonal) &
//   //     (cache?.queen ?? board.getBitboard(PIECE_TYPES.Queen | enemyColour)));
//
//   // attacks |=
//   //   KING_ATTACKS[square]! &
//   //   (cache?.king ?? board.getBitboard(PIECE_TYPES.King | enemyColour));
//
//   return false;
//   // return attacks !== 0n;
// }
