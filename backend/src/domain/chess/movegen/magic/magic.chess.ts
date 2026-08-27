import { Square, Bitboard } from "@/domain/chess/board/types.chess.js";
import { Piece } from "@/domain/chess/piece/piece.types.js";
import * as MagicUtil from "@/domain/chess/utils/magic.utils.js";
import { walkSlidingRays } from "../attack/attack.rays.js";

export function findSlidingMagic(
  square: Square,
  shift: number,
  blockerConfigs: Bitboard[],
  piece: Piece,
): { magicNumber: bigint; attackTable: Bitboard[] } {
  let attackTable: Bitboard[] = new Array(blockerConfigs.length);

  let magicNumber: bigint = MagicUtil.randomMagic();

  const computedAttacksCache = new Array(blockerConfigs.length);

  for (let blockerIndex = 0; blockerIndex < blockerConfigs.length; ) {
    const blockerMask = blockerConfigs[blockerIndex]!;
    const index = MagicUtil.computeIndex(blockerMask, magicNumber, shift);
    if (computedAttacksCache[blockerIndex] === undefined) {
      computedAttacksCache[blockerIndex] = walkSlidingRays(
        square,
        piece,
        blockerMask,
      );
    }
    const attack = computedAttacksCache[blockerIndex]!;
    if (attackTable[index] !== undefined && attackTable[index] !== attack) {
      magicNumber = MagicUtil.randomMagic();
      blockerIndex = 0;
      attackTable = new Array(blockerConfigs.length);
    } else {
      attackTable[index] = attack;
      blockerIndex++;
    }
  }
  return { magicNumber, attackTable };
}
