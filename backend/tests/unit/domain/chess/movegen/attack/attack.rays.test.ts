import {
  BISHOP_PIECE,
  QUEEN_PIECE,
  ROOK_PIECE,
} from "#/fixtures/chess/piece.fixtures.js";
import { COORD_SQUARE_MAP } from "#/fixtures/chess/square.fixtures.js";
import { assertRay } from "#/helpers/bitboard.helpers.js";
import { TEST_CATEGORIES } from "#/utils/test-constants.js";
import { SQUARES } from "@/domain/chess/board/board.constants.js";
import { Square } from "@/domain/chess/board/types.chess.js";
import { printBitboard } from "@/domain/chess/debug/printer.chess.js";
import * as TestAttackRays from "@/domain/chess/movegen/attack/attack.rays.js";
import { isBitSet64 } from "@/domain/chess/utils/bit.utils.js";
import { describe, expect, it } from "vitest";

describe("attack.rays", () => {
  describe(TEST_CATEGORIES.MOVEMENT, () => {
    describe(TestAttackRays.walkRay.name, () => {});
    describe(TestAttackRays.walkOrthogonalRays.name, () => {
      it("returns a mask with set bits along the orthogonal", () => {
        for (const square of SQUARES) {
          const ray = TestAttackRays.walkOrthogonalRays(square);
          assertRay(square, ray, "N");
          assertRay(square, ray, "E");
          assertRay(square, ray, "S");
          assertRay(square, ray, "W");
        }
      });
      it("returns a mask with set bits along the orthogonal until a blocker square", () => {
        const square = COORD_SQUARE_MAP.D4;

        const blockerSquares = [
          COORD_SQUARE_MAP.D2,
          COORD_SQUARE_MAP.D7,
          COORD_SQUARE_MAP.B4,
          COORD_SQUARE_MAP.G4,
        ];
        const outerSquares = [
          COORD_SQUARE_MAP.D1,
          COORD_SQUARE_MAP.D8,
          COORD_SQUARE_MAP.A4,
          COORD_SQUARE_MAP.H4,
        ];
        const blockerMask = blockerSquares.reduce(
          (acc, square) => (acc |= 1n << BigInt(square)),
          0n,
        );
        const fullRay = TestAttackRays.walkOrthogonalRays(square);
        for (const outerSquare of outerSquares) {
          expect(isBitSet64(fullRay, outerSquare)).toBe(true);
        }
        const blockedRay = TestAttackRays.walkOrthogonalRays(
          square,
          blockerMask,
        );
        for (const outerSquare of outerSquares) {
          expect(isBitSet64(blockedRay, outerSquare)).toBe(false);
        }
      });
    });
    describe(TestAttackRays.walkDiagonalRays.name, () => {
      it("returns a mask with set bits along the diagonal", () => {
        for (const square of SQUARES) {
          const ray = TestAttackRays.walkDiagonalRays(square);
          assertRay(square, ray, "SW");
          assertRay(square, ray, "SE");
          assertRay(square, ray, "NE");
          assertRay(square, ray, "NW");
        }
      });
      it("returns a mask with set bits along the diagonal until a blocker square", () => {
        const square = COORD_SQUARE_MAP.D4;

        const blockerSquares = [
          COORD_SQUARE_MAP.C3,
          COORD_SQUARE_MAP.F2,
          COORD_SQUARE_MAP.B6,
          COORD_SQUARE_MAP.G7,
        ];
        const outerSquares = [
          COORD_SQUARE_MAP.A7,
          COORD_SQUARE_MAP.A1,
          COORD_SQUARE_MAP.B2,
          COORD_SQUARE_MAP.G1,
          COORD_SQUARE_MAP.H8,
        ];
        const blockerMask = blockerSquares.reduce(
          (acc, square) => (acc |= 1n << BigInt(square)),
          0n,
        );
        const fullRay = TestAttackRays.walkDiagonalRays(square);
        for (const outerSquare of outerSquares) {
          expect(isBitSet64(fullRay, outerSquare)).toBe(true);
        }
        const blockedRay = TestAttackRays.walkOrthogonalRays(
          square,
          blockerMask,
        );
        for (const outerSquare of outerSquares) {
          expect(isBitSet64(blockedRay, outerSquare)).toBe(false);
        }
      });
    });
    describe.each([
      {
        piece: BISHOP_PIECE,
        hasDiagonal: true,
        hasOrthogonal: false,
        test: "returns diagonal masks for a bishop",
      },
      {
        piece: ROOK_PIECE,
        hasDiagonal: false,
        hasOrthogonal: true,
        test: "returns orthogonal masks for a rook",
      },
      {
        piece: QUEEN_PIECE,
        hasDiagonal: true,
        hasOrthogonal: true,
        test: "returns masks containing both diagonal and orthogonal rays for a queen",
      },
    ])(
      TestAttackRays.walkSlidingRays.name,
      ({ piece, hasDiagonal, hasOrthogonal, test }) => {
        it(test, () => {
          for (const square of SQUARES) {
            const ray = TestAttackRays.walkSlidingRays(square, piece);
            assertRay(square, ray, "N", hasOrthogonal);
            assertRay(square, ray, "E", hasOrthogonal);
            assertRay(square, ray, "S", hasOrthogonal);
            assertRay(square, ray, "W", hasOrthogonal);
            assertRay(square, ray, "SW", hasDiagonal);
            assertRay(square, ray, "SE", hasDiagonal);
            assertRay(square, ray, "NE", hasDiagonal);
            assertRay(square, ray, "NW", hasDiagonal);
          }
        });
      },
    );
  });
});
