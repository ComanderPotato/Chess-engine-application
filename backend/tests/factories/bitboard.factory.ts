import { Square } from "@/domain/chess/board/types.chess.js";
import { squareToBB } from "@/domain/chess/utils/bitboard.utils.js";

export function createBitboardFromCoords(coords: Square[]) {
  let board = 0n;
  for (const coord of coords) {
    board |= squareToBB(coord);
  }
  return board;
}
