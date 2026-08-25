// import { Square } from "../../board/types.chess.js";
// import { isValidSquare, toSquare } from "../../utils/square.utils.js";
// import { Move, MoveFlag } from "./move.types.js";
//
// export const MOVE_FROM_BITS = 6;
// export const MOVE_TO_BITS = 6;
// export const MOVE_FLAG_BITS = 4;
// export const MOVE_FROM_SHIFT = 0;
// export const MOVE_TO_SHIFT = 6;
// export const MOVE_FLAG_SHIFT = 12;
//
// export const MOVE_FROM_MASK = 0b111111;
// export const MOVE_TO_MASK = MOVE_FROM_MASK << MOVE_TO_BITS;
//
// export const MOVE_FLAG_MASK = 0;
//
// //
//
// // export function createMove
// export function createMoveBitpack(
//   from: Square,
//   to: Square,
//   flag: MoveFlag,
// ): number {
//   if (!isValidSquare(from) || !isValidSquare(to))
//     throw new Error("Can't set move outside board limits");
//   return from | (to << MOVE_TO_BITS) | (1 << (MOVE_FLAG_SHIFT + flag));
// }
//
// export function getFrom(move: number): Square {
//   return (move & MOVE_FROM_MASK) as Square;
// }
// export function getTo(move: number): Square {
//   return ((move & MOVE_TO_MASK) >> MOVE_TO_SHIFT) as Square;
// }
