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
import {
  BOARD_SIZE,
  FULL_BOARD_MASK,
} from "@/domain/chess/board/board.constants.js";
import {
  isOnSameDiagonal,
  isOnSameFile,
  isOnSameRank,
  toFile,
  toRank,
  toSquare,
} from "@/domain/chess/utils/square.utils.js";
import { Bitboard, Square } from "@/domain/chess/board/types.chess.js";
import { Direction } from "@/domain/chess/movegen/move/move.directions.js";
import { walkRay } from "@/domain/chess/movegen/attack/attack.rays.js";

import { COORD_SQUARE_MAP } from "#/fixtures/chess/square.fixtures.js";
import { Board } from "@/domain/chess/board/board.chess.js";
import { FENS } from "@/domain/chess/fen/fen.constants.js";
import {
  printBitboard,
  printChessBoard,
} from "@/domain/chess/debug/printer.chess.js";
import { getFrom, getTo } from "@/domain/chess/movegen/move/move.chess.js";
import { decodeMove } from "@/domain/chess/movegen/move/move.debug.js";
import { generateLegalMoves } from "@/domain/chess/movegen/move/move.generator.js";
import { makeMove } from "@/domain/chess/movegen/move/move.make.js";
import {
  queryPinnedPieces,
  queryPinnedRays,
} from "@/domain/chess/movegen/attack/attack.queries.js";
import { perft } from "@/domain/chess/debug/perft.chess.js";

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

export const RAYS = Array.from(
  { length: BOARD_SIZE },
  () => new Array<Bitboard>(BOARD_SIZE),
);
function calcPinnedRay(kingSquare: Square, attackingSquare: Square): bigint {
  if (kingSquare === attackingSquare) return FULL_BOARD_MASK;
  const onSameFile = isOnSameFile(kingSquare, attackingSquare);
  const onSameRank = isOnSameRank(kingSquare, attackingSquare);
  const onSameDiagonal = isOnSameDiagonal(kingSquare, attackingSquare);
  if (!onSameFile && !onSameRank && !onSameDiagonal) return FULL_BOARD_MASK;

  const isKingSquareLess = kingSquare < attackingSquare;
  const isLowerRank = toRank(kingSquare) > toRank(attackingSquare);
  const isLowerFile = toFile(kingSquare) > toFile(attackingSquare);
  let direction: Direction;

  if (onSameFile) {
    direction = isKingSquareLess ? "N" : "S";
  } else if (onSameRank) {
    direction = isKingSquareLess ? "E" : "W";
  } else if (onSameDiagonal) {
    if (isLowerRank) {
      direction = isLowerFile ? "SW" : "SE";
    } else {
      direction = isLowerFile ? "NW" : "NE";
    }
  }
  return walkRay(kingSquare, direction!, 1n << BigInt(attackingSquare));
}
for (let i = 0; i < 64; i++) {
  for (let j = 0; j < 64; j++) {
    RAYS[i]![j] = calcPinnedRay(toSquare(i), toSquare(j));
  }
}
// printBitboard(RAYS[0]![8]!);
// let pin = "3r4/b5q1/3B4/2N1P3/q1BK1P1r/2PPP3/8/bP1q2q1 w - - 0 1";
let pin = "3r4/8/8/8/3P4/8/3K4/8 w - - 0 1";
const board = new Board(pin);
//
// // // printBitboard(PINNED_RAYS[COORD_SQUARE_MAP.A1][COORD_SQUARE_MAP.A8]);
// printChessBoard(board);
let pinnedPieces = queryPinnedPieces(board, board.activeOccupancy);
let pinnedRays = queryPinnedRays(board, board.occupancy & ~pinnedPieces);
printChessBoard(board);
// printChessBoard(board);
// printBitboard(pinnedPieces);
// printBitboard(board.occupancy & ~pinnedPieces);
// printBitboard(pinnedPieces);
// printBitboard(pinnedRays);
// printBitboard(pinnedPieces);
// // printBitboard(board.getPawns(board.activeColour) & ~pinnedPieces);
// printBitboard(
//   ORTHOGONAL_TABLES.MASKS[board.getKingSquare(board.activeColour)]! &
//     board.occupancy &
//     ~pinnedPieces,
// );

// function getPinnedRay(board: Board, pinnedPiece: Square): void {
//   printBitboard(
//     PINNED_RAYS[board.getKingSquare(board.activeColour)]![pinnedPiece]!,
//   );
// }

// while (pinnedPieces !== 0n) {
//   const idx = getLSBIndex(pinnedPieces)!;
//   getPinnedRay(board, toSquare(idx));
//   break;
//   // console.log(`${pieceToString(board.pieceAt(idx))} at ${squareToCoord(idx)}`);
//   // pinnedPieces = clearLSB(pinnedPieces);
// }
// printBitboard(
//   generateAttacksOnSquare(
//     board,
//     COORD_SQUARE_MAP.D4,
//     getEnemyColour(board.activeColour),
//     pinnedPieces,
//   ),
// );
// //
// printBitboard(queryPinnedPieces(board));

run();

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
