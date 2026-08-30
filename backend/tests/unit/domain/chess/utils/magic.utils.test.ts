import { FULL_BOARD_MASK } from "@/domain/chess/board/board.constants.js";
import { describe, expect, it } from "vitest";
import * as TestMagicUtils from "@/domain/chess/utils/magic.utils.js";
import * as TestBitboardUtils from "@/domain/chess/utils/bitboard.utils.js";
import { TEST_CATEGORIES } from "#/utils/test-constants.js";

describe("magic.utils", () => {
  describe(TEST_CATEGORIES.COMPUTATION, () => {
    describe(TestMagicUtils.computeIndex.name, () => {
      it("computes magic index", () => {
        expect(TestMagicUtils.computeIndex(11n, 13n, 2)).toBe(35);
      });
      it("returns zero for empty blocker mask", () => {
        expect(TestMagicUtils.computeIndex(0n, 12345n, 4)).toBe(0);
      });
      it("applies shift correctly", () => {
        expect(TestMagicUtils.computeIndex(0xffn, 1n, 4)).toBe(15);
      });
      it("is deterministic", () => {
        const mask = 11n;
        const magic = 1n;
        const shift = 4;
        const first = TestMagicUtils.computeIndex(mask, magic, shift);
        const second = TestMagicUtils.computeIndex(mask, magic, shift);

        expect(first).toBe(second);
      });
    });
  });
  describe(TEST_CATEGORIES.GENERATION, () => {
    describe(TestMagicUtils.randomMagic.name, () => {
      it("generates a bigint type", () => {
        expect(typeof TestMagicUtils.randomMagic()).toBe("bigint");
      });
      it("generates a 64-bit value", () => {
        const magic = TestMagicUtils.randomMagic();
        expect(magic & ~FULL_BOARD_MASK).toBe(0n);
      });
      it("generates two unique magic numbers", () => {
        const first = TestMagicUtils.randomMagic();
        const second = TestMagicUtils.randomMagic();

        expect(first).not.toBe(second);
      });
      it("generates magic numbers with minimal duplicates", () => {
        const values = new Set();
        for (let i = 0; i < 100; i++) {
          values.add(TestMagicUtils.randomMagic());
        }
        expect(values.size).toBeGreaterThan(90);
      });
      it("", () => {});
      it("generates a magic number and ensures sparse values", () => {
        for (let i = 0; i < 100; i++) {
          const magic = TestMagicUtils.randomSparseBigint();
          const bitCount = TestBitboardUtils.popCount(magic);
          expect(bitCount).toBeLessThan(16);
        }
      });
    });
  });
});
