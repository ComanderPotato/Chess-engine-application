import { ALL_PIECES } from "#/fixtures/chess/piece.fixtures.js";
import { COORD_SQUARE_MAP } from "#/fixtures/chess/square.fixtures.js";
import { TEST_CATEGORIES } from "#/utils/test-constants.js";
import { Bitboards } from "@/domain/chess/bitboard/bitboard.chess.js";
import {
  PIECE_COLOURS,
  PIECE_TYPES,
} from "@/domain/chess/piece/piece.constants.js";
import { beforeEach, describe, expect, it } from "vitest";

describe("bitboard.chess", () => {
  let bitboards: Bitboards;
  const testPiece = PIECE_TYPES.Pawn | PIECE_COLOURS.White;

  beforeEach(() => {
    bitboards = new Bitboards();
  });

  describe(TEST_CATEGORIES.BITBOARDS, () => {
    describe("setBit", () => {
      it("sets the bit in the piece bitboard", () => {
        bitboards.setBit(testPiece, COORD_SQUARE_MAP.A1);
        expect(bitboards.getBitboard(testPiece)).toBe(0b1n);
      });

      it("preserves existing bits", () => {
        bitboards.setBit(testPiece, COORD_SQUARE_MAP.A1);
        bitboards.setBit(testPiece, COORD_SQUARE_MAP.A2);

        expect(bitboards.getBitboard(testPiece)).toBe(0b100000001n);
      });

      it("does not modify other bitboards", () => {
        const piece = PIECE_TYPES.Bishop | PIECE_COLOURS.White;

        bitboards.setBit(testPiece, COORD_SQUARE_MAP.A1);

        expect(bitboards.getBitboard(testPiece)).toBe(0b1n);
        expect(bitboards.getBitboard(piece)).toBe(0n);
      });
    });

    describe("clearBit", () => {
      it("clears the bit in the piece bitboard", () => {
        bitboards.setBit(testPiece, COORD_SQUARE_MAP.A1);
        expect(bitboards.getBitboard(testPiece)).toBe(0b1n);

        bitboards.clearBit(testPiece, COORD_SQUARE_MAP.A1);
        expect(bitboards.getBitboard(testPiece)).toBe(0n);
      });

      it("preserves existing bits", () => {
        bitboards.setBit(testPiece, COORD_SQUARE_MAP.A1);
        bitboards.setBit(testPiece, COORD_SQUARE_MAP.A2);

        expect(bitboards.getBitboard(testPiece)).toBe(0b100000001n);

        bitboards.clearBit(testPiece, COORD_SQUARE_MAP.A1);

        expect(bitboards.getBitboard(testPiece)).toBe(0b100000000n);
      });

      it("does not modify other bitboards", () => {
        const piece = PIECE_TYPES.Bishop | PIECE_COLOURS.White;

        bitboards.setBit(testPiece, COORD_SQUARE_MAP.A1);

        expect(bitboards.getBitboard(testPiece)).toBe(0b1n);
        expect(bitboards.getBitboard(piece)).toBe(0n);

        bitboards.clearBit(testPiece, COORD_SQUARE_MAP.A1);

        expect(bitboards.getBitboard(testPiece)).toBe(0n);
        expect(bitboards.getBitboard(piece)).toBe(0n);
      });
    });

    describe("moveBit", () => {
      it("moves the bit from one square to another on the piece bitboard", () => {
        bitboards.setBit(testPiece, COORD_SQUARE_MAP.A1);
        expect(bitboards.getBitboard(testPiece)).toBe(0b1n);

        bitboards.moveBit(testPiece, COORD_SQUARE_MAP.A1, COORD_SQUARE_MAP.A2);

        expect(bitboards.getBitboard(testPiece)).toBe(0b100000000n);
      });

      it("preserves existing bits", () => {
        bitboards.setBit(testPiece, COORD_SQUARE_MAP.A1);
        bitboards.setBit(testPiece, COORD_SQUARE_MAP.B1);

        expect(bitboards.getBitboard(testPiece)).toBe(0b11n);

        bitboards.moveBit(testPiece, COORD_SQUARE_MAP.A1, COORD_SQUARE_MAP.A2);

        expect(bitboards.getBitboard(testPiece)).toBe(0b100000010n);
      });

      it("does not modify other bitboards", () => {
        const piece = PIECE_TYPES.Bishop | PIECE_COLOURS.White;

        bitboards.setBit(testPiece, COORD_SQUARE_MAP.A1);

        bitboards.moveBit(testPiece, COORD_SQUARE_MAP.A1, COORD_SQUARE_MAP.A2);

        expect(bitboards.getBitboard(testPiece)).toBe(0b100000000n);
        expect(bitboards.getBitboard(piece)).toBe(0n);
      });
    });

    describe("getBitboard", () => {
      it("returns the piece bitboard", () => {
        for (const piece of ALL_PIECES) {
          expect(bitboards.getBitboard(piece)).toBeDefined();
          expect(bitboards.getBitboard(piece)).toBe(0n);
        }
      });
    });

    describe("get bitboards", () => {
      it("returns an array of bitboards", () => {
        expect(bitboards.bitboards).toBeDefined();
        expect(bitboards.bitboards).toHaveLength(12);
      });
    });

    describe("getOccupancy", () => {
      it("returns both colour occupancies of a piece", () => {
        expect(bitboards.getOccupancy(PIECE_TYPES.Pawn)).toBeDefined();
        expect(bitboards.getOccupancy(PIECE_TYPES.Pawn)).toBe(0n);

        bitboards.setBit(
          PIECE_TYPES.Pawn | PIECE_COLOURS.White,
          COORD_SQUARE_MAP.A1,
        );
        expect(bitboards.getOccupancy(PIECE_TYPES.Pawn)).toBe(0b1n);

        bitboards.setBit(
          PIECE_TYPES.Pawn | PIECE_COLOURS.Black,
          COORD_SQUARE_MAP.B1,
        );
        expect(bitboards.getOccupancy(PIECE_TYPES.Pawn)).toBe(0b11n);

        expect(bitboards.getOccupancy(PIECE_TYPES.Knight)).toBe(0n);
        expect(bitboards.getOccupancy(PIECE_TYPES.Bishop)).toBe(0n);
        expect(bitboards.getOccupancy(PIECE_TYPES.Rook)).toBe(0n);
        expect(bitboards.getOccupancy(PIECE_TYPES.Queen)).toBe(0n);
        expect(bitboards.getOccupancy(PIECE_TYPES.King)).toBe(0n);
      });
    });

    describe("get allOccupancy", () => {
      it("returns the occupancy board", () => {
        expect(bitboards.allOccupancy).toBe(0n);
      });

      it("returns updated occupancy bitboard when any piece is modified", () => {
        bitboards.setBit(
          PIECE_TYPES.Pawn | PIECE_COLOURS.White,
          COORD_SQUARE_MAP.A1,
        );
        expect(bitboards.allOccupancy).toBe(0b1n);

        bitboards.setBit(
          PIECE_TYPES.Knight | PIECE_COLOURS.Black,
          COORD_SQUARE_MAP.B1,
        );
        expect(bitboards.allOccupancy).toBe(0b11n);

        bitboards.setBit(
          PIECE_TYPES.Bishop | PIECE_COLOURS.White,
          COORD_SQUARE_MAP.C1,
        );
        expect(bitboards.allOccupancy).toBe(0b111n);

        bitboards.setBit(
          PIECE_TYPES.Rook | PIECE_COLOURS.Black,
          COORD_SQUARE_MAP.D1,
        );
        expect(bitboards.allOccupancy).toBe(0b1111n);

        bitboards.setBit(
          PIECE_TYPES.Queen | PIECE_COLOURS.White,
          COORD_SQUARE_MAP.E1,
        );
        expect(bitboards.allOccupancy).toBe(0b11111n);

        bitboards.setBit(
          PIECE_TYPES.King | PIECE_COLOURS.Black,
          COORD_SQUARE_MAP.F1,
        );
        expect(bitboards.allOccupancy).toBe(0b111111n);
      });
    });

    describe("get whiteOccupancy", () => {
      it("returns the white occupancy board", () => {
        expect(bitboards.whiteOccupancy).toBe(0n);
      });

      it("updates white bitboards and returns the updated bitboard", () => {
        bitboards.setBit(
          PIECE_TYPES.Pawn | PIECE_COLOURS.White,
          COORD_SQUARE_MAP.A1,
        );
        expect(bitboards.whiteOccupancy).toBe(0b1n);

        bitboards.setBit(
          PIECE_TYPES.Knight | PIECE_COLOURS.White,
          COORD_SQUARE_MAP.B1,
        );
        expect(bitboards.whiteOccupancy).toBe(0b11n);

        bitboards.setBit(
          PIECE_TYPES.Bishop | PIECE_COLOURS.White,
          COORD_SQUARE_MAP.C1,
        );
        expect(bitboards.whiteOccupancy).toBe(0b111n);

        bitboards.setBit(
          PIECE_TYPES.Rook | PIECE_COLOURS.White,
          COORD_SQUARE_MAP.D1,
        );
        expect(bitboards.whiteOccupancy).toBe(0b1111n);

        bitboards.setBit(
          PIECE_TYPES.Queen | PIECE_COLOURS.White,
          COORD_SQUARE_MAP.E1,
        );
        expect(bitboards.whiteOccupancy).toBe(0b11111n);

        bitboards.setBit(
          PIECE_TYPES.King | PIECE_COLOURS.White,
          COORD_SQUARE_MAP.F1,
        );
        expect(bitboards.whiteOccupancy).toBe(0b111111n);
      });

      it("does not alter white bitboards with black updates", () => {
        bitboards.setBit(
          PIECE_TYPES.Pawn | PIECE_COLOURS.Black,
          COORD_SQUARE_MAP.A1,
        );
        expect(bitboards.whiteOccupancy).toBe(0n);

        bitboards.setBit(
          PIECE_TYPES.Knight | PIECE_COLOURS.Black,
          COORD_SQUARE_MAP.B1,
        );
        expect(bitboards.whiteOccupancy).toBe(0n);

        bitboards.setBit(
          PIECE_TYPES.Bishop | PIECE_COLOURS.Black,
          COORD_SQUARE_MAP.C1,
        );
        expect(bitboards.whiteOccupancy).toBe(0n);

        bitboards.setBit(
          PIECE_TYPES.Rook | PIECE_COLOURS.Black,
          COORD_SQUARE_MAP.D1,
        );
        expect(bitboards.whiteOccupancy).toBe(0n);

        bitboards.setBit(
          PIECE_TYPES.Queen | PIECE_COLOURS.Black,
          COORD_SQUARE_MAP.E1,
        );
        expect(bitboards.whiteOccupancy).toBe(0n);

        bitboards.setBit(
          PIECE_TYPES.King | PIECE_COLOURS.Black,
          COORD_SQUARE_MAP.F1,
        );
        expect(bitboards.whiteOccupancy).toBe(0n);
      });
    });

    describe("get blackOccupancy", () => {
      it("returns the black occupancy board", () => {
        expect(bitboards.blackOccupancy).toBe(0n);
      });

      it("updates black bitboards and returns the updated bitboard", () => {
        bitboards.setBit(
          PIECE_TYPES.Pawn | PIECE_COLOURS.Black,
          COORD_SQUARE_MAP.A1,
        );
        expect(bitboards.blackOccupancy).toBe(0b1n);

        bitboards.setBit(
          PIECE_TYPES.Knight | PIECE_COLOURS.Black,
          COORD_SQUARE_MAP.B1,
        );
        expect(bitboards.blackOccupancy).toBe(0b11n);

        bitboards.setBit(
          PIECE_TYPES.Bishop | PIECE_COLOURS.Black,
          COORD_SQUARE_MAP.C1,
        );
        expect(bitboards.blackOccupancy).toBe(0b111n);

        bitboards.setBit(
          PIECE_TYPES.Rook | PIECE_COLOURS.Black,
          COORD_SQUARE_MAP.D1,
        );
        expect(bitboards.blackOccupancy).toBe(0b1111n);

        bitboards.setBit(
          PIECE_TYPES.Queen | PIECE_COLOURS.Black,
          COORD_SQUARE_MAP.E1,
        );
        expect(bitboards.blackOccupancy).toBe(0b11111n);

        bitboards.setBit(
          PIECE_TYPES.King | PIECE_COLOURS.Black,
          COORD_SQUARE_MAP.F1,
        );
        expect(bitboards.blackOccupancy).toBe(0b111111n);
      });

      it("does not alter black bitboards with white updates", () => {
        bitboards.setBit(
          PIECE_TYPES.Pawn | PIECE_COLOURS.White,
          COORD_SQUARE_MAP.A1,
        );
        expect(bitboards.blackOccupancy).toBe(0n);

        bitboards.setBit(
          PIECE_TYPES.Knight | PIECE_COLOURS.White,
          COORD_SQUARE_MAP.B1,
        );
        expect(bitboards.blackOccupancy).toBe(0n);

        bitboards.setBit(
          PIECE_TYPES.Bishop | PIECE_COLOURS.White,
          COORD_SQUARE_MAP.C1,
        );
        expect(bitboards.blackOccupancy).toBe(0n);

        bitboards.setBit(
          PIECE_TYPES.Rook | PIECE_COLOURS.White,
          COORD_SQUARE_MAP.D1,
        );
        expect(bitboards.blackOccupancy).toBe(0n);

        bitboards.setBit(
          PIECE_TYPES.Queen | PIECE_COLOURS.White,
          COORD_SQUARE_MAP.E1,
        );
        expect(bitboards.blackOccupancy).toBe(0n);

        bitboards.setBit(
          PIECE_TYPES.King | PIECE_COLOURS.White,
          COORD_SQUARE_MAP.F1,
        );
        expect(bitboards.blackOccupancy).toBe(0n);
      });
    });

    describe("get whiteSlidingOccupancy", () => {
      it("returns the white sliding occupancy board", () => {
        expect(bitboards.whiteSlidingOccupancy).toBe(0n);
      });

      it("updates white sliding bitboards and returns the updated bitboard", () => {
        bitboards.setBit(
          PIECE_TYPES.Bishop | PIECE_COLOURS.White,
          COORD_SQUARE_MAP.A1,
        );
        expect(bitboards.whiteSlidingOccupancy).toBe(0b1n);

        bitboards.setBit(
          PIECE_TYPES.Rook | PIECE_COLOURS.White,
          COORD_SQUARE_MAP.B1,
        );
        expect(bitboards.whiteSlidingOccupancy).toBe(0b11n);

        bitboards.setBit(
          PIECE_TYPES.Queen | PIECE_COLOURS.White,
          COORD_SQUARE_MAP.C1,
        );
        expect(bitboards.whiteSlidingOccupancy).toBe(0b111n);
      });

      it("does not alter white sliding bitboard with non-sliding updates", () => {
        bitboards.setBit(
          PIECE_TYPES.Pawn | PIECE_COLOURS.White,
          COORD_SQUARE_MAP.A1,
        );
        expect(bitboards.whiteSlidingOccupancy).toBe(0n);

        bitboards.setBit(
          PIECE_TYPES.Knight | PIECE_COLOURS.White,
          COORD_SQUARE_MAP.B1,
        );
        expect(bitboards.whiteSlidingOccupancy).toBe(0n);

        bitboards.setBit(
          PIECE_TYPES.King | PIECE_COLOURS.White,
          COORD_SQUARE_MAP.C1,
        );
        expect(bitboards.whiteSlidingOccupancy).toBe(0n);
      });

      it("does not alter white sliding bitboard with enemy colour updates", () => {
        bitboards.setBit(
          PIECE_TYPES.Pawn | PIECE_COLOURS.Black,
          COORD_SQUARE_MAP.A1,
        );
        expect(bitboards.whiteSlidingOccupancy).toBe(0n);

        bitboards.setBit(
          PIECE_TYPES.Knight | PIECE_COLOURS.Black,
          COORD_SQUARE_MAP.B1,
        );
        expect(bitboards.whiteSlidingOccupancy).toBe(0n);

        bitboards.setBit(
          PIECE_TYPES.King | PIECE_COLOURS.Black,
          COORD_SQUARE_MAP.C1,
        );
        expect(bitboards.whiteSlidingOccupancy).toBe(0n);
      });
    });

    describe("get blackSlidingOccupancy", () => {
      it("returns the black sliding occupancy board", () => {
        expect(bitboards.blackSlidingOccupancy).toBe(0n);
      });

      it("updates black sliding bitboards and returns the updated bitboard", () => {
        bitboards.setBit(
          PIECE_TYPES.Bishop | PIECE_COLOURS.Black,
          COORD_SQUARE_MAP.A1,
        );
        expect(bitboards.blackSlidingOccupancy).toBe(0b1n);

        bitboards.setBit(
          PIECE_TYPES.Rook | PIECE_COLOURS.Black,
          COORD_SQUARE_MAP.B1,
        );
        expect(bitboards.blackSlidingOccupancy).toBe(0b11n);

        bitboards.setBit(
          PIECE_TYPES.Queen | PIECE_COLOURS.Black,
          COORD_SQUARE_MAP.C1,
        );
        expect(bitboards.blackSlidingOccupancy).toBe(0b111n);
      });

      it("does not alter black sliding bitboard with non-sliding updates", () => {
        bitboards.setBit(
          PIECE_TYPES.Pawn | PIECE_COLOURS.Black,
          COORD_SQUARE_MAP.A1,
        );
        expect(bitboards.blackSlidingOccupancy).toBe(0n);

        bitboards.setBit(
          PIECE_TYPES.Knight | PIECE_COLOURS.Black,
          COORD_SQUARE_MAP.B1,
        );
        expect(bitboards.blackSlidingOccupancy).toBe(0n);

        bitboards.setBit(
          PIECE_TYPES.King | PIECE_COLOURS.Black,
          COORD_SQUARE_MAP.C1,
        );
        expect(bitboards.blackSlidingOccupancy).toBe(0n);
      });

      it("does not alter black sliding bitboard with enemy colour updates", () => {
        bitboards.setBit(
          PIECE_TYPES.Pawn | PIECE_COLOURS.White,
          COORD_SQUARE_MAP.A1,
        );
        expect(bitboards.blackSlidingOccupancy).toBe(0n);

        bitboards.setBit(
          PIECE_TYPES.Knight | PIECE_COLOURS.White,
          COORD_SQUARE_MAP.B1,
        );
        expect(bitboards.blackSlidingOccupancy).toBe(0n);

        bitboards.setBit(
          PIECE_TYPES.King | PIECE_COLOURS.White,
          COORD_SQUARE_MAP.C1,
        );
        expect(bitboards.blackSlidingOccupancy).toBe(0n);
      });
    });
  });
});
