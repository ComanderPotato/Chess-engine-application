export const MOVE_FROM_BITS = 6;
export const MOVE_TO_BITS = 6;
export const MOVE_FLAG_BITS = 5;

export const MOVE_FROM_SHIFT = 0;
export const MOVE_TO_SHIFT = MOVE_FROM_SHIFT + MOVE_FROM_BITS;
export const MOVE_FLAG_SHIFT = MOVE_TO_SHIFT + MOVE_TO_BITS;

export const MOVE_FROM_MASK = (1 << MOVE_FROM_BITS) - 1;
export const MOVE_TO_MASK = MOVE_FROM_MASK << MOVE_TO_SHIFT;
export const MOVE_FLAG_MASK = ((1 << MOVE_FLAG_BITS) - 1) << MOVE_FLAG_SHIFT;
export const MOVE_MASK = (1 << (MOVE_FLAG_SHIFT + MOVE_FLAG_BITS)) - 1;

export const MOVE_FLAGS = {
  Quiet: 0,
  DoublePawnPush: 1,
  KingCastle: 2,
  QueenCastle: 3,
  Capture: 4,
  EnPassantCapture: 5,
  KnightPromotion: 6,
  BishopPromotion: 7,
  RookPromotion: 8,
  QueenPromotion: 9,
  KnightPromotionCapture: 10,
  BishopPromotionCapture: 11,
  RookPromotionCapture: 12,
  QueenPromotionCapture: 13,
  Check: 14, // Maybe don't need
} as const;

export const PROMOTION_FLAGS = [
  MOVE_FLAGS.KnightPromotion,
  MOVE_FLAGS.BishopPromotion,
  MOVE_FLAGS.RookPromotion,
  MOVE_FLAGS.QueenPromotion,
] as const;

export const PROMOTION_CAPTURE_FLAGS = [
  MOVE_FLAGS.KnightPromotionCapture,
  MOVE_FLAGS.BishopPromotionCapture,
  MOVE_FLAGS.RookPromotionCapture,
  MOVE_FLAGS.QueenPromotionCapture,
] as const;

export type MoveFlag = (typeof MOVE_FLAGS)[keyof typeof MOVE_FLAGS];
