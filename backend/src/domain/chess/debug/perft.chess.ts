import { Board } from "../board/board.chess.js";
import * as MoveChess from "../movegen/move/move.chess.js";
import * as MoveMake from "../movegen/move/move.make.js";
import { MOVE_FLAGS } from "../movegen/move/move.constants.js";
import { generateLegalMoves } from "../movegen/move/move.generator.js";
import { squareToCoord } from "../utils/coord.utils.js";

interface PerftInfo {
  nodes: number;
  captures: number;
  ep: number;
  castles: number;
  promotions: number;
  checks: number;
  discoveryChecks: number;
  doubleChecks: number;
  checkmates: number;
}

export function perft(board: Board, depth: number): PerftInfo {
  const info: PerftInfo = {
    nodes: 0,
    captures: 0,
    ep: 0,
    castles: 0,
    promotions: 0,
    checks: 0,
    discoveryChecks: 0,
    doubleChecks: 0,
    checkmates: 0,
  };

  const initialDepth = depth;
  // const initialColour = board.activeColour;

  const recurse = (depth: number): number => {
    if (depth === 0) return 1;

    const moves = generateLegalMoves(board, board.activeColour);
    let count = 0;

    for (const move of moves) {
      MoveMake.makeMove(board, move);

      let moveCount = recurse(depth - 1);

      if (depth === initialDepth) {
        const flag = MoveChess.getFlag(move);
        let a = "";
        if (
          flag === MOVE_FLAGS.BishopPromotion ||
          flag === MOVE_FLAGS.BishopPromotionCapture
        ) {
          a = "b";
        } else if (
          flag === MOVE_FLAGS.RookPromotion ||
          flag === MOVE_FLAGS.RookPromotionCapture
        ) {
          a = "r";
        } else if (
          flag === MOVE_FLAGS.QueenPromotion ||
          flag === MOVE_FLAGS.QueenPromotionCapture
        ) {
          a = "q";
        } else if (
          flag === MOVE_FLAGS.KnightPromotion ||
          flag === MOVE_FLAGS.KnightPromotionCapture
        ) {
          a = "n";
        }

        console.log(
          `${squareToCoord(MoveChess.getFrom(move))}${squareToCoord(MoveChess.getTo(move))}${a} with nodes: ${moveCount}`,
        );
      }
      count += moveCount;
      // count += recurse(depth - 1);
      MoveMake.unmakeMove(board);
    }

    return count;
  };

  info.nodes = recurse(depth);
  return info;
}
