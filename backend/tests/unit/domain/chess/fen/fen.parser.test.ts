import { describe, expect, it } from "vitest";
import * as TestFenParser from "@/domain/chess/fen/fen.parser.js";
import { TEST_CATEGORIES } from "#/utils/test-constants.js";
import { FENS } from "@/domain/chess/fen/fen.constants.js";
import {
  STARTING_BLACK_PAWNS_MASK,
  STARTING_BLACK_PIECES_MASK,
  STARTING_WHITE_PAWNS_MASK,
  STARTING_WHITE_PIECES_MASK,
} from "@/domain/chess/bitboard/bitboard.masks.js";
import {
  PIECE_COLOURS,
  PIECE_TYPES,
} from "@/domain/chess/piece/piece.constants.js";
import { ALL_PIECES } from "#/fixtures/chess/piece.fixtures.js";
import { pieceToNotation } from "@/domain/chess/piece/piece.notation.js";
import {
  BOTTOM_LEFT_CORNER,
  BOTTOM_RIGHT_CORNER,
  EXPECTED_COORDS,
  TOP_LEFT_CORNER,
  TOP_RIGHT_CORNER,
} from "#/fixtures/chess/square.fixtures.js";
import { Board } from "@/domain/chess/board/board.chess.js";
import { Bitboards } from "@/domain/chess/bitboard/bitboard.chess.js";
import { EXPECTED_PARSED_CASTLING_RIGHTS } from "#/fixtures/chess/fen.fixtures.js";

function assertStartingBitboard(bitboards: Bitboards): void {
  expect(bitboards.allOccupancy).toBe(
    STARTING_WHITE_PIECES_MASK | STARTING_BLACK_PIECES_MASK,
  );
  expect(bitboards.getOccupancy(PIECE_TYPES.Pawn)).toBe(
    STARTING_WHITE_PAWNS_MASK | STARTING_BLACK_PAWNS_MASK,
  );
  expect(bitboards.getBitboard(PIECE_TYPES.Pawn | PIECE_COLOURS.White)).toBe(
    STARTING_WHITE_PAWNS_MASK,
  );
  expect(bitboards.getBitboard(PIECE_TYPES.Knight | PIECE_COLOURS.White)).toBe(
    (1n << 1n) | (1n << 6n),
  );
  expect(bitboards.getBitboard(PIECE_TYPES.Bishop | PIECE_COLOURS.White)).toBe(
    (1n << 2n) | (1n << 5n),
  );

  expect(bitboards.getBitboard(PIECE_TYPES.Rook | PIECE_COLOURS.White)).toBe(
    (1n << 0n) | (1n << 7n),
  );
  expect(bitboards.getBitboard(PIECE_TYPES.Queen | PIECE_COLOURS.White)).toBe(
    1n << 3n,
  );
  expect(bitboards.getBitboard(PIECE_TYPES.King | PIECE_COLOURS.White)).toBe(
    1n << 4n,
  );
  expect(bitboards.getBitboard(PIECE_TYPES.Pawn | PIECE_COLOURS.Black)).toBe(
    STARTING_BLACK_PAWNS_MASK,
  );
  expect(bitboards.getBitboard(PIECE_TYPES.Knight | PIECE_COLOURS.Black)).toBe(
    (1n << 57n) | (1n << 62n),
  );
  expect(bitboards.getBitboard(PIECE_TYPES.Bishop | PIECE_COLOURS.Black)).toBe(
    (1n << 58n) | (1n << 61n),
  );

  expect(bitboards.getBitboard(PIECE_TYPES.Rook | PIECE_COLOURS.Black)).toBe(
    (1n << 56n) | (1n << 63n),
  );
  expect(bitboards.getBitboard(PIECE_TYPES.Queen | PIECE_COLOURS.Black)).toBe(
    1n << 59n,
  );
  expect(bitboards.getBitboard(PIECE_TYPES.King | PIECE_COLOURS.Black)).toBe(
    1n << 60n,
  );
}
describe("fen.parser", () => {
  describe(TEST_CATEGORIES.PARSING, () => {
    describe(TestFenParser.parsePiecePlacement.name, () => {
      it("parses empty board piece placement", () => {
        const piecePlacement = FENS.EMPTY.split(" ")[0]!;
        const bitboards = TestFenParser.parsePiecePlacement(piecePlacement);
        expect(bitboards.allOccupancy).toBe(0n);
      });
      it("places each piece on the correct bitboard", () => {
        const piecePlacement = "8/8/8/8/3_4/8/8/8";
        const square = 27n;

        for (const piece of ALL_PIECES) {
          const notation = pieceToNotation(piece);
          const bitboards = TestFenParser.parsePiecePlacement(
            piecePlacement.replace("_", notation),
          );
          expect(bitboards.allOccupancy).toBe(1n << square);
          expect(bitboards.getBitboard(piece)).toBe(1n << square);
        }
      });
      it("does not populate other bitboards", () => {
        const piecePlacement = "8/8/8/8/3_4/8/8/8";

        const piece = PIECE_TYPES.Pawn | PIECE_COLOURS.White;

        const notation = pieceToNotation(piece);
        const bitboards = TestFenParser.parsePiecePlacement(
          piecePlacement.replace("_", notation),
        );
        for (const other of ALL_PIECES) {
          if (other === piece) continue;
          expect(bitboards.getBitboard(other)).toBe(0n);
        }
      });
      it("parses piece placement with correct orientation", () => {
        const piecePlacement = "R6p/8/8/8/8/8/8/q6K";

        const bitboards = TestFenParser.parsePiecePlacement(piecePlacement);

        expect(
          bitboards.getBitboard(PIECE_TYPES.Queen | PIECE_COLOURS.Black),
        ).toBe(1n << BigInt(BOTTOM_LEFT_CORNER));

        expect(
          bitboards.getBitboard(PIECE_TYPES.King | PIECE_COLOURS.White),
        ).toBe(1n << BigInt(BOTTOM_RIGHT_CORNER));

        expect(
          bitboards.getBitboard(PIECE_TYPES.Rook | PIECE_COLOURS.White),
        ).toBe(1n << BigInt(TOP_LEFT_CORNER));

        expect(
          bitboards.getBitboard(PIECE_TYPES.Pawn | PIECE_COLOURS.Black),
        ).toBe(1n << BigInt(TOP_RIGHT_CORNER));
      });
      it("parses starting position piece placement", () => {
        const piecePlacement = FENS.START.split(" ")[0]!;
        const bitboards = TestFenParser.parsePiecePlacement(piecePlacement);

        assertStartingBitboard(bitboards);
      });
      it("throws if piece placement is empty", () => {
        expect(() => TestFenParser.parsePiecePlacement(undefined)).toThrow(
          /missing piece placement/,
        );
        expect(() => TestFenParser.parsePiecePlacement("")).toThrow(
          /piece placement/,
        );
      });
      it("throws if there is an invalid character", () => {
        expect(() =>
          TestFenParser.parsePiecePlacement("8/8/8/8/9/8/8/8"),
        ).toThrow(/invalid character/);
        expect(() =>
          TestFenParser.parsePiecePlacement("8/8/8/8/0/8/8/8"),
        ).toThrow(/invalid character/);
      });
      it("throws if there are too few files squares", () => {
        expect(() =>
          TestFenParser.parsePiecePlacement("8/8/8/8/7/8/8/8"),
        ).toThrow(/incorrect square length for file/);
        expect(() =>
          TestFenParser.parsePiecePlacement("8/8/8/8/3p3/8/8/8"),
        ).toThrow(/incorrect square length for file/);
      });
      it("throws if there are too many file squares", () => {
        expect(() =>
          TestFenParser.parsePiecePlacement("8/8/8/8/8/4p4/8/8"),
        ).toThrow(/incorrect square length for file/);

        expect(() =>
          TestFenParser.parsePiecePlacement("8/8/8/8/8/3p4/8/6p3"),
        ).toThrow(/incorrect square length for file/);
      });
      it("throws if there are too few ranks", () => {
        expect(() =>
          TestFenParser.parsePiecePlacement("8/8/8/8/8/8/8"),
        ).toThrow(/incorrect amount of ranks/);
        expect(() =>
          TestFenParser.parsePiecePlacement("8/8/8/8/8/3p4/8"),
        ).toThrow(/incorrect amount of ranks/);
      });
      it("throws if there are too many ranks", () => {
        expect(() =>
          TestFenParser.parsePiecePlacement("8/8/8/8/8/8/8/8/8"),
        ).toThrow(/incorrect amount of ranks/);
        expect(() =>
          TestFenParser.parsePiecePlacement("8/8/8/8/8/3p4/8/8/8"),
        ).toThrow(/incorrect amount of ranks/);
      });
      it("throws if input starts or ends with /", () => {
        expect(() =>
          TestFenParser.parsePiecePlacement("/8/8/8/8/8/8/8/8"),
        ).toThrow(/piece placement/);
        expect(() =>
          TestFenParser.parsePiecePlacement("8/8/8/8/8/8/8/8/"),
        ).toThrow(/piece placement/);
      });
    });
    describe(TestFenParser.parseActiveColour.name, () => {
      it("parses active colour as white", () => {
        const activeColour = TestFenParser.parseActiveColour("w");
        expect(activeColour).toBe(PIECE_COLOURS.White);
      });
      it("parses active colour as black", () => {
        const activeColour = TestFenParser.parseActiveColour("b");
        expect(activeColour).toBe(PIECE_COLOURS.Black);
      });
      it("throws on empty or undefined input", () => {
        expect(() => TestFenParser.parseActiveColour("")).toThrow(
          /missing active colour/,
        );
        expect(() => TestFenParser.parseActiveColour(undefined)).toThrow(
          /missing active colour/,
        );
      });
      it("throws an error if length is invalid", () => {
        expect(() => TestFenParser.parseActiveColour("ww")).toThrow(
          /active colour length is invalid/,
        );
      });
    });
    describe(TestFenParser.parseCastlingRights.name, () => {
      it("parses all active castling rights", () => {
        for (const [
          castlingRights,
          expected,
        ] of EXPECTED_PARSED_CASTLING_RIGHTS) {
          expect(TestFenParser.parseCastlingRights(castlingRights)).toBe(
            expected,
          );
        }
      });
      it("throws on empty or undefined input", () => {
        expect(() => TestFenParser.parseCastlingRights("")).toThrow(
          /missing castling rights/,
        );
        expect(() => TestFenParser.parseCastlingRights(undefined)).toThrow(
          /missing castling rights/,
        );
      });
      it("throws with invalid format", () => {
        expect(() => TestFenParser.parseCastlingRights("KkQq")).toThrow(
          /castling rights/,
        );
        expect(() => TestFenParser.parseCastlingRights("kqKQ")).toThrow(
          /castling rights/,
        );
        expect(() => TestFenParser.parseCastlingRights("QkKq")).toThrow(
          /castling rights/,
        );
        expect(() => TestFenParser.parseCastlingRights("KKqq")).toThrow(
          /castling rights/,
        );
        expect(() => TestFenParser.parseCastlingRights("KqkQ")).toThrow(
          /castling rights/,
        );
      });
    });
    describe(TestFenParser.parseEnPassant.name, () => {
      it("parses the enPassant coordinates", () => {
        for (let idx = 0; idx < EXPECTED_COORDS.length; idx++) {
          expect(TestFenParser.parseEnPassant(EXPECTED_COORDS[idx])).toBe(idx);
        }
      });
      it("returns null with - character", () => {
        expect(TestFenParser.parseEnPassant("-")).toBe(null);
      });
      it("throws on empty or undefined input", () => {
        expect(() => TestFenParser.parseEnPassant(undefined)).toThrow(
          /missing en passant/,
        );
        expect(() => TestFenParser.parseEnPassant("")).toThrow(
          /missing en passant/,
        );
      });
      it("throws an error on invalid input", () => {
        expect(() => TestFenParser.parseEnPassant("a")).toThrow(
          /Invalid input coordinates/,
        );
        expect(() => TestFenParser.parseEnPassant("a88")).toThrow(
          /Invalid input coordinates/,
        );
        expect(() => TestFenParser.parseEnPassant("a9")).toThrow(
          /Invalid rank coordinates/,
        );
        expect(() => TestFenParser.parseEnPassant("k8")).toThrow(
          "Invalid file coordinates",
        );
      });
    });
    describe(TestFenParser.parseHalfMoveClock.name, () => {
      it("parses the half move clock", () => {
        for (let i = 0; i < 100; i++) {
          const input = String(i);
          expect(TestFenParser.parseHalfMoveClock(input)).toBe(i);
        }
      });
      it("throws on empty or undefined input", () => {
        expect(() => TestFenParser.parseHalfMoveClock("")).toThrow(
          /missing half move clock/,
        );
        expect(() => TestFenParser.parseHalfMoveClock(undefined)).toThrow(
          /missing half move clock/,
        );
      });
      it("throws on invalid input", () => {
        for (let i = "a".charCodeAt(0); i <= "z".charCodeAt(0); i++) {
          const char = String.fromCharCode(i);

          expect(() => TestFenParser.parseHalfMoveClock(char)).toThrow(
            /half move clock/,
          );
        }
      });
    });
    describe(TestFenParser.parseFullMoveClock.name, () => {
      it("parses the full move clock", () => {
        for (let i = 1; i < 100; i++) {
          const input = String(i);
          expect(TestFenParser.parseFullMoveClock(input)).toBe(i);
        }
      });
      it("throws on empty or undefined input", () => {
        expect(() => TestFenParser.parseFullMoveClock("")).toThrow(
          /missing full move clock/,
        );
        expect(() => TestFenParser.parseFullMoveClock(undefined)).toThrow(
          /missing full move clock/,
        );
      });
      it("throws on invalid input", () => {
        expect(() => TestFenParser.parseFullMoveClock("0")).toThrow(
          /full move clock/,
        );
        for (let i = "a".charCodeAt(0); i <= "z".charCodeAt(0); i++) {
          const char = String.fromCharCode(i);

          expect(() => TestFenParser.parseFullMoveClock(char)).toThrow(
            /full move clock/,
          );
        }
      });
    });
  });
  describe(TEST_CATEGORIES.INTEGRATION, () => {
    describe(TestFenParser.parseFen.name, () => {
      it("parses starting fen", () => {
        const board = new Board();
        TestFenParser.parseFen(FENS.START, board);
        assertStartingBitboard(board.bitboards);
        expect(board.activeColour).toBe(PIECE_COLOURS.White);
        expect(board.castlingRights).toBe(0b1111);
        expect(board.enPassant).toBe(null);
        expect(board.halfMoveClock).toBe(0);
        expect(board.fullMoveClock).toBe(1);
      });
      it("parses fen with empty board", () => {
        const board = new Board();
        TestFenParser.parseFen(FENS.EMPTY, board);
        expect(board.occupancy).toBe(0n);
        expect(board.activeColour).toBe(PIECE_COLOURS.White);
        expect(board.castlingRights).toBe(0);
        expect(board.enPassant).toBe(null);
        expect(board.halfMoveClock).toBe(0);
        expect(board.fullMoveClock).toBe(1);
      });
      it("parses middle game fen", () => {
        const board = new Board();
        TestFenParser.parseFen(FENS.MIDDLEGAME, board);
        expect(board.activeColour).toBe(PIECE_COLOURS.White);
        expect(board.castlingRights).toBe(0);
        expect(board.enPassant).toBe(null);
        expect(board.halfMoveClock).toBe(0);
        expect(board.fullMoveClock).toBe(8);
      });
    });
  });
});
