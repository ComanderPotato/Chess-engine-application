import { Bitboards } from "../bitboard/bitboard.chess.js";
import { Board } from "../board/board.chess.js";
import { FILE_SIZE, FILES, RANKS } from "../board/board.constants.js";
import { Square } from "../board/types.chess.js";
import { isValidNotation, notationToPiece } from "../piece/piece.notation.js";
import { PieceColour } from "../piece/piece.types.js";
import { coordToSquare } from "../utils/coord.utils.js";
import { PIECE_COLOURS as PieceColourConstants } from "../piece/piece.constants.js";
import { fileRankToSquare } from "../utils/square.utils.js";
import { castlingBits } from "./fen.constants.js";

function throwInvalidFen(message: string): never {
  throw new Error(`Invalid FEN: ${message}`);
}
export function parseFen(fen: string, board: Board): void {
  const fields = fen.split(" ");
  if (fields.length !== 6) {
    throw new Error("expected 6 fields");
  }
  const [
    piecePlacement,
    activeColour,
    castlingRights,
    enPassant,
    halfMoveClock,
    fullMoveClock,
  ] = fields;
  const parsedPiecePlacement = parsePiecePlacement(piecePlacement);
  const parsedActiveColour = parseActiveColour(activeColour);
  const parsedCastlingRights = parseCastlingRights(castlingRights);
  const parsedEnPassant = parseEnPassant(enPassant);
  const parsedHalfMoveClock = parseHalfMoveClock(halfMoveClock);
  const parsedFullMoveClock = parseFullMoveClock(fullMoveClock);

  board.setBitboards(parsedPiecePlacement);

  board.castlingRights = parsedCastlingRights;
  board.activeColour = parsedActiveColour;
  board.enPassant = parsedEnPassant;
  board.halfMoveClock = parsedHalfMoveClock;
  board.fullMoveClock = parsedFullMoveClock;
}

export function parsePiecePlacement(value?: string): Bitboards {
  if (value === undefined) {
    throwInvalidFen("missing piece placement");
  }
  if (!value || value[0] === "/" || value[value.length - 1] === "/") {
    throwInvalidFen(`piece placement: "${value}"`);
  }
  const bitboards = new Bitboards();

  let rank: number = RANKS.EIGHTH;
  let file: number = FILES.A;
  for (let charIdx = 0; charIdx < value.length; rank--) {
    file = FILES.A;
    while (charIdx < value.length) {
      const char = value[charIdx++]!;
      if (char === "/") break;
      if (char >= "1" && char <= "8") {
        file += Number(char);
      } else if (isValidNotation(char)) {
        bitboards.setBit(notationToPiece(char), fileRankToSquare(file++, rank));
      } else {
        throwInvalidFen(`invalid character: "${char}"`);
      }
    }
    if (file !== FILE_SIZE) throwInvalidFen("incorrect square length for file");
  }
  if (rank + 1 !== RANKS.FIRST || file - 1 !== FILES.H)
    throwInvalidFen("incorrect amount of ranks");
  return bitboards;
}
export function parseActiveColour(value?: string): PieceColour {
  if (!value) {
    throwInvalidFen("missing active colour");
  }
  if (value.length !== 1) {
    throwInvalidFen("active colour length is invalid");
  }
  return value === "w"
    ? PieceColourConstants.White
    : PieceColourConstants.Black;
}
export function parseCastlingRights(value?: string): number {
  if (!value) {
    throwInvalidFen("missing castling rights");
  }

  let castlingRights = 0;
  if (value === "-") {
    return castlingRights;
  }
  let idx = 0;
  let bit = 0;
  while (bit < castlingBits.length) {
    if (value[idx] === castlingBits[bit]) {
      castlingRights |= 1 << bit;
      idx++;
    }
    bit++;
  }
  if (idx < value.length) throwInvalidFen(`castling rights: "${value}"`);

  return castlingRights;
}
export function parseEnPassant(value?: string): Square | null {
  try {
    if (!value) {
      throw new Error("missing en passant");
    }
    if (value === "-") return null;
    return coordToSquare(value);
  } catch (error) {
    if (error instanceof Error) throwInvalidFen(error.message);
  }
  return null;
}
export function parseHalfMoveClock(value?: string): number {
  if (!value) {
    throwInvalidFen("missing half move clock");
  }
  if (!/^\d+$/.test(value)) {
    throwInvalidFen(`half move clock: "${value}"`);
  }

  return Number(value);
}
export function parseFullMoveClock(value?: string): number {
  if (!value) {
    throwInvalidFen("missing full move clock");
  }
  if (!/^\d+$/.test(value) || value === "0") {
    throwInvalidFen(`full move clock: "${value}"`);
  }

  return Number(value);
}
