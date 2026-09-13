import { Bitboard, ReadonlyBitboards, Square } from "../board/types.chess.js";
import { isWhite } from "../piece/piece.chess.js";
import { PIECE_COLOURS } from "../piece/piece.constants.js";
import { Piece, PieceColour, PieceType } from "../piece/piece.types.js";
import { clearBit64, isBitSet64, setBit64 } from "../utils/bit.utils.js";
import { pieceToIndex } from "../utils/bitboard.utils.js";
import { BITBOARD_COUNT, BitboardKey } from "./bitboard.constants.js";

export class Bitboards {
  private _bitboards: Bitboard[] = new Array(BITBOARD_COUNT).fill(0n);

  public moveBit(from: Square, to: Square): void {
    if (!isBitSet64(this.allOccupancy, from)) return;
    const idx = this.findOccupiedBitboardIndex(from);
    this._bitboards[idx]! ^= (1n << BigInt(to)) | (1n << BigInt(from));
  }
  public movePieceBit(piece: Piece, from: Square, to: Square): void {
    const idx = pieceToIndex(piece);
    if (!isBitSet64(this._bitboards[idx]!, from)) return;
    this._bitboards[idx]! ^= (1n << BigInt(to)) | (1n << BigInt(from));
  }
  public setPieceBit(piece: Piece, square: Square): void {
    if (isBitSet64(this.allOccupancy, square)) return;
    const idx = pieceToIndex(piece);
    this._bitboards[idx]! = setBit64(this._bitboards[idx]!, square);
  }
  public clearBit(square: Square): void {
    if (!isBitSet64(this.allOccupancy, square)) return;
    const idx = this.findOccupiedBitboardIndex(square);
    this._bitboards[idx]! = clearBit64(this._bitboards[idx]!, square);
  }
  public clearPieceBit(piece: Piece, square: Square): void {
    if (!isBitSet64(this.allOccupancy, square)) return;
    const idx = pieceToIndex(piece);
    this._bitboards[idx]! = clearBit64(this._bitboards[idx]!, square);
  }
  public findOccupiedBitboardIndex(square: Square): number {
    for (const [idx, bitboard] of this._bitboards.entries()) {
      if (isBitSet64(bitboard, square)) return idx;
    }
    throw new Error("Unable to find bitboard index for occupied square");
  }

  public getBitboard(piece: Piece): Bitboard {
    return this._bitboards[pieceToIndex(piece)]!;
  }
  public get bitboards(): ReadonlyBitboards {
    return this._bitboards;
  }
  public getOccupancy(type: PieceType) {
    return (
      this._bitboards[pieceToIndex(type | PIECE_COLOURS.Black)]! |
      this._bitboards[pieceToIndex(type | PIECE_COLOURS.White)]!
    );
  }
  public getFriendlyOccupancyFor(colour: PieceColour) {
    return isWhite(colour) ? this.whiteOccupancy : this.blackOccupancy;
  }

  public getEnemyOccupancyFor(colour: PieceColour) {
    return isWhite(colour) ? this.blackOccupancy : this.whiteOccupancy;
  }
  public get allOccupancy(): Bitboard {
    return this.whiteOccupancy | this.blackOccupancy;
  }
  get whiteOccupancy(): Bitboard {
    return (
      this._bitboards[BitboardKey.WhitePawn]! |
      this._bitboards[BitboardKey.WhiteKnight]! |
      this._bitboards[BitboardKey.WhiteBishop]! |
      this._bitboards[BitboardKey.WhiteRook]! |
      this._bitboards[BitboardKey.WhiteQueen]! |
      this._bitboards[BitboardKey.WhiteKing]!
    );
  }
  get blackOccupancy(): Bitboard {
    return (
      this._bitboards[BitboardKey.BlackPawn]! |
      this._bitboards[BitboardKey.BlackKnight]! |
      this._bitboards[BitboardKey.BlackBishop]! |
      this._bitboards[BitboardKey.BlackRook]! |
      this._bitboards[BitboardKey.BlackQueen]! |
      this._bitboards[BitboardKey.BlackKing]!
    );
  }
  get whiteSlidingOccupancy(): Bitboard {
    return (
      this._bitboards[BitboardKey.WhiteBishop]! |
      this._bitboards[BitboardKey.WhiteRook]! |
      this._bitboards[BitboardKey.WhiteQueen]!
    );
  }
  get blackSlidingOccupancy(): Bitboard {
    return (
      this._bitboards[BitboardKey.BlackBishop]! |
      this._bitboards[BitboardKey.BlackRook]! |
      this._bitboards[BitboardKey.BlackQueen]!
    );
  }
}
