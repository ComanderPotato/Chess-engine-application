import { beforeAll, describe, expect, it } from "vitest";
import * as TestMagicGenerate from "@/domain/chess/movegen/magic/magic.generate.js";
import * as TestAttackMask from "@/domain/chess/movegen/attack/attack.mask.js";
import * as TestAttackBlocker from "@/domain/chess/movegen/attack/attack.blocker.js";
import * as TestBitboardUtils from "@/domain/chess/utils/bitboard.utils.js";
import * as TestMagicUtils from "@/domain/chess/utils/magic.utils.js";
import { BISHOP_PIECE, ROOK_PIECE } from "#/fixtures/chess/piece.fixtures.js";
import { BOARD_SIZE, SQUARES } from "@/domain/chess/board/board.constants.js";
import { TEST_CATEGORIES } from "#/utils/test-constants.js";

type MagicGenerateTestData = {
  shifts: number[];
  magics: bigint[];
};

describe("magic.generate", () => {
  describe(TEST_CATEGORIES.COMPUTATION, () => {
    describe(TestMagicGenerate.generateSlidingMagics.name, () => {
      let diagonal: MagicGenerateTestData;
      let orthogonal: MagicGenerateTestData;
      beforeAll(() => {
        diagonal = TestMagicGenerate.generateSlidingMagics(BISHOP_PIECE);
        orthogonal = TestMagicGenerate.generateSlidingMagics(ROOK_PIECE);
      });
      it("returns populated arrays of the correct size", () => {
        expect(diagonal.shifts).toHaveLength(BOARD_SIZE);
        expect(diagonal.magics).toHaveLength(BOARD_SIZE);
        expect(orthogonal.shifts).toHaveLength(BOARD_SIZE);
        expect(orthogonal.magics).toHaveLength(BOARD_SIZE);

        expect(diagonal.shifts).not.toContain(undefined);
        expect(diagonal.magics).not.toContain(undefined);
        expect(orthogonal.shifts).not.toContain(undefined);
        expect(orthogonal.magics).not.toContain(undefined);
      });
      it("verifies correct shift calculations for diagonal pieces", () => {
        for (const square of SQUARES) {
          const mask = TestAttackMask.generateDiagonalAttackMask(square);
          const relevantBits = TestBitboardUtils.popCount(mask);
          expect(diagonal.shifts[square]!).toBe(BOARD_SIZE - relevantBits);
        }
      });
      it("verifies correct shift calculations for orthogonal pieces", () => {
        for (const square of SQUARES) {
          const mask = TestAttackMask.generateOrthogonalAttackMask(square);
          const relevantBits = TestBitboardUtils.popCount(mask);
          expect(orthogonal.shifts[square]!).toBe(BOARD_SIZE - relevantBits);
        }
      });
      it("verifies shifts and magic numbers map blocker configurations to a valid index for diagonal pieces", () => {
        for (const square of SQUARES) {
          const mask = TestAttackMask.generateDiagonalAttackMask(square);
          const relevantBits =
            TestAttackBlocker.getRelevantBlockerSquares(mask);
          const blockerConfigs =
            TestAttackBlocker.generateBlockerConfigs(relevantBits);
          for (const blocker of blockerConfigs) {
            const index = TestMagicUtils.computeIndex(
              blocker,
              diagonal.magics[square]!,
              diagonal.shifts[square]!,
            );
            expect(index).toBeGreaterThanOrEqual(0);
            expect(index).toBeLessThan(blockerConfigs.length);
          }
        }
      });
      it("verifies shifts and magic numbers map blocker configurations to a valid index for orthogonal pieces", () => {
        for (const square of SQUARES) {
          const mask = TestAttackMask.generateOrthogonalAttackMask(square);
          const relevantBits =
            TestAttackBlocker.getRelevantBlockerSquares(mask);
          const blockerConfigs =
            TestAttackBlocker.generateBlockerConfigs(relevantBits);
          for (const blocker of blockerConfigs) {
            const index = TestMagicUtils.computeIndex(
              blocker,
              orthogonal.magics[square]!,
              orthogonal.shifts[square]!,
            );
            expect(index).toBeGreaterThanOrEqual(0);
            expect(index).toBeLessThan(blockerConfigs.length);
          }
        }
      });
    });
  });
});
