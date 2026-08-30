import { Bitboard } from "../../board/types.chess.js";

export interface MagicData {
  identifier: string;
  fileName: string;
  shifts: number[];
  magics: Bitboard[];
}

export interface MagicOptions {
  write: boolean;
  read: boolean;
}
export interface MagicResponse {
  shifts: number[];
  magics: Bitboard[];
}
