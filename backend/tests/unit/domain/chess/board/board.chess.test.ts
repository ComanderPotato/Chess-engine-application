import { createBitboardFromCoords } from "#/factories/bitboard.factory.js";
import { COORD_SQUARE_MAP } from "#/fixtures/chess/square.fixtures.js";
import { TEST_CATEGORIES } from "#/utils/test-constants.js";
import { Bitboards } from "@/domain/chess/bitboard/bitboard.chess.js";
import { Board } from "@/domain/chess/board/board.chess.js";
import { RANK_MASKS } from "@/domain/chess/board/board.constants.js";
import { FENS } from "@/domain/chess/board/fen.constants.js";
import { printBitboard } from "@/domain/chess/debug/printer.chess.js";
import {
  PIECE_COLOURS,
  PIECE_TYPES,
} from "@/domain/chess/piece/piece.constants.js";
import { isBitSet32, isBitSet64 } from "@/domain/chess/utils/bit.utils.js";
import { squareToCoord } from "@/domain/chess/utils/coord.utils.js";
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
      describe.only(TEST_CATEGORIES.MANIPULATION, () => {
        beforeEach(() => {
          board = new Board(FENS.EMPTY);
        });
        describe(Board.prototype.setPiece.name, () => {
          it.each([
            { to: COORD_SQUARE_MAP.E4, name: "e4" },
            { to: COORD_SQUARE_MAP.A1, name: "a1" },
            { to: COORD_SQUARE_MAP.H8, name: "h8" },
          ])("inserts a pawn at $name", ({ to }) => {
            const piece = PIECE_TYPES.Pawn | PIECE_COLOURS.White;
            expect(board.isOccupied(to)).toBe(false);
            board.setPiece(piece, to);
            expect(board.isOccupied(to)).toBe(true);
            expect(board.pieceAt(to)).toBe(
              PIECE_TYPES.Pawn | PIECE_COLOURS.White,
            );
          });
        });
        describe(Board.prototype.removePiece.name, () => {
          it.each([
            { to: COORD_SQUARE_MAP.E4, name: "e4" },
            { to: COORD_SQUARE_MAP.A1, name: "a1" },
            { to: COORD_SQUARE_MAP.H8, name: "h8" },
          ])("removes the piece at $name", ({ to }) => {
            const piece = PIECE_TYPES.Pawn | PIECE_COLOURS.White;

            expect(board.isOccupied(to)).toBe(false);
            board.setPiece(piece, to);
            expect(board.isOccupied(to)).toBe(true);
            board.removePiece(to);
            expect(board.isOccupied(to)).toBe(false);
          });
        });
        describe(Board.prototype.movePiece.name, () => {
          it.each([
            {
              from: COORD_SQUARE_MAP.A2,
              to: COORD_SQUARE_MAP.A3,
              name: "a2 to a3",
            },
            {
              from: COORD_SQUARE_MAP.B8,
              to: COORD_SQUARE_MAP.C8,
              name: "b8 to c8",
            },
            {
              from: COORD_SQUARE_MAP.A4,
              to: COORD_SQUARE_MAP.H4,
              name: "a4 to h4",
            },
          ])("moves a piece from $name", ({ from, to }) => {
            const piece = PIECE_TYPES.Pawn | PIECE_COLOURS.White;

            board.setPiece(piece, from);
            expect(board.isOccupied(from)).toBe(true);
            expect(board.isOccupied(to)).toBe(false);
            board.movePiece(from, to);
            expect(board.isOccupied(from)).toBe(false);
            expect(board.isOccupied(to)).toBe(true);
          });
        });
      });
      describe(TEST_CATEGORIES.EXTRACTION, () => {
        describe(Board.prototype.isOccupied.name, () => {
          it("checks occupancy of a specific square", () => {});
        });
        describe("occupancy", () => {
          it("gets the occupancy", () => {
            expect(board.occupancy).toBe(
              RANK_MASKS[7]! | RANK_MASKS[6]! | RANK_MASKS[1]! | RANK_MASKS[0]!,
            );
          });
        });
        describe("friendlyOccupancy", () => {
          it("gets the friendly occupancy with white as active colour", () => {
            expect(board.friendlyOccupancy).toBe(
              RANK_MASKS[1]! | RANK_MASKS[0]!,
            );
            expect(board.friendlyOccupancy).toBe(board.whiteOccupancy);
          });
          it("gets the friendly occupancy with black as active colour", () => {
            board.activeColour = PIECE_COLOURS.Black;
            expect(board.friendlyOccupancy).toBe(
              RANK_MASKS[6]! | RANK_MASKS[7]!,
            );
            expect(board.friendlyOccupancy).toBe(board.blackOccupancy);
          });
        });
        describe("enemyOccupancy", () => {
          it("gets the enemy occupancy with white as active colour", () => {
            expect(board.enemyOccupancy).toBe(RANK_MASKS[6]! | RANK_MASKS[7]!);
            expect(board.enemyOccupancy).toBe(board.blackOccupancy);
          });
          it("gets the enemy occupancy with black as active colour", () => {
            board.activeColour = PIECE_COLOURS.Black;
            expect(board.enemyOccupancy).toBe(RANK_MASKS[0]! | RANK_MASKS[1]!);
            expect(board.enemyOccupancy).toBe(board.whiteOccupancy);
          });
        });
        describe("whiteOccupancy", () => {
          it("gets the white occupancy", () => {
            expect(board.whiteOccupancy).toBe(RANK_MASKS[1]! | RANK_MASKS[0]!);
            expect(board.whiteOccupancy).toBe(board.friendlyOccupancy);
          });
        });
        describe("blackOccupancy", () => {
          it("gets the black occupancy", () => {
            expect(board.blackOccupancy).toBe(RANK_MASKS[7]! | RANK_MASKS[6]!);
            expect(board.blackOccupancy).toBe(board.enemyOccupancy);
          });
        });
        describe("whiteSlidingOccupancy", () => {
          it("gets the white sliding occupancy", () => {
            expect(board.whiteSlidingOccupancy).toBe(
              createBitboardFromCoords([
                COORD_SQUARE_MAP.A1,
                COORD_SQUARE_MAP.C1,
                COORD_SQUARE_MAP.D1,
                COORD_SQUARE_MAP.F1,
                COORD_SQUARE_MAP.H1,
              ]),
            );
          });
          it("gets the white sliding occupancy from the white sliding pieces", () => {
            const expected =
              board.getBitboard(PIECE_TYPES.Bishop | PIECE_COLOURS.White) |
              board.getBitboard(PIECE_TYPES.Rook | PIECE_COLOURS.White) |
              board.getBitboard(PIECE_TYPES.Queen | PIECE_COLOURS.White);
            expect(board.whiteSlidingOccupancy).toBe(expected);
          });
        });
        describe("blackSlidingOccupancy", () => {
          it("gets the white sliding occupancy", () => {
            expect(board.blackSlidingOccupancy).toBe(
              createBitboardFromCoords([
                COORD_SQUARE_MAP.A8,
                COORD_SQUARE_MAP.C8,
                COORD_SQUARE_MAP.D8,
                COORD_SQUARE_MAP.F8,
                COORD_SQUARE_MAP.H8,
              ]),
            );
          });
          it("gets the black sliding occupancy from the black sliding pieces", () => {
            const expected =
              board.getBitboard(PIECE_TYPES.Bishop | PIECE_COLOURS.Black) |
              board.getBitboard(PIECE_TYPES.Rook | PIECE_COLOURS.Black) |
              board.getBitboard(PIECE_TYPES.Queen | PIECE_COLOURS.Black);
            expect(board.blackSlidingOccupancy).toBe(expected);
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
            expect(board.getOccupancy(PIECE_TYPES.Pawn)).toBe(
              RANK_MASKS[1]! | RANK_MASKS[6]!,
            );
            expect(board.getOccupancy(PIECE_TYPES.Bishop)).toBe(
              createBitboardFromCoords([
                COORD_SQUARE_MAP.C1,
                COORD_SQUARE_MAP.F1,
                COORD_SQUARE_MAP.C8,
                COORD_SQUARE_MAP.F8,
              ]),
            );
            expect(board.getOccupancy(PIECE_TYPES.Queen)).toBe(
              createBitboardFromCoords([
                COORD_SQUARE_MAP.D1,
                COORD_SQUARE_MAP.D8,
              ]),
            );
          });
        });
        describe(Board.prototype.getBitboard.name, () => {
          it("gets bitboard of a specific piece", () => {
            expect(
              board.getBitboard(PIECE_TYPES.Pawn | PIECE_COLOURS.White),
            ).toBe(RANK_MASKS[1]);
            expect(
              board.getBitboard(PIECE_TYPES.Bishop | PIECE_COLOURS.Black),
            ).toBe(
              createBitboardFromCoords([
                COORD_SQUARE_MAP.C8,
                COORD_SQUARE_MAP.F8,
              ]),
            );
            expect(
              board.getBitboard(PIECE_TYPES.Queen | PIECE_COLOURS.White),
            ).toBe(createBitboardFromCoords([COORD_SQUARE_MAP.D1]));
          });
          it("sets bitboard of a specific piece", () => {
            let piece = PIECE_TYPES.Pawn | PIECE_COLOURS.White;
            expect(board.getBitboard(piece)).toBe(RANK_MASKS[1]!);

            board.setBitboard(piece, COORD_SQUARE_MAP.A1);
            expect(board.getBitboard(piece)).toBe(0b1n | RANK_MASKS[1]!);

            board.setBitboard(piece, COORD_SQUARE_MAP.B1);
            expect(board.getBitboard(piece)).toBe(0b11n | RANK_MASKS[1]!);

            piece = PIECE_TYPES.Bishop | PIECE_COLOURS.Black;
            const bishopBoard = createBitboardFromCoords([
              COORD_SQUARE_MAP.C8,
              COORD_SQUARE_MAP.F8,
            ]);
            expect(board.getBitboard(piece)).toBe(bishopBoard);

            board.setBitboard(piece, COORD_SQUARE_MAP.A1);
            expect(board.getBitboard(piece)).toBe(0b1n | bishopBoard);
          });
        });
        describe(Board.prototype.getFriendlyOccupancyFor.name, () => {
          it("returns friendly occupancy for a specific colour", () => {
            const whiteBoard = RANK_MASKS[0]! | RANK_MASKS[1]!;
            const blackBoard = RANK_MASKS[6]! | RANK_MASKS[7]!;
            expect(board.getFriendlyOccupancyFor(PIECE_COLOURS.White)).toBe(
              whiteBoard,
            );
            expect(board.getFriendlyOccupancyFor(PIECE_COLOURS.Black)).toBe(
              blackBoard,
            );

            board.setBitboard(
              PIECE_TYPES.Pawn | PIECE_COLOURS.White,
              COORD_SQUARE_MAP.A1,
            );
            expect(board.getFriendlyOccupancyFor(PIECE_COLOURS.White)).toBe(
              0b1n | whiteBoard,
            );
            expect(board.getFriendlyOccupancyFor(PIECE_COLOURS.Black)).toBe(
              blackBoard,
            );

            board.setBitboard(
              PIECE_TYPES.Pawn | PIECE_COLOURS.Black,
              COORD_SQUARE_MAP.A1,
            );
            expect(board.getFriendlyOccupancyFor(PIECE_COLOURS.White)).toBe(
              0b1n | whiteBoard,
            );
            expect(board.getFriendlyOccupancyFor(PIECE_COLOURS.Black)).toBe(
              0b1n | blackBoard,
            );
          });
        });
        describe(Board.prototype.getEnemyOccupancyFor.name, () => {
          it("returns enemy occupancy for a specific colour", () => {
            const whiteBoard = RANK_MASKS[0]! | RANK_MASKS[1]!;
            const blackBoard = RANK_MASKS[6]! | RANK_MASKS[7]!;
            expect(board.getEnemyOccupancyFor(PIECE_COLOURS.White)).toBe(
              blackBoard,
            );
            expect(board.getEnemyOccupancyFor(PIECE_COLOURS.Black)).toBe(
              whiteBoard,
            );

            board.setBitboard(
              PIECE_TYPES.Pawn | PIECE_COLOURS.White,
              COORD_SQUARE_MAP.A1,
            );
            expect(board.getEnemyOccupancyFor(PIECE_COLOURS.Black)).toBe(
              0b1n | whiteBoard,
            );
            expect(board.getEnemyOccupancyFor(PIECE_COLOURS.White)).toBe(
              blackBoard,
            );

            board.setBitboard(
              PIECE_TYPES.Pawn | PIECE_COLOURS.Black,
              COORD_SQUARE_MAP.A1,
            );
            expect(board.getEnemyOccupancyFor(PIECE_COLOURS.Black)).toBe(
              0b1n | whiteBoard,
            );
            expect(board.getEnemyOccupancyFor(PIECE_COLOURS.White)).toBe(
              0b1n | blackBoard,
            );
          });
        });
      });
      describe(Board.prototype.setBitboards.name, () => {});
      describe(Board.prototype.setBitboard.name, () => {});
    });

    describe(TEST_CATEGORIES.PIECES, () => {
      describe.only(Board.prototype.pieceAt.name, () => {
        it("returns the correct piece for a given square", () => {
          expect(board.pieceAt(COORD_SQUARE_MAP.A2)).toBe(
            PIECE_TYPES.Pawn | PIECE_COLOURS.White,
          );
          expect(board.pieceAt(COORD_SQUARE_MAP.A7)).toBe(
            PIECE_TYPES.Pawn | PIECE_COLOURS.Black,
          );
          expect(board.pieceAt(COORD_SQUARE_MAP.D1)).toBe(
            PIECE_TYPES.Queen | PIECE_COLOURS.White,
          );
          expect(board.pieceAt(COORD_SQUARE_MAP.D8)).toBe(
            PIECE_TYPES.Queen | PIECE_COLOURS.Black,
          );
        });
      });
    });

    describe(TEST_CATEGORIES.TURN, () => {
      describe(Board.prototype.updateBoardState.name, () => {});
    });
    describe(TEST_CATEGORIES.CONVERSION, () => {
      describe(Board.prototype.toFen.name, () => {
        it("outputs the correct fen string for each creation of the board", () => {
          for (const fen of Object.values(FENS)) {
            const newBoard = new Board(fen);
            expect(newBoard.toFen()).toBe(fen);
          }
        });
      });
    });
    describe(TEST_CATEGORIES.PARSING, () => {
      describe(Board.prototype.loadFen.name, () => {
        it("outputs the correct fen string for each creation of the board", () => {
          for (const fen of Object.values(FENS)) {
            board.loadFen(fen);
            expect(board.toFen()).toBe(fen);
          }
        });
      });
    });
  });
});
