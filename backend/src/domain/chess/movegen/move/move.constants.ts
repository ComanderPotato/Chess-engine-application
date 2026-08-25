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
