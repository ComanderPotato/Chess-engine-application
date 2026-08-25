import { beforeEach, describe, expect, it } from "vitest";
import * as TestFenComposer from "@/domain/chess/fen/fen.composer.js";
import * as TestFenParser from "@/domain/chess/fen/fen.parser.js";
import { TEST_CATEGORIES } from "#/utils/test-constants.js";
import { Board } from "@/domain/chess/board/board.chess.js";
import { EXPECTED_COORDS } from "#/fixtures/chess/square.fixtures.js";
import { FENS } from "@/domain/chess/fen/fen.constants.js";
import {
  EXPECTED_COMPOSED_ACTIVE_COLOUR,
  EXPECTED_COMPOSED_CASTLING_RIGHTS,
} from "#/fixtures/chess/fen.fixtures.js";
import { SQUARES } from "@/domain/chess/board/board.constants.js";

describe("fen.composer", () => {
  let board: Board;
  beforeEach(() => {
    board = new Board();
  });
  describe(TEST_CATEGORIES.COMPOSITION, () => {
    describe(TestFenComposer.composePiecePlacement.name, () => {
      describe(`round-trips ${TestFenParser.parsePiecePlacement.name} and ${TestFenComposer.composePiecePlacement.name}`, () => {
        it("composes starting position piece placement", () => {
          for (const fen of Object.values(FENS)) {
            const board = new Board();
            TestFenParser.parseFen(fen, board);
            expect(TestFenComposer.composePiecePlacement(board)).toBe(
              fen.split(" ")[0]!,
            );
          }
        });
      });
    });
    describe(TestFenComposer.composeActiveColour.name, () => {
      it("composes the active colour", () => {
        for (const [colour, expected] of EXPECTED_COMPOSED_ACTIVE_COLOUR) {
          expect(TestFenComposer.composeActiveColour(colour)).toBe(expected);
        }
      });
    });
    describe(TestFenComposer.composeCastlingRights.name, () => {
      it("composes castling rights", () => {
        for (const [
          castlingRights,
          expected,
        ] of EXPECTED_COMPOSED_CASTLING_RIGHTS) {
          expect(TestFenComposer.composeCastlingRights(castlingRights)).toBe(
            expected,
          );
        }
      });
      it("throws on negative inputs", () => {
        for (let i = -100; i < 0; i++) {
          expect(() => TestFenComposer.composeCastlingRights(i)).toThrow(
            /casting rights/,
          );
        }
        expect(() => TestFenComposer.composeCastlingRights(0b10000)).toThrow();
      });
      it("throws on invalid positive inputs", () => {
        for (let i = 1 << 4; i < 100; i++) {
          expect(() => TestFenComposer.composeCastlingRights(i)).toThrow(
            /casting rights/,
          );
        }
      });
    });
    describe(TestFenComposer.composeEnPassant.name, () => {
      it("composes the enpassant coordinates", () => {
        for (const square of SQUARES) {
          expect(TestFenComposer.composeEnPassant(square)).toBe(
            EXPECTED_COORDS[square],
          );
        }
      });
    });
    describe(TestFenComposer.composeHalfMoveClock.name, () => {
      it("composes the half move clock", () => {
        for (let i = 0; i < 124; i++) {
          expect(TestFenComposer.composeHalfMoveClock(i)).toBe(String(i));
        }
      });
      it("throws on invalid input", () => {
        for (let i = -100; i < 0; i++) {
          expect(() => TestFenComposer.composeHalfMoveClock(i)).toThrow();
        }
      });
    });
    describe(TestFenComposer.composeFullMoveClock.name, () => {
      it("composes the full move clock", () => {
        for (let i = 1; i < 124; i++) {
          expect(TestFenComposer.composeFullMoveClock(i)).toBe(String(i));
        }
      });
      it("throws on invalid input", () => {
        for (let i = -100; i < 1; i++) {
          expect(() => TestFenComposer.composeFullMoveClock(i)).toThrow();
        }
      });
    });

    describe(TEST_CATEGORIES.INTEGRATION, () => {
      describe(TestFenComposer.composeFen.name, () => {
        it.each(Object.values(FENS))("round-trips FEN: %s", (fen) => {
          const board = new Board();

          TestFenParser.parseFen(fen, board);

          expect(TestFenComposer.composeFen(board)).toBe(fen);
        });
        // describe(`round-trips ${TestFenParser.parseFen.name} and ${TestFenComposer.composeFen.name}`, () => {
        //   it("parses the fen input into board state and back to string representation", () => {
        //     for (const expectedFen of Object.values(FENS)) {
        //       const board = new Board();
        //       TestFenParser.parseFen(expectedFen, board);
        //       const composedFen = TestFenComposer.composeFen(board);
        //       // const composedFenFields = composedFen.split(" ");
        //       // const expectedFenFields = fen.split(" ");
        //       expect(composedFen).toBe(expectedFen);
        //     }
        //   });
        // });
      });
    });
  });
});
