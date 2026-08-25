import {
  EXPECTED_PIECE_FORMATS,
  EXPECTED_COLOUR_FORMATS,
} from "#/fixtures/chess/piece.fixtures.js";
import { TEST_CATEGORIES } from "#/utils/test-constants.js";
import { pieceToString } from "@/domain/chess/piece/piece.format.js";
import { describe, expect, it } from "vitest";

describe("piece.format", () => {
  describe(TEST_CATEGORIES.FORMATTING, () => {
    describe(pieceToString.name, () => {
      it("returns the correct string representation for each piece", () => {
        for (const expectedPiece of EXPECTED_PIECE_FORMATS) {
          for (const expectedColour of EXPECTED_COLOUR_FORMATS) {
            expect(
              pieceToString(expectedPiece.type | expectedColour.colour),
            ).toBe(`${expectedColour.name} ${expectedPiece.name}`);
          }
        }
      });
    });
  });
});
