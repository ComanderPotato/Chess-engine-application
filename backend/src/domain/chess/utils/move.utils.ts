import {
  STARTING_BLACK_PAWNS_MASK,
  STARTING_WHITE_PAWNS_MASK,
} from "../bitboard/bitboard.masks.js";
import { Board } from "../board/board.chess.js";
import { RANK_MASKS, RANKS } from "../board/board.constants.js";
import { Bitboard, Square } from "../board/types.chess.js";
import { shiftLeft, shiftRight } from "../movegen/move/move.bitboard.js";
import { MOVE_FLAGS, MoveFlag } from "../movegen/move/move.constants.js";
import { BITBOARD_SHIFTS } from "../movegen/move/move.directions.js";
import { getType, isWhite } from "../piece/piece.chess.js";
import { PIECE_TYPES } from "../piece/piece.constants.js";
import { Piece, PieceColour } from "../piece/piece.types.js";

export function isPromotion(to: Square): boolean {
  const toMask = 1n << BigInt(to);
  return (
    (toMask & RANK_MASKS[RANKS.EIGHTH]!) !== 0n ||
    (toMask & RANK_MASKS[RANKS.FIRST]!) !== 0n
  );
}

export function assignFlag(board: Board, from: Square, to: Square): MoveFlag {
  const toSquareOccupancy = board.pieceAt(to);

  return MOVE_FLAGS.Quiet;
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
