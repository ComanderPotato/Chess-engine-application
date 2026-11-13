import { Board } from "../board/board.chess.js";
import { Bitboard } from "../board/types.chess.js";
import { generateLegalMoves } from "../movegen/move/move.generator.js";

export function getTrappedPieces(
  board: Board,
  opponentAttackMask: Bitboard,
): Bitboard {
  const moves = generateLegalMoves(board);
  for (const move of moves) {
  }

  return [0, 0];
}
