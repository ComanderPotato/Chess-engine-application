import { BOARD_SIZE, SQUARES } from "@/domain/chess/board/board.constants.js";
import { Bitboard, Square } from "@/domain/chess/board/types.chess.js";
import { Piece } from "@/domain/chess/piece/piece.types.js";
import {
  getRelevantBlockerSquares,
  generateBlockerConfigs,
} from "../attack/attack.blocker.js";
import { generateSlidingAttackMask } from "../attack/attack.mask.js";
import { findSlidingMagic } from "./magic.chess.js";
import path from "path";
import { PIECE_PROPERTIES } from "../../piece/piece.constants.js";
import {
  appendGenerated,
  fileExists,
  removeFile,
} from "../../utils/file.utils.js";

export function generateMagics(piece: Piece) {
  const shifts: number[] = new Array(BOARD_SIZE);
  const magics: Bitboard[] = new Array(BOARD_SIZE);
  for (const square of SQUARES) {
    const mask = generateSlidingAttackMask(square, piece);
    const relevantBits = getRelevantBlockerSquares(mask);
    const blockers = generateBlockerConfigs(relevantBits);

    shifts[square] = BOARD_SIZE - relevantBits.length;
    const { magicNumber } = findSlidingMagic(
      square,
      shifts[square],
      blockers,
      piece,
    );
    magics[square] = magicNumber;
  }
  return { shifts, magics };
}

function magicInit(remove: boolean) {
  console.log("Create magics");
  const dirName = path.resolve(import.meta.dirname);
  const bishopFile = path.join(dirName, "bishop.magic.ts");
  const rookFile = path.join(dirName, "rook.magic.ts");
  if (remove) {
    if (fileExists(bishopFile)) removeFile(bishopFile);

    if (fileExists(rookFile)) removeFile(rookFile);
  }

  if (!fileExists(bishopFile)) {
    const { shifts, magics } = generateMagics(PIECE_PROPERTIES.Diagonal);
    appendGenerated(bishopFile, "BISHOP_SHIFTS_PRECOMPUTE", shifts);
    appendGenerated(bishopFile, "BISHOP_MAGICS_PRECOMPUTE", magics);
  }
  if (!fileExists(rookFile)) {
    const { shifts, magics } = generateMagics(PIECE_PROPERTIES.Orthogonal);
    appendGenerated(rookFile, "ROOK_SHIFTS_PRECOMPUTE", shifts);
    appendGenerated(rookFile, "ROOK_MAGICS_PRECOMPUTE", magics);
  }
}
// magicInit(true);
