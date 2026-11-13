import { Board } from "@/domain/chess/board/board.chess.js";
import { perft } from "@/domain/chess/debug/perft.chess.js";
import { FENS } from "@/domain/chess/fen/fen.constants.js";
import { beforeEach, describe, expect, it } from "vitest";

describe("benchmark.perft", () => {
  let board: Board;
  describe(FENS.START, () => {
    beforeEach(() => {
      board = new Board(FENS.START);
    });
    it.each([
      {
        depth: 1,
        nodes: 20,
      },
      {
        depth: 2,
        nodes: 400,
      },
      {
        depth: 3,
        nodes: 8902,
      },
      {
        depth: 4,
        nodes: 197281,
      },
      {
        depth: 5,
        nodes: 4865609,
      },
    ])("depth $depth", ({ depth, nodes }) => {
      const result = perft(board, depth, false);
      expect(result.nodes).toBe(nodes);
    });
  });
  describe.only(FENS.KIWIPETE, () => {
    beforeEach(() => {
      board = new Board(FENS.KIWIPETE);
    });
    it.each([
      {
        depth: 1,
        nodes: 48,
      },
      {
        depth: 2,
        nodes: 2039,
      },
      {
        depth: 3,
        nodes: 97862,
      },
      {
        depth: 4,
        nodes: 4085603,
      },
      {
        depth: 5,
        nodes: 193690960,
      },
    ])("depth $depth", ({ depth, nodes }) => {
      const result = perft(board, depth, false);
      expect(result.nodes).toBe(nodes);
    });
  });
  describe(FENS.POSITION_3, () => {
    beforeEach(() => {
      board = new Board(FENS.POSITION_3);
    });
    it.each([
      {
        depth: 1,
        nodes: 14,
      },
      {
        depth: 2,
        nodes: 191,
      },
      {
        depth: 3,
        nodes: 2812,
      },
      {
        depth: 4,
        nodes: 43238,
      },
      {
        depth: 5,
        nodes: 674624,
      },
    ])("depth $depth", ({ depth, nodes }) => {
      const result = perft(board, depth, false);
      expect(result.nodes).toBe(nodes);
    });
  });
  describe(FENS.POSITION_4, () => {
    beforeEach(() => {
      board = new Board(FENS.POSITION_4);
    });
    it.each([
      {
        depth: 1,
        nodes: 6,
      },
      {
        depth: 2,
        nodes: 264,
      },
      {
        depth: 3,
        nodes: 9467,
      },
      {
        depth: 4,
        nodes: 422333,
      },
      {
        depth: 5,
        nodes: 15833292,
      },
    ])("depth $depth", ({ depth, nodes }) => {
      const result = perft(board, depth, false);
      expect(result.nodes).toBe(nodes);
    });
  });
  describe(FENS.POSITION_5, () => {
    beforeEach(() => {
      board = new Board(FENS.POSITION_5);
    });
    it.each([
      {
        depth: 1,
        nodes: 44,
      },
      {
        depth: 2,
        nodes: 1486,
      },
      {
        depth: 3,
        nodes: 62379,
      },
      {
        depth: 4,
        nodes: 2103487,
      },
      {
        depth: 5,
        nodes: 89941194,
      },
    ])("depth $depth", ({ depth, nodes }) => {
      const result = perft(board, depth, false);
      expect(result.nodes).toBe(nodes);
    });
  });
  describe(FENS.POSITION_6, () => {
    beforeEach(() => {
      board = new Board(FENS.POSITION_6);
    });
    it.each([
      {
        depth: 1,
        nodes: 46,
      },
      {
        depth: 2,
        nodes: 2079,
      },
      {
        depth: 3,
        nodes: 89890,
      },
      {
        depth: 4,
        nodes: 3894594,
      },
      {
        depth: 5,
        nodes: 164075551,
      },
    ])("depth $depth", ({ depth, nodes }) => {
      const result = perft(board, depth, false);
      expect(result.nodes).toBe(nodes);
    });
  });
});
