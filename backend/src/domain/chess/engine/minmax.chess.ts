import { makeIssue } from "zod/v3";
import { Board } from "../board/board.chess.js";
import { generateLegalMoves } from "../movegen/move/move.generator.js";
import { makeMove, unmakeMove } from "../movegen/move/move.make.js";
import { PieceColour } from "../piece/piece.types.js";
import { getTo } from "../movegen/move/move.chess.js";
import { getType } from "../piece/piece.chess.js";
import { popCount } from "../utils/bitboard.utils.js";

function evaluateMax(board: Board, max: PieceColour, min: PieceColour): number {
  let evaluation = 0;
  evaluation +=
    200 * (popCount(board.getKing(max)) - popCount(board.getKing(min)));
  evaluation +=
    9 * (popCount(board.getQueens(max)) - popCount(board.getQueens(min)));
  evaluation +=
    5 * (popCount(board.getRooks(max)) - popCount(board.getRooks(min)));
  evaluation +=
    3 * (popCount(board.getBishops(max)) - popCount(board.getBishops(min)));
  evaluation +=
    popCount(board.getKnights(max)) - popCount(board.getKnights(min));
  evaluation +=
    1 * (popCount(board.getPawns(max)) - popCount(board.getPawns(min)));
  evaluation +=
    0.1 *
    (generateLegalMoves(board, max).length -
      generateLegalMoves(board, min).length);
  return evaluation;
}
function evaluateMin(board: Board): number {
  return -1;
}
function evaluate(board: Board, maxPlayer: boolean): number {
  return -1;
  // const moves = generateLegalMoves(board);
  // if (maxPlayer) {
  //   let max = Number.MIN_SAFE_INTEGER;
  //   for (const move of moves) {
  //     const capture = getType(board.pieceAt(getTo(move)));
  //     if (capture > max) max = capture;
  //   }
  //   return max;
  // } else {
  //   let min = Number.MAX_SAFE_INTEGER;
  //   for (const move of moves) {
  //     const capture = -getType(board.pieceAt(getTo(move)));
  //     if (capture < min) min = capture;
  //   }
  //   return min;
  // }
}
function maxi(board: Board, depth: number): number {
  if (depth === 0) return evaluate(board, true);
  let max = Number.MIN_SAFE_INTEGER;
  for (const move of generateLegalMoves(board)) {
    makeMove(board, move);
    let score = mini(board, depth - 1);
    unmakeMove(board);
    if (score > max) max = score;
  }
  return max;
}

function mini(board: Board, depth: number): number {
  if (depth === 0) return evaluate(board, false);
  let min = Number.MAX_SAFE_INTEGER;
  for (const move of generateLegalMoves(board)) {
    makeMove(board, move);
    let score = maxi(board, depth - 1);
    unmakeMove(board);
    if (score < min) min = score;
  }
  return min;
}
export function minmax(board: Board, depth: number): number {
  return maxi(board, depth);
}
