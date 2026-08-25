import { PIECE_COLOURS } from "@/domain/chess/piece/piece.constants.js";

export const EXPECTED_COMPOSED_ACTIVE_COLOUR = [
  [PIECE_COLOURS.White, "w"],
  [PIECE_COLOURS.Black, "b"],
] as const;
export const EXPECTED_PARSED_ACTIVE_COLOUR = [
  ["w", PIECE_COLOURS.White],
  ["b", PIECE_COLOURS.Black],
] as const;

export const EXPECTED_COMPOSED_CASTLING_RIGHTS = [
  [0b0000, "-"],
  [0b0001, "K"],
  [0b0010, "Q"],
  [0b0011, "KQ"],
  [0b0100, "k"],
  [0b0101, "Kk"],
  [0b0110, "Qk"],
  [0b0111, "KQk"],
  [0b1000, "q"],
  [0b1001, "Kq"],
  [0b1010, "Qq"],
  [0b1011, "KQq"],
  [0b1100, "kq"],
  [0b1101, "Kkq"],
  [0b1110, "Qkq"],
  [0b1111, "KQkq"],
] as const;

export const EXPECTED_PARSED_CASTLING_RIGHTS = [
  ["-", 0b0000],
  ["K", 0b0001],
  ["Q", 0b0010],
  ["KQ", 0b0011],
  ["k", 0b0100],
  ["Kk", 0b0101],
  ["Qk", 0b0110],
  ["KQk", 0b0111],
  ["q", 0b1000],
  ["Kq", 0b1001],
  ["Qq", 0b1010],
  ["KQq", 0b1011],
  ["kq", 0b1100],
  ["Kkq", 0b1101],
  ["Qkq", 0b1110],
  ["KQkq", 0b1111],
] as const;
