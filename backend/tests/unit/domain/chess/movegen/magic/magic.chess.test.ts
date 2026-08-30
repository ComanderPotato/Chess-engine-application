import { beforeAll, describe, expect, it } from "vitest";
import { BISHOP_PIECE, ROOK_PIECE } from "#/fixtures/chess/piece.fixtures.js";
import { COORD_SQUARE_MAP } from "#/fixtures/chess/square.fixtures.js";
import { assertMagic } from "#/helpers/bitboard.helpers.js";
import { TEST_CATEGORIES } from "#/utils/test-constants.js";
import { BOARD_SIZE, SQUARES } from "@/domain/chess/board/board.constants.js";
import * as TestAttackBlocker from "@/domain/chess/movegen/attack/attack.blocker.js";
import * as TestAttackMask from "@/domain/chess/movegen/attack/attack.mask.js";
import * as TestMagicChess from "@/domain/chess/movegen/magic/magic.chess.js";
import * as TestBitUtil from "@/domain/chess/utils/bit.utils.js";
import { computeIndex } from "@/domain/chess/utils/magic.utils.js";

type MagicChessTestData = {
  mask: bigint;
  relevantBits: number[];
  blockerConfigs: bigint[];
  shift: number;
  magic: bigint;
  attacks: bigint[];
};
describe("magic.chess", () => {
  describe(TEST_CATEGORIES.COMPUTATION, () => {
    describe(TestMagicChess.findSlidingMagic.name, () => {
      describe("magic.diagonal", () => {
        let diagonal: MagicChessTestData[];
        beforeAll(() => {
          diagonal = new Array(BOARD_SIZE);
          for (const square of SQUARES) {
            const mask = TestAttackMask.generateDiagonalAttackMask(square);
            const relevantBits =
              TestAttackBlocker.getRelevantBlockerSquares(mask);
            const blockerConfigs =
              TestAttackBlocker.generateBlockerConfigs(relevantBits);
            const shift = BOARD_SIZE - relevantBits.length;
            const results = TestMagicChess.findSlidingMagic(
              square,
              shift,
              blockerConfigs,
              BISHOP_PIECE,
            );

            diagonal[square] = {
              mask,
              relevantBits,
              blockerConfigs,
              shift,
              magic: results.magicNumber,
              attacks: results.attackTable,
            };
          }
        });
        it("verifies a diagonal piece on E4 and blocker config of C2, F3, C6 and G6 outputs the correct attack", () => {
          const square = COORD_SQUARE_MAP.E4;

          const blocker =
            (1n << BigInt(COORD_SQUARE_MAP.C2)) |
            (1n << BigInt(COORD_SQUARE_MAP.F3)) |
            (1n << BigInt(COORD_SQUARE_MAP.C6)) |
            (1n << BigInt(COORD_SQUARE_MAP.G6));

          const attack =
            diagonal[square]!.attacks![
              computeIndex(
                blocker,
                diagonal[square]!.magic,
                diagonal[square]!.shift,
              )
            ]!;

          // printBitboard(diagonal[square]!.mask, {
          //   title: "Test diagonal E4 mask",
          // });
          // printBitboard(blocker, {
          //   title: "Test diagonal C2, F3, C6, and G6 blocker",
          // });
          // printBitboard(attack, { title: "Attack" });
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
            for (const blocker of diagonal[square]!.blockerConfigs) {
              const attack =
                diagonal[square]!.attacks[
                  computeIndex(
                    blocker,
                    diagonal[square]!.magic,
                    diagonal[square]!.shift,
                  )
                ]!;
              assertMagic(square, attack, "NE", blocker);
              assertMagic(square, attack, "NW", blocker);
              assertMagic(square, attack, "SE", blocker);
              assertMagic(square, attack, "SW", blocker);
            }
          }
        });
      });
      describe("magic.orthogonal", () => {
        let orthogonal: MagicChessTestData[];
        beforeAll(() => {
          orthogonal = new Array(BOARD_SIZE);
          for (const square of SQUARES) {
            const mask = TestAttackMask.generateOrthogonalAttackMask(square);
            const relevantBits =
              TestAttackBlocker.getRelevantBlockerSquares(mask);
            const blockerConfigs =
              TestAttackBlocker.generateBlockerConfigs(relevantBits);
            const shift = BOARD_SIZE - relevantBits.length;
            const results = TestMagicChess.findSlidingMagic(
              square,
              shift,
              blockerConfigs,
              ROOK_PIECE,
            );

            orthogonal[square] = {
              mask,
              relevantBits,
              blockerConfigs,
              shift,
              magic: results.magicNumber,
              attacks: results.attackTable,
            };
          }
        });
        it("verifies an orthogonal piece on E4 and blocker config of B4, G4, E6 and E3 outputs the correct attack", () => {
          const square = COORD_SQUARE_MAP.E4;

          const blocker =
            (1n << BigInt(COORD_SQUARE_MAP.B4)) |
            (1n << BigInt(COORD_SQUARE_MAP.G4)) |
            (1n << BigInt(COORD_SQUARE_MAP.E6)) |
            (1n << BigInt(COORD_SQUARE_MAP.E3));

          const attack =
            orthogonal[square]!.attacks[
              computeIndex(
                blocker,
                orthogonal[square]!.magic,
                orthogonal[square]!.shift,
              )
            ]!;

          // printBitboard(orthogonal[square]!.mask, {
          //   title: "Test orthgonal E4 mask",
          // });
          // printBitboard(blocker, {
          //   title: "Test diagonal B4, G4, E6, and E3 blocker",
          // });
          // printBitboard(attack, { title: "Attack" });
          expect(TestBitUtil.isBitSet64(attack, COORD_SQUARE_MAP.C4)).toBe(
            true,
          );
          expect(TestBitUtil.isBitSet64(attack, COORD_SQUARE_MAP.B4)).toBe(
            true,
          );
          expect(TestBitUtil.isBitSet64(attack, COORD_SQUARE_MAP.A4)).toBe(
            false,
          );

          expect(TestBitUtil.isBitSet64(attack, COORD_SQUARE_MAP.F4)).toBe(
            true,
          );
          expect(TestBitUtil.isBitSet64(attack, COORD_SQUARE_MAP.G4)).toBe(
            true,
          );
          expect(TestBitUtil.isBitSet64(attack, COORD_SQUARE_MAP.H4)).toBe(
            false,
          );

          expect(TestBitUtil.isBitSet64(attack, COORD_SQUARE_MAP.E5)).toBe(
            true,
          );
          expect(TestBitUtil.isBitSet64(attack, COORD_SQUARE_MAP.E6)).toBe(
            true,
          );
          expect(TestBitUtil.isBitSet64(attack, COORD_SQUARE_MAP.E7)).toBe(
            false,
          );
          expect(TestBitUtil.isBitSet64(attack, COORD_SQUARE_MAP.E8)).toBe(
            false,
          );

          expect(TestBitUtil.isBitSet64(attack, COORD_SQUARE_MAP.E3)).toBe(
            true,
          );
          expect(TestBitUtil.isBitSet64(attack, COORD_SQUARE_MAP.E2)).toBe(
            false,
          );
          expect(TestBitUtil.isBitSet64(attack, COORD_SQUARE_MAP.E1)).toBe(
            false,
          );
        });
        it("verifies the magic number maps blocker configuration to a orthogonal attack for all squares", () => {
          for (const square of SQUARES) {
            for (const blocker of orthogonal[square]!.blockerConfigs) {
              const attack =
                orthogonal[square]!.attacks[
                  computeIndex(
                    blocker,
                    orthogonal[square]!.magic,
                    orthogonal[square]!.shift,
                  )
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
});
