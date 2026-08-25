import * as BitboardUtils from "@/domain/chess/utils/bitboard.utils.js";
import * as BitUtils from "@/domain/chess/utils/bit.utils.js";
import { describe, expect, it, test } from "vitest";
import {
  BOARD_SIZE,
  EMPTY_BOARD_MASK,
  FILE_MASKS,
  FULL_BOARD_MASK,
  RANK_MASKS,
  RANK_SIZE,
} from "@/domain/chess/board/board.constants.js";
import {
  PIECE_COLOURS,
  PIECE_TYPES,
} from "@/domain/chess/piece/piece.constants.js";
import { TEST_CATEGORIES } from "#/utils/test-constants.js";

describe("bitboard.utils", () => {
  describe(TEST_CATEGORIES.MAPPING, () => {
    describe(`${BitboardUtils.pieceToIndex.name} and ${BitboardUtils.indexToPiece.name}`, () => {
      const pieces = Object.values(PIECE_TYPES).slice(1);
      it(`round-trips ${BitboardUtils.pieceToIndex.name} and ${BitboardUtils.indexToPiece.name}`, () => {
        for (let i = 0; i < pieces.length * 2; i++) {
          const index = i >= pieces.length ? i - pieces.length : i;
          const colour =
            i >= pieces.length ? PIECE_COLOURS.Black : PIECE_COLOURS.White;
          expect(BitboardUtils.pieceToIndex(pieces[index]! | colour)).toBe(i);
          expect(BitboardUtils.indexToPiece(i)).toBe(pieces[index]! | colour);
        }
      });
    });
  });
  describe(TEST_CATEGORIES.MANIPULATION, () => {
    describe(BitboardUtils.clearLSB.name, () => {
      it("removes the least significant bit", () => {
        expect(BitboardUtils.clearLSB(0b0001n)).toBe(0n);
        expect(BitboardUtils.clearLSB(0b1001n)).toBe(0b1000n);
        expect(BitboardUtils.clearLSB(0b1011n)).toBe(0b1010n);
        expect(BitboardUtils.clearLSB(BitUtils.setBit64(0n, 63))).toBe(0b0n);
      });
      it("does nothing if no bit was set", () => {
        expect(BitboardUtils.clearLSB(0b0n)).toBe(0n);
      });
      it("removes least significant bit until value is 0", () => {
        let value = 0b1011n;

        value = BitboardUtils.clearLSB(value);
        expect(value).toBe(0b1010n);

        value = BitboardUtils.clearLSB(value);
        expect(value).toBe(0b1000n);

        value = BitboardUtils.clearLSB(value);
        expect(value).toBe(0n);
      });
      it.for([[0b1111111n], [0b1001010n], [0b0001110n], [0b1010101n]])(
        "asserts that clearing the least significant bit reduces population count",
        ([a]) => {
          let value = a!;
          let population = BitboardUtils.popCount(value);
          while (value) {
            let nextValue = BitboardUtils.clearLSB(value);
            let nextPopulation = BitboardUtils.popCount(nextValue);
            expect(nextValue).not.toBe(value);
            expect(nextPopulation).toBe(population - 1);
            value = nextValue;
            population = nextPopulation;
          }
        },
      );
      it.for([[0b1111111n], [0b1001010n], [0b0001110n], [0b1010101n]])(
        "asserts that clearing the least significant bit exposes next index",
        ([a]) => {
          let value = a!;

          let index = BitboardUtils.getLSBIndex(value);
          while (index) {
            let nextValue = BitboardUtils.clearLSB(value);
            let nextIndex = BitboardUtils.getLSBIndex(nextValue);
            if (!nextIndex) {
              expect(nextValue).toBe(0n);
              expect(nextIndex).toBe(null);
              break;
            }
            expect(nextValue).not.toBe(value);
            expect(nextIndex).toBeGreaterThan(index);
            value = nextValue;
            index = nextIndex;
          }
        },
      );
    });
    describe(BitboardUtils.getLSBIndex.name, () => {
      it("returns the index of the least significant set bit", () => {
        expect(BitboardUtils.getLSBIndex(1n << 0n)).toBe(0);
        expect(BitboardUtils.getLSBIndex(1n << 4n)).toBe(4);
        expect(BitboardUtils.getLSBIndex(1n << 20n)).toBe(20);
        expect(BitboardUtils.getLSBIndex(1n << 50n)).toBe(50);
        expect(BitboardUtils.getLSBIndex(1n << 63n)).toBe(63);
      });

      it("returns null if bits between 0-63 are not set", () => {
        expect(BitboardUtils.getLSBIndex(0b0n)).toBe(null);
        expect(BitboardUtils.getLSBIndex(1n << 64n)).toBe(null);
        expect(BitboardUtils.getLSBIndex(1n << 128n)).toBe(null);
      });
    });
  });
  describe(TEST_CATEGORIES.POPULATION, () => {
    describe(BitboardUtils.popCount.name, () => {
      it("returns correct population of set bits for an increasing number", () => {
        let value = 0n;
        expect(BitboardUtils.popCount(value)).toBe(0);
        value |= 1n << 4n;
        expect(BitboardUtils.popCount(value)).toBe(1);
        value |= 1n << 5n;
        expect(BitboardUtils.popCount(value)).toBe(2);
        value |= 1n << 10n;
        expect(BitboardUtils.popCount(value)).toBe(3);
        value |= 1n << 15n;
        expect(BitboardUtils.popCount(value)).toBe(4);
        value |= 1n << 16n;
        expect(BitboardUtils.popCount(value)).toBe(5);
      });
      it("returns correct population of set bits for a decreasing number", () => {
        let value = 0b11111n;
        value &= ~(1n << 4n);
        expect(BitboardUtils.popCount(value)).toBe(4);
        value &= ~(1n << 3n);
        expect(BitboardUtils.popCount(value)).toBe(3);
        value &= ~(1n << 2n);
        expect(BitboardUtils.popCount(value)).toBe(2);
        value &= ~(1n << 1n);
        expect(BitboardUtils.popCount(value)).toBe(1);
        value &= ~(1n << 0n);
        expect(BitboardUtils.popCount(value)).toBe(0);
      });
      it("returns a population of 8 set bits for rank masks", () => {
        for (const rank of RANK_MASKS) {
          expect(BitboardUtils.popCount(rank)).toBe(RANK_SIZE);
        }
      });
      it("returns a population of 8 set bits for file masks", () => {
        for (const file of FILE_MASKS) {
          expect(BitboardUtils.popCount(file)).toBe(RANK_SIZE);
        }
      });
      it("returns a population of 64 set bits for the full board mask", () => {
        expect(BitboardUtils.popCount(FULL_BOARD_MASK)).toBe(BOARD_SIZE);
      });
      it("returns a population of 0 set bits for the empty board mask", () => {
        expect(BitboardUtils.popCount(EMPTY_BOARD_MASK)).toBe(0);
      });
    });
  });
});
