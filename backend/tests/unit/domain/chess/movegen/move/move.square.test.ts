import { describe, expect, it } from "vitest";
import * as TestMoveSquare from "@/domain/chess/movegen/move/move.square.js";
import { TEST_CATEGORIES } from "#/utils/test-constants.js";
import { FILES, RANKS, SQUARES } from "@/domain/chess/board/board.constants.js";
import { toFile, toRank } from "@/domain/chess/utils/square.utils.js";

describe("move.square", () => {
  describe(TEST_CATEGORIES.MOVEMENT, () => {
    describe.only.each([
      {
        fn: TestMoveSquare.moveNorth,
        inverseFn: TestMoveSquare.moveSouth,
        direction: "north",
        change: "rank",
        expectedChange: 8,
        skipFile: null,
        skipRank: RANKS.EIGHTH,
        fileDelta: 0,
        rankDelta: 1,
      },
      {
        fn: TestMoveSquare.moveSouth,
        inverseFn: TestMoveSquare.moveNorth,
        direction: "south",
        change: "rank",
        expectedChange: -8,
        skipFile: null,
        skipRank: RANKS.FIRST,
        fileDelta: 0,
        rankDelta: -1,
      },
      {
        fn: TestMoveSquare.moveEast,
        inverseFn: TestMoveSquare.moveWest,
        direction: "east",
        change: "file",
        expectedChange: 1,
        skipFile: FILES.H,
        skipRank: null,
        fileDelta: 1,
        rankDelta: 0,
      },

      {
        fn: TestMoveSquare.moveWest,
        inverseFn: TestMoveSquare.moveEast,
        direction: "west",
        change: "file",
        expectedChange: -1,
        skipFile: FILES.A,
        skipRank: null,
        fileDelta: -1,
        rankDelta: 0,
      },
      {
        fn: TestMoveSquare.moveNorthEast,
        inverseFn: TestMoveSquare.moveSouthWest,
        direction: "north east",
        change: "file and rank",
        expectedChange: 9,
        skipFile: FILES.H,
        skipRank: RANKS.EIGHTH,
        fileDelta: 1,
        rankDelta: 1,
      },
      {
        fn: TestMoveSquare.moveNorthWest,
        inverseFn: TestMoveSquare.moveSouthEast,
        direction: "north west",
        change: "file and rank",
        expectedChange: 7,
        skipFile: FILES.A,
        skipRank: RANKS.EIGHTH,
        fileDelta: -1,
        rankDelta: 1,
      },
      {
        fn: TestMoveSquare.moveSouthEast,
        inverseFn: TestMoveSquare.moveNorthWest,
        direction: "south east",
        change: "file and rank",
        expectedChange: -7,
        skipFile: FILES.H,
        skipRank: RANKS.FIRST,
        fileDelta: 1,
        rankDelta: -1,
      },
      {
        fn: TestMoveSquare.moveSouthWest,
        inverseFn: TestMoveSquare.moveNorthEast,
        direction: "south west",
        change: "file and rank",
        expectedChange: -9,
        skipFile: FILES.A,
        skipRank: RANKS.FIRST,
        fileDelta: -1,
        rankDelta: -1,
      },
    ])(
      "$fn.name",
      ({
        fn,
        inverseFn,
        direction,
        change,
        expectedChange,
        skipFile,
        skipRank,
        fileDelta,
        rankDelta,
      }) => {
        it(`${expectedChange > 0 ? "increments" : "decrements"} a value by ${Math.abs(expectedChange)}`, () => {
          for (const square of SQUARES) {
            expect(fn(square)).toBe(square + expectedChange);
          }
        });
        it(`moves a square one ${change} ${direction}`, () => {
          for (const square of SQUARES) {
            if (toRank(square) === skipRank) continue;
            if (toFile(square) === skipFile) continue;
            const result = fn(square);
            expect(toFile(result)).toBe(toFile(square) + fileDelta);
            expect(toRank(result)).toBe(toRank(square) + rankDelta);
            expect(inverseFn(result)).toBe(square);
          }
        });
      },
    );
  });
});
