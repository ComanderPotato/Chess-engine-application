import { Board } from "../../board/board.chess.js";
import { BOARD_MASK, FULL_BOARD_MASK } from "../../board/board.constants.js";
import { Bitboard, Square } from "../../board/types.chess.js";
import { printBitboard } from "../../debug/printer.chess.js";
import { getEnemyColour, isSlidingPiece } from "../../piece/piece.chess.js";
import { PieceColour } from "../../piece/piece.types.js";
import { isBitSet64 } from "../../utils/bit.utils.js";
import {
  popCount,
  getLSBIndex,
  squareToBB,
} from "../../utils/bitboard.utils.js";
import { squareToCoord } from "../../utils/coord.utils.js";
import { toSquare } from "../../utils/square.utils.js";
import { generateEnemyAttacks } from "../attack/attack.generators.js";
import {
  EnemyBitboards,
  generateAttacksOnSquare,
  queryPinnedPieces,
} from "../attack/attack.queries.js";
import { computeRay } from "../attack/attack.rays.js";
import { BETWEEN } from "../attack/attack.tables.js";
import { Move } from "./move.types.js";

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
}

export let cacheCount = 0;
export function getMoveCache(
  board: Board,
  activeColour: PieceColour = board.activeColour,
): MoveCache {
  cacheCount++;
  const activeKingSquare = board.getKingSquare(activeColour);
  const activeOccupancy = board.getFriendlyOccupancyFor(activeColour);
  const opponentOccupancy = board.getEnemyOccupancyFor(activeColour);
  const occupancy = activeOccupancy | opponentOccupancy;
  const targetSquares = ~activeOccupancy & FULL_BOARD_MASK;

  let captureMask = targetSquares;
  let pushMask = ~occupancy;

  const opponentAttackMask = generateEnemyAttacks(
    board,
    board.occupancy & ~squareToBB(activeKingSquare),
    0n,
  );
  const checkers = generateAttacksOnSquare(
    board,
    activeKingSquare,
    getEnemyColour(activeColour),
  );
  const numCheckers = popCount(checkers);

  let pinnedPieces = queryPinnedPieces(board, occupancy);
  if (numCheckers === 1) {
    const checkerSquare = getLSBIndex(checkers)!;
    captureMask = checkers;
    if (isSlidingPiece(board.pieceAt(checkerSquare))) {
      pushMask = BETWEEN[activeKingSquare]![checkerSquare]!;
    } else {
      pushMask = 0n;
    }
  }
  // const opponentAttackMask = generateEnemyAttacks(board);
  // const pinnedPieces = queryPinnedPieces(board, occupancy);
  //
  // let checkers = 0n;
  //
  // let numCheckers = 0;
  //
  // if (isBitSet64(opponentAttackMask, activeKingSquare)) {
  //   checkers = generateAttacksOnSquare(
  //     board,
  //     board.getKingSquare(activeColour),
  //     getEnemyColour(activeColour),
  //   );
  //   const numCheckers = popCount(checkers);
  //
  //   if (numCheckers == 1) {
  //     captureMask = checkers;
  //     const pieceIdx = getLSBIndex(checkers)!;
  //     if (isSlidingPiece(board.pieceAt(pieceIdx))) {
  //       // pushMask = computeRay(toSquare(pieceIdx), activeKingSquare);
  //       pushMask = BETWEEN[activeKingSquare]![pieceIdx]!;
  //     } else {
  //       pushMask = 0n;
  //     }
  //   }
  // }

  return {
    activeKingSquare,
    activeOccupancy,
    opponentOccupancy,
    occupancy: activeOccupancy | opponentOccupancy,
    opponentAttackMask,
    enPassant: board.enPassant,
    captureMask,
    pushMask,
    pinnedPieces,
    checkRay: 0n,
    checkers: checkers,
    numCheckers,
  };
}
