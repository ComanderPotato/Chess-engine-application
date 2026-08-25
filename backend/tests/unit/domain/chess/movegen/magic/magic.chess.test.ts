import { BISHOP_PIECE, ROOK_PIECE } from "#/fixtures/chess/piece.fixtures.js";
import { COORD_SQUARE_MAP } from "#/fixtures/chess/square.fixtures.js";
import { assertMagic } from "#/helpers/bitboard.helpers.js";
import { TEST_CATEGORIES } from "#/utils/test-constants.js";
import { BOARD_SIZE, SQUARES } from "@/domain/chess/board/board.constants.js";
import { printBitboard } from "@/domain/chess/debug/printer.chess.js";
import * as TestAttackBlocker from "@/domain/chess/movegen/attack/attack.blocker.js";
import * as TestAttackMask from "@/domain/chess/movegen/attack/attack.mask.js";
import * as TestMagicChess from "@/domain/chess/movegen/magic/magic.chess.js";
import * as TestBitUtil from "@/domain/chess/utils/bit.utils.js";
import { computeIndex } from "@/domain/chess/utils/magic.utils.js";
import { beforeAll, describe, expect, it } from "vitest";

describe("magic.chess", () => {
  describe(TEST_CATEGORIES.COMPUTATION, () => {
    describe(TestMagicChess.findSlidingMagic.name, () => {
      let diagonalMagic: bigint[];
      let diagonalAttacks: bigint[][];
      beforeAll(() => {
        diagonalMagic = new Array(BOARD_SIZE);
        diagonalAttacks = new Array(BOARD_SIZE);
        for (const square of SQUARES) {
          const diagonalMask =
            TestAttackMask.generateDiagonalAttackMask(square);
          const diagonalRelevantBits =
            TestAttackBlocker.getRelevantBlockerSquares(diagonalMask);
          const diagonalBlockerConfigs =
            TestAttackBlocker.generateBlockerConfigs(diagonalRelevantBits);
          const diagonalShift = BOARD_SIZE - diagonalRelevantBits.length;
          const diagonalResults = TestMagicChess.findSlidingMagic(
            square,
            diagonalShift,
            diagonalBlockerConfigs,
            BISHOP_PIECE,
          );

          diagonalMagic[square] = diagonalResults.magicNumber;
          diagonalAttacks[square] = diagonalResults.attackTable;
        }
      });
      describe("magic.diagonal", () => {
        it("verifies no index is undefined for diagonal pieces", () => {
          expect(diagonalAttacks.some((table) => table === undefined)).toBe(
            false,
          );
        });
        it("verifies a diagonal piece on E4 and blocker config of C2, F3, C6 and G6 outputs the correct attack", () => {
          const square = COORD_SQUARE_MAP.E4;
          const mask = TestAttackMask.generateDiagonalAttackMask(square);
          const relevantBits =
            TestAttackBlocker.getRelevantBlockerSquares(mask);
          const shift = BOARD_SIZE - relevantBits.length;

          const blocker =
            (1n << BigInt(COORD_SQUARE_MAP.C2)) |
            (1n << BigInt(COORD_SQUARE_MAP.F3)) |
            (1n << BigInt(COORD_SQUARE_MAP.C6)) |
            (1n << BigInt(COORD_SQUARE_MAP.G6));

          const attack =
            diagonalAttacks[square]![
              computeIndex(blocker, diagonalMagic[square]!, shift)
            ]!;

          printBitboard(mask, { title: "Test diagonal E4 mask" });
          printBitboard(blocker, {
            title: "Test diagonal C2, F3, C6, and G6 blocker",
          });
          printBitboard(attack, { title: "Attack" });
          expect(TestBitUtil.isBitSet64(attack, COORD_SQUARE_MAP.D3)).toBe(
            true,
          );
          expect(TestBitUtil.isBitSet64(attack, COORD_SQUARE_MAP.C2)).toBe(
            true,
          );
          expect(TestBitUtil.isBitSet64(attack, COORD_SQUARE_MAP.B1)).toBe(
            false,
          );

          expect(TestBitUtil.isBitSet64(attack, COORD_SQUARE_MAP.F3)).toBe(
            true,
          );
          expect(TestBitUtil.isBitSet64(attack, COORD_SQUARE_MAP.G2)).toBe(
            false,
          );
          expect(TestBitUtil.isBitSet64(attack, COORD_SQUARE_MAP.H1)).toBe(
            false,
          );

          expect(TestBitUtil.isBitSet64(attack, COORD_SQUARE_MAP.D5)).toBe(
            true,
          );
          expect(TestBitUtil.isBitSet64(attack, COORD_SQUARE_MAP.C6)).toBe(
            true,
          );
          expect(TestBitUtil.isBitSet64(attack, COORD_SQUARE_MAP.B7)).toBe(
            false,
          );
          expect(TestBitUtil.isBitSet64(attack, COORD_SQUARE_MAP.A8)).toBe(
            false,
          );

          expect(TestBitUtil.isBitSet64(attack, COORD_SQUARE_MAP.F5)).toBe(
            true,
          );
          expect(TestBitUtil.isBitSet64(attack, COORD_SQUARE_MAP.G6)).toBe(
            true,
          );
          expect(TestBitUtil.isBitSet64(attack, COORD_SQUARE_MAP.H7)).toBe(
            false,
          );
        });
        it("verifies the magic number maps blocker configuration to a diagonal attack for all squares", () => {
          for (const square of SQUARES) {
            const mask = TestAttackMask.generateDiagonalAttackMask(square);
            const relevantBits =
              TestAttackBlocker.getRelevantBlockerSquares(mask);
            const blockerConfigs =
              TestAttackBlocker.generateBlockerConfigs(relevantBits);
            const shift = BOARD_SIZE - relevantBits.length;

            for (const blocker of blockerConfigs) {
              const attack =
                diagonalAttacks[square]![
                  computeIndex(blocker, diagonalMagic[square]!, shift)
                ]!;

              assertMagic(square, attack, "NE", blocker);
              assertMagic(square, attack, "NW", blocker);
              assertMagic(square, attack, "SE", blocker);
              assertMagic(square, attack, "SW", blocker);
            }
          }
        });
      });
    });
    describe("magic.orthogonal", () => {
      let orthogonalMagic: bigint[];
      let orthogonalAttacks: bigint[][];
      beforeAll(() => {
        orthogonalMagic = new Array(BOARD_SIZE);
        orthogonalAttacks = new Array(BOARD_SIZE);
        for (const square of SQUARES) {
          const orthogonalMask =
            TestAttackMask.generateOrthogonalAttackMask(square);
          const orthogonalRelevantBits =
            TestAttackBlocker.getRelevantBlockerSquares(orthogonalMask);
          const orthogonalBlockerConfigs =
            TestAttackBlocker.generateBlockerConfigs(orthogonalRelevantBits);
          const orthogonalShift = BOARD_SIZE - orthogonalRelevantBits.length;
          const orthogonalResults = TestMagicChess.findSlidingMagic(
            square,
            orthogonalShift,
            orthogonalBlockerConfigs,
            ROOK_PIECE,
          );

          orthogonalMagic[square] = orthogonalResults.magicNumber;
          orthogonalAttacks[square] = orthogonalResults.attackTable;
        }
      });
      it("verifies no index is undefined for orthogonal pieces", () => {
        expect(orthogonalAttacks.some((table) => table === undefined)).toBe(
          false,
        );
      });
      it("verifies an orthogonal piece on E4 and blocker config of B4, G4, E6 and E3 outputs the correct attack", () => {
        const square = COORD_SQUARE_MAP.E4;
        const mask = TestAttackMask.generateOrthogonalAttackMask(square);
        const relevantBits = TestAttackBlocker.getRelevantBlockerSquares(mask);
        const shift = BOARD_SIZE - relevantBits.length;

        const blocker =
          (1n << BigInt(COORD_SQUARE_MAP.B4)) |
          (1n << BigInt(COORD_SQUARE_MAP.G4)) |
          (1n << BigInt(COORD_SQUARE_MAP.E6)) |
          (1n << BigInt(COORD_SQUARE_MAP.E3));

        const attack =
          orthogonalAttacks[square]![
            computeIndex(blocker, orthogonalMagic[square]!, shift)
          ]!;

        printBitboard(mask, { title: "Test orthgonal E4 mask" });
        printBitboard(blocker, {
          title: "Test diagonal B4, G4, E6, and E3 blocker",
        });
        printBitboard(attack, { title: "Attack" });
        expect(TestBitUtil.isBitSet64(attack, COORD_SQUARE_MAP.C4)).toBe(true);
        expect(TestBitUtil.isBitSet64(attack, COORD_SQUARE_MAP.B4)).toBe(true);
        expect(TestBitUtil.isBitSet64(attack, COORD_SQUARE_MAP.A4)).toBe(false);

        expect(TestBitUtil.isBitSet64(attack, COORD_SQUARE_MAP.F4)).toBe(true);
        expect(TestBitUtil.isBitSet64(attack, COORD_SQUARE_MAP.G4)).toBe(true);
        expect(TestBitUtil.isBitSet64(attack, COORD_SQUARE_MAP.H4)).toBe(false);

        expect(TestBitUtil.isBitSet64(attack, COORD_SQUARE_MAP.E5)).toBe(true);
        expect(TestBitUtil.isBitSet64(attack, COORD_SQUARE_MAP.E6)).toBe(true);
        expect(TestBitUtil.isBitSet64(attack, COORD_SQUARE_MAP.E7)).toBe(false);
        expect(TestBitUtil.isBitSet64(attack, COORD_SQUARE_MAP.E8)).toBe(false);

        expect(TestBitUtil.isBitSet64(attack, COORD_SQUARE_MAP.E3)).toBe(true);
        expect(TestBitUtil.isBitSet64(attack, COORD_SQUARE_MAP.E2)).toBe(false);
        expect(TestBitUtil.isBitSet64(attack, COORD_SQUARE_MAP.E1)).toBe(false);
      });
      it("verifies the magic number maps blocker configuration to a orthogonal attack for all squares", () => {
        for (const square of SQUARES) {
          const mask = TestAttackMask.generateOrthogonalAttackMask(square);
          const relevantBits =
            TestAttackBlocker.getRelevantBlockerSquares(mask);
          const blockerConfigs =
            TestAttackBlocker.generateBlockerConfigs(relevantBits);
          const shift = BOARD_SIZE - relevantBits.length;
          for (const blocker of blockerConfigs) {
            const attack =
              orthogonalAttacks[square]![
                computeIndex(blocker, orthogonalMagic[square]!, shift)
              ]!;
            assertMagic(square, attack, "N", blocker);
            assertMagic(square, attack, "E", blocker);
            assertMagic(square, attack, "S", blocker);
            assertMagic(square, attack, "W", blocker);
          }
        }
      });
    });
  });
});
