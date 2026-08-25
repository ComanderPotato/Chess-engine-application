import { BISHOP_PIECE } from "#/fixtures/chess/piece.fixtures.js";
import { TEST_CATEGORIES } from "#/utils/test-constants.js";
import { BOARD_SIZE, SQUARES } from "@/domain/chess/board/board.constants.js";
import { printBitboard } from "@/domain/chess/debug/printer.chess.js";
import * as TestAttackMask from "@/domain/chess/movegen/attack/attack.mask.js";
import * as TestAttackPrecompute from "@/domain/chess/movegen/attack/attack.precompute.js";
import {
  BISHOP_MAGICS_PRECOMPUTE,
  BISHOP_SHIFTS_PRECOMPUTE,
} from "@/domain/chess/movegen/magic/bishop.magic.js";
import { describe, expect, it } from "vitest";

describe("attack.precompute", () => {
  describe(TEST_CATEGORIES.COMPUTATION, () => {
    describe(TestAttackPrecompute.precomputePawnAttackMasks.name, () => {
      it("precomputes pawn attack masks for every square", () => {
        const [white, black] = TestAttackPrecompute.precomputePawnAttackMasks();

        expect(white).toHaveLength(BOARD_SIZE);
        expect(black).toHaveLength(BOARD_SIZE);

        for (const square of SQUARES) {
          expect(white[square]).toBe(
            TestAttackMask.generateWhitePawnAttackMask(square),
          );

          expect(black[square]).toBe(
            TestAttackMask.generateBlackPawnAttackMask(square),
          );
        }
      });
    });
    describe(TestAttackPrecompute.precomputeKnightAttackMasks.name, () => {
      it("precomputes knight attack masks for every square", () => {
        const knightAttacks =
          TestAttackPrecompute.precomputeKnightAttackMasks();

        expect(knightAttacks).toHaveLength(BOARD_SIZE);

        for (const square of SQUARES) {
          expect(knightAttacks[square]).toBe(
            TestAttackMask.generateKnightAttackMask(square),
          );
        }
      });
    });
    describe(TestAttackPrecompute.precomputeDiagonalAttackMasks.name, () => {
      it("precomputes diagonal attack masks for every square", () => {
        const diagonalAttacks =
          TestAttackPrecompute.precomputeDiagonalAttackMasks();

        expect(diagonalAttacks).toHaveLength(BOARD_SIZE);

        for (const square of SQUARES) {
          expect(diagonalAttacks[square]).toBe(
            TestAttackMask.generateDiagonalAttackMask(square),
          );
        }
      });
    });
    describe(TestAttackPrecompute.precomputeOrthogonalAttackMasks.name, () => {
      it("precomputes orthogonal attack masks for every square", () => {
        const orthogonalAttacks =
          TestAttackPrecompute.precomputeOrthogonalAttackMasks();

        expect(orthogonalAttacks).toHaveLength(BOARD_SIZE);

        for (const square of SQUARES) {
          expect(orthogonalAttacks[square]).toBe(
            TestAttackMask.generateOrthogonalAttackMask(square),
          );
        }
      });
    });
    describe(TestAttackPrecompute.precomputeSlidingAttackTables.name, () => {
      it.only("precomputes diagonal attack tables for every square", () => {
        const table = TestAttackPrecompute.precomputeSlidingAttackTables(
          TestAttackPrecompute.precomputeDiagonalAttackMasks(),
          BISHOP_SHIFTS_PRECOMPUTE,
          BISHOP_MAGICS_PRECOMPUTE,
          BISHOP_PIECE,
        );
        expect(table).toBeDefined();
        expect(table).toHaveLength(BOARD_SIZE);
      });
      it("precomputes orthogonal attack tables for every square", () => {});
    });
    describe(TestAttackPrecompute.precomputeKingAttackMasks.name, () => {
      it("precomputes king attack masks for every square", () => {
        const kingAttacks = TestAttackPrecompute.precomputeKingAttackMasks();

        expect(kingAttacks).toHaveLength(BOARD_SIZE);

        for (const square of SQUARES) {
          expect(kingAttacks[square]).toBe(
            TestAttackMask.generateKingAttackMask(square),
          );
        }
      });
    });
  });
});

/*
 * precompute mask for each square, shift and magic for each square.
 * shift is just 64-relevant bits. Magic is trial and error to map
 * each attack to an index.
 */
