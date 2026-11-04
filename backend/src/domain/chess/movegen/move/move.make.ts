import { Board } from "../../board/board.chess.js";
import { RANKS } from "../../board/board.constants.js";
import { Square } from "../../board/types.chess.js";
import { Timer } from "../../debug/timer.debug.js";
import { PIECE_COLOURS, PIECE_TYPES } from "../../piece/piece.constants.js";
import { pieceToProperty } from "../../piece/piece.notation.js";
import { Piece, PieceColour, PieceType } from "../../piece/piece.types.js";
import * as MoveUtils from "../../utils/move.utils.js";
import { isEnpassantMove } from "../../utils/move.utils.js";
import { toRank, toSquare } from "../../utils/square.utils.js";
import * as MoveChess from "./move.chess.js";
import {
  MOVE_FLAGS,
  MoveFlag,
  ROOK_CASTLE_POSITIONS,
} from "./move.constants.js";
import { Move } from "./move.types.js";

// const updateBoardStateTimer = new Timer("Update board state");
// const promote = new Timer("Make Promotion");
// const enPassant = new Timer("Make Enpassant");
// const castle = new Timer("Make Castle");
// const moveAndRemove = new Timer("Move and remove");
// const statePush = new Timer("State push");
export function makeMove(board: Board, move: Move): void {
  // statePush.startTimer();
  board.pushState(move, getCapturedPiece(board, move));
  // statePush.stopTimer();
  // moveAndRemove.startTimer();

  const from = MoveChess.getFrom(move);
  const to = MoveChess.getTo(move);
  const flag = MoveChess.getFlag(move);
  const movedPiece = board.pieceAt(from);
  const capturedPiece = board.pieceAt(to);

  if (capturedPiece !== PIECE_TYPES.Empty) board.removePiece(capturedPiece, to);
  board.movePiece(movedPiece, from, to);
  // moveAndRemove.stopTimer();
  if (MoveUtils.isPromotionFlag(flag)) {
    // promote.startTimer();
    promotePiece(board, to, getPromotionPiece(move));
    // promote.stopTimer();
  } else if (MoveUtils.isEnpassantFlag(flag)) {
    // enPassant.startTimer();
    captureEnpassant(board, from, to);
    // enPassant.stopTimer();
  } else if (MoveUtils.isCastlingFlag(flag)) {
    // castle.startTimer();
    castleKing(board, flag);
    // castle.stopTimer();
  }

  // updateBoardStateTimer.startTimer();
  board.updateBoardState(from, to, flag, movedPiece);
  // updateBoardStateTimer.stopTimer();
}

export function unmakeMove(board: Board): void {
  const previousState = board.popState();
  if (!previousState) return;
  const from = MoveChess.getFrom(previousState.move);
  const to = MoveChess.getTo(previousState.move);
  const flag = MoveChess.getFlag(previousState.move);

  const previousColour = previousState.boardState.activeColour;
  if (MoveUtils.isPromotionFlag(flag)) {
    unPromotePiece(board, to, previousColour);
  } else if (MoveUtils.isCastlingFlag(flag)) {
    unCastleKing(board, flag, previousColour);
  }
  board.moveBit(to, from);

  if (previousState.capturedPiece !== PIECE_TYPES.Empty) {
    const captureSquare = MoveUtils.isEnpassantFlag(flag)
      ? toSquare(to - 8 * (toRank(to) - toRank(from)))
      : to;
    board.setPiece(previousState.capturedPiece, captureSquare);
  }

  board.saveState(previousState.boardState);
}

function getPromotionPiece(move: Move): PieceType {
  const flag = MoveChess.getFlag(move);
  const offset = MoveUtils.isCaptureFlag(flag) ? 10 : 6;
  return (flag - offset) as PieceType;
}
function unCastleKing(
  board: Board,
  flag: MoveFlag,
  previousColour: PieceColour,
): void {
  const rankShift = (previousColour - PIECE_COLOURS.White) * RANKS.EIGHTH;
  const [rookTo, rookFrom] =
    ROOK_CASTLE_POSITIONS[flag - MOVE_FLAGS.KingCastle]!;
  board.movePiece(
    PIECE_TYPES.Rook | previousColour,
    toSquare(rookFrom + rankShift),
    toSquare(rookTo + rankShift),
  );
}
function castleKing(board: Board, flag: MoveFlag): void {
  const rankShift = (board.activeColour - PIECE_COLOURS.White) * RANKS.EIGHTH;

  const [rookFrom, rookTo] =
    ROOK_CASTLE_POSITIONS[flag - MOVE_FLAGS.KingCastle]!;

  board.movePiece(
    PIECE_TYPES.Rook | board.activeColour,
    toSquare(rookFrom + rankShift),
    toSquare(rookTo + rankShift),
  );
}
function unPromotePiece(
  board: Board,
  at: Square,
  previousColour: PieceColour,
): void {
  board.removeBit(at);
  board.setPiece(PIECE_TYPES.Pawn | previousColour, at);
}
function promotePiece(board: Board, at: Square, promotionPiece: Piece): void {
  board.removePiece(PIECE_TYPES.Pawn | board.activeColour, at);
  board.setPiece(
    promotionPiece | board.activeColour | pieceToProperty(promotionPiece),
    at,
  );
}

function captureEnpassant(board: Board, from: Square, to: Square): void {
  const rankDiff = toRank(from) - toRank(to);
  board.removeBit(toSquare(to + 8 * rankDiff));
}

function calcEnpassantSquare(from: Square, to: Square): Square {
  return from > to ? toSquare(to + 8) : toSquare(to - 8);
}
export function getCapturedPiece(board: Board, move: Move): Piece {
  if (isEnpassantMove(move)) {
    return board.pieceAt(
      calcEnpassantSquare(MoveChess.getFrom(move), MoveChess.getTo(move)),
    );
  } else return board.pieceAt(MoveChess.getTo(move));
}
