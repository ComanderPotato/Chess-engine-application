import { createBitboardFromCoords } from "#/factories/bitboard.factory.js";
import { COORD_SQUARE_MAP } from "#/fixtures/chess/square.fixtures.js";
import { Board } from "@/domain/chess/board/board.chess.js";
import { FENS } from "@/domain/chess/fen/fen.constants.js";
import { printBitboard } from "@/domain/chess/debug/printer.chess.js";
import * as TestAttackGenerators from "@/domain/chess/movegen/attack/attack.generators.js";
import {
  PIECE_COLOURS,
  PIECE_TYPES,
} from "@/domain/chess/piece/piece.constants.js";
import { beforeEach, describe, expect, it } from "vitest";

describe("attack.generators", () => {
  let board: Board;
  beforeEach(() => {
    board = new Board();
  });
  describe(TestAttackGenerators.generatePawnAttacks.name, () => {
    beforeEach(() => {
      board = new Board(FENS.EMPTY);
    });
    it.only.each([
      { colour: PIECE_COLOURS.White, name: "white" },
      { colour: PIECE_COLOURS.Black, name: "black" },
    ])(
      "returns a mask containing zero attacks for a $name pawn",
      ({ colour }) => {
        board.setPiece(PIECE_TYPES.Pawn | colour, COORD_SQUARE_MAP.B4);
        const a = TestAttackGenerators.generatePawnAttacks(board, colour);
        // expect(TestAttackGenerators.generatePawnAttacks(board, colour)).toBe(
        //   0n,
        // );
      },
    );
    it.each([
      {
        colour: PIECE_COLOURS.White,
        enemyColour: PIECE_COLOURS.Black,
        enemySquares: [COORD_SQUARE_MAP.A5],
        count: "one",
        name: "white",
      },
      {
        colour: PIECE_COLOURS.Black,
        enemyColour: PIECE_COLOURS.White,
        enemySquares: [COORD_SQUARE_MAP.A3],
        count: "one",
        name: "black",
      },
      {
        colour: PIECE_COLOURS.White,
        enemyColour: PIECE_COLOURS.Black,
        enemySquares: [COORD_SQUARE_MAP.A5, COORD_SQUARE_MAP.C5],
        count: "two",
        name: "white",
      },
      {
        colour: PIECE_COLOURS.Black,
        enemyColour: PIECE_COLOURS.White,
        enemySquares: [COORD_SQUARE_MAP.A3, COORD_SQUARE_MAP.C3],
        count: "two",
        name: "black",
      },
    ])(
      "returns a mask containing $count attacks for a $name pawn",
      ({ colour, enemyColour, enemySquares }) => {
        board.setPiece(PIECE_TYPES.Pawn | colour, COORD_SQUARE_MAP.B4);
        expect(TestAttackGenerators.generatePawnAttacks(board, colour)).toBe(
          0n,
        );
        for (const square of enemySquares) {
          board.setPiece(PIECE_TYPES.Pawn | enemyColour, square);
        }
        const result = TestAttackGenerators.generatePawnAttacks(board, colour);
        const expected = createBitboardFromCoords(enemySquares);
        expect(result).toBe(expected);
      },
    );
    it.each([
      {
        colour: PIECE_COLOURS.White,
        enPassant: COORD_SQUARE_MAP.A5,
        name: "white",
      },
      {
        colour: PIECE_COLOURS.Black,
        enPassant: COORD_SQUARE_MAP.A3,
        name: "black",
      },
    ])(
      "returns one attack when the square is an en passant square for $name",
      ({ colour, enPassant }) => {
        board.enPassant = enPassant;
        board.setPiece(PIECE_TYPES.Pawn | colour, COORD_SQUARE_MAP.B4);
        const result = TestAttackGenerators.generatePawnAttacks(board, colour);
        const expected = createBitboardFromCoords([enPassant]);
        expect(result).toBe(expected);
      },
    );
  });
  // describe(TestAttackGenerators.generatePawnAttacks.name, () => {
  //   it.each([
  //     {
  //       colour: PIECE_COLOURS.White,
  //       expected: STARTING_WHITE_PAWN_ATTACKS,
  //       name: "white",
  //     },
  //     {
  //       colour: PIECE_COLOURS.Black,
  //       expected: STARTING_BLACK_PAWN_ATTACKS,
  //       name: "black",
  //     },
  //   ])(
  //     "generates pawn attacks for starting $name position",
  //     ({ colour, expected }) => {
  //       const result = TestAttackGenerators.generatePawnAttacks(board, colour);
  //       printBitboard(WHITE_PAWN_ATTACKS[1]!);
  //       expect(result).toBe(expected);
  //     },
  //   );
  // });
  // describe(TestAttackGenerators.generateKnightAttacks.name, () => {
  //   it.each([
  //     {
  //       colour: PIECE_COLOURS.White,
  //       expected: STARTING_WHITE_KNIGHT_ATTACKS,
  //       name: "white",
  //     },
  //     {
  //       colour: PIECE_COLOURS.Black,
  //       expected: STARTING_BLACK_KNIGHT_ATTACKS,
  //       name: "black",
  //     },
  //   ])(
  //     "generates pawn attacks for starting $name position",
  //     ({ colour, expected }) => {
  //       const result = TestAttackGenerators.generateKnightAttacks(
  //         board,
  //         colour,
  //       );
  //       expect(result).toBe(expected);
  //     },
  //   );
  // });
});
