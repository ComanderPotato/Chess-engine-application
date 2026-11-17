import { Board } from "../../board/board.chess.js";
import { Bitboard, ReadonlyBitboards } from "../../board/types.chess.js";
import {
  hasDiagonalMovement,
  hasOrthogonalMovement,
  isWhite,
  normaliseColour,
} from "../../piece/piece.chess.js";
import { Piece, PieceColour, PieceProperty } from "../../piece/piece.types.js";
import { clearBit, isBitSet } from "../../utils/bit.utils.js";
import {
  getLSBIndex,
  clearLSB,
  squareToBB,
  AND,
  equals,
  OR,
  NOT,
  OREQ,
  ANDEQ,
} from "../../utils/bitboard.utils.js";
import { computeIndex } from "../../utils/magic.utils.js";
import { toSquare } from "../../utils/square.utils.js";
import { Move } from "./move.types.js";
import { PIECE_PROPERTIES } from "../../piece/piece.constants.js";
import * as AttackTables from "../attack/attack.tables.js";
import * as MoveUtils from "../../utils/move.utils.js";
import * as MoveChess from "./move.chess.js";
import * as MoveConstants from "./move.constants.js";
import { filterPinnedPieceMovement } from "../attack/attack.queries.js";
import { Timer } from "../../debug/timer.debug.js";
import {
  BOARD_MASK,
  FIRST_TO_LAST_RANK_SHIFT,
  RANK_MASKS,
  RANKS,
} from "../../board/board.constants.js";
import { shiftLeft, shiftNorth, shiftSouth } from "./move.bitboard.js";
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
  return AND(shiftNorth(whitePawns), empty);
}
export function blackSinglePush(
  blackPawns: Bitboard,
  empty: Bitboard,
): Bitboard {
  return AND(shiftSouth(blackPawns), empty);
}
export function whiteDoublePush(
  whitePawns: Bitboard,
  empty: Bitboard,
): Bitboard {
  const rank4 = RANK_MASKS[RANKS.FOURTH]!;
  const singlePush = whiteSinglePush(whitePawns, empty);
  return AND(AND(shiftNorth(singlePush), empty), rank4);
}
export function blackDoublePush(
  blackPawns: Bitboard,
  empty: Bitboard,
): Bitboard {
  const rank5 = RANK_MASKS[RANKS.FIFTH]!;
  const singlePush = blackSinglePush(blackPawns, empty);
  return AND(AND(shiftSouth(singlePush), empty), rank5);
}

export const PAWN_PUSH_GENERATORS = [
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
  return OR(
    singlePush!(pawnBoard, NOT(occupancy)),
    doublePush!(pawnBoard, NOT(occupancy)),
  );
}
export function generatePawnMoves(
  board: Board,
  pieceBoard: Bitboard,
  side: PieceColour,
  pushMask: Bitboard,
  captureMask: Bitboard,
  pinnedPieces: Bitboard,
  checkers: Bitboard,
  moves: Move[],
): void {
  if (equals(pieceBoard, [0, 0]) || equals(OR(pushMask, captureMask), [0, 0]))
    return;
  const colourIdx = normaliseColour(side);
  const attackTable = AttackTables.PAWN_ATTACKS[colourIdx]!;

  const pawnForwardMoves = generatePawnMoveBoard(
    pieceBoard,
    board.occupancy,
    colourIdx,
  );
  const shiftDirection = PAWN_SHIFT_DIRECTIONS[colourIdx]!;
  const enPassant: Bitboard = board.enPassant
    ? squareToBB(board.enPassant)
    : [0, 0];

  while (!equals(pieceBoard, [0, 0])) {
    const from = getLSBIndex(pieceBoard)!;
    pieceBoard = clearBit(pieceBoard, from);
    const fromBit = squareToBB(from);

    const singlePush = AND(shiftDirection(fromBit), pawnForwardMoves);

    const forwardMoves = OR(
      singlePush,
      ANDEQ(shiftDirection(singlePush), pawnForwardMoves),
    );
    const attackMoves = attackTable[from]!;

    let targets = OR(
      AND(forwardMoves, pushMask),
      // AND(attackMoves, OR(captureMask, enPassant)),
      AND(attackMoves, captureMask),
    );

    if (isBitSet(pinnedPieces, from)) {
      targets = AND(targets, filterPinnedPieceMovement(board, checkers, from));
    }

    while (!equals(targets, [0, 0])) {
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
  while (!equals(pieceBoard, [0, 0])) {
    const from = getLSBIndex(pieceBoard)!;
    pieceBoard = clearBit(pieceBoard, from);
    if (isBitSet(pinnedPieces, from)) {
      continue;
    }

    let targets = table[from]!;

    targets = AND(targets, targetMask);

    while (!equals(targets, [0, 0])) {
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
  if (equals(pieceBoard, [0, 0]) || equals(targetMask, [0, 0])) return;
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
  if (equals(pieceBoard, [0, 0]) || equals(targetMask, [0, 0])) return;
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
  checkers: Bitboard,
  moves: Move[],
): void {
  if (equals(pieceBoard, [0, 0]) || equals(targetSquares, [0, 0])) return;
  generateDiagonalMoves(
    board,
    pieceBoard,
    occupancy,
    targetSquares,
    pinnedPieces,
    checkers,
    moves,
  );
}
function generateRookMoves(
  board: Board,
  pieceBoard: Bitboard,
  occupancy: Bitboard,
  targetSquares: Bitboard,
  pinnedPieces: Bitboard,
  checkers: Bitboard,
  moves: Move[],
): void {
  if (equals(pieceBoard, [0, 0]) || equals(targetSquares, [0, 0])) return;
  generateOrthogonalMoves(
    board,
    pieceBoard,
    occupancy,
    targetSquares,
    pinnedPieces,
    checkers,
    moves,
  );
}

function generateDiagonalMoves(
  board: Board,
  pieceBoard: Bitboard,
  occupancy: Bitboard,
  targetSquares: Bitboard,
  pinnedPieces: Bitboard,
  checkers: Bitboard,
  moves: Move[],
): void {
  generateSlidingMoves(
    board,
    pieceBoard,
    occupancy,
    targetSquares,
    pinnedPieces,
    checkers,
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
  checkers: Bitboard,
  moves: Move[],
): void {
  generateSlidingMoves(
    board,
    pieceBoard,
    occupancy,
    targetSquares,
    pinnedPieces,
    checkers,
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
  checkers: Bitboard,
  moves: Move[],
): void {
  if (equals(pieceBoard, [0, 0]) || equals(targetSquares, [0, 0])) return;
  generateOrthogonalMoves(
    board,
    [...pieceBoard],
    occupancy,
    targetSquares,
    pinnedPieces,
    checkers,
    moves,
  );
  generateDiagonalMoves(
    board,
    [...pieceBoard],
    occupancy,
    targetSquares,
    pinnedPieces,
    checkers,
    moves,
  );
}
function generateSlidingMoves(
  board: Board,
  pieceBoard: Bitboard,
  occupancy: Bitboard,
  targetSquares: Bitboard,
  pinnedPieces: Bitboard,
  checkers: Bitboard,
  moves: Move[],
  tables: AttackTables.SlidingTables,
): void {
  if (equals(targetSquares, [0, 0])) return;
  while (!equals(pieceBoard, [0, 0])) {
    const from = getLSBIndex(pieceBoard)!;

    pieceBoard = clearBit(pieceBoard, from);

    const blockerConfig = AND(tables.MASKS[from]!, occupancy);

    const index = computeIndex(
      blockerConfig,
      tables.MAGICS[from]!,
      tables.SHIFTS[from]!,
    );

    let targets = tables.ATTACKS[from]![index]!;

    targets = AND(targets, targetSquares);
    if (isBitSet(pinnedPieces, from))
      targets = AND(targets, filterPinnedPieceMovement(board, checkers, from));

    while (!equals(targets, [0, 0])) {
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
    AND(board.occupancy, NOT(board.getKing(board.activeColour))),
  );
}
export function generatePseudoLegalMoves(
  board: Board,
  moveCache: MoveCache,
): Move[] {
  const moves: Move[] = [];
  const activeColour = board.activeColour;
  const targetMask = OREQ(moveCache.pushMask, moveCache.captureMask);
  if (moveCache.numCheckers < 2) {
    generatePawnMoves(
      board,
      board.getPawns(activeColour),
      activeColour,
      moveCache.pushMask,
      OREQ(moveCache.captureMask, moveCache.enPassantBoard),
      moveCache.pinnedPieces,
      moveCache.checkers,
      moves,
    );
    generateKnightMoves(
      board,
      board.getKnights(activeColour),
      targetMask,
      moveCache.pinnedPieces,
      moves,
    );
    generateBishopMoves(
      board,
      board.getBishops(activeColour),
      moveCache.occupancy,
      targetMask,
      moveCache.pinnedPieces,
      moveCache.checkers,
      moves,
    );
    generateRookMoves(
      board,
      board.getRooks(activeColour),
      moveCache.occupancy,
      targetMask,
      moveCache.pinnedPieces,
      moveCache.checkers,
      moves,
    );
    generateQueenMoves(
      board,
      board.getQueens(activeColour),
      moveCache.occupancy,
      targetMask,
      moveCache.pinnedPieces,
      moveCache.checkers,
      moves,
    );
    if (moveCache.numCheckers === 0) {
      moveCache.numCheckers === 0 &&
        generateCastlingMoves(
          board,
          activeColour,
          moveCache.opponentAttackMask,
          moves,
        );
    }
  }
  generateKingMoves(
    board,
    board.getKing(activeColour),
    AND(
      NOT(moveCache.activeOccupancy),
      AND(NOT(moveCache.opponentAttackMask), BOARD_MASK),
    ),
    moveCache.pinnedPieces,
    moves,
  );
  return moves;
}
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
    : shiftLeft(
        MoveConstants.KING_SIDE_CASTLING_CHECK_MASK,
        FIRST_TO_LAST_RANK_SHIFT,
      );
  const kingSideOccupancyMask = isWhite(activeColour)
    ? MoveConstants.KING_SIDE_CASTLING_OCCUPANCY_MASK
    : shiftLeft(
        MoveConstants.KING_SIDE_CASTLING_OCCUPANCY_MASK,
        FIRST_TO_LAST_RANK_SHIFT,
      );
  return (
    equals(AND(enemyAttacks, kingSideCheckMask), [0, 0]) &&
    equals(AND(board.occupancy, kingSideOccupancyMask), [0, 0])
  );
}
function canQueenSideCastle(
  board: Board,
  activeColour: PieceColour,
  enemyAttacks: Bitboard,
): boolean {
  let queenSideCheckMask = isWhite(activeColour)
    ? MoveConstants.QUEEN_SIDE_CASTLING_CHECK_MASK
    : shiftLeft(
        MoveConstants.QUEEN_SIDE_CASTLING_CHECK_MASK,
        FIRST_TO_LAST_RANK_SHIFT,
      );
  const queenSideOccupancyMask = isWhite(activeColour)
    ? MoveConstants.QUEEN_SIDE_CASTLING_OCCUPANCY_MASK
    : shiftLeft(
        MoveConstants.QUEEN_SIDE_CASTLING_OCCUPANCY_MASK,
        FIRST_TO_LAST_RANK_SHIFT,
      );
  return (
    equals(AND(enemyAttacks, queenSideCheckMask), [0, 0]) &&
    equals(AND(board.occupancy, queenSideOccupancyMask), [0, 0])
  );
}

// const moveCacheTimer = new Timer("Move cache timer");
export function generateLegalMoves(
  board: Board,
  activeColour: PieceColour = board.activeColour,
): Move[] {
  // const legalMoves: Move[] = [];
  const moveCache = getMoveCache(board);

  return generatePseudoLegalMoves(board, moveCache);
  // const pseudoLegalMoves = generatePseudoLegalMoves(board, moveCache);
  //
  // for (const move of pseudoLegalMoves) {
  //   MoveMake.makeMove(board, move);
  //   legalMoves.push(move);
  //   MoveMake.unmakeMove(board);
  // }
  // return legalMoves;
}
