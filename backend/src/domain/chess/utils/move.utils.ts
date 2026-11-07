import { Board } from "../board/board.chess.js";
import { BOARD_SIZE, RANK_MASKS, RANKS } from "../board/board.constants.js";
import { Bitboard, Square } from "../board/types.chess.js";
import { shiftNorth, shiftSouth } from "../movegen/move/move.bitboard.js";
import * as MoveChess from "../movegen/move/move.chess.js";
import * as SquareUtils from "./square.utils.js";
import {
  MOVE_CAPTURE_FLAG,
  MOVE_FLAGS,
  MOVE_PROMOTION_FLAG,
  MoveFlag,
  PROMOTION_CAPTURE_FLAGS,
  PROMOTION_FLAGS,
} from "../movegen/move/move.constants.js";
import { Move } from "../movegen/move/move.types.js";
import { isWhite } from "../piece/piece.chess.js";
import { PIECE_TYPES } from "../piece/piece.constants.js";
import { PieceColour } from "../piece/piece.types.js";

export interface IMoveConstruct {
  board: Board;
  from: Square;
  to: Square;
  moves: Move[];
}

// TODO: Move to square.utils

export function isEnpassantMove(move: Move): boolean {
  const flag = MoveChess.getFlag(move);
  return flag === MOVE_FLAGS.EnPassantCapture;
}
export function isEnpassantFlag(flag: MoveFlag): boolean {
  return flag === MOVE_FLAGS.EnPassantCapture;
}
export function isCastlingMove(move: Move): boolean {
  return isCastlingFlag(MoveChess.getFlag(move));
}
export function isCastlingFlag(flag: MoveFlag): boolean {
  return flag === MOVE_FLAGS.KingCastle || flag === MOVE_FLAGS.QueenCastle;
}
export function isCaptureMove(move: Move): boolean {
  return isCaptureFlag(MoveChess.getFlag(move));
}
export function isCaptureFlag(flag: MoveFlag): boolean {
  return (flag & MOVE_CAPTURE_FLAG) === MOVE_CAPTURE_FLAG;
}
export function isPromotionMove(move: Move): boolean {
  return isPromotionFlag(MoveChess.getFlag(move));
}
export function isPromotionFlag(flag: MoveFlag): boolean {
  return (flag & MOVE_PROMOTION_FLAG) === MOVE_PROMOTION_FLAG;
}

const PAWN_MOVES_CACHE = Array.from({ length: BOARD_SIZE }, (_, from) =>
  Array.from({ length: BOARD_SIZE }, (_, to) => {
    const fromSquare = SquareUtils.toSquare(from);
    const toSquare = SquareUtils.toSquare(to);
    const fromRank = SquareUtils.toRank(fromSquare);
    const toRank = SquareUtils.toRank(toSquare);
    const fromFile = SquareUtils.toFile(fromSquare);
    const toFile = SquareUtils.toFile(toSquare);
    const rankDiff = Math.abs(fromRank - toRank);
    const fileDiff = Math.abs(fromFile - toFile);
    if (
      (fromRank === RANKS.SECOND && toRank === RANKS.FIRST) ||
      (fromRank === RANKS.SEVENTH && toRank === RANKS.EIGHTH)
    ) {
      if (fileDiff === 0) {
        return PROMOTION_FLAGS.map((flag) =>
          MoveChess.createMove(
            SquareUtils.toSquare(from),
            SquareUtils.toSquare(to),
            flag,
          ),
        );
      } else if (fileDiff === 1) {
        return PROMOTION_CAPTURE_FLAGS.map((flag) =>
          MoveChess.createMove(
            SquareUtils.toSquare(from),
            SquareUtils.toSquare(to),
            flag,
          ),
        );
      } else {
        return [];
      }
    }
    if (
      (fromRank === RANKS.SECOND && toRank === RANKS.FOURTH) ||
      (fromRank === RANKS.SEVENTH && toRank === RANKS.FIFTH)
    ) {
      return [
        MoveChess.createMove(fromSquare, toSquare, MOVE_FLAGS.DoublePawnPush),
      ];
    }
    if (rankDiff === 1) {
      if (fileDiff === 0) {
        return [MoveChess.createMove(fromSquare, toSquare, MOVE_FLAGS.Quiet)];
      } else {
        return [MoveChess.createMove(fromSquare, toSquare, MOVE_FLAGS.Capture)];
      }
    }
  }),
);
const PROMOTION_CACHE = [PROMOTION_FLAGS, PROMOTION_CAPTURE_FLAGS];
export function encodePawnMove({
  board,
  from,
  to,
  moves,
}: IMoveConstruct): void {
  // moves.push(...PAWN_MOVES_CACHE[from]![to]!);
  const isCapture = board.isOccupied(to);

  if (SquareUtils.isPromotionSquare(to)) {
    PROMOTION_CACHE[Number(isCapture)]!.forEach((flag) =>
      moves.push(MoveChess.createMove(from, to, flag)),
    );
    return;
  }

  let flag: MoveFlag = MOVE_FLAGS.Quiet;

  if (SquareUtils.isEnPassantSquare(board.enPassant, to)) {
    flag = MOVE_FLAGS.EnPassantCapture;
  } else if (isCapture) {
    flag = MOVE_FLAGS.Capture;
  } else if (SquareUtils.isDoublePawnPushSquare(from, to)) {
    flag = MOVE_FLAGS.DoublePawnPush;
  }
  moves.push(MoveChess.createMove(from, to, flag));
}

const STANDARD_MOVE_FLAGS = [MOVE_FLAGS.Quiet, MOVE_FLAGS.Capture];
export function encodeStandardMove({
  board,
  from,
  to,
  moves,
}: IMoveConstruct): void {
  moves.push(
    MoveChess.createMove(
      from,
      to,
      STANDARD_MOVE_FLAGS[Number(board.pieceAt(to) !== PIECE_TYPES.Empty)]!,
    ),
  );
}
export function encodeKingMove({
  board,
  from,
  to,
  moves,
}: IMoveConstruct): void {
  encodeStandardMove({ board, from, to, moves });
}
export function encodeKnightMove({
  board,
  from,
  to,
  moves,
}: IMoveConstruct): void {
  encodeStandardMove({ board, from, to, moves });
}
export function encodeBishopMove({
  board,
  from,
  to,
  moves,
}: IMoveConstruct): void {
  encodeStandardMove({ board, from, to, moves });
}
export function encodeRookMove({
  board,
  from,
  to,
  moves,
}: IMoveConstruct): void {
  encodeStandardMove({ board, from, to, moves });
}
