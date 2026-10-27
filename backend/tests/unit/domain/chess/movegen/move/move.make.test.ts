import { COORD_SQUARE_MAP } from "#/fixtures/chess/square.fixtures.js";
import { TEST_CATEGORIES } from "#/utils/test-constants.js";
import { Board } from "@/domain/chess/board/board.chess.js";
import { createMove } from "@/domain/chess/movegen/move/move.chess.js";
import { MOVE_FLAGS } from "@/domain/chess/movegen/move/move.constants.js";
import * as MoveMake from "@/domain/chess/movegen/move/move.make.js";
import { describe } from "vitest";

describe("move.make", () => {
  describe(TEST_CATEGORIES.UNCATEGORISED, () => {
    describe(MoveMake.makeMove.name, () => {
      const board = new Board();
      const originalState = board.getState();
      MoveMake.makeMove(
        board,
        createMove(COORD_SQUARE_MAP.E2, COORD_SQUARE_MAP.E3, MOVE_FLAGS.Quiet),
      );
    });
  });
});
