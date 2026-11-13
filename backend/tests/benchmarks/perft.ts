import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { Move } from "@/domain/chess/movegen/move/move.types.js";
import {
  coordToSquare,
  squareToCoord,
} from "@/domain/chess/utils/coord.utils.js";
import { pieceToString } from "@/domain/chess/piece/piece.format.js";
import { getEnemyColour } from "@/domain/chess/piece/piece.chess.js";
import { Timer } from "@/domain/chess/debug/timer.debug.js";
import { BOARD_SIZE } from "@/domain/chess/board/board.constants.js";
import { Bitboard } from "@/domain/chess/board/types.chess.js";

import { Board } from "@/domain/chess/board/board.chess.js";
import { FENS } from "@/domain/chess/fen/fen.constants.js";
import {
  printBitboard,
  printChessBoard,
} from "@/domain/chess/debug/printer.chess.js";
import {
  createMove,
  getFrom,
  getTo,
} from "@/domain/chess/movegen/move/move.chess.js";
import { decodeMove } from "@/domain/chess/movegen/move/move.debug.js";
import {
  generateLegalMoves,
  generatePawnMoves,
  generatePseudoLegalMoves,
} from "@/domain/chess/movegen/move/move.generator.js";
import { makeMove, unmakeMove } from "@/domain/chess/movegen/move/move.make.js";
import { perft } from "@/domain/chess/debug/perft.chess.js";
import { getMoveCache } from "@/domain/chess/movegen/move/move.cache.js";
import { AND, NOT, pieceToIndex } from "@/domain/chess/utils/bitboard.utils.js";
import { MOVE_FLAGS } from "@/domain/chess/movegen/move/move.constants.js";
import { filterEnpassant } from "@/domain/chess/movegen/attack/attack.queries.js";
import { BENCHMARKS } from "./benchmarks.js";
import { PIECE_TYPES } from "@/domain/chess/piece/piece.constants.js";
import { minmax } from "@/domain/chess/engine/minmax.chess.js";

function runPerftParams(params: string[]) {
  const fen = params.slice(0, 6).join(" ");
  const depth = Number(params.at(-1));
  const board = new Board(fen);
  printChessBoard(board);
  const start = performance.now();
  console.log(`Fen: ${board.toFen()}`);
  console.log(`go perft ${depth}`);
  const result = perft(board, depth);
  console.log(result);
  const end = performance.now();

  console.log(`Elapsed: ${(end - start).toFixed(2)} ms`);
  console.log(Timer.timers);
  Timer.timers.forEach((timer) => timer.printElapsedTime());
}
function runPerftBoard(board: Board, depth: number) {
  printChessBoard(board);

  const start = performance.now();
  console.log(`Fen: ${board.toFen()}`);
  console.log(`go perft ${depth}`);
  const result = perft(board, depth);
  // const a = generateLegalMoves(board);
  console.log(result);
  const end = performance.now();

  console.log(`Elapsed: ${(end - start).toFixed(2)} ms`);
  Timer.timers.forEach((timer) => timer.printElapsedTime());
  Timer.resetAll();
}
console.clear();

const params = process.argv.slice(2);
async function vsDumbFuckingBot(): Promise<void> {
  const rl = readline.createInterface({ input, output });
  let isDueling = true;
  while (isDueling) {
    const move = (await rl.question("")).split(" ");
  }
}
function positionFen(fen: string): void {}
async function run() {
  const rl = readline.createInterface({ input, output });
  const board = new Board(FENS.EN_PASSANT);

  let isRunning = true;
  let moves: Move[] | null = null;

  while (isRunning) {
    const query = (await rl.question("")).split(" ");
    const command = query[0]!;
    switch (command) {
      case "bot":
        console.clear();
        if (!moves) moves = generateLegalMoves(board);
        const randomMove = moves[Math.floor(Math.random() * moves.length)]!;
        console.log(decodeMove(board, randomMove));
        makeMove(board, randomMove);
        console.log(board.activeColour);
        printChessBoard(board);
        moves = null;
        break;
      case "fen":
        board.loadFen(query.slice(1).join(" "));
        moves = null;
        break;
      case "unmake":
        unmakeMove(board);
        break;
      case "moves":
        if (!moves) moves = generateLegalMoves(board);

        console.log(
          moves.map(
            (move) =>
              `${squareToCoord(getFrom(move))}${squareToCoord(getTo(move))}`,
          ),
        );
        break;
      case "move":
        const move = query.slice(1).join(" ");
        const from = coordToSquare(move.slice(0, 2));
        const to = coordToSquare(move.slice(2));
        if (!moves) moves = generateLegalMoves(board);
        for (const move of moves) {
          if (getFrom(move) === from && getTo(move) === to)
            makeMove(board, move);
        }
        moves = null;
        break;
      case "perft":
        runPerftBoard(board, Number(query.slice(1)[0]));
        break;
      case "display":
        printChessBoard(board);
        console.log(`Fen: ${board.toFen()}`);
        break;
      case "squares":
        const p = board._pieceAtSquare.reverse().map((s) => pieceToString(s));
        console.log(p);
        for (let i = 0; i < 64; i += 8) {
          // console.log(i);
          console.log(
            p
              .slice(i, i + 8)
              .join(" ")
              .padStart(100, " ")
              .padEnd(100, " "),
          );
        }
        break;
      case "load":
        const fen = query.slice(1)[0]!;
        board.loadFen(FENS[fen]!);
        break;
      case "colour":
        board.activeColour = getEnemyColour(board.activeColour);
        break;
      case "clear":
        console.clear();
        break;
      case "close":
        isRunning = false;
        break;
      default:
        console.log(`Unknown command: '${command}'.`);
    }
  }
  rl.close();
}

function bitboardToBigint(bb: Bitboard) {
  return BigInt(bb[0] >>> 0) | (BigInt(bb[1] >>> 0) << 32n);
}
function profile() {
  const board = new Board(FENS.START);

  const depth = 5;
  const timer = new Timer("Balls");
  timer.startTimer();
  const result = perft(board, depth);
  console.log(result);
  timer.stopTimer();
  Timer.timers.forEach((timer) => timer.printElapsedTime());
}
// const board = new Board(FENS.KIWIPETE);
// console.log(minmax(board, 3));
// profile();

// const board = new Board(
//   "r3k2r/p1ppqpb1/bn2pnp1/3PN3/Pp2P3/2N2Q1p/1PPBBPPP/R3K2R b KQkq a3 0 1",
// );

function benchmark(): void {
  const board = new Board();
  for (const name of Object.keys(BENCHMARKS)) {
    console.log(process.memoryUsage());
    const suite = BENCHMARKS[name]!;
    for (const depth of Object.keys(suite.depths)) {
      board.loadFen(suite.fen);
      if (depth === 5) continue;
      // const board = new Board(suite.fen);
      const results = perft(board, depth, false);
      if (results.nodes === suite.depths[depth].expected) {
        console.log(`${suite.fen} at depth ${depth} works`);
      } else {
        console.log(`${suite.fen} at depth ${depth} doesnt work`);
      }
    }
  }
}
run();
// profile();
// run();
// const board = new Board("8/2p5/3p4/KP4k1/5pP1/7r/4P3/6R1 b - g3 0 3");

// // for (const move of generateLegalMoves(board)) {
// //   console.log(decodeMove(board, move));
// // }
// printChessBoard(board);
// const cache = getMoveCache(board);
// printBitboard(cache.enPassantBoard);
// run();
// const board = new Board(FENS.CHECK);
// const cache = getMoveCache(board);
// run();
// benchmark();

// const move1 = createMove(
//   COORD_SQUARE_MAP.B2,
//   COORD_SQUARE_MAP.A1,
//   MOVE_FLAGS.QueenPromotionCapture,
// );
//
// makeMove(board, move1);
// const move2 = createMove(
//   COORD_SQUARE_MAP.D1,
//   COORD_SQUARE_MAP.C1,
//   MOVE_FLAGS.Quiet,
// );
// //
// makeMove(board, move2);
// console.log(board.toFen());
// const move3 = createMove(
//   COORD_SQUARE_MAP.A3,
//   COORD_SQUARE_MAP.C1,
//   MOVE_FLAGS.Quiet,
// );
//
// makeMove(board, move3);
// printChessBoard(board);
// console.log(board.toFen());
// const result = perft(board, 1);
// console.log(result);
// run();
// benchmark();
// const board = new Board(
//   "r4rk1/1pp2ppp/p1np1n2/2b3B1/2B1P1b1/P1NP2q1/1PP1QP1P/R4RK1 w - - 0 12",
// );
// const cache = getMoveCache(board);
// const moves = generateLegalMoves(board);
// printChessBoard(board);
// for (const move of moves) {
//   console.log(decodeMove(board, move));
// }
// run();
// const board = new Board(FENS.POSITION_6);
// const result = perft(board, 5, true);
// console.log(result);
// const board = new Board(
//   "rnN2k1r/pp2bppp/2p5/8/2B5/8/PPP1NnPP/RNBqK2R w KQ - 0 9",
// );
// printChessBoard(board);
// const moveCache = getMoveCache(board);
// printBitboard(moveCache.opponentAttackMask);

// printChessBoard(board);
// const moves = generateLegalMoves(board);
// for (const move of moves) {
//   console.log(decodeMove(board, move));
// }
// run();
// benchmark();
//
// run();
// const cache = getMoveCache(board);
// const moves = generatePseudoLegalMoves(board, cache);
// printBitboard(cache.captureMask);
// printBitboard(cache.pushMask);
// // printChessBoard(board);
// console.log(generateLegalMoves(board).length);
// printBitboard(cache.captureMask);
//
// console.log(board.toFen());
// console.log(perft(board, 1));
// const cache = getMoveCache(board);
//
// printBitboard(cache.captureMask);
// console.log(board.toFen());
// printChessBoard(board);

// GeneratePseudoLegalMoves
// activeOccupancy, enemyOccupancy, availableMovesSquares
// checksOnKing:
// 0 = all
// 1 = move king, capture or block (if its a sliding piece)
// capture = the set of attacksFromSquare(attackingPiece) and activePieces
// block = the set of active moves and the attacking ray.
// 2 = move king
//
//pins can only moves along the pinned ray,
// I need to calculate pinned pieces, and the rays, and move along them
// queen, bishop pawn (attack) diagonal ray
// queen, rook, pawn (push) orthogonal ray
