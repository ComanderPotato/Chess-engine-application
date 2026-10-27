import { COORD_SQUARE_MAP } from "#/fixtures/chess/square.fixtures.js";
import { Board } from "../../board/board.chess.js";
import { RANKS } from "../../board/board.constants.js";
import { Square } from "../../board/types.chess.js";
import { getEnemyColour } from "../../piece/piece.chess.js";
import { PIECE_COLOURS, PIECE_TYPES } from "../../piece/piece.constants.js";
import { Piece, PieceColour, PieceType } from "../../piece/piece.types.js";
import * as MoveUtils from "../../utils/move.utils.js";
import { isEnpassantMove } from "../../utils/move.utils.js";
import { toRank, toSquare } from "../../utils/square.utils.js";
import * as MoveChess from "./move.chess.js";
import { MOVE_FLAGS, MoveFlag } from "./move.constants.js";
import { Move } from "./move.types.js";

export function makeMove(board: Board, move: Move): void {
  board.pushState(move, getCapturedPiece(board, move));
  const from = MoveChess.getFrom(move);
  const to = MoveChess.getTo(move);
  const flag = MoveChess.getFlag(move);
  const movedPiece = board.pieceAt(from);
  const capturedPiece = board.pieceAt(to);

  capturedPiece !== PIECE_TYPES.Empty && board.removePiece(capturedPiece, to);
  board.movePiece(movedPiece, from, to);
  MoveUtils.isPromotionFlag(flag) &&
    promotePiece(board, to, getPromotionPiece(move));
  MoveUtils.isEnpassantFlag(flag) && captureEnpassant(board, from, to);
  MoveUtils.isCastlingFlag(flag) && castleKing(board, flag);

  board.updateBoardState(move);
}

export function unmakeMove(board: Board): void {
  const previousState = board.popState();
  if (!previousState) return;
  const from = MoveChess.getFrom(previousState.move);
  const to = MoveChess.getTo(previousState.move);
  const flag = MoveChess.getFlag(previousState.move);

  const previousColour = previousState.boardState.activeColour;
  MoveUtils.isPromotionFlag(flag) && unPromotePiece(board, to, previousColour);
  MoveUtils.isCastlingFlag(flag) && unCastleKing(board, flag, previousColour);

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
  const [rookfrom, rookTo] =
    flag === MOVE_FLAGS.KingCastle
      ? [COORD_SQUARE_MAP.F1, COORD_SQUARE_MAP.H1]
      : [COORD_SQUARE_MAP.D1, COORD_SQUARE_MAP.A1];

  board.movePiece(
    PIECE_TYPES.Rook | previousColour,
    toSquare(rookfrom + rankShift),
    toSquare(rookTo + rankShift),
  );
}
function castleKing(board: Board, flag: MoveFlag): void {
  const rankShift = (board.activeColour - PIECE_COLOURS.White) * RANKS.EIGHTH;
  const [rookfrom, rookTo] =
    flag === MOVE_FLAGS.KingCastle
      ? [COORD_SQUARE_MAP.H1, COORD_SQUARE_MAP.F1]
      : [COORD_SQUARE_MAP.A1, COORD_SQUARE_MAP.D1];

  board.movePiece(
    PIECE_TYPES.Rook | board.activeColour,
    toSquare(rookfrom + rankShift),
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

function captureEnpassant(board: Board, from: Square, to: Square): void {
  const rankDiff = toRank(from) - toRank(to);
  board.removeBit(toSquare(to + 8 * rankDiff));
}
function unCaptureEnpassant(board: Board, from: Square, to: Square): void {
  const rankDiff = toRank(to) - toRank(from);
  board.setPiece(
    PIECE_TYPES.Pawn | getEnemyColour(board.activeColour),
    toSquare(to + 8 * rankDiff),
  );
}

function makeCastle(board: Board, move: Move): void {
  const colour = board.activeColour;
  // const colourShift = BigInt((colour - PIECE_COLOURS.White) * RANKS.EIGHTH);
  const rankShift = (colour - PIECE_COLOURS.White) * RANKS.EIGHTH;
  const flag = MoveChess.getFlag(move);
  // const kingMask =
  //   (flag === MOVE_FLAGS.KingCastle
  //     ? KING_SIDE_CASTLE_KING_MASK
  //     : QUEEN_SIDE_CASTLE_KING_MASK) << colourShift;
  //
  // const rookMask =
  //   (flag === MOVE_FLAGS.KingCastle
  //     ? KING_SIDE_CASTLE_ROOK_MASK
  //     : QUEEN_SIDE_CASTLE_ROOK_MASK) << colourShift;
  const kingPosition =
    flag === MOVE_FLAGS.KingCastle
      ? [COORD_SQUARE_MAP.E1, COORD_SQUARE_MAP.G1]
      : [COORD_SQUARE_MAP.E1, COORD_SQUARE_MAP.C1];
  const rookPosition =
    flag === MOVE_FLAGS.KingCastle
      ? [COORD_SQUARE_MAP.H1, COORD_SQUARE_MAP.F1]
      : [COORD_SQUARE_MAP.A1, COORD_SQUARE_MAP.D1];
  board.movePiece(
    PIECE_TYPES.King | colour,
    toSquare(kingPosition[0]! + rankShift),
    toSquare(kingPosition[1]! + rankShift),
  );
  board.movePiece(
    PIECE_TYPES.Rook | colour,
    toSquare(rookPosition[0]! + rankShift),
    toSquare(rookPosition[1]! + rankShift),
  );
  // board.bitboards.toggleBits(PIECE_TYPES.King | colour, kingMask);
  // board.bitboards.toggleBits(PIECE_TYPES.Rook | colour, rookMask);
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
