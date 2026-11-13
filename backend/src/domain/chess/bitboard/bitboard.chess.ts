import { SQUARE_TO_BB } from "../board/board.constants.js";
import { Bitboard, ReadonlyBitboards, Square } from "../board/types.chess.js";
import { isWhite } from "../piece/piece.chess.js";
import { PIECE_COLOURS } from "../piece/piece.constants.js";
import { Piece, PieceColour, PieceType } from "../piece/piece.types.js";
import * as BitUtils from "../utils/bit.utils.js";
import {
  createBitboard,
  OR,
  pieceToIndex,
  squareToBB,
  XOR,
} from "../utils/bitboard.utils.js";
import { BITBOARD_COUNT, BitboardKey } from "./bitboard.constants.js";

export class Bitboards {
  // private _bitboards: Bitboard[] = new Array(BITBOARD_COUNT).fill(0);
  private _bitboards: Bitboard[] = Array.from({ length: BITBOARD_COUNT }, () =>
    createBitboard(),
  );

  constructor(
    bitboards: Bitboard[] = Array.from({ length: BITBOARD_COUNT }, () =>
      createBitboard(),
    ),
  ) {
    this._bitboards = bitboards;
  }
  public isOccupied(at: Square): boolean {
    return BitUtils.isBitSet(this.allOccupancy, at);
  }
  public moveBit(from: Square, to: Square): void {
    const idx = this.findOccupiedBitboardIndex(from);
    this._bitboards[idx]! = XOR(
      this._bitboards[idx]!,
      OR(squareToBB(from), squareToBB(to)),
    );
  }
  public movePieceBit(piece: Piece, from: Square, to: Square): void {
    const idx = pieceToIndex(piece);
    this._bitboards[idx]! = XOR(
      this._bitboards[idx]!,
      OR(squareToBB(from), squareToBB(to)),
    );
  }
  public setPieceBit(piece: Piece, square: Square): void {
    const idx = pieceToIndex(piece);
    this._bitboards[idx]! = BitUtils.setBit(this._bitboards[idx]!, square);
  }
  public clearBit(square: Square): void {
    const idx = this.findOccupiedBitboardIndex(square);
    this._bitboards[idx]! = BitUtils.clearBit(this._bitboards[idx]!, square);
  }
  public clearPieceBit(piece: Piece, square: Square): void {
    const idx = pieceToIndex(piece);
    this._bitboards[idx]! = BitUtils.clearBit(this._bitboards[idx]!, square);
  }
  public findOccupiedBitboardIndex(square: Square): number {
    let [start, end] = BitUtils.isBitSet(this.whiteOccupancy, square)
      ? [0, 6]
      : [6, 12];
    for (; start < end; start++) {
      if (BitUtils.isBitSet(this._bitboards[start]!, square)) return start;
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
    return OR(
      this._bitboards[pieceToIndex(type | PIECE_COLOURS.Black)]!,
      this._bitboards[pieceToIndex(type | PIECE_COLOURS.White)]!,
    );
  }

  public getFriendlyOccupancyFor(colour: PieceColour) {
    return isWhite(colour) ? this.whiteOccupancy : this.blackOccupancy;
  }
  public getEnemyOccupancyFor(colour: PieceColour) {
    return isWhite(colour) ? this.blackOccupancy : this.whiteOccupancy;
  }

  public get allOccupancy(): Bitboard {
    return OR(this.whiteOccupancy, this.blackOccupancy);
  }
  get whiteOccupancy(): Bitboard {
    return OR(
      OR(
        OR(
          OR(
            OR(
              this._bitboards[BitboardKey.WhitePawn]!,
              this._bitboards[BitboardKey.WhiteKnight]!,
            ),
            this._bitboards[BitboardKey.WhiteBishop]!,
          ),
          this._bitboards[BitboardKey.WhiteRook]!,
        ),
        this._bitboards[BitboardKey.WhiteQueen]!,
      ),
      this._bitboards[BitboardKey.WhiteKing]!,
    );
  }
  get blackOccupancy(): Bitboard {
    return OR(
      OR(
        OR(
          OR(
            OR(
              this._bitboards[BitboardKey.BlackPawn]!,
              this._bitboards[BitboardKey.BlackKnight]!,
            ),
            this._bitboards[BitboardKey.BlackBishop]!,
          ),
          this._bitboards[BitboardKey.BlackRook]!,
        ),
        this._bitboards[BitboardKey.BlackQueen]!,
      ),
      this._bitboards[BitboardKey.BlackKing]!,
    );
  }
  get whiteSlidingOccupancy(): Bitboard {
    return OR(
      OR(
        this._bitboards[BitboardKey.WhiteBishop]!,
        this._bitboards[BitboardKey.WhiteRook]!,
      ),
      this._bitboards[BitboardKey.WhiteQueen]!,
    );
  }
  get blackSlidingOccupancy(): Bitboard {
    return OR(
      OR(
        this._bitboards[BitboardKey.BlackBishop]!,
        this._bitboards[BitboardKey.BlackRook]!,
      ),
      this._bitboards[BitboardKey.BlackQueen]!,
    );
  }
}
