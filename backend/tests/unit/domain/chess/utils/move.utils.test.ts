import { describe, expect, it } from "vitest";
import * as TestMoveUtils from "@/domain/chess/utils/move.utils.js";
import { TEST_CATEGORIES } from "#/utils/test-constants.js";
import { COORD_SQUARE_MAP } from "#/fixtures/chess/square.fixtures.js";
import { Board } from "@/domain/chess/board/board.chess.js";
import {
  PIECE_COLOURS,
  PIECE_TYPES,
} from "@/domain/chess/piece/piece.constants.js";
import { FENS } from "@/domain/chess/fen/fen.constants.js";
import * as MoveChess from "@/domain/chess/movegen/move/move.chess.js";
import {
  MOVE_FLAGS,
  PROMOTION_CAPTURE_FLAGS,
  PROMOTION_FLAGS,
} from "@/domain/chess/movegen/move/move.constants.js";
import { Move } from "@/domain/chess/movegen/move/move.types.js";

describe("move.utils", () => {
  describe(TEST_CATEGORIES.CONVERSION, () => {
    describe(TestMoveUtils.encodePawnMove.name, () => {
      it("returns a single move with the quiet flag", () => {
        const board = new Board(FENS.EMPTY);
        board.setPiece(
          PIECE_TYPES.Pawn | PIECE_COLOURS.White,
          COORD_SQUARE_MAP.A2,
        );
        const moves: Move[] = [];
        TestMoveUtils.encodePawnMove({
          board,
          from: COORD_SQUARE_MAP.A2,
          to: COORD_SQUARE_MAP.A3,
          moves,
        });
        expect(moves).toHaveLength(1);
        expect(MoveChess.getFlag(moves[0]!)).toBe(MOVE_FLAGS.Quiet);
      });
      it("returns a single move with the double pawn push flag", () => {
        const board = new Board(FENS.EMPTY);
        board.setPiece(
          PIECE_TYPES.Pawn | PIECE_COLOURS.White,
          COORD_SQUARE_MAP.A2,
        );
        const moves: Move[] = [];
        TestMoveUtils.encodePawnMove({
          board,
          from: COORD_SQUARE_MAP.A2,
          to: COORD_SQUARE_MAP.A4,
          moves,
        });
        expect(moves).toHaveLength(1);
        expect(MoveChess.getFlag(moves[0]!)).toBe(MOVE_FLAGS.DoublePawnPush);
      });
      it("returns a single move with the capture flag", () => {
        const board = new Board(FENS.EMPTY);
        board.setPiece(
          PIECE_TYPES.Pawn | PIECE_COLOURS.White,
          COORD_SQUARE_MAP.A2,
        );
        board.setPiece(
          PIECE_TYPES.Pawn | PIECE_COLOURS.Black,
          COORD_SQUARE_MAP.B3,
        );
        const moves: Move[] = [];
        TestMoveUtils.encodePawnMove({
          board,
          from: COORD_SQUARE_MAP.A2,
          to: COORD_SQUARE_MAP.B3,
          moves,
        });
        expect(moves).toHaveLength(1);
        expect(MoveChess.getFlag(moves[0]!)).toBe(MOVE_FLAGS.Capture);
      });
      it("returns a single move with the enpassant flag", () => {
        const board = new Board(FENS.EMPTY);
        board.setPiece(
          PIECE_TYPES.Pawn | PIECE_COLOURS.White,
          COORD_SQUARE_MAP.A2,
        );
        board.setPiece(
          PIECE_TYPES.Pawn | PIECE_COLOURS.Black,
          COORD_SQUARE_MAP.B2,
        );
        board.enPassant = COORD_SQUARE_MAP.B3;
        const moves: Move[] = [];
        TestMoveUtils.encodePawnMove({
          board,
          from: COORD_SQUARE_MAP.A2,
          to: COORD_SQUARE_MAP.B3,
          moves,
        });
        expect(moves).toHaveLength(1);
        expect(MoveChess.getFlag(moves[0]!)).toBe(MOVE_FLAGS.EnPassantCapture);
      });
      it("returns four moves with the promotion flag", () => {
        const board = new Board(FENS.EMPTY);
        board.setPiece(
          PIECE_TYPES.Pawn | PIECE_COLOURS.White,
          COORD_SQUARE_MAP.A7,
        );
        const moves: Move[] = [];
        TestMoveUtils.encodePawnMove({
          board,
          from: COORD_SQUARE_MAP.A7,
          to: COORD_SQUARE_MAP.A8,
          moves,
        });
        expect(moves).toHaveLength(4);
        moves.forEach((move, index) => {
          expect(MoveChess.getFlag(move)).toBe(PROMOTION_FLAGS[index]);
        });
      });
      it("returns four moves with the promotion capture flag", () => {
        const board = new Board(FENS.EMPTY);
        board.setPiece(
          PIECE_TYPES.Pawn | PIECE_COLOURS.White,
          COORD_SQUARE_MAP.A7,
        );
        board.setPiece(
          PIECE_TYPES.Pawn | PIECE_COLOURS.Black,
          COORD_SQUARE_MAP.B8,
        );
        const moves: Move[] = [];
        TestMoveUtils.encodePawnMove({
          board,
          from: COORD_SQUARE_MAP.A7,
          to: COORD_SQUARE_MAP.B8,
          moves,
        });
        expect(moves).toHaveLength(4);
        moves.forEach((move, index) => {
          expect(MoveChess.getFlag(move)).toBe(PROMOTION_CAPTURE_FLAGS[index]);
        });
      });
    });
    describe(TestMoveUtils.encodeStandardMove.name, () => {
      it("returns a single move with the quiet flag", () => {
        const board = new Board(FENS.EMPTY);
        board.setPiece(
          PIECE_TYPES.Bishop | PIECE_COLOURS.White,
          COORD_SQUARE_MAP.A2,
        );
        const moves: Move[] = [];
        TestMoveUtils.encodeStandardMove({
          board,
          from: COORD_SQUARE_MAP.A2,
          to: COORD_SQUARE_MAP.B3,
          moves,
        });
        expect(moves).toHaveLength(1);
        expect(MoveChess.getFlag(moves[0]!)).toBe(MOVE_FLAGS.Quiet);
      });
      it("returns a single move with the capture flag", () => {
        const board = new Board(FENS.EMPTY);
        board.setPiece(
          PIECE_TYPES.Bishop | PIECE_COLOURS.White,
          COORD_SQUARE_MAP.A2,
        );
        board.setPiece(
          PIECE_TYPES.Pawn | PIECE_COLOURS.Black,
          COORD_SQUARE_MAP.B3,
        );
        const moves: Move[] = [];
        TestMoveUtils.encodeStandardMove({
          board,
          from: COORD_SQUARE_MAP.A2,
          to: COORD_SQUARE_MAP.B3,
          moves,
        });
        expect(moves).toHaveLength(1);
        expect(MoveChess.getFlag(moves[0]!)).toBe(MOVE_FLAGS.Capture);
      });
    });
  });
  describe(TEST_CATEGORIES.CLASSIFICATION, () => {
    describe(TestMoveUtils.isCastlingMove.name, () => {
      it("returns true for a castle move", () => {
        const castleFlags = [MOVE_FLAGS.KingCastle, MOVE_FLAGS.QueenCastle];
        for (const flag of castleFlags) {
          const move = MoveChess.createMove(
            COORD_SQUARE_MAP.A1,
            COORD_SQUARE_MAP.A2,
            flag,
          );
          expect(TestMoveUtils.isCastlingMove(move)).toBe(true);
        }
      });
      it("returns false for a non castle move", () => {
        const nonCastleFlags = [
          MOVE_FLAGS.Quiet,
          MOVE_FLAGS.DoublePawnPush,
          MOVE_FLAGS.KnightPromotion,
          MOVE_FLAGS.BishopPromotion,
          MOVE_FLAGS.RookPromotion,
          MOVE_FLAGS.QueenPromotion,
          MOVE_FLAGS.Capture,
          MOVE_FLAGS.EnPassantCapture,
          MOVE_FLAGS.KnightPromotionCapture,
          MOVE_FLAGS.BishopPromotionCapture,
          MOVE_FLAGS.RookPromotionCapture,
          MOVE_FLAGS.QueenPromotionCapture,
        ];
        for (const flag of nonCastleFlags) {
          const move = MoveChess.createMove(
            COORD_SQUARE_MAP.A1,
            COORD_SQUARE_MAP.A2,
            flag,
          );
          expect(TestMoveUtils.isCastlingMove(move)).toBe(false);
        }
      });
    });
    describe(TestMoveUtils.isCastlingFlag.name, () => {
      it("returns true for a castle flag", () => {
        const castleFlags = [MOVE_FLAGS.KingCastle, MOVE_FLAGS.QueenCastle];
        for (const flag of castleFlags) {
          expect(TestMoveUtils.isCastlingFlag(flag)).toBe(true);
        }
      });
      it("returns false for a non castle flag", () => {
        const nonCastleFlags = [
          MOVE_FLAGS.Quiet,
          MOVE_FLAGS.DoublePawnPush,
          MOVE_FLAGS.KnightPromotion,
          MOVE_FLAGS.BishopPromotion,
          MOVE_FLAGS.RookPromotion,
          MOVE_FLAGS.QueenPromotion,
          MOVE_FLAGS.Capture,
          MOVE_FLAGS.EnPassantCapture,
          MOVE_FLAGS.KnightPromotionCapture,
          MOVE_FLAGS.BishopPromotionCapture,
          MOVE_FLAGS.RookPromotionCapture,
          MOVE_FLAGS.QueenPromotionCapture,
        ];
        for (const flag of nonCastleFlags) {
          expect(TestMoveUtils.isCastlingFlag(flag)).toBe(false);
        }
      });
    });
    describe(TestMoveUtils.isCaptureMove.name, () => {
      it("returns true for a capture move", () => {
        const captureFlags = [
          MOVE_FLAGS.Capture,
          MOVE_FLAGS.EnPassantCapture,
          MOVE_FLAGS.KnightPromotionCapture,
          MOVE_FLAGS.BishopPromotionCapture,
          MOVE_FLAGS.RookPromotionCapture,
          MOVE_FLAGS.QueenPromotionCapture,
        ];
        for (const flag of captureFlags) {
          const move = MoveChess.createMove(
            COORD_SQUARE_MAP.A1,
            COORD_SQUARE_MAP.A2,
            flag,
          );
          expect(TestMoveUtils.isCaptureMove(move)).toBe(true);
        }
      });
      it("returns false for a non capture move", () => {
        const nonCaptureFlags = [
          MOVE_FLAGS.Quiet,
          MOVE_FLAGS.DoublePawnPush,
          MOVE_FLAGS.KingCastle,
          MOVE_FLAGS.QueenCastle,
          MOVE_FLAGS.KnightPromotion,
          MOVE_FLAGS.BishopPromotion,
          MOVE_FLAGS.RookPromotion,
          MOVE_FLAGS.QueenPromotion,
        ];
        for (const flag of nonCaptureFlags) {
          const move = MoveChess.createMove(
            COORD_SQUARE_MAP.A1,
            COORD_SQUARE_MAP.A2,
            flag,
          );
          expect(TestMoveUtils.isCaptureMove(move)).toBe(false);
        }
      });
    });
    describe(TestMoveUtils.isCaptureFlag.name, () => {
      it("returns true for a capture flag", () => {
        const captureFlags = [
          MOVE_FLAGS.Capture,
          MOVE_FLAGS.EnPassantCapture,
          MOVE_FLAGS.KnightPromotionCapture,
          MOVE_FLAGS.BishopPromotionCapture,
          MOVE_FLAGS.RookPromotionCapture,
          MOVE_FLAGS.QueenPromotionCapture,
        ];
        for (const flag of captureFlags) {
          expect(TestMoveUtils.isCaptureFlag(flag)).toBe(true);
        }
      });
      it("returns false for a non capture move", () => {
        const nonCaptureFlags = [
          MOVE_FLAGS.Quiet,
          MOVE_FLAGS.DoublePawnPush,
          MOVE_FLAGS.KingCastle,
          MOVE_FLAGS.QueenCastle,
          MOVE_FLAGS.KnightPromotion,
          MOVE_FLAGS.BishopPromotion,
          MOVE_FLAGS.RookPromotion,
          MOVE_FLAGS.QueenPromotion,
        ];
        for (const flag of nonCaptureFlags) {
          expect(TestMoveUtils.isCaptureFlag(flag)).toBe(false);
        }
      });
    });
    describe(TestMoveUtils.isPromotionMove.name, () => {
      it("returns true for a promotion move", () => {
        const promotionFlags = [
          MOVE_FLAGS.KnightPromotion,
          MOVE_FLAGS.BishopPromotion,
          MOVE_FLAGS.RookPromotion,
          MOVE_FLAGS.QueenPromotion,
          MOVE_FLAGS.KnightPromotionCapture,
          MOVE_FLAGS.BishopPromotionCapture,
          MOVE_FLAGS.RookPromotionCapture,
          MOVE_FLAGS.QueenPromotionCapture,
        ];
        for (const flag of promotionFlags) {
          const move = MoveChess.createMove(
            COORD_SQUARE_MAP.A1,
            COORD_SQUARE_MAP.A2,
            flag,
          );
          expect(TestMoveUtils.isPromotionMove(move)).toBe(true);
        }
      });
      it("returns false for a non promotion move", () => {
        const nonPromotionFlags = [
          MOVE_FLAGS.Quiet,
          MOVE_FLAGS.DoublePawnPush,
          MOVE_FLAGS.Capture,
          MOVE_FLAGS.EnPassantCapture,
          MOVE_FLAGS.KingCastle,
          MOVE_FLAGS.QueenCastle,
        ];
        for (const flag of nonPromotionFlags) {
          const move = MoveChess.createMove(
            COORD_SQUARE_MAP.A1,
            COORD_SQUARE_MAP.A2,
            flag,
          );
          expect(TestMoveUtils.isPromotionMove(move)).toBe(false);
        }
      });
    });
    describe(TestMoveUtils.isPromotionFlag.name, () => {
      it("returns true for a promotion flag", () => {
        const promotionFlags = [
          MOVE_FLAGS.KnightPromotion,
          MOVE_FLAGS.BishopPromotion,
          MOVE_FLAGS.RookPromotion,
          MOVE_FLAGS.QueenPromotion,
          MOVE_FLAGS.KnightPromotionCapture,
          MOVE_FLAGS.BishopPromotionCapture,
          MOVE_FLAGS.RookPromotionCapture,
          MOVE_FLAGS.QueenPromotionCapture,
        ];
        for (const flag of promotionFlags) {
          expect(TestMoveUtils.isPromotionFlag(flag)).toBe(true);
        }
      });
      it("returns false for a non promotion flag", () => {
        const nonPromotionFlags = [
          MOVE_FLAGS.Quiet,
          MOVE_FLAGS.DoublePawnPush,
          MOVE_FLAGS.Capture,
          MOVE_FLAGS.EnPassantCapture,
          MOVE_FLAGS.KingCastle,
          MOVE_FLAGS.QueenCastle,
        ];
        for (const flag of nonPromotionFlags) {
          expect(TestMoveUtils.isPromotionFlag(flag)).toBe(false);
        }
      });
    });
  });
});
