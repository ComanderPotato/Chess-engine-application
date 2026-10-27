import { TEST_CATEGORIES } from "#/utils/test-constants.js";
import { beforeEach, describe, expect, it } from "vitest";
import * as TestMoveChess from "@/domain/chess/movegen/move/move.chess.js";
import { Move } from "@/domain/chess/movegen/move/move.types.js";
import { Square } from "@/domain/chess/board/types.chess.js";
import { SQUARES } from "@/domain/chess/board/board.constants.js";
import {
  MOVE_FLAGS,
  MOVE_MASK,
  MoveFlag,
} from "@/domain/chess/movegen/move/move.constants.js";

describe("move.chess", () => {
  let move: Move;
  let from: Square;
  let to: Square;
  let flag: MoveFlag;
  beforeEach(() => {
    from = 0 as Square;
    to = 10 as Square;
    flag = MOVE_FLAGS.Quiet;
    move = TestMoveChess.createMove(from, to, flag);
  });
  describe(TEST_CATEGORIES.CREATION, () => {
    it("creates a valid move", () => {
      expect(Number.isInteger(move)).toBe(true);
      expect(move).toBeGreaterThanOrEqual(0);
      expect(move).toBeLessThanOrEqual(MOVE_MASK);
    });
  });
  describe(TEST_CATEGORIES.EXTRACTION, () => {
    describe(TestMoveChess.getFrom.name, () => {
      it("gets the from square from the move", () => {
        expect(TestMoveChess.getFrom(move)).toBe(from);
      });
    });
    describe(TestMoveChess.getTo.name, () => {
      it("gets the to square from the move", () => {
        expect(TestMoveChess.getTo(move)).toBe(to);
      });
    });
    describe(TestMoveChess.getFlag.name, () => {
      it("gets the flag from the move", () => {
        expect(TestMoveChess.getFlag(move)).toBe(flag);
      });
    });
  });
  describe(TEST_CATEGORIES.INSERTION, () => {
    describe(TestMoveChess.setFrom.name, () => {
      it("sets the from square of a move", () => {
        let prev = from;
        for (const square of SQUARES) {
          expect(TestMoveChess.getFrom(move)).toBe(prev);
          prev = square;
          move = TestMoveChess.setFrom(move, square);
          expect(TestMoveChess.getFrom(move)).toBe(square);
        }
      });
    });
    describe(TestMoveChess.setTo.name, () => {
      it("sets the to square of a move", () => {
        let prev = to;
        for (const square of SQUARES) {
          expect(TestMoveChess.getTo(move)).toBe(prev);
          prev = square;
          move = TestMoveChess.setTo(move, square);
          expect(TestMoveChess.getTo(move)).toBe(square);
        }
      });
    });
    describe(TestMoveChess.setFlag.name, () => {
      it("sets the flag of a move", () => {
        let prev = flag;
        for (const newFlag of Object.values(MOVE_FLAGS)) {
          expect(TestMoveChess.getFlag(move)).toBe(prev);
          prev = newFlag;
          move = TestMoveChess.setFlag(move, newFlag);
          expect(TestMoveChess.getFlag(move)).toBe(newFlag);
        }
      });
    });
  });
  describe(TEST_CATEGORIES.VALIDATION, () => {
    describe(TestMoveChess.isValidMove.name, () => {
      it("returns true when a move is valid", () => {
        expect(TestMoveChess.isValidMove(move)).toBe(true);
      });
      it("returns false with invalid input", () => {
        expect(TestMoveChess.isValidMove(-1)).toBe(false);
        expect(TestMoveChess.isValidMove(MOVE_MASK << 1)).toBe(false);
      });
    });
    describe(TestMoveChess.hasValidFrom.name, () => {
      it("returns true for a moves valid from", () => {
        expect(TestMoveChess.hasValidFrom(move)).toBe(true);
      });
    });
    describe(TestMoveChess.hasValidTo.name, () => {
      it("returns true for a moves valid to", () => {
        expect(TestMoveChess.hasValidTo(move)).toBe(true);
      });
    });
    describe(TestMoveChess.hasValidFlag.name, () => {
      it("returns true for a moves valid flag", () => {
        expect(TestMoveChess.hasValidFlag(move)).toBe(true);
      });
    });
  });
});
// describe(TEST_CATEGORIES.CREATION, () => {
//   describe(TestMoveUtils.createMove.name, () => {
//     it("creates a valid move", () => {
//       for (const from of SQUARES) {
//         for (const to of SQUARES) {
//           for (const flag of Object.values(MOVE_FLAGS)) {
//             const move = TestMoveUtils.createMove(from, to, flag);
//
//             expect(TestMoveUtils.getFrom(move)).toBe(from);
//             expect(TestMoveUtils.getTo(move)).toBe(to);
//             expect(TestMoveUtils.getFlag(move)).toBe(flag);
//             expect(move & ~MOVE_MASK).toBe(0);
//           }
//         }
//       }
//     });
//   });
// });
