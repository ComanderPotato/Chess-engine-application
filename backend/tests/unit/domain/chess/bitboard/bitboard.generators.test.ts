import { TEST_CATEGORIES } from "#/utils/test-constants.js";
import {
  generateFileMask,
  generateLightSquaresMask,
  generateRankMask,
} from "@/domain/chess/bitboard/bitboard.generators.js";
import {
  FILE_MASKS,
  RANK_MASKS,
} from "@/domain/chess/board/board.constants.js";
import { printBitboard } from "@/domain/chess/debug/printer.chess.js";
import { describe, expect, it } from "vitest";

describe("bitboard.generators", () => {
  describe(TEST_CATEGORIES.GENERATION, () => {
    describe(generateRankMask.name, () => {
      it("generates a mask of a single rank", () => {
        for (const [index, mask] of RANK_MASKS.entries()) {
          expect(generateRankMask(index)).toBe(mask);
        }
      });
      it("generates a mask of multiple ranks", () => {
        for (let i = 0; i < RANK_MASKS.length; i++) {
          for (let j = i; j < RANK_MASKS.length; j++) {
            let expected = 0n;
            for (let k = i; k <= j; k++) {
              expected |= RANK_MASKS[k]!;
            }
            expect(generateRankMask(i, j)).toBe(expected);
          }
        }
      });
    });
    describe(generateFileMask.name, () => {
      it("generates a mask of a single file", () => {
        for (const [index, mask] of FILE_MASKS.entries()) {
          expect(generateFileMask(index)).toBe(mask);
        }
      });
      it("generates a mask of multiple ranks", () => {
        for (let i = 0; i < FILE_MASKS.length; i++) {
          for (let j = i; j < FILE_MASKS.length; j++) {
            let expected = 0n;
            for (let k = i; k <= j; k++) {
              expected |= FILE_MASKS[k]!;
            }
            expect(generateFileMask(i, j)).toBe(expected);
          }
        }
      });
    });
    describe.todo(generateLightSquaresMask.name, () => {});
  });
});
