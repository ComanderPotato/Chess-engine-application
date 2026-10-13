import { FENS } from "./fen.constants.js";
import { PIECE_COLOURS, PIECE_TYPES } from "../piece/piece.constants.js";
import { Piece, PieceColour, PieceType } from "../piece/piece.types.js";
import {
  Bitboard,
  CastlingRights,
  EnPassant,
  ReadonlyBitboards,
  SideCastlingRights,
  Square,
} from "./types.chess.js";
import { Bitboards } from "../bitboard/bitboard.chess.js";
import { parseFen } from "../fen/fen.parser.js";
import { composeFen } from "../fen/fen.composer.js";
import { Move } from "../movegen/move/move.types.js";

import { getColour, getType, isWhite } from "../piece/piece.chess.js";
import * as MoveChess from "../movegen/move/move.chess.js";
import * as BitUtils from "../utils/bit.utils.js";
import * as BitboardUtils from "../utils/bitboard.utils.js";
import * as SquareUtils from "../utils/square.utils.js";
import { MOVE_FLAGS } from "../movegen/move/move.constants.js";
import { COORD_SQUARE_MAP } from "#/fixtures/chess/square.fixtures.js";

export class Board {
  private _bitboards: Bitboards = new Bitboards();

  // FEN
  private _activeColour!: PieceColour;

  private _castlingRights!: CastlingRights;

  private _enPassant!: EnPassant;

  private _halfMoveClock!: number;

  private _fullMoveClock!: number;
  constructor(fen: string = FENS.START) {
    parseFen(fen, this);
  }

  public getBlackCastlingRights(): SideCastlingRights {
    return {
      canKingSide: this.getBlackKingSideCastlingRights(),
      canQueenSide: this.getBlackQueenSideCastlingRights(),
    };
  }
  public getWhiteCastlingRights(): SideCastlingRights {
    return {
      canKingSide: this.getWhiteKingSideCastlingRights(),
      canQueenSide: this.getWhiteQueenSideCastlingRights(),
    };
  }
  public getWhiteKingSideCastlingRights() {
    return BitUtils.isBitSet32(this._castlingRights, 0);
  }
  public getWhiteQueenSideCastlingRights() {
    return BitUtils.isBitSet32(this._castlingRights, 1);
  }
  public getBlackKingSideCastlingRights() {
    return BitUtils.isBitSet32(this._castlingRights, 3);
  }
  public getBlackQueenSideCastlingRights() {
    return BitUtils.isBitSet32(this._castlingRights, 4);
  }
  public clearWhiteKingSideCastlingRights(): void {
    BitUtils.clearBit32(this._castlingRights, 3);
  }
  public clearWhiteQueenSideCastlingRights(): void {
    BitUtils.clearBit32(this._castlingRights, 2);
  }
  public clearBlackKingSideCastlingRights(): void {
    BitUtils.clearBit32(this._castlingRights, 1);
  }
  public clearBlackQueenSideCastlingRights(): void {
    BitUtils.clearBit32(this._castlingRights, 0);
  }

  // BITBOARD GETTERS/SETTERS
  public get occupancy(): Bitboard {
    return this._bitboards.allOccupancy;
  }
  public get friendlyOccupancy(): Bitboard {
    return this._bitboards.getFriendlyOccupancyFor(this._activeColour);
  }
  public getFriendlyOccupancyFor(colour: PieceColour): Bitboard {
    return this._bitboards.getFriendlyOccupancyFor(colour);
  }
  public getEnemyOccupancyFor(colour: PieceColour): Bitboard {
    return this._bitboards.getEnemyOccupancyFor(colour);
  }

  public get enemyOccupancy(): Bitboard {
    return this._bitboards.getEnemyOccupancyFor(this._activeColour);
  }
  public get whiteOccupancy(): Bitboard {
    return this._bitboards.whiteOccupancy;
  }
  public get blackOccupancy(): Bitboard {
    return this._bitboards.blackOccupancy;
  }
  public get whiteSlidingOccupancy(): Bitboard {
    return this._bitboards.whiteSlidingOccupancy;
  }
  public get blackSlidingOccupancy(): Bitboard {
    return this._bitboards.blackSlidingOccupancy;
  }
  public get bitboards(): Bitboards {
    return this._bitboards;
  }
  public get bitboardsList(): ReadonlyBitboards {
    return this._bitboards.bitboards;
  }
  public getOccupancy(type: PieceType): Bitboard {
    return this._bitboards.getOccupancy(type);
  }
  public getBitboard(piece: Piece): Bitboard {
    return this._bitboards.getBitboard(piece);
  }
  public setBitboards(value: Bitboards): void {
    this._bitboards.bitboards;
    this._bitboards = value;
  }
  public setBitboard(piece: Piece, square: Square): void {
    this._bitboards.setPieceBit(piece, square);
  }
  // FEN GETTERS/SETTERS
  public set activeColour(value: PieceColour) {
    this._activeColour = value;
  }

  public set castlingRights(value: CastlingRights) {
    this._castlingRights = value;
  }

  public set enPassant(value: EnPassant) {
    this._enPassant = value;
  }

  public set halfMoveClock(value: number) {
    this._halfMoveClock = value;
  }

  public set fullMoveClock(value: number) {
    this._fullMoveClock = value;
  }

  public get activeColour(): PieceColour {
    return this._activeColour;
  }

  public get castlingRights(): CastlingRights {
    return this._castlingRights;
  }

  public get enPassant(): EnPassant {
    return this._enPassant;
  }
  public get halfMoveClock(): number {
    return this._halfMoveClock;
  }

  public get fullMoveClock(): number {
    return this._fullMoveClock;
  }

  // FEN UPDATE OPERATIONS
  public updateBoardState(move: Move): void {
    this.updateHalfMoveClock(move);
    this.updateEnPassant(move);
    this.updateCastlingRights(move);
    this.updateFullMoveClock();
    this.updateActiveColour();

    this.updatePiecePlacement();
  }
  private updateCastlingRights(move: Move): void {
    if (this.castlingRights === 0) return;
    const from = MoveChess.getFrom(move);
    if (from === COORD_SQUARE_MAP.E1) {
      this.clearWhiteKingSideCastlingRights();
      this.clearWhiteQueenSideCastlingRights();
      return;
    }
    if (from === COORD_SQUARE_MAP.E8) {
      this.clearBlackKingSideCastlingRights();
      this.clearBlackQueenSideCastlingRights();
      return;
    }
    if (from === COORD_SQUARE_MAP.A1) {
      this.clearWhiteQueenSideCastlingRights();
      return;
    }
    if (from === COORD_SQUARE_MAP.H1) {
      this.clearWhiteKingSideCastlingRights();
      return;
    }
    if (from === COORD_SQUARE_MAP.A8) {
      this.clearBlackQueenSideCastlingRights();
      return;
    }
    if (from === COORD_SQUARE_MAP.H8) {
      this.clearBlackKingSideCastlingRights();
    }
  }
  private updatePiecePlacement(): void {}
  private updateEnPassant(move: Move): void {
    const fromSquare = MoveChess.getFrom(move);
    // Maybe just use active colour, however, relies on active colour not
    // being updated yet...
    const movedPieceColour = getColour(this.pieceAt(fromSquare));

    const enPassantSquareOffset = isWhite(movedPieceColour) ? 8 : -8;
    this.enPassant =
      MoveChess.getFlag(move) === MOVE_FLAGS.DoublePawnPush
        ? SquareUtils.toSquare(fromSquare + enPassantSquareOffset)
        : null;
  }
  private updateActiveColour(): void {
    this._activeColour =
      this._activeColour === PIECE_COLOURS.White
        ? PIECE_COLOURS.Black
        : PIECE_COLOURS.White;
  }

  private updateHalfMoveClock(move: Move) {
    const wasCapture = MoveChess.getFlag(move) === MOVE_FLAGS.Capture;
    const toSquare = MoveChess.getTo(move);
    const wasPawnMoved = getType(this.pieceAt(toSquare)) === PIECE_TYPES.Pawn;
    this.halfMoveClock = wasCapture || wasPawnMoved ? 0 : this.halfMoveClock++;
  }
  private updateFullMoveClock() {
    this.fullMoveClock =
      this.activeColour === PIECE_COLOURS.Black
        ? this.fullMoveClock++
        : this.fullMoveClock;
  }

  public pieceAt(square: Square): Piece {
    if (!BitUtils.isBitSet64(this.occupancy, square)) return PIECE_TYPES.Empty;
    const idx = this._bitboards.findOccupiedBitboardIndex(square);
    return BitboardUtils.indexToPiece(idx);
  }
  public isSquareOccupiedBy(
    square: Square,
    type: PieceType,
    colour?: PieceColour,
  ): boolean {
    const bitboard = colour
      ? this.getBitboard(type | colour)
      : this.getOccupancy(type);
    return BitUtils.isBitSet64(bitboard, square);
  }
  public isOccupied(at: Square): boolean {
    return this._bitboards.isOccupied(at);
  }
  public setPiece(piece: Piece, to: Square): void {
    this._bitboards.setPieceBit(piece, to);
  }
  public movePiece(from: Square, to: Square) {
    this._bitboards.moveBit(from, to);
  }
  public removePiece(at: Square): void {
    this._bitboards.clearBit(at);
  }

  public getKingSquare(colour: PieceColour): Square {
    return SquareUtils.toSquare(
      BitboardUtils.getLSBIndex(this.getBitboard(PIECE_TYPES.King | colour))!,
    );
  }

  public toFen(): string {
    return composeFen(this);
  }
  public loadFen(fen: string): void {
    parseFen(fen, this);
  }
  public static fromFen(fen: string): Board {
    return new Board(fen);
  }
}
