import {
  EXPECTED_FILES,
  EXPECTED_RANKS,
} from "#/fixtures/chess/square.fixtures.js";
import { TEST_CATEGORIES } from "#/utils/test-constants.js";
import {
  BOARD_DIMENSION,
  BOARD_SIZE,
  FILE_MASKS,
  FULL_BOARD_MASK,
  RANK_MASKS,
  SQUARES,
} from "@/domain/chess/board/board.constants.js";
import * as TestAttackBlocker from "@/domain/chess/movegen/attack/attack.blocker.js";
import * as TestAttackMask from "@/domain/chess/movegen/attack/attack.mask.js";
import { describe, expect, it } from "vitest";

describe("attack.blocker", () => {
  describe(TEST_CATEGORIES.POPULATION, () => {
    describe(TestAttackBlocker.getRelevantBlockerSquares.name, () => {
      it("returns zero relevant bits for an empty bitboard", () => {
        const value = 0n;
        expect(TestAttackBlocker.getRelevantBlockerSquares(value).length).toBe(
          0,
        );
      });
      it("returns 64 relevant bits for a full bitboard", () => {
        const value = FULL_BOARD_MASK;
        const relevantBits = TestAttackBlocker.getRelevantBlockerSquares(value);
        expect(relevantBits.length).toBe(BOARD_SIZE);
        for (const square of SQUARES) {
          expect(relevantBits[square]).toBe(square);
        }
      });
      it.each([
        { masks: FILE_MASKS, expected: EXPECTED_FILES, str: "file" },
        { masks: RANK_MASKS, expected: EXPECTED_RANKS, str: "rank" },
      ])(`returns relevant bits for each $str mask`, ({ masks, expected }) => {
        for (let mask = 0; mask < masks.length; mask++) {
          const relevantBits = TestAttackBlocker.getRelevantBlockerSquares(
            masks[mask]!,
          );
          expect(relevantBits.length).toBe(BOARD_DIMENSION);
          for (const bit of relevantBits) {
            expect(expected[bit]).toBe(mask);
          }
        }
      });
      it("asserts only set bits are included on predetermined mask", () => {
        const bits = new Set([0, 3, 7, 18, 31, 42, 56, 63]);
        let mask = 0n;
        for (const bit of bits) {
          mask |= 1n << BigInt(bit);
        }
        const result = TestAttackBlocker.getRelevantBlockerSquares(mask);
        expect(result).toHaveLength(bits.size);
        expect(result).toEqual(expect.arrayContaining([...bits]));
      });
      it("asserts only set bits are included on random mask", () => {
        for (let i = 0; i < 100; i++) {
          const bits = new Set(
            Array.from({ length: Math.floor(Math.random() * BOARD_SIZE) }, () =>
              Math.floor(Math.random() * BOARD_SIZE),
            ),
          );
          let mask = 0n;
          for (const bit of bits) {
            mask |= 1n << BigInt(bit);
          }
          const result = TestAttackBlocker.getRelevantBlockerSquares(mask);
          expect(result).toHaveLength(bits.size);
          expect(result).toEqual(expect.arrayContaining([...bits]));
        }
      });
    });
  });

  describe(TEST_CATEGORIES.GENERATION, () => {
    it("generates every blocker configuration", () => {
      const relevantBits = [0, 3, 5];
      const blockerConfig =
        TestAttackBlocker.generateBlockerConfigs(relevantBits);
      expect(blockerConfig).toEqual(
        expect.arrayContaining([
          0b000000n,
          0b000001n,
          0b001000n,
          0b001001n,
          0b100000n,
          0b100001n,
          0b101000n,
          0b101001n,
        ]),
      );
    });
    it("asserts only relevant bits are set", () => {
      for (const mask of [...FILE_MASKS, ...RANK_MASKS]) {
        const relevantBits = TestAttackBlocker.getRelevantBlockerSquares(mask);

        const relevantMask = relevantBits.reduce(
          (mask, bit) => mask | (1n << BigInt(bit)),
          0n,
        );

        const blockers = TestAttackBlocker.generateBlockerConfigs(relevantBits);
        for (const blocker of blockers) {
          expect(blocker & ~relevantMask).toBe(0n);
        }
      }
    });
    it("asserts blocker configurations are in ascending order", () => {
      const relevantBits = [0, 3, 5];
      const blockerConfig =
        TestAttackBlocker.generateBlockerConfigs(relevantBits);

      const sorted = blockerConfig.sort();
      expect(blockerConfig).toEqual(sorted);
    });
    it("asserts only unique blocker configurations", () => {
      for (const square of SQUARES) {
        const ray = TestAttackMask.generateOrthogonalAttackMask(square);
        const relevantBits = TestAttackBlocker.getRelevantBlockerSquares(ray);
        const blockerConfigs =
          TestAttackBlocker.generateBlockerConfigs(relevantBits);

        expect(new Set(blockerConfigs)).toHaveLength(blockerConfigs.length);
      }
    });
  });
});
