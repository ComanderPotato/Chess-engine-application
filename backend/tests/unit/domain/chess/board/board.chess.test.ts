import { COORD_SQUARE_MAP } from "#/fixtures/chess/square.fixtures.js";
import { TEST_CATEGORIES } from "#/utils/test-constants.js";
import { Bitboards } from "@/domain/chess/bitboard/bitboard.chess.js";
import { Board } from "@/domain/chess/board/board.chess.js";
import {
  PIECE_COLOURS,
  PIECE_TYPES,
} from "@/domain/chess/piece/piece.constants.js";
import { beforeEach, describe, expect, it } from "vitest";

describe("board.chess", () => {
  let board: Board;
  beforeEach(() => {
    board = new Board();
  });

  describe(TEST_CATEGORIES.BOARD, () => {
    describe(TEST_CATEGORIES.STATE, () => {
      describe("activeColour", () => {
        it("gets the active colour", () => {
          expect(board.activeColour).toBe(PIECE_COLOURS.White);
        });
        it("sets the active colour", () => {
          board.activeColour = PIECE_COLOURS.Black;
          expect(board.activeColour).toBe(PIECE_COLOURS.Black);
        });
      });

      describe("castlingRights", () => {
        it("gets castling rights", () => {
          expect(board.castlingRights).toBe(0b1111);
        });
        it("sets castling rights", () => {
          board.castlingRights = 0b1110;
          expect(board.castlingRights).toBe(0b1110);
        });
      });

      describe("halfMoveClock", () => {
        it("gets the half move clock", () => {
          expect(board.halfMoveClock).toBe(0);
        });
        it("sets the half move clock", () => {
          board.halfMoveClock = 15;
          expect(board.halfMoveClock).toBe(15);
        });
      });

      describe("fullMoveClock", () => {
        it("gets the full move clock", () => {
          expect(board.fullMoveClock).toBe(1);
        });
        it("sets the full move clock", () => {
          board.fullMoveClock = 15;
          expect(board.fullMoveClock).toBe(15);
        });
      });
    });

    describe(TEST_CATEGORIES.BITBOARDS, () => {
      describe("occupancy", () => {
        it("gets the occupancy", () => {
          expect(board.occupancy).toBe(0n);
          expect(typeof board.occupancy).toBe("bigint");
        });
      });
      describe("friendlyOccupancy", () => {
        it("gets the friendly occupancy", () => {
          expect(board.friendlyOccupancy).toBe(0n);
          expect(typeof board.friendlyOccupancy).toBe("bigint");
        });
      });
      describe("enemyOccupancy", () => {
        it("gets the enemy occupancy", () => {
          expect(board.enemyOccupancy).toBe(0n);
          expect(typeof board.enemyOccupancy).toBe("bigint");
        });
      });
      describe("whiteOccupancy", () => {
        it("gets the white occupancy", () => {
          expect(board.whiteOccupancy).toBe(0n);
          expect(typeof board.whiteOccupancy).toBe("bigint");
        });
      });
      describe("blackOccupancy", () => {
        it("gets the black occupancy", () => {
          expect(board.blackOccupancy).toBe(0n);
          expect(typeof board.blackOccupancy).toBe("bigint");
        });
      });
      describe("whiteSlidingOccupancy", () => {
        it("gets the white sliding occupancy", () => {
          expect(board.whiteSlidingOccupancy).toBe(0n);
          expect(typeof board.whiteSlidingOccupancy).toBe("bigint");
        });
      });
      describe("blackSlidingOccupancy", () => {
        it("gets the white sliding occupancy", () => {
          expect(board.blackSlidingOccupancy).toBe(0n);
          expect(typeof board.blackSlidingOccupancy).toBe("bigint");
        });
      });

      describe("bitboards", () => {
        it("returns the bitboards object", () => {
          expect(board.bitboards).toBeInstanceOf(Bitboards);
        });
      });
      describe("bitboardsList", () => {
        it("returns an array of bitboards", () => {
          expect(board.bitboardsList).toBeDefined();
          expect(board.bitboardsList).toBe(board.bitboards.bitboards);
          expect(board.bitboardsList).toHaveLength(12);
        });
      });
      describe(Board.prototype.getOccupancy.name, () => {
        it("returns bitboards of a specific type", () => {
          expect(board.getOccupancy(PIECE_TYPES.Pawn)).toBe(0n);
          expect(board.getOccupancy(PIECE_TYPES.Bishop)).toBe(0n);
          expect(board.getOccupancy(PIECE_TYPES.Queen)).toBe(0n);
        });
      });
      describe(Board.prototype.getBitboard.name, () => {
        it("gets bitboard of a specific piece", () => {
          expect(
            board.getBitboard(PIECE_TYPES.Pawn | PIECE_COLOURS.White),
          ).toBe(0n);
          expect(
            board.getBitboard(PIECE_TYPES.Bishop | PIECE_COLOURS.Black),
          ).toBe(0n);
          expect(
            board.getBitboard(PIECE_TYPES.Queen | PIECE_COLOURS.White),
          ).toBe(0n);
        });
        it("sets bitboard of a specific piece", () => {
          let piece = PIECE_TYPES.Pawn | PIECE_COLOURS.White;
          expect(board.getBitboard(piece)).toBe(0n);

          board.setBitboard(piece, COORD_SQUARE_MAP.A1);
          expect(board.getBitboard(piece)).toBe(0b1n);

          board.setBitboard(piece, COORD_SQUARE_MAP.B1);
          expect(board.getBitboard(piece)).toBe(0b11n);

          piece = PIECE_TYPES.Bishop | PIECE_COLOURS.Black;
          expect(board.getBitboard(piece)).toBe(0n);

          board.setBitboard(piece, COORD_SQUARE_MAP.A1);
          expect(board.getBitboard(piece)).toBe(0b1n);
        });
      });
      describe(Board.prototype.getFriendlyOccupancyFor.name, () => {
        it("returns friendly occupancy for a specific colour", () => {
          expect(board.getFriendlyOccupancyFor(PIECE_COLOURS.White)).toBe(0n);
          expect(board.getFriendlyOccupancyFor(PIECE_COLOURS.Black)).toBe(0n);

          board.setBitboard(
            PIECE_TYPES.Pawn | PIECE_COLOURS.White,
            COORD_SQUARE_MAP.A1,
          );
          expect(board.getFriendlyOccupancyFor(PIECE_COLOURS.White)).toBe(0b1n);
          expect(board.getFriendlyOccupancyFor(PIECE_COLOURS.Black)).toBe(0n);

          board.setBitboard(
            PIECE_TYPES.Pawn | PIECE_COLOURS.Black,
            COORD_SQUARE_MAP.A1,
          );
          expect(board.getFriendlyOccupancyFor(PIECE_COLOURS.White)).toBe(0b1n);
          expect(board.getFriendlyOccupancyFor(PIECE_COLOURS.Black)).toBe(0b1n);
        });
      });
      describe(Board.prototype.getEnemyOccupancyFor.name, () => {
        it("returns enemy occupancy for a specific colour", () => {
          expect(board.getEnemyOccupancyFor(PIECE_COLOURS.White)).toBe(0n);
          expect(board.getEnemyOccupancyFor(PIECE_COLOURS.Black)).toBe(0n);

          board.setBitboard(
            PIECE_TYPES.Pawn | PIECE_COLOURS.White,
            COORD_SQUARE_MAP.A1,
          );
          expect(board.getEnemyOccupancyFor(PIECE_COLOURS.Black)).toBe(0b1n);
          expect(board.getEnemyOccupancyFor(PIECE_COLOURS.White)).toBe(0n);

          board.setBitboard(
            PIECE_TYPES.Pawn | PIECE_COLOURS.Black,
            COORD_SQUARE_MAP.A1,
          );
          expect(board.getEnemyOccupancyFor(PIECE_COLOURS.Black)).toBe(0b1n);
          expect(board.getEnemyOccupancyFor(PIECE_COLOURS.White)).toBe(0b1n);
        });
      });
      describe(Board.prototype.setBitboards.name, () => {});
      describe(Board.prototype.setBitboard.name, () => {});
    });

    describe(TEST_CATEGORIES.PIECES, () => {
      describe(Board.prototype.pieceAt.name, () => {});
      describe(Board.prototype.movePiece.name, () => {});
    });

    describe("turn", () => {
      describe(Board.prototype.toggleActiveColour.name, () => {});
    });
  });
});
