import {
  STARTING_BLACK_PAWNS_MASK,
  STARTING_WHITE_PAWNS_MASK,
} from "../bitboard/bitboard.masks.js";
import { Board } from "../board/board.chess.js";
import { RANK_MASKS, RANKS } from "../board/board.constants.js";
import { Bitboard, Square } from "../board/types.chess.js";
import { shiftLeft, shiftRight } from "../movegen/move/move.bitboard.js";
import { createMove } from "../movegen/move/move.chess.js";
import {
  MOVE_FLAGS,
  MoveFlag,
  PROMOTION_CAPTURE_FLAGS,
  PROMOTION_FLAGS,
} from "../movegen/move/move.constants.js";
import {
  ALL_DIRECTIONS,
  BITBOARD_SHIFTS,
  SQUARE_DIRECTIONS,
} from "../movegen/move/move.directions.js";
import { Move } from "../movegen/move/move.types.js";
import { getColour, getType, isWhite } from "../piece/piece.chess.js";
import { PIECE_COLOURS, PIECE_TYPES } from "../piece/piece.constants.js";
import { Piece, PieceColour } from "../piece/piece.types.js";
import { isBitSet64 } from "./bit.utils.js";
import { toRank, toSquare } from "./square.utils.js";

export function isPawnPromotion(to: Square): boolean {
  const toMask = 1n << BigInt(to);
  return (
    (toMask & RANK_MASKS[RANKS.EIGHTH]!) !== 0n ||
    (toMask & RANK_MASKS[RANKS.FIRST]!) !== 0n
  );
}

export function isOccupied(board: Board, to: Square): boolean {
  return isBitSet64(board.occupancy, to);
}

export function isEnPassantCapture(
  board: Board,
  from: Square,
  to: Square,
): boolean {
  return toRank(from) !== toRank(to) && !isOccupied(board, to);
}

export function generateMoves(
  board: Board,
  from: Square,
  to: Square,
  moves: Move[],
): Move[] {
  const isCapture = isOccupied(board, to);
  const piece = board.pieceAt(from);
  if (getType(piece) === PIECE_TYPES.Pawn) {
    if (isPawnPromotion(to)) {
      const flags = isCapture ? PROMOTION_CAPTURE_FLAGS : PROMOTION_FLAGS;
      for (const flag of flags) {
        moves.push(createMove(from, to, flag));
      }
    } else if (isEnPassantCapture(board, from, to)) {
      moves.push(createMove(from, to, MOVE_FLAGS.EnPassantCapture));
    } else if (isCapture) {
      moves.push(createMove(from, to, MOVE_FLAGS.Capture));
    } else {
      moves.push(createMove(from, to, MOVE_FLAGS.Quiet));
    }
  } else if (getType(piece) === PIECE_TYPES.King) {
    const rooks = board.bitboardsList[PIECE_TYPES.Rook | getColour(piece)]!;
    const hasRookToWest = isBitSet64(rooks, toSquare(to + SQUARE_DIRECTIONS.W));
    const hasRookToEast = isBitSet64(rooks, toSquare(to + SQUARE_DIRECTIONS.E));
    const [hasKingSide, hasQueenSide] =
      getColour(piece) === PIECE_COLOURS.White
        ? [
            board.getWhiteKingSideCastlingRights(),
            board.getWhiteQueenSideCastlingRights(),
          ]
        : [
            board.getBlackKingSideCastlingRights(),
            board.getBlackQueenSideCastlingRights(),
          ];
    if (hasRookToWest && hasQueenSide) {
      moves.push(createMove(from, to, MOVE_FLAGS.QueenCastle));
    } else if (hasRookToEast && hasKingSide) {
      moves.push(createMove(from, to, MOVE_FLAGS.KingCastle));
    }
  } else {
    if (isCapture) {
      moves.push(createMove(from, to, MOVE_FLAGS.Capture));
    } else {
      moves.push(createMove(from, to, MOVE_FLAGS.Quiet));
    }
  }
  return moves;
}

export function generatePawnMoveBoard(
  board: Board,
  colour: PieceColour,
): Bitboard {
  const pawnBoard = board.getBitboard(PIECE_TYPES.Pawn | colour);
  const shiftDirection = isWhite(colour) ? shiftRight : shiftLeft;
  const startingRank = isWhite(colour)
    ? STARTING_WHITE_PAWNS_MASK
    : STARTING_BLACK_PAWNS_MASK;

  const singlePush = shiftDirection(pawnBoard, 8, ~board.occupancy);
  const doublePush = shiftDirection(
    singlePush & shiftDirection(startingRank, 8),
    8,
    ~board.occupancy,
  );
  return singlePush & doublePush;
}
