import { TEST_CATEGORIES } from "#/utils/test-constants.js";
import {
  BLACK_PAWN_PROMOTION_RANK_MASK,
  CORNER_MASK,
  EDGE_MASK,
  NOT_CORNER_MASK,
  NOT_EDGE_MASK,
  STARTING_BLACK_PAWNS_MASK,
  STARTING_BLACK_PIECES_MASK,
  STARTING_WHITE_PAWNS_MASK,
  STARTING_WHITE_PIECES_MASK,
  WHITE_PAWN_PROMOTION_RANK_MASK,
} from "@/domain/chess/bitboard/bitboard.masks.js";
import {
  BOARD_MASK,
  FILE_MASKS,
  RANK_MASKS,
} from "@/domain/chess/board/board.constants.js";
import { popCount } from "@/domain/chess/utils/bitboard.utils.js";
import { describe, expect, it } from "vitest";

describe("bitboard.masks", () => {
  describe(TEST_CATEGORIES.PROPERTIES, () => {
    describe("EDGE_MASK", () => {
      it("only has edge bits set", () => {
        expect(EDGE_MASK).toBe(
          RANK_MASKS[0]! | RANK_MASKS[7]! | FILE_MASKS[0]! | FILE_MASKS[7]!,
        );
      });
    });
    describe("CORNER_MASK", () => {
      it("only has corner bits set", () => {
        expect(CORNER_MASK).toBe(
          (1n << 0n) | (1n << 7n) | (1n << 56n) | (1n << 63n),
        );
      });
    });
    describe("NOT_EDGE_MASK", () => {
      it("has all non-edge bits set", () => {
        expect(NOT_EDGE_MASK).toBe(BOARD_MASK ^ EDGE_MASK);
      });
    });
    describe("NOT_CORNER_MASK", () => {
      it("has all non-corner edge bits set", () => {
        expect(NOT_CORNER_MASK).toBe(EDGE_MASK ^ CORNER_MASK);
      });
    });

    describe("STARTING_BLACK_PIECES_MASK", () => {
      it("only has bits on the seventh and eighth rank set", () => {
        expect(STARTING_BLACK_PIECES_MASK).toBe(
          RANK_MASKS[6]! | RANK_MASKS[7]!,
        );
      });
      it("has a count of 16 bits", () => {
        expect(popCount(STARTING_BLACK_PIECES_MASK)).toBe(16);
      });
    });
    describe("STARTING_WHITE_PIECES_MASK", () => {
      it("only has bits on the first and second rank set", () => {
        expect(STARTING_WHITE_PIECES_MASK).toBe(
          RANK_MASKS[0]! | RANK_MASKS[1]!,
        );
      });
      it("has a count of 16 bits", () => {
        expect(popCount(STARTING_WHITE_PIECES_MASK)).toBe(16);
      });
    });
    describe("STARTING_BLACK_PAWNS_MASK", () => {
      it("only has bits on the seventh rank set", () => {
        expect(STARTING_BLACK_PAWNS_MASK).toBe(RANK_MASKS[6]!);
      });
      it("has a count of 16 bits", () => {
        expect(popCount(STARTING_BLACK_PAWNS_MASK)).toBe(8);
      });
    });
    describe("STARTING_WHITE_PAWNS_MASK", () => {
      it("only has bits on the second rank set", () => {
        expect(STARTING_WHITE_PAWNS_MASK).toBe(RANK_MASKS[1]!);
      });
      it("has a count of 8 bits", () => {
        expect(popCount(STARTING_WHITE_PAWNS_MASK)).toBe(8);
      });
    });
    describe("BLACK_PAWN_PROMOTION_RANK_MASK", () => {
      it("only has bits on the first rank set", () => {
        expect(BLACK_PAWN_PROMOTION_RANK_MASK).toBe(RANK_MASKS[0]!);
      });
      it("has a count of 8 bits", () => {
        expect(popCount(BLACK_PAWN_PROMOTION_RANK_MASK)).toBe(8);
      });
    });
    describe("WHITE_PAWN_PROMOTION_RANK_MASK", () => {
      it("only has bits on the eighth rank set", () => {
        expect(WHITE_PAWN_PROMOTION_RANK_MASK).toBe(RANK_MASKS[7]!);
      });
      it("has a count of 8 bits", () => {
        expect(popCount(WHITE_PAWN_PROMOTION_RANK_MASK)).toBe(8);
      });
    });
  });
});
