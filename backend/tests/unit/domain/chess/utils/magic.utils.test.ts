import { FULL_BOARD_MASK } from "@/domain/chess/board/board.constants.js";
import { describe, expect, it } from "vitest";
import * as MagicUtils from "@/domain/chess/utils/magic.utils.js";
import * as BitboardUtils from "@/domain/chess/utils/bitboard.utils.js";
import { TEST_CATEGORIES } from "#/utils/test-constants.js";

describe("magic.utils", () => {
  describe(TEST_CATEGORIES.COMPUTATION, () => {
    describe(MagicUtils.computeIndex.name, () => {
      it("computes magic index", () => {
        expect(MagicUtils.computeIndex(11n, 13n, 2)).toBe(35);
      });
      it("returns zero for empty blocker mask", () => {
        expect(MagicUtils.computeIndex(0n, 12345n, 4)).toBe(0);
      });
      it("applies shift correctly", () => {
        expect(MagicUtils.computeIndex(0xffn, 1n, 4)).toBe(15);
      });
      it("is deterministic", () => {
        const mask = 11n;
        const magic = 1n;
        const shift = 4;
        const first = MagicUtils.computeIndex(mask, magic, shift);
        const second = MagicUtils.computeIndex(mask, magic, shift);

        expect(first).toBe(second);
      });
    });
  });
  describe(TEST_CATEGORIES.GENERATION, () => {
    describe(MagicUtils.randomMagic.name, () => {
      it("generates a bigint type", () => {
        expect(typeof MagicUtils.randomMagic()).toBe("bigint");
      });
      it("generates a 64-bit value", () => {
        const magic = MagicUtils.randomMagic();
        expect(magic & ~FULL_BOARD_MASK).toBe(0n);
      });
      it("generates two unique magic numbers", () => {
        const first = MagicUtils.randomMagic();
        const second = MagicUtils.randomMagic();

        expect(first).not.toBe(second);
      });
      it("generates magic numbers with minimal duplicates", () => {
        const values = new Set();
        for (let i = 0; i < 100; i++) {
          values.add(MagicUtils.randomMagic());
        }
        expect(values.size).toBeGreaterThan(90);
      });
      it("generates a magic number and ensures sparse values", () => {
        const magic = MagicUtils.randomMagic();
        const bitCount = BitboardUtils.popCount(magic);
        expect(bitCount).toBeLessThan(32);
      });
    });
  });
});
