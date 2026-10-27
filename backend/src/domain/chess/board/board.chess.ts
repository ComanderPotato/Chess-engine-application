import { FENS } from "../fen/fen.constants.js";
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
import * as MoveChess from "../movegen/move/move.chess.js";
import * as BitUtils from "../utils/bit.utils.js";
import * as BitboardUtils from "../utils/bitboard.utils.js";
import * as SquareUtils from "../utils/square.utils.js";
import { MOVE_FLAGS } from "../movegen/move/move.constants.js";
import { COORD_SQUARE_MAP } from "#/fixtures/chess/square.fixtures.js";
import { squareToCoord } from "../utils/coord.utils.js";
import { getEnemyColour, isWhite } from "../piece/piece.chess.js";

export interface StateInfo {
  move: Move;
  capturedPiece: Piece;
  boardState: BoardState;
}
export interface BoardState {
  activeColour: PieceColour;
  castlingRights: CastlingRights;
  enPassant: EnPassant;
  halfMoveClock: number;
  fullMoveClock: number;
}
export class Board {
  private _state: StateInfo[] = [];
  public _pieceAtSquare!: Piece[];
  private _bitboards!: Bitboards;

  // FEN
  private _activeColour!: PieceColour;

  private _castlingRights!: CastlingRights;

  private _enPassant!: EnPassant;

  private _halfMoveClock!: number;

  private _fullMoveClock!: number;
  constructor(fen: string = FENS.START) {
    parseFen(fen, this);
  }

  getSquare(at: Square): Piece {
    return this._pieceAtSquare[at]!;
  }
  setSquare(piece: Piece, at: Square): void {
    this._pieceAtSquare[at] = piece;
  }
  captureSquare(at: Square): void {
    this._pieceAtSquare[at] = PIECE_TYPES.Empty;
  }
  moveSquare(from: Square, to: Square): void {
    const temp = this._pieceAtSquare[from]!;
    this._pieceAtSquare[from] = this._pieceAtSquare[to]!;
    this._pieceAtSquare[to] = temp;
    // this._squares[from] = this._squares[from]! ^ this._squares[to]!;
    // this._squares[to] = this._squares[from]! ^ this._squares[to]!;
    // this._squares[from] = this._squares[from]! ^ this._squares[to]!;
  }
  promotePiece(at: Square, promotionPiece: Piece): void {
    this.removePiece(PIECE_TYPES.Pawn | this.activeColour, at);
    this.setPiece(promotionPiece | this.activeColour, at);
  }
  captureEnpassant(at: Square): void {
    const offset = isWhite(this.activeColour) ? -8 : 8;
    this.removeBit(SquareUtils.toSquare(at + offset));
  }
  get state(): StateInfo[] {
    return this._state;
  }
  public getState(): BoardState {
    return {
      activeColour: this._activeColour,
      castlingRights: this._castlingRights,
      enPassant: this._enPassant,
      halfMoveClock: this._halfMoveClock,
      fullMoveClock: this._fullMoveClock,
    };
  }
  public pushState(move: Move, capturedPiece: Piece): void {
    this._state.push({
      move,
      capturedPiece,
      boardState: this.getState(),
    });
  }
  public popState(): StateInfo | undefined {
    return this._state.pop();
  }
  public saveState(boardState: BoardState) {
    this._activeColour = boardState.activeColour;
    this._castlingRights = boardState.castlingRights;
    this._enPassant = boardState.enPassant;
    this._halfMoveClock = boardState.halfMoveClock;
    this._fullMoveClock = boardState.fullMoveClock;
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
    return BitUtils.isBitSet32(this._castlingRights, 2);
  }
  public getBlackQueenSideCastlingRights() {
    return BitUtils.isBitSet32(this._castlingRights, 3);
  }
  public clearWhiteKingSideCastlingRights(): void {
    this._castlingRights = BitUtils.clearBit32(this._castlingRights, 0);
  }
  public clearWhiteQueenSideCastlingRights(): void {
    this._castlingRights = BitUtils.clearBit32(this._castlingRights, 1);
  }
  public clearBlackKingSideCastlingRights(): void {
    this._castlingRights = BitUtils.clearBit32(this._castlingRights, 2);
  }
  public clearBlackQueenSideCastlingRights(): void {
    this._castlingRights = BitUtils.clearBit32(this._castlingRights, 3);
  }

  // BITBOARD GETTERS/SETTERS

  public getPawns(colour: PieceColour = this._activeColour): Bitboard {
    return this.getBitboard(PIECE_TYPES.Pawn | colour);
  }
  public getKnights(colour: PieceColour = this._activeColour): Bitboard {
    return this.getBitboard(PIECE_TYPES.Knight | colour);
  }
  public getBishops(colour: PieceColour = this._activeColour): Bitboard {
    return this.getBitboard(PIECE_TYPES.Bishop | colour);
  }
  public getRooks(colour: PieceColour = this._activeColour): Bitboard {
    return this.getBitboard(PIECE_TYPES.Rook | colour);
  }
  public getQueens(colour: PieceColour = this._activeColour): Bitboard {
    return this.getBitboard(PIECE_TYPES.Queen | colour);
  }
  public getKing(colour: PieceColour = this._activeColour): Bitboard {
    return this.getBitboard(PIECE_TYPES.King | colour);
  }

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

  public get activeOccupancy(): Bitboard {
    return this.getFriendlyOccupancyFor(this._activeColour);
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
    this._bitboards.setPieceBit(piece, square);
  }
  // FEN GETTERS/SETTERS
  public setPiecePlacement(bitboards: Bitboards, squares: Piece[]): void {
    this._bitboards = bitboards;
    this._pieceAtSquare = [...squares];
  }

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
  public get opponentColour(): PieceColour {
    return getEnemyColour(this._activeColour);
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
    // Should be done before the move
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
    const to = MoveChess.getTo(move);

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
    if (from === COORD_SQUARE_MAP.A1 || to === COORD_SQUARE_MAP.A1) {
      this.clearWhiteQueenSideCastlingRights();
      return;
    }
    if (from === COORD_SQUARE_MAP.H1 || to === COORD_SQUARE_MAP.H1) {
      this.clearWhiteKingSideCastlingRights();
      return;
    }
    if (from === COORD_SQUARE_MAP.A8 || to === COORD_SQUARE_MAP.A8) {
      this.clearBlackQueenSideCastlingRights();
      return;
    }
    if (from === COORD_SQUARE_MAP.H8 || to === COORD_SQUARE_MAP.H8) {
      this.clearBlackKingSideCastlingRights();
    }
  }
  private updatePiecePlacement(): void {}
  private updateEnPassant(move: Move): void {
    if (MoveChess.getFlag(move) !== MOVE_FLAGS.DoublePawnPush) {
      this.enPassant = null;
      return;
    }
    // const isDoublePawnPush = MoveChess.getFlag(move) === MOVE_FLAGS.DoublePawnPush || null;
    this.enPassant = SquareUtils.toSquare(
      (MoveChess.getFrom(move) + MoveChess.getTo(move)) / 2,
    );
    // console.log(
    //   squareToCoord(MoveChess.getFrom(move)),
    //   squareToCoord(MoveChess.getTo(move)),
    // );
    // this.enPassant = isDoublePawnPush && SquareUtils.toSquare(
    //   (MoveChess.getFrom(move) + MoveChess.getTo(move)) / 2,
    // );
    // this.enPassant = MoveChess.getFlag(move) &&
  }
  private updateActiveColour(): void {
    this._activeColour ^= PIECE_COLOURS.White | PIECE_COLOURS.Black;
  }

  private updateHalfMoveClock(move: Move) {
    const to = MoveChess.getTo(move);
    const wasCapture = MoveChess.getFlag(move) === MOVE_FLAGS.Capture;
    const wasPawnMoved = BitUtils.isBitSet64(
      this.getOccupancy(PIECE_TYPES.Pawn),
      to,
    );
    this.halfMoveClock =
      wasCapture || wasPawnMoved ? 0 : this.halfMoveClock + 1;
  }
  private updateFullMoveClock() {
    this.fullMoveClock =
      this.activeColour === PIECE_COLOURS.Black
        ? this.fullMoveClock + 1
        : this.fullMoveClock;
  }

  public pieceAt(square: Square): Piece {
    return this._pieceAtSquare[square]!;
    // if (!BitUtils.isBitSet64(this.occupancy, square)) return PIECE_TYPES.Empty;
    // const idx = this._bitboards.findOccupiedBitboardIndex(square);
    // return BitboardUtils.indexToPiece(idx);
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
    this.setSquare(piece, to);
    this._bitboards.setPieceBit(piece, to);
  }
  public removePiece(piece: Piece, at: Square): void {
    this.captureSquare(at);
    this._bitboards.clearPieceBit(piece, at);
  }
  public movePiece(piece: Piece, from: Square, to: Square): void {
    this.moveSquare(from, to);
    this._bitboards.movePieceBit(piece, from, to);
  }
  public moveBit(from: Square, to: Square) {
    const piece = this.pieceAt(from);
    this.moveSquare(from, to);
    this._bitboards.movePieceBit(piece, from, to);
  }
  public removeBit(at: Square): void {
    const removedPiece = this.pieceAt(at);

    this.captureSquare(at);
    this._bitboards.clearPieceBit(removedPiece, at);
  }
  public move(from: Square, to: Square): void {
    const movePiece = this.pieceAt(from);
    this.moveSquare(from, to);
    this._bitboards.movePieceBit(movePiece, from, to);
  }
  public capturePiece(at: Square): void {
    const capturedPiece = this.pieceAt(at);
    this.captureSquare(at);
    this._bitboards.clearPieceBit(capturedPiece, at);
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
