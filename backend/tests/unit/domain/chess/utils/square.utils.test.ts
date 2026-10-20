import { describe, expect, it } from "vitest";
import * as TestSquareUtils from "@/domain/chess/utils/square.utils.js";
import {
  BOARD_SIZE,
  FILE_SIZE,
  FILES,
  RANK_SIZE,
  RANKS,
  SQUARES,
} from "@/domain/chess/board/board.constants.js";
import { TEST_CATEGORIES } from "#/utils/test-constants.js";
import {
  EXPECTED_RANKS,
  EXPECTED_FILES,
  COORD_SQUARE_MAP,
} from "#/fixtures/chess/square.fixtures.js";

describe("square.utils", () => {
  describe(TEST_CATEGORIES.CONVERSION, () => {
    describe(TestSquareUtils.toRank.name, () => {
      it("converts a square to its rank on the board", () => {
        for (const square of SQUARES) {
          expect(TestSquareUtils.toRank(square)).toBe(EXPECTED_RANKS[square]);
        }
      });
    });

    describe(TestSquareUtils.toFile.name, () => {
      it("converts a square to its file on the board", () => {
        for (const square of SQUARES) {
          expect(TestSquareUtils.toFile(square)).toBe(EXPECTED_FILES[square]);
        }
      });
    });

    describe(TestSquareUtils.fileRankToSquare.name, () => {
      it("round-trips square through file/rank conversion", () => {
        for (const square of SQUARES) {
          const file = TestSquareUtils.toFile(square);
          const rank = TestSquareUtils.toRank(square);

          expect(file).toBe(EXPECTED_FILES[square]);
          expect(rank).toBe(EXPECTED_RANKS[square]);
          expect(TestSquareUtils.fileRankToSquare(file, rank)).toBe(square);
        }

        for (let file = 0; file < FILE_SIZE; file++) {
          for (let rank = 0; rank < RANK_SIZE; rank++) {
            const square = TestSquareUtils.fileRankToSquare(file, rank);

            expect(TestSquareUtils.toFile(square)).toBe(file);
            expect(TestSquareUtils.toRank(square)).toBe(rank);
          }
        }
      });
    });
  });

  describe(TEST_CATEGORIES.CLASSIFICATION, () => {
    describe(TestSquareUtils.isOnAFile.name, () => {
      it("identifies A file squares", () => {
        for (const square of SQUARES) {
          expect(TestSquareUtils.isOnAFile(square)).toBe(
            EXPECTED_FILES[square] === FILES.A,
          );
        }
      });
    });

    describe(TestSquareUtils.isOnHFile.name, () => {
      it("identifies H file squares", () => {
        for (const square of SQUARES) {
          expect(TestSquareUtils.isOnHFile(square)).toBe(
            EXPECTED_FILES[square] === FILES.H,
          );
        }
      });
    });

    describe(TestSquareUtils.isOnFirstRank.name, () => {
      it("identifies first rank squares", () => {
        for (const square of SQUARES) {
          expect(TestSquareUtils.isOnFirstRank(square)).toBe(
            EXPECTED_RANKS[square] === RANKS.FIRST,
          );
        }
      });
    });

    describe(TestSquareUtils.isOnEighthRank.name, () => {
      it("identifies eighth rank squares", () => {
        for (const square of SQUARES) {
          expect(TestSquareUtils.isOnEighthRank(square)).toBe(
            EXPECTED_RANKS[square] === RANKS.EIGHTH,
          );
        }
      });
    });

    describe(TestSquareUtils.isSquareOnFile.name, () => {
      it("round-trips toFile and isSquareOnFile", () => {
        const files = Object.keys(FILES) as Array<keyof typeof FILES>;

        for (const square of SQUARES) {
          const expectedFile = TestSquareUtils.toFile(square);

          for (const file of files) {
            expect(TestSquareUtils.isSquareOnFile(square, file)).toBe(
              FILES[file] === expectedFile,
            );
          }
        }
      });
    });

    describe(TestSquareUtils.isSquareOnRank.name, () => {
      it("round-trips toRank and isSquareOnRank", () => {
        const ranks = Object.keys(RANKS) as Array<keyof typeof RANKS>;

        for (const square of SQUARES) {
          const expectedRank = TestSquareUtils.toRank(square);

          for (const rank of ranks) {
            expect(TestSquareUtils.isSquareOnRank(square, rank)).toBe(
              RANKS[rank] === expectedRank,
            );
          }
        }
      });
    });
    describe(TestSquareUtils.isEdge.name, () => {
      it("returns true only for squares on a board edge", () => {
        for (const square of SQUARES) {
          const onAFile = TestSquareUtils.isOnAFile(square);
          const onHFile = TestSquareUtils.isOnHFile(square);
          const onFirstRank = TestSquareUtils.isOnFirstRank(square);
          const onEighthRank = TestSquareUtils.isOnEighthRank(square);

          expect(TestSquareUtils.isEdge(square)).toBe(
            onAFile || onHFile || onFirstRank || onEighthRank,
          );
        }
      });
    });

    describe(TestSquareUtils.isCorner.name, () => {
      it("returns true only for squares on a corner", () => {
        for (const square of SQUARES) {
          const onAFile = TestSquareUtils.isOnAFile(square);
          const onHFile = TestSquareUtils.isOnHFile(square);
          const onFirstRank = TestSquareUtils.isOnFirstRank(square);
          const onEighthRank = TestSquareUtils.isOnEighthRank(square);

          expect(TestSquareUtils.isCorner(square)).toBe(
            (onAFile || onHFile) && (onFirstRank || onEighthRank),
          );
        }
      });
    });
    describe(TestSquareUtils.isPromotionSquare.name, () => {
      it("returns true only for a move to the first or eighth rank", () => {
        for (const square of SQUARES) {
          expect(TestSquareUtils.isPromotionSquare(square)).toBe(
            EXPECTED_RANKS[square] === RANKS.FIRST ||
              EXPECTED_RANKS[square] === RANKS.EIGHTH,
          );
        }
      });
    });
    describe(TestSquareUtils.isEnPassantSquare, () => {
      const enPassant = COORD_SQUARE_MAP.F3;
      it("returns true when the to square is the same as the en passant square", () => {
        expect(
          TestSquareUtils.isEnPassantSquare(enPassant, COORD_SQUARE_MAP.F3),
        ).toBe(true);
      });
      it("returns false when the to square is the same as the en passant square", () => {
        expect(
          TestSquareUtils.isEnPassantSquare(enPassant, COORD_SQUARE_MAP.F2),
        ).toBe(false);
      });
    });
  });

  describe(TEST_CATEGORIES.RELATIONSHIP, () => {
    describe(TestSquareUtils.isOnSameFile.name, () => {
      it("returns true for squares on the same file", () => {
        for (const squareA of SQUARES) {
          for (const squareB of SQUARES) {
            const expected =
              EXPECTED_FILES[squareA] === EXPECTED_FILES[squareB];
            expect(TestSquareUtils.isOnSameFile(squareA, squareB)).toBe(
              expected,
            );
          }
        }
      });
    });
    describe(TestSquareUtils.isOnSameRank.name, () => {
      it("returns true for squares on the same rank", () => {
        for (const squareA of SQUARES) {
          for (const squareB of SQUARES) {
            const expected =
              EXPECTED_RANKS[squareA] === EXPECTED_RANKS[squareB];
            expect(TestSquareUtils.isOnSameRank(squareA, squareB)).toBe(
              expected,
            );
          }
        }
      });
    });
  });
  describe(TEST_CATEGORIES.MOVEMENT, () => {
    describe(TestSquareUtils.hasHorizontalWrapping.name, () => {
      it("determines whether a move has horizontal wrapping and stays in bounds", () => {
        for (const square of SQUARES) {
          const onAFile = TestSquareUtils.isOnAFile(square);
          const onHFile = TestSquareUtils.isOnHFile(square);
          const onFirstRank = TestSquareUtils.isOnFirstRank(square);
          const onEighthRank = TestSquareUtils.isOnEighthRank(square);

          const cases = [
            ["N", onEighthRank],
            ["E", onHFile],
            ["S", onFirstRank],
            ["W", onAFile],
            ["NW", onEighthRank || onAFile],
            ["NE", onEighthRank || onHFile],
            ["SE", onFirstRank || onHFile],
            ["SW", onFirstRank || onAFile],
          ] as const;

          for (const [direction, expected] of cases) {
            expect(
              TestSquareUtils.hasHorizontalWrapping(square, direction),
            ).toBe(expected);
          }
        }
      });
    });
  });

  describe(TEST_CATEGORIES.VALIDATION, () => {
    describe(TestSquareUtils.isValidSquare.name, () => {
      it("returns true for all valid squares", () => {
        for (let square = 0; square < BOARD_SIZE; square++) {
          expect(TestSquareUtils.isValidSquare(square)).toBe(true);
        }
      });

      it("returns false for negative numbers", () => {
        for (let invalidSquare = -100; invalidSquare < 0; invalidSquare++) {
          expect(TestSquareUtils.isValidSquare(invalidSquare)).toBe(false);
        }
      });

      it("returns false for numbers greater than 63", () => {
        for (let invalidSquare = 64; invalidSquare < 124; invalidSquare++) {
          expect(TestSquareUtils.isValidSquare(invalidSquare)).toBe(false);
        }
      });
    });

    describe(TestSquareUtils.isValidDirection.name, () => {
      it("determines whether a move stays on the board", () => {
        for (const square of SQUARES) {
          const onAFile = TestSquareUtils.isOnAFile(square);
          const onHFile = TestSquareUtils.isOnHFile(square);
          const onFirstRank = TestSquareUtils.isOnFirstRank(square);
          const onEighthRank = TestSquareUtils.isOnEighthRank(square);

          const cases = [
            ["N", !onEighthRank],
            ["E", !onHFile],
            ["S", !onFirstRank],
            ["W", !onAFile],
            ["NW", !onEighthRank && !onAFile],
            ["NE", !onEighthRank && !onHFile],
            ["SE", !onFirstRank && !onHFile],
            ["SW", !onFirstRank && !onAFile],
          ] as const;

          for (const [direction, expected] of cases) {
            expect(TestSquareUtils.isValidDirection(square, direction)).toBe(
              expected,
            );
          }
        }
      });
    });
  });

  describe(TEST_CATEGORIES.DISTANCE, () => {
    describe(TestSquareUtils.fileDistance.name, () => {
      it("returns the true file distance between two squares", () => {
        for (const squareA of SQUARES) {
          for (const squareB of SQUARES) {
            const expected = Math.abs(
              EXPECTED_FILES[squareA]! - EXPECTED_FILES[squareB]!,
            );
            expect(TestSquareUtils.fileDistance(squareA, squareB)).toBe(
              expected,
            );
          }
        }
      });
    });
    describe(TestSquareUtils.rankDistance.name, () => {
      it("returns the true file distance between two squares", () => {
        for (const squareA of SQUARES) {
          for (const squareB of SQUARES) {
            const expected = Math.abs(
              EXPECTED_RANKS[squareA]! - EXPECTED_RANKS[squareB]!,
            );
            expect(TestSquareUtils.rankDistance(squareA, squareB)).toBe(
              expected,
            );
          }
        }
      });
    });
  });
});
