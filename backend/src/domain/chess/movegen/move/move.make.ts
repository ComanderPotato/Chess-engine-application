import { moveCursor } from "node:readline";
import { Board } from "../../board/board.chess.js";
import { RANKS } from "../../board/board.constants.js";
import { Square } from "../../board/types.chess.js";
import {
  getEnemyColour,
  isSlidingPiece,
  normaliseColour,
} from "../../piece/piece.chess.js";
import {
  PIECE_COLOURS,
  PIECE_TYPES,
  PIECES,
} from "../../piece/piece.constants.js";
import { pieceToString } from "../../piece/piece.format.js";
import { pieceToProperty } from "../../piece/piece.notation.js";
import { Piece, PieceColour, PieceType } from "../../piece/piece.types.js";
import * as MoveUtils from "../../utils/move.utils.js";
import { isEnpassantMove } from "../../utils/move.utils.js";
import { toRank, toSquare } from "../../utils/square.utils.js";
import { shiftLeft } from "./move.bitboard.js";
import * as MoveChess from "./move.chess.js";
import {
  MOVE_FLAGS,
  MoveFlag,
  ROOK_CASTLE_POSITIONS,
} from "./move.constants.js";
import { SQUARE_DIRECTIONS } from "./move.directions.js";
import { Move } from "./move.types.js";
import { Timer } from "../../debug/timer.debug.js";

const MAKE_MOVE_CACHE: Partial<Record<MoveFlag, Function>> = {
  [MOVE_FLAGS.EnPassantCapture]: captureEnpassant,
  [MOVE_FLAGS.QueenCastle]: castleKing,
  [MOVE_FLAGS.KingCastle]: castleKing,
  [MOVE_FLAGS.KnightPromotion]: promotePiece,
  [MOVE_FLAGS.BishopPromotion]: promotePiece,
  [MOVE_FLAGS.RookPromotion]: promotePiece,
  [MOVE_FLAGS.QueenPromotion]: promotePiece,
  [MOVE_FLAGS.KnightPromotionCapture]: promotePiece,
  [MOVE_FLAGS.BishopPromotionCapture]: promotePiece,
  [MOVE_FLAGS.RookPromotionCapture]: promotePiece,
  [MOVE_FLAGS.QueenPromotionCapture]: promotePiece,
};

const makeTimerV1 = new Timer("Makemove1");
const makeTimerV2 = new Timer("Makemove2");
export function makeMove(board: Board, move: Move): void {
  // makeTimerV1.startTimer();
  makeMoveV1(board, move);
  // makeTimerV1.stopTimer();
  // unmakeMove(board);
  // makeTimerV2.startTimer();
  // makeMoveV2(board, move);
  // makeTimerV2.stopTimer();
}
export function makeMoveV2(board: Board, move: Move): void {
  board.pushState(move, getCapturedPiece(board, move));
  const from = MoveChess.getFrom(move);
  const to = MoveChess.getTo(move);
  const flag = MoveChess.getFlag(move);
  const movedPiece = board.pieceAt(from);

  // if (MoveUtils.isCaptureFlag(flag))
  //   board.removeBit(
  //     calcCaptureSquare(
  //       to,
  //       getEnemyColour(board.activeColour),
  //       MoveUtils.isEnpassantFlag(flag),
  //     ),
  //   );
  board.removeBit(
    calcCaptureSquare(
      to,
      getEnemyColour(board.activeColour),
      MoveUtils.isEnpassantFlag(flag),
    ),
  );

  board.movePiece(movedPiece, from, to);
  if (MoveUtils.isPromotionFlag(flag)) {
    promotePiece(board, to, getPromotionPiece(flag));
  }
  // else if (MoveUtils.isEnpassantFlag(flag)) {
  //   captureEnpassant(board, from, to);
  // }
  else if (MoveUtils.isCastlingFlag(flag)) {
    castleKing(board, flag);
  }

  board.updateBoardState(from, to, flag, movedPiece);
}
export function makeMoveV3(board: Board, move: Move): void {
  board.pushState(move, getCapturedPiece(board, move));
  const from = MoveChess.getFrom(move);
  const to = MoveChess.getTo(move);
  const flag = MoveChess.getFlag(move);
  const movedPiece = board.pieceAt(from);

  if (MoveUtils.isCaptureFlag(flag))
    board.removeBit(
      calcCaptureSquare(
        to,
        getEnemyColour(board.activeColour),
        MoveUtils.isEnpassantFlag(flag),
      ),
    );
  //
  // if (MoveUtils.isCaptureFlag(flag))
  //   board.removeBit(
  //     calcCaptureSquare(
  //       board.activeColour,
  //       to,
  //       MoveUtils.isEnpassantFlag(flag),
  //     ),
  //   );
  // board.removeBit(
  //   calcCaptureSquare(
  //     to,
  //     getEnemyColour(board.activeColour),
  //     MoveUtils.isEnpassantFlag(flag),
  //   ),
  // );
  board.movePiece(movedPiece, from, to);
  if (MoveUtils.isPromotionFlag(flag)) {
    promotePiece(board, to, getPromotionPiece(flag));
  }
  // else if (MoveUtils.isEnpassantFlag(flag)) {
  //   captureEnpassant(board, from, to);
  // }
  else if (MoveUtils.isCastlingFlag(flag)) {
    castleKing(board, flag);
  }

  board.updateBoardState(from, to, flag, movedPiece);
}
export function makeMoveV1(board: Board, move: Move): void {
  board.pushState(move, getCapturedPiece(board, move));
  const from = MoveChess.getFrom(move);
  const to = MoveChess.getTo(move);
  const flag = MoveChess.getFlag(move);
  const movedPiece = board.pieceAt(from);
  const capturedPiece = board.pieceAt(to);
  if (capturedPiece !== PIECE_TYPES.Empty) board.removePiece(capturedPiece, to);

  board.movePiece(movedPiece, from, to);
  if (MoveUtils.isPromotionFlag(flag)) {
    promotePiece(board, to, getPromotionPiece(flag));
  } else if (MoveUtils.isEnpassantFlag(flag)) {
    captureEnpassant(board, from, to);
  } else if (MoveUtils.isCastlingFlag(flag)) {
    castleKing(board, flag);
  }
  board.updateBoardState(from, to, flag, movedPiece);
}

const CAPTURE_MAPS = [SQUARE_DIRECTIONS.S, SQUARE_DIRECTIONS.N];
function calcCaptureSquare(
  to: Square,
  side: PieceColour,
  isEnpassant: boolean,
): Square {
  return toSquare(
    to + CAPTURE_MAPS[normaliseColour(side)]! * Number(isEnpassant),
  );
}

const timer = new Timer("Unmake");
export function unmakeMove(board: Board): void {
  // timer.startTimer();
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

  // board.setPiece(
  //   previousState.capturedPiece,
  //   calcCaptureSquare(to, previousColour, MoveUtils.isEnpassantFlag(flag)),
  // );
  if (previousState.capturedPiece !== PIECE_TYPES.Empty) {
    // const captureSquare = MoveUtils.isEnpassantFlag(flag)
    //   ? toSquare(to - 8 * (toRank(to) - toRank(from)))
    //   : to;

    const captureSquare = calcCaptureSquare(
      to,
      previousColour,
      MoveUtils.isEnpassantFlag(flag),
    );
    board.setPiece(previousState.capturedPiece, captureSquare);
  }

  board.saveState(previousState.boardState);
  // timer.stopTimer();
}

function getPromotionPiece(
  // board: Board,
  // from: Square,
  // to: Square,
  flag: MoveFlag,
): Piece {
  const offset = MoveUtils.isCaptureFlag(flag) ? 10 : 6;
  return PIECES[(flag - offset) as PieceType]!;
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

const RANK_SHIFTS = [
  RANKS.EIGHTH,
  (PIECE_COLOURS.Black - PIECE_COLOURS.White) * RANKS.EIGHTH,
] as const;
function castleKing(
  board: Board,
  // from: Square,
  // to: Square,
  flag: MoveFlag,
): void {
  const rankShift = (board.activeColour - PIECE_COLOURS.White) * RANKS.EIGHTH;
  // const rankShift = RANK_SHIFTS[normaliseColour(board.activeColour)]!;

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
  board.setPiece(promotionPiece | board.activeColour, at);
}

function captureEnpassant(
  board: Board,
  from: Square,
  to: Square,
  // flag: MoveFlag,
): void {
  const rankDiff = toRank(from) - toRank(to);
  board.removeBit(toSquare(to + 8 * rankDiff));
  // board.removeBit(
  //   toSquare(
  //     board.enPassant! -
  //       EN_PASSANT_CAPTURE[normaliseColour(board.activeColour)]!,
  //   ),
  // );
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
