import { describe, expect, it } from "vitest";
import * as TestMoveUtils from "@/domain/chess/utils/move.utils.js";
import { TEST_CATEGORIES } from "#/utils/test-constants.js";
import { EXPECTED_RANKS } from "#/fixtures/chess/square.fixtures.js";
import { RANKS, SQUARES } from "@/domain/chess/board/board.constants.js";
import { Board } from "@/domain/chess/board/board.chess.js";
import {
  printBitboard,
  printChessBoard,
} from "@/domain/chess/debug/printer.chess.js";

describe("move.utils", () => {
  describe(TEST_CATEGORIES.UNCATEGORISED, () => {
    describe(TestMoveUtils.isOccupied, () => {
      it("returns true when a to square", () => {});
    });
  });
  describe(TEST_CATEGORIES.CLASSIFICATION, () => {
    describe(TestMoveUtils.isPawnPromotion.name, () => {
      it("returns true only a move to the first or eighth rank", () => {
        for (const square of SQUARES) {
          expect(TestMoveUtils.isPawnPromotion(square)).toBe(
            EXPECTED_RANKS[square] === RANKS.FIRST ||
              EXPECTED_RANKS[square] === RANKS.EIGHTH,
          );
        }
      });
    });
    describe(TestMoveUtils.generatePawnMoveBoard.name, () => {
      it("test", () => {
        const board = new Board();
        const a = TestMoveUtils.generatePawnMoveBoard(
          board,
          board.activeColour,
        );
        printChessBoard(board);
        printBitboard(a);
      });
    });
  });
});
