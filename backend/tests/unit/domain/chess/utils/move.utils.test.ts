import { TEST_CATEGORIES } from "#/utils/test-constants.js";
import { beforeEach, describe, expect, it } from "vitest";
import * as TestMoveUtils from "@/domain/chess/utils/move.utils.js";
import {
  Move,
  MOVE_FLAGS,
  MoveFlag,
} from "@/domain/chess/movegen/move/move.types.js";
import { Square } from "@/domain/chess/board/types.chess.js";
import { SQUARES } from "@/domain/chess/board/board.constants.js";
import { MOVE_MASK } from "@/domain/chess/movegen/move/move.constants.js";

describe("move.utils", () => {
  let move: Move;
  let from: Square;
  let to: Square;
  let flag: MoveFlag;
  beforeEach(() => {
    from = 0 as Square;
    to = 10 as Square;
    flag = MOVE_FLAGS.Quiet;
    move = TestMoveUtils.createMove(from, to, flag);
  });
  describe(TEST_CATEGORIES.CREATION, () => {
    it("creates a valid move", () => {
      expect(Number.isInteger(move)).toBe(true);
      expect(move).toBeGreaterThanOrEqual(0);
      expect(move).toBeLessThanOrEqual(MOVE_MASK);
    });
  });
  describe(TEST_CATEGORIES.EXTRACTION, () => {
    describe(TestMoveUtils.getFrom.name, () => {
      it("gets the from square from the move", () => {
        expect(TestMoveUtils.getFrom(move)).toBe(from);
      });
    });
    describe(TestMoveUtils.getTo.name, () => {
      it("gets the to square from the move", () => {
        expect(TestMoveUtils.getTo(move)).toBe(to);
      });
    });
    describe(TestMoveUtils.getFlag.name, () => {
      it("gets the flag from the move", () => {
        expect(TestMoveUtils.getFlag(move)).toBe(flag);
      });
    });
  });
  describe(TEST_CATEGORIES.INSERTION, () => {
    describe(TestMoveUtils.setFrom.name, () => {
      it("sets the from square of a move", () => {
        let prev = from;
        for (const square of SQUARES) {
          expect(TestMoveUtils.getFrom(move)).toBe(prev);
          prev = square;
          move = TestMoveUtils.setFrom(move, square);
          expect(TestMoveUtils.getFrom(move)).toBe(square);
        }
      });
    });
    describe(TestMoveUtils.setTo.name, () => {
      it("sets the to square of a move", () => {
        let prev = to;
        for (const square of SQUARES) {
          expect(TestMoveUtils.getTo(move)).toBe(prev);
          prev = square;
          move = TestMoveUtils.setTo(move, square);
          expect(TestMoveUtils.getTo(move)).toBe(square);
        }
      });
    });
    describe(TestMoveUtils.setFlag.name, () => {
      it("sets the flag of a move", () => {
        let prev = flag;
        for (const newFlag of Object.values(MOVE_FLAGS)) {
          expect(TestMoveUtils.getFlag(move)).toBe(prev);
          prev = newFlag;
          move = TestMoveUtils.setFlag(move, newFlag);
          expect(TestMoveUtils.getFlag(move)).toBe(newFlag);
        }
      });
    });
  });
  describe(TEST_CATEGORIES.VALIDATION, () => {
    describe(TestMoveUtils.isValidMove.name, () => {
      it("returns true when a move is valid", () => {
        expect(TestMoveUtils.isValidMove(move)).toBe(true);
      });
      it("returns false with invalid input", () => {
        expect(TestMoveUtils.isValidMove(-1)).toBe(false);
        expect(TestMoveUtils.isValidMove(MOVE_MASK << 1)).toBe(false);
      });
    });
    describe(TestMoveUtils.hasValidFrom.name, () => {
      it("returns true for a moves valid from", () => {
        expect(TestMoveUtils.hasValidFrom(move)).toBe(true);
      });
    });
    describe(TestMoveUtils.hasValidTo.name, () => {
      it("returns true for a moves valid to", () => {
        expect(TestMoveUtils.hasValidTo(move)).toBe(true);
      });
    });
    describe(TestMoveUtils.hasValidFlag.name, () => {
      it("returns true for a moves valid flag", () => {
        expect(TestMoveUtils.hasValidFlag(move)).toBe(true);
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
