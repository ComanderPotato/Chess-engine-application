import { Board } from "../../board/board.chess.js";
import { Bitboard, ReadonlyBitboards } from "../../board/types.chess.js";
import {
  hasDiagonalMovement,
  hasOrthogonalMovement,
  isWhite,
  normaliseColour,
} from "../../piece/piece.chess.js";
import { Piece, PieceColour, PieceProperty } from "../../piece/piece.types.js";
import { clearBit64, isBitSet64 } from "../../utils/bit.utils.js";
import {
  getLSBIndex,
  clearLSB,
  squareToBB,
} from "../../utils/bitboard.utils.js";
import { computeIndex } from "../../utils/magic.utils.js";
import { toSquare } from "../../utils/square.utils.js";
import { Move } from "./move.types.js";
import { PIECE_PROPERTIES } from "../../piece/piece.constants.js";
import * as AttackTables from "../attack/attack.tables.js";
import * as MoveUtils from "../../utils/move.utils.js";
import * as MoveChess from "./move.chess.js";
import * as MoveMake from "./move.make.js";
import * as MoveConstants from "./move.constants.js";
import { filterPinnedPieceMovement } from "../attack/attack.queries.js";
import { Timer } from "../../debug/timer.debug.js";
import {
  BOARD_MASK,
  FIRST_TO_LAST_RANK_BB,
  RANK_MASKS,
  RANKS,
} from "../../board/board.constants.js";
import { shiftNorth, shiftSouth } from "./move.bitboard.js";
import { generateEnemyAttacks } from "../attack/attack.generators.js";
import { getMoveCache, MoveCache } from "./move.cache.js";

// export const pseudoTimer = new Timer("Pseudo legal");
// export const makeMoveTimer = new Timer("Make move");
// export const unmakeMoveTimer = new Timer("Unmake move");
// export const isSquareAttackedTimer = new Timer("Is square attacked");

export function whiteSinglePush(
  whitePawns: Bitboard,
  empty: Bitboard,
): Bitboard {
  return shiftNorth(whitePawns) & empty;
}
export function blackSinglePush(
  blackPawns: Bitboard,
  empty: Bitboard,
): Bitboard {
  return shiftSouth(blackPawns) & empty;
}
export function whiteDoublePush(
  whitePawns: Bitboard,
  empty: Bitboard,
): Bitboard {
  const rank4 = RANK_MASKS[RANKS.FOURTH]!;
  const singlePush = whiteSinglePush(whitePawns, empty);
  return shiftNorth(singlePush) & empty & rank4;
}
export function blackDoublePush(
  blackPawns: Bitboard,
  empty: Bitboard,
): Bitboard {
  const rank5 = RANK_MASKS[RANKS.FIFTH]!;
  const singlePush = blackSinglePush(blackPawns, empty);
  return shiftSouth(singlePush) & empty & rank5;
}

const PAWN_PUSH_GENERATORS = [
  [whiteSinglePush, whiteDoublePush],
  [blackSinglePush, blackDoublePush],
];
const PAWN_SHIFT_DIRECTIONS = [shiftNorth, shiftSouth];
export function generatePawnMoveBoard(
  pawnBoard: Bitboard,
  occupancy: Bitboard,
  colourIdx: number,
): Bitboard {
  const [singlePush, doublePush] = PAWN_PUSH_GENERATORS[colourIdx]!;
  return (
    singlePush!(pawnBoard, ~occupancy) | doublePush!(pawnBoard, ~occupancy)
  );
}
export function generatePawnMoves(
  board: Board,
  pieceBoard: Bitboard,
  side: PieceColour,
  pushMask: Bitboard,
  captureMask: Bitboard,
  pinnedPieces: Bitboard,
  moves: Move[],
): void {
  if (pieceBoard === 0n || (pushMask | captureMask) === 0n) return;
  const colourIdx = normaliseColour(side);
  const attackTable = AttackTables.PAWN_ATTACKS[colourIdx]!;
  const pawnForwardMoves = generatePawnMoveBoard(
    pieceBoard,
    board.occupancy,
    colourIdx,
  );
  const shiftDirection = PAWN_SHIFT_DIRECTIONS[colourIdx]!;
  const enPassant = board.enPassant ? squareToBB(board.enPassant) : 0n;

  while (pieceBoard !== 0n) {
    const from = getLSBIndex(pieceBoard)!;
    pieceBoard = clearBit64(pieceBoard, from);
    const fromBit = squareToBB(from);

    const singlePush = shiftDirection(fromBit) & pawnForwardMoves;

    const forwardMoves =
      singlePush | (shiftDirection(singlePush) & pawnForwardMoves);
    const attackMoves = attackTable[from]!;

    let targets =
      (forwardMoves & pushMask) | (attackMoves & (captureMask | enPassant));

    if (isBitSet64(pinnedPieces, from))
      targets &= filterPinnedPieceMovement(board, from);

    while (targets !== 0n) {
      const to = getLSBIndex(targets)!;
      targets = clearLSB(targets);
      MoveUtils.encodePawnMove({ board, from, to, moves });
    }
  }
}
function generateTableMoves(
  board: Board,
  pieceBoard: Bitboard,
  targetMask: Bitboard,
  pinnedPieces: Bitboard,
  moves: Move[],
  table: ReadonlyBitboards,
): void {
  while (pieceBoard !== 0n) {
    const from = getLSBIndex(pieceBoard)!;
    pieceBoard = clearBit64(pieceBoard, from);
    if (isBitSet64(pinnedPieces, from)) {
      continue;
    }

    let targets = table[from]!;

    targets &= targetMask;

    while (targets !== 0n) {
      const to = getLSBIndex(targets)!;
      targets = clearLSB(targets);
      MoveUtils.encodeStandardMove({ board, from, to, moves });
    }
  }
}
function generateKnightMoves(
  board: Board,
  pieceBoard: Bitboard,
  targetMask: Bitboard,
  pinnedPieces: Bitboard,
  moves: Move[],
): void {
  if (pieceBoard === 0n || targetMask === 0n) return;
  generateTableMoves(
    board,
    pieceBoard,
    targetMask,
    pinnedPieces,
    moves,
    AttackTables.KNIGHT_ATTACKS,
  );
}
function generateKingMoves(
  board: Board,
  pieceBoard: Bitboard,
  targetMask: Bitboard,
  pinnedPieces: Bitboard,
  moves: Move[],
): void {
  if (pieceBoard === 0n || targetMask === 0n) return;
  generateTableMoves(
    board,
    pieceBoard,
    targetMask,
    pinnedPieces,
    moves,
    AttackTables.KING_ATTACKS,
  );
}

export function generateBishopMoves(
  board: Board,
  pieceBoard: Bitboard,
  occupancy: Bitboard,
  targetSquares: Bitboard,
  pinnedPieces: Bitboard,
  moves: Move[],
): void {
  if (pieceBoard === 0n || targetSquares === 0n) return;
  generateDiagonalMoves(
    board,
    pieceBoard,
    occupancy,
    targetSquares,
    pinnedPieces,
    moves,
  );
}
function generateRookMoves(
  board: Board,
  pieceBoard: Bitboard,
  occupancy: Bitboard,
  targetSquares: Bitboard,
  pinnedPieces: Bitboard,
  moves: Move[],
): void {
  if (pieceBoard === 0n || targetSquares === 0n) return;
  generateOrthogonalMoves(
    board,
    pieceBoard,
    occupancy,
    targetSquares,
    pinnedPieces,
    moves,
  );
}

function generateDiagonalMoves(
  board: Board,
  pieceBoard: Bitboard,
  occupancy: Bitboard,
  targetSquares: Bitboard,
  pinnedPieces: Bitboard,
  moves: Move[],
): void {
  if (pieceBoard === 0n || targetSquares === 0n) return;
  generateSlidingMoves(
    board,
    pieceBoard,
    occupancy,
    targetSquares,
    pinnedPieces,
    moves,
    AttackTables.DIAGONAL_TABLES,
  );
}
function generateOrthogonalMoves(
  board: Board,
  pieceBoard: Bitboard,
  occupancy: Bitboard,
  targetSquares: Bitboard,
  pinnedPieces: Bitboard,
  moves: Move[],
): void {
  if (pieceBoard === 0n || targetSquares === 0n) return;
  generateSlidingMoves(
    board,
    pieceBoard,
    occupancy,
    targetSquares,
    pinnedPieces,
    moves,
    AttackTables.ORTHOGONAL_TABLES,
  );
}
function generateQueenMoves(
  board: Board,
  pieceBoard: Bitboard,
  occupancy: Bitboard,
  targetSquares: Bitboard,
  pinnedPieces: Bitboard,
  moves: Move[],
): void {
  if (pieceBoard === 0n || targetSquares === 0n) return;
  generateOrthogonalMoves(
    board,
    pieceBoard,
    occupancy,
    targetSquares,
    pinnedPieces,
    moves,
  );
  generateDiagonalMoves(
    board,
    pieceBoard,
    occupancy,
    targetSquares,
    pinnedPieces,
    moves,
  );
}
function generateSlidingMoves(
  board: Board,
  pieceBoard: Bitboard,
  occupancy: Bitboard,
  targetSquares: Bitboard,
  pinnedPieces: Bitboard,
  moves: Move[],
  tables: AttackTables.SlidingTables,
): void {
  if (targetSquares === 0n) return;
  while (pieceBoard !== 0n) {
    const from = getLSBIndex(pieceBoard)!;

    pieceBoard = clearBit64(pieceBoard, from);

    const blockerConfig = tables.MASKS[from]! & occupancy;

    const index = computeIndex(
      blockerConfig,
      tables.MAGICS[from]!,
      tables.SHIFTS[from]!,
    );

    let targets = tables.ATTACKS[from]![index]!;

    targets &= targetSquares;
    if (isBitSet64(pinnedPieces, from))
      targets &= filterPinnedPieceMovement(board, from);

    while (targets !== 0n) {
      const to = getLSBIndex(targets)!;
      targets = clearLSB(targets);
      MoveUtils.encodeStandardMove({ board, from, to, moves });
    }
  }
}

// KIWIPETE perft 3
// Elapsed: 348.50 ms
// Elapsed time for Castling: 12.706 ms
// Elapsed time for Pseudo legal: 71.981 ms
// Elapsed time for Make move: 56.056 ms
// Elapsed time for Unmake move: 31.759 ms
// Elapsed time for Is square attacked: 97.450 ms

// Elapsed: 333.35 ms
// Elapsed time for Castling: 13.069 ms
// Elapsed time for Pseudo legal: 69.090 ms
// Elapsed time for Make move: 46.290 ms
// Elapsed time for Unmake move: 33.238 ms
// Elapsed time for Is square attacked: 97.811 ms

// TODO: PLACEHOLDER FRIENDLY KING DANGER SQUARES
function generateKingDangerSquares(board: Board): Bitboard {
  return generateEnemyAttacks(
    board,
    board.occupancy & ~board.getKing(board.activeColour),
  );
}

// export const pawnPseudo = new Timer("Pawn pseudo");
// export const knightPseudo = new Timer("Knight pseudo");
// export const bishopPseudo = new Timer("Bishop pseudo");
// export const rookPseudo = new Timer("Rook pseudo");
// export const queenPseudo = new Timer("Queen pseudo");
// export const kingPseudo = new Timer("King pseudo");
export function generatePseudoLegalMoves(
  board: Board,
  moveCache: MoveCache,
): Move[] {
  const moves: Move[] = [];
  const activeColour = board.activeColour;
  if (moveCache.numCheckers < 2) {
    // pawnPseudo.startTimer();
    generatePawnMoves(
      board,
      board.getPawns(activeColour),
      activeColour,
      moveCache.pushMask,
      moveCache.opponentOccupancy & moveCache.captureMask,
      moveCache.pinnedPieces,
      moves,
    );
    // pawnPseudo.stopTimer();
    // knightPseudo.startTimer();
    generateKnightMoves(
      board,
      board.getKnights(activeColour),
      moveCache.pushMask | moveCache.captureMask,
      moveCache.pinnedPieces,
      moves,
    );
    // knightPseudo.stopTimer();
    // bishopPseudo.startTimer();
    generateBishopMoves(
      board,
      board.getBishops(activeColour),
      moveCache.occupancy,
      moveCache.pushMask | moveCache.captureMask,
      moveCache.pinnedPieces,
      moves,
    );
    // bishopPseudo.stopTimer();
    // rookPseudo.startTimer();
    generateRookMoves(
      board,
      board.getRooks(activeColour),
      moveCache.occupancy,
      moveCache.pushMask | moveCache.captureMask,
      moveCache.pinnedPieces,
      moves,
    );
    // rookPseudo.stopTimer();
    // queenPseudo.startTimer();
    generateQueenMoves(
      board,
      board.getQueens(activeColour),
      moveCache.occupancy,
      moveCache.pushMask | moveCache.captureMask,
      moveCache.pinnedPieces,
      moves,
    );
    // queenPseudo.stopTimer();
    // castlingTimer.startTimer();
    if (moveCache.numCheckers === 0) {
      moveCache.numCheckers === 0 &&
        generateCastlingMoves(
          board,
          activeColour,
          moveCache.opponentAttackMask,
          moves,
        );
    }
    // castlingTimer.stopTimer();
  }
  // kingPseudo.startTimer();
  generateKingMoves(
    board,
    board.getKing(activeColour),
    ~moveCache.activeOccupancy & (~moveCache.opponentAttackMask & BOARD_MASK),
    moveCache.pinnedPieces,
    moves,
  );
  // kingPseudo.stopTimer();
  return moves;
}
// // TODO: PLACEHOLDER

// export function veryPseudo(
//   board: Board,
//   activeColour: PieceColour = board.activeColour,
//   enemyAttacks: Bitboard = 0n,
// ): Move[] {
//   const moves: Move[] = [];
//   const kingSquare = board.getKingSquare(activeColour);
//   const activeOccupancy = board.getFriendlyOccupancyFor(activeColour);
//
//   const enemyOccupancy = board.getEnemyOccupancyFor(activeColour);
//
//   const occupancy = activeOccupancy | enemyOccupancy;
//   const targetMask = ~activeOccupancy;
//
//   let captureMask = targetMask;
//   let pushMask = targetMask;
//
//   const attacksOnKing = generateAttacksOnSquare(
//     board,
//     board.getKingSquare(activeColour),
//     getEnemyColour(activeColour),
//   );
//   const numCheckers = popCount(attacksOnKing);
//
//   if (numCheckers == 1) {
//     captureMask = attacksOnKing;
//     const pieceIdx = getLSBIndex(attacksOnKing)!;
//     if (isSlidingPiece(board.pieceAt(pieceIdx))) {
//       pushMask = AttackTables.BETWEEN[kingSquare]![pieceIdx]!;
//     } else {
//       pushMask = 0n;
//     }
//   }
//
//   if (numCheckers < 2) {
//     generatePawnMoves(
//       board,
//       board.getPawns(activeColour),
//       activeColour,
//       pushMask,
//       enemyOccupancy & captureMask,
//       moves,
//     );
//     generateKnightMoves(
//       board,
//       board.getKnights(activeColour),
//       pushMask | captureMask,
//       moves,
//     );
//     generateBishopMoves(
//       board,
//       board.getBishops(activeColour),
//       occupancy,
//       pushMask | captureMask,
//       moves,
//     );
//     generateRookMoves(
//       board,
//       board.getRooks(activeColour),
//       occupancy,
//       pushMask | captureMask,
//       moves,
//     );
//     generateQueenMoves(
//       board,
//       board.getQueens(activeColour),
//       occupancy,
//       pushMask | captureMask,
//       moves,
//     );
//     numCheckers === 0 &&
//       generateCastlingMoves(board, activeColour, enemyAttacks, moves);
//   }
//   generateKingMoves(board, board.getKing(activeColour), targetMask, moves);
//   // generateCastlingMoves(board, activeColour, enemyAttacks, moves);
//   return moves;
// }
export function canPinnedPieceMove(
  piece: Piece,
  pinnedBy: PieceProperty,
): boolean {
  const canMoveDiagonally =
    pinnedBy === PIECE_PROPERTIES.Diagonal && hasDiagonalMovement(piece);
  const canMoveOrthogonally =
    pinnedBy === PIECE_PROPERTIES.Orthogonal && hasOrthogonalMovement(piece);

  return canMoveDiagonally || canMoveOrthogonally;
}
export const castlingTimer = new Timer("Castling");

function generateCastlingMoves(
  board: Board,
  activeColour: PieceColour,
  enemyAttacks: Bitboard,
  moves: Move[],
): void {
  const { canKingSide, canQueenSide } = isWhite(activeColour)
    ? board.getWhiteCastlingRights()
    : board.getBlackCastlingRights();

  const kingSquare = board.getKingSquare(activeColour);

  if (canKingSide && canKingSideCastle(board, activeColour, enemyAttacks)) {
    moves.push(
      MoveChess.createMove(
        kingSquare,
        toSquare(kingSquare + 2),
        MoveConstants.MOVE_FLAGS.KingCastle,
      ),
    );
  }
  if (canQueenSide && canQueenSideCastle(board, activeColour, enemyAttacks)) {
    moves.push(
      MoveChess.createMove(
        kingSquare,
        toSquare(kingSquare - 2),
        MoveConstants.MOVE_FLAGS.QueenCastle,
      ),
    );
  }
}
function canKingSideCastle(
  board: Board,
  activeColour: PieceColour,
  enemyAttacks: Bitboard,
): boolean {
  // TODO: extract BigInt calc
  let kingSideCheckMask = isWhite(activeColour)
    ? MoveConstants.KING_SIDE_CASTLING_CHECK_MASK
    : MoveConstants.KING_SIDE_CASTLING_CHECK_MASK << FIRST_TO_LAST_RANK_BB;
  const kingSideOccupancyMask = isWhite(activeColour)
    ? MoveConstants.KING_SIDE_CASTLING_OCCUPANCY_MASK
    : MoveConstants.KING_SIDE_CASTLING_OCCUPANCY_MASK << FIRST_TO_LAST_RANK_BB;

  // while (kingSideCheckMask !== 0n) {
  //   const idx = getLSBIndex(kingSideCheckMask)!;
  //   kingSideCheckMask = clearLSB(kingSideCheckMask);
  //   const isAttacked = isSquareAttacked(
  //     board,
  //     idx,
  //     getEnemyColour(activeColour),
  //   );
  //
  //   if (isAttacked) return false;
  // }
  return (
    (enemyAttacks & kingSideCheckMask) === 0n &&
    (board.occupancy & kingSideOccupancyMask) === 0n
  );
}
// r3k2r/p1ppq1b1/bn1Npnp1/3P4/4P3/1pN2Q1p/PPPBBPPP/R3K2R b KQkq - 1 2
function canQueenSideCastle(
  board: Board,
  activeColour: PieceColour,
  enemyAttacks: Bitboard,
): boolean {
  let queenSideCheckMask = isWhite(activeColour)
    ? MoveConstants.QUEEN_SIDE_CASTLING_CHECK_MASK
    : MoveConstants.QUEEN_SIDE_CASTLING_CHECK_MASK << FIRST_TO_LAST_RANK_BB;
  const queenSideOccupancyMask = isWhite(activeColour)
    ? MoveConstants.QUEEN_SIDE_CASTLING_OCCUPANCY_MASK
    : MoveConstants.QUEEN_SIDE_CASTLING_OCCUPANCY_MASK << FIRST_TO_LAST_RANK_BB;

  // while (queenSideCheckMask !== 0n) {
  //   const idx = getLSBIndex(queenSideCheckMask)!;
  //   queenSideCheckMask = clearLSB(queenSideCheckMask);
  //   const isAttacked = isSquareAttacked(
  //     board,
  //     idx,
  //     getEnemyColour(activeColour),
  //   );
  //
  //   if (isAttacked) return false;
  // }
  return (
    (enemyAttacks & queenSideCheckMask) === 0n &&
    (board.occupancy & queenSideOccupancyMask) === 0n
  );
}

// const moveCacheTimer = new Timer("Move cache timer");
export function generateLegalMoves(
  board: Board,
  activeColour: PieceColour = board.activeColour,
): Move[] {
  const legalMoves: Move[] = [];
  // moveCacheTimer.startTimer();
  const moveCache = getMoveCache(board);
  // moveCacheTimer.stopTimer();
  // pseudoTimer.startTimer();
  const pseudoLegalMoves = generatePseudoLegalMoves(board, moveCache);
  // pseudoTimer.stopTimer();

  for (const move of pseudoLegalMoves) {
    // makeMoveTimer.startTimer();
    MoveMake.makeMove(board, move);
    // makeMoveTimer.stopTimer();

    // isSquareAttackedTimer.startTimer();
    // if (
    //   !isSquareAttacked(board, board.getKingSquare(activeColour), enemyColour)
    // ) {
    legalMoves.push(move);
    // }
    // isSquareAttackedTimer.stopTimer();

    // unmakeMoveTimer.startTimer();
    MoveMake.unmakeMove(board);
    // unmakeMoveTimer.stopTimer();
  }
  return legalMoves;
}
