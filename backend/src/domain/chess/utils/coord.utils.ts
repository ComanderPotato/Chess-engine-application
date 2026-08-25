import { BOARD_DIMENSION } from "../board/board.constants.js";
import { Square } from "../board/types.chess.js";
import { fileRankToSquare, toFile, toRank, toSquare } from "./square.utils.js";

export function squareToCoord(value: number): string {
  const square = toSquare(value);
  const rank = toRank(square);
  const file = toFile(square);

  const fileLetter = String.fromCharCode("a".charCodeAt(0) + file);

  return `${fileLetter}${rank + 1}`;
}
function coordToFile(coord: string): number {
  const fileLetter = coord.at(0)!;
  if (fileLetter < "a" || fileLetter > "h")
    throw new Error("Invalid file coordinates");
  return fileLetter.charCodeAt(0) - "a".charCodeAt(0);
}
function coordToRank(coord: string): number {
  const rankChar = coord.at(1)!;
  if (rankChar < "1" || rankChar > "8")
    throw new Error("Invalid rank coordinates");
  return Number(rankChar) - 1;
}
export function coordToSquare(coord: string): Square {
  if (coord.length !== 2) throw new Error("Invalid input coordinates");

  const rank = coordToRank(coord);
  const file = coordToFile(coord);
  return (BOARD_DIMENSION * rank + file) as Square;
}

export function fileRankToCoord(file: number, rank: number): string {
  return squareToCoord(fileRankToSquare(file, rank));
}
