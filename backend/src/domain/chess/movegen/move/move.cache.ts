import { Square } from "../../board/types.chess.js";
import { EnemyBitboards } from "../attack/attack.queries.js";
import { Move } from "./move.types.js";

export interface MoveCache {
  kingSquare: Square;
  numCheckers: number;
  attackersOnKing: number;
  enemyAttacks: EnemyBitboards;
  moves: Move[];
}

const cacheStack: MoveCache[] = [];
// let currentCache: MoveCache | null = null;
// let previousCache: MoveCache | null = null;

function pushCache(moveCache: MoveCache): void {
  cacheStack.push(moveCache);
}
function popCache(): void {
  cacheStack.pop();
}
function getCache(): MoveCache | undefined {
  return cacheStack.at(-1);
}
