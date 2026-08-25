import { FENS } from "./fen.constants.js";
import {
  PIECE_COLOURS as PieceColourConstants,
  PIECE_TYPES as PieceTypeConstants,
} from "../piece/piece.constants.js";
import { Piece, PieceColour, PieceType } from "../piece/piece.types.js";
import { BOARD_DIMENSION } from "./board.constants.js";
import { Bit, Bitboard, ReadonlyBitboards, Square } from "./types.chess.js";
import { isBitSet32, isBitSet64 } from "../utils/bit.utils.js";
import { getLSBIndex, indexToPiece } from "../utils/bitboard.utils.js";
import { Bitboards } from "../bitboard/bitboard.chess.js";
import { coordToSquare } from "../utils/coord.utils.js";
import { isValidSquare, toSquare } from "../utils/square.utils.js";

// Board and basic operations
//

// enum CastlingRights {
//   WhiteKingSide = 4,
//   WhiteQueenSide = 3,
//   BLackKingSide = 2,
//   BLackQueenSide = 1,
// }
export type CastlingRights = number;
export type EnPassant = Square | null;
export class Board {
  private _bitboards: Bitboards = new Bitboards();

  // FEN
  private _piecePlacement: string = FENS.START;

  private _activeColour: PieceColour = PieceColourConstants.White;

  private _castlingRights: CastlingRights = 0b1111;

  private _enPassant: EnPassant = null;

  private _halfmoveClock: number = 0;

  private _fullMoveClock: number = 1;

  // private _whiteKingSquare: Square;
  // private _blackKingSquare: Square;
  constructor() {
    // this._bitboards = new Bitboards();
  }

  public getWhiteKingSideCastlingRights() {
    return isBitSet32(this._castlingRights, 4);
  }
  public getWhiteQueenSideCastlingRights() {
    return isBitSet32(this._castlingRights, 3);
  }
  public getBlackKingSideCastlingRights() {
    return isBitSet32(this._castlingRights, 2);
  }
  public getBlackQueenSideCastlingRights() {
    return isBitSet32(this._castlingRights, 1);
  }

  public set piecePlacement(value: Bitboards) {
    this._bitboards = value;
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
  public toggleActiveColour(): void {
    this._activeColour =
      this._activeColour === PieceColourConstants.White
        ? PieceColourConstants.Black
        : PieceColourConstants.White;
  }
  setState(state: string) {
    this._piecePlacement = state;
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
  // public set bitboards(value: Bitboards) {
  //   this._bitboards = value;
  // }
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
  public movePiece(piece: Piece, from: string, to: string) {
    const fromSquare = coordToSquare(from);
    const toSquare = coordToSquare(to);
    this._bitboards.moveBit(piece, fromSquare, toSquare);
  }

  private getKingSquare(colour: PieceColour): Square {
    return toSquare(
      getLSBIndex(this.getBitboard(PieceTypeConstants.King | colour))!,
    );
  }
  public getWhiteKingSquare(): Square {
    return this.getKingSquare(PieceColourConstants.White);
  }
  public getBlackKingSquare(): Square {
    return this.getKingSquare(PieceColourConstants.Black);
  }
  public pieceAt(square: Square): Piece {
    for (let index = 0; index < this.bitboardsList.length; index++) {
      if (isBitSet64(this.bitboardsList[index]!, square))
        return indexToPiece(index);
    }
    return PieceTypeConstants.Empty;
  }
  public move(from: string, to: string) {
    // const fromBitPosition = this.selectSquare(from);
    // const toBitPosition = this.selectSquare(to);
    // const fromBoard = this.bitboards.getBoardWithActiveBit(fromBitPosition);
    // Print.printSimple(fromBoard);
    // this.bitBoards.updateBoard(fromBoard, fromBitPosition, toBitPosition);
  }
}
