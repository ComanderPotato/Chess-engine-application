import { Board } from "../../board/board.chess.js";
import { Bitboard, ReadonlyBitboards } from "../../board/types.chess.js";
import {
  getColour,
  getEnemyColour,
  getType,
  isSlidingPiece,
  isWhite,
  normaliseColour,
} from "../../piece/piece.chess.js";
import { Piece, PieceColour } from "../../piece/piece.types.js";
import { clearBit64 } from "../../utils/bit.utils.js";
import { getLSBIndex, clearLSB } from "../../utils/bitboard.utils.js";
import { computeIndex } from "../../utils/magic.utils.js";
import { toSquare } from "../../utils/square.utils.js";
import { Move } from "./move.types.js";
import { PIECE_TYPES } from "../../piece/piece.constants.js";
import * as AttackTables from "../attack/attack.tables.js";
import * as MoveUtils from "../../utils/move.utils.js";
import * as MoveChess from "./move.chess.js";
import * as MoveMake from "./move.make.js";
import * as MoveConstants from "./move.constants.js";
import {
  generateAttacksOnSquare,
  getChecksOnKing,
  isSquareAttacked,
} from "../attack/attack.queries.js";
import { Timer } from "../../debug/timer.debug.js";
import { BOARD_MASK, RANK_MASKS, RANKS } from "../../board/board.constants.js";
import { shiftNorth, shiftSouth } from "./move.bitboard.js";
import { computeRay } from "../attack/attack.rays.js";

export const pseudoTimer = new Timer("Pseudo legal");
export const makeMoveTimer = new Timer("Make move");
export const unmakeMoveTimer = new Timer("Unmake move");
export const isSquareAttackedTimer = new Timer("Is square attacked");

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
export function generatePawnMove(
  pawns: Bitboard,
  empty: Bitboard,
  side: PieceColour,
): Bitboard {
  const [single, double] = isWhite(side)
    ? [whiteSinglePush, whiteDoublePush]
    : [blackSinglePush, blackDoublePush];

  return single(pawns, empty) | double(pawns, empty);
}

// TODO: BENCHMARK ternary vs stored array
const PAWN_CB = [
  [whiteSinglePush, whiteDoublePush],
  [blackSinglePush, blackDoublePush],
];
export function generatePawnMoveBoard(
  board: Board,
  colour: PieceColour,
): Bitboard {
  const pawnBoard = board.getBitboard(PIECE_TYPES.Pawn | colour);
  // const push = PAWN_CB[normaliseColour(colour)]!;
  const [singlePush, doublePush] = isWhite(colour)
    ? [whiteSinglePush, whiteDoublePush]
    : [blackSinglePush, blackDoublePush];
  // return (
  //   push[0]!(pawnBoard, ~board.occupancy) |
  //   push[1]!(pawnBoard, ~board.occupancy)
  // );
  return (
    singlePush(pawnBoard, ~board.occupancy) |
    doublePush(pawnBoard, ~board.occupancy)
  );
}
export function tempgeneratePawnMoves(
  board: Board,
  pieceBoard: Bitboard,
  side: PieceColour,
  enemyOccupancy: Bitboard,
  pushMask: Bitboard,
  captureMask: Bitboard,
  moves: Move[],
): void {
  if (pieceBoard === 0n) return;
  const attackTable = AttackTables.PAWN_ATTACKS[normaliseColour(side)]!;
  const pawnForwardMoves = generatePawnMoveBoard(board, side);
  const shiftDirection = isWhite(side) ? shiftNorth : shiftSouth;
  const enPassant = board.enPassant ? 1n << BigInt(board.enPassant) : 0n;

  while (pieceBoard !== 0n) {
    const from = getLSBIndex(pieceBoard)!;
    pieceBoard = clearBit64(pieceBoard, from);
    const fromBit = 1n << BigInt(from);

    const singlePush = shiftDirection(fromBit) & pawnForwardMoves;

    const forwardMoves =
      singlePush | (shiftDirection(singlePush) & pawnForwardMoves);
    const attackMoves = attackTable[from]! & (enemyOccupancy | enPassant);

    let targets = (forwardMoves & pushMask) | (attackMoves & captureMask);

    while (targets !== 0n) {
      const to = getLSBIndex(targets)!;
      targets = clearLSB(targets);
      MoveUtils.encodePawnMove({ board, from, to, moves });
    }
  }
}
export function generatePawnMoves(
  board: Board,
  enemyOccupancy: Bitboard,
  side: PieceColour,
  moves: Move[],
): void {
  let pawnBoard = board.getBitboard(PIECE_TYPES.Pawn | side);
  const attackTable = AttackTables.PAWN_ATTACKS[normaliseColour(side)]!;
  const pawnForwardMoves = generatePawnMoveBoard(board, side);
  const shiftDirection = isWhite(side) ? shiftNorth : shiftSouth;
  const enPassant = board.enPassant ? 1n << BigInt(board.enPassant) : 0n;

  while (pawnBoard !== 0n) {
    const from = getLSBIndex(pawnBoard)!;
    pawnBoard = clearBit64(pawnBoard, from);
    const fromBit = 1n << BigInt(from);

    const singlePush = shiftDirection(fromBit) & pawnForwardMoves;

    const forwardMoves =
      singlePush | (shiftDirection(singlePush) & pawnForwardMoves);
    const attackMoves = attackTable[from]! & (enemyOccupancy | enPassant);

    let targets = forwardMoves | attackMoves;

    while (targets !== 0n) {
      const to = getLSBIndex(targets)!;
      targets = clearLSB(targets);
      MoveUtils.encodePawnMove({ board, from, to, moves });
    }
  }
}
function tempgenerateTableMoves(
  board: Board,
  pieceBoard: Bitboard,
  empty: Bitboard,
  pushMask: Bitboard,
  captureMask: Bitboard,
  moves: Move[],
  table: ReadonlyBitboards,
): void {
  let mask = 0n;
  while (pieceBoard !== 0n) {
    const from = getLSBIndex(pieceBoard)!;
    pieceBoard = clearBit64(pieceBoard, from);

    let targets = table[from]!;

    targets &= empty & pushMask & captureMask;
    mask |= targets;

    while (targets !== 0n) {
      const to = getLSBIndex(targets)!;
      targets = clearLSB(targets);
      MoveUtils.encodeStandardMove({ board, from, to, moves });
    }
  }
}
function generateTableMoves(
  board: Board,
  empty: Bitboard,
  piece: Piece,
  moves: Move[],
  table: ReadonlyBitboards,
): void {
  let pieceBoard = board.getBitboard(piece);
  let mask = 0n;
  while (pieceBoard !== 0n) {
    const from = getLSBIndex(pieceBoard)!;
    pieceBoard = clearBit64(pieceBoard, from);

    let targets = table[from]!;

    targets &= empty;
    mask |= targets;

    while (targets !== 0n) {
      const to = getLSBIndex(targets)!;
      targets = clearLSB(targets);
      MoveUtils.encodeStandardMove({ board, from, to, moves });
    }
    if (getType(piece) === PIECE_TYPES.King) {
      generateCastlingMoves(board, getColour(piece), moves);
    }
  }
}
function tempgenerateKnightMoves(
  board: Board,
  pieceBoard: Bitboard,
  empty: Bitboard,
  pushMask: Bitboard,
  captureMask: Bitboard,
  moves: Move[],
): void {
  tempgenerateTableMoves(
    board,
    pieceBoard,
    empty,
    pushMask,
    captureMask,
    moves,
    AttackTables.KNIGHT_ATTACKS,
  );
}
function generateKnightMoves(
  board: Board,
  empty: Bitboard,
  side: PieceColour,
  moves: Move[],
): void {
  generateTableMoves(
    board,
    empty,
    PIECE_TYPES.Knight | side,
    moves,
    AttackTables.KNIGHT_ATTACKS,
  );
}
function tempgenerateKingMoves(
  board: Board,
  pieceBoard: Bitboard,
  empty: Bitboard,
  pushMask: Bitboard,
  captureMask: Bitboard,
  moves: Move[],
): void {
  tempgenerateTableMoves(
    board,
    pieceBoard,
    empty,
    pushMask,
    captureMask,
    moves,
    AttackTables.KING_ATTACKS,
  );
}
function generateKingMoves(
  board: Board,
  empty: Bitboard,
  side: PieceColour,
  moves: Move[],
): void {
  generateTableMoves(
    board,
    empty,
    PIECE_TYPES.King | side,
    moves,
    AttackTables.KING_ATTACKS,
  );
}

function tempgenerateRookMoves(
  board: Board,
  pieceBoard: Bitboard,
  empty: Bitboard,
  occupancy: Bitboard,
  pushMask: Bitboard,
  captureMask: Bitboard,
  moves: Move[],
): void {
  tempgenerateOrthogonalMoves(
    board,
    pieceBoard,
    empty,
    occupancy,
    pushMask,
    captureMask,
    moves,
  );
}

export function tempgenerateBishopMoves(
  board: Board,
  pieceBoard: Bitboard,
  empty: Bitboard,
  pushMask: Bitboard,
  captureMask: Bitboard,
  occupancy: Bitboard,
  moves: Move[],
): void {
  tempgenerateDiagonalMoves(
    board,
    pieceBoard,
    empty,
    occupancy,
    pushMask,
    captureMask,
    moves,
  );
}
function generateRookMoves(
  board: Board,
  empty: Bitboard,
  occupancy: Bitboard,
  side: PieceColour,
  moves: Move[],
): void {
  generateOrthogonalMoves(
    board,
    empty,
    occupancy,
    PIECE_TYPES.Rook | side,
    moves,
  );
}

export function generateBishopMoves(
  board: Board,
  empty: Bitboard,
  occupancy: Bitboard,
  side: PieceColour,
  moves: Move[],
): void {
  generateDiagonalMoves(
    board,
    empty,
    occupancy,
    PIECE_TYPES.Bishop | side,
    moves,
  );
}
function generateDiagonalMoves(
  board: Board,
  empty: Bitboard,
  occupancy: Bitboard,
  piece: Piece,
  moves: Move[],
): void {
  generateSlidingMoves(
    board,
    empty,
    occupancy,
    piece,
    moves,
    AttackTables.DIAGONAL_TABLES,
  );
}
function generateOrthogonalMoves(
  board: Board,
  empty: Bitboard,
  occupancy: Bitboard,
  piece: Piece,
  moves: Move[],
): void {
  generateSlidingMoves(
    board,
    empty,
    occupancy,
    piece,
    moves,
    AttackTables.ORTHOGONAL_TABLES,
  );
}
function tempgenerateDiagonalMoves(
  board: Board,
  pieceBoard: Bitboard,
  empty: Bitboard,
  occupancy: Bitboard,
  pushMask: Bitboard,
  captureMask: Bitboard,
  moves: Move[],
): void {
  tempgenerateSlidingMoves(
    board,
    pieceBoard,
    empty,
    occupancy,
    pushMask,
    captureMask,
    moves,
    AttackTables.DIAGONAL_TABLES,
  );
}
function tempgenerateOrthogonalMoves(
  board: Board,
  pieceBoard: Bitboard,
  empty: Bitboard,
  occupancy: Bitboard,
  pushMask: Bitboard,
  captureMask: Bitboard,
  moves: Move[],
): void {
  tempgenerateSlidingMoves(
    board,
    pieceBoard,
    empty,
    occupancy,
    pushMask,
    captureMask,
    moves,
    AttackTables.ORTHOGONAL_TABLES,
  );
}
function tempgenerateQueenMoves(
  board: Board,
  pieceBoard: Bitboard,
  empty: Bitboard,
  occupancy: Bitboard,
  pushMask: Bitboard,
  captureMask: Bitboard,
  moves: Move[],
): void {
  tempgenerateOrthogonalMoves(
    board,
    pieceBoard,
    empty,
    occupancy,
    pushMask,
    captureMask,
    moves,
  );
  tempgenerateDiagonalMoves(
    board,
    pieceBoard,
    empty,
    occupancy,
    pushMask,
    captureMask,
    moves,
  );
}
function generateQueenMoves(
  board: Board,
  empty: Bitboard,
  occupancy: Bitboard,
  side: PieceColour,
  moves: Move[],
): void {
  const piece = PIECE_TYPES.Queen | side;

  generateOrthogonalMoves(board, empty, occupancy, piece, moves);
  generateDiagonalMoves(board, empty, occupancy, piece, moves);
}
function tempgenerateSlidingMoves(
  board: Board,
  pieceBoard: Bitboard,
  empty: Bitboard,
  occupancy: Bitboard,
  pushMask: Bitboard,
  captureMask: Bitboard,
  moves: Move[],
  tables: AttackTables.SlidingTables,
): void {
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

    targets &= empty & pushMask & captureMask;

    while (targets !== 0n) {
      const to = getLSBIndex(targets)!;
      targets = clearLSB(targets);
      MoveUtils.encodeStandardMove({ board, from, to, moves });
    }
  }
}
function generateSlidingMoves(
  board: Board,
  empty: Bitboard,
  occupancy: Bitboard,
  piece: Piece,
  moves: Move[],
  tables: AttackTables.SlidingTables,
): void {
  let pieceBoard = board.getBitboard(piece);

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

    targets &= empty;

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

// TODO: PLACEHOLDER
export function test(
  board: Board,
  activeColour: PieceColour = board.activeColour,
): Move[] {
  const moves: Move[] = [];
  const kingSquare = board.getKingSquare(activeColour);
  let captureMask = BOARD_MASK;
  let pushMask = BOARD_MASK;
  const checksOnKing = getChecksOnKing(board, activeColour);
  const attacksOnKing = generateAttacksOnSquare(
    board,
    board.getKingSquare(activeColour),
    getEnemyColour(activeColour),
  );
  if (checksOnKing == 1) {
    captureMask = attacksOnKing;

    const pieceIdx = getLSBIndex(attacksOnKing)!;
    if (isSlidingPiece(board.pieceAt(pieceIdx))) {
      pushMask = computeRay(toSquare(pieceIdx), kingSquare);
    } else {
      pushMask = 0n;
    }
  }

  const activeOccupancy = board.getFriendlyOccupancyFor(activeColour);
  const enemyOccupancy = board.getEnemyOccupancyFor(activeColour);
  const occupancy = activeOccupancy | enemyOccupancy;
  const empty = ~activeOccupancy;
  tempgeneratePawnMoves(
    board,
    board.getPawns(activeColour),
    activeColour,
    enemyOccupancy,
    pushMask,
    captureMask,
    moves,
  );
  tempgenerateKnightMoves(
    board,
    board.getKnights(activeColour),
    empty,
    pushMask,
    captureMask,
    moves,
  );
  tempgenerateBishopMoves(
    board,
    board.getBishops(activeColour),
    empty,
    occupancy,
    pushMask,
    captureMask,
    moves,
  );
  tempgenerateRookMoves(
    board,
    board.getRooks(activeColour),
    empty,
    occupancy,
    pushMask,
    captureMask,
    moves,
  );
  tempgenerateQueenMoves(
    board,
    board.getQueens(activeColour),
    empty,
    occupancy,
    pushMask,
    captureMask,
    moves,
  );
  tempgenerateKingMoves(
    board,
    board.getKing(activeColour),
    empty,
    pushMask,
    captureMask,
    moves,
  );
  generateCastlingMoves(board, activeColour, moves);
  return moves;
}
export function generatePseudoLegalMoves(
  board: Board,
  activeColour: PieceColour = board.activeColour,
): Move[] {
  const moves: Move[] = [];

  const activeOccupancy = board.getFriendlyOccupancyFor(activeColour);
  const enemyOccupancy = board.getEnemyOccupancyFor(activeColour);
  const occupancy = activeOccupancy | enemyOccupancy;
  const empty = ~activeOccupancy;
  const numCheckers = getChecksOnKing(board, activeColour);

  generatePawnMoves(board, enemyOccupancy, activeColour, moves);
  generateKnightMoves(board, empty, activeColour, moves);
  generateBishopMoves(board, empty, occupancy, activeColour, moves);
  generateRookMoves(board, empty, occupancy, activeColour, moves);
  generateQueenMoves(board, empty, occupancy, activeColour, moves);
  generateKingMoves(board, empty, activeColour, moves);
  // generateCastlingMoves(board, activeColour, moves);

  return moves;
}
export const castlingTimer = new Timer("Castling");

function generateCastlingMoves(
  board: Board,
  activeColour: PieceColour,
  moves: Move[],
): void {
  castlingTimer.startTimer();
  const { canKingSide, canQueenSide } = isWhite(activeColour)
    ? board.getWhiteCastlingRights()
    : board.getBlackCastlingRights();

  const kingSquare = board.getKingSquare(activeColour);

  if (canKingSide && canKingSideCastle(board, activeColour)) {
    moves.push(
      MoveChess.createMove(
        kingSquare,
        toSquare(kingSquare + 2),
        MoveConstants.MOVE_FLAGS.KingCastle,
      ),
    );
  }
  if (canQueenSide && canQueenSideCastle(board, activeColour)) {
    moves.push(
      MoveChess.createMove(
        kingSquare,
        toSquare(kingSquare - 2),
        MoveConstants.MOVE_FLAGS.QueenCastle,
      ),
    );
  }
  castlingTimer.stopTimer();
}
function canKingSideCastle(board: Board, activeColour: PieceColour): boolean {
  let kingSideCheckMask = isWhite(activeColour)
    ? MoveConstants.KING_SIDE_CASTLING_CHECK_MASK
    : MoveConstants.KING_SIDE_CASTLING_CHECK_MASK << BigInt(8 * 7);
  const kingSideOccupancy = isWhite(activeColour)
    ? MoveConstants.KING_SIDE_CASTLING_OCCUPANCY_MASK
    : MoveConstants.KING_SIDE_CASTLING_OCCUPANCY_MASK << BigInt(8 * 7);

  while (kingSideCheckMask !== 0n) {
    const idx = getLSBIndex(kingSideCheckMask)!;
    kingSideCheckMask = clearLSB(kingSideCheckMask);
    const isAttacked = isSquareAttacked(
      board,
      idx,
      getEnemyColour(activeColour),
    );

    if (isAttacked) return false;
  }
  return (board.occupancy & kingSideOccupancy) === 0n;
}
function canQueenSideCastle(board: Board, activeColour: PieceColour): boolean {
  let queenSideCheckMask = isWhite(activeColour)
    ? MoveConstants.QUEEN_SIDE_CASTLING_CHECK_MASK
    : MoveConstants.QUEEN_SIDE_CASTLING_CHECK_MASK << BigInt(8 * 7);
  const queenSideOccupancyMask = isWhite(activeColour)
    ? MoveConstants.QUEEN_SIDE_CASTLING_OCCUPANCY_MASK
    : MoveConstants.QUEEN_SIDE_CASTLING_OCCUPANCY_MASK << BigInt(8 * 7);

  while (queenSideCheckMask !== 0n) {
    const idx = getLSBIndex(queenSideCheckMask)!;
    queenSideCheckMask = clearLSB(queenSideCheckMask);
    const isAttacked = isSquareAttacked(
      board,
      idx,
      getEnemyColour(activeColour),
    );
    if (isAttacked) return false;
  }
  return (board.occupancy & queenSideOccupancyMask) === 0n;
}

export function generateLegalMoves(
  board: Board,
  activeColour: PieceColour = board.activeColour,
): Move[] {
  pseudoTimer.startTimer();
  const pseudoLegalMoves = generatePseudoLegalMoves(board, activeColour);
  pseudoTimer.stopTimer();

  // O(1)
  const enemyColour = getEnemyColour(activeColour);
  const legalMoves: Move[] = [];

  // O(pseudoLegal)
  for (const move of pseudoLegalMoves) {
    makeMoveTimer.startTimer();
    MoveMake.makeMove(board, move);
    makeMoveTimer.stopTimer();

    isSquareAttackedTimer.startTimer();
    if (
      !isSquareAttacked(board, board.getKingSquare(activeColour), enemyColour)
    ) {
      legalMoves.push(move);
    }
    isSquareAttackedTimer.stopTimer();

    unmakeMoveTimer.startTimer();
    MoveMake.unmakeMove(board);
    unmakeMoveTimer.stopTimer();
  }
  return legalMoves;
}
