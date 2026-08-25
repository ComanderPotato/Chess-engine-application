import {
  ALL_PIECES,
  TYPE_MASK,
  WHITE_PIECES,
  BLACK_PIECES,
  COLOUR_MASK,
} from "#/fixtures/chess/piece.fixtures.js";
import { TEST_CATEGORIES } from "#/utils/test-constants.js";
import * as TestPieceChess from "@/domain/chess/piece/piece.chess.js";
import {
  PIECE_COLOUR_MASK,
  PIECE_COLOURS,
  PIECE_PROPERTIES,
  PIECE_TYPES,
} from "@/domain/chess/piece/piece.constants.js";
import { pieceToString } from "@/domain/chess/piece/piece.format.js";
import { PieceColour } from "@/domain/chess/piece/piece.types.js";
import { describe, expect, it } from "vitest";

describe("piece.chess", () => {
  // const PROPERTY_MASK = 0b11100000 as const;
  describe(TEST_CATEGORIES.EXTRACTION, () => {
    describe(TestPieceChess.getType.name, () => {
      it.each([
        { type: PIECE_TYPES.Pawn, name: "pawn" },
        { type: PIECE_TYPES.Knight, name: "knight" },
        { type: PIECE_TYPES.Bishop, name: "bishop" },
        { type: PIECE_TYPES.Rook, name: "rook" },
        { type: PIECE_TYPES.Queen, name: "queen" },
        { type: PIECE_TYPES.King, name: "king" },
      ])("returns $name for $name pieces", ({ type }) => {
        for (const piece of ALL_PIECES) {
          const expected = (piece & TYPE_MASK) === type;
          const resultType = TestPieceChess.getType(piece);
          expect(resultType === type).toBe(expected);
        }
      });
      it.each([
        [PIECE_TYPES.Pawn],
        [PIECE_TYPES.Knight],
        [PIECE_TYPES.Bishop],
        [PIECE_TYPES.Rook],
        [PIECE_TYPES.Queen],
        [PIECE_TYPES.King],
      ])("returns the supplied type regardless of colour", (type) => {
        expect(TestPieceChess.getType(type | PIECE_COLOURS.White)).toBe(type);
        expect(TestPieceChess.getType(type | PIECE_COLOURS.Black)).toBe(type);
      });
    });
    describe(TestPieceChess.getColour.name, () => {
      it("returns white for all white pieces", () => {
        for (const piece of WHITE_PIECES) {
          expect(TestPieceChess.getColour(piece)).toBe(PIECE_COLOURS.White);
        }
      });
      it("returns black for all black pieces", () => {
        for (const piece of BLACK_PIECES) {
          expect(TestPieceChess.getColour(piece)).toBe(PIECE_COLOURS.Black);
        }
      });
      it("returns the correct colour for each piece", () => {
        for (const piece of ALL_PIECES) {
          expect(TestPieceChess.getColour(piece)).toBe(piece & COLOUR_MASK);
        }
      });
    });
  });
  describe(TEST_CATEGORIES.RELATIONSHIP, () => {
    describe(TestPieceChess.getEnemyColour.name, () => {
      it("returns the correct enemy colour for a given piece", () => {
        for (const piece of ALL_PIECES) {
          const expected =
            (piece & PIECE_COLOURS.White) !== 0
              ? PIECE_COLOURS.Black
              : PIECE_COLOURS.White;
          expect(TestPieceChess.getEnemyColour(piece)).toBe(expected);
        }
      });
    });
  });
  describe(TEST_CATEGORIES.CLASSIFICATION, () => {
    describe(TestPieceChess.isWhite.name, () => {
      it("returns true for all white pieces", () => {
        for (const piece of WHITE_PIECES) {
          expect(TestPieceChess.isWhite(piece)).toBe(true);
        }
      });
      it("returns false for all black pieces", () => {
        for (const piece of BLACK_PIECES) {
          expect(TestPieceChess.isWhite(piece)).toBe(false);
        }
      });
      it("returns the correct response for a given piece", () => {
        for (const piece of ALL_PIECES) {
          const expected = (piece & PIECE_COLOURS.White) !== 0;
          expect(TestPieceChess.isWhite(piece)).toBe(expected);
        }
      });
    });
    describe(TestPieceChess.isBlack.name, () => {
      it("returns false for all white pieces", () => {
        for (const piece of WHITE_PIECES) {
          expect(TestPieceChess.isBlack(piece)).toBe(false);
        }
      });
      it("returns true for all black pieces", () => {
        for (const piece of BLACK_PIECES) {
          expect(TestPieceChess.isBlack(piece)).toBe(true);
        }
      });
      it("returns the correct response for a given piece", () => {
        for (const piece of ALL_PIECES) {
          const expected = (piece & PIECE_COLOURS.Black) !== 0;
          expect(TestPieceChess.isBlack(piece)).toBe(expected);
        }
      });
    });
    describe(TestPieceChess.isSlidingPiece.name, () => {
      it("returns true when the sliding bit is set", () => {
        for (const piece of ALL_PIECES) {
          const expected = (piece & PIECE_PROPERTIES.Sliding) !== 0;
          expect(TestPieceChess.isSlidingPiece(piece)).toBe(expected);
        }
      });
      it("returns true if the piece is a bishop, rook, or queen", () => {
        for (const piece of ALL_PIECES) {
          const expected =
            (piece & TYPE_MASK) === PIECE_TYPES.Bishop ||
            (piece & TYPE_MASK) === PIECE_TYPES.Rook ||
            (piece & TYPE_MASK) === PIECE_TYPES.Queen;
          expect(TestPieceChess.isSlidingPiece(piece)).toBe(expected);
        }
      });
    });
    describe(TestPieceChess.hasDiagonalMovement.name, () => {
      it("returns true when the diagonal bit is set", () => {
        for (const piece of ALL_PIECES) {
          const expected = (piece & PIECE_PROPERTIES.Diagonal) !== 0;
          expect(TestPieceChess.hasDiagonalMovement(piece)).toBe(expected);
        }
      });
      it("returns true if the piece is a bishop or queen", () => {
        for (const piece of ALL_PIECES) {
          const expected =
            (piece & TYPE_MASK) === PIECE_TYPES.Bishop ||
            (piece & TYPE_MASK) === PIECE_TYPES.Queen;

          expect(TestPieceChess.hasDiagonalMovement(piece)).toBe(expected);
        }
      });
    });
    describe(TestPieceChess.hasOrthogonalMovement.name, () => {
      it("returns true when the orthogonal bit is set", () => {
        for (const piece of ALL_PIECES) {
          const expected = (piece & PIECE_PROPERTIES.Orthogonal) !== 0;
          expect(TestPieceChess.hasOrthogonalMovement(piece)).toBe(expected);
        }
      });
      it("returns true if the piece is a rook or queen", () => {
        for (const piece of ALL_PIECES) {
          const expected =
            (piece & TYPE_MASK) === PIECE_TYPES.Rook ||
            (piece & TYPE_MASK) === PIECE_TYPES.Queen;
          expect(TestPieceChess.hasOrthogonalMovement(piece)).toBe(expected);
        }
      });
    });
    describe(TestPieceChess.isType.name, () => {
      it("returns expected value when checking all pieces", () => {
        const types = Object.values(PIECE_TYPES);
        for (const piece of ALL_PIECES) {
          for (const type of types) {
            const expected = (piece & TYPE_MASK) === type;
            expect(TestPieceChess.isType(piece, type)).toBe(expected);
          }
        }
      });
    });
    describe(TestPieceChess.isColour.name, () => {
      it("returns expected value when checking all pieces", () => {
        for (const piece of ALL_PIECES) {
          const isWhite = (piece & COLOUR_MASK) === PIECE_COLOURS.White;
          const isBlack = (piece & COLOUR_MASK) === PIECE_COLOURS.Black;
          expect(TestPieceChess.isColour(piece, PIECE_COLOURS.White)).toBe(
            isWhite,
          );
          expect(TestPieceChess.isColour(piece, PIECE_COLOURS.Black)).toBe(
            isBlack,
          );
        }
      });
    });
  });
  describe(TEST_CATEGORIES.CONVERSION, () => {
    describe(TestPieceChess.normaliseColour.name, () => {
      it("normalises white piece colours", () => {
        for (const piece of WHITE_PIECES) {
          expect(
            TestPieceChess.normaliseColour(
              (piece & PIECE_COLOUR_MASK) as PieceColour,
            ),
          ).toBe(0);
        }
      });
      it("normalises white piece colours", () => {
        for (const piece of BLACK_PIECES) {
          expect(
            TestPieceChess.normaliseColour(
              (piece & PIECE_COLOUR_MASK) as PieceColour,
            ),
          ).toBe(1);
        }
      });
    });
  });
});
