import { FENS } from "./fen.constants.js";
import { PIECE_COLOURS, PIECE_TYPES } from "../piece/piece.constants.js";
import { Piece, PieceColour, PieceType } from "../piece/piece.types.js";
import {
  Bitboard,
  CastlingRights,
  EnPassant,
  ReadonlyBitboards,
  Square,
} from "./types.chess.js";
import { Bitboards } from "../bitboard/bitboard.chess.js";
import { coordToSquare } from "../utils/coord.utils.js";
import { parseFen } from "../fen/fen.parser.js";
import { composeFen } from "../fen/fen.composer.js";
import { Move } from "../movegen/move/move.types.js";

import { getColour, getType, isWhite } from "../piece/piece.chess.js";
import * as MoveChess from "../movegen/move/move.chess.js";
import * as BitUtils from "../utils/bit.utils.js";
import * as BitboardUtils from "../utils/bitboard.utils.js";
import * as SquareUtils from "../utils/square.utils.js";
import { MOVE_FLAGS } from "../movegen/move/move.constants.js";

export class Board {
  private _bitboards: Bitboards = new Bitboards();

  // FEN
  private _activeColour!: PieceColour;

  private _castlingRights!: CastlingRights;

  private _enPassant!: EnPassant;

  private _halfmoveClock!: number;

  private _fullMoveClock!: number;
  constructor(fen: string = FENS.START) {
    parseFen(fen, this);
  }

  public getWhiteKingSideCastlingRights() {
    return BitUtils.isBitSet32(this._castlingRights, 4);
  }
  public getWhiteQueenSideCastlingRights() {
    return BitUtils.isBitSet32(this._castlingRights, 3);
  }
  public getBlackKingSideCastlingRights() {
    return BitUtils.isBitSet32(this._castlingRights, 2);
  }
  public getBlackQueenSideCastlingRights() {
    return BitUtils.isBitSet32(this._castlingRights, 1);
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
    this._bitboards = value;
  }
  public setBitboard(piece: Piece, square: Square): void {
    this._bitboards.setBit(piece, square);
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
    this._halfmoveClock = value;
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
    return this._halfmoveClock;
  }

  public get fullMoveClock(): number {
    return this._fullMoveClock;
  }

  // FEN UPDATE OPERATIONS
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

  public movePiece(piece: Piece, from: string, to: string) {
    const fromSquare = coordToSquare(from);
    const toSquare = coordToSquare(to);
    this._bitboards.moveBit(piece, fromSquare, toSquare);
  }

  private getKingSquare(colour: PieceColour): Square {
    return SquareUtils.toSquare(
      BitboardUtils.getLSBIndex(this.getBitboard(PIECE_TYPES.King | colour))!,
    );
  }
  public getWhiteKingSquare(): Square {
    return this.getKingSquare(PIECE_COLOURS.White);
  }
  public getBlackKingSquare(): Square {
    return this.getKingSquare(PIECE_COLOURS.Black);
  }
  public pieceAt(square: Square): Piece {
    for (let index = 0; index < this.bitboardsList.length; index++) {
      if (BitUtils.isBitSet64(this.bitboardsList[index]!, square))
        return BitboardUtils.indexToPiece(index);
    }
    return PIECE_TYPES.Empty;
  }
  public updateBoardState(move: Move): void {
    this.updateHalfMoveClock(move);
    this.updateEnPassant(move);
    this.updateFullMoveClock();
    this.updateActiveColour();

    this.updatePiecePlacement();
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
  public move(from: string, to: string) {
    // const fromBitPosition = this.selectSquare(from);
    // const toBitPosition = this.selectSquare(to);
    // const fromBoard = this.bitboards.getBoardWithActiveBit(fromBitPosition);
    // Print.printSimple(fromBoard);
    // this.bitBoards.updateBoard(fromBoard, fromBitPosition, toBitPosition);
  }
}
