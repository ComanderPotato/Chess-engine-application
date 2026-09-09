import { Square } from "@/domain/chess/board/types.chess.js";

export function createBitboardFromCoords(coords: Square[]) {
  let board = 0n;
  for (const coord of coords) {
    board |= 1n << BigInt(coord);
  }
  return board;
}
