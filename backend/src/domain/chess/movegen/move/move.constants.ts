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

export const MOVE_SPECIAL_0_FLAG = 0b0001;
export const MOVE_SPECIAL_1_FLAG = 0b0010;
export const MOVE_CAPTURE_FLAG = 0b0100;
export const MOVE_PROMOTION_FLAG = 0b1000;

export const MOVE_FLAGS = {
  Quiet: 0,
  DoublePawnPush: 1,
  KingCastle: 2,
  QueenCastle: 3,
  Capture: 4,
  EnPassantCapture: 5,
  KnightPromotion: 8,
  BishopPromotion: 9,
  RookPromotion: 10,
  QueenPromotion: 11,
  KnightPromotionCapture: 12,
  BishopPromotionCapture: 13,
  RookPromotionCapture: 14,
  QueenPromotionCapture: 15,
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

export const KING_SIDE_CASTLING_CHECK_MASK = 0b01110000n;
export const KING_SIDE_CASTLING_OCCUPANCY_MASK = 0b01100000n;
export const QUEEN_SIDE_CASTLING_CHECK_MASK = 0b00011100n;
export const QUEEN_SIDE_CASTLING_OCCUPANCY_MASK = 0b00001110n;
