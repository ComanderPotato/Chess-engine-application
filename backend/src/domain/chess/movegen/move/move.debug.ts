import { Board } from "../../board/board.chess.js";
import { pieceToString } from "../../piece/piece.format.js";
import { coordToSquare, squareToCoord } from "../../utils/coord.utils.js";
import { getFlag, getFrom, getTo } from "./move.chess.js";
import { MOVE_FLAGS } from "./move.constants.js";
import { Move } from "./move.types.js";

export function decodeMove(board: Board, move: Move) {
  const from = getFrom(move);
  const to = getTo(move);
  const flag = getFlag(move);
  const desc = `${pieceToString(board.pieceAt(from))} moves ${squareToCoord(from)} to ${squareToCoord(to)} with flag ${moveFlagToString(flag)}`;
  return desc;
}
export function moveFlagToString(flag: number): string {
  return (
    Object.entries(MOVE_FLAGS).find(([, value]) => value === flag)?.[0] ??
    "Unknown"
  );
}
