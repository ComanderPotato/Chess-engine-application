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

  const computedAttacks = new Array(blockerConfigs.length);

  for (let blockerIndex = 0; blockerIndex < blockerConfigs.length; ) {
    const blockerMask = blockerConfigs[blockerIndex]!;
    const index = MagicUtil.computeIndex(blockerMask, magicNumber, shift);

    if (computedAttacks[blockerIndex] === undefined) {
      computedAttacks[blockerIndex] = walkSlidingRays(
        square,
        piece,
        blockerMask,
      );
    }
    const attack = computedAttacks[blockerIndex];

    if (attackTable[index] === undefined) {
      attackTable[index] = attack;
      blockerIndex++;
    } else {
      magicNumber = MagicUtil.randomMagic();
      blockerIndex = 0;
      attackTable = new Array(blockerConfigs.length);
    }
  }
  return { magicNumber, attackTable };
}
// export function findRookMagic(
//   square: Square,
//   shift: number,
//   blockerConfigs: Bitboard[],
// ): [Bitboard, Bitboard[]] {
//   const size = 1 << (BOARD_SIZE - shift);
//   let attackTable: Bitboard[] = new Array(size);
//
//   let blockerIndex = 0;
//   let magic: bigint = MagicUtil.randomMagic();
//   const computedAttacks = new Array(blockerConfigs.length);
//
//   for (; blockerIndex < blockerConfigs.length; blockerIndex++) {
//     const blockerMask = blockerConfigs[blockerIndex]!;
//     // const index = Number(
//     //   ((blockerConfigs[blockerIndex]! * magic) & BOARD_MASK) >> BigInt(shift),
//     // );
//     const index = MagicUtil.computeIndex(blockerMask, magic, shift);
//
//     if (!computedAttacks[blockerIndex]) {
//       computedAttacks[blockerIndex] = walkOrthogonalRays(square, blockerMask);
//     }
//     const attack = computedAttacks[blockerIndex];
//
//     if (!attackTable[index]) {
//       attackTable[index] = attack;
//     } else if (attackTable[index] !== attack) {
//       magic = MagicUtil.randomMagic();
//       blockerIndex = 0;
//       attackTable = new Array(size);
//     }
//   }
//   return [magic, attackTable];
// }
// export function findBishopMagic(
//   square: Square,
//   shift: number,
//   blockerConfigs: Bitboard[],
// ): [Bitboard, Bitboard[]] {
//   const ATTACK_TABLE_SIZE = 1 << (BOARD_SIZE - shift);
//   let attackTable: Bitboard[] = new Array(ATTACK_TABLE_SIZE);
//
//   let blockerIndex = 0;
//
//   let magic = MagicUtil.randomMagic();
//
//   const computedAttacks = new Array(blockerConfigs.length);
//
//   for (; blockerIndex < blockerConfigs.length; blockerIndex++) {
//     const blockerMask = blockerConfigs[blockerIndex]!;
//
//     const index = MagicUtil.computeIndex(blockerMask, magic, shift);
//
//     if (!computedAttacks[blockerIndex]) {
//       computedAttacks[blockerIndex] = walkDiagonalRays(square, blockerMask);
//     }
//     const attack = computedAttacks[blockerIndex];
//
//     if (!attackTable[index]) {
//       attackTable[index] = attack;
//     } else if (attackTable[index] !== attack) {
//       magic = MagicUtil.randomMagic();
//       blockerIndex = 0;
//       attackTable = new Array(ATTACK_TABLE_SIZE);
//     }
//   }
//   return [magic, attackTable];
// }
