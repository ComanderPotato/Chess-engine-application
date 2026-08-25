import { Square } from "../../board/types.chess.js";
import { SQUARE_DIRECTIONS } from "./move.directions.js";

export function moveNorth(square: Square): Square {
  return (square + SQUARE_DIRECTIONS.N) as Square;
}
export function moveNorthEast(square: Square): Square {
  return (square + SQUARE_DIRECTIONS.NE) as Square;
}
export function moveNorthWest(square: Square): Square {
  return (square + SQUARE_DIRECTIONS.NW) as Square;
}
export function moveWest(square: Square): Square {
  return (square + SQUARE_DIRECTIONS.W) as Square;
}
export function moveEast(square: Square): Square {
  return (square + SQUARE_DIRECTIONS.E) as Square;
}
export function moveSouth(square: Square): Square {
  return (square + SQUARE_DIRECTIONS.S) as Square;
}
export function moveSouthEast(square: Square): Square {
  return (square + SQUARE_DIRECTIONS.SE) as Square;
}
export function moveSouthWest(square: Square): Square {
  return (square + SQUARE_DIRECTIONS.SW) as Square;
}
