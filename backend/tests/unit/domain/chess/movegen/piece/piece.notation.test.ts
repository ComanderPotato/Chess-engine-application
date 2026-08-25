import { EXPECTED_NOTATIONS } from "#/fixtures/chess/piece.fixtures.js";
import { TEST_CATEGORIES } from "#/utils/test-constants.js";
import { PIECE_COLOURS } from "@/domain/chess/piece/piece.constants.js";
import * as TestPieceNotation from "@/domain/chess/piece/piece.notation.js";
import { PieceNotation } from "@/domain/chess/piece/piece.types.js";
import { describe, expect, it } from "vitest";

describe("piece.notation", () => {
  describe(TEST_CATEGORIES.CONVERSION, () => {
    describe(TestPieceNotation.pieceToNotation.name, () => {
      it("returns the correct notation for a given piece", () => {
        for (const expected of EXPECTED_NOTATIONS) {
          expect(
            TestPieceNotation.pieceToNotation(
              expected.type | PIECE_COLOURS.Black,
            ),
          ).toBe(expected.notation);
          expect(
            TestPieceNotation.pieceToNotation(
              expected.type | PIECE_COLOURS.White,
            ),
          ).toBe(expected.notation.toUpperCase());
        }
      });
    });

    describe(TestPieceNotation.notationToPiece.name, () => {
      it("returns the correct piece for a given notation", () => {
        for (const expected of EXPECTED_NOTATIONS) {
          expect(
            TestPieceNotation.notationToPiece(
              expected.notation as PieceNotation,
            ),
          ).toBe(expected.type | PIECE_COLOURS.Black);
          expect(
            TestPieceNotation.notationToPiece(
              expected.notation.toUpperCase() as PieceNotation,
            ),
          ).toBe(expected.type | PIECE_COLOURS.White);
        }
      });
    });

    describe(`${TestPieceNotation.pieceToNotation.name} and ${TestPieceNotation.notationToPiece.name}`, () => {
      it(`round-trips ${TestPieceNotation.pieceToNotation.name} and ${TestPieceNotation.notationToPiece.name}`, () => {
        for (const expected of EXPECTED_NOTATIONS) {
          const whiteNotation =
            expected.notation.toUpperCase() as PieceNotation;
          const blackNotation = expected.notation as PieceNotation;

          const whitePiece = expected.type | PIECE_COLOURS.White;
          const blackPiece = expected.type | PIECE_COLOURS.Black;

          const outputWhiteNotation =
            TestPieceNotation.pieceToNotation(whitePiece);
          const outputBlackNotation =
            TestPieceNotation.pieceToNotation(blackPiece);

          const outputWhitePiece =
            TestPieceNotation.notationToPiece(whiteNotation);
          const outputBlackPiece =
            TestPieceNotation.notationToPiece(blackNotation);

          expect(outputBlackNotation).toBe(blackNotation);
          expect(outputWhiteNotation).toBe(whiteNotation);

          expect(outputBlackPiece).toBe(blackPiece);
          expect(outputWhitePiece).toBe(whitePiece);
        }
      });
    });
  });
  describe(TEST_CATEGORIES.CLASSIFICATION, () => {
    describe(TestPieceNotation.isValidNotation.name, () => {
      const validNotations = new Set(
        EXPECTED_NOTATIONS.map(({ notation }) => notation),
      );
      it("returns true only for valid piece notation characters", () => {
        for (let i = "a".charCodeAt(0); i <= "z".charCodeAt(0); i++) {
          const notation = String.fromCharCode(i);
          const isValid = validNotations.has(notation);
          expect(TestPieceNotation.isValidNotation(notation)).toBe(isValid);
          expect(
            TestPieceNotation.isValidNotation(notation.toUpperCase()),
          ).toBe(isValid);
        }
      });
      it("returns false for number characters", () => {
        for (let i = "0".charCodeAt(0); i <= "9".charCodeAt(0); i++) {
          expect(
            TestPieceNotation.isValidNotation(String.fromCharCode(i)),
          ).toBe(false);
        }
      });
      it("returns false for non-letter characters", () => {
        for (const value of ["", "!", "@", "_", "-", " "]) {
          expect(TestPieceNotation.isValidNotation(value)).toBe(false);
        }
      });
    });
  });
});
