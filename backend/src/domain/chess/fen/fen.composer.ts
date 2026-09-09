import { Board } from "../board/board.chess.js";
import { RANKS, FILES } from "../board/board.constants.js";
import { CastlingRights, EnPassant } from "../board/types.chess.js";
import { PIECE_COLOURS, PIECE_TYPES } from "../piece/piece.constants.js";
import { pieceToNotation } from "../piece/piece.notation.js";
import { PieceColour } from "../piece/piece.types.js";
import { isBitSet32, isBitSet64 } from "../utils/bit.utils.js";
import { squareToCoord } from "../utils/coord.utils.js";
import { fileRankToSquare } from "../utils/square.utils.js";
import { castlingBits } from "./fen.constants.js";

function throwInvalidFenComposition(message: string): never {
  throw new Error(`Invalid FEN composition: ${message}`);
}
export function composeFen(board: Board): string {
  const composedPiecePlacement = composePiecePlacement(board);
  const composedActiveColour = composeActiveColour(board.activeColour);
  const composedCastlingRights = composeCastlingRights(board.castlingRights);
  const composedEnPassant = composeEnPassant(board.enPassant);
  const composedHalfMoveClock = composeHalfMoveClock(board.halfMoveClock);
  const composedFullMoveClock = composeFullMoveClock(board.fullMoveClock);
  return [
    composedPiecePlacement,
    composedActiveColour,
    composedCastlingRights,
    composedEnPassant,
    composedHalfMoveClock,
    composedFullMoveClock,
  ].join(" ");
}
export function composePiecePlacement(board: Board): string {
  let fen = "";

  for (let rank: number = RANKS.EIGHTH; rank >= RANKS.FIRST; rank--) {
    for (let file = FILES.A; file <= FILES.H; ) {
      const piece = board.pieceAt(fileRankToSquare(file, rank));
      if (piece === PIECE_TYPES.Empty) {
        let count = 0;
        while (
          file <= FILES.H &&
          !isBitSet64(board.occupancy, fileRankToSquare(file, rank))
        ) {
          count++;
          file++;
        }
        fen += count;
      } else {
        fen += pieceToNotation(piece);
        file++;
      }
    }
    if (rank !== RANKS.FIRST) fen += "/";
  }
  return fen;
}
export function composeActiveColour(activeColour: PieceColour): string {
  return activeColour === PIECE_COLOURS.White ? "w" : "b";
}
export function composeCastlingRights(castlingRights: CastlingRights): string {
  if (castlingRights < 0 || castlingRights >= 1 << 4)
    throwInvalidFenComposition(`casting rights: "${castlingRights}`);
  if (castlingRights === 0) return "-";

  let composedCastlingRights = "";
  for (const [bit, char] of castlingBits.entries()) {
    if (isBitSet32(castlingRights, bit)) composedCastlingRights += char;
  }
  return composedCastlingRights;
}
// Fix return types
export function composeEnPassant(enPassant: EnPassant): string {
  if (enPassant === null) return "-";
  try {
    return squareToCoord(enPassant);
  } catch (e) {
    throwInvalidFenComposition(`enpassant: ${enPassant}`);
  }
}
export function composeHalfMoveClock(halfMoveClock: number): string {
  if (halfMoveClock < 0)
    throwInvalidFenComposition(`half move clock: ${halfMoveClock}`);
  return String(halfMoveClock);
}
export function composeFullMoveClock(fullMoveClock: number): string {
  if (fullMoveClock < 1)
    throwInvalidFenComposition(`full move clock: ${fullMoveClock}`);
  return String(fullMoveClock);
}
