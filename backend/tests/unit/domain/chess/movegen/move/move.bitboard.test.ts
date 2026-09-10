import { TEST_CATEGORIES } from "#/utils/test-constants.js";
import {
  FILE_MASKS,
  FILES,
  FULL_BOARD_MASK,
  RANK_MASKS,
  RANKS,
} from "@/domain/chess/board/board.constants.js";
import * as TestMoveBitboard from "@/domain/chess/movegen/move/move.bitboard.js";
import { describe, expect, it } from "vitest";

describe("move.bitboard", () => {
  describe(TEST_CATEGORIES.MOVEMENT, () => {
    describe(TestMoveBitboard.shiftSouth.name, () => {
      it("returns an empty board when shifting the first rank south", () => {
        expect(TestMoveBitboard.shiftSouth(RANK_MASKS[RANKS.FIRST]!)).toBe(0n);
      });
      it("shifts rank N south to rank N - 1", () => {
        for (let N = RANKS.SECOND; N <= RANKS.EIGHTH; N++) {
          const value = RANK_MASKS[N]!;
          const expected = RANK_MASKS[N - 1]!;
          expect(TestMoveBitboard.shiftSouth(value)).toBe(expected);
        }
      });
    });
    describe(TestMoveBitboard.shiftNorth.name, () => {
      it("shifts the eighth north rank beyond the board", () => {
        const value = RANK_MASKS[RANKS.EIGHTH]!;
        expect(TestMoveBitboard.shiftNorth(value)).toBe(0n);
      });
      it("shifts rank N north to rank N + 1", () => {
        for (let N = RANKS.FIRST; N < RANKS.EIGHTH; N++) {
          const value = RANK_MASKS[N]!;
          const expected = RANK_MASKS[N + 1]!;
          expect(TestMoveBitboard.shiftNorth(value)).toBe(expected);
        }
      });
    });
    describe(TestMoveBitboard.shiftEast.name, () => {
      it("returns an empty board when the H file is shifted east", () => {
        expect(TestMoveBitboard.shiftEast(FILE_MASKS[FILES.H]!)).toBe(0n);
      });
      it("shifts file N east to file N + 1", () => {
        for (let N = FILES.A; N < FILES.H; N++) {
          const value = FILE_MASKS[N]!;
          const expected = FILE_MASKS[N + 1]!;
          expect(TestMoveBitboard.shiftEast(value)).toBe(expected);
        }
      });
    });
    describe(TestMoveBitboard.shiftWest.name, () => {
      it("returns an empty board when the A file is shifted west", () => {
        expect(TestMoveBitboard.shiftWest(FILE_MASKS[FILES.A]!)).toBe(0n);
      });
      it("shifts file N east to file N - 1", () => {
        for (let N = FILES.B; N <= FILES.H; N++) {
          const value = FILE_MASKS[N]!;
          const expected = FILE_MASKS[N - 1]!;
          expect(TestMoveBitboard.shiftWest(value)).toBe(expected);
        }
      });
    });
    describe(TestMoveBitboard.shiftNorthEast.name, () => {
      it("returns an empty board when square h8 is shifted north east", () => {
        const value = FILE_MASKS[FILES.H]! & RANK_MASKS[RANKS.EIGHTH]!;
        expect(TestMoveBitboard.shiftNorthEast(value)).toBe(0n);
      });
      it("shifts squares a8-g8 north east beyond the board", () => {
        const RANK_EIGHT = RANK_MASKS[RANKS.EIGHTH]!;
        for (let file = FILES.A; file <= FILES.G; file++) {
          const value = FILE_MASKS[file]! & RANK_EIGHT;

          expect(TestMoveBitboard.shiftNorthEast(value)).toBe(0n);
        }
      });
      it("shifts a square one rank and file north east", () => {
        for (let rank = RANKS.FIRST; rank < RANKS.EIGHTH; rank++) {
          for (let file = FILES.A; file < FILES.H; file++) {
            const value = FILE_MASKS[file]! & RANK_MASKS[rank]!;
            const expected = FILE_MASKS[file + 1]! & RANK_MASKS[rank + 1]!;
            expect(TestMoveBitboard.shiftNorthEast(value)).toBe(expected);
          }
        }
      });
    });
    describe(TestMoveBitboard.shiftNorthWest.name, () => {
      it("returns an empty board when square a8 is shifted north west", () => {
        const value = FILE_MASKS[FILES.A]! & RANK_MASKS[RANKS.EIGHTH]!;
        expect(TestMoveBitboard.shiftNorthWest(value)).toBe(0n);
      });
      it("shifts squares b8-h8 north west beyond the board", () => {
        const EIGHTH_RANK = RANK_MASKS[RANKS.EIGHTH]!;
        for (let file = FILES.B; file <= FILES.H; file++) {
          const value = FILE_MASKS[file]! & EIGHTH_RANK;

          expect(TestMoveBitboard.shiftNorthWest(value)).toBe(0n);
        }
      });
      it("shifts a square one rank and file north west", () => {
        for (let rank = RANKS.FIRST; rank < RANKS.EIGHTH; rank++) {
          for (let file = FILES.B; file <= FILES.H; file++) {
            const value = FILE_MASKS[file]! & RANK_MASKS[rank]!;
            const expected = FILE_MASKS[file - 1]! & RANK_MASKS[rank + 1]!;
            expect(TestMoveBitboard.shiftNorthWest(value)).toBe(expected);
          }
        }
      });
    });
    describe(TestMoveBitboard.shiftSouthEast.name, () => {
      it("returns an empty board when a square on the first rank is shifted south east", () => {
        const FIRST_RANK = RANK_MASKS[RANKS.FIRST]!;
        for (let file = FILES.A; file <= FILES.H; file++) {
          const value = FILE_MASKS[file]! & FIRST_RANK;
          expect(TestMoveBitboard.shiftSouthEast(value)).toBe(0n);
        }
      });
      it("returns an empty board when a square on file H is shifted south east", () => {
        const H_FILE = FILE_MASKS[FILES.H]!;
        for (let rank = RANKS.FIRST; rank <= RANKS.EIGHTH; rank++) {
          const value = H_FILE & RANK_MASKS[rank]!;
          expect(TestMoveBitboard.shiftSouthEast(value)).toBe(0n);
        }
      });
      it("shifts a square one rank and file south east", () => {
        for (let rank = RANKS.SECOND; rank <= RANKS.EIGHTH; rank++) {
          for (let file = FILES.B; file < FILES.H; file++) {
            const value = FILE_MASKS[file]! & RANK_MASKS[rank]!;
            const expected = FILE_MASKS[file + 1]! & RANK_MASKS[rank - 1]!;
            expect(TestMoveBitboard.shiftSouthEast(value)).toBe(expected);
          }
        }
      });
    });
    describe(TestMoveBitboard.shiftSouthWest.name, () => {
      it("returns an empty board when a square on the first rank is shifted south west", () => {
        const FIRST_RANK = RANK_MASKS[RANKS.FIRST]!;
        for (let file = FILES.A; file <= FILES.H; file++) {
          const value = FILE_MASKS[file]! & FIRST_RANK;
          expect(TestMoveBitboard.shiftSouthWest(value)).toBe(0n);
        }
      });
      it("returns an empty board when a square on file A is shifted south west", () => {
        const A_FILE = FILE_MASKS[FILES.A]!;
        for (let rank = RANKS.FIRST; rank <= RANKS.EIGHTH; rank++) {
          const value = A_FILE & RANK_MASKS[rank]!;
          expect(TestMoveBitboard.shiftSouthWest(value)).toBe(0n);
        }
      });
      it("shifts a square one rank and file south west", () => {
        for (let rank = RANKS.SECOND; rank <= RANKS.EIGHTH; rank++) {
          for (let file = FILES.B; file < FILES.H; file++) {
            const value = FILE_MASKS[file]! & RANK_MASKS[rank]!;
            const expected = FILE_MASKS[file - 1]! & RANK_MASKS[rank - 1]!;
            expect(TestMoveBitboard.shiftSouthWest(value)).toBe(expected);
          }
        }
      });
    });
    describe(TestMoveBitboard.shiftRight.name, () => {
      it("shifts the first rank up 2 ranks and returns the third rank", () => {
        const value = TestMoveBitboard.shiftRight(
          RANK_MASKS[RANKS.FIRST]!,
          2 * 8,
        );
        expect(value).toBe(RANK_MASKS[RANKS.THIRD]);
      });
      it("shifts the first rank up 7 ranks and returns the eighth rank", () => {
        const value = TestMoveBitboard.shiftRight(
          RANK_MASKS[RANKS.FIRST]!,
          7 * 8,
        );
        expect(value).toBe(RANK_MASKS[RANKS.EIGHTH]);
      });
      it("returns an empty bitboard shifting past board limits", () => {
        const value = TestMoveBitboard.shiftRight(RANK_MASKS[RANKS.EIGHTH]!, 8);
        expect(value).toBe(0n);
      });
    });
    describe(TestMoveBitboard.shiftLeft.name, () => {
      it("shifts the eighth rank down 2 ranks and returns the sixth rank", () => {
        const value = TestMoveBitboard.shiftLeft(
          RANK_MASKS[RANKS.EIGHTH]!,
          2 * 8,
        );
        expect(value).toBe(RANK_MASKS[RANKS.SIXTH]);
      });
      it("shifts the eighth rank down 7 ranks and returns the first rank", () => {
        const value = TestMoveBitboard.shiftLeft(
          RANK_MASKS[RANKS.EIGHTH]!,
          7 * 8,
        );
        expect(value).toBe(RANK_MASKS[RANKS.FIRST]);
      });
      it("returns an empty bitboard shifting past board limits", () => {
        const value = TestMoveBitboard.shiftLeft(RANK_MASKS[RANKS.FIRST]!, 8);
        expect(value).toBe(0n);
      });
    });
  });
});
