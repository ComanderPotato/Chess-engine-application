import { IGame, GameModel } from "models/Game.model";
import { Types } from "mongoose";
export async function createGame(overrides: Partial<IGame> = {}) {
  return GameModel.create({
    whitePlayer: new Types.ObjectId(),
    blackPlayer: new Types.ObjectId(),
    ...overrides,
  });
}
