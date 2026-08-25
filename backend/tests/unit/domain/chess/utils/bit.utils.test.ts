import { TEST_CATEGORIES } from "#/utils/test-constants.js";
import * as BitUtils from "@/domain/chess/utils/bit.utils.js";
import { describe, expect, it } from "vitest";

describe("bit.utils", () => {
  const UNSET_32 = 0;
  const UNSET_64 = 0n;
  const BASE_32 = 1;
  const BASE_64 = 0b1n;

  const FIRST_BIT = 0;
  const MIDDLE_BIT = 10;
  const LAST_BIT_32 = 31;
  const LAST_BIT_64 = 63;
  describe(TEST_CATEGORIES.CLASSIFICATION, () => {
    describe("isBitSet", () => {
      describe(BitUtils.isBitSet32.name, () => {
        it("returns true for first bit", () => {
          expect(BitUtils.isBitSet32(BASE_32, FIRST_BIT)).toBe(true);
        });
        it("returns true for middle bit", () => {
          expect(BitUtils.isBitSet32(BASE_32 << MIDDLE_BIT, MIDDLE_BIT)).toBe(
            true,
          );
        });
        it("returns true for last bit", () => {
          expect(BitUtils.isBitSet32(BASE_32 << LAST_BIT_32, LAST_BIT_32)).toBe(
            true,
          );
        });
        it("returns false when bit not set", () => {
          expect(BitUtils.isBitSet32(UNSET_32, FIRST_BIT)).toBe(false);
          expect(BitUtils.isBitSet32(BASE_32, MIDDLE_BIT)).toBe(false);
          expect(BitUtils.isBitSet32(BASE_32, LAST_BIT_32)).toBe(false);
        });
      });
      describe(BitUtils.isBitSet64.name, () => {
        it("returns true for first bit", () => {
          expect(BitUtils.isBitSet64(BASE_64, FIRST_BIT)).toBe(true);
        });
        it("returns true for middle bit", () => {
          expect(
            BitUtils.isBitSet64(BASE_64 << BigInt(MIDDLE_BIT), MIDDLE_BIT),
          ).toBe(true);
        });
        it("returns true for last bit", () => {
          expect(
            BitUtils.isBitSet64(BASE_64 << BigInt(LAST_BIT_64), LAST_BIT_64),
          ).toBe(true);
        });
        it("returns false when bit not set", () => {
          expect(BitUtils.isBitSet64(UNSET_64, FIRST_BIT)).toBe(false);
          expect(BitUtils.isBitSet64(BASE_64, MIDDLE_BIT)).toBe(false);
          expect(BitUtils.isBitSet64(BASE_64, LAST_BIT_64)).toBe(false);
        });
      });
    });
  });
  describe(TEST_CATEGORIES.MANIPULATION, () => {
    describe("setBit", () => {
      describe(BitUtils.setBit32.name, () => {
        it("sets the first bit", () => {
          const result = BitUtils.setBit32(UNSET_32, FIRST_BIT);
          expect(BitUtils.isBitSet32(result, FIRST_BIT)).toBe(true);
          expect(result).not.toBe(UNSET_32);
        });
        it("sets the middle bit", () => {
          const result = BitUtils.setBit32(BASE_32, MIDDLE_BIT);
          expect(BitUtils.isBitSet32(result, MIDDLE_BIT)).toBe(true);
          expect(result).not.toBe(BASE_32);
        });
        it("sets the last bit", () => {
          const result = BitUtils.setBit32(BASE_32, LAST_BIT_32);
          expect(BitUtils.isBitSet32(result, LAST_BIT_32)).toBe(true);
          expect(result).not.toBe(BASE_32);
        });
        it("does not modify bits that are already set", () => {
          const first = BitUtils.setBit32(BASE_32, MIDDLE_BIT);
          const second = BitUtils.setBit32(first, MIDDLE_BIT);

          expect(first).toBe(second);
          expect(first).not.toBe(BASE_32);
          expect(second).not.toBe(BASE_32);
        });
        it("preserves all bits", () => {
          const value = BASE_32 | (1 << MIDDLE_BIT);
          const result = BitUtils.setBit32(value, LAST_BIT_32);
          expect(BitUtils.isBitSet32(result, FIRST_BIT)).toBe(true);
          expect(BitUtils.isBitSet32(result, MIDDLE_BIT)).toBe(true);
          expect(BitUtils.isBitSet32(result, LAST_BIT_32)).toBe(true);
        });
      });
      describe(BitUtils.setBit64.name, () => {
        it("sets the first bit", () => {
          const result = BitUtils.setBit64(UNSET_64, FIRST_BIT);
          expect(BitUtils.isBitSet64(result, FIRST_BIT)).toBe(true);
          expect(result).not.toBe(UNSET_64);
        });
        it("sets the middle bit", () => {
          const result = BitUtils.setBit64(BASE_64, MIDDLE_BIT);
          expect(BitUtils.isBitSet64(result, MIDDLE_BIT)).toBe(true);
          expect(result).not.toBe(BASE_64);
        });
        it("sets the last bit", () => {
          const result = BitUtils.setBit64(BASE_64, LAST_BIT_64);
          expect(BitUtils.isBitSet64(result, LAST_BIT_64)).toBe(true);
          expect(result).not.toBe(BASE_64);
        });
        it("does not modify bits that are already set", () => {
          const first = BitUtils.setBit64(BASE_64, MIDDLE_BIT);
          const second = BitUtils.setBit64(first, MIDDLE_BIT);

          expect(first).toBe(second);
          expect(first).not.toBe(BASE_64);
          expect(second).not.toBe(BASE_64);
        });
        it("preserves all bits", () => {
          const value = BASE_64 | (1n << BigInt(MIDDLE_BIT));
          const result = BitUtils.setBit64(value, LAST_BIT_64);
          expect(BitUtils.isBitSet64(result, FIRST_BIT)).toBe(true);
          expect(BitUtils.isBitSet64(result, MIDDLE_BIT)).toBe(true);
          expect(BitUtils.isBitSet64(result, LAST_BIT_64)).toBe(true);
        });
      });
    });
  });
  describe(TEST_CATEGORIES.MANIPULATION, () => {
    describe("clearBit", () => {
      describe(BitUtils.clearBit32.name, () => {
        it("clears the first bit", () => {
          const value = BASE_32;
          expect(BitUtils.isBitSet32(value, FIRST_BIT)).toBe(true);

          const result = BitUtils.clearBit32(value, FIRST_BIT);

          expect(result).not.toBe(value);
          expect(BitUtils.isBitSet32(result, FIRST_BIT)).toBe(false);

          expect(BitUtils.isBitSet32(result, FIRST_BIT)).not.toBe(
            BitUtils.isBitSet32(value, FIRST_BIT),
          );
        });
        it("clears the middle bit", () => {
          const value = BASE_32 << MIDDLE_BIT;
          expect(BitUtils.isBitSet32(value, MIDDLE_BIT)).toBe(true);

          const result = BitUtils.clearBit32(value, MIDDLE_BIT);

          expect(result).not.toBe(value);
          expect(BitUtils.isBitSet32(result, MIDDLE_BIT)).toBe(false);

          expect(BitUtils.isBitSet32(result, MIDDLE_BIT)).not.toBe(
            BitUtils.isBitSet32(value, MIDDLE_BIT),
          );
        });
        it("clears the last bit", () => {
          const value = BASE_32 << LAST_BIT_32;
          expect(BitUtils.isBitSet32(value, LAST_BIT_32)).toBe(true);

          const result = BitUtils.clearBit32(value, LAST_BIT_32);

          expect(result).not.toBe(value);
          expect(BitUtils.isBitSet32(result, LAST_BIT_32)).toBe(false);

          expect(BitUtils.isBitSet32(result, LAST_BIT_32)).not.toBe(
            BitUtils.isBitSet32(value, LAST_BIT_32),
          );
        });
        it("does not modify unset bits", () => {
          const value = BASE_32;

          const first = BitUtils.clearBit32(value, MIDDLE_BIT);
          const second = BitUtils.clearBit32(value, LAST_BIT_32);

          expect(value).toBe(first);
          expect(value).toBe(second);
        });
        it("only clears the specified bit", () => {
          const value = BASE_32 | (1 << MIDDLE_BIT) | (1 << LAST_BIT_32);

          expect(BitUtils.isBitSet32(value, FIRST_BIT)).toBe(true);
          expect(BitUtils.isBitSet32(value, MIDDLE_BIT)).toBe(true);
          expect(BitUtils.isBitSet32(value, LAST_BIT_32)).toBe(true);

          const cleared_first = BitUtils.clearBit32(value, FIRST_BIT);
          expect(BitUtils.isBitSet32(cleared_first, FIRST_BIT)).toBe(false);
          expect(BitUtils.isBitSet32(cleared_first, MIDDLE_BIT)).toBe(true);
          expect(BitUtils.isBitSet32(cleared_first, LAST_BIT_32)).toBe(true);

          const cleared_middle = BitUtils.clearBit32(value, MIDDLE_BIT);
          expect(BitUtils.isBitSet32(cleared_middle, FIRST_BIT)).toBe(true);
          expect(BitUtils.isBitSet32(cleared_middle, MIDDLE_BIT)).toBe(false);
          expect(BitUtils.isBitSet32(cleared_middle, LAST_BIT_32)).toBe(true);

          const cleared_last = BitUtils.clearBit32(value, LAST_BIT_32);
          expect(BitUtils.isBitSet32(cleared_last, FIRST_BIT)).toBe(true);
          expect(BitUtils.isBitSet32(cleared_last, MIDDLE_BIT)).toBe(true);
          expect(BitUtils.isBitSet32(cleared_last, LAST_BIT_32)).toBe(false);
        });
      });
      describe(BitUtils.clearBit64.name, () => {
        it("clears the first bit", () => {
          const value = BASE_64;
          expect(BitUtils.isBitSet64(value, FIRST_BIT)).toBe(true);

          const result = BitUtils.clearBit64(value, FIRST_BIT);

          expect(result).not.toBe(value);
          expect(BitUtils.isBitSet64(result, FIRST_BIT)).toBe(false);

          expect(BitUtils.isBitSet64(result, FIRST_BIT)).not.toBe(
            BitUtils.isBitSet64(value, FIRST_BIT),
          );
        });
        it("clears the middle bit", () => {
          const value = BASE_64 << BigInt(MIDDLE_BIT);
          expect(BitUtils.isBitSet64(value, MIDDLE_BIT)).toBe(true);

          const result = BitUtils.clearBit64(value, MIDDLE_BIT);

          expect(result).not.toBe(value);
          expect(BitUtils.isBitSet64(result, MIDDLE_BIT)).toBe(false);

          expect(BitUtils.isBitSet64(result, MIDDLE_BIT)).not.toBe(
            BitUtils.isBitSet64(value, MIDDLE_BIT),
          );
        });
        it("clears the last bit", () => {
          const value = BASE_64 << BigInt(LAST_BIT_64);
          expect(BitUtils.isBitSet64(value, LAST_BIT_64)).toBe(true);

          const result = BitUtils.clearBit64(value, LAST_BIT_64);

          expect(result).not.toBe(value);
          expect(BitUtils.isBitSet64(result, LAST_BIT_64)).toBe(false);

          expect(BitUtils.isBitSet64(result, LAST_BIT_64)).not.toBe(
            BitUtils.isBitSet64(value, LAST_BIT_64),
          );
        });
        it("does not modify unset bits", () => {
          const value = BASE_64;

          const first = BitUtils.clearBit64(value, MIDDLE_BIT);
          const second = BitUtils.clearBit64(value, LAST_BIT_64);

          expect(value).toBe(first);
          expect(value).toBe(second);
        });
        it("only clears the specified bit", () => {
          const value =
            BASE_64 | (1n << BigInt(MIDDLE_BIT)) | (1n << BigInt(LAST_BIT_64));

          expect(BitUtils.isBitSet64(value, FIRST_BIT)).toBe(true);
          expect(BitUtils.isBitSet64(value, MIDDLE_BIT)).toBe(true);
          expect(BitUtils.isBitSet64(value, LAST_BIT_64)).toBe(true);

          const cleared_first = BitUtils.clearBit64(value, FIRST_BIT);
          expect(BitUtils.isBitSet64(cleared_first, FIRST_BIT)).toBe(false);
          expect(BitUtils.isBitSet64(cleared_first, MIDDLE_BIT)).toBe(true);
          expect(BitUtils.isBitSet64(cleared_first, LAST_BIT_64)).toBe(true);

          const cleared_middle = BitUtils.clearBit64(value, MIDDLE_BIT);
          expect(BitUtils.isBitSet64(cleared_middle, FIRST_BIT)).toBe(true);
          expect(BitUtils.isBitSet64(cleared_middle, MIDDLE_BIT)).toBe(false);
          expect(BitUtils.isBitSet64(cleared_middle, LAST_BIT_64)).toBe(true);

          const cleared_last = BitUtils.clearBit64(value, LAST_BIT_64);
          expect(BitUtils.isBitSet64(cleared_last, FIRST_BIT)).toBe(true);
          expect(BitUtils.isBitSet64(cleared_last, MIDDLE_BIT)).toBe(true);
          expect(BitUtils.isBitSet64(cleared_last, LAST_BIT_64)).toBe(false);
        });
      });
    });
  });
});
