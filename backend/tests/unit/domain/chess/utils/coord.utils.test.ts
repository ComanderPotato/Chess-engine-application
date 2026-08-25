import { describe, expect, it } from "vitest";
import * as CoordUtils from "@/domain/chess/utils/coord.utils.js";
import { BOARD_SIZE } from "@/domain/chess/board/board.constants.js";
import { TEST_CATEGORIES } from "#/utils/test-constants.js";
import { EXPECTED_COORDS } from "#/fixtures/chess/square.fixtures.js";

describe("coord.utils", () => {
  describe(TEST_CATEGORIES.CONVERSION, () => {
    describe(CoordUtils.squareToCoord.name, () => {
      it("correctly converts a square to a board coordinate", () => {
        for (const [square, expectedCoord] of EXPECTED_COORDS.entries()) {
          expect(CoordUtils.squareToCoord(square)).toBe(expectedCoord);
        }
      });
    });
    describe(CoordUtils.coordToSquare.name, () => {
      it("correctly converts a board coordinate to its square", () => {
        for (const [expectedSquare, coord] of EXPECTED_COORDS.entries()) {
          expect(CoordUtils.coordToSquare(coord)).toBe(expectedSquare);
        }
      });
    });
  });
  describe(TEST_CATEGORIES.MAPPING, () => {
    describe(`${CoordUtils.coordToSquare.name} and ${CoordUtils.squareToCoord.name}`, () => {
      it(`round-trips ${CoordUtils.coordToSquare.name} and ${CoordUtils.squareToCoord.name}`, () => {
        for (let square = 0; square < BOARD_SIZE; square++) {
          const expected = EXPECTED_COORDS[square]!;
          expect(CoordUtils.coordToSquare(expected)).toBe(square);
          expect(CoordUtils.squareToCoord(square)).toBe(expected);
        }
      });
    });
  });
});
