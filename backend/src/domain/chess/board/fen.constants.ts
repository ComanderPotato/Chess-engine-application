export const FENS = {
  /** Standard chess starting position */
  START: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",

  /** Completely empty board */
  EMPTY: "8/8/8/8/8/8/8/8 w - - 0 1",

  /** Single king */
  KING: "8/8/8/8/3K4/8/8/8 w - - 0 1",

  /** Single queen */
  QUEEN: "8/8/8/3Q4/8/8/8/8 w - - 0 1",

  /** Sliding piece blocker test */
  SLIDING_BLOCKERS: "8/8/3p4/2pRp3/3p4/8/8/8 w - - 0 1",

  KING_CHECKED_SLIDING: "3r4/8/8/3K4/8/8/8/8 w - - 0 1",

  /** Castling test */
  CASTLING: "r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1",

  /** En passant available (white can play exd6 e.p.) */
  EN_PASSANT: "8/8/8/3pP3/8/8/8/8 w - d6 0 1",

  /** Promotion test */
  PROMOTION: "8/P7/8/8/8/8/7p/8 w - - 0 1",

  /** Black in check */
  CHECK: "4k3/8/8/8/8/8/4R3/4K3 b - - 0 1",

  /** Double check */
  DOUBLE_CHECK: "4k3/8/8/8/8/5B2/4R3/4K3 b - - 0 1",

  /** Absolute pin */
  PIN: "4k3/8/8/8/8/4r3/4B3/4K3 w - - 0 1",

  /** Checkmate */
  CHECKMATE: "7k/6Q1/6K1/8/8/8/8/8 b - - 0 1",

  /** Stalemate */
  STALEMATE: "7k/5Q2/6K1/8/8/8/8/8 b - - 0 1",

  /** Famous move-generation validation position */
  KIWIPETE:
    "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",

  /** Typical middlegame */
  MIDDLEGAME:
    "r1bq1rk1/pppn1ppp/2pbpn2/3p4/3P4/2NBPN2/PPQ2PPP/R1B2RK1 w - - 0 8",
} as const;
