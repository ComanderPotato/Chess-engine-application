import { createBitboardFromCoords } from "#/factories/bitboard.factory.js";
import {
  COORD_SQUARE_MAP,
  EXPECTED_RANKS,
} from "#/fixtures/chess/square.fixtures.js";
import { TEST_CATEGORIES } from "#/utils/test-constants.js";
import { Bitboards } from "@/domain/chess/bitboard/bitboard.chess.js";
import { Board } from "@/domain/chess/board/board.chess.js";
import {
  RANKS,
  SQUARES,
  RANK_MASKS,
  FILES,
} from "@/domain/chess/board/board.constants.js";
import { FENS } from "@/domain/chess/fen/fen.constants.js";
import { printChessBoard } from "@/domain/chess/debug/printer.chess.js";
import * as TestMoveGenerator from "@/domain/chess/movegen/move/move.generator.js";
import {
  PIECE_COLOURS,
  PIECE_TYPES,
} from "@/domain/chess/piece/piece.constants.js";
import { beforeEach, describe, expect, it } from "vitest";
import * as SquareUtils from "@/domain/chess/utils/square.utils.js";
import { decodeMove } from "@/domain/chess/movegen/move/move.debug.js";
import { isPromotionMove } from "@/domain/chess/utils/move.utils.js";
import { makeMove, unmakeMove } from "@/domain/chess/movegen/move/move.make.js";

describe("move.generator", () => {
  describe(TEST_CATEGORIES.GENERATION, () => {
    describe(TestMoveGenerator.generateLegalMoves.name, () => {
      it.only("test", () => {
        const board = new Board(FENS.PROMOTION);
        const legalMoves = TestMoveGenerator.generateLegalMoves(board);
        for (const move of legalMoves) {
          if (isPromotionMove(move)) {
            makeMove(board, move);
            printChessBoard(board);
            unmakeMove(board);
            printChessBoard(board);
          }
          // console.log(decodeMove(board, move));
        }
        // expect(legalMoves).toHaveLength(20);
      });
      it("returns 20 legal moves for starting position", () => {
        const board = new Board();
        const legalMoves = TestMoveGenerator.generateLegalMoves(board);
        for (const move of legalMoves) {
          console.log(decodeMove(board, move));
        }
        expect(legalMoves).toHaveLength(20);
      });
      it("returns 48 legal moves for kiwipete", () => {
        const board = new Board(FENS.KIWIPETE);
        const legalMoves = TestMoveGenerator.generateLegalMoves(board);
        expect(legalMoves).toHaveLength(48);
      });
      it("returns 0 legal moves for stalemate", () => {
        const board = new Board(FENS.STALEMATE);
        const legalMoves = TestMoveGenerator.generateLegalMoves(board);
        expect(legalMoves).toHaveLength(0);
      });
      it("returns only king moves for double check", () => {
        const board = new Board(FENS.DOUBLE_CHECK);
        const legalMoves = TestMoveGenerator.generateLegalMoves(board);
        // for (const move of legalMoves) {
        //   console.log(decodeMove(board, move));
        // }
        printChessBoard(board);
      });
      it("Hello", () => {
        const board = new Board(FENS.START);
        console.log(board.enPassant);
      });
    });
    describe.skip(TestMoveGenerator.generatePseudoLegalMoves.name, () => {
      it.each([
        { colour: PIECE_COLOURS.White, name: "white" },
        { colour: PIECE_COLOURS.Black, name: "black" },
      ])("generates 20 pseudo legal moves for $name", ({ colour }) => {
        const board = new Board();
        const moves = TestMoveGenerator.generatePseudoLegalMoves(board, colour);
        // expect(moves).toHaveLength(20);
      });
      // it("test", () => {
      //   const board = new Board();
      //   const moves = TestMoveGenerator.generatePseudoLegalMoves(board);
      //   printChessBoard(board);
      //
      //   makeMove(board, moves[1]!);
      //   printChessBoard(board);
      // });

      // it("tests", () => {
      //   const board = new Board();
      //   board.setPiece(
      //     PIECE_TYPES.Queen | PIECE_COLOURS.Black,
      //     COORD_SQUARE_MAP.C3,
      //   );
      //   // board.setPiece(
      //   //   PIECE_TYPES.Rook | PIECE_COLOURS.White,
      //   //   COORD_SQUARE_MAP.A1,
      //   // );
      //   // board.castlingRights = 0b1111;
      //   const moves = TestMoveGenerator.generatePseudoLegalMoves(board);
      //   for (const move of moves) {
      //     console.log(decodeMove(board, move));
      //   }
      //   printChessBoard(board);
      // });
    });
  });

  describe(TEST_CATEGORIES.GENERATION, () => {
    describe(TestMoveGenerator.generatePawnMoveBoard.name, () => {
      let board: Board;
      beforeEach(() => {
        board = new Board();
      });
      it.each([
        {
          colour: PIECE_COLOURS.White,
          direction: 1,
          startRank: RANKS.SECOND,
          finalRank: RANKS.EIGHTH,
          name: "white",
        },
        {
          colour: PIECE_COLOURS.Black,
          direction: -1,
          startRank: RANKS.SEVENTH,
          finalRank: RANKS.FIRST,
          name: "black",
        },
      ])(
        "generates a pawn move board for a single $name pawn at each square",
        ({ colour, startRank, finalRank, direction }) => {
          board.setBitboards(new Bitboards());
          for (const square of SQUARES) {
            board.setPiece(PIECE_TYPES.Pawn | colour, square);
            const result = TestMoveGenerator.generatePawnMoveBoard(
              board,
              colour,
            );
            board.removeBit(square);
            if (EXPECTED_RANKS[square] === finalRank) {
              expect(result).toBe(0n);
              continue;
            }
            const singlePush = SquareUtils.toSquare(square + 8 * direction);
            if (EXPECTED_RANKS[square] === startRank) {
              const doublePush = SquareUtils.toSquare(square + 16 * direction);
              expect(result).toBe(
                createBitboardFromCoords([singlePush, doublePush]),
              );
            } else expect(result).toBe(createBitboardFromCoords([singlePush]));
          }
        },
      );
      it("generates a pawn move board for a single white pawn at each square", () => {
        board.setBitboards(new Bitboards());
        for (const square of SQUARES) {
          board.setPiece(PIECE_TYPES.Pawn | PIECE_COLOURS.White, square);
          const moveBoard = TestMoveGenerator.generatePawnMoveBoard(
            board,
            PIECE_COLOURS.White,
          );
          board.removeBit(square);
          if (EXPECTED_RANKS[square] === RANKS.EIGHTH) {
            expect(moveBoard).toBe(0n);
            continue;
          }
          const singlePush = SquareUtils.toSquare(square + 8);
          if (EXPECTED_RANKS[square] === RANKS.SECOND) {
            const doublePush = SquareUtils.toSquare(square + 16);
            expect(moveBoard).toBe(
              createBitboardFromCoords([singlePush, doublePush]),
            );
          } else expect(moveBoard).toBe(createBitboardFromCoords([singlePush]));
        }
      });
      it("generates a pawn move board for a single black pawn at each square", () => {
        board.setBitboards(new Bitboards());
        for (const square of SQUARES) {
          board.setPiece(PIECE_TYPES.Pawn | PIECE_COLOURS.Black, square);
          const moveBoard = TestMoveGenerator.generatePawnMoveBoard(
            board,
            PIECE_COLOURS.Black,
          );
          board.removeBit(square);
          if (EXPECTED_RANKS[square] === RANKS.FIRST) {
            expect(moveBoard).toBe(0n);
            continue;
          }
          const singlePush = SquareUtils.toSquare(square - 8);
          if (EXPECTED_RANKS[square] === RANKS.SEVENTH) {
            const doublePush = SquareUtils.toSquare(square - 16);
            expect(moveBoard).toBe(
              createBitboardFromCoords([singlePush, doublePush]),
            );
          } else expect(moveBoard).toBe(createBitboardFromCoords([singlePush]));
        }
      });
      it.each([
        {
          colour: PIECE_COLOURS.White,
          expected: RANK_MASKS[RANKS.THIRD]! | RANK_MASKS[RANKS.FOURTH]!,
          name: "white",
        },
        {
          colour: PIECE_COLOURS.Black,
          expected: RANK_MASKS[RANKS.FIFTH]! | RANK_MASKS[RANKS.SIXTH]!,
          name: "black",
        },
      ])(
        "generates a pawn move board for $name starting positions",
        ({ colour, expected }) => {
          const result = TestMoveGenerator.generatePawnMoveBoard(board, colour);
          expect(result).toBe(expected);
        },
      );
      it.each([
        {
          colour: PIECE_COLOURS.White,
          direction: 1,
          startRank: RANKS.SECOND,
          finalRank: RANKS.EIGHTH,
          name: "white",
        },
        {
          colour: PIECE_COLOURS.Black,
          direction: -1,
          startRank: RANKS.SEVENTH,
          finalRank: RANKS.FIRST,
          name: "black",
        },
      ])(
        "generates a pawn move board for a random set of $name pieces",
        ({ colour, startRank, finalRank, direction }) => {
          board.setBitboards(new Bitboards());
          let expected = 0n;
          for (const file of Object.values(FILES)) {
            const randomRank = Math.floor(Math.random() * RANKS.EIGHTH);
            const square = SquareUtils.fileRankToSquare(file, randomRank);
            board.setPiece(
              PIECE_TYPES.Pawn | colour,
              SquareUtils.fileRankToSquare(file, randomRank),
            );
            if (EXPECTED_RANKS[square] === finalRank) {
              continue;
            }
            const singlePush = SquareUtils.toSquare(square + 8 * direction);
            if (EXPECTED_RANKS[square] === startRank) {
              const doublePush = SquareUtils.toSquare(square + 16 * direction);
              expected |= 1n << BigInt(doublePush);
            }
            expected |= 1n << BigInt(singlePush);
          }
          const result = TestMoveGenerator.generatePawnMoveBoard(board, colour);
          expect(result).toBe(expected);
        },
      );
      it("doesn't generate any moves if the pawn is blocked on the starting rank by the same colour", () => {
        const board = new Board(FENS.EMPTY);
        board.setPiece(
          PIECE_TYPES.Pawn | PIECE_COLOURS.White,
          COORD_SQUARE_MAP.H2,
        );
        board.setPiece(
          PIECE_TYPES.Bishop | PIECE_COLOURS.White,
          COORD_SQUARE_MAP.H3,
        );
        expect(
          TestMoveGenerator.generatePawnMoveBoard(board, board.activeColour),
        ).toBe(0n);
      });
      it("doesn't generate any moves if the pawn is blocked on the starting rank by the enemy colour", () => {
        const board = new Board(FENS.EMPTY);
        board.setPiece(
          PIECE_TYPES.Pawn | PIECE_COLOURS.White,
          COORD_SQUARE_MAP.H2,
        );
        board.setPiece(
          PIECE_TYPES.Pawn | PIECE_COLOURS.Black,
          COORD_SQUARE_MAP.H3,
        );
        printChessBoard(board);
        expect(
          TestMoveGenerator.generatePawnMoveBoard(board, board.activeColour),
        ).toBe(0n);
      });
    });
  });
});
