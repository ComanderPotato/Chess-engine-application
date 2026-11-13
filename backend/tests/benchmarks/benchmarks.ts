import { FENS } from "@/domain/chess/fen/fen.constants.js";

export const BENCHMARKS = {
  // [FENS.START]: {
  //   fen: FENS.START,
  //   depths: {
  //     1: {
  //       expected: 20,
  //     },
  //     2: {
  //       expected: 400,
  //     },
  //     3: {
  //       expected: 8902,
  //     },
  //     4: {
  //       expected: 197281,
  //     },
  //     5: {
  //       expected: 4865609,
  //     },
  //   },
  // },
  // [FENS.KIWIPETE]: {
  //   fen: FENS.KIWIPETE,
  //   depths: {
  //     1: {
  //       expected: 48,
  //     },
  //     2: {
  //       expected: 2039,
  //     },
  //     3: {
  //       expected: 97862,
  //     },
  //     4: {
  //       expected: 4085603,
  //     },
  //     5: {
  //       expected: 193690690,
  //     },
  //   },
  // },
  [FENS.POSITION_3]: {
    fen: FENS.POSITION_3,
    depths: {
      1: {
        expected: 14,
      },
      2: {
        expected: 191,
      },
      3: {
        expected: 2812,
      },
      4: {
        expected: 43238,
      },
      5: {
        expected: 674624,
      },
    },
  },
  [FENS.POSITION_4]: {
    fen: FENS.POSITION_4,
    depths: {
      1: {
        expected: 6,
      },
      2: {
        expected: 264,
      },
      3: {
        expected: 9467,
      },
      4: {
        expected: 422333,
      },
      5: {
        expected: 15833292,
      },
    },
  },
  [FENS.POSITION_5]: {
    fen: FENS.POSITION_5,
    depths: {
      1: {
        expected: 44,
      },
      2: {
        expected: 1486,
      },
      3: {
        expected: 62379,
      },
      4: {
        expected: 2103487,
      },
      5: {
        expected: 89941194,
      },
    },
  },
  [FENS.POSITION_6]: {
    fen: FENS.POSITION_6,
    depths: {
      1: {
        expected: 46,
      },
      2: {
        expected: 2079,
      },
      3: {
        expected: 89890,
      },
      4: {
        expected: 3894594,
      },
      5: {
        expected: 164075551,
      },
    },
  },
};
