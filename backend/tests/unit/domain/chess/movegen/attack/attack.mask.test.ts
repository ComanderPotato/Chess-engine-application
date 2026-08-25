import {
  BISHOP_PIECE,
  QUEEN_PIECE,
  ROOK_PIECE,
} from "#/fixtures/chess/piece.fixtures.js";
import { COORD_SQUARE_MAP } from "#/fixtures/chess/square.fixtures.js";
import { assertRay } from "#/helpers/bitboard.helpers.js";
import { EDGE_MASK } from "@/domain/chess/bitboard/bitboard.masks.js";
import {
  BOARD_MASK,
  NOT_A_FILE_MASK,
  NOT_AB_FILES_MASK,
  NOT_GH_FILES_MASK,
  NOT_H_FILE_MASK,
  SQUARES,
} from "@/domain/chess/board/board.constants.js";
import * as TestAttackMask from "@/domain/chess/movegen/attack/attack.mask.js";
import { isBitSet64 } from "@/domain/chess/utils/bit.utils.js";
import { describe, expect, it } from "vitest";

describe("attack.mask", () => {
  describe(TestAttackMask.generateDiagonalAttackMask.name, () => {
    it("generates a diagonal attack mask for a A1", () => {
      const mask = TestAttackMask.generateDiagonalAttackMask(
        COORD_SQUARE_MAP.A1,
      );
      // printBitboard(mask);
      expect(isBitSet64(mask, COORD_SQUARE_MAP.B2)).toBe(true);
      expect(isBitSet64(mask, COORD_SQUARE_MAP.C3)).toBe(true);
      expect(isBitSet64(mask, COORD_SQUARE_MAP.D4)).toBe(true);
      expect(isBitSet64(mask, COORD_SQUARE_MAP.E5)).toBe(true);
      expect(isBitSet64(mask, COORD_SQUARE_MAP.F6)).toBe(true);
      expect(isBitSet64(mask, COORD_SQUARE_MAP.G7)).toBe(true);

      expect(mask & ~BOARD_MASK).toBe(0n);
    });
    it("generates a diagonal attack mask for a E4", () => {
      const mask = TestAttackMask.generateDiagonalAttackMask(
        COORD_SQUARE_MAP.E4,
      );
      expect(isBitSet64(mask, COORD_SQUARE_MAP.F5)).toBe(true);
      expect(isBitSet64(mask, COORD_SQUARE_MAP.G6)).toBe(true);
      expect(isBitSet64(mask, COORD_SQUARE_MAP.H7)).toBe(false);

      expect(isBitSet64(mask, COORD_SQUARE_MAP.F3)).toBe(true);
      expect(isBitSet64(mask, COORD_SQUARE_MAP.G2)).toBe(true);
      expect(isBitSet64(mask, COORD_SQUARE_MAP.H1)).toBe(false);

      expect(isBitSet64(mask, COORD_SQUARE_MAP.D3)).toBe(true);
      expect(isBitSet64(mask, COORD_SQUARE_MAP.C2)).toBe(true);
      expect(isBitSet64(mask, COORD_SQUARE_MAP.A1)).toBe(false);

      expect(isBitSet64(mask, COORD_SQUARE_MAP.D5)).toBe(true);
      expect(isBitSet64(mask, COORD_SQUARE_MAP.C6)).toBe(true);
      expect(isBitSet64(mask, COORD_SQUARE_MAP.B7)).toBe(true);
      expect(isBitSet64(mask, COORD_SQUARE_MAP.A8)).toBe(false);
    });
    it("generates a diagonal attack mask for each square", () => {
      for (const square of SQUARES) {
        const mask = TestAttackMask.generateDiagonalAttackMask(square);
        assertRay(square, mask, "NE", true, EDGE_MASK);
        assertRay(square, mask, "NW", true, EDGE_MASK);
        assertRay(square, mask, "SE", true, EDGE_MASK);
        assertRay(square, mask, "SW", true, EDGE_MASK);
      }
    });
  });
  describe(TestAttackMask.generateOrthogonalAttackMask.name, () => {
    it("generates a orthogonal attack mask for a A1", () => {
      const mask = TestAttackMask.generateOrthogonalAttackMask(
        COORD_SQUARE_MAP.A1,
      );
      expect(isBitSet64(mask, COORD_SQUARE_MAP.B1)).toBe(true);
      expect(isBitSet64(mask, COORD_SQUARE_MAP.C1)).toBe(true);
      expect(isBitSet64(mask, COORD_SQUARE_MAP.D1)).toBe(true);
      expect(isBitSet64(mask, COORD_SQUARE_MAP.E1)).toBe(true);
      expect(isBitSet64(mask, COORD_SQUARE_MAP.F1)).toBe(true);
      expect(isBitSet64(mask, COORD_SQUARE_MAP.G1)).toBe(true);
      expect(isBitSet64(mask, COORD_SQUARE_MAP.H1)).toBe(false);

      expect(isBitSet64(mask, COORD_SQUARE_MAP.A2)).toBe(true);
      expect(isBitSet64(mask, COORD_SQUARE_MAP.A3)).toBe(true);
      expect(isBitSet64(mask, COORD_SQUARE_MAP.A4)).toBe(true);
      expect(isBitSet64(mask, COORD_SQUARE_MAP.A5)).toBe(true);
      expect(isBitSet64(mask, COORD_SQUARE_MAP.A6)).toBe(true);
      expect(isBitSet64(mask, COORD_SQUARE_MAP.A7)).toBe(true);
      expect(isBitSet64(mask, COORD_SQUARE_MAP.A8)).toBe(false);
    });
    it("generates a orthogonal attack mask for a E4", () => {
      const mask = TestAttackMask.generateOrthogonalAttackMask(
        COORD_SQUARE_MAP.E4,
      );
      expect(isBitSet64(mask, COORD_SQUARE_MAP.E1)).toBe(false);
      expect(isBitSet64(mask, COORD_SQUARE_MAP.E2)).toBe(true);
      expect(isBitSet64(mask, COORD_SQUARE_MAP.E3)).toBe(true);
      expect(isBitSet64(mask, COORD_SQUARE_MAP.E5)).toBe(true);
      expect(isBitSet64(mask, COORD_SQUARE_MAP.E6)).toBe(true);
      expect(isBitSet64(mask, COORD_SQUARE_MAP.E7)).toBe(true);
      expect(isBitSet64(mask, COORD_SQUARE_MAP.E8)).toBe(false);

      expect(isBitSet64(mask, COORD_SQUARE_MAP.A4)).toBe(false);
      expect(isBitSet64(mask, COORD_SQUARE_MAP.B4)).toBe(true);
      expect(isBitSet64(mask, COORD_SQUARE_MAP.C4)).toBe(true);
      expect(isBitSet64(mask, COORD_SQUARE_MAP.D4)).toBe(true);
      expect(isBitSet64(mask, COORD_SQUARE_MAP.F4)).toBe(true);
      expect(isBitSet64(mask, COORD_SQUARE_MAP.G4)).toBe(true);
      expect(isBitSet64(mask, COORD_SQUARE_MAP.H4)).toBe(false);
    });
    it("generates an orthogonal attack mask for each square", () => {
      for (const square of SQUARES) {
        const mask = TestAttackMask.generateOrthogonalAttackMask(square);
        assertRay(square, mask, "N", true, EDGE_MASK);
        assertRay(square, mask, "E", true, EDGE_MASK);
        assertRay(square, mask, "S", true, EDGE_MASK);
        assertRay(square, mask, "W", true, EDGE_MASK);
      }
    });
  });
  describe(TestAttackMask.generateSlidingAttackMask.name, () => {
    it("returns a non-empty mask if the square is in bounds", () => {});
    describe.each([
      {
        piece: BISHOP_PIECE,
        hasDiagonal: true,
        hasOrthogonal: false,
        testName: "returns a diagonal attack masks for a bishop on each square",
      },
      {
        piece: ROOK_PIECE,
        hasDiagonal: false,
        hasOrthogonal: true,
        testName:
          "returns an orthogonal attack masks for a rook on each square",
      },
      {
        piece: QUEEN_PIECE,
        hasDiagonal: true,
        hasOrthogonal: true,
        testName:
          "returns an attack mask containing both diagonal and orthogonal rays for a queen on each square",
      },
    ])(
      TestAttackMask.generateSlidingAttackMask.name,
      ({ piece, hasDiagonal, hasOrthogonal, testName }) => {
        it(testName, () => {
          for (const square of SQUARES) {
            const ray = TestAttackMask.generateSlidingAttackMask(square, piece);
            assertRay(square, ray, "N", hasOrthogonal, EDGE_MASK);
            assertRay(square, ray, "E", hasOrthogonal, EDGE_MASK);
            assertRay(square, ray, "S", hasOrthogonal, EDGE_MASK);
            assertRay(square, ray, "W", hasOrthogonal, EDGE_MASK);
            assertRay(square, ray, "SW", hasDiagonal, EDGE_MASK);
            assertRay(square, ray, "SE", hasDiagonal, EDGE_MASK);
            assertRay(square, ray, "NE", hasDiagonal, EDGE_MASK);
            assertRay(square, ray, "NW", hasDiagonal, EDGE_MASK);
          }
        });
      },
    );
  });
  describe(TestAttackMask.generateWhitePawnAttackMask.name, () => {
    it("returns an attack mask for white pawn on A1", () => {
      const mask = TestAttackMask.generateWhitePawnAttackMask(
        COORD_SQUARE_MAP.A1,
      );
      expect(isBitSet64(mask, COORD_SQUARE_MAP.B2)).toBe(true);
    });
    it("returns an attack mask for white pawn on C3", () => {
      const mask = TestAttackMask.generateWhitePawnAttackMask(
        COORD_SQUARE_MAP.C3,
      );
      expect(isBitSet64(mask, COORD_SQUARE_MAP.B4)).toBe(true);
      expect(isBitSet64(mask, COORD_SQUARE_MAP.D4)).toBe(true);
    });
    it("returns an attack mask for white pawn on F8", () => {
      const mask = TestAttackMask.generateWhitePawnAttackMask(
        COORD_SQUARE_MAP.F8,
      );
      expect(mask).toBe(0n);
    });
    it("returns an attack mask for white pawns on each square", () => {
      for (const square of SQUARES) {
        const bit = 1n << BigInt(square);
        const actual = TestAttackMask.generateWhitePawnAttackMask(square);
        const expected =
          (((bit & NOT_A_FILE_MASK) << 7n) | ((bit & NOT_H_FILE_MASK) << 9n)) &
          BOARD_MASK;
        expect(actual).toBe(expected);
      }
    });
  });
  describe(TestAttackMask.generateBlackPawnAttackMask.name, () => {
    it("returns an attack mask for black pawn on H8", () => {
      const mask = TestAttackMask.generateBlackPawnAttackMask(
        COORD_SQUARE_MAP.H8,
      );
      expect(isBitSet64(mask, COORD_SQUARE_MAP.G7)).toBe(true);
    });
    it("returns an attack mask for black pawn on F4", () => {
      const mask = TestAttackMask.generateBlackPawnAttackMask(
        COORD_SQUARE_MAP.F4,
      );
      expect(isBitSet64(mask, COORD_SQUARE_MAP.E3)).toBe(true);
      expect(isBitSet64(mask, COORD_SQUARE_MAP.G3)).toBe(true);
    });
    it("returns an attack mask for black pawn on A1", () => {
      const mask = TestAttackMask.generateBlackPawnAttackMask(
        COORD_SQUARE_MAP.A1,
      );
      expect(mask).toBe(0n);
    });
    it("returns an attack mask for black pawns on each square", () => {
      for (const square of SQUARES) {
        const bit = 1n << BigInt(square);
        const actual = TestAttackMask.generateBlackPawnAttackMask(square);
        const expected =
          (((bit & NOT_H_FILE_MASK) >> 7n) | ((bit & NOT_A_FILE_MASK) >> 9n)) &
          BOARD_MASK;
        expect(actual).toBe(expected);
      }
    });
  });
  describe(TestAttackMask.generateKnightAttackMask.name, () => {
    it("generates an attack mask for a knight on A1", () => {
      const mask = TestAttackMask.generateKnightAttackMask(COORD_SQUARE_MAP.A1);
      expect(isBitSet64(mask, COORD_SQUARE_MAP.B3)).toBe(true);
      expect(isBitSet64(mask, COORD_SQUARE_MAP.C2)).toBe(true);
    });
    it("generates an attack mask for a knight on H1", () => {
      const mask = TestAttackMask.generateKnightAttackMask(COORD_SQUARE_MAP.H1);
      expect(isBitSet64(mask, COORD_SQUARE_MAP.G3)).toBe(true);
      expect(isBitSet64(mask, COORD_SQUARE_MAP.F2)).toBe(true);
    });
    it("generates an attack mask for a knight on A8", () => {
      const mask = TestAttackMask.generateKnightAttackMask(COORD_SQUARE_MAP.A8);
      expect(isBitSet64(mask, COORD_SQUARE_MAP.B6)).toBe(true);
      expect(isBitSet64(mask, COORD_SQUARE_MAP.C7)).toBe(true);
      expect(mask & ~BOARD_MASK).toBe(0n);
    });
    it("generates an attack mask for a knight on H8", () => {
      const mask = TestAttackMask.generateKnightAttackMask(COORD_SQUARE_MAP.H8);
      expect(isBitSet64(mask, COORD_SQUARE_MAP.G6)).toBe(true);
      expect(isBitSet64(mask, COORD_SQUARE_MAP.F7)).toBe(true);
      expect(mask & ~BOARD_MASK).toBe(0n);
    });
    it("returns an attack mask for a knight on each square", () => {
      for (const square of SQUARES) {
        const bit = 1n << BigInt(square);

        const actual = TestAttackMask.generateKnightAttackMask(square);
        const attacks =
          ((bit & NOT_AB_FILES_MASK) << 6n) |
          ((bit & NOT_GH_FILES_MASK) << 10n) |
          ((bit & NOT_A_FILE_MASK) << 15n) |
          ((bit & NOT_H_FILE_MASK) << 17n) |
          ((bit & NOT_GH_FILES_MASK) >> 6n) |
          ((bit & NOT_AB_FILES_MASK) >> 10n) |
          ((bit & NOT_H_FILE_MASK) >> 15n) |
          ((bit & NOT_A_FILE_MASK) >> 17n);

        const expected = attacks & BOARD_MASK;
        expect(actual).toBe(expected);
        expect(actual & ~BOARD_MASK).toBe(0n);
      }
    });
  });
  describe(TestAttackMask.generateKingAttackMask.name, () => {
    it("generates an attack mask for a king on A1", () => {
      const mask = TestAttackMask.generateKingAttackMask(COORD_SQUARE_MAP.A1);

      expect(isBitSet64(mask, COORD_SQUARE_MAP.A2)).toBe(true);
      expect(isBitSet64(mask, COORD_SQUARE_MAP.B2)).toBe(true);
      expect(isBitSet64(mask, COORD_SQUARE_MAP.B1)).toBe(true);
    });
    it("generates an attack mask for a king on H1", () => {
      const mask = TestAttackMask.generateKingAttackMask(COORD_SQUARE_MAP.H1);
      expect(isBitSet64(mask, COORD_SQUARE_MAP.H2)).toBe(true);
      expect(isBitSet64(mask, COORD_SQUARE_MAP.G2)).toBe(true);
      expect(isBitSet64(mask, COORD_SQUARE_MAP.G1)).toBe(true);
    });
    it("generates an attack mask for a king on A8", () => {
      const mask = TestAttackMask.generateKingAttackMask(COORD_SQUARE_MAP.A8);
      expect(isBitSet64(mask, COORD_SQUARE_MAP.A7)).toBe(true);
      expect(isBitSet64(mask, COORD_SQUARE_MAP.B7)).toBe(true);
      expect(isBitSet64(mask, COORD_SQUARE_MAP.B8)).toBe(true);
      expect(mask & ~BOARD_MASK).toBe(0n);
    });
    it("generates an attack mask for a king on H8", () => {
      const mask = TestAttackMask.generateKingAttackMask(COORD_SQUARE_MAP.H8);
      expect(isBitSet64(mask, COORD_SQUARE_MAP.H7)).toBe(true);
      expect(isBitSet64(mask, COORD_SQUARE_MAP.G7)).toBe(true);
      expect(isBitSet64(mask, COORD_SQUARE_MAP.G8)).toBe(true);
      expect(mask & ~BOARD_MASK).toBe(0n);
    });
    it("returns an attack mask for a king on each square", () => {
      for (const square of SQUARES) {
        const bit = 1n << BigInt(square);

        const actual = TestAttackMask.generateKingAttackMask(square);
        const attacks =
          (bit << 8n) |
          (bit >> 8n) |
          ((bit & NOT_A_FILE_MASK) << 7n) |
          ((bit & NOT_A_FILE_MASK) >> 1n) |
          ((bit & NOT_A_FILE_MASK) >> 9n) |
          ((bit & NOT_H_FILE_MASK) >> 7n) |
          ((bit & NOT_H_FILE_MASK) << 1n) |
          ((bit & NOT_H_FILE_MASK) << 9n);

        const expected = attacks & BOARD_MASK;
        expect(actual).toBe(expected);
        expect(actual & ~BOARD_MASK).toBe(0n);
      }
    });
  });
});
