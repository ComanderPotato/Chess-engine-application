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
  const attacks = blockerConfigs.map((blockerConfig) =>
    walkSlidingRays(square, piece, blockerConfig),
  );

  while (true) {
    const attackTable: Bitboard[] = new Array(blockerConfigs.length);
    const magicNumber: bigint = MagicUtil.randomMagic();

    let isValid = true;
    for (
      let blockerIndex = 0;
      blockerIndex < blockerConfigs.length;
      blockerIndex++
    ) {
      const index = MagicUtil.computeIndex(
        blockerConfigs[blockerIndex]!,
        magicNumber,
        shift,
      );
      const attack = attacks[blockerIndex]!;
      if (attackTable[index] !== undefined && attackTable[index] !== attack) {
        isValid = false;
        break;
      }
      attackTable[index] = attack;
    }

    if (isValid) {
      return { magicNumber, attackTable };
    }
  }
}
