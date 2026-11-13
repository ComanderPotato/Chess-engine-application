import { Board } from "../../board/board.chess.js";
import { FULL_BOARD_MASK } from "../../board/board.constants.js";
import { Bitboard, Square } from "../../board/types.chess.js";
import { getEnemyColour, isSlidingPiece } from "../../piece/piece.chess.js";
import { PieceColour } from "../../piece/piece.types.js";
import {
  popCount,
  getLSBIndex,
  squareToBB,
  OR,
  AND,
  NOT,
  equals,
} from "../../utils/bitboard.utils.js";
import { toSquare } from "../../utils/square.utils.js";
import { generateEnemyAttacks } from "../attack/attack.generators.js";
import {
  filterEnpassant,
  generateAttacksOnSquare,
  queryPinnedPieces,
} from "../attack/attack.queries.js";
import { BETWEEN } from "../attack/attack.tables.js";

const cacheStack: MoveCache[] = [];
// let currentCache: MoveCache | null = null;
// let previousCache: MoveCache | null = null;

function pushCache(moveCache: MoveCache): void {
  cacheStack.push(moveCache);
}
function popCache(): void {
  cacheStack.pop();
}
export interface MoveCache {
  activeKingSquare: Square;
  activeOccupancy: Bitboard;
  opponentOccupancy: Bitboard;
  occupancy: Bitboard;
  opponentAttackMask: Bitboard;
  enPassant: Square | null;
  captureMask: Bitboard;
  pushMask: Bitboard;
  pinnedPieces: Bitboard;
  checkRay: Bitboard;
  checkers: Bitboard;
  numCheckers: number;
  enPassantBoard: Bitboard;
}

export let cacheCount = 0;
// export function getMoveCache(
//   board: Board,
//   activeColour: PieceColour = board.activeColour,
// ): MoveCache {
//   cacheCount++;
//   const activeKingSquare = board.getKingSquare(activeColour);
//   const activeOccupancy = board.getFriendlyOccupancyFor(activeColour);
//   const opponentOccupancy = board.getEnemyOccupancyFor(activeColour);
//   const occupancy = OR(activeOccupancy, opponentOccupancy);
//   const targetSquares = NOT(AND(activeOccupancy, FULL_BOARD_MASK));
//
//   let captureMask = opponentOccupancy;
//   let pushMask = NOT(occupancy);
//
//   const a = squareToBB(activeKingSquare);
//   const opponentAttackMask = generateEnemyAttacks(
//     board,
//     AND(occupancy, NOT(a)),
//     opponentOccupancy,
//   );
//   const checkers = generateAttacksOnSquare(
//     board,
//     activeKingSquare,
//     getEnemyColour(activeColour),
//   );
//   const numCheckers = popCount(checkers);
//
//   let pinnedPieces = queryPinnedPieces(board, occupancy);
//   if (numCheckers === 1) {
//     const checkerSquare = getLSBIndex(checkers)!;
//     captureMask = checkers;
//     if (isSlidingPiece(board.pieceAt(toSquare(checkerSquare)))) {
//       pushMask = BETWEEN[activeKingSquare]![checkerSquare]!;
//     } else {
//       pushMask = [0, 0];
//     }
//   }
//   // captureMask = filterEnpassant(board, captureMask);
//
//   return {
//     activeKingSquare,
//     activeOccupancy,
//     opponentOccupancy,
//     occupancy: OR(activeOccupancy, opponentOccupancy),
//     opponentAttackMask,
//     enPassant: board.enPassant,
//     captureMask,
//     pushMask,
//     pinnedPieces,
//     checkRay: [0, 0],
//     checkers: checkers,
//     numCheckers,
//     enPassantBoard: filterEnpassant(board, targetSquares),
//   };
// }
export function getMoveCache(
  board: Board,
  activeColour: PieceColour = board.activeColour,
): MoveCache {
  cacheCount++;
  const activeKingSquare = board.getKingSquare(activeColour);
  const activeOccupancy = board.getFriendlyOccupancyFor(activeColour);
  const opponentOccupancy = board.getEnemyOccupancyFor(activeColour);
  const occupancy = OR(activeOccupancy, opponentOccupancy);
  const targetSquares = NOT(AND(activeOccupancy, FULL_BOARD_MASK));

  let captureMask = opponentOccupancy;
  let pushMask = NOT(occupancy);

  const activeKingBoard = squareToBB(activeKingSquare);
  const opponentAttackMask = generateEnemyAttacks(
    board,
    AND(occupancy, NOT(activeKingBoard)),
    opponentOccupancy,
  );

  let checkers: Bitboard = [0, 0];
  let numCheckers = 0;
  const pinnedPieces = queryPinnedPieces(board, occupancy);
  if (!equals(AND(opponentAttackMask, activeKingBoard), [0, 0])) {
    checkers = generateAttacksOnSquare(
      board,
      activeKingSquare,
      getEnemyColour(activeColour),
    );
    numCheckers = popCount(checkers);

    if (numCheckers === 1) {
      const checkerSquare = getLSBIndex(checkers)!;
      captureMask = checkers;
      if (isSlidingPiece(board.pieceAt(toSquare(checkerSquare)))) {
        pushMask = BETWEEN[activeKingSquare]![checkerSquare]!;
      } else {
        pushMask = [0, 0];
      }
    }
  }
  // captureMask = filterEnpassant(board, captureMask);

  return {
    activeKingSquare,
    activeOccupancy,
    opponentOccupancy,
    occupancy: OR(activeOccupancy, opponentOccupancy),
    opponentAttackMask,
    enPassant: board.enPassant,
    captureMask,
    pushMask,
    pinnedPieces,
    checkRay: [0, 0],
    checkers: checkers,
    numCheckers,
    enPassantBoard: filterEnpassant(board, targetSquares),
  };
}
