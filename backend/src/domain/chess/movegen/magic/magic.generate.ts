import { BOARD_SIZE, SQUARES } from "@/domain/chess/board/board.constants.js";
import { Piece } from "@/domain/chess/piece/piece.types.js";
import {
  getRelevantBlockerSquares,
  generateBlockerConfigs,
} from "../attack/attack.blocker.js";
import { generateSlidingAttackMask } from "../attack/attack.mask.js";
import { findSlidingMagic } from "./magic.chess.js";
import path from "path";
import { writeToFile } from "../../utils/file.utils.js";
import { MagicOptions, MagicResponse, MagicData } from "./magic.types.js";
import { formatGeneratedConstant } from "../../utils/codegen.utils.js";

import { hasDiagonalMovement } from "../../piece/piece.chess.js";

export function composeMagicIdentifier(piece: Piece): string {
  if (hasDiagonalMovement(piece)) {
    return "diagonal";
  } else {
    return "orthogonal";
  }
}
export function generateSlidingMagics(
  piece: Piece,
  options?: MagicOptions,
): MagicResponse {
  const identifier = composeMagicIdentifier(piece);

  const data: MagicData = {
    identifier,
    fileName: `${identifier}.magic.ts`, // Maybe put in magic.utils
    shifts: new Array(BOARD_SIZE),
    magics: new Array(BOARD_SIZE),
  };
  for (const square of SQUARES) {
    const mask = generateSlidingAttackMask(square, piece);
    const relevantBits = getRelevantBlockerSquares(mask);
    const blockersConfigs = generateBlockerConfigs(relevantBits);

    const shift = BOARD_SIZE - relevantBits.length;

    const { magicNumber } = findSlidingMagic(
      square,
      shift,
      blockersConfigs,
      piece,
    );

    data.shifts[square] = shift;
    data.magics[square] = magicNumber;
  }
  if (options?.write) {
    writeMagicData(data);
  }
  return {
    magics: data.magics,
    shifts: data.shifts,
  };
}

function writeMagicData(data: MagicData): void {
  const outputDirectory = path.resolve(import.meta.dirname);
  const filePath = path.join(outputDirectory, `${data.identifier}.magic.ts`);
  const magicConstant = formatGeneratedConstant(
    `${data.identifier.toUpperCase()}_MAGICS_PRECOMPUTE`, // Maybe add function for magic.utls
    data.magics,
  );
  const shiftConstant = formatGeneratedConstant(
    `${data.identifier.toUpperCase()}_SHIFTS_PRECOMPUTE`,
    data.shifts,
  );
  writeToFile(filePath, magicConstant.concat(shiftConstant));
}
