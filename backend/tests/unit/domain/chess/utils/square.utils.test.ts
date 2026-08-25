import { describe, expect, it } from "vitest";
import * as SquareUtils from "@/domain/chess/utils/square.utils.js";
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
} from "#/fixtures/chess/square.fixtures.js";

describe("square.utils", () => {
  describe(TEST_CATEGORIES.CONVERSION, () => {
    describe(SquareUtils.toRank.name, () => {
      it("converts a square to its rank on the board", () => {
        for (const square of SQUARES) {
          expect(SquareUtils.toRank(square)).toBe(EXPECTED_RANKS[square]);
        }
      });
    });

    describe(SquareUtils.toFile.name, () => {
      it("converts a square to its file on the board", () => {
        for (const square of SQUARES) {
          expect(SquareUtils.toFile(square)).toBe(EXPECTED_FILES[square]);
        }
      });
    });

    describe(SquareUtils.fileRankToSquare.name, () => {
      it("round-trips square through file/rank conversion", () => {
        for (const square of SQUARES) {
          const file = SquareUtils.toFile(square);
          const rank = SquareUtils.toRank(square);

          expect(file).toBe(EXPECTED_FILES[square]);
          expect(rank).toBe(EXPECTED_RANKS[square]);
          expect(SquareUtils.fileRankToSquare(file, rank)).toBe(square);
        }

        for (let file = 0; file < FILE_SIZE; file++) {
          for (let rank = 0; rank < RANK_SIZE; rank++) {
            const square = SquareUtils.fileRankToSquare(file, rank);

            expect(SquareUtils.toFile(square)).toBe(file);
            expect(SquareUtils.toRank(square)).toBe(rank);
          }
        }
      });
    });
  });

  describe(TEST_CATEGORIES.CLASSIFICATION, () => {
    describe(SquareUtils.isOnAFile.name, () => {
      it("identifies A file squares", () => {
        for (const square of SQUARES) {
          expect(SquareUtils.isOnAFile(square)).toBe(
            EXPECTED_FILES[square] === FILES.A,
          );
        }
      });
    });

    describe(SquareUtils.isOnHFile.name, () => {
      it("identifies H file squares", () => {
        for (const square of SQUARES) {
          expect(SquareUtils.isOnHFile(square)).toBe(
            EXPECTED_FILES[square] === FILES.H,
          );
        }
      });
    });

    describe(SquareUtils.isOnFirstRank.name, () => {
      it("identifies first rank squares", () => {
        for (const square of SQUARES) {
          expect(SquareUtils.isOnFirstRank(square)).toBe(
            EXPECTED_RANKS[square] === RANKS.FIRST,
          );
        }
      });
    });

    describe(SquareUtils.isOnEighthRank.name, () => {
      it("identifies eighth rank squares", () => {
        for (const square of SQUARES) {
          expect(SquareUtils.isOnEighthRank(square)).toBe(
            EXPECTED_RANKS[square] === RANKS.EIGHTH,
          );
        }
      });
    });

    describe(SquareUtils.isSquareOnFile.name, () => {
      it("round-trips toFile and isSquareOnFile", () => {
        const files = Object.keys(FILES) as Array<keyof typeof FILES>;

        for (const square of SQUARES) {
          const expectedFile = SquareUtils.toFile(square);

          for (const file of files) {
            expect(SquareUtils.isSquareOnFile(square, file)).toBe(
              FILES[file] === expectedFile,
            );
          }
        }
      });
    });

    describe(SquareUtils.isSquareOnRank.name, () => {
      it("round-trips toRank and isSquareOnRank", () => {
        const ranks = Object.keys(RANKS) as Array<keyof typeof RANKS>;

        for (const square of SQUARES) {
          const expectedRank = SquareUtils.toRank(square);

          for (const rank of ranks) {
            expect(SquareUtils.isSquareOnRank(square, rank)).toBe(
              RANKS[rank] === expectedRank,
            );
          }
        }
      });
    });
    describe(SquareUtils.isEdge.name, () => {
      it("returns true only for squares on a board edge", () => {
        for (const square of SQUARES) {
          const onAFile = SquareUtils.isOnAFile(square);
          const onHFile = SquareUtils.isOnHFile(square);
          const onFirstRank = SquareUtils.isOnFirstRank(square);
          const onEighthRank = SquareUtils.isOnEighthRank(square);

          expect(SquareUtils.isEdge(square)).toBe(
            onAFile || onHFile || onFirstRank || onEighthRank,
          );
        }
      });
    });

    describe(SquareUtils.isCorner.name, () => {
      it("returns true only for squares on a corner", () => {
        for (const square of SQUARES) {
          const onAFile = SquareUtils.isOnAFile(square);
          const onHFile = SquareUtils.isOnHFile(square);
          const onFirstRank = SquareUtils.isOnFirstRank(square);
          const onEighthRank = SquareUtils.isOnEighthRank(square);

          expect(SquareUtils.isCorner(square)).toBe(
            (onAFile || onHFile) && (onFirstRank || onEighthRank),
          );
        }
      });
    });
  });

  describe(TEST_CATEGORIES.RELATIONSHIP, () => {
    describe(SquareUtils.isOnSameFile.name, () => {
      it("returns true for squares on the same file", () => {
        for (const squareA of SQUARES) {
          for (const squareB of SQUARES) {
            const expected =
              EXPECTED_FILES[squareA] === EXPECTED_FILES[squareB];
            expect(SquareUtils.isOnSameFile(squareA, squareB)).toBe(expected);
          }
        }
      });
    });
    describe(SquareUtils.isOnSameRank.name, () => {
      it("returns true for squares on the same rank", () => {
        for (const squareA of SQUARES) {
          for (const squareB of SQUARES) {
            const expected =
              EXPECTED_RANKS[squareA] === EXPECTED_RANKS[squareB];
            expect(SquareUtils.isOnSameRank(squareA, squareB)).toBe(expected);
          }
        }
      });
    });
  });
  describe(TEST_CATEGORIES.MOVEMENT, () => {
    describe(SquareUtils.hasHorizontalWrapping.name, () => {
      it("determines whether a move has horizontal wrapping and stays in bounds", () => {
        for (const square of SQUARES) {
          const onAFile = SquareUtils.isOnAFile(square);
          const onHFile = SquareUtils.isOnHFile(square);
          const onFirstRank = SquareUtils.isOnFirstRank(square);
          const onEighthRank = SquareUtils.isOnEighthRank(square);

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
            expect(SquareUtils.hasHorizontalWrapping(square, direction)).toBe(
              expected,
            );
          }
        }
      });
    });
  });

  describe(TEST_CATEGORIES.VALIDATION, () => {
    describe(SquareUtils.isValidSquare.name, () => {
      it("returns true for all valid squares", () => {
        for (let square = 0; square < BOARD_SIZE; square++) {
          expect(SquareUtils.isValidSquare(square)).toBe(true);
        }
      });

      it("returns false for negative numbers", () => {
        for (let invalidSquare = -100; invalidSquare < 0; invalidSquare++) {
          expect(SquareUtils.isValidSquare(invalidSquare)).toBe(false);
        }
      });

      it("returns false for numbers greater than 63", () => {
        for (let invalidSquare = 64; invalidSquare < 124; invalidSquare++) {
          expect(SquareUtils.isValidSquare(invalidSquare)).toBe(false);
        }
      });
    });

    describe(SquareUtils.isValidDirection.name, () => {
      it("determines whether a move stays on the board", () => {
        for (const square of SQUARES) {
          const onAFile = SquareUtils.isOnAFile(square);
          const onHFile = SquareUtils.isOnHFile(square);
          const onFirstRank = SquareUtils.isOnFirstRank(square);
          const onEighthRank = SquareUtils.isOnEighthRank(square);

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
            expect(SquareUtils.isValidDirection(square, direction)).toBe(
              expected,
            );
          }
        }
      });
    });
  });

  describe(TEST_CATEGORIES.DISTANCE, () => {
    describe(SquareUtils.fileDistance.name, () => {
      it("returns the true file distance between two squares", () => {
        for (const squareA of SQUARES) {
          for (const squareB of SQUARES) {
            const expected = Math.abs(
              EXPECTED_FILES[squareA]! - EXPECTED_FILES[squareB]!,
            );
            expect(SquareUtils.fileDistance(squareA, squareB)).toBe(expected);
          }
        }
      });
    });
    describe(SquareUtils.rankDistance.name, () => {
      it("returns the true file distance between two squares", () => {
        for (const squareA of SQUARES) {
          for (const squareB of SQUARES) {
            const expected = Math.abs(
              EXPECTED_RANKS[squareA]! - EXPECTED_RANKS[squareB]!,
            );
            expect(SquareUtils.rankDistance(squareA, squareB)).toBe(expected);
          }
        }
      });
    });
  });
});
