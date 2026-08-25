import { BOARD_SIZE } from "@/domain/chess/board/board.constants.js";
import { Bitboard } from "@/domain/chess/board/types.chess.js";
import { isBitSet64 } from "@/domain/chess/utils/bit.utils.js";

// Generates an array containing relevant blocker squares of a given mask.
export function getRelevantBlockerSquares(mask: Bitboard): number[] {
  const relevantBitIndicies: number[] = [];
  for (let bit = 0; bit < BOARD_SIZE; bit++) {
    if (isBitSet64(mask, bit)) {
      relevantBitIndicies.push(bit);
    }
  }
  return relevantBitIndicies;
}

// Given an array containing relevant bits it computes every
// blocker configuration that can be made from those bits.
// The total amount of blocker configurations is 2^relevantBits,
// i.e., a pawns forward movement at the starting rank, would have
// 2^2 blocker configurations, so four in total.
//
// Each index in blockerConfigs should have a unique configuration of
// set bits.
export function generateBlockerConfigs(relevantBits: number[]) {
  const bitMasks = relevantBits.map((bit) => 1n << BigInt(bit));
  const size = 1 << relevantBits.length; // 2 ** relevantBits.length
  const blockerConfigs: Bitboard[] = new Array(size);

  for (let blockerIndex = 0; blockerIndex < size; blockerIndex++) {
    let blocker = 0n;
    let index = blockerIndex;
    for (let i = 0; i < bitMasks.length && index > 0; i++) {
      if ((index & 1) !== 0) {
        blocker |= bitMasks[i]!;
      }
      index >>= 1;
    }
    blockerConfigs[blockerIndex] = blocker;
  }
  return blockerConfigs;
}
