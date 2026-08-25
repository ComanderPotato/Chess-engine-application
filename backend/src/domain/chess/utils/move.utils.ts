import { Square } from "../board/types.chess.js";
import {
  MOVE_FLAG_SHIFT,
  MOVE_FROM_MASK,
  MOVE_MASK,
  MOVE_TO_MASK,
  MOVE_TO_SHIFT,
} from "../movegen/move/move.constants.js";
import { MOVE_FLAG_MASK } from "../movegen/move/move.constants.js";
import { Move, MOVE_FLAGS, MoveFlag } from "../movegen/move/move.types.js";
import { isValidSquare } from "./square.utils.js";

// Cast
export function toMove(value: number): Move {
  if (!isValidMove(value)) {
    throw new Error("Invalid move");
  }

  return value as Move;
}

// Creation
export function createMove(from: Square, to: Square, flag: MoveFlag): Move {
  return (from | (to << MOVE_TO_SHIFT) | (flag << MOVE_FLAG_SHIFT)) as Move;
}

// Validation
export function isValidMove(value: number): value is Move {
  if (!Number.isInteger(value)) return false;
  if (value < 0) return false;
  if (value > MOVE_MASK) return false;

  return hasValidFrom(value) && hasValidTo(value) && hasValidFlag(value);
}

export function hasValidFrom(value: number): boolean {
  return isValidSquare(extractFrom(value));
}
export function hasValidTo(value: number): boolean {
  return isValidSquare(extractTo(value));
}
export function hasValidFlag(value: number): boolean {
  return isValidFlag(extractFlag(value));
}

// insertion
export function setFrom(move: Move, from: Square): Move {
  return ((move & ~MOVE_FROM_MASK) | from) as Move;
}

export function setTo(move: Move, to: Square): Move {
  return ((move & ~MOVE_TO_MASK) | (to << MOVE_TO_SHIFT)) as Move;
}

export function setFlag(move: Move, flag: MoveFlag): Move {
  return ((move & ~MOVE_FLAG_MASK) | (flag << MOVE_FLAG_SHIFT)) as Move;
}

// Validated extraction
export function getFrom(move: Move): Square {
  return extractFrom(move) as Square;
}
export function getTo(move: Move): Square {
  return extractTo(move) as Square;
}
export function getFlag(move: Move): MoveFlag {
  return extractFlag(move) as MoveFlag;
}

// Unvalidated extraction
function extractFrom(value: number): number {
  return value & MOVE_FROM_MASK;
}
function extractTo(value: number): number {
  return (value & MOVE_TO_MASK) >> MOVE_TO_SHIFT;
}
function extractFlag(value: number): number {
  return (value & MOVE_FLAG_MASK) >> MOVE_FLAG_SHIFT;
}
export function isValidFlag(value: number): value is MoveFlag {
  return value >= MOVE_FLAGS.Quiet && value <= MOVE_FLAGS.Check;
}
